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
  color: string;
  description: string;
  todayPath: string;
  archivePath: string;
}

export const CROSSWORD_SOURCES: CrosswordSource[] = [
  {
    slug: 'nyt-daily',
    name: 'NYT Crossword',
    family: 'nyt',
    baseUrl: API_BASES.nytDaily,
    color: '#1a73e8',
    description: 'The gold standard of American crosswords — challenging, clever, and iconic',
    todayPath: '/nyt-crossword-answer-today',
    archivePath: '/nyt-crossword-archive',
  },
  {
    slug: 'nyt-mini',
    name: 'NYT Mini Crossword',
    family: 'nyt-mini',
    baseUrl: API_BASES.nytMini,
    color: '#e8710a',
    description: 'A bite-sized 5x5 puzzle — perfect for a quick daily mental workout',
    todayPath: '/nyt-mini-crossword-answer-today',
    archivePath: '/nyt-mini-crossword-archive',
  },
  {
    slug: 'atlantic',
    name: 'Atlantic Crossword',
    family: 'atlantic',
    baseUrl: API_BASES.atlantic,
    color: '#e53935',
    description: 'Clever themes and smooth fill from The Atlantic\'s daily puzzle',
    todayPath: '/atlantic-crossword-answer-today',
    archivePath: '/atlantic-crossword-archive',
  },
  {
    slug: 'guardian-quick',
    name: 'Guardian Quick',
    family: 'guardian',
    baseUrl: API_BASES.guardianQuick,
    color: '#1a73e8',
    description: 'Quick and accessible British-style crossword from The Guardian',
    todayPath: '/guardian-quick-crossword-answer-today',
    archivePath: '/guardian-quick-crossword-archive',
  },
  {
    slug: 'guardian-cryptic',
    name: 'Guardian Cryptic',
    family: 'guardian',
    baseUrl: API_BASES.guardianCryptic,
    color: '#7b1fa2',
    description: 'Brain-teasing cryptic clues from The Guardian\'s expert setters',
    todayPath: '/guardian-cryptic-crossword-answer-today',
    archivePath: '/guardian-cryptic-crossword-archive',
  },
  {
    slug: 'guardian-prize',
    name: 'Guardian Prize',
    family: 'guardian',
    baseUrl: API_BASES.guardianPrize,
    color: '#c2185b',
    description: 'Weekend prize crossword with challenging puzzles from The Guardian',
    todayPath: '/guardian-prize-crossword-answer-today',
    archivePath: '/guardian-prize-crossword-archive',
  },
  {
    slug: 'guardian-quiptic',
    name: 'Guardian Quiptic',
    family: 'guardian',
    baseUrl: API_BASES.guardianQuiptic,
    color: '#00897b',
    description: 'An accessible entry point to cryptic crosswords from The Guardian',
    todayPath: '/guardian-quiptic-crossword-answer-today',
    archivePath: '/guardian-quiptic-crossword-archive',
  },
  {
    slug: 'guardian-weekend',
    name: 'Guardian Weekend',
    family: 'guardian',
    baseUrl: API_BASES.guardianWeekend,
    color: '#f57c00',
    description: 'The Guardian\'s weekend crossword supplement for leisurely solving',
    todayPath: '/guardian-weekend-crossword-answer-today',
    archivePath: '/guardian-weekend-crossword-archive',
  },
  {
    slug: 'latimes-daily',
    name: 'LA Times Daily',
    family: 'latimes',
    baseUrl: API_BASES.latimesDaily,
    color: '#00796b',
    description: 'West coast flair meets classic cluing in the LA Times daily crossword',
    todayPath: '/la-times-crossword-answer-today',
    archivePath: '/la-times-crossword-archive',
  },
  {
    slug: 'latimes-mini',
    name: 'LA Times Mini',
    family: 'latimes',
    baseUrl: API_BASES.latimesMini,
    color: '#26a69a',
    description: 'A compact mini crossword from the LA Times for a quick solve',
    todayPath: '/la-times-mini-crossword-answer-today',
    archivePath: '/la-times-mini-crossword-archive',
  },
  {
    slug: 'usa-today-daily',
    name: 'USA Today Daily',
    family: 'usatoday',
    baseUrl: API_BASES.usaTodayDaily,
    color: '#1565c0',
    description: 'Accessible daily crossword with pop culture flair from USA Today',
    todayPath: '/usa-today-crossword-answer-today',
    archivePath: '/usa-today-crossword-archive',
  },
  {
    slug: 'usa-today-quick',
    name: 'USA Today Quick',
    family: 'usatoday',
    baseUrl: API_BASES.usaTodayQuick,
    color: '#42a5f5',
    description: 'A quick-hit mini crossword from USA Today for solvers on the go',
    todayPath: '/usa-today-quick-crossword-answer-today',
    archivePath: '/usa-today-quick-crossword-archive',
  },
  {
    slug: 'wapo-daily',
    name: 'Washington Post Daily',
    family: 'wapo',
    baseUrl: API_BASES.wapoDaily,
    color: '#2e7d32',
    description: 'Political wit and wordplay in the Washington Post daily crossword',
    todayPath: '/washington-post-crossword-answer-today',
    archivePath: '/washington-post-crossword-archive',
  },
];

// --- Types for standard archive worker response ---

export interface StandardPuzzleResponse {
  success: boolean;
  data: {
    puzzle: {
      puzzle_id: number;
      date: string;
      formatted_date: string;
      title: string;
      author: string;
      editor: string;
      day_of_week: string;
      created_at: string;
    };
    clues: StandardClue[];
    across: StandardClue[];
    down: StandardClue[];
  };
  timestamp: string;
}

export interface StandardClue {
  clue_id: number;
  puzzle_id: number;
  number: number;
  direction: string;
  clue_text: string;
  answer: string;
}

// --- Types for NYT Mini response ---

export interface MiniPuzzleResponse {
  success: boolean;
  date: string;
  formatted?: string;
  data: {
    across: Record<string, { clue: string; answer: string }>;
    down: Record<string, { clue: string; answer: string }>;
  };
  clues: MiniClue[];
}

export interface MiniClue {
  direction: string;
  number: string;
  clue: string;
  answer: string;
}

// --- Types for solver ---

export interface SolveResult {
  success: boolean;
  clue: string;
  normalized_clue: string;
  pattern: string;
  source: string;
  used_fallback: boolean;
  answers: SolveAnswer[];
  history?: any;
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

// --- Normalized puzzle type for display ---

export interface NormalizedPuzzle {
  date: string;
  formattedDate: string;
  title: string;
  author: string;
  editor: string;
  dayOfWeek: string;
  across: { number: number; clue: string; answer: string }[];
  down: { number: number; clue: string; answer: string }[];
}

// --- Fetch helpers ---

/** Fetch latest puzzle from a standard archive worker and normalize */
export async function fetchLatestPuzzle(baseUrl: string): Promise<NormalizedPuzzle | null> {
  const res = await fetch(`${baseUrl}/api/puzzle/latest`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json: StandardPuzzleResponse = await res.json();
  if (!json.success || !json.data) return null;
  return normalizeStandardResponse(json);
}

/** Fetch puzzle by date from a standard archive worker */
export async function fetchPuzzleByDate(baseUrl: string, date: string): Promise<NormalizedPuzzle | null> {
  const res = await fetch(`${baseUrl}/api/puzzle/${date}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json: StandardPuzzleResponse = await res.json();
  if (!json.success || !json.data) return null;
  return normalizeStandardResponse(json);
}

/** Fetch latest NYT Mini puzzle and normalize */
export async function fetchLatestMiniPuzzle(): Promise<NormalizedPuzzle | null> {
  const res = await fetch(`${API_BASES.nytMini}/today`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json: MiniPuzzleResponse = await res.json();
  if (!json.success || !json.data) return null;
  return normalizeMiniResponse(json);
}

/** Fetch NYT Mini by date */
export async function fetchMiniPuzzleByDate(date: string): Promise<NormalizedPuzzle | null> {
  const res = await fetch(`${API_BASES.nytMini}/date?date=${date}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json: MiniPuzzleResponse = await res.json();
  if (!json.success || !json.data) return null;
  return normalizeMiniResponse(json);
}

/** List NYT Mini puzzle dates */
export async function listMiniPuzzles(page = 1, limit = 20) {
  const res = await fetch(`${API_BASES.nytMini}/list?page=${page}&limit=${limit}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

/** Solve via central solver */
export async function solveClue(clue: string, pattern?: string): Promise<SolveResult> {
  const params = new URLSearchParams({ clue });
  if (pattern) params.set('pattern', pattern);
  const res = await fetch(`${API_BASES.solver}/solve?${params}`, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Solver failed: ${res.status}`);
  return res.json();
}

// --- Normalizers ---

function normalizeStandardResponse(json: StandardPuzzleResponse): NormalizedPuzzle {
  const p = json.data.puzzle;
  return {
    date: p.date,
    formattedDate: p.formatted_date || formatDateDisplay(p.date),
    title: p.title || '',
    author: p.author || '',
    editor: p.editor || '',
    dayOfWeek: p.day_of_week || getDayOfWeek(p.date),
    across: (json.data.across || []).map(c => ({
      number: c.number,
      clue: c.clue_text,
      answer: c.answer,
    })),
    down: (json.data.down || []).map(c => ({
      number: c.number,
      clue: c.clue_text,
      answer: c.answer,
    })),
  };
}

function normalizeMiniResponse(json: MiniPuzzleResponse): NormalizedPuzzle {
  const date = json.date || '';
  return {
    date,
    formattedDate: formatDateDisplay(date),
    title: 'NYT Mini Crossword',
    author: '',
    editor: '',
    dayOfWeek: getDayOfWeek(date),
    across: Object.entries(json.data.across || {}).map(([num, val]) => ({
      number: parseInt(num),
      clue: val.clue,
      answer: val.answer,
    })).sort((a, b) => a.number - b.number),
    down: Object.entries(json.data.down || {}).map(([num, val]) => ({
      number: parseInt(num),
      clue: val.clue,
      answer: val.answer,
    })).sort((a, b) => a.number - b.number),
  };
}

/** Format a date for display */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr || dateStr === 'undefined' || dateStr === 'null') return '';
  try {
    const d = new Date(`${dateStr}T12:00:00`);
    if (isNaN(d.getTime())) return dateStr;
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

/** Get day of week from date string */
export function getDayOfWeek(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(`${dateStr}T12:00:00`);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  } catch {
    return '';
  }
}

/** Get today's date as YYYY-MM-DD */
export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

/** Format date as short version */
export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(`${dateStr}T12:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/** Format date for URL (YYYY-MM-DD) */
export function formatDateUrl(dateStr: string): string {
  return dateStr; // already in YYYY-MM-DD format from API
}
