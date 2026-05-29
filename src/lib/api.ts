// Backend API configuration
export const API_BASES = {
  nytDaily: 'https://crossword-archive-worker.mitomat.workers.dev',
  nytMini: 'https://nyt-mini-archive.nytsolver.workers.dev',
  solver: 'https://crossword-solver-api.mitomat.workers.dev',
  atlantic: 'https://atlantic-crossword-worker.atlantic-b07.workers.dev',
  guardianCryptic: 'https://guardian-cryptic-worker.cryptic-abb.workers.dev',
  guardianPrize: 'https://guardian-prize-worker.prize.workers.dev',
  guardianQuick: 'https://guardian-quick-worker.gurdianquick.workers.dev',
  guardianQuiptic: 'https://guardian-quiptic-worker.quiptic.workers.dev',
  guardianWeekend: 'https://guardian-weekend-worker.weekendapi.workers.dev',
  latimesDaily: 'https://latimes-daily-worker.latimes.workers.dev',
  latimesMini: 'https://latimes-mini-worker.latimesmini.workers.dev',
  usaTodayDaily: 'https://usa-today-daily-worker.everyman-5b4.workers.dev',
  usaTodayQuick: 'https://usa-today-quick-worker.everyman-5b4.workers.dev',
  wapoDaily: 'https://washington-post-daily-worker.gspeedy.workers.dev',
} as const;

export type ApiSource = keyof typeof API_BASES;

export interface CrosswordSource {
  slug: string;
  name: string;
  family: string;
  baseUrl: string;
  icon: string;
  description: string;
  path: string;
}

export const CROSSWORD_SOURCES: CrosswordSource[] = [
  {
    slug: 'nyt-daily',
    name: 'NYT Crossword',
    family: 'nyt',
    baseUrl: API_BASES.nytDaily,
    icon: '📰',
    description: 'The New York Times Daily Crossword — the gold standard of American crosswords',
    path: '/nyt-crossword-answer-today',
  },
  {
    slug: 'nyt-mini',
    name: 'NYT Mini Crossword',
    family: 'nyt',
    baseUrl: API_BASES.nytMini,
    icon: '🔲',
    description: 'A bite-sized 5x5 puzzle that packs a punch — perfect for a quick solve',
    path: '/nyt-mini-crossword-answer-today',
  },
  {
    slug: 'atlantic',
    name: 'Atlantic Crossword',
    family: 'atlantic',
    baseUrl: API_BASES.atlantic,
    icon: '🌊',
    description: 'The Atlantic\'s daily crossword with clever themes and smooth fill',
    path: '/atlantic-crossword-answer-today',
  },
  {
    slug: 'guardian-quick',
    name: 'Guardian Quick',
    family: 'guardian',
    baseUrl: API_BASES.guardianQuick,
    icon: '⚡',
    description: 'Quick and accessible British-style crossword from The Guardian',
    path: '/guardian-quick-crossword-answer-today',
  },
  {
    slug: 'guardian-cryptic',
    name: 'Guardian Cryptic',
    family: 'guardian',
    baseUrl: API_BASES.guardianCryptic,
    icon: '🔮',
    description: 'Brain-teasing cryptic clues from The Guardian\'s expert setters',
    path: '/guardian-cryptic-crossword-answer-today',
  },
  {
    slug: 'guardian-prize',
    name: 'Guardian Prize',
    family: 'guardian',
    baseUrl: API_BASES.guardianPrize,
    icon: '🏆',
    description: 'The Guardian\'s weekend prize crossword with challenging puzzles',
    path: '/guardian-prize-crossword-answer-today',
  },
  {
    slug: 'guardian-quiptic',
    name: 'Guardian Quiptic',
    family: 'guardian',
    baseUrl: API_BASES.guardianQuiptic,
    icon: '💡',
    description: 'An accessible entry point to cryptic crosswords from The Guardian',
    path: '/guardian-quiptic-crossword-answer-today',
  },
  {
    slug: 'guardian-weekend',
    name: 'Guardian Weekend',
    family: 'guardian',
    baseUrl: API_BASES.guardianWeekend,
    icon: '🎉',
    description: 'The Guardian\'s weekend crossword supplement for leisurely solving',
    path: '/guardian-weekend-crossword-answer-today',
  },
  {
    slug: 'latimes-daily',
    name: 'LA Times Daily',
    family: 'latimes',
    baseUrl: API_BASES.latimesDaily,
    icon: '🌴',
    description: 'The Los Angeles Times daily crossword — west coast flair meets classic cluing',
    path: '/la-times-crossword-answer-today',
  },
  {
    slug: 'latimes-mini',
    name: 'LA Times Mini',
    family: 'latimes',
    baseUrl: API_BASES.latimesMini,
    icon: '🌵',
    description: 'A compact mini crossword from the LA Times for a quick mental workout',
    path: '/la-times-mini-crossword-answer-today',
  },
  {
    slug: 'usa-today-daily',
    name: 'USA Today Daily',
    family: 'usatoday',
    baseUrl: API_BASES.usaTodayDaily,
    icon: '🇺🇸',
    description: 'USA Today\'s accessible daily crossword with pop culture flair',
    path: '/usa-today-crossword-answer-today',
  },
  {
    slug: 'usa-today-quick',
    name: 'USA Today Quick',
    family: 'usatoday',
    baseUrl: API_BASES.usaTodayQuick,
    icon: '⭐',
    description: 'A quick-hit mini crossword from USA Today for solvers on the go',
    path: '/usa-today-quick-crossword-answer-today',
  },
  {
    slug: 'wapo-daily',
    name: 'Washington Post Daily',
    family: 'wapo',
    baseUrl: API_BASES.wapoDaily,
    icon: '🏛️',
    description: 'The Washington Post\'s daily crossword with political wit and wordplay',
    path: '/washington-post-crossword-answer-today',
  },
];

// --- Fetch helpers ---

export interface PuzzleData {
  success: boolean;
  date?: string;
  formatted?: string;
  data?: {
    across: Record<string, { clue: string; answer: string }>;
    down: Record<string, { clue: string; answer: string }>;
  };
  clues?: ClueRow[];
  title?: string;
  constructor?: string;
  publication_date?: string;
}

export interface ClueRow {
  date: string;
  direction: string;
  number: string | number;
  clue: string;
  answer: string;
}

export interface SolveResult {
  success: boolean;
  clue: string;
  normalized_clue: string;
  pattern: string;
  source: string;
  used_fallback: boolean;
  answers: SolveAnswer[];
  history?: {
    daily: ClueRow[];
    mini: ClueRow[];
  };
  timestamp: string;
}

export interface SolveAnswer {
  word: string;
  score: number;
  frequency?: number;
  rating?: number;
  source: string;
  last_seen?: string;
  sample_clue?: string;
}

export interface MiniPuzzleData {
  success: boolean;
  date?: string;
  formatted?: string;
  data?: {
    across: Record<string, { clue: string; answer: string }>;
    down: Record<string, { clue: string; answer: string }>;
  };
  clues?: ClueRow[];
}

export interface MiniListResult {
  success: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  dates: string[];
}

/** Fetch latest puzzle from a standard archive worker */
export async function fetchLatestPuzzle(baseUrl: string): Promise<PuzzleData> {
  const res = await fetch(`${baseUrl}/api/puzzle/latest`);
  if (!res.ok) throw new Error(`Failed to fetch latest puzzle: ${res.status}`);
  return res.json();
}

/** Fetch puzzle by date from a standard archive worker */
export async function fetchPuzzleByDate(baseUrl: string, date: string): Promise<PuzzleData> {
  const res = await fetch(`${baseUrl}/api/puzzle/${date}`);
  if (!res.ok) throw new Error(`Failed to fetch puzzle for ${date}: ${res.status}`);
  return res.json();
}

/** Fetch clues by date */
export async function fetchCluesByDate(baseUrl: string, date: string): Promise<{ success: boolean; data: { results: ClueRow[] } }> {
  const res = await fetch(`${baseUrl}/api/clues/${date}`);
  if (!res.ok) throw new Error(`Failed to fetch clues: ${res.status}`);
  return res.json();
}

/** Search answers */
export async function searchAnswers(baseUrl: string, q: string, mode: 'exact' | 'contains' = 'exact'): Promise<{ success: boolean; data: { results: ClueRow[] } }> {
  const res = await fetch(`${baseUrl}/api/search/answer?q=${encodeURIComponent(q)}&mode=${mode}`);
  if (!res.ok) throw new Error(`Answer search failed: ${res.status}`);
  return res.json();
}

/** Search clues */
export async function searchClues(baseUrl: string, q: string, mode: 'exact' | 'contains' = 'contains'): Promise<{ success: boolean; data: { results: ClueRow[] } }> {
  const res = await fetch(`${baseUrl}/api/search/clue?q=${encodeURIComponent(q)}&mode=${mode}`);
  if (!res.ok) throw new Error(`Clue search failed: ${res.status}`);
  return res.json();
}

/** Solve via central solver */
export async function solveClue(clue: string, pattern?: string): Promise<SolveResult> {
  const params = new URLSearchParams({ clue });
  if (pattern) params.set('pattern', pattern);
  const res = await fetch(`${API_BASES.solver}/solve?${params}`);
  if (!res.ok) throw new Error(`Solver failed: ${res.status}`);
  return res.json();
}

/** Solve via archive worker's own solve endpoint */
export async function solveFromArchive(baseUrl: string, clue: string, pattern?: string): Promise<SolveResult> {
  const params = new URLSearchParams({ clue });
  if (pattern) params.set('pattern', pattern);
  const res = await fetch(`${baseUrl}/api/solve?${params}`);
  if (!res.ok) throw new Error(`Archive solver failed: ${res.status}`);
  return res.json();
}

/** Get related clues for an answer */
export async function getRelatedAnswers(baseUrl: string, answer: string): Promise<{ success: boolean; data: { results: ClueRow[] } }> {
  const res = await fetch(`${baseUrl}/api/related/answer?q=${encodeURIComponent(answer)}`);
  if (!res.ok) throw new Error(`Related answer lookup failed: ${res.status}`);
  return res.json();
}

// --- NYT Mini-specific helpers ---

/** Fetch latest NYT Mini puzzle */
export async function fetchLatestMiniPuzzle(): Promise<MiniPuzzleData> {
  const res = await fetch(`${API_BASES.nytMini}/today`);
  if (!res.ok) throw new Error(`Failed to fetch latest mini: ${res.status}`);
  return res.json();
}

/** Fetch NYT Mini by date */
export async function fetchMiniPuzzleByDate(date: string): Promise<MiniPuzzleData> {
  const res = await fetch(`${API_BASES.nytMini}/date?date=${date}`);
  if (!res.ok) throw new Error(`Failed to fetch mini for ${date}: ${res.status}`);
  return res.json();
}

/** List NYT Mini puzzle dates */
export async function listMiniPuzzles(page = 1, limit = 20): Promise<MiniListResult> {
  const res = await fetch(`${API_BASES.nytMini}/list?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to list mini puzzles: ${res.status}`);
  return res.json();
}

/** Solve via NYT Mini archive */
export async function solveMiniClue(clue: string, pattern?: string): Promise<SolveResult> {
  const params = new URLSearchParams({ clue });
  if (pattern) params.set('pattern', pattern);
  const res = await fetch(`${API_BASES.nytMini}/solve?${params}`);
  if (!res.ok) throw new Error(`Mini solver failed: ${res.status}`);
  return res.json();
}

/** Format a date for display */
export function formatDateDisplay(dateStr: string): string {
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/** Get today's date as YYYY-MM-DD */
export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}
