// games/sql.js

class SQLFillBlanksGame {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.quizCompleted = false;
        this.submitted = false;
    }

    async init() {
        // Load random questions
        if (typeof getSQLQuestions !== 'undefined') {
            this.questions = getSQLQuestions(8);
        } else {
            console.error('SQL questions not loaded');
            return;
        }
        
        this.userAnswers = new Array(this.questions.length);
        this.userAnswers.fill(null);
        
        document.getElementById('totalQuestions').textContent = this.questions.length;
        this.renderQuestion();
        this.updateStats();
    }

    renderQuestion() {
        const question = this.questions[this.currentIndex];
        const container = document.getElementById('questionContent');
        
        if (!question) return;
        
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        
        // Parse the query and create input fields for blanks
        const queryParts = this.parseQuery(question.query);
        
        container.innerHTML = `
            <div class="question-card">
                <div class="question-title">Question ${this.currentIndex + 1} of ${this.questions.length}</div>
                <div class="question-description">
                    <strong>📝 Task:</strong> ${question.description}
                </div>
                <div class="sql-query">
                    ${queryParts}
                </div>
                <div class="explanation" style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-radius: 5px; display: none;" id="explanation">
                    <strong>💡 Hint:</strong> ${question.explanation}
                </div>
            </div>
        `;
        
        // Add event listeners to inputs
        const inputs = document.querySelectorAll('.blank-input');
        inputs.forEach((input, idx) => {
            if (this.userAnswers[this.currentIndex] && this.userAnswers[this.currentIndex][idx]) {
                input.value = this.userAnswers[this.currentIndex][idx];
                this.validateInput(input, idx);
            }
            
            input.addEventListener('input', (e) => {
                this.saveAnswer(idx, e.target.value);
                this.validateInput(input, idx);
            });
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    parseQuery(query) {
        // Split the query by blanks (___)
        const parts = query.split('___');
        let html = '';
        
        for (let i = 0; i < parts.length; i++) {
            // Add the text part
            html += this.highlightSQL(parts[i]);
            
            // Add input field if not the last part
            if (i < parts.length - 1) {
                const answer = this.userAnswers[this.currentIndex] ? 
                    this.userAnswers[this.currentIndex][i] || '' : '';
                html += `<input type="text" class="blank-input" data-blank="${i}" value="${this.escapeHtml(answer)}" placeholder="Type here...">`;
            }
        }
        
        return html;
    }
    
    highlightSQL(sql) {
        // Simple SQL syntax highlighting
        let highlighted = this.escapeHtml(sql);
        
        const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 
                         'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'INTO',
                         'VALUES', 'SET', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'DATABASE',
                         'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL', 'AS',
                         'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'UNION', 'LIMIT'];
        
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlighted = highlighted.replace(regex, match => 
                `<span class="sql-keyword">${match}</span>`
            );
        });
        
        // Highlight strings
        highlighted = highlighted.replace(/'([^']*)'/g, '<span class="sql-string">\'$1\'</span>');
        
        // Highlight numbers
        highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="sql-number">$1</span>');
        
        return highlighted;
    }
    
    saveAnswer(blankIndex, value) {
        if (!this.userAnswers[this.currentIndex]) {
            this.userAnswers[this.currentIndex] = [];
        }
        this.userAnswers[this.currentIndex][blankIndex] = value.trim();
    }
    
    validateInput(input, blankIndex) {
        const currentAnswer = this.userAnswers[this.currentIndex][blankIndex];
        if (!currentAnswer) {
            input.classList.remove('correct', 'incorrect');
            return;
        }
        
        const question = this.questions[this.currentIndex];
        const solutions = question.solutions;
        
        const isCorrect = solutions.some(solution => 
            solution.toLowerCase() === currentAnswer.toLowerCase()
        );
        
        if (isCorrect) {
            input.classList.add('correct');
            input.classList.remove('incorrect');
        } else {
            input.classList.add('incorrect');
            input.classList.remove('correct');
        }
    }
    
    checkCurrentQuestion() {
        const answers = this.userAnswers[this.currentIndex];
        if (!answers) return false;
        
        const question = this.questions[this.currentIndex];
        let allFilled = true;
        
        // Check if all blanks are filled
        for (let i = 0; i < question.blanks.length; i++) {
            if (!answers[i] || answers[i].trim() === '') {
                allFilled = false;
                break;
            }
        }
        
        if (!allFilled) {
            this.showFeedback('Please fill in all blanks before proceeding!', 'error');
            return false;
        }
        
        return true;
    }
    
    submitCurrentForScore() {
        const answers = this.userAnswers[this.currentIndex];
        if (!answers) return false;
        
        const question = this.questions[this.currentIndex];
        let allCorrect = true;
        
        // Check each blank
        for (let i = 0; i < question.blanks.length; i++) {
            const userAnswer = answers[i] ? answers[i].trim().toLowerCase() : '';
            const isCorrect = question.solutions.some(solution => 
                solution.toLowerCase() === userAnswer
            );
            
            if (!isCorrect) {
                allCorrect = false;
                break;
            }
        }
        
        return allCorrect;
    }
    
    nextQuestion() {
        if (this.quizCompleted) return;
        
        // Check if current question has all blanks filled
        if (!this.checkCurrentQuestion()) {
            return;
        }
        
        // Check if current question is correct and update score
        const isCorrect = this.submitCurrentForScore();
        const wasPreviouslyCorrect = this.userAnswers[this.currentIndex] && 
            this.userAnswers[this.currentIndex]._wasCorrect;
        
        if (isCorrect && !wasPreviouslyCorrect) {
            this.score++;
            if (this.userAnswers[this.currentIndex]) {
                this.userAnswers[this.currentIndex]._wasCorrect = true;
            }
        } else if (!isCorrect && wasPreviouslyCorrect) {
            this.score--;
            if (this.userAnswers[this.currentIndex]) {
                this.userAnswers[this.currentIndex]._wasCorrect = false;
            }
        }
        
        this.updateStats();
        
        // Move to next question
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.renderQuestion();
            this.hideFeedback();
        } else {
            this.showFeedback('You have reached the last question! Click Submit Quiz to see your results.', 'info');
        }
    }
    
    previousQuestion() {
        if (this.quizCompleted) return;
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderQuestion();
            this.hideFeedback();
        }
    }
    
    resetCurrentQuestion() {
        if (this.quizCompleted) return;
        
        // Reset answers for current question
        this.userAnswers[this.currentIndex] = null;
        this.renderQuestion();
        this.showFeedback('Answers reset for this question', 'info');
        
        // Update score if it was previously counted
        if (this.userAnswers[this.currentIndex] && this.userAnswers[this.currentIndex]._wasCorrect) {
            this.score--;
            this.updateStats();
        }
    }
    
    submitQuiz() {
        if (this.quizCompleted) return;
        
        // Check all questions are answered
        let allFilled = true;
        for (let i = 0; i < this.questions.length; i++) {
            const answers = this.userAnswers[i];
            if (!answers) {
                allFilled = false;
                break;
            }
            
            for (let j = 0; j < this.questions[i].blanks.length; j++) {
                if (!answers[j] || answers[j].trim() === '') {
                    allFilled = false;
                    break;
                }
            }
            if (!allFilled) break;
        }
        
        if (!allFilled) {
            this.showFeedback('Please answer all questions before submitting the quiz!', 'error');
            return;
        }
        
        // Calculate final score
        let finalScore = 0;
        for (let i = 0; i < this.questions.length; i++) {
            const answers = this.userAnswers[i];
            const question = this.questions[i];
            let allCorrect = true;
            
            for (let j = 0; j < question.blanks.length; j++) {
                const userAnswer = answers[j] ? answers[j].trim().toLowerCase() : '';
                const isCorrect = question.solutions.some(solution => 
                    solution.toLowerCase() === userAnswer
                );
                
                if (!isCorrect) {
                    allCorrect = false;
                    break;
                }
            }
            
            if (allCorrect) {
                finalScore++;
            }
        }
        
        this.score = finalScore;
        this.updateStats();
        this.quizCompleted = true;
        this.showResults();
        this.saveScore();
    }
    
    showResults() {
        const overlay = document.getElementById('resultsOverlay');
        const finalScoreSpan = document.getElementById('finalScore');
        const totalScoreSpan = document.getElementById('totalScore');
        const resultsContent = document.getElementById('resultsContent');
        
        finalScoreSpan.textContent = this.score;
        totalScoreSpan.textContent = this.questions.length;
        
        const percentage = (this.score / this.questions.length) * 100;
        let performanceMessage = '';
        
        if (percentage === 100) {
            performanceMessage = '🎉 Perfect! You\'re an SQL master!';
        } else if (percentage >= 80) {
            performanceMessage = '👍 Great job! You have strong SQL knowledge!';
        } else if (percentage >= 60) {
            performanceMessage = '📚 Good effort! Review the explanations to improve.';
        } else {
            performanceMessage = '💪 Keep practicing! SQL is a valuable skill to master.';
        }
        
        let resultsHtml = `
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-size: 18px;">${performanceMessage}</p>
                <p>Accuracy: ${percentage.toFixed(1)}%</p>
            </div>
            <div class="question-review">
                <h3>📝 Detailed Review:</h3>
        `;
        
        this.questions.forEach((question, idx) => {
            const answers = this.userAnswers[idx];
            let isCorrect = true;
            let userAnswersList = [];
            
            for (let j = 0; j < question.blanks.length; j++) {
                const userAnswer = answers ? answers[j] : '(Not answered)';
                userAnswersList.push(userAnswer);
                const isBlankCorrect = question.solutions.some(solution => 
                    solution.toLowerCase() === (userAnswer ? userAnswer.trim().toLowerCase() : '')
                );
                if (!isBlankCorrect) isCorrect = false;
            }
            
            resultsHtml += `
                <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <strong>Q${idx + 1}:</strong> ${question.description}<br>
                    <strong>Your answers:</strong> ${userAnswersList.map((ans, i) => 
                        `Blank ${i+1}: "${ans || 'Not answered'}"`
                    ).join(', ')}<br>
                    <strong>Expected:</strong> ${question.solutions.join(' or ')}<br>
                    <strong>Explanation:</strong> ${question.explanation}
                </div>
            `;
        });
        
        resultsHtml += `</div>`;
        resultsContent.innerHTML = resultsHtml;
        overlay.style.display = 'flex';
    }
    
    restartQuiz() {
        // Reset all game state
        this.currentIndex = 0;
        this.userAnswers = new Array(this.questions.length);
        this.userAnswers.fill(null);
        this.score = 0;
        this.quizCompleted = false;
        this.submitted = false;
        
        // Load new random questions
        this.questions = getSQLQuestions(8);
        document.getElementById('totalQuestions').textContent = this.questions.length;
        
        // Close modal and refresh
        document.getElementById('resultsOverlay').style.display = 'none';
        this.renderQuestion();
        this.updateStats();
        this.hideFeedback();
    }
    
    updateStats() {
        document.getElementById('currentQuestion').textContent = this.currentIndex + 1;
        document.getElementById('scoreDisplay').textContent = this.score;
    }
    
    updateNavigationButtons() {
        const prevBtn = document.querySelector('.nav-btn.prev');
        const nextBtn = document.querySelector('.nav-btn.next');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentIndex === this.questions.length - 1;
        }
    }
    
    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        
        setTimeout(() => {
            if (feedback.className === `feedback ${type}`) {
                // Don't auto-hide info messages
                if (type !== 'info') {
                    setTimeout(() => {
                        feedback.style.display = 'none';
                    }, 3000);
                }
            }
        }, 100);
    }
    
    hideFeedback() {
        const feedback = document.getElementById('feedback');
        feedback.style.display = 'none';
        feedback.className = 'feedback';
    }
    
    saveScore() {
        const scoreData = {
            score: this.score,
            total: this.questions.length,
            percentage: (this.score / this.questions.length * 100).toFixed(1),
            date: new Date().toISOString(),
            timestamp: new Date().toLocaleString()
        };
        
        const highScores = JSON.parse(localStorage.getItem('sql_quiz_scores') || '[]');
        highScores.push(scoreData);
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('sql_quiz_scores', JSON.stringify(highScores.slice(0, 5)));
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize game
const game = new SQLFillBlanksGame();

// Global functions for onclick handlers
window.previousQuestion = () => game.previousQuestion();
window.nextQuestion = () => game.nextQuestion();
window.resetCurrentQuestion = () => game.resetCurrentQuestion();
window.submitQuiz = () => game.submitQuiz();
window.restartQuiz = () => game.restartQuiz();

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});