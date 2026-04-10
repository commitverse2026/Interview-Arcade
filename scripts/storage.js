const dashboard = document.getElementById("dashboard");
const emptyMsg = document.getElementById("emptyMsg");

// MODULE KEYS (used by all features)
const modules = [
  "tictactoe",
  "aptitude",
  "dsa-match"
];

// Fetch data from localStorage
function getModuleData(module) {
  return JSON.parse(localStorage.getItem(module)) || {
    attempts: 0,
    score: 0,
    total: 0
  };
}

// Create card UI
function createCard(name, data) {
  const percent = data.total ? Math.round((data.score / data.total) * 100) : 0;

  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <h3>${formatName(name)}</h3>
    <div class="stat">Attempts: ${data.attempts}</div>
    <div class="stat">Score: ${data.score}/${data.total}</div>
    <div class="score">${percent}%</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width:${percent}%"></div>
    </div>
  `;

  return card;
}

// Format module name
function formatName(name) {
  return name
    .replace("-", " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Load dashboard
function loadDashboard() {
  dashboard.innerHTML = "";

  let hasData = false;

  modules.forEach(mod => {
    const data = getModuleData(mod);

    if (data.attempts > 0) {
      hasData = true;
    }

    const card = createCard(mod, data);
    dashboard.appendChild(card);
  });

  if (!hasData) {
    emptyMsg.style.display = "block";
  }
}

// OPTIONAL: helper for other modules to save data
function saveProgress(module, score, total) {
  let data = getModuleData(module);

  data.attempts += 1;
  data.score += score;
  data.total += total;

  localStorage.setItem(module, JSON.stringify(data));
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
