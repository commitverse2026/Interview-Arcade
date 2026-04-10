(function () {
  'use strict';

  var SECONDS_PER_QUESTION = 60;

  var state = {
    order: [],
    index: 0,
    score: 0,
    lock: false,
    questionTimerId: null,
    secondsLeft: SECONDS_PER_QUESTION,
    totalStart: null,
    totalTickId: null
  };

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

  function getPool() {
    var pool = window.APTITUDE_QUESTIONS || [];
    return pool.length ? pool : [];
  }

  function formatClock(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }
    return pad(m) + ':' + pad(s);
  }

  function clearQuestionTimer() {
    if (state.questionTimerId !== null) {
      window.clearInterval(state.questionTimerId);
      state.questionTimerId = null;
    }
  }

  function clearTotalTimer() {
    if (state.totalTickId !== null) {
      window.clearInterval(state.totalTickId);
      state.totalTickId = null;
    }
  }

  function updateTotalElapsed() {
    if (state.totalStart === null) return;
    var elapsed = Math.floor((Date.now() - state.totalStart) / 1000);
    $('totalTime').textContent = formatClock(elapsed);
  }

  function startTotalTimer() {
    state.totalStart = Date.now();
    $('totalTime').textContent = '00:00';
    state.totalTickId = window.setInterval(updateTotalElapsed, 500);
  }

  function startQuestionTimer() {
    clearQuestionTimer();
    state.secondsLeft = SECONDS_PER_QUESTION;
    $('qTimer').textContent = String(state.secondsLeft);
    $('timerBar').style.width = '100%';

    state.questionTimerId = window.setInterval(function () {
      state.secondsLeft--;
      $('qTimer').textContent = String(Math.max(0, state.secondsLeft));
      var pct = (state.secondsLeft / SECONDS_PER_QUESTION) * 100;
      $('timerBar').style.width = pct + '%';

      if (state.secondsLeft <= 0) {
        clearQuestionTimer();
        onTimeout();
      }
    }, 1000);
  }

  function showPanel(name) {
    $('panelQuiz').hidden = name !== 'quiz';
    $('panelIntro').hidden = name !== 'intro';
    $('panelResult').hidden = name !== 'result';
  }

  function performanceSummary(pct) {
    if (pct >= 90) {
      return { label: 'Excellent', text: 'Strong reasoning and speed. Keep practicing harder sets to stay sharp.' };
    }
    if (pct >= 75) {
      return { label: 'Good', text: 'Solid performance. Review missed topics and aim for consistency under time pressure.' };
    }
    if (pct >= 60) {
      return { label: 'Fair', text: 'You have the basics—focus on accuracy and pacing on timed drills.' };
    }
    return { label: 'Needs practice', text: 'Build fundamentals with untimed practice first, then return to timed mode.' };
  }

  function showResults() {
    clearQuestionTimer();
    clearTotalTimer();
    var total = state.order.length;
    var pct = total === 0 ? 0 : Math.round((state.score / total) * 100);
    var sum = performanceSummary(pct);

    $('resultScore').textContent = state.score + ' / ' + total;
    $('resultPct').textContent = String(pct) + '%';
    $('resultLabel').textContent = sum.label;
    $('resultBlurb').textContent = sum.text;

    var elapsedSec = state.totalStart === null ? 0 : Math.floor((Date.now() - state.totalStart) / 1000);
    $('resultTime').textContent = formatClock(elapsedSec);

    if (typeof IAStorage !== 'undefined' && IAStorage.recordModule) {
      IAStorage.recordModule('aptitude', {
        addAttempts: 1,
        addCompletions: 1,
        scorePercent: pct
      });
    }

    showPanel('result');
  }

  function renderQuestion() {
    var pool = getPool();
    if (state.index >= state.order.length) {
      showResults();
      return;
    }

    var qi = state.order[state.index];
    var q = pool[qi];

    $('qProgress').textContent = 'Question ' + (state.index + 1) + ' of ' + state.order.length;
    $('qText').textContent = q.q;
    $('feedback').hidden = true;
    $('btnNext').classList.add('is-hidden');

    var opts = $('options');
    opts.innerHTML = '';
    state.lock = false;

    for (var o = 0; o < q.options.length; o++) {
      (function (optIndex) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.textContent = q.options[optIndex];
        b.addEventListener('click', function () {
          onPick(optIndex);
        });
        opts.appendChild(b);
      })(o);
    }

    startQuestionTimer();
  }

  function onTimeout() {
    if (state.lock) return;
    state.lock = true;
    var pool = getPool();
    var qi = state.order[state.index];
    var q = pool[qi];

    var buttons = $('options').querySelectorAll('.opt');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
    buttons[q.correct].classList.add('correct');

    $('feedback').textContent = 'Time\'s up. ' + (q.explanation || '');
    $('feedback').hidden = false;
    $('btnNext').classList.remove('is-hidden');
    $('btnNext').textContent =
      state.index + 1 >= state.order.length ? 'See results' : 'Next question';
  }

  function onPick(optIndex) {
    if (state.lock) return;
    clearQuestionTimer();
    state.lock = true;

    var pool = getPool();
    var qi = state.order[state.index];
    var q = pool[qi];

    var buttons = $('options').querySelectorAll('.opt');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }

    if (optIndex === q.correct) {
      buttons[optIndex].classList.add('correct');
      state.score++;
      $('feedback').textContent = 'Correct.';
      $('feedback').hidden = false;
    } else {
      buttons[optIndex].classList.add('wrong');
      buttons[q.correct].classList.add('correct');
      $('feedback').textContent = q.explanation || 'Review the reasoning and continue.';
      $('feedback').hidden = false;
    }

    $('btnNext').classList.remove('is-hidden');
    $('btnNext').textContent =
      state.index + 1 >= state.order.length ? 'See results' : 'Next question';
  }

  function nextStep() {
    state.index++;
    if (state.index >= state.order.length) {
      showResults();
      return;
    }
    renderQuestion();
  }

  function startQuiz() {
    var pool = getPool();
    if (!pool.length) {
      $('qText').textContent = 'No questions found. Add APTITUDE_QUESTIONS to data/questions.js.';
      showPanel('quiz');
      return;
    }

    state.order = shuffle(pool.map(function (_, i) {
      return i;
    }));
    state.index = 0;
    state.score = 0;
    state.totalStart = null;

    clearTotalTimer();
    clearQuestionTimer();
    startTotalTimer();

    showPanel('quiz');
    renderQuestion();
  }

  function init() {
    $('btnStart').addEventListener('click', startQuiz);
    $('btnRestart').addEventListener('click', function () {
      clearQuestionTimer();
      clearTotalTimer();
      showPanel('intro');
    });
    var btnRetake = $('btnRetake');
    if (btnRetake) {
      btnRetake.addEventListener('click', startQuiz);
    }
    $('btnNext').addEventListener('click', nextStep);
    showPanel('intro');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
