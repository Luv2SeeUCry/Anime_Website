// Episode management functionality
let episodes = JSON.parse(localStorage.getItem('episodes') || '[]');

function initializeEpisodes() {
    if (episodes.length === 0) {
        // Add some sample episodes if none exist
        episodes = [
            {
                id: 1,
                title: "Episode 1: The Beginning",
                description: "The journey begins...",
                duration: "24:00",
                ratings: [],
                reviews: [],
                watchProgress: {}
            },
            // Add more sample episodes as needed
        ];
        saveEpisodes();
    }
    renderEpisodeList();
}

function saveEpisodes() {
    localStorage.setItem('episodes', JSON.stringify(episodes));
}

function renderEpisodeList() {
    const container = document.getElementById('episodeList');
    const currentUser = localStorage.getItem('username');
    
    container.innerHTML = episodes.map(episode => {
        const progress = episode.watchProgress[currentUser] || 0;
        const userRating = episode.ratings.find(r => r.username === currentUser)?.rating || 0;
        const avgRating = calculateAverageRating(episode.ratings);
        
        return `
        <div class="episode-card card mb-3 bg-dark text-light">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <h5 class="card-title">${episode.title}</h5>
                    <span class="badge bg-primary">${episode.duration}</span>
                </div>
                <p class="card-text">${episode.description}</p>
                
                <!-- Progress Bar -->
                <div class="progress mb-3" style="height: 5px;">
                    <div class="progress-bar bg-success" role="progressbar" 
                         style="width: ${progress}%;" 
                         aria-valuenow="${progress}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
                
                <!-- Rating System -->
                <div class="rating-container mb-3">
                    <div class="stars">
                        ${generateStarRating(userRating, episode.id)}
                    </div>
                    <small class="text-muted">Average Rating: ${avgRating.toFixed(1)}/5</small>
                </div>
                
                <!-- Reviews Section -->
                <div class="reviews-section">
                    <button class="btn btn-outline-primary btn-sm" 
                            onclick="toggleReviews(${episode.id})">
                        Show Reviews (${episode.reviews.length})
                    </button>
                    <button class="btn btn-outline-success btn-sm ms-2" 
                            onclick="showReviewForm(${episode.id})">
                        Add Review
                    </button>
                </div>
                
                <!-- Reviews Container -->
                <div id="reviews-${episode.id}" class="reviews-container mt-3" style="display: none;">
                    ${renderReviews(episode.reviews)}
                </div>
            </div>
        </div>`;
    }).join('');
}

function generateStarRating(userRating, episodeId) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `
        <i class="fas fa-star ${i <= userRating ? 'text-warning' : 'text-muted'}"
           onclick="rateEpisode(${episodeId}, ${i})"></i>`;
    }
    return stars;
}

function calculateAverageRating(ratings) {
    if (!ratings.length) return 0;
    return ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
}

function rateEpisode(episodeId, rating) {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Please login to rate episodes');
        return;
    }
    
    const episode = episodes.find(e => e.id === episodeId);
    if (!episode) return;
    
    const existingRating = episode.ratings.findIndex(r => r.username === username);
    if (existingRating > -1) {
        episode.ratings[existingRating].rating = rating;
    } else {
        episode.ratings.push({ username, rating });
    }
    
    saveEpisodes();
    renderEpisodeList();
}

function updateWatchProgress(episodeId, progress) {
    const username = localStorage.getItem('username');
    if (!username) return;
    
    const episode = episodes.find(e => e.id === episodeId);
    if (!episode) return;
    
    episode.watchProgress[username] = progress;
    saveEpisodes();
    renderEpisodeList();
}

function toggleReviews(episodeId) {
    const reviewsContainer = document.getElementById(`reviews-${episodeId}`);
    reviewsContainer.style.display = reviewsContainer.style.display === 'none' ? 'block' : 'none';
}

function renderReviews(reviews) {
    if (!reviews.length) return '<p class="text-muted">No reviews yet.</p>';
    
    return reviews.map(review => `
        <div class="review-card p-2 border-bottom">
            <div class="d-flex justify-content-between">
                <strong>${review.username}</strong>
                <small class="text-muted">${new Date(review.date).toLocaleDateString()}</small>
            </div>
            <p class="mb-0">${review.text}</p>
        </div>
    `).join('');
}

function showReviewForm(episodeId) {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Please login to add a review');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    document.getElementById('reviewEpisodeId').value = episodeId;
    modal.show();
}

function submitReview() {
    const episodeId = parseInt(document.getElementById('reviewEpisodeId').value);
    const reviewText = document.getElementById('reviewText').value.trim();
    const username = localStorage.getItem('username');
    
    if (!reviewText) {
        alert('Please enter a review');
        return;
    }
    
    const episode = episodes.find(e => e.id === episodeId);
    if (!episode) return;
    
    episode.reviews.push({
        username,
        text: reviewText,
        date: new Date().toISOString()
    });
    
    saveEpisodes();
    renderEpisodeList();
    
    // Close modal and clear form
    const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
    modal.hide();
    document.getElementById('reviewText').value = '';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeEpisodes);