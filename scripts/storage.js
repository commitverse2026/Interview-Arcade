// ─────────────────────────────────────────────────────────────
// scripts/storage.js — Shared storage handler for DSA Platform
// Used by all game modules to save/read progress data
// ─────────────────────────────────────────────────────────────

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key));
}

// ── Score ──────────────────────────────────────────────────────
// Save score for a module (also tracks attempts)
function saveScore(module, score) {
    let scores = getData("scores") || {};
    scores[module] = score;
    saveData("scores", scores);

    let attempts = getData("attempts") || {};
    attempts[module] = (attempts[module] || 0) + 1;
    saveData("attempts", attempts);

    recordActivity();
}

function getScore(module) {
    let scores = getData("scores") || {};
    return scores[module] ?? null;
}

// ── Completion ─────────────────────────────────────────────────
function markCompleted(module) {
    let completed = getData("completed") || [];
    if (!completed.includes(module)) {
        completed.push(module);
        saveData("completed", completed);
    }
}

function isCompleted(module) {
    let completed = getData("completed") || [];
    return completed.includes(module);
}

// ── Attempts ───────────────────────────────────────────────────
function getAttempts(module) {
    let attempts = getData("attempts") || {};
    return attempts[module] || 0;
}

// ── Activity (streak tracking) ─────────────────────────────────
function recordActivity() {
    let history = getData("activity-history") || [];
    const today = new Date().toDateString();
    if (!history.includes(today)) {
        history.push(today);
        saveData("activity-history", history);
    }
}

// ── Reset ──────────────────────────────────────────────────────
function resetAll() {
    ["scores", "completed", "attempts", "activity-history"].forEach(k => localStorage.removeItem(k));
}