const codeBox = document.getElementById("codeBox");
const explanationEl = document.getElementById("explanation");
const hintEl = document.getElementById("hint");

let currentLang = "js";
let snippets = [];
let index = 0;
let selectedLine = null;
let score = 0;
let hintStep = 0;

// DATA
const allSnippets = {
  js: [
    {
      code: [
        "let x = 10;",
        "if(x = 5){",
        " console.log('Equal');",
        "}"
      ],
      bug: 1,
      hints: ["Check condition", "Assignment vs comparison"],
      exp: "Use == or === instead of ="
    }
  ],

  python: [
    {
      code: [
        "for i in range(5)",
        " print(i)"
      ],
      bug: 0,
      hints: ["Look at loop syntax", "Something missing at end"],
      exp: "Missing ':' in for loop"
    }
  ],

  java: [
    {
      code: [
        "int x = 5;",
        "if(x == '5'){",
        " System.out.println('Equal');",
        "}"
      ],
      bug: 1,
      hints: ["Check data types", "int vs string"],
      exp: "Type mismatch"
    }
  ]
};

function changeLanguage() {
  currentLang = document.getElementById("languageSelect").value;
  snippets = allSnippets[currentLang];
  index = 0;
  score = 0;
  loadSnippet();
}

function loadSnippet() {
  if (index >= snippets.length) {
    codeBox.innerHTML = `<h3>Score: ${score}/${snippets.length}</h3>`;
    return;
  }

  const s = snippets[index];

  codeBox.innerHTML = "";
  explanationEl.innerText = "";
  hintEl.innerText = "";
  hintStep = 0;

  s.code.forEach((line, i) => {
    const div = document.createElement("div");
    div.classList.add("line");
    div.innerText = line;

    div.onclick = () => {
      document.querySelectorAll(".line").forEach(l => l.classList.remove("selected"));
      div.classList.add("selected");
      selectedLine = i;
    };

    codeBox.appendChild(div);
  });
}

function showHint() {
  const s = snippets[index];
  if (hintStep < s.hints.length) {
    hintEl.innerText = "Hint: " + s.hints[hintStep];
    hintStep++;
  } else {
    hintEl.innerText = "No more hints 😄";
  }
}

function submitAnswer() {
  const s = snippets[index];
  const lines = document.querySelectorAll(".line");

  if (selectedLine === s.bug) {
    lines[selectedLine].classList.add("correct");
    score++;
  } else {
    if (selectedLine !== null) {
      lines[selectedLine].classList.add("wrong");
    }
    lines[s.bug].classList.add("correct");
  }

  explanationEl.innerText = "Explanation: " + s.exp;

  setTimeout(() => {
    index++;
    selectedLine = null;
    loadSnippet();
  }, 1500);
}

// INIT
changeLanguage();