(function () {
  'use strict';

  const QUESTIONS = [
    {
      q: "Find next number: 2, 6, 12, 20, ?",
      options: ["30", "28", "26", "32"],
      correct: 0,
      explanation: "Pattern: n(n+1) → 5×6 = 30"
    },
    {
      q: "If A=1, B=2, what is CAT?",
      options: ["24", "26", "25", "27"],
      correct: 0,
      explanation: "C(3)+A(1)+T(20) = 24"
    },
    {
      q: "Odd one out",
      options: ["2", "3", "5", "9"],
      correct: 3,
      explanation: "9 is not prime"
    },
    {
      q: "Mirror of 6?",
      options: ["9", "6", "3", "0"],
      correct: 0,
      explanation: "Mirror flips → 9"
    },
    {
      q: "Speed = Distance / ?",
      options: ["Time", "Velocity", "Mass", "Force"],
      correct: 0,
      explanation: "Basic formula"
    }
  ];

  let index = 0;
  let score = 0;
  let timer;
  let timeLeft = 10;
  let totalStart;
  let totalTimer;

  const panelIntro = document.getElementById("panelIntro");
  const panelQuiz = document.getElementById("panelQuiz");
  const panelResult = document.getElementById("panelResult");

  const qText = document.getElementById("qText");
  const options = document.getElementById("options");
  const feedback = document.getElementById("feedback");
  const btnNext = document.getElementById("btnNext");

  const qProgress = document.getElementById("qProgress");
  const qTimer = document.getElementById("qTimer");
  const timerBar = document.getElementById("timerBar");
  const totalTime = document.getElementById("totalTime");

  function startQuiz() {
    index = 0;
    score = 0;
    panelIntro.hidden = true;
    panelResult.hidden = true;
    panelQuiz.hidden = false;

    totalStart = Date.now();
    totalTimer = setInterval(updateTotalTime, 1000);

    loadQuestion();
  }

  function updateTotalTime() {
    const sec = Math.floor((Date.now() - totalStart) / 1000);
    totalTime.innerText = formatTime(sec);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  function loadQuestion() {
    if (index >= QUESTIONS.length) return showResult();

    const q = QUESTIONS[index];
    qText.innerText = q.q;
    qProgress.innerText = `Question ${index + 1}/${QUESTIONS.length}`;
    feedback.hidden = true;
    btnNext.classList.add("is-hidden");

    options.innerHTML = "";

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "opt";
      btn.innerText = opt;

      btn.onclick = () => selectAnswer(i);

      options.appendChild(btn);
    });

    startTimer();
  }

  function startTimer() {
    timeLeft = 10;
    qTimer.innerText = timeLeft;
    timerBar.style.width = "100%";

    clearInterval(timer);

    timer = setInterval(() => {
      timeLeft--;
      qTimer.innerText = timeLeft;
      timerBar.style.width = (timeLeft * 10) + "%";

      if (timeLeft === 0) {
        clearInterval(timer);
        showAnswer(-1);
      }
    }, 1000);
  }

  function selectAnswer(selected) {
    clearInterval(timer);
    showAnswer(selected);
  }

  function showAnswer(selected) {
    const q = QUESTIONS[index];
    const buttons = document.querySelectorAll(".opt");

    buttons.forEach((btn, i) => {
      btn.disabled = true;

      if (i === q.correct) btn.classList.add("correct");
      if (i === selected && selected !== q.correct) btn.classList.add("wrong");
    });

    if (selected === q.correct) {
      score++;
      feedback.innerText = "Correct!";
    } else {
      feedback.innerText = "Explanation: " + q.explanation;
    }

    feedback.hidden = false;
    btnNext.classList.remove("is-hidden");
  }

  btnNext.onclick = () => {
    index++;
    loadQuestion();
  };

  function showResult() {
    clearInterval(timer);
    clearInterval(totalTimer);

    panelQuiz.hidden = true;
    panelResult.hidden = false;

    document.getElementById("resultScore").innerText =
      `Score: ${score}/${QUESTIONS.length}`;

    const pct = Math.round((score / QUESTIONS.length) * 100);
    document.getElementById("resultPct").innerText = pct + "%";

    let label = "";
    let text = "";

    if (pct >= 90) {
      label = "Excellent 🔥";
      text = "Strong performance!";
    } else if (pct >= 60) {
      label = "Good 👍";
      text = "Keep improving!";
    } else {
      label = "Needs Practice 📘";
      text = "Work on basics.";
    }

    document.getElementById("resultLabel").innerText = label;
    document.getElementById("resultBlurb").innerText = text;

    document.getElementById("resultTime").innerText = totalTime.innerText;
  }

  document.getElementById("btnStart").onclick = startQuiz;
  document.getElementById("btnRetake").onclick = startQuiz;
  document.getElementById("btnRestart").onclick = () => {
    panelResult.hidden = true;
    panelIntro.hidden = false;
  };

})();