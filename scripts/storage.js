// Storage Handler

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key));
}

// scripts/storage.js
class GameStorage {
    static saveScore(gameName, score) {
        const scores = this.getScores();
        scores[gameName] = score;
        localStorage.setItem('arcade_scores', JSON.stringify(scores));
    }

    static getScores() {
        const scores = localStorage.getItem('arcade_scores');
        return scores ? JSON.parse(scores) : {};
    }

    static getGameScore(gameName) {
        const scores = this.getScores();
        return scores[gameName] || { score: 0, highScore: 0 };
    }

    static updateProgress(gameName, completed) {
        const progress = this.getProgress();
        progress[gameName] = completed;
        localStorage.setItem('game_progress', JSON.stringify(progress));
    }

    static getProgress() {
        const progress = localStorage.getItem('game_progress');
        return progress ? JSON.parse(progress) : {};
    }
}