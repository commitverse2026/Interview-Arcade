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
    },
    {
      code: [
        "function add(a,b){",
        " return a + b",
        "}",
        "console.log(add(2));"
      ],
      bug: 3,
      hints: ["Function parameters", "Missing argument"],
      exp: "Function expects 2 arguments"
    },
    {
      code: [
        "let arr = [1,2,3];",
        "for(let i=0; i<=arr.length; i++){",
        " console.log(arr[i]);",
        "}"
      ],
      bug: 1,
      hints: ["Loop condition", "Array length"],
      exp: "Use < instead of <="
    },
    {
      code: [
        "const obj = {name: 'Aarya'};",
        "console.log(obj.age.toString());"
      ],
      bug: 1,
      hints: ["Property access", "Undefined value"],
      exp: "obj.age is undefined"
    },
    {
      code: [
        "let a = 5;",
        "let b = '10';",
        "console.log(a + b);"
      ],
      bug: 2,
      hints: ["Type coercion", "String + number"],
      exp: "Results in string concatenation"
    }
  ],

  python: [
    {
      code: [
        "for i in range(5)",
        " print(i)"
      ],
      bug: 0,
      hints: ["Loop syntax", "Missing symbol"],
      exp: "Missing ':'"
    },
    {
      code: [
        "def func():",
        " print('Hello')",
        "func"
      ],
      bug: 2,
      hints: ["Function call", "Syntax"],
      exp: "Use func() to call function"
    },
    {
      code: [
        "x = [1,2,3]",
        "print(x[3])"
      ],
      bug: 1,
      hints: ["Indexing", "List size"],
      exp: "Index out of range"
    },
    {
      code: [
        "if True",
        " print('Yes')"
      ],
      bug: 0,
      hints: ["Condition syntax", "Missing something"],
      exp: "Missing ':'"
    },
    {
      code: [
        "a = '5'",
        "b = 2",
        "print(a + b)"
      ],
      bug: 2,
      hints: ["Data types", "String + int"],
      exp: "TypeError due to mismatch"
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
      hints: ["Type mismatch", "int vs string"],
      exp: "Cannot compare int with string"
    },
    {
      code: [
        "public static void main(String[] args){",
        " System.out.println('Hello')",
        "}"
      ],
      bug: 1,
      hints: ["Syntax", "End of statement"],
      exp: "Missing semicolon"
    },
    {
      code: [
        "int arr[] = {1,2,3};",
        "System.out.println(arr[3]);"
      ],
      bug: 1,
      hints: ["Array index", "Size"],
      exp: "Index out of bounds"
    },
    {
      code: [
        "String s = null;",
        "System.out.println(s.length());"
      ],
      bug: 1,
      hints: ["Null value", "Method call"],
      exp: "NullPointerException"
    },
    {
      code: [
        "int a = 10;",
        "int b = 0;",
        "System.out.println(a/b);"
      ],
      bug: 2,
      hints: ["Math operation", "Division"],
      exp: "Division by zero"
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