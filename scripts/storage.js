const DASHBOARD_PROGRESS_KEY = "moduleProgress";
const LEGACY_SCORES_KEY = "scores";
const LEGACY_ATTEMPTS_KEY = "attempts";
const LEGACY_COMPLETED_KEY = "completed";

export const MODULES = [
  { id: "tictactoe", title: "Tic Tac Toe + OOP Quiz" },
  { id: "memory", title: "Memory Card Game" },
  { id: "aptitude", title: "Aptitude Quiz" },
  { id: "resume", title: "Resume Keyword Matcher" },
  { id: "sql", title: "SQL Fill in the Blanks" },
  { id: "riddles", title: "Image Riddles" },
  { id: "dsa-match", title: "DSA Match the Following" },
  { id: "debug", title: "Debug the Code" },
  { id: "feedback", title: "Feedback System" },
  { id: "dashboard", title: "Progress Dashboard" }
];

function safeParse(rawValue, fallbackValue) {
  if (rawValue === null || rawValue === undefined || rawValue === "") {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch (_error) {
    return fallbackValue;
  }
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value) {
  return value === true || value === "true" || value === 1;
}

function clamp(value, minValue, maxValue) {
  return Math.min(maxValue, Math.max(minValue, value));
}

function moduleKeys(moduleId) {
  return [moduleId, moduleId.replace(/-/g, ""), moduleId.replace(/-/g, "_")];
}

function getRawProgressMap() {
  return getData(DASHBOARD_PROGRESS_KEY, {});
}

function setRawProgressMap(progressMap) {
  saveData(DASHBOARD_PROGRESS_KEY, progressMap);
}

function findLegacyValue(legacyObject, moduleId) {
  const keys = moduleKeys(moduleId);
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(legacyObject, key)) {
      return legacyObject[key];
    }
  }
  return undefined;
}

function isLegacyCompleted(completedArray, moduleId) {
  const normalized = new Set(
    (Array.isArray(completedArray) ? completedArray : []).map((item) =>
      String(item).trim().toLowerCase().replace(/[\s_-]+/g, "")
    )
  );

  return moduleKeys(moduleId).some((key) =>
    normalized.has(String(key).trim().toLowerCase().replace(/[\s_-]+/g, ""))
  );
}

function normalizeProgress(moduleId, title, rawEntry = {}) {
  return {
    moduleId,
    title,
    score: toNumber(rawEntry.score, 0),
    maxScore: Math.max(0, toNumber(rawEntry.maxScore, 0)),
    attempts: Math.max(0, Math.floor(toNumber(rawEntry.attempts, 0))),
    completed: toBoolean(rawEntry.completed),
    lastPlayed: rawEntry.lastPlayed || null
  };
}

export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getData(key, fallbackValue = null) {
  return safeParse(localStorage.getItem(key), fallbackValue);
}

export function recordModuleAttempt(moduleId, details = {}) {
  const progressMap = getRawProgressMap();
  const moduleMeta = MODULES.find((moduleItem) => moduleItem.id === moduleId);
  const entry = normalizeProgress(
    moduleId,
    moduleMeta ? moduleMeta.title : moduleId,
    progressMap[moduleId]
  );

  const hasExplicitAttempts = Object.prototype.hasOwnProperty.call(details, "attempts");
  const hasExplicitIncrement = Object.prototype.hasOwnProperty.call(details, "incrementAttempts");
  const shouldIncrement = hasExplicitIncrement ? Boolean(details.incrementAttempts) : true;

  if (hasExplicitAttempts) {
    entry.attempts = Math.max(0, Math.floor(toNumber(details.attempts, entry.attempts)));
  } else if (shouldIncrement) {
    entry.attempts += 1;
  }

  if (Object.prototype.hasOwnProperty.call(details, "score")) {
    entry.score = Math.max(0, toNumber(details.score, entry.score));
  }

  if (Object.prototype.hasOwnProperty.call(details, "maxScore")) {
    entry.maxScore = Math.max(0, toNumber(details.maxScore, entry.maxScore));
  }

  if (Object.prototype.hasOwnProperty.call(details, "completed")) {
    entry.completed = Boolean(details.completed);
  } else if (entry.maxScore > 0 && entry.score >= entry.maxScore) {
    entry.completed = true;
  }

  entry.lastPlayed = new Date().toISOString();
  progressMap[moduleId] = entry;
  setRawProgressMap(progressMap);
}

export function saveScore(moduleId, score, maxScore = 100) {
  const legacyScores = getData(LEGACY_SCORES_KEY, {});
  legacyScores[moduleId] = toNumber(score, 0);
  saveData(LEGACY_SCORES_KEY, legacyScores);

  recordModuleAttempt(moduleId, {
    score: toNumber(score, 0),
    maxScore: toNumber(maxScore, 100),
    incrementAttempts: false
  });
}

export function getScore(moduleId) {
  const progress = getModuleProgress(moduleId);
  return progress.score;
}

export function markCompleted(moduleId) {
  const legacyCompleted = getData(LEGACY_COMPLETED_KEY, []);
  if (!legacyCompleted.includes(moduleId)) {
    legacyCompleted.push(moduleId);
    saveData(LEGACY_COMPLETED_KEY, legacyCompleted);
  }

  recordModuleAttempt(moduleId, { completed: true, incrementAttempts: false });
}

export function getModuleProgress(moduleId) {
  const moduleMeta = MODULES.find((moduleItem) => moduleItem.id === moduleId);
  const title = moduleMeta ? moduleMeta.title : moduleId;
  const progressMap = getRawProgressMap();
  const normalized = normalizeProgress(moduleId, title, progressMap[moduleId]);

  const legacyScores = getData(LEGACY_SCORES_KEY, {});
  const legacyAttempts = getData(LEGACY_ATTEMPTS_KEY, {});
  const legacyCompleted = getData(LEGACY_COMPLETED_KEY, []);

  const fallbackScore = findLegacyValue(legacyScores, moduleId);
  if (fallbackScore !== undefined) {
    normalized.score = Math.max(normalized.score, toNumber(fallbackScore, 0));
  }

  const fallbackAttempts = findLegacyValue(legacyAttempts, moduleId);
  if (fallbackAttempts !== undefined) {
    normalized.attempts = Math.max(
      normalized.attempts,
      Math.floor(toNumber(fallbackAttempts, 0))
    );
  }

  if (isLegacyCompleted(legacyCompleted, moduleId)) {
    normalized.completed = true;
  }

  if (normalized.maxScore === 0 && normalized.score > 0) {
    normalized.maxScore = 100;
  }

  return normalized;
}

export function getAllModuleProgress() {
  return MODULES.map((moduleItem) => getModuleProgress(moduleItem.id));
}

export function getScorePercent(progressItem) {
  if (progressItem.maxScore > 0) {
    return clamp(Math.round((progressItem.score / progressItem.maxScore) * 100), 0, 100);
  }

  if (progressItem.score > 0) {
    return clamp(Math.round(progressItem.score), 0, 100);
  }

  return progressItem.completed ? 100 : 0;
}

export function getDashboardSummary(progressList = getAllModuleProgress()) {
  const totalModules = progressList.length;
  const completedModules = progressList.filter((item) => item.completed).length;
  const totalAttempts = progressList.reduce((sum, item) => sum + item.attempts, 0);
  const averageScorePercent =
    totalModules > 0
      ? Math.round(
          progressList.reduce((sum, item) => sum + getScorePercent(item), 0) / totalModules
        )
      : 0;

  return {
    totalModules,
    completedModules,
    totalAttempts,
    averageScorePercent
  };
}
