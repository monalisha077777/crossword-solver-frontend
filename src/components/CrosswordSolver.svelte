<script lang="ts">
  import { onMount } from 'svelte';

  interface SolveAnswer {
    word: string;
    score: number;
    frequency?: number;
    rating?: number;
    source: string;
    last_seen?: string;
    sample_clue?: string;
    daily_count?: number;
    mini_count?: number;
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
      if (pattern.trim()) {
        params.set('pattern', pattern.trim().toUpperCase());
      }

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
    if (e.key === 'Enter' && !loading) {
      handleSolve();
    }
  }

  function getSourceLabel(source: string): string {
    const labels: Record<string, string> = {
      internal: 'Archive Match',
      crosswordnexus: 'CrosswordNexus',
      datamuse: 'Datamuse',
    };
    return labels[source] || source;
  }

  function getSourceColor(source: string): string {
    const colors: Record<string, string> = {
      internal: '#6c5ce7',
      crosswordnexus: '#00cec9',
      datamuse: '#fdcb6e',
    };
    return colors[source] || '#a0a0b8';
  }

  function formatDate(dateStr: string): string {
    try {
      return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }
</script>

<div class="solver-container">
  <div class="solver-header">
    <h1 class="solver-title">Crossword Solver</h1>
    <p class="solver-subtitle">Enter a clue and optional letter pattern to find the answer</p>
  </div>

  <div class="solver-form">
    <div class="form-group">
      <label class="form-label" for="clue-input">Clue</label>
      <div class="input-wrapper">
        <input
          id="clue-input"
          type="text"
          class="form-input"
          placeholder="e.g. Cookie brand"
          bind:value={clue}
          on:keydown={handleKeydown}
          disabled={loading}
        />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="pattern-input">
        Pattern
        <span class="form-hint">Use ? for unknown letters</span>
      </label>
      <div class="input-wrapper">
        <input
          id="pattern-input"
          type="text"
          class="form-input form-input--mono"
          placeholder="e.g. O?E?"
          bind:value={pattern}
          on:keydown={handleKeydown}
          disabled={loading}
          maxlength="30"
        />
      </div>
    </div>

    <button class="btn btn-primary btn-solve" on:click={handleSolve} disabled={loading || !clue.trim()}>
      {#if loading}
        <span class="spinner"></span>
        Solving...
      {:else}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
        Solve
      {/if}
    </button>
  </div>

  {#if error}
    <div class="error-card">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="#ff6b6b" stroke-width="1.5"/>
        <path d="M10 6v5M10 13.5v1" stroke="#ff6b6b" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>{error}</span>
    </div>
  {/if}

  {#if hasSearched && !loading && !error}
    <div class="results-section">
      <div class="results-header">
        <h2 class="results-title">
          {results.length > 0 ? `${results.length} Answer${results.length !== 1 ? 's' : ''} Found` : 'No Answers Found'}
        </h2>
        {#if resultSource}
          <span class="results-source" style="color: {getSourceColor(resultSource)}">
            Source: {getSourceLabel(resultSource)}
            {#if usedFallback}
              <span class="fallback-badge">(fallback)</span>
            {/if}
          </span>
        {/if}
      </div>

      {#if results.length > 0}
        <div class="results-list">
          {#each results as answer, i}
            <div class="result-card" style="animation-delay: {i * 50}ms">
              <div class="result-rank">#{i + 1}</div>
              <div class="result-content">
                <div class="result-word">{answer.word}</div>
                <div class="result-meta">
                  {#if answer.frequency}
                    <span class="result-freq">
                      {answer.frequency}x in archive
                    </span>
                  {/if}
                  {#if answer.last_seen}
                    <span class="result-date">
                      Last seen: {formatDate(answer.last_seen)}
                    </span>
                  {/if}
                  {#if answer.sample_clue}
                    <span class="result-clue">
                      "{answer.sample_clue}"
                    </span>
                  {/if}
                </div>
              </div>
              <div class="result-score">
                <span class="score-badge" style="background: {getSourceColor(answer.source)}20; color: {getSourceColor(answer.source)}">
                  {getSourceLabel(answer.source)}
                </span>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-results">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#3a3a5a" stroke-width="1.5"/>
            <path d="M16 20h16M16 28h10" stroke="#3a3a5a" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p>No matching answers found. Try adjusting your clue or pattern.</p>
        </div>
      {/if}
    </div>
  {/if}

  <div class="solver-tips">
    <h3 class="tips-title">Tips for Better Results</h3>
    <div class="tips-grid">
      <div class="tip-card">
        <div class="tip-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/></svg>
        </div>
        <div class="tip-content">
          <strong>Be Specific</strong>
          <p>Enter the complete clue text for the most accurate results.</p>
        </div>
      </div>
      <div class="tip-card">
        <div class="tip-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4h14v12H3V4zm2 2v8h10V6H5z"/></svg>
        </div>
        <div class="tip-content">
          <strong>Use Patterns</strong>
          <p>Add a pattern like C??E to filter answers by letter count and known letters.</p>
        </div>
      </div>
      <div class="tip-card">
        <div class="tip-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2l2.5 5.5L18 8.5l-4 4 1 5.5-5-2.5L5 18l1-5.5-4-4 5.5-1L10 2z"/></svg>
        </div>
        <div class="tip-content">
          <strong>Multiple Sources</strong>
          <p>We search our archive, CrosswordNexus, and Datamuse for comprehensive results.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .solver-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 32px 0 48px;
  }

  .solver-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .solver-title {
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, var(--color-text), var(--color-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .solver-subtitle {
    color: var(--color-text-muted);
    font-size: 1.05rem;
  }

  .solver-form {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 16px;
    align-items: end;
    margin-bottom: 32px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 24px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .form-hint {
    font-weight: 400;
    text-transform: none;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    letter-spacing: 0;
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    font-size: 0.95rem;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-light);
  }

  .form-input::placeholder {
    color: var(--color-text-muted);
  }

  .form-input--mono {
    font-family: var(--font-mono);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .btn-solve {
    padding: 12px 28px;
    height: fit-content;
    white-space: nowrap;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: rgba(255, 107, 107, 0.08);
    border: 1px solid rgba(255, 107, 107, 0.2);
    border-radius: var(--radius-md);
    color: var(--color-error);
    font-size: 0.9rem;
    margin-bottom: 24px;
  }

  .results-section {
    margin-bottom: 48px;
  }

  .results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .results-title {
    font-size: 1.3rem;
    font-weight: 700;
  }

  .results-source {
    font-size: 0.85rem;
    font-weight: 500;
  }

  .fallback-badge {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .results-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .result-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
    animation: fadeIn 0.3s ease backwards;
  }

  .result-card:hover {
    border-color: var(--color-accent);
    background: var(--color-bg-card-hover);
  }

  .result-rank {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    min-width: 30px;
  }

  .result-content {
    flex: 1;
    min-width: 0;
  }

  .result-word {
    font-family: var(--font-mono);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--color-success);
    letter-spacing: 2px;
    margin-bottom: 4px;
  }

  .result-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }

  .result-clue {
    font-style: italic;
  }

  .score-badge {
    display: inline-flex;
    padding: 4px 10px;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .no-results {
    text-align: center;
    padding: 48px 24px;
    color: var(--color-text-muted);
  }

  .no-results p {
    margin-top: 16px;
    font-size: 0.95rem;
  }

  .solver-tips {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--color-border);
  }

  .tips-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .tips-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .tip-card {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: var(--color-bg-card);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .tip-icon {
    color: var(--color-accent);
    flex-shrink: 0;
  }

  .tip-content strong {
    display: block;
    font-size: 0.88rem;
    margin-bottom: 4px;
  }

  .tip-content p {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .solver-form {
      grid-template-columns: 1fr;
    }

    .solver-title {
      font-size: 2rem;
    }

    .tips-grid {
      grid-template-columns: 1fr;
    }

    .result-card {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 480px) {
    .solver-title {
      font-size: 1.5rem;
    }

    .solver-form {
      padding: 16px;
    }
  }
</style>
