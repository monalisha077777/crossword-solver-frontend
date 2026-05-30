<script lang="ts">
  interface SolveAnswer {
    word: string;
    score: number;
    frequency?: number;
    source: string;
    last_seen?: string;
    sample_clue?: string;
  }

  let clue = '';
  let pattern = '';
  let loading = false;
  let results: SolveAnswer[] = [];
  let resultSource = '';
  let usedFallback = false;
  let hasSearched = false;
  let error = '';

  const API_URL = 'https://crossword-solver-api.mitomat.workers.dev';

  async function handleSolve() {
    if (!clue.trim()) return;
    loading = true;
    error = '';
    results = [];
    hasSearched = true;

    try {
      const params = new URLSearchParams({ clue: clue.trim() });
      if (pattern.trim()) params.set('pattern', pattern.trim().toUpperCase());
      const res = await fetch(`${API_URL}/solve?${params}`);
      if (!res.ok) throw new Error(`Solver returned ${res.status}`);
      const data = await res.json();
      results = data.answers || [];
      resultSource = data.source || '';
      usedFallback = data.used_fallback || false;
    } catch (e: any) {
      error = e.message || 'An error occurred while solving.';
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !loading) handleSolve();
  }

  function getSourceLabel(s: string): string {
    return { internal: 'Archive', crosswordnexus: 'CrosswordNexus', datamuse: 'Datamuse' }[s] || s;
  }

  function getSourceColor(s: string): string {
    return { internal: '#1a73e8', crosswordnexus: '#0d904f', datamuse: '#e8710a' }[s] || '#5f6368';
  }

  function formatDate(d: string): string {
    if (!d) return '';
    try {
      return new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return d; }
  }
</script>

<div class="solver-wrap">
  <div class="solver-head">
    <h1 class="solver-title">Crossword Solver</h1>
    <p class="solver-subtitle">Enter a clue and optional letter pattern to find the answer</p>
  </div>

  <div class="solver-form">
    <div class="form-row">
      <div class="form-group form-group-clue">
        <label class="form-label" for="clue-input">Clue</label>
        <input id="clue-input" type="text" class="form-input" placeholder='e.g. "Cookie brand"' bind:value={clue} on:keydown={handleKeydown} disabled={loading} />
      </div>
      <div class="form-group form-group-pattern">
        <label class="form-label" for="pattern-input">
          Pattern <span class="form-hint">? = unknown</span>
        </label>
        <input id="pattern-input" type="text" class="form-input form-input-mono" placeholder="e.g. O?E?" bind:value={pattern} on:keydown={handleKeydown} disabled={loading} maxlength="30" />
      </div>
      <button class="btn btn-primary btn-solve" on:click={handleSolve} disabled={loading || !clue.trim()}>
        {#if loading}
          <span class="spinner"></span> Solving...
        {:else}
          Solve
        {/if}
      </button>
    </div>
  </div>

  {#if error}
    <div class="error-banner">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#d93025" stroke-width="1.5"/><path d="M8 5v4M8 11v.5" stroke="#d93025" stroke-width="1.5" stroke-linecap="round"/></svg>
      {error}
    </div>
  {/if}

  {#if hasSearched && !loading && !error}
    <div class="results">
      <div class="results-header">
        <h2 class="results-title">{results.length > 0 ? `${results.length} Answer${results.length !== 1 ? 's' : ''} Found` : 'No Answers Found'}</h2>
        {#if resultSource}
          <span class="results-source" style="color:{getSourceColor(resultSource)}">
            Source: {getSourceLabel(resultSource)}
            {#if usedFallback}<span class="fallback-tag">(fallback)</span>{/if}
          </span>
        {/if}
      </div>

      {#if results.length > 0}
        <div class="results-list">
          {#each results as answer, i}
            <div class="result-row" style="animation-delay:{i * 40}ms">
              <span class="result-rank">#{i + 1}</span>
              <span class="result-word">{answer.word}</span>
              <span class="result-meta">
                {#if answer.frequency}<span class="meta-freq">{answer.frequency}x in archive</span>{/if}
                {#if answer.last_seen}<span class="meta-date">Last: {formatDate(answer.last_seen)}</span>{/if}
              </span>
              <span class="result-source-badge" style="background:{getSourceColor(answer.source)}15;color:{getSourceColor(answer.source)}">
                {getSourceLabel(answer.source)}
              </span>
              {#if answer.sample_clue}<span class="result-clue">"{answer.sample_clue}"</span>{/if}
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-results">
          <p>No matching answers found. Try adjusting your clue or pattern.</p>
        </div>
      {/if}
    </div>
  {/if}

  <div class="solver-tips">
    <h3 class="tips-title">Tips for Better Results</h3>
    <div class="tips-grid">
      <div class="tip">
        <span class="tip-num">1</span>
        <div><strong>Be Specific</strong><p>Enter the complete clue text for the most accurate results.</p></div>
      </div>
      <div class="tip">
        <span class="tip-num">2</span>
        <div><strong>Use Patterns</strong><p>Add a pattern like C??E to filter answers by known letters.</p></div>
      </div>
      <div class="tip">
        <span class="tip-num">3</span>
        <div><strong>Multiple Sources</strong><p>We search our archive, CrosswordNexus, and Datamuse.</p></div>
      </div>
    </div>
  </div>
</div>

<style>
  .solver-wrap { max-width: 800px; margin: 0 auto; padding: 24px 0 48px; }

  .solver-head { text-align: center; margin-bottom: 36px; }
  .solver-title {
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -1px;
    color: var(--color-text);
    margin-bottom: 8px;
  }
  .solver-subtitle { color: var(--color-text-muted); font-size: 1rem; }

  .solver-form {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: var(--shadow-sm);
  }

  .form-row {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-group-clue { flex: 2; }
  .form-group-pattern { flex: 1; }

  .form-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .form-hint {
    font-weight: 400;
    text-transform: none;
    font-size: 0.7rem;
    color: var(--color-text-muted);
  }

  .form-input {
    padding: 11px 14px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    font-size: 0.9rem;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .form-input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-light);
  }
  .form-input::placeholder { color: var(--color-text-muted); }
  .form-input-mono { font-family: var(--font-mono); letter-spacing: 2px; text-transform: uppercase; }

  .btn-solve { height: fit-content; white-space: nowrap; padding: 11px 24px; }

  .spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: var(--color-error-light);
    border: 1px solid rgba(217,48,37,0.15);
    border-radius: var(--radius-md);
    color: var(--color-error);
    font-size: 0.88rem;
    margin-bottom: 24px;
  }

  .results { margin-bottom: 40px; }

  .results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .results-title { font-size: 1.2rem; font-weight: 700; }
  .results-source { font-size: 0.82rem; font-weight: 500; }
  .fallback-tag { font-size: 0.72rem; opacity: 0.7; }

  .results-list { display: flex; flex-direction: column; gap: 6px; }

  .result-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: all 0.15s;
    animation: fadeIn 0.3s ease backwards;
    flex-wrap: wrap;
  }
  .result-row:hover { border-color: var(--color-accent); box-shadow: var(--shadow-sm); }

  .result-rank {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    min-width: 28px;
  }

  .result-word {
    font-family: var(--font-mono);
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-success);
    letter-spacing: 2px;
  }

  .result-meta {
    display: flex;
    gap: 12px;
    font-size: 0.78rem;
    color: var(--color-text-muted);
    flex: 1;
  }

  .result-source-badge {
    display: inline-flex;
    padding: 3px 10px;
    border-radius: var(--radius-full);
    font-size: 0.72rem;
    font-weight: 600;
  }

  .result-clue {
    width: 100%;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    font-style: italic;
    padding-left: 42px;
  }

  .no-results {
    text-align: center;
    padding: 40px 20px;
    color: var(--color-text-muted);
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .solver-tips {
    padding-top: 28px;
    border-top: 1px solid var(--color-border);
  }
  .tips-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 18px; }

  .tips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

  .tip {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }
  .tip-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--color-accent-light);
    color: var(--color-accent);
    font-size: 0.78rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .tip strong { display: block; font-size: 0.85rem; margin-bottom: 3px; }
  .tip p { font-size: 0.78rem; color: var(--color-text-muted); line-height: 1.5; }

  @media (max-width: 768px) {
    .form-row { flex-direction: column; }
    .solver-title { font-size: 1.7rem; }
    .tips-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 480px) {
    .solver-title { font-size: 1.4rem; }
    .solver-form { padding: 16px; }
  }
</style>
