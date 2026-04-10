// games/riddles.js
// Enhanced Image Riddles game with emoji/ASCII visuals

(function() {
    document.addEventListener("DOMContentLoaded", () => {
        // Load riddles data
        let riddles = [];
        if (window.riddlesCollection && Array.isArray(window.riddlesCollection)) {
            riddles = window.riddlesCollection;
        } else {
            console.error("Riddles data missing!");
            document.getElementById("riddleContainer").innerHTML = 
                "<div style='color:red; text-align:center'>⚠️ Riddle data not found. Please ensure data/riddles.js is loaded.</div>";
            return;
        }

        if (riddles.length === 0) {
            document.getElementById("riddleContainer").innerHTML = 
                "<div style='color:orange; text-align:center'>📭 No riddles available. Add some riddles to data/riddles.js</div>";
            return;
        }

        // ---------- Game State ----------
        let currentRiddleIndex = 0;
        let score = 0;
        let streak = 0;
        let hintsUsed = 0;
        let isLocked = false;
        let hintShownForCurrent = false;
        let correctAnswersGiven = new Array(riddles.length).fill(false);
        let startTime = Date.now();
        let timerInterval = null;
        let currentZoom = 1;
        
        // DOM Elements
        const riddleVisual = document.getElementById("riddleVisual");
        const guessInput = document.getElementById("guessInput");
        const submitBtn = document.getElementById("submitGuessBtn");
        const nextBtn = document.getElementById("nextRiddleBtn");
        const skipBtn = document.getElementById("skipRiddleBtn");
        const resetBtn = document.getElementById("resetGameBtn");
        const hintBtn = document.getElementById("hintBtn");
        const hintDisplay = document.getElementById("hintDisplay");
        const scoreSpan = document.getElementById("scoreValue");
        const streakSpan = document.getElementById("streakValue");
        const hintsUsedSpan = document.getElementById("hintsUsedValue");
        const timerSpan = document.getElementById("timerValue");
        const totalRiddlesSpan = document.getElementById("totalRiddles");
        const currentIdxDisplay = document.getElementById("currentIdxDisplay");
        const feedbackDiv = document.getElementById("feedbackMsg");
        const zoomInBtn = document.getElementById("zoomInBtn");
        const zoomOutBtn = document.getElementById("zoomOutBtn");

        // Initialize UI
        totalRiddlesSpan.textContent = riddles.length;
        updateStatsUI();
        startTimer();
        loadRiddle();

        // Timer Functions
        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }

        function resetTimer() {
            startTime = Date.now();
        }

        // Update UI stats
        function updateStatsUI() {
            scoreSpan.textContent = score;
            streakSpan.textContent = streak;
            hintsUsedSpan.textContent = hintsUsed;
        }

        // Load current riddle
        function loadRiddle() {
            // Reset UI state
            feedbackDiv.innerHTML = "";
            feedbackDiv.className = "feedback";
            guessInput.value = "";
            guessInput.disabled = false;
            submitBtn.disabled = false;
            hintShownForCurrent = false;
            hintDisplay.classList.add("hidden");
            hintDisplay.innerHTML = "";
            currentZoom = 1;
            if (riddleVisual) {
                riddleVisual.style.transform = `scale(${currentZoom})`;
                riddleVisual.style.fontSize = "8rem";
            }
            
            // Check if riddle already solved
            if (correctAnswersGiven[currentRiddleIndex]) {
                isLocked = true;
                guessInput.disabled = true;
                submitBtn.disabled = true;
                feedbackDiv.innerHTML = "✅ You already solved this riddle! Press Next to continue.";
                feedbackDiv.className = "feedback correct";
                nextBtn.disabled = false;
            } else {
                isLocked = false;
                nextBtn.disabled = true;
            }
            
            skipBtn.disabled = false;
            
            // Load visual representation
            const currentRiddle = riddles[currentRiddleIndex];
            if (currentRiddle && currentRiddle.visual) {
                riddleVisual.innerHTML = currentRiddle.visual.replace(/\n/g, '<br>');
                riddleVisual.style.fontFamily = "monospace";
                riddleVisual.style.fontSize = "2rem";
                riddleVisual.style.whiteSpace = "pre-wrap";
                riddleVisual.style.textAlign = "center";
                riddleVisual.style.lineHeight = "1.5";
            } else {
                riddleVisual.innerHTML = "🤔";
                riddleVisual.style.fontSize = "8rem";
            }
            
            // Update counter
            currentIdxDisplay.textContent = currentRiddleIndex + 1;
        }

        // Normalize answer
        function normalizeAnswer(input) {
            return input.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
        }

        // Check answer
        function isAnswerCorrect(guess, correctAnswer) {
            const normalizedGuess = normalizeAnswer(guess);
            const normalizedCorrect = normalizeAnswer(correctAnswer);
            return normalizedGuess === normalizedCorrect;
        }

        // Submit guess
        function onSubmitGuess() {
            if (isLocked) {
                showFeedback("This riddle is already solved! Click 'Next Riddle'.", "wrong");
                return;
            }
            
            const guess = guessInput.value;
            if (!guess.trim()) {
                showFeedback("Please enter your guess!", "wrong");
                return;
            }
            
            const currentRiddle = riddles[currentRiddleIndex];
            const correctAnswer = currentRiddle.answer;
            
            if (isAnswerCorrect(guess, correctAnswer)) {
                // Correct answer!
                if (!correctAnswersGiven[currentRiddleIndex]) {
                    correctAnswersGiven[currentRiddleIndex] = true;
                    score++;
                    streak++;
                    
                    // Bonus for not using hints
                    if (!hintShownForCurrent) {
                        showFeedback(`🎉 CORRECT! +1 point! Streak: ${streak} 🎉`, "correct");
                    } else {
                        showFeedback(`✅ Correct! (Hint used) ✅`, "correct");
                    }
                    
                    updateStatsUI();
                    
                    // Check if all riddles completed
                    if (score === riddles.length) {
                        showEndGameModal();
                        return;
                    }
                } else {
                    showFeedback(`Already solved! The answer is "${correctAnswer}".`, "info");
                }
                
                // Lock and enable next
                isLocked = true;
                guessInput.disabled = true;
                submitBtn.disabled = true;
                nextBtn.disabled = false;
            } else {
                // Wrong guess
                streak = 0;
                updateStatsUI();
                showFeedback(`❌ Wrong! "${guess}" is incorrect. Try again! Streak reset. ❌`, "wrong");
                guessInput.focus();
                guessInput.select();
            }
        }

        // Show hint
        function showHint() {
            if (isLocked) {
                showFeedback("This riddle is already solved!", "info");
                return;
            }
            
            if (hintShownForCurrent) {
                showFeedback("Hint already shown for this riddle!", "info");
                return;
            }
            
            const currentRiddle = riddles[currentRiddleIndex];
            if (currentRiddle.hint) {
                hintShownForCurrent = true;
                hintsUsed++;
                updateStatsUI();
                hintDisplay.textContent = `💡 Hint: ${currentRiddle.hint}`;
                hintDisplay.classList.remove("hidden");
                showFeedback("Hint revealed! Keep guessing!", "info");
            } else {
                showFeedback("No hint available for this riddle!", "info");
            }
        }

        // Skip current riddle
        function skipRiddle() {
            if (isLocked) {
                showFeedback("You already solved this riddle! Just move to next.", "info");
                return;
            }
            
            if (!correctAnswersGiven[currentRiddleIndex]) {
                // Penalty: lose 1 point if they have points to lose
                if (score > 0) {
                    score--;
                    showFeedback(`⏭️ Skipped! -1 point penalty.`, "info");
                } else {
                    showFeedback(`⏭️ Skipped! (No points to deduct)`, "info");
                }
                streak = 0;
                correctAnswersGiven[currentRiddleIndex] = true; // Mark as "seen" but not correct
                updateStatsUI();
                isLocked = true;
                guessInput.disabled = true;
                submitBtn.disabled = true;
                nextBtn.disabled = false;
            }
        }

        // Next riddle
        function goToNextRiddle() {
            if (!isLocked && !correctAnswersGiven[currentRiddleIndex]) {
                showFeedback("You must solve or skip the current riddle first!", "wrong");
                return;
            }
            
            if (currentRiddleIndex + 1 >= riddles.length) {
                showEndGameModal();
                return;
            }
            
            currentRiddleIndex++;
            isLocked = false;
            loadRiddle();
        }

        // Reset game
        function resetGame() {
            if (confirm("Are you sure you want to reset the game? All progress will be lost!")) {
                currentRiddleIndex = 0;
                score = 0;
                streak = 0;
                hintsUsed = 0;
                isLocked = false;
                hintShownForCurrent = false;
                correctAnswersGiven = new Array(riddles.length).fill(false);
                resetTimer();
                updateStatsUI();
                loadRiddle();
                showFeedback("Game reset! Start from the beginning.", "info");
            }
        }

        // Zoom functions
        function zoomIn() {
            if (currentZoom < 2) {
                currentZoom += 0.1;
                if (riddleVisual) {
                    riddleVisual.style.transform = `scale(${currentZoom})`;
                    riddleVisual.style.transition = "transform 0.2s";
                    if (riddleVisual.innerHTML.includes("<br>")) {
                        riddleVisual.style.fontSize = `${2 * currentZoom}rem`;
                    } else {
                        riddleVisual.style.fontSize = `${8 * currentZoom}rem`;
                    }
                }
            }
        }
        
        function zoomOut() {
            if (currentZoom > 0.5) {
                currentZoom -= 0.1;
                if (riddleVisual) {
                    riddleVisual.style.transform = `scale(${currentZoom})`;
                    riddleVisual.style.transition = "transform 0.2s";
                    if (riddleVisual.innerHTML.includes("<br>")) {
                        riddleVisual.style.fontSize = `${2 * currentZoom}rem`;
                    } else {
                        riddleVisual.style.fontSize = `${8 * currentZoom}rem`;
                    }
                }
            }
        }

        // Show feedback message
        function showFeedback(message, type) {
            feedbackDiv.innerHTML = message;
            feedbackDiv.className = `feedback ${type}`;
            setTimeout(() => {
                if (feedbackDiv.innerHTML === message && type !== "correct") {
                    setTimeout(() => {
                        if (feedbackDiv.innerHTML === message) {
                            feedbackDiv.innerHTML = "";
                            feedbackDiv.className = "feedback";
                        }
                    }, 3000);
                }
            }, 3000);
        }

        // Show end game modal with detailed stats
        function showEndGameModal() {
            if (timerInterval) clearInterval(timerInterval);
            
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(totalTime / 60);
            const seconds = totalTime % 60;
            const percentage = (score / riddles.length) * 100;
            
            let performanceMessage = "";
            if (percentage === 100) performanceMessage = "🏆 PERFECT SCORE! You're a true Dev Riddle Master! 🏆";
            else if (percentage >= 80) performanceMessage = "🌟 Excellent! You really know your tech concepts! 🌟";
            else if (percentage >= 60) performanceMessage = "👍 Good job! A bit more practice and you'll be an expert! 👍";
            else if (percentage >= 40) performanceMessage = "📚 Not bad! Keep learning and try again! 📚";
            else performanceMessage = "💪 Keep practicing! Every expert was once a beginner! 💪";
            
            const modalDiv = document.createElement('div');
            modalDiv.className = 'modal';
            modalDiv.innerHTML = `
                <div class="modal-content">
                    <h2>🏆 RIDDLE COMPLETE! 🏆</h2>
                    <div class="final-score">${score} / ${riddles.length}</div>
                    <div class="performance-message">${performanceMessage}</div>
                    <div class="stats-detail">
                        <p><strong>📊 Detailed Stats:</strong></p>
                        <p>🎯 Final Score: <strong>${score}/${riddles.length}</strong></p>
                        <p>🔥 Best Streak: <strong>${streak}</strong></p>
                        <p>💡 Hints Used: <strong>${hintsUsed}</strong></p>
                        <p>⏱️ Total Time: <strong>${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</strong></p>
                        <p>📈 Accuracy: <strong>${Math.round((score/riddles.length)*100)}%</strong></p>
                    </div>
                    <button id="playAgainBtn" class="play-again">🔄 PLAY AGAIN</button>
                </div>
            `;
            document.body.appendChild(modalDiv);
            
            document.getElementById('playAgainBtn').addEventListener('click', () => {
                resetGame();
                modalDiv.remove();
                startTimer();
            });
        }

        // Event listeners
        submitBtn.addEventListener("click", onSubmitGuess);
        nextBtn.addEventListener("click", goToNextRiddle);
        skipBtn.addEventListener("click", skipRiddle);
        resetBtn.addEventListener("click", resetGame);
        hintBtn.addEventListener("click", showHint);
        zoomInBtn.addEventListener("click", zoomIn);
        zoomOutBtn.addEventListener("click", zoomOut);
        
        guessInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") onSubmitGuess();
        });
    });
})();