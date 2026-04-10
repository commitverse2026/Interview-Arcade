const codeBox = document.getElementById("codeBox");
const explanationEl = document.getElementById("explanation");
const fixInput = document.getElementById("fixInput");

let selectedLine = null;
let index = 0;
let score = 0;

// 5 BUG SNIPPETS
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
      exp: "Use '==' or '===' instead of '='"
    },
    {
      code: [
        "function add(a,b){",
        " return a + b",
        "}",
        "console.log(add(2));"
      ],
      bug: 3,
      exp: "Missing second argument"
    }
  ],

  python: [
    {
      code: [
        "def func():",
        " print('Hello')",
        "func"
      ],
      bug: 2,
      exp: "Function not called properly → use func()"
    },
    {
      code: [
        "for i in range(5)",
        " print(i)"
      ],
      bug: 0,
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
      exp: "Comparing int with string"
    },
    {
      code: [
        "public static void main(String[] args){",
        " System.out.println('Hello')",
        "}"
      ],
      bug: 1,
      exp: "Use double quotes in Java"
    }
  ]
};
function loadSnippet() {
  if (index >= snippets.length) {
    codeBox.innerHTML = `<h3>Score: ${score}/${snippets.length}</h3>`;
    explanationEl.innerText = "Completed!";
    return;
  }

  codeBox.innerHTML = "";
  explanationEl.innerText = "";
  fixInput.value = "";

  snippets[index].code.forEach((line, i) => {
    const div = document.createElement("div");
    div.classList.add("line");
    div.innerText = line;

    div.onclick = () => selectLine(i, div);

    codeBox.appendChild(div);
  });
}

function selectLine(i, el) {
  document.querySelectorAll(".line").forEach(l => l.classList.remove("selected"));
  el.classList.add("selected");
  selectedLine = i;
}

function submitAnswer() {
  const correctLine = snippets[index].bug;
  const userFix = fixInput.value.toLowerCase();

  const lines = document.querySelectorAll(".line");

  if (selectedLine === correctLine) {
    lines[selectedLine].classList.add("correct");
    score++;
  } else if (selectedLine !== null) {
    lines[selectedLine].classList.add("wrong");
    lines[correctLine].classList.add("correct");
  }

  explanationEl.innerText = "Explanation: " + snippets[index].exp;

  setTimeout(() => {
    index++;
    selectedLine = null;
    loadSnippet();
  }, 1500);
}

// INIT
loadSnippet();