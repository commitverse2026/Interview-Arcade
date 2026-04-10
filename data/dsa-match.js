// DSA Match the Following Game Logic
// This file handles the matching game functionality

let terms = [];
let definitions = [];
let matches = new Map();
let submitted = false;
let finalScore = 0;
let selectedTerm = null;
let selectedDef = null;

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function initGame() {
    terms = DSA_PAIRS.map((item, idx) => ({
        id: idx,
        text: item.term,
        correctDefId: idx
    }));
    
    let defsRaw = DSA_PAIRS.map((item, idx) => ({
        id: idx,
        text: item.definition,
        belongsToTerm: idx
    }));
    
    definitions = shuffleArray([...defsRaw]);
    matches.clear();
    submitted = false;
    finalScore = 0;
    selectedTerm = null;
    selectedDef = null;
    
    render();
}

function calculateScore() {
    let correct = 0;
    for (let [termId, defId] of matches.entries()) {
        const term = terms.find(t => t.id === termId);
        const def = definitions.find(d => d.id === defId);
        if (term && def && term.correctDefId === def.belongsToTerm) {
            correct++;
        }
    }
    return correct;
}

function handleTermClick(termId) {
    if (submitted) return;
    
    if (matches.has(termId)) {
        matches.delete(termId);
        selectedTerm = null;
        selectedDef = null;
        render();
        return;
    }
    
    if (selectedDef !== null) {
        let existingTerm = null;
        for (let [tId, dId] of matches.entries()) {
            if (dId === selectedDef) {
                existingTerm = tId;
                break;
            }
        }
        if (existingTerm !== null) {
            matches.delete(existingTerm);
        }
        matches.set(termId, selectedDef);
        selectedDef = null;
        selectedTerm = null;
        render();
    } else {
        selectedTerm = termId;
        selectedDef = null;
        render();
    }
}

function handleDefClick(defId) {
    if (submitted) return;
    
    let existingTerm = null;
    for (let [tId, dId] of matches.entries()) {
        if (dId === defId) {
            existingTerm = tId;
            break;
        }
    }
    if (existingTerm !== null) {
        matches.delete(existingTerm);
        selectedTerm = null;
        selectedDef = null;
        render();
        return;
    }
    
    if (selectedTerm !== null) {
        matches.set(selectedTerm, defId);
        selectedTerm = null;
        selectedDef = null;
        render();
    } else {
        selectedDef = defId;
        selectedTerm = null;
        render();
    }
}

function submitMatches() {
    if (submitted) return;
    submitted = true;
    finalScore = calculateScore();
    render();
}

function resetGame() {
    initGame();
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    const totalTerms = terms.length;
    
    let termsHtml = '';
    terms.forEach(term => {
        let additionalClass = '';
        const matchedDef = matches.get(term.id);
        
        if (submitted && matchedDef !== undefined) {
            const def = definitions.find(d => d.id === matchedDef);
            const isCorrect = (term.correctDefId === def?.belongsToTerm);
            additionalClass = isCorrect ? 'matched-correct' : 'matched-wrong';
        } else if (matchedDef !== undefined && !submitted) {
            additionalClass = 'selected';
        } else if (selectedTerm === term.id && !submitted) {
            additionalClass = 'selected';
        }
        
        termsHtml += `
            <div class="term-item ${additionalClass}" data-term-id="${term.id}">
                <div class="badge">${String.fromCharCode(65 + term.id)}</div>
                <div style="flex:1"><strong>${escapeHtml(term.text)}</strong></div>
            </div>
        `;
    });
    
    let defsHtml = '';
    definitions.forEach((def, idx) => {
        let additionalClass = '';
        let isMatched = false;
        let matchedTerm = null;
        
        for (let [tId, dId] of matches.entries()) {
            if (dId === def.id) {
                isMatched = true;
                matchedTerm = tId;
                break;
            }
        }
        
        if (submitted && isMatched) {
            const term = terms.find(t => t.id === matchedTerm);
            const isCorrect = (term?.correctDefId === def.belongsToTerm);
            additionalClass = isCorrect ? 'matched-correct' : 'matched-wrong';
        } else if (isMatched && !submitted) {
            additionalClass = 'selected';
        } else if (selectedDef === def.id && !submitted) {
            additionalClass = 'selected';
        }
        
        defsHtml += `
            <div class="def-item ${additionalClass}" data-def-id="${def.id}">
                <div class="badge">${idx + 1}</div>
                <div style="flex:1">${escapeHtml(def.text)}</div>
            </div>
        `;
    });
    
    let resultHtml = '';
    if (submitted) {
        const percentage = Math.round((finalScore / totalTerms) * 100);
        let message = '';
        if (percentage === 100) message = '🏆 Perfect! Master of DSA!';
        else if (percentage >= 75) message = '🎉 Great job! Almost there!';
        else if (percentage >= 50) message = '📚 Good attempt! Keep learning!';
        else message = '💪 Keep practicing! Review the correct matches above.';
        
        resultHtml = `
            <div class="result">
                <h3>📊 Final Result</h3>
                <div class="final-score">${finalScore} / ${totalTerms}</div>
                <div style="margin-top: 10px;">${message}</div>
                <div style="margin-top: 10px; font-size: 0.9rem;">✅ Green = Correct | ❌ Red = Incorrect</div>
            </div>
        `;
    }
    
    let feedbackHtml = '';
    if (!submitted && matches.size > 0) {
        feedbackHtml = `<div class="feedback">📌 You've made ${matches.size} pair(s). Click Submit to check your answers!</div>`;
    } else if (!submitted) {
        feedbackHtml = `<div class="feedback">💡 Click a term, then click a definition to match them. Matched pairs will be highlighted.</div>`;
    } else {
        feedbackHtml = `<div class="feedback">✨ Game completed! Click Reset to play again or try a new match.</div>`;
    }
    
    const html = `
        <div class="header">
            <div>
                <h1>📚 DSA Match the Following</h1>
                <p>Match each data structure with its correct definition</p>
            </div>
            <div class="score-box">
                ${submitted ? '🎯 FINAL SCORE' : '🔗 PAIRS MADE'} <span>${submitted ? finalScore + '/' + totalTerms : matches.size + '/' + totalTerms}</span>
            </div>
        </div>
        <div class="game-area">
            <div class="column">
                <h2>📌 DSA TERMS</h2>
                <div class="items-list" id="termsList">
                    ${termsHtml}
                </div>
            </div>
            <div class="column">
                <h2>⚙️ DEFINITIONS</h2>
                <div class="items-list" id="defsList">
                    ${defsHtml}
                </div>
            </div>
        </div>
        <div class="buttons">
            <button class="btn-submit" id="submitBtn" ${submitted ? 'disabled' : ''}>✅ SUBMIT MATCHES</button>
            <button class="btn-reset" id="resetBtn">🔄 RESET GAME</button>
        </div>
        ${feedbackHtml}
        ${resultHtml}
        <footer>
            🎓 Data Structures & Algorithms • Click term → click definition to pair • Green = Correct | Red = Incorrect
        </footer>
    `;
    
    app.innerHTML = html;
    
    // Attach event listeners
    document.querySelectorAll('.term-item').forEach(el => {
        const termId = parseInt(el.dataset.termId);
        el.addEventListener('click', () => handleTermClick(termId));
    });
    
    document.querySelectorAll('.def-item').forEach(el => {
        const defId = parseInt(el.dataset.defId);
        el.addEventListener('click', () => handleDefClick(defId));
    });
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.addEventListener('click', submitMatches);
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetGame);
}

// Make functions available globally
window.handleTermClick = handleTermClick;
window.handleDefClick = handleDefClick;
window.submitMatches = submitMatches;
window.resetGame = resetGame;
window.initGame = initGame;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof DSA_PAIRS !== 'undefined') {
            initGame();
        }
    });
} else {
    if (typeof DSA_PAIRS !== 'undefined') {
        initGame();
    }
}