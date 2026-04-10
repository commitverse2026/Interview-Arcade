// Storage Handler

export const MODULE_KEYS = [
    "tictactoe",
    "memory",
    "aptitude",
    "resume",
    "sql",
    "riddles",
    "dsa-match",
    "debug",
    "feedback",
    "dashboard"
];

export function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getData(key) {
    const raw = localStorage.getItem(key);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.warn(`Unable to parse localStorage key "${key}".`, error);
        return null;
    }
}

export function getScores() {
    return getData("scores") || {};
}

export function getCompletedModules() {
    return getData("completed") || [];
}

export function getAttempts() {
    return getData("attempts") || {};
}

export function incrementAttempts(module) {
    const attempts = getAttempts();
    attempts[module] = (Number(attempts[module]) || 0) + 1;
    saveData("attempts", attempts);
    return attempts[module];
}

export function saveScore(module, score) {
    const scores = getScores();
    scores[module] = Number(score) || 0;
    saveData("scores", scores);
}

export function getScore(module) {
    const scores = getScores();
    return Number(scores[module]) || 0;
}

export function markCompleted(module) {
    const completed = getCompletedModules();

    if (!completed.includes(module)) {
        completed.push(module);
        saveData("completed", completed);
    }
}

export function getModuleProgress(module) {
    const scores = getScores();
    const completed = getCompletedModules();
    const attempts = getAttempts();
    const score = Number(scores[module]) || 0;
    const completedFlag = completed.includes(module);
    const attemptCount = Number(attempts[module]) || (score > 0 || completedFlag ? 1 : 0);

    return {
        module,
        score,
        attempts: attemptCount,
        completed: completedFlag
    };
}

export function getDashboardProgress(modules = MODULE_KEYS) {
    return modules.map(getModuleProgress);
}
