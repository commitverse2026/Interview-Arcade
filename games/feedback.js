// ============================================
// FEEDBACK SYSTEM - Feature 9
// ============================================

const MODULES = [
  { id: 1, name: "Tic Tac Toe + OOP" },
  { id: 2, name: "Memory Card Game" },
  { id: 3, name: "Aptitude Quiz" },
  { id: 4, name: "Resume Matcher" },
  { id: 5, name: "SQL Fill Blanks" },
  { id: 6, name: "Image Riddles" },
  { id: 7, name: "DSA Match" },
  { id: 8, name: "Debug the Code" },
  { id: 9, name: "Feedback System" },
  { id: 10, name: "Progress Dashboard" },
];

const STORAGE_KEY = "ia:feedbacks";

// State
let selectedRating = 0;
let moduleRatings = {};

// DOM Elements
const feedbackForm = document.getElementById("feedbackForm");
const overallRatingStars = document.getElementById("overallRating");
const ratingText = document.getElementById("ratingText");
const successMessage = document.getElementById("successMessage");
const moduleRatingsContainer = document.getElementById("moduleRatings");
const feedbackList = document.getElementById("feedbackList");
const totalFeedbacksEl = document.getElementById("totalFeedbacks");
const averageRatingEl = document.getElementById("averageRating");
const clearAllBtn = document.getElementById("clearAllBtn");

// ============================================
// INITIALIZATION
// ============================================

function init() {
  renderModuleRatings();
  setupEventListeners();
  loadAndDisplayFeedbacks();
}

// ============================================
// MODULE RATINGS
// ============================================

function renderModuleRatings() {
  moduleRatingsContainer.innerHTML = MODULES.map(
    (module) => `
    <div class="module-rating-row">
      <span class="module-name">${module.name}</span>
      <div class="star-rating small" data-module="${module.id}">
        ${[1, 2, 3, 4, 5]
          .map((val) => `<span class="star" data-value="${val}">��</span>`)
          .join("")}
      </div>
    </div>
  `,
  ).join("");
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Overall rating
  overallRatingStars.addEventListener("click", (e) => {
    if (e.target.classList.contains("star")) {
      selectedRating = parseInt(e.target.dataset.value);
      updateStars(overallRatingStars, selectedRating);
      ratingText.textContent = `${selectedRating} star${selectedRating !== 1 ? "s" : ""}`;
    }
  });

  // Module ratings
  moduleRatingsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("star")) {
      const moduleId = parseInt(
        e.target.closest(".star-rating").dataset.module,
      );
      const rating = parseInt(e.target.dataset.value);
      moduleRatings[moduleId] = rating;
      updateStars(e.target.closest(".star-rating"), rating);
    }
  });

  // Form submission
  feedbackForm.addEventListener("submit", handleFormSubmit);

  // Clear all
  clearAllBtn.addEventListener("click", clearAllFeedback);
}

function updateStars(container, rating) {
  const stars = container.querySelectorAll(".star");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

// ============================================
// FORM SUBMISSION
// ============================================

function handleFormSubmit(e) {
  e.preventDefault();

  if (selectedRating === 0) {
    alert("Please provide an overall rating");
    return;
  }

  const userName =
    document.getElementById("userName").value.trim() || "Anonymous";
  const comment = document.getElementById("feedbackComment").value.trim();

  const feedback = {
    id: Date.now(),
    userName,
    overallRating: selectedRating,
    comment,
    moduleRatings: { ...moduleRatings },
    timestamp: new Date().toISOString(),
  };

  saveFeedback(feedback);
  showSuccessMessage();
  resetForm();
  loadAndDisplayFeedbacks();
}

function saveFeedback(feedback) {
  const feedbacks = getFeedbacks();
  feedbacks.push(feedback);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
}

function getFeedbacks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function showSuccessMessage() {
  successMessage.style.display = "block";
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);
}

function resetForm() {
  feedbackForm.reset();
  selectedRating = 0;
  moduleRatings = {};
  updateStars(overallRatingStars, 0);
  ratingText.textContent = "Click to rate";

  // Reset module stars
  document
    .querySelectorAll(".module-rating-row .star-rating")
    .forEach((container) => {
      updateStars(container, 0);
    });
}

// ============================================
// DISPLAY FEEDBACKS
// ============================================

function loadAndDisplayFeedbacks() {
  const feedbacks = getFeedbacks();

  // Update stats
  totalFeedbacksEl.textContent = feedbacks.length;

  if (feedbacks.length > 0) {
    const avgRating =
      feedbacks.reduce((sum, f) => sum + f.overallRating, 0) / feedbacks.length;
    averageRatingEl.textContent = avgRating.toFixed(1);
  } else {
    averageRatingEl.textContent = "0.0";
  }

  // Display recent feedbacks
  if (feedbacks.length === 0) {
    feedbackList.innerHTML =
      '<p class="no-feedback">No feedback yet. Be the first!</p>';
    return;
  }

  // Sort by most recent
  const recentFeedbacks = feedbacks.sort((a, b) => b.id - a.id).slice(0, 5);

  feedbackList.innerHTML = recentFeedbacks
    .map(
      (fb) => `
    <div class="feedback-item">
      <div class="feedback-header">
        <strong>${fb.userName}</strong>
        <span class="feedback-rating">${"★".repeat(fb.overallRating)}${"☆".repeat(5 - fb.overallRating)}</span>
      </div>
      <p class="feedback-comment">${fb.comment}</p>
      <small class="feedback-date">${formatDate(fb.timestamp)}</small>
    </div>
  `,
    )
    .join("");
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================
// CLEAR ALL
// ============================================

function clearAllFeedback() {
  if (
    confirm(
      "Are you sure you want to delete all feedback? This cannot be undone.",
    )
  ) {
    localStorage.removeItem(STORAGE_KEY);
    loadAndDisplayFeedbacks();
    alert("All feedback has been cleared.");
  }
}

// ============================================
// START
// ============================================

init();
