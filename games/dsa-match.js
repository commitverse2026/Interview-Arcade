const leftColumn = document.getElementById("leftColumn");
const rightColumn = document.getElementById("rightColumn");
const resultEl = document.getElementById("result");

let selectedLeft = null;
let matches = {}; // {leftIndex: rightIndex}

// DATA (can move to data/dsa-pairs.js)
const pairs = [
  { term: "Binary Search Tree", def: "Left < Root < Right" },
  { term: "Stack", def: "LIFO structure" },
  { term: "Queue", def: "FIFO structure" },
  { term: "Hash Table", def: "Key-value mapping" },
  { term: "Graph", def: "Nodes connected by edges" }
];

// shuffle definitions
let shuffledDefs = [...pairs].sort(() => Math.random() - 0.5);

function render() {
  leftColumn.innerHTML = "";
  rightColumn.innerHTML = "";

  pairs.forEach((p, i) => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerText = p.term;

    div.onclick = () => selectLeft(i, div);

    leftColumn.appendChild(div);
  });

  shuffledDefs.forEach((p, i) => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerText = p.def;

    div.onclick = () => selectRight(i, div);

    rightColumn.appendChild(div);
  });
}

function selectLeft(index, el) {
  document.querySelectorAll("#leftColumn .item").forEach(i => i.classList.remove("selected"));
  el.classList.add("selected");
  selectedLeft = index;
}

function selectRight(index, el) {
  if (selectedLeft === null) return;

  matches[selectedLeft] = index;

  document.querySelectorAll("#rightColumn .item").forEach(i => i.classList.remove("selected"));
  el.classList.add("selected");

  selectedLeft = null;
}

function submitMatches() {
  let score = 0;

  Object.keys(matches).forEach(leftIdx => {
    const rightIdx = matches[leftIdx];

    const leftItem = leftColumn.children[leftIdx];
    const rightItem = rightColumn.children[rightIdx];

    const correctDef = pairs[leftIdx].def;
    const selectedDef = shuffledDefs[rightIdx].def;

    if (correctDef === selectedDef) {
      score++;
      leftItem.classList.add("correct");
      rightItem.classList.add("correct");
    } else {
      leftItem.classList.add("wrong");
      rightItem.classList.add("wrong");
    }
  });

  resultEl.innerText = `Score: ${score}/${pairs.length}`;
}

function resetGame() {
  matches = {};
  selectedLeft = null;
  shuffledDefs = [...pairs].sort(() => Math.random() - 0.5);
  resultEl.innerText = "";
  render();
}

// INIT
render();