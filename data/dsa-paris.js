<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>DSA Match-Up | Data Structures & Algorithms</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', system-ui, 'Segoe UI', 'Poppins', sans-serif;
        }

        body {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
            padding: 1.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .match-container {
            max-width: 1300px;
            width: 100%;
            background: rgba(255,255,255,0.95);
            border-radius: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4);
            overflow: hidden;
        }

        .match-header {
            background: #0f212e;
            color: white;
            padding: 1.2rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .title h1 {
            font-size: 1.7rem;
            font-weight: 700;
            letter-spacing: -0.3px;
        }

        .title p {
            font-size: 0.8rem;
            opacity: 0.8;
            margin-top: 0.2rem;
        }

        .score-area {
            background: #2c4f6e;
            padding: 0.5rem 1.2rem;
            border-radius: 40px;
            font-weight: 600;
            font-size: 1.2rem;
        }

        .score-area span {
            font-size: 1.8rem;
            font-weight: 800;
            margin-left: 0.5rem;
            color: #facc15;
        }

        .match-main {
            padding: 2rem 1.8rem 1.8rem;
        }

        .columns-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            justify-content: center;
        }

        .column {
            flex: 1;
            min-width: 260px;
            background: #f8fafc;
            border-radius: 1.5rem;
            padding: 1rem;
            box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .column h3 {
            text-align: center;
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 1.2rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #f59e0b;
            display: inline-block;
            width: 100%;
            color: #0f172a;
        }

        .terms-list, .defs-list {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }

        .term-card, .def-card {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 1rem;
            padding: 0.9rem 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }

        .term-card:hover, .def-card:hover {
            background: #fef9e3;
            border-color: #f59e0b;
            transform: translateX(4px);
        }

        .term-card.selected, .def-card.selected {
            background: #fef3c7;
            border-color: #f59e0b;
            box-shadow: 0 4px 10px rgba(245,158,11,0.2);
        }

        .term-card.matched-correct, .def-card.matched-correct {
            background: #d1fae5;
            border-color: #10b981;
            opacity: 0.8;
            cursor: default;
        }

        .term-card.matched-wrong, .def-card.matched-wrong {
            background: #fee2e2;
            border-color: #ef4444;
            text-decoration: line-through;
            opacity: 0.8;
        }

        .term-card.matched-correct::after, .def-card.matched-correct::after {
            content: "✓";
            margin-left: auto;
            font-weight: bold;
            color: #059669;
            font-size: 1.2rem;
        }

        .term-card.matched-wrong::after {
            content: "✗";
            margin-left: auto;
            color: #b91c1c;
            font-weight: bold;
        }

        .prefix-badge {
            background: #cbd5e1;
            width: 32px;
            height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 30px;
            font-weight: 800;
            color: #0f172a;
        }

        .action-buttons {
            display: flex;
            justify-content: center;
            gap: 1.2rem;
            margin: 2rem 0 1rem;
            flex-wrap: wrap;
        }

        .btn {
            padding: 0.7rem 2rem;
            font-weight: 600;
            font-size: 1rem;
            border: none;
            border-radius: 3rem;
            cursor: pointer;
            transition: 0.2s;
            background: #e2e8f0;
            color: #1e293b;
        }

        .btn-primary {
            background: #f59e0b;
            color: #0f172a;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .btn-primary:hover {
            background: #d97706;
            transform: scale(0.97);
            color: white;
        }

        .btn-secondary {
            background: #334155;
            color: white;
        }

        .btn-secondary:hover {
            background: #1e293b;
        }

        .feedback-area {
            background: #f1f5f9;
            margin-top: 1.5rem;
            border-radius: 1rem;
            padding: 0.8rem 1.2rem;
            text-align: center;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .result-panel {
            background: #eef2ff;
            border-radius: 1.2rem;
            padding: 1rem;
            text-align: center;
            margin-top: 1rem;
        }

        footer {
            background: #e9eef3;
            text-align: center;
            padding: 0.8rem;
            font-size: 0.7rem;
            color: #475569;
        }

        @media (max-width: 750px) {
            .match-main {
                padding: 1rem;
            }
            .term-card, .def-card {
                padding: 0.7rem;
            }
        }

        .disabled-click {
            pointer-events: none;
            opacity: 0.9;
        }
    </style>
</head>
<body>
<div class="match-container" id="dsaMatchRoot">
    <div id="matchAppDynamic"></div>
</div>

<script>
    window.DSA_PAIRS = [
        { term: "Binary Search Tree", definition: "Tree where left child < parent < right child; In-order traversal gives sorted order." },
        { term: "Hash Table", definition: "Data structure mapping keys to values using a hash function; average O(1) lookup." },
        { term: "Stack", definition: "LIFO (Last In First Out) data structure; supports push/pop in O(1)." },
        { term: "Queue", definition: "FIFO (First In First Out) data structure; enqueue at rear, dequeue from front." },
        { term: "Linked List", definition: "Linear collection of nodes; each node points to next; dynamic size." },
        { term: "Heap (Priority Queue)", definition: "Complete binary tree where parent is >= (max-heap) or <= (min-heap) children." },
        { term: "Graph (Adjacency List)", definition: "Vertices connected by edges; representation using lists for each vertex." },
        { term: "Trie", definition: "Prefix tree used for efficient string retrieval and auto-completion." }
    ];

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    let originalPairs = [];
    let currentTerms = [];
    let currentDefinitions = [];
    let userMatches = new Map();
    let submitted = false;
    let score = 0;
    let appContainer = null;
    let selectedTermIndex = null;
    let selectedDefIndex = null;

    function initData() {
        originalPairs = window.DSA_PAIRS ? [...window.DSA_PAIRS] : [];
        currentTerms = originalPairs.map((pair, idx) => ({
            term: pair.term,
            originalIndex: idx,
            correctDefIndex: idx
        }));
        let defsRaw = originalPairs.map((pair, idx) => ({
            definition: pair.definition,
            belongsToTermIdx: idx
        }));
        currentDefinitions = shuffleArray([...defsRaw]);
        userMatches.clear();
        submitted = false;
        score = 0;
        selectedTermIndex = null;
        selectedDefIndex = null;
    }

    function escapeHtml(str) {
        if(!str) return "";
        return str.replace(/[&<>]/g, function(m) {
            if(m === '&') return '&amp;';
            if(m === '<') return '&lt;';
            if(m === '>') return '&gt;';
            return m;
        });
    }

    function getPerformanceMessage(score, total) {
        let percent = (score/total)*100;
        if(percent === 100) return "🏅 Mastery: Perfect match! You're a DSA Pro.";
        if(percent >= 75) return "👍 Great job! Strong understanding of DSA concepts.";
        if(percent >= 50) return "📖 Good attempt! Review the wrong pairs and try again.";
        return "🔄 Keep practicing! Use reset & match again to improve.";
    }

    function renderMatch() {
        if (!appContainer) return;
        const totalTerms = currentTerms.length;
        
        let termsHtml = '';
        currentTerms.forEach((termItem, tIdx) => {
            let matchedDefIdx = userMatches.get(tIdx);
            let additionalClass = '';
            if (submitted && matchedDefIdx !== undefined) {
                const isCorrect = (termItem.correctDefIndex === currentDefinitions[matchedDefIdx]?.belongsToTermIdx);
                if (isCorrect) {
                    additionalClass = 'matched-correct';
                } else {
                    additionalClass = 'matched-wrong';
                }
            } else if (matchedDefIdx !== undefined && !submitted) {
                additionalClass = 'selected';
            }
            termsHtml += `
                <div class="term-card ${additionalClass}" data-term-index="${tIdx}">
                    <span class="prefix-badge">${String.fromCharCode(65+tIdx)}</span>
                    <span style="flex:1;"><strong>${escapeHtml(termItem.term)}</strong></span>
                </div>
            `;
        });

        let defsHtml = '';
        currentDefinitions.forEach((defItem, dIdx) => {
            let additionalClass = '';
            let matchTermIdx = null;
            for (let [termIdx, defIdx] of userMatches.entries()) {
                if (defIdx === dIdx) {
                    matchTermIdx = termIdx;
                    break;
                }
            }
            if (submitted && matchTermIdx !== null) {
                const termObj = currentTerms[matchTermIdx];
                const isCorrect = (termObj.correctDefIndex === defItem.belongsToTermIdx);
                if (isCorrect) {
                    additionalClass = 'matched-correct';
                } else {
                    additionalClass = 'matched-wrong';
                }
            } else if (matchTermIdx !== null && !submitted) {
                additionalClass = 'selected';
            }
            defsHtml += `
                <div class="def-card ${additionalClass}" data-def-index="${dIdx}">
                    <span class="prefix-badge">${dIdx+1}</span>
                    <span style="flex:1;">${escapeHtml(defItem.definition)}</span>
                </div>
            `;
        });

        const finalResultHtml = submitted ? `
            <div class="result-panel">
                🎯 <strong>Final Score: ${score} / ${totalTerms}</strong><br>
                ${getPerformanceMessage(score, totalTerms)}
            </div>
        ` : '';

        const html = `
            <div class="match-header">
                <div class="title">
                    <h1>📚 DSA Match the Following</h1>
                    <p>click term → click definition (or vice versa) to pair • submit to check</p>
                </div>
                <div class="score-area">
                    ${submitted ? '🏆 SCORE' : '🔗 PAIRS'} <span>${submitted ? `${score}/${totalTerms}` : `${userMatches.size}/${totalTerms}`}</span>
                </div>
            </div>
            <div class="match-main">
                <div class="columns-wrapper">
                    <div class="column">
                        <h3>📌 DSA TERMS</h3>
                        <div class="terms-list" id="termsList">
                            ${termsHtml}
                        </div>
                    </div>
                    <div class="column">
                        <h3>⚙️ DEFINITIONS (shuffled)</h3>
                        <div class="defs-list" id="defsList">
                            ${defsHtml}
                        </div>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" id="submitMatchBtn" ${submitted ? 'disabled' : ''}>✅ Submit Matches</button>
                    <button class="btn btn-secondary" id="resetMatchBtn">🔄 Reset Game</button>
                    ${submitted ? '<button class="btn btn-secondary" id="newGameBtn">🎮 New Match (reshuffle)</button>' : ''}
                </div>
                <div class="feedback-area" id="feedbackMsg">
                    ${submitted ? `✨ Matching completed! ${score}/${totalTerms} correct.` : '💡 Click a term, then a definition to pair them. Unmatched items remain clickable.'}
                </div>
                ${finalResultHtml}
            </div>
            <footer>🎓 Data Structures & Algorithms • Match each term with its correct definition</footer>
        `;
        appContainer.innerHTML = html;

        if (!submitted) {
            attachMatchingEvents();
        } else {
            document.querySelectorAll('.term-card, .def-card').forEach(el => {
                el.style.pointerEvents = 'none';
                el.classList.add('disabled-click');
            });
        }

        const submitBtn = document.getElementById('submitMatchBtn');
        if (submitBtn) submitBtn.addEventListener('click', onSubmitMatches);
        const resetBtn = document.getElementById('resetMatchBtn');
        if (resetBtn) resetBtn.addEventListener('click', () => resetAndRestart(false));
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) newGameBtn.addEventListener('click', () => resetAndRestart(true));
    }

    function attachMatchingEvents() {
        selectedTermIndex = null;
        selectedDefIndex = null;
        
        const termCards = document.querySelectorAll('.term-card');
        const defCards = document.querySelectorAll('.def-card');
        
        function clearSelectionHighlights() {
            termCards.forEach(card => card.classList.remove('selected'));
            defCards.forEach(card => card.classList.remove('selected'));
        }
        
        function termClickHandler(e) {
            if (submitted) return;
            const termIdx = parseInt(this.dataset.termIndex);
            if (userMatches.has(termIdx)) {
                userMatches.delete(termIdx);
                selectedTermIndex = null;
                selectedDefIndex = null;
                clearSelectionHighlights();
                renderMatch();
                return;
            }
            if (selectedDefIndex !== null) {
                const defIdx = selectedDefIndex;
                let alreadyPairedWithTerm = null;
                for (let [tIdx, dIdx] of userMatches.entries()) {
                    if (dIdx === defIdx) {
                        alreadyPairedWithTerm = tIdx;
                        break;
                    }
                }
                if (alreadyPairedWithTerm !== null) {
                    userMatches.delete(alreadyPairedWithTerm);
                }
                userMatches.set(termIdx, defIdx);
                selectedDefIndex = null;
                clearSelectionHighlights();
                renderMatch();
            } else {
                clearSelectionHighlights();
                this.classList.add('selected');
                selectedTermIndex = termIdx;
                selectedDefIndex = null;
            }
        }
        
        function defClickHandler(e) {
            if (submitted) return;
            const defIdx = parseInt(this.dataset.defIndex);
            let existingTermForDef = null;
            for (let [tIdx, dIdx] of userMatches.entries()) {
                if (dIdx === defIdx) {
                    existingTermForDef = tIdx;
                    break;
                }
            }
            if (existingTermForDef !== null) {
                userMatches.delete(existingTermForDef);
                selectedTermIndex = null;
                selectedDefIndex = null;
                clearSelectionHighlights();
                renderMatch();
                return;
            }
            if (selectedTermIndex !== null) {
                const termIdx = selectedTermIndex;
                if (userMatches.has(termIdx)) userMatches.delete(termIdx);
                userMatches.set(termIdx, defIdx);
                selectedTermIndex = null;
                clearSelectionHighlights();
                renderMatch();
            } else {
                clearSelectionHighlights();
                this.classList.add('selected');
                selectedDefIndex = defIdx;
                selectedTermIndex = null;
            }
        }
        
        termCards.forEach(card => {
            card.removeEventListener('click', termClickHandler);
            card.addEventListener('click', termClickHandler);
        });
        
        defCards.forEach(card => {
            card.removeEventListener('click', defClickHandler);
            card.addEventListener('click', defClickHandler);
        });
    }
    
    function onSubmitMatches() {
        if (submitted) return;
        let correctCount = 0;
        for (let [termIdx, defIdx] of userMatches.entries()) {
            const termObj = currentTerms[termIdx];
            const defObj = currentDefinitions[defIdx];
            if (defObj && termObj.correctDefIndex === defObj.belongsToTermIdx) {
                correctCount++;
            }
        }
        score = correctCount;
        submitted = true;
        
        const total = currentTerms.length;
        let feedbackDetail = `🎯 You matched ${score} out of ${total} correctly. `;
        if (score === total) {
            feedbackDetail += "Perfect! 🎉 Excellent DSA knowledge!";
        } else {
            feedbackDetail += "Review the highlighted red pairs and try again after reset.";
        }
        const feedbackDiv = document.getElementById('feedbackMsg');
        if (feedbackDiv) feedbackDiv.innerHTML = feedbackDetail;
        
        renderMatch();
    }
    
    function resetAndRestart(reshuffleDefs = true) {
        if (reshuffleDefs) {
            initData();
        } else {
            userMatches.clear();
            submitted = false;
            score = 0;
            selectedTermIndex = null;
            selectedDefIndex = null;
            renderMatch();
            return;
        }
        renderMatch();
    }
    
    function initApp() {
        const root = document.getElementById("dsaMatchRoot");
        if(!root) return;
        const dynamicDiv = document.createElement("div");
        dynamicDiv.id = "matchAppDynamic";
        root.appendChild(dynamicDiv);
        appContainer = dynamicDiv;
        initData();
        renderMatch();
    }
    
    initApp();
</script>
</body>
</html>
       