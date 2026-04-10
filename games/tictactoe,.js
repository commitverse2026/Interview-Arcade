
// Game State
class TicTacToeGame {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        this.loser = null;
        this.quizMode = false;
        this.currentQuestions = [];
        this.userAnswers = new Array(5).fill(null);
        this.quizSubmitted = false;
    }

    init() {
        this.loadScores();
        this.createBoard();
        this.updateGameStatus();
        this.addEventListeners();
    }

    loadScores() {
        const savedScores = localStorage.getItem('tictactoe_scores');
        if (savedScores) {
            this.scores = JSON.parse(savedScores);
            document.getElementById('scoreX').textContent = this.scores.X;
            document.getElementById('scoreO').textContent = this.scores.O;
        }
    }

    saveScores() {
        localStorage.setItem('tictactoe_scores', JSON.stringify(this.scores));
    }

    createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.textContent = this.board[i];
            if (!this.gameActive || this.board[i] || !this.isPlayerTurn()) {
                cell.classList.add('disabled');
            }
            boardElement.appendChild(cell);
        }
    }

    isPlayerTurn() {
        return !this.quizMode && this.gameActive;
    }

    makeMove(index) {
        if (!this.gameActive || this.quizMode || this.board[index]) {
            return false;
        }

        this.board[index] = this.currentPlayer;
        this.createBoard();

        const winner = this.checkWinner();
        if (winner) {
            this.handleWin(winner);
            return true;
        }

        if (this.isBoardFull()) {
            this.handleDraw();
            return true;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateGameStatus();
        return true;
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }
        return null;
    }

    isBoardFull() {
        return this.board.every(cell => cell !== null);
    }

    handleWin(winner) {
        this.gameActive = false;
        this.loser = winner === 'X' ? 'O' : 'X';
        this.scores[winner]++;
        this.saveScores();
        this.updateScoreboard();
        
        const statusMessage = `Player ${winner} wins! Player ${this.loser} must complete the quiz!`;
        document.getElementById('gameStatus').textContent = statusMessage;
        
        // Show quiz for loser
        this.showQuiz();
    }

    handleDraw() {
        this.gameActive = false;
        document.getElementById('gameStatus').textContent = "It's a draw! No quiz needed.";
        setTimeout(() => this.resetRound(), 2000);
    }

    updateScoreboard() {
        document.getElementById('scoreX').textContent = this.scores.X;
        document.getElementById('scoreO').textContent = this.scores.O;
    }

    updateGameStatus() {
        if (this.gameActive && !this.quizMode) {
            document.getElementById('gameStatus').textContent = `Player ${this.currentPlayer}'s turn`;
        }
    }

    showQuiz() {
        this.quizMode = true;
        this.currentQuestions = getRandomQuestions(5);
        this.userAnswers.fill(null);
        this.quizSubmitted = false;
        this.renderQuiz();
        document.getElementById('quizOverlay').style.display = 'flex';
    }

    renderQuiz() {
        const quizContainer = document.getElementById('quizQuestions');
        quizContainer.innerHTML = '';

        this.currentQuestions.forEach((q, idx) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.dataset.qIndex = idx;
            
            questionDiv.innerHTML = `
                <div class="question-text">${idx + 1}. ${q.text}</div>
                ${q.options.map((opt, optIdx) => `
                    <div class="option" data-q="${idx}" data-opt="${optIdx}">
                        ${opt}
                    </div>
                `).join('')}
                <div class="explanation" id="exp-${idx}"></div>
            `;
            
            quizContainer.appendChild(questionDiv);
        });

        // Add click handlers for options
        document.querySelectorAll('.option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                if (this.quizSubmitted) return;
                const qIdx = parseInt(opt.dataset.q);
                const optIdx = parseInt(opt.dataset.opt);
                this.selectAnswer(qIdx, optIdx);
            });
        });
    }

    selectAnswer(questionIndex, optionIndex) {
        this.userAnswers[questionIndex] = optionIndex;
        
        // Update UI to show selected
        const questionDiv = document.querySelector(`.question[data-q-index="${questionIndex}"]`);
        if (questionDiv) {
            questionDiv.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            const selectedOpt = questionDiv.querySelector(`.option[data-q="${questionIndex}"][data-opt="${optionIndex}"]`);
            if (selectedOpt) selectedOpt.classList.add('selected');
        }
    }

    submitQuiz() {
        if (this.quizSubmitted) return;
        
        let allAnswered = true;
        for (let i = 0; i < this.userAnswers.length; i++) {
            if (this.userAnswers[i] === null) {
                allAnswered = false;
                break;
            }
        }
        
        if (!allAnswered) {
            alert('Please answer all questions before submitting!');
            return;
        }
        
        this.quizSubmitted = true;
        let correctCount = 0;
        
        this.currentQuestions.forEach((q, idx) => {
            const isCorrect = this.userAnswers[idx] === q.correct;
            if (isCorrect) correctCount++;
            
            const explanationDiv = document.getElementById(`exp-${idx}`);
            explanationDiv.style.display = 'block';
            explanationDiv.innerHTML = isCorrect ? 
                `✅ Correct! ${q.explanation}` : 
                `❌ Wrong! Correct answer: ${q.options[q.correct]}. ${q.explanation}`;
        });
        
        const submitBtn = document.getElementById('submitQuiz');
        submitBtn.disabled = true;
        submitBtn.textContent = `Score: ${correctCount}/5 - Click Close to Continue`;
        
        // Store that quiz was completed
        setTimeout(() => {
            document.getElementById('closeQuizBtn').style.display = 'inline-block';
        }, 1000);
    }

    closeQuiz() {
        document.getElementById('quizOverlay').style.display = 'none';
        this.resetRound();
    }

    resetRound() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.quizMode = false;
        this.loser = null;
        this.createBoard();
        this.updateGameStatus();
    }

    addEventListeners() {
        document.getElementById('board').addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (cell && !cell.classList.contains('disabled')) {
                this.makeMove(parseInt(cell.dataset.index));
            }
        });
        
        document.getElementById('submitQuiz').addEventListener('click', () => this.submitQuiz());
    }
}

// Global function for reset
function resetGame() {
    game.scores = { X: 0, O: 0 };
    game.saveScores();
    game.resetRound();
    game.updateScoreboard();
}

// Initialize game
const game = new TicTacToeGame();
game.init();

// Add close button reference
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.className = 'close-quiz';
    closeBtn.id = 'closeQuizBtn';
    closeBtn.onclick = () => game.closeQuiz();
    closeBtn.style.display = 'none';
    document.querySelector('.quiz-container').appendChild(closeBtn);
});