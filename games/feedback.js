// games/feedback.js

// Available modules for rating
const AVAILABLE_MODULES = [
    { id: 'tictactoe', name: 'Tic Tac Toe + OOP Quiz' },
    { id: 'aptitude', name: 'Aptitude Quiz' },
    { id: 'dsa_match', name: 'DSA Match the Following' },
    { id: 'coding', name: 'Coding Challenge' },
    { id: 'sql', name: 'SQL Practice' }
];

class FeedbackSystem {
    constructor() {
        this.feedbacks = [];
        this.tempModuleRatings = {};
        this.loadFeedbacks();
        this.init();
    }

    init() {
        this.renderModuleRatings();
        this.renderStats();
        this.renderFeedbackList();
        this.setupEventListeners();
    }

    loadFeedbacks() {
        const stored = localStorage.getItem('interview_arcade_feedbacks');
        if (stored) {
            this.feedbacks = JSON.parse(stored);
        } else {
            // Add some sample feedback for demo
            this.feedbacks = [
                {
                    id: Date.now() - 86400000,
                    overallRating: 5,
                    moduleRatings: {
                        tictactoe: 5,
                        aptitude: 4
                    },
                    comment: "Excellent platform! The OOP quiz after Tic Tac Toe is very innovative.",
                    date: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: Date.now() - 172800000,
                    overallRating: 4,
                    moduleRatings: {
                        dsa_match: 5,
                        coding: 4
                    },
                    comment: "Great DSA matching game! Would love to see more questions.",
                    date: new Date(Date.now() - 172800000).toISOString()
                }
            ];
            this.saveFeedbacks();
        }
    }

    saveFeedbacks() {
        localStorage.setItem('interview_arcade_feedbacks', JSON.stringify(this.feedbacks));
    }

    renderModuleRatings() {
        const container = document.getElementById('moduleRatings');
        if (!container) return;

        container.innerHTML = AVAILABLE_MODULES.map(module => `
            <div class="module-rating-item" data-module-id="${module.id}">
                <span class="module-name">${module.name}</span>
                <div class="module-stars" data-module="${module.id}">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <span class="star" data-value="${star}" data-module="${module.id}">★</span>
                    `).join('')}
                </div>
                <span class="rating-value" id="rating-${module.id}" style="margin-left: 10px; color: #667eea; font-weight: bold;">Not rated</span>
            </div>
        `).join('');

        // Add click handlers for module stars
        this.attachModuleStarHandlers();
    }

    attachModuleStarHandlers() {
        // Get all star elements
        const allStars = document.querySelectorAll('.star');
        
        allStars.forEach(star => {
            // Remove existing listeners to avoid duplicates
            star.removeEventListener('click', this.starClickHandler);
            
            // Create new handler
            this.starClickHandler = (e) => {
                e.stopPropagation();
                const moduleId = star.dataset.module;
                const ratingValue = parseInt(star.dataset.value);
                this.setModuleRating(moduleId, ratingValue);
            };
            
            star.addEventListener('click', this.starClickHandler);
            
            // Add hover effects
            star.removeEventListener('mouseenter', this.starHoverHandler);
            star.removeEventListener('mouseleave', this.starLeaveHandler);
            
            this.starHoverHandler = () => {
                const moduleId = star.dataset.module;
                const ratingValue = parseInt(star.dataset.value);
                this.highlightStars(moduleId, ratingValue);
            };
            
            this.starLeaveHandler = () => {
                const moduleId = star.dataset.module;
                const currentRating = this.tempModuleRatings[moduleId] || 0;
                this.highlightStars(moduleId, currentRating);
            };
            
            star.addEventListener('mouseenter', this.starHoverHandler);
            star.addEventListener('mouseleave', this.starLeaveHandler);
        });
    }

    highlightStars(moduleId, rating) {
        const stars = document.querySelectorAll(`.star[data-module="${moduleId}"]`);
        stars.forEach((star, index) => {
            const starValue = parseInt(star.dataset.value);
            if (starValue <= rating) {
                star.classList.add('active');
                star.style.color = '#ffc107';
            } else {
                star.classList.remove('active');
                star.style.color = '#ddd';
            }
        });
    }

    setModuleRating(moduleId, rating) {
        // Store in temporary memory
        this.tempModuleRatings[moduleId] = rating;
        
        // Update UI stars
        this.highlightStars(moduleId, rating);
        
        // Update rating value display
        const ratingDisplay = document.getElementById(`rating-${moduleId}`);
        if (ratingDisplay) {
            ratingDisplay.textContent = `${rating}★`;
            ratingDisplay.style.color = '#28a745';
        }
        
        // Show feedback
        this.showNotification(`${AVAILABLE_MODULES.find(m => m.id === moduleId).name} rated ${rating}★`, 'success');
    }

    setupEventListeners() {
        const form = document.getElementById('feedbackForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitFeedback();
            });
        }
        
        // Add hover effects for overall rating stars
        const overallStars = document.querySelectorAll('.star-rating label');
        overallStars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const forAttr = star.getAttribute('for');
                const value = parseInt(forAttr.replace('star', ''));
                this.highlightOverallStars(value);
            });
            
            star.addEventListener('mouseleave', () => {
                const selected = document.querySelector('input[name="rating"]:checked');
                const value = selected ? parseInt(selected.value) : 0;
                this.highlightOverallStars(value);
            });
        });
    }

    highlightOverallStars(rating) {
        const labels = document.querySelectorAll('.star-rating label');
        labels.forEach((label, index) => {
            const starValue = 5 - index;
            if (starValue <= rating) {
                label.style.color = '#ffc107';
            } else {
                label.style.color = '#ddd';
            }
        });
    }

    submitFeedback() {
        // Get overall rating
        const selectedRating = document.querySelector('input[name="rating"]:checked');
        if (!selectedRating) {
            this.showNotification('Please rate the platform before submitting!', 'error');
            return;
        }

        const overallRating = parseInt(selectedRating.value);
        const comment = document.getElementById('comment').value.trim();

        if (!comment) {
            this.showNotification('Please leave a comment before submitting!', 'error');
            return;
        }

        // Get module ratings (only those that were rated)
        const moduleRatings = {};
        for (const [moduleId, rating] of Object.entries(this.tempModuleRatings)) {
            if (rating > 0) {
                moduleRatings[moduleId] = rating;
            }
        }

        // Create feedback object
        const feedback = {
            id: Date.now(),
            overallRating: overallRating,
            moduleRatings: moduleRatings,
            comment: comment,
            date: new Date().toISOString()
        };

        // Save to array
        this.feedbacks.unshift(feedback);
        this.saveFeedbacks();

        // Reset form
        this.resetForm();
        
        // Refresh UI
        this.renderStats();
        this.renderFeedbackList();

        // Show success message
        this.showNotification('Feedback submitted successfully! Thank you! 🎉', 'success');
    }

    resetForm() {
        // Clear overall rating stars
        const radioButtons = document.querySelectorAll('input[name="rating"]');
        radioButtons.forEach(radio => radio.checked = false);
        
        // Reset overall stars color
        const labels = document.querySelectorAll('.star-rating label');
        labels.forEach(label => {
            label.style.color = '#ddd';
        });
        
        // Clear comment
        document.getElementById('comment').value = '';
        
        // Clear module ratings
        this.tempModuleRatings = {};
        
        // Reset all module stars and displays
        AVAILABLE_MODULES.forEach(module => {
            this.highlightStars(module.id, 0);
            const ratingDisplay = document.getElementById(`rating-${module.id}`);
            if (ratingDisplay) {
                ratingDisplay.textContent = 'Not rated';
                ratingDisplay.style.color = '#667eea';
            }
        });
    }

    renderStats() {
        const statsContainer = document.getElementById('statsCards');
        if (!statsContainer) return;

        if (this.feedbacks.length === 0) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">0</div>
                    <div class="stat-label">Total Feedbacks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">0.0</div>
                    <div class="stat-label">Average Rating</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">0</div>
                    <div class="stat-label">Modules Rated</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Rating Distribution</div>
                    <div style="margin-top: 10px;">No ratings yet</div>
                </div>
            `;
            return;
        }

        // Calculate statistics
        const totalFeedbacks = this.feedbacks.length;
        const averageRating = (this.feedbacks.reduce((sum, f) => sum + f.overallRating, 0) / totalFeedbacks).toFixed(1);
        
        // Calculate module-wise average ratings
        const moduleAverages = {};
        AVAILABLE_MODULES.forEach(module => {
            const ratings = this.feedbacks
                .filter(f => f.moduleRatings && f.moduleRatings[module.id])
                .map(f => f.moduleRatings[module.id]);
            
            if (ratings.length > 0) {
                moduleAverages[module.id] = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
            }
        });

        // Rating distribution
        const ratingDistribution = [0, 0, 0, 0, 0];
        this.feedbacks.forEach(f => {
            if (f.overallRating >= 1 && f.overallRating <= 5) {
                ratingDistribution[f.overallRating - 1]++;
            }
        });

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${totalFeedbacks}</div>
                <div class="stat-label">Total Feedbacks</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${averageRating}</div>
                <div class="stat-label">Average Rating</div>
                <div class="star-display">${this.getStarDisplay(parseFloat(averageRating))}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${Object.keys(moduleAverages).length}</div>
                <div class="stat-label">Modules Rated</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Rating Distribution</div>
                <div style="margin-top: 10px;">
                    ${[5,4,3,2,1].map(rating => {
                        const count = ratingDistribution[rating-1] || 0;
                        const percentage = totalFeedbacks > 0 ? (count / totalFeedbacks * 100) : 0;
                        return `
                            <div style="display: flex; align-items: center; gap: 5px; margin: 5px 0;">
                                <span style="width: 25px;">${rating}★</span>
                                <div style="flex: 1; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden;">
                                    <div style="width: ${percentage}%; height: 100%; background: #ffc107; transition: width 0.3s;"></div>
                                </div>
                                <span style="width: 40px; font-size: 12px;">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderFeedbackList() {
        const container = document.getElementById('feedbackList');
        if (!container) return;

        if (this.feedbacks.length === 0) {
            container.innerHTML = '<div class="no-feedback">No feedback yet. Be the first to share your thoughts! 📝</div>';
            return;
        }

        container.innerHTML = this.feedbacks.map(feedback => `
            <div class="feedback-item" data-id="${feedback.id}">
                <div class="feedback-header">
                    <div class="feedback-rating">
                        ${this.getStarDisplay(feedback.overallRating)}
                        <span style="color: #333; margin-left: 5px;">(${feedback.overallRating}/5)</span>
                    </div>
                    <div>
                        <span class="feedback-date">${this.formatDate(feedback.date)}</span>
                        <button class="delete-btn" onclick="deleteFeedback(${feedback.id})">Delete</button>
                    </div>
                </div>
                <div class="feedback-comment">
                    "${this.escapeHtml(feedback.comment)}"
                </div>
                ${feedback.moduleRatings && Object.keys(feedback.moduleRatings).length > 0 ? `
                    <div class="feedback-modules">
                        <strong>Module Ratings:</strong><br>
                        ${Object.entries(feedback.moduleRatings).map(([moduleId, rating]) => {
                            const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
                            return `<span class="module-badge">${module ? module.name : moduleId}: ${rating}★ ${this.getStarDisplay(rating)}</span>`;
                        }).join('')}
                    </div>
                ` : '<div class="feedback-modules"><em>No module ratings provided</em></div>'}
            </div>
        `).join('');
    }

    getStarDisplay(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '½';
        stars += '☆'.repeat(5 - Math.ceil(rating));
        return stars;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.custom-notification');
        if (existing) existing.remove();
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    deleteFeedback(id) {
        if (confirm('Are you sure you want to delete this feedback?')) {
            this.feedbacks = this.feedbacks.filter(f => f.id !== id);
            this.saveFeedbacks();
            this.renderStats();
            this.renderFeedbackList();
            this.showNotification('Feedback deleted successfully!', 'success');
        }
    }

    clearAllFeedback() {
        if (confirm('⚠️ This will delete ALL feedback entries. Are you sure?')) {
            this.feedbacks = [];
            this.saveFeedbacks();
            this.renderStats();
            this.renderFeedbackList();
            this.showNotification('All feedback cleared!', 'success');
        }
    }
}

// Initialize the feedback system
const feedbackSystem = new FeedbackSystem();

// Global functions for onclick handlers
window.deleteFeedback = (id) => {
    if (feedbackSystem) {
        feedbackSystem.deleteFeedback(id);
    }
};

window.clearAllFeedback = () => {
    if (feedbackSystem) {
        feedbackSystem.clearAllFeedback();
    }
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .star {
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 24px;
    }
    
    .star:hover {
        transform: scale(1.1);
    }
    
    .star.active {
        color: #ffc107 !important;
    }
    
    .module-stars {
        display: flex;
        gap: 5px;
        cursor: pointer;
    }
    
    .rating-value {
        min-width: 80px;
        font-size: 14px;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);
