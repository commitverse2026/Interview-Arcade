const starsContainer = document.getElementById("stars");
const avgRatingEl = document.getElementById("avgRating");
const commentsEl = document.getElementById("recentComments");

let rating = 0;

// Create stars
for (let i = 1; i <= 5; i++) {
  const span = document.createElement("span");
  span.innerHTML = "★";
  span.classList.add("star");

  span.onclick = () => setRating(i);

  starsContainer.appendChild(span);
}

function setRating(val) {
  rating = val;
  document.querySelectorAll(".star").forEach((s, i) => {
    s.classList.toggle("active", i < val);
  });
}

// Save feedback
function submitFeedback() {
  const comment = document.getElementById("comment").value;
  const module = document.getElementById("module").value;

  if (rating === 0) {
    alert("Please select rating");
    return;
  }

  const entry = {
    rating,
    comment,
    module,
    time: new Date().toLocaleString()
  };

  let data = JSON.parse(localStorage.getItem("feedback")) || [];
  data.unshift(entry);

  localStorage.setItem("feedback", JSON.stringify(data));

  document.getElementById("comment").value = "";
  rating = 0;
  setRating(0);

  loadSummary();
}

// Load summary
function loadSummary() {
  let data = JSON.parse(localStorage.getItem("feedback")) || [];

  if (data.length === 0) {
    avgRatingEl.innerText = "Average Rating: -";
    commentsEl.innerHTML = "<p>No feedback yet</p>";
    return;
  }

  let total = data.reduce((sum, f) => sum + f.rating, 0);
  let avg = (total / data.length).toFixed(1);

  avgRatingEl.innerText = `Average Rating: ${avg} ⭐`;

  commentsEl.innerHTML = "";

  data.slice(0, 5).forEach(f => {
    const div = document.createElement("div");
    div.classList.add("comment");
    div.innerHTML = `
      <strong>${f.module}</strong> — ${f.rating}⭐<br>
      ${f.comment}<br>
      <small>${f.time}</small>
    `;
    commentsEl.appendChild(div);
  });
}

// INIT
loadSummary();