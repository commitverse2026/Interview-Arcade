// games/dsa-match.js

class DSAMatchGame {
    constructor() {
        this.pairs = [];
        this.terms = [];
        this.definitions = [];
        this.matches = new Map(); // termIndex -> definitionIndex
        this.selectedTerm = null;
        this.selectedDef = null;
        this.submitted = false;
        this.score = 0;
        this.totalPairs = 0;
    }

    async init() {
        // Load random pairs
        if (typeof getRandomPairs !== 'undefined') {
            this.pairs = getRandomPairs(8);
        } else {
            console.error('DSA pairs not loaded');
            return;
        }
        
        this.totalPairs = this.pairs.length;
        this.updateTotalPairs();
        
        // Extract terms and shuffle definitions
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
            const isMatched = this.matches.has(index);
            const isSelected = this.selectedTerm === index;
            
            const termDiv = document.createElement('div');
            termDiv.className = `term-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}`;
            termDiv.textContent = term;
            termDiv.onclick = () => !this.submitted && !isMatched && this.selectTerm(index);
            termsList.appendChild(termDiv);
        });
    }

    renderDefinitions() {
        const definitionsList = document.getElementById('definitionsList');
        definitionsList.innerHTML = '';
        
        this.definitions.forEach((definition, index) => {
            const matchedTermIndex = this.findMatchedDefinition(index);
            const isMatched = matchedTermIndex !== -1;
            const isSelected = this.selectedDef === index;
            
            const defDiv = document.createElement('div');
            defDiv.className = `def-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}`;
            defDiv.textContent = definition;
            defDiv.onclick = () => !this.submitted && !isMatched && this.selectDefinition(index);
            definitionsList.appendChild(defDiv);
        });
    }

    selectTerm(termIndex) {
        if (this.selectedTerm === termIndex) {
            this.selectedTerm = null;
        } else {
            this.selectedTerm = termIndex;
            
            // If a definition is already selected, make the match
            if (this.selectedDef !== null) {
                this.createMatch(this.selectedTerm, this.selectedDef);
                this.selectedTerm = null;
                this.selectedDef = null;
            }
        }
        this.renderGame();
        this.drawLines();
    }

    selectDefinition(defIndex) {
        if (this.selectedDef === defIndex) {
            this.selectedDef = null;
        } else {
            this.selectedDef = defIndex;
            
            // If a term is already selected, make the match
            if (this.selectedTerm !== null) {
                this.createMatch(this.selectedTerm, this.selectedDef);
                this.selectedTerm = null;
                this.selectedDef = null;
            }
        }
        this.renderGame();
        this.drawLines();
    }

    createMatch(termIndex, defIndex) {
        // Check if this definition is already matched
        const existingMatch = this.findMatchedDefinition(defIndex);
        if (existingMatch !== -1) {
            this.showFeedback('This definition is already matched!', 'error');
            return;
        }
        
        // Check if this term is already matched
        if (this.matches.has(termIndex)) {
            this.showFeedback('This term is already matched!', 'error');
            return;
        }
        
        // Check if the match is correct
        const term = this.terms[termIndex];
        const definition = this.definitions[defIndex];
        const correctDefinition = this.pairs.find(pair => pair.term === term).definition;
        
        if (definition === correctDefinition) {
            // Correct match
            this.matches.set(termIndex, defIndex);
            this.showFeedback('✓ Correct match!', 'success');
            this.updateStats();
            
            // Check if game is complete
            if (this.matches.size === this.totalPairs) {
                this.autoSubmit();
            }
        } else {
            // Incorrect match
            this.showFeedback(`✗ Wrong match! "${term}" does not match with this definition.`, 'error');
        }
        
        this.renderGame();
        this.drawLines();
    }

    findMatchedDefinition(defIndex) {
        for (let [termIdx, defIdx] of this.matches.entries()) {
            if (defIdx === defIndex) {
                return termIdx;
            }
        }
        return -1;
    }

    findMatchedTerm(termIndex) {
        return this.matches.has(termIndex);
    }

    updateStats() {
        const matchesCount = document.getElementById('matchesCount');
        if (matchesCount) {
            matchesCount.textContent = this.matches.size;
        }
        
        // Update score (each correct match is 1 point)
        this.score = this.matches.size;
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) {
            scoreDisplay.textContent = this.score;
        }
    }

    updateTotalPairs() {
        const totalPairs = document.getElementById('totalPairs');
        if (totalPairs) {
            totalPairs.textContent = this.totalPairs;
        }
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        
        setTimeout(() => {
            feedback.style.display = 'none';
            feedback.className = 'feedback';
        }, 2000);
    }

    resetSelection() {
        this.selectedTerm = null;
        this.selectedDef = null;
        this.renderGame();
        this.drawLines();
        this.showFeedback('Selection reset', 'success');
    }

    submitMatches() {
        if (this.submitted) {
            this.showFeedback('Already submitted! Reset the game to play again.', 'error');
            return;
        }
        
        if (this.matches.size < this.totalPairs) {
            this.showFeedback(`Please match all ${this.totalPairs} pairs before submitting!`, 'error');
            return;
        }
        
        this.submitted = true;
        this.showResults();
    }

    autoSubmit() {
        if (this.matches.size === this.totalPairs && !this.submitted) {
            setTimeout(() => {
                this.submitMatches();
            }, 500);
        }
    }

    showResults() {
        const resultsOverlay = document.getElementById('resultsOverlay');
        const finalScoreSpan = document.getElementById('finalScore');
        const totalScoreSpan = document.getElementById('totalScore');
        const matchResultsDiv = document.getElementById('matchResults');
        
        finalScoreSpan.textContent = this.score;
        totalScoreSpan.textContent = this.totalPairs;
        
        // Build match results
        let resultsHtml = '<h3>Match Results:</h3>';
        
        this.pairs.forEach((pair, idx) => {
            const term = pair.term;
            const correctDef = pair.definition;
            
            // Find where this term is in the terms array
            const termIndex = this.terms.indexOf(term);
            const matchedDefIndex = this.matches.get(termIndex);
            const matchedDef = matchedDefIndex !== undefined ? this.definitions[matchedDefIndex] : null;
            const isCorrect = matchedDef === correctDef;
            
            resultsHtml += `
                <div class="match-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div>
                        <strong>${term}</strong><br>
                        <small>${isCorrect ? '✓ Correct' : '✗ Incorrect'}</small>
                    </div>
                    <div style="text-align: right;">
                        <div>Matched: ${matchedDef ? this.truncateText(matchedDef, 50) : 'None'}</div>
                        <div style="color: #28a745;">Should be: ${this.truncateText(correctDef, 50)}</div>
                    </div>
                </div>
            `;
        });
        
        // Calculate percentage
        const percentage = (this.score / this.totalPairs) * 100;
        let performanceMessage = '';
        if (percentage === 100) {
            performanceMessage = '🎉 Perfect! You\'re a DSA expert!';
        } else if (percentage >= 80) {
            performanceMessage = '👍 Great job! Almost perfect!';
        } else if (percentage >= 60) {
            performanceMessage = '📚 Good effort! Review the correct matches to improve.';
        } else {
            performanceMessage = '💪 Keep practicing! Review DSA concepts and try again.';
        }
        
        resultsHtml = `
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-size: 18px;">${performanceMessage}</p>
                <p>Accuracy: ${percentage.toFixed(1)}%</p>
            </div>
            ${resultsHtml}
        `;
        
        matchResultsDiv.innerHTML = resultsHtml;
        resultsOverlay.style.display = 'flex';
        
        // Save score
        this.saveScore();
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    saveScore() {
        const scoreData = {
            score: this.score,
            total: this.totalPairs,
            percentage: (this.score / this.totalPairs * 100).toFixed(1),
            date: new Date().toISOString(),
            timestamp: new Date().toLocaleString()
        };
        
        const highScores = JSON.parse(localStorage.getItem('dsa_match_scores') || '[]');
        highScores.push(scoreData);
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('dsa_match_scores', JSON.stringify(highScores.slice(0, 5)));
    }

    resetGame() {
        this.pairs = [];
        this.terms = [];
        this.definitions = [];
        this.matches.clear();
        this.selectedTerm = null;
        this.selectedDef = null;
        this.submitted = false;
        this.score = 0;
        
        // Load new random pairs
        this.pairs = getRandomPairs(8);
        this.totalPairs = this.pairs.length;
        this.updateTotalPairs();
        
        this.terms = this.pairs.map(pair => pair.term);
        this.definitions = shuffleArray(this.pairs.map(pair => pair.definition));
        
        this.renderGame();
        this.drawLines();
        this.showFeedback('Game reset! New pairs loaded.', 'success');
    }

    closeResultsAndReset() {
        document.getElementById('resultsOverlay').style.display = 'none';
        this.resetGame();
    }

    // Canvas drawing for connection lines
    setupCanvas() {
        this.canvas = document.getElementById('linesCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        window.addEventListener('resize', () => this.drawLines());
        window.addEventListener('scroll', () => this.drawLines());
        
        // Draw lines when DOM changes
        const observer = new MutationObserver(() => this.drawLines());
        observer.observe(document.getElementById('termsList'), { childList: true, subtree: true, attributes: true });
        observer.observe(document.getElementById('definitionsList'), { childList: true, subtree: true, attributes: true });
    }

    drawLines() {
        if (!this.canvas || !this.ctx) return;
        
        // Clear canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.submitted) return;
        
        // Draw lines for each match
        for (let [termIndex, defIndex] of this.matches.entries()) {
            const termElement = document.querySelectorAll('.term-item')[termIndex];
            const defElement = document.querySelectorAll('.def-item')[defIndex];
            
            if (termElement && defElement) {
                const termRect = termElement.getBoundingClientRect();
                const defRect = defElement.getBoundingClientRect();
                
                const startX = termRect.right;
                const startY = termRect.top + termRect.height / 2;
                const endX = defRect.left;
                const endY = defRect.top + defRect.height / 2;
                
                this.drawLine(startX, startY, endX, endY);
            }
        }
        
        // Draw temporary line for selection
        if (this.selectedTerm !== null && this.selectedDef === null) {
            const termElement = document.querySelectorAll('.term-item')[this.selectedTerm];
            if (termElement) {
                const termRect = termElement.getBoundingClientRect();
                const startX = termRect.right;
                const startY = termRect.top + termRect.height / 2;
                
                // Draw to mouse position (we'll add mousemove listener)
                this.drawTempLine(startX, startY);
            }
        }
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = '#28a745';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Draw arrow head
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const arrowSize = 10;
        const arrowX = x2 - arrowSize * Math.cos(angle);
        const arrowY = y2 - arrowSize * Math.sin(angle);
        
        this.ctx.beginPath();
        this.ctx.moveTo(arrowX, arrowY);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(arrowX - 5 * Math.sin(angle), arrowY + 5 * Math.cos(angle));
        this.ctx.fillStyle = '#28a745';
        this.ctx.fill();
    }

    drawTempLine(x1, y1) {
        // This would require mouse tracking, simplified for now
        // Just draw the line if we have a selected term
        const defElements = document.querySelectorAll('.def-item');
        defElements.forEach(def => {
            const rect = def.getBoundingClientRect();
            const x2 = rect.left;
            const y2 = rect.top + rect.height / 2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = '#667eea';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
    }
}

// Initialize game
const game = new DSAMatchGame();

// Make functions global for onclick handlers
window.resetSelection = () => game.resetSelection();
window.submitMatches = () => game.submitMatches();
window.resetGame = () => game.resetGame();
window.closeResultsAndReset = () => game.closeResultsAndReset();

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});

// Update canvas lines on scroll and resize
window.addEventListener('scroll', () => {
    if (game) game.drawLines();
});

window.addEventListener('resize', () => {
    if (game) game.drawLines();
});