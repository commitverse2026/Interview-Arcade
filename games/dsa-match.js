// games/dsa-match.js

class DSAMatchGame {
    constructor() {
        this.pairs = [];
        this.terms = [];
        this.definitions = [];
        this.matches = new Map();
        this.selectedTerm = null;
        this.selectedDef = null;
        this.submitted = false;
        this.score = 0;
        this.totalPairs = 0;
    }

    async init() {
        this.pairs = getRandomPairs(8);
        this.totalPairs = this.pairs.length;
        this.updateTotalPairs();

        this.terms = this.pairs.map(pair => pair.term);
        this.definitions = shuffleArray(this.pairs.map(pair => pair.definition));

        this.renderGame();
        this.setupCanvas();
    }

    renderGame() {
        this.renderTerms();
        this.renderDefinitions();
        this.updateStats();
    }

    renderTerms() {
        const termsList = document.getElementById('termsList');
        termsList.innerHTML = '';

        this.terms.forEach((term, index) => {
            const div = document.createElement('div');

            div.className = `term-item 
                ${this.matches.has(index) ? 'matched' : ''} 
                ${this.selectedTerm === index ? 'selected' : ''}`;

            div.textContent = term;

            div.onclick = () => {
                if (!this.submitted && !this.matches.has(index)) {
                    this.selectTerm(index);
                }
            };

            termsList.appendChild(div);
        });
    }

    renderDefinitions() {
        const list = document.getElementById('definitionsList');
        list.innerHTML = '';

        this.definitions.forEach((def, index) => {
            const div = document.createElement('div');

            const isMatched = this.findMatchedDefinition(index) !== -1;

            div.className = `def-item 
                ${isMatched ? 'matched' : ''} 
                ${this.selectedDef === index ? 'selected' : ''}`;

            div.textContent = def;

            div.onclick = () => {
                if (!this.submitted && !isMatched) {
                    this.selectDefinition(index);
                }
            };

            list.appendChild(div);
        });
    }

    selectTerm(index) {
        this.selectedTerm = this.selectedTerm === index ? null : index;
        this.tryMatch();
        this.renderGame();
        this.drawLines();
    }

    selectDefinition(index) {
        this.selectedDef = this.selectedDef === index ? null : index;
        this.tryMatch();
        this.renderGame();
        this.drawLines();
    }

    // 🔥 MAIN FIX HERE
    tryMatch() {
        if (this.selectedTerm === null || this.selectedDef === null) return;

        const termIndex = this.selectedTerm;
        const defIndex = this.selectedDef;

        const term = this.terms[termIndex];
        const selectedDef = this.definitions[defIndex];
        const correctDef = this.pairs.find(p => p.term === term).definition;

        // ❌ WRONG MATCH
        if (selectedDef !== correctDef) {
    this.showFeedback("❌ Wrong match!", "error");

    const termEl = document.querySelectorAll('.term-item')[termIndex];
    const defEl = document.querySelectorAll('.def-item')[defIndex];

    // 🔴 ADD CLASS (instead of inline style)
    termEl.classList.add("wrong");
    defEl.classList.add("wrong");

    setTimeout(() => {
        termEl.classList.remove("wrong");
        defEl.classList.remove("wrong");
    }, 800);

    this.selectedTerm = null;
    this.selectedDef = null;
    return;
}

        // ✅ CORRECT MATCH
        this.matches.set(termIndex, defIndex);
        this.showFeedback("✅ Correct match!", "success");

        this.selectedTerm = null;
        this.selectedDef = null;

        this.updateStats();

        if (this.matches.size === this.totalPairs) {
            this.autoSubmit();
        }
    }

    findMatchedDefinition(defIndex) {
        for (let [t, d] of this.matches.entries()) {
            if (d === defIndex) return t;
        }
        return -1;
    }

    updateStats() {
        document.getElementById('matchesCount').textContent = this.matches.size;
        this.score = this.matches.size;
        document.getElementById('scoreDisplay').textContent = this.score;
    }

    updateTotalPairs() {
        document.getElementById('totalPairs').textContent = this.totalPairs;
    }

    showFeedback(msg, type) {
        const fb = document.getElementById('feedback');
        fb.innerText = msg;
        fb.className = "feedback " + type;
        fb.style.display = "block";

        setTimeout(() => {
            fb.style.display = "none";
        }, 1500);
    }

    resetSelection() {
        this.selectedTerm = null;
        this.selectedDef = null;
        this.renderGame();
        this.drawLines();
    }

    submitMatches() {
        if (this.matches.size < this.totalPairs) {
            this.showFeedback("Complete all matches first!", "error");
            return;
        }
        this.submitted = true;
        this.showResults();
    }

    autoSubmit() {
        setTimeout(() => this.submitMatches(), 500);
    }

    showResults() {
        const overlay = document.getElementById('resultsOverlay');

        document.getElementById('finalScore').innerText = this.score;
        document.getElementById('totalScore').innerText = "/" + this.totalPairs;

        overlay.style.display = "flex";
    }

    resetGame() {
        location.reload();
    }

    closeResultsAndReset() {
        location.reload();
    }

    setupCanvas() {
        this.canvas = document.getElementById('linesCanvas');
        this.ctx = this.canvas.getContext('2d');

        window.addEventListener('resize', () => this.drawLines());
        window.addEventListener('scroll', () => this.drawLines());
    }

    drawLines() {
        if (!this.canvas) return;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let [t, d] of this.matches.entries()) {
            const termEl = document.querySelectorAll('.term-item')[t];
            const defEl = document.querySelectorAll('.def-item')[d];

            if (!termEl || !defEl) continue;

            const tr = termEl.getBoundingClientRect();
            const dr = defEl.getBoundingClientRect();

            this.ctx.beginPath();
            this.ctx.moveTo(tr.right, tr.top + tr.height / 2);
            this.ctx.lineTo(dr.left, dr.top + dr.height / 2);
            this.ctx.strokeStyle = "green";
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }
    }
}

// INIT
const game = new DSAMatchGame();

window.resetSelection = () => game.resetSelection();
window.submitMatches = () => game.submitMatches();
window.resetGame = () => game.resetGame();
window.closeResultsAndReset = () => game.closeResultsAndReset();

document.addEventListener("DOMContentLoaded", () => game.init());