(function () {
  'use strict';

  var WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  var state = {
    board: Array(9).fill(''),
    current: 'X',
    gameOver: false,
    winner: null,
    scores: { xWins: 0, oWins: 0, xQuiz: 0, oQuiz: 0 },
    round: 1,
    pendingQuiz: false,
    loser: null,
    quizQueue: [],
    quizIndex: 0,
    awaitingContinue: false
  };

  var els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function pickFiveQuestions() {
    var pool = window.OOP_QUESTIONS || [];
    if (pool.length === 0) {
      return [];
    }
    if (pool.length <= 5) {
      return shuffle(pool);
    }
    return shuffle(pool).slice(0, 5);
  }

  function checkWinner(board) {
    for (var i = 0; i < WIN_LINES.length; i++) {
      var line = WIN_LINES[i];
      var a = line[0];
      var b = line[1];
      var c = line[2];
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a];
      }
    }
    if (board.every(function (cell) { return cell !== ''; })) {
      return 'draw';
    }
    return null;
  }

  function renderBoard() {
    els.board.innerHTML = '';
    for (var i = 0; i < 9; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cell';
      btn.setAttribute('role', 'gridcell');
      var mark = state.board[i];
      if (mark === 'X') {
        btn.textContent = 'X';
        btn.classList.add('x');
      } else if (mark === 'O') {
        btn.textContent = 'O';
        btn.classList.add('o');
      } else {
        btn.textContent = '';
      }
      btn.disabled = state.gameOver || mark !== '' || state.pendingQuiz;
      btn.dataset.index = String(i);
      btn.addEventListener('click', onCellClick);
      els.board.appendChild(btn);
    }
  }

  function updateScoreUI() {
    $('scoreX').textContent = String(state.scores.xWins);
    $('scoreO').textContent = String(state.scores.oWins);
    $('quizX').textContent = 'Quiz correct: ' + state.scores.xQuiz;
    $('quizO').textContent = 'Quiz correct: ' + state.scores.oQuiz;
  }

  function setStatus(html) {
    els.status.innerHTML = html;
  }

  function refreshStatus() {
    if (state.pendingQuiz) {
      setStatus('Answer the OOP questions to start the next round.');
      return;
    }
    if (state.gameOver) {
      if (state.winner === 'draw') {
        setStatus('Draw. No quiz this time. Click <strong>Next round</strong> to play again.');
      } else {
        var loserName = state.winner === 'X' ? 'Player O' : 'Player X';
        setStatus('Round won by <strong>' + (state.winner === 'X' ? 'Player X' : 'Player O') + '</strong>. ' + loserName + ' faces the OOP quiz.');
      }
      return;
    }
    var turnClass = state.current === 'X' ? 'turn-x' : 'turn-o';
    var name = state.current === 'X' ? 'Player X' : 'Player O';
    setStatus('Turn: <span class="' + turnClass + '">' + name + '</span> (' + state.current + ')');
  }

  function onCellClick(e) {
    var idx = parseInt(e.currentTarget.dataset.index, 10);
    if (state.gameOver || state.board[idx] !== '') return;

    state.board[idx] = state.current;
    var outcome = checkWinner(state.board);

    if (outcome === 'X' || outcome === 'O') {
      state.gameOver = true;
      state.winner = outcome;
      if (outcome === 'X') state.scores.xWins++;
      else state.scores.oWins++;
      state.pendingQuiz = true;
      state.loser = outcome === 'X' ? 'O' : 'X';
      state.quizQueue = pickFiveQuestions();
      state.quizIndex = 0;
      renderBoard();
      updateScoreUI();
      refreshStatus();
      els.btnNextRound.disabled = true;
      openQuiz();
      return;
    }

    if (outcome === 'draw') {
      state.gameOver = true;
      state.winner = 'draw';
      state.pendingQuiz = false;
      renderBoard();
      refreshStatus();
      els.btnNextRound.disabled = false;
      return;
    }

    state.current = state.current === 'X' ? 'O' : 'X';
    renderBoard();
    refreshStatus();
  }

  function openQuiz() {
    if (!state.quizQueue.length) {
      els.quizQuestion.textContent = 'No questions loaded. Add items to data/questions.js.';
      els.quizOptions.innerHTML = '';
      els.quizFeedback.textContent = '';
      els.quizFeedback.classList.remove('visible');
      els.quizContinue.classList.remove('is-hidden');
      state.awaitingContinue = true;
      els.quizOverlay.classList.add('open');
      $('quizTitle').textContent = 'OOP quiz';
      $('quizMeta').textContent = '';
      return;
    }
    showQuestionAt(0);
    els.quizOverlay.classList.add('open');
  }

  function showQuestionAt(i) {
    state.quizIndex = i;
    state.awaitingContinue = false;
    var q = state.quizQueue[i];
    var loserLabel = state.loser === 'X' ? 'Player X' : 'Player O';
    $('quizTitle').textContent = 'OOP challenge for ' + loserLabel;
    $('quizMeta').textContent = 'Question ' + (i + 1) + ' of ' + state.quizQueue.length + ' · Round ' + state.round;

    els.quizQuestion.textContent = q.q;
    els.quizOptions.innerHTML = '';
    els.quizFeedback.textContent = '';
    els.quizFeedback.classList.remove('visible');
    els.quizContinue.classList.add('is-hidden');

    for (var o = 0; o < q.options.length; o++) {
      (function (optIndex) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.textContent = q.options[optIndex];
        b.addEventListener('click', function () {
          onOptionPick(optIndex);
        });
        els.quizOptions.appendChild(b);
      })(o);
    }
  }

  function onOptionPick(optIndex) {
    if (state.awaitingContinue) return;

    var q = state.quizQueue[state.quizIndex];
    var buttons = els.quizOptions.querySelectorAll('.opt');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }

    if (optIndex === q.correct) {
      buttons[optIndex].classList.add('correct');
      if (state.loser === 'X') state.scores.xQuiz++;
      else state.scores.oQuiz++;
      updateScoreUI();
      state.awaitingContinue = true;
      els.quizContinue.classList.remove('is-hidden');
      if (state.quizIndex >= state.quizQueue.length - 1) {
        els.quizContinue.textContent = 'Finish & next round';
      } else {
        els.quizContinue.textContent = 'Next question';
      }
    } else {
      buttons[optIndex].classList.add('wrong');
      buttons[q.correct].classList.add('correct');
      els.quizFeedback.textContent = q.explanation || 'Review the concept and try the next question.';
      els.quizFeedback.classList.add('visible');
      state.awaitingContinue = true;
      els.quizContinue.classList.remove('is-hidden');
      if (state.quizIndex >= state.quizQueue.length - 1) {
        els.quizContinue.textContent = 'Finish & next round';
      } else {
        els.quizContinue.textContent = 'Continue';
      }
    }
  }

  function onQuizContinue() {
    if (!state.awaitingContinue) return;

    if (state.quizIndex >= state.quizQueue.length - 1) {
      closeQuizAndEnableNext();
      return;
    }
    showQuestionAt(state.quizIndex + 1);
  }

  function closeQuizAndEnableNext() {
    els.quizOverlay.classList.remove('open');
    state.pendingQuiz = false;
    state.loser = null;
    state.quizQueue = [];
    state.quizIndex = 0;
    state.awaitingContinue = false;
    els.btnNextRound.disabled = false;
    refreshStatus();
    setStatus('Quiz complete. Click <strong>Next round</strong> to play again.');
  }

  function nextRound() {
    state.board = Array(9).fill('');
    state.current = 'X';
    state.gameOver = false;
    state.winner = null;
    state.pendingQuiz = false;
    state.round++;
    els.btnNextRound.disabled = true;
    renderBoard();
    refreshStatus();
  }

  function init() {
    els.board = $('board');
    els.status = $('status');
    els.btnNextRound = $('btnNextRound');
    els.quizOverlay = $('quizOverlay');
    els.quizQuestion = $('quizQuestion');
    els.quizOptions = $('quizOptions');
    els.quizFeedback = $('quizFeedback');
    els.quizContinue = $('quizContinue');

    els.btnNextRound.addEventListener('click', nextRound);
    els.quizContinue.addEventListener('click', onQuizContinue);

    els.quizOverlay.addEventListener('click', function (ev) {
      if (ev.target === els.quizOverlay && state.pendingQuiz) {
        /* keep modal; no dismiss by backdrop until quiz done */
      }
    });

    renderBoard();
    updateScoreUI();
    refreshStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
