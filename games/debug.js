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
document.addEventListener("DOMContentLoaded", () => {
    // 1. Data Structure: The Buggy Snippets
    const snippets = [
        {
            language: "JavaScript",
            difficulty: "Easy",
            code: `function calculateTotal(price, tax) {
    const total = price + tax;
    total = total - 5; // $5 discount
    return total;
}`,
            buggyLine: "total = total - 5;",
            fixedLine: "let total = price + tax;",
            explanation: "In JavaScript, 'const' variables cannot be reassigned. You must declare 'total' with 'let' if you intend to modify it later."
        },
        {
            language: "C",
            difficulty: "Medium",
            code: `#include <stdio.h>
int main() {
    int age;
    printf("Enter your age: ");
    scanf("%d", age);
    printf("You are %d years old.", age);
    return 0;
}`,
            buggyLine: 'scanf("%d", age);',
            fixedLine: 'scanf("%d", &age);',
            explanation: "The scanf function requires the memory address of the variable to store the input. You must use the address-of operator (&)."
        },
        {
            language: "Python",
            difficulty: "Medium",
            code: `def add_item(item, inventory=[]):
    inventory.append(item)
    return inventory

print(add_item("Sword"))
print(add_item("Shield"))`,
            buggyLine: "def add_item(item, inventory=[]):",
            fixedLine: "def add_item(item, inventory=None):",
            explanation: "In Python, default arguments are evaluated only once. Using a mutable default like a list causes the same list to be shared across all function calls."
        },
        {
            language: "Java",
            difficulty: "Medium",
            code: `public class Main {
    public static void main(String[] args) {
        String str1 = new String("hello");
        String str2 = "hello";
        
        if (str1 == str2) {
            System.out.println("Match");
        }
    }
}`,
            buggyLine: "if (str1 == str2) {",
            fixedLine: "if (str1.equals(str2)) {",
            explanation: "In Java, '==' compares object references (memory locations), not the actual string content. Always use .equals() for String comparison."
        },
        {
            language: "JavaScript",
            difficulty: "Hard",
            code: `for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 100);
}
// Expected output: 0, 1, 2`,
            buggyLine: "for (var i = 0; i < 3; i++) {",
            fixedLine: "for (let i = 0; i < 3; i++) {",
            explanation: "Because 'var' is function-scoped, the setTimeout callbacks all reference the same variable 'i' after the loop has finished (which is 3). Using 'let' creates a block-scoped binding for each iteration."
        }
    ];

    // 2. State Variables
    let currentIndex = 0;
    let score = 0;
    let attempts = 0;
    
    // 3. DOM Elements
    const codeBlock = document.getElementById("code-block");
    const langBadge = document.getElementById("language-badge");
    const diffBadge = document.getElementById("difficulty-badge");
    const fixInput = document.getElementById("fix-input");
    const submitBtn = document.getElementById("submit-btn");
    const nextBtn = document.getElementById("next-btn");
    const feedbackPanel = document.getElementById("feedback-panel");
    const feedbackTitle = document.getElementById("feedback-title");
    const feedbackExplanation = document.getElementById("feedback-explanation");
    
    const levelDisplay = document.getElementById("current-level");
    const scoreDisplay = document.getElementById("score");
    const attemptsDisplay = document.getElementById("attempts");
    const gameOverPanel = document.getElementById("game-over-panel");
    const restartBtn = document.getElementById("restart-btn");
    const finalScoreDisplay = document.getElementById("final-score");

    // 4. Utility: String Normalization for robust comparison
    // Strips all whitespace and converts single quotes to double quotes
    function normalizeCode(str) {
        return str.replace(/\s+/g, '').replace(/'/g, '"').trim();
    }

    // 5. Core Logic
    function loadSnippet() {
        const snippet = snippets[currentIndex];
        codeBlock.textContent = snippet.code;
        langBadge.textContent = snippet.language;
        diffBadge.textContent = snippet.difficulty;
        
        levelDisplay.textContent = currentIndex + 1;
        fixInput.value = "";
        fixInput.disabled = false;
        submitBtn.disabled = false;
        
        feedbackPanel.className = "hidden";
        nextBtn.classList.add("hidden");
    }

    function checkAnswer() {
        const userInput = fixInput.value;
        if (!userInput) return;

        attempts++;
        attemptsDisplay.textContent = attempts;

        const snippet = snippets[currentIndex];
        const normalizedUser = normalizeCode(userInput);
        const normalizedExpected = normalizeCode(snippet.fixedLine);

        feedbackPanel.classList.remove("hidden");

        if (normalizedUser === normalizedExpected) {
            // Correct
            score += 10;
            scoreDisplay.textContent = score;
            
            feedbackPanel.className = "correct";
            feedbackTitle.textContent = "Correct! Bug Squashed.";
            feedbackExplanation.textContent = snippet.explanation;
            
            fixInput.disabled = true;
            submitBtn.disabled = true;
            nextBtn.classList.remove("hidden");
        } else {
            // Incorrect
            feedbackPanel.className = "incorrect";
            feedbackTitle.textContent = "Syntax Error or Incorrect Logic.";
            feedbackExplanation.textContent = "Check your syntax, spacing, and ensure you are providing the fully corrected line of code.";
        }
    }

    function nextSnippet() {
        currentIndex++;
        if (currentIndex < snippets.length) {
            loadSnippet();
        } else {
            endGame();
        }
    }

    function endGame() {
        document.querySelector(".snippet-container").classList.add("hidden");
        document.querySelector(".interaction-panel").classList.add("hidden");
        feedbackPanel.classList.add("hidden");
        
        gameOverPanel.classList.remove("hidden");
        finalScoreDisplay.textContent = score;
        saveProgress();
    }

    function saveProgress() {
        const moduleData = {
            completed: true,
            score: score,
            attempts: attempts,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem("module_debug_stats", JSON.stringify(moduleData));
    }

    function restartGame() {
        currentIndex = 0;
        score = 0;
        attempts = 0;
        scoreDisplay.textContent = score;
        attemptsDisplay.textContent = attempts;
        
        document.querySelector(".snippet-container").classList.remove("hidden");
        document.querySelector(".interaction-panel").classList.remove("hidden");
        gameOverPanel.classList.add("hidden");
        
        loadSnippet();
    }

    // 6. Event Listeners
    submitBtn.addEventListener("click", checkAnswer);
    nextBtn.addEventListener("click", nextSnippet);
    restartBtn.addEventListener("click", restartGame);
    
    // Allow pressing Enter to submit
    fixInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !submitBtn.disabled) {
            checkAnswer();
        }
    });

    // Bootstrap
    loadSnippet();
});
