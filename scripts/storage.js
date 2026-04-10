// =============================================================
// storage.js — Shared localStorage utility for Interview Arcade
// Used by ALL modules to save progress.
// Dashboard reads from the same keys to display summaries.
// =============================================================

const STORAGE_KEYS = {
  tictactoe : 'arcade_tictactoe',
  memory    : 'arcade_memory',
  aptitude  : 'arcade_aptitude',
  resume    : 'arcade_resume',
  sql       : 'arcade_sql',
  riddles   : 'arcade_riddles',
  dsamatch  : 'arcade_dsamatch',
  debug     : 'arcade_debug',
  feedback  : 'arcade_feedback',
};

// Generic read/write
function saveData(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch(e) { console.warn('saveData failed:', e); }
}

function getData(key) {
  try { return JSON.parse(localStorage.getItem(key)) || null; }
  catch(e) { return null; }
}

// Call this from any module when a session ends
// module  : key from STORAGE_KEYS (e.g. 'aptitude')
// score   : points earned this session
// total   : max possible points
// completed: true if player finished the module
function saveModuleResult(module, { score = 0, total = 0, attempts = 1, completed = false } = {}) {
  const key = STORAGE_KEYS[module];
  if (!key) return;
  const prev = getData(key) || {};
  saveData(key, {
    ...prev,
    score,
    total,
    bestScore : Math.max(prev.bestScore || 0, score),
    attempts  : (prev.attempts || 0) + attempts,
    completed : prev.completed || completed,
    lastPlayed: new Date().toISOString(),
  });
}

// Returns stored object or safe defaults
function getModuleResult(module) {
  const key = STORAGE_KEYS[module];
  if (!key) return null;
  return getData(key) || { score:0, total:0, bestScore:0, attempts:0, completed:false, lastPlayed:null };
}

// Wipe everything — triggered by dashboard Reset button
function clearAll() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}