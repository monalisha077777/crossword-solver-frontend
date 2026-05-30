<script lang="ts">
  interface SolveAnswer {
    word: string;
    length?: number;
    score: number;
    frequency?: number;
    source: string;
    last_seen?: string;
    sample_clue?: string;
  }

  interface SolveResponse {
    answers?: SolveAnswer[];
    historical_answers?: SolveAnswer[];
    external_answers?: SolveAnswer[];
    external_source?: string;
    source?: string;
    used_fallback?: boolean;
    history?: {
      daily?: Array<Record<string, unknown>>;
      mini?: Array<Record<string, unknown>>;
    };
  }

  const LETTER_COUNTS = Array.from({ length: 13 }, (_, index) => index + 3);
  const API_URL = 'https://crossword-solver-api.mitomat.workers.dev';

  let clue = '';
  let pattern = '';
  let selectedLength: number | null = null;
  let loading = false;
  let historicalResults: SolveAnswer[] = [];
  let externalResults: SolveAnswer[] = [];
  let hasSearched = false;
  let error = '';
  let fallbackOnly = false;
  let archiveHitCount = 0;
  let externalSectionLabel = 'More possible answers';

  function sanitizePattern(value: string): string {
    return value.toUpperCase().replace(/[^A-Z?]/g, '').slice(0, 30);
  }

  function getEffectivePattern(): string {
    const cleaned = sanitizePattern(pattern);
    if (cleaned) {
      return cleaned;
    }
    if (selectedLength) {
      return '?'.repeat(selectedLength);
    }
    return '';
  }

  function syncPatternFromInput(value: string) {
    pattern = sanitizePattern(value);
    selectedLength = pattern ? pattern.length : null;
  }

  function toggleLength(length: number) {
    if (selectedLength === length) {
      selectedLength = null;
      if (/^\?+$/.test(pattern)) {
        pattern = '';
      }
      return;
    }

    selectedLength = length;
    pattern = '?'.repeat(length);
  }

  function normalizeResults(data: SolveResponse) {
    const historical = data.historical_answers || (data.source === 'internal' ? data.answers || [] : []);
    const external = data.external_answers || (data.source !== 'internal' ? data.answers || [] : []);

    historicalResults = historical;
    externalResults = historical.length > 0 ? external : external.filter(Boolean);
    fallbackOnly = historical.length === 0 && external.length > 0;
    archiveHitCount = (data.history?.daily?.length || 0) + (data.history?.mini?.length || 0);
    externalSectionLabel = data.external_source === 'datamuse'
      ? 'Word-match suggestions'
      : 'More possible answers';
  }

  async function handleSolve() {
    if (!clue.trim()) return;

    loading = true;
    error = '';
    hasSearched = true;
    historicalResults = [];
    externalResults = [];
    archiveHitCount = 0;

    try {
      const params = new URLSearchParams({ clue: clue.trim() });
      const effectivePattern = getEffectivePattern();
      if (effectivePattern) {
        params.set('pattern', effectivePattern);
      }

      const res = await fetch(`${API_URL}/solve?${params}`);
      if (!res.ok) throw new Error(`Solver returned ${res.status}`);
      const data: SolveResponse = await res.json();
      normalizeResults(data);
    } catch (e: any) {
      error = e.message || 'An error occurred while solving.';
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !loading) handleSolve();
  }

  function formatDate(d: string): string {
    if (!d) return '';
    try {
      return new Date(`${d}T12:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  }

  function getLengthLabel(answer: SolveAnswer): string {
    const value = answer.length || answer.word.length;
    return `${value} letter${value === 1 ? '' : 's'}`;
  }
</script>

<div class="solver-wrap">
  <div class="solver-head">
    <span class="solver-kicker">Archive-first search</span>
    <h1 class="solver-title">Crossword Solver</h1>
    <p class="solver-subtitle">
      Search your clue, add a pattern if you know some letters, or tap a letter count to narrow the field.
    </p>
  </div>

  <div class="solver-form">
    <div class="form-row">
      <div class="form-group form-group-clue">
        <label class="form-label" for="clue-input">Clue</label>
        <input
          id="clue-input"
          type="text"
          class="form-input"
          placeholder='e.g. "Man&apos;s name that, like Otto, is also an Italian number"'
          bind:value={clue}
          on:keydown={handleKeydown}
          disabled={loading}
        />
      </div>

      <div class="form-group form-group-pattern">
        <label class="form-label" for="pattern-input">
          Pattern <span class="form-hint">? = unknown</span>
        </label>
        <input
          id="pattern-input"
          type="text"
          class="form-input form-input-mono"
          placeholder="e.g. O??O"
          value={pattern}
          on:input={(event) => syncPatternFromInput((event.currentTarget as HTMLInputElement).value)}
          on:keydown={handleKeydown}
          disabled={loading}
          maxlength="30"
        />
      </div>

      <button type="button" class="btn btn-primary btn-solve" on:click={handleSolve} disabled={loading || !clue.trim()}>
        {#if loading}
          <span class="spinner"></span> Solving...
        {:else}
          Search
        {/if}
      </button>
    </div>

    <div class="length-filter">
      <span class="length-filter-label">Letter count</span>
      <div class="length-filter-list">
        {#each LETTER_COUNTS as count}
          <button
            type="button"
            class:selected={selectedLength === count}
            class="length-chip"
            on:click={() => toggleLength(count)}
            aria-pressed={selectedLength === count}
          >
            {count}
          </button>
        {/each}
      </div>
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
        <div>
          <h2 class="results-title">
            {#if historicalResults.length > 0}
              Historical archive matches
            {:else if externalResults.length > 0}
              Best available matches
            {:else}
              No answers found
            {/if}
          </h2>
          {#if archiveHitCount > 0}
            <p class="results-subtitle">{archiveHitCount} archive clue match{archiveHitCount === 1 ? '' : 'es'} checked for this result.</p>
          {/if}
        </div>

        {#if fallbackOnly}
          <span class="results-note">Showing best non-archive matches.</span>
        {/if}
      </div>

      {#if historicalResults.length > 0}
        <section class="result-section">
          <div class="section-head">
            <h3>Historical data</h3>
            <span>{historicalResults.length} answer{historicalResults.length === 1 ? '' : 's'}</span>
          </div>

          <div class="results-list">
            {#each historicalResults as answer, i}
              <article class="result-row primary" style="animation-delay:{i * 40}ms">
                <div class="result-main">
                  <span class="result-rank">#{i + 1}</span>
                  <div class="result-word-block">
                    <span class="result-word">{answer.word}</span>
                    <div class="result-tags">
                      <span class="result-tag archive-tag">Archive</span>
                      <span class="result-tag">{getLengthLabel(answer)}</span>
                    </div>
                  </div>
                </div>

                <div class="result-meta">
                  {#if answer.frequency}<span>{answer.frequency}x seen</span>{/if}
                  {#if answer.last_seen}<span>Last seen {formatDate(answer.last_seen)}</span>{/if}
                </div>

                {#if answer.sample_clue}
                  <p class="result-clue">{answer.sample_clue}</p>
                {/if}
              </article>
            {/each}
          </div>
        </section>
      {/if}

      {#if externalResults.length > 0}
        <section class="result-section secondary-section">
          <div class="section-head">
            <h3>{historicalResults.length > 0 ? externalSectionLabel : 'Possible answers'}</h3>
            <span>{externalResults.length} suggestion{externalResults.length === 1 ? '' : 's'}</span>
          </div>

          <div class="results-list compact">
            {#each externalResults as answer, i}
              <article class="result-row secondary" style="animation-delay:{i * 30}ms">
                <div class="result-main">
                  <span class="result-rank">{historicalResults.length > 0 ? `+${i + 1}` : `#${i + 1}`}</span>
                  <div class="result-word-block">
                    <span class="result-word">{answer.word}</span>
                    <div class="result-tags">
                      <span class="result-tag neutral-tag">External</span>
                      <span class="result-tag">{getLengthLabel(answer)}</span>
                    </div>
                  </div>
                </div>

                <div class="result-meta">
                  {#if answer.score}<span>Score {answer.score}</span>{/if}
                </div>
              </article>
            {/each}
          </div>
        </section>
      {/if}

      {#if historicalResults.length === 0 && externalResults.length === 0}
        <div class="no-results">
          <p>No matching answers found. Try changing the clue, adding known letters, or tapping a letter count.</p>
        </div>
      {/if}
    </div>
  {/if}

  <div class="solver-tips">
    <h3 class="tips-title">Tips for better results</h3>
    <div class="tips-grid">
      <div class="tip">
        <span class="tip-num">1</span>
        <div><strong>Try the full clue</strong><p>Exact clue text gives the archive the strongest chance to find a historical match.</p></div>
      </div>
      <div class="tip">
        <span class="tip-num">2</span>
        <div><strong>Use letter counts</strong><p>Tap `5`, `6`, `7` and so on to auto-fill a wildcard pattern with the right answer length.</p></div>
      </div>
      <div class="tip">
        <span class="tip-num">3</span>
        <div><strong>Archive stays first</strong><p>Stored crossword hits show first, and extra non-archive suggestions appear below them when available.</p></div>
      </div>
    </div>
  </div>
</div>

<style>
  .solver-wrap {
    max-width: 980px;
    margin: 0 auto;
    padding: 24px 0 48px;
  }

  .solver-head {
    text-align: center;
    margin-bottom: 32px;
  }

  .solver-kicker {
    display: inline-flex;
    margin-bottom: 10px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(26, 115, 232, 0.1);
    color: #0f5bd3;
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.7px;
    text-transform: uppercase;
  }

  .solver-title {
    font-size: clamp(2rem, 4vw, 3.1rem);
    font-weight: 800;
    letter-spacing: -1.6px;
    line-height: 0.98;
    color: var(--color-text);
    margin-bottom: 10px;
  }

  .solver-subtitle {
    max-width: 62ch;
    margin: 0 auto;
    color: var(--color-text-muted);
    font-size: 1rem;
    line-height: 1.75;
  }

  .solver-form {
    padding: 26px;
    border-radius: 28px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 251, 255, 0.98));
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 18px 48px rgba(15, 23, 42, 0.07);
    margin-bottom: 24px;
  }

  .form-row {
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) minmax(220px, 1fr) auto;
    gap: 12px;
    align-items: end;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .form-hint {
    font-weight: 500;
    text-transform: none;
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .form-input {
    min-height: 48px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 16px;
    color: var(--color-text);
    font-size: 0.94rem;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  }

  .form-input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-light);
    transform: translateY(-1px);
  }

  .form-input::placeholder {
    color: var(--color-text-muted);
  }

  .form-input-mono {
    font-family: var(--font-mono);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .btn-solve {
    min-height: 48px;
    border-radius: 16px;
    white-space: nowrap;
    padding: 12px 24px;
  }

  .length-filter {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(15, 23, 42, 0.08);
  }

  .length-filter-label {
    display: block;
    margin-bottom: 10px;
    color: var(--color-text-secondary);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }

  .length-filter-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .length-chip {
    min-width: 42px;
    height: 38px;
    border: 1px solid rgba(15, 23, 42, 0.09);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.96);
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 700;
    transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  }

  .length-chip:hover,
  .length-chip.selected {
    transform: translateY(-1px);
    border-color: var(--color-accent);
    background: var(--color-accent-light);
    color: var(--color-accent);
  }

  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: var(--color-error-light);
    border: 1px solid rgba(217, 48, 37, 0.15);
    border-radius: 18px;
    color: var(--color-error);
    font-size: 0.9rem;
    margin-bottom: 24px;
  }

  .results {
    display: grid;
    gap: 22px;
    margin-bottom: 40px;
  }

  .results-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .results-title {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .results-subtitle {
    margin-top: 6px;
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }

  .results-note {
    padding: 7px 12px;
    border-radius: 999px;
    background: rgba(232, 113, 10, 0.1);
    color: #b45309;
    font-size: 0.78rem;
    font-weight: 700;
  }

  .result-section {
    padding: 22px;
    border-radius: 28px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 251, 255, 0.98));
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
  }

  .secondary-section {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.96));
  }

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  .section-head h3 {
    font-size: 1.02rem;
    font-weight: 800;
  }

  .section-head span {
    color: var(--color-text-muted);
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .results-list {
    display: grid;
    gap: 10px;
  }

  .result-row {
    display: grid;
    gap: 10px;
    padding: 16px 18px;
    border-radius: 22px;
    border: 1px solid rgba(15, 23, 42, 0.07);
    background: rgba(255, 255, 255, 0.92);
    animation: fadeIn 0.3s ease backwards;
  }

  .result-row.primary {
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
  }

  .result-row.secondary {
    background: rgba(252, 252, 253, 0.95);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .result-main {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .result-rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    border-radius: 12px;
    background: rgba(15, 23, 42, 0.06);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 700;
  }

  .result-word-block {
    display: grid;
    gap: 7px;
  }

  .result-word {
    font-family: var(--font-mono);
    font-size: 1.24rem;
    font-weight: 800;
    color: var(--color-success);
    letter-spacing: 2px;
  }

  .result-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .result-tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.06);
    color: var(--color-text-secondary);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .archive-tag {
    background: rgba(26, 115, 232, 0.1);
    color: #0f5bd3;
  }

  .neutral-tag {
    background: rgba(107, 114, 128, 0.12);
    color: #4b5563;
  }

  .result-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    color: var(--color-text-muted);
    font-size: 0.82rem;
  }

  .result-clue {
    color: var(--color-text-secondary);
    font-size: 0.88rem;
    line-height: 1.65;
  }

  .no-results {
    text-align: center;
    padding: 40px 20px;
    color: var(--color-text-muted);
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 22px;
  }

  .solver-tips {
    padding-top: 28px;
    border-top: 1px solid rgba(15, 23, 42, 0.08);
  }

  .tips-title {
    font-size: 1.05rem;
    font-weight: 800;
    margin-bottom: 18px;
  }

  .tips-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .tip {
    display: flex;
    gap: 12px;
    padding: 18px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 20px;
  }

  .tip-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--color-accent-light);
    color: var(--color-accent);
    font-size: 0.8rem;
    font-weight: 800;
    flex-shrink: 0;
  }

  .tip strong {
    display: block;
    font-size: 0.88rem;
    margin-bottom: 4px;
  }

  .tip p {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    line-height: 1.6;
  }

  @media (max-width: 860px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .tips-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 560px) {
    .solver-form,
    .result-section {
      padding: 18px;
      border-radius: 22px;
    }

    .solver-title {
      font-size: 1.75rem;
    }
  }
</style>
