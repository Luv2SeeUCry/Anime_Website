document.addEventListener('DOMContentLoaded', function() {
    loadUpcomingReleases();
});

function loadUpcomingReleases() {
    const container = document.getElementById('upcoming-releases');
    if (!container) return;

    container.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-light" role="status"></div></div>';

    // Get current date to determine next season
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    // Determine next season and year
    let nextSeason;
    let nextYear = year;
    
    if (month >= 1 && month <= 3) {
        nextSeason = 'spring';
    } else if (month >= 4 && month <= 6) {
        nextSeason = 'summer';
    } else if (month >= 7 && month <= 9) {
        nextSeason = 'fall';
    } else {
        nextSeason = 'winter';
        nextYear++; // If we're in Oct-Dec, the next season is winter of next year
    }

    // Using Jikan API to fetch next season's anime
    fetch(`https://api.jikan.moe/v4/seasons/${nextYear}/${nextSeason}`)
        .then(response => response.json())
        .then(data => {
            const animeByDay = organizeAnimeByDay(data.data);
            container.innerHTML = generateScheduleHTML(animeByDay);
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Failed to load schedule. Please try again later.
                        <button class="btn btn-outline-danger btn-sm ms-3" onclick="loadUpcomingReleases()">
                            <i class="fas fa-sync-alt"></i> Retry
                        </button>
                    </div>
                </div>`;
        });
}

function organizeAnimeByDay(animeList) {
    const days = {
        'Monday': [], 'Tuesday': [], 'Wednesday': [], 
        'Thursday': [], 'Friday': [], 'Saturday': [], 'Sunday': []
    };

    animeList.forEach(anime => {
        const broadcast = anime.broadcast?.day || 'TBA';
        if (broadcast in days) {
            days[broadcast].push({
                title: anime.title,
                image_url: anime.images?.jpg?.image_url || 'assets/images/placeholder.jpg',
                time_jst: anime.broadcast?.time || 'TBA',
                studio: anime.studios?.[0]?.name || 'TBA',
                episodes: anime.episodes || 'TBA',
                synopsis: anime.synopsis || 'No synopsis available'
            });
        }
    });

    return days;
}

function generateScheduleHTML(groupedReleases) {
    let html = '';
    for (const [day, releases] of Object.entries(groupedReleases)) {
        html += `
            <div class="col">
                <div class="card bg-dark text-light h-100">
                    <div class="card-header">
                        <h5 class="mb-0">${day}</h5>
                    </div>
                    <div class="card-body">
                        ${releases.map(release => `
                            <div class="anime-item mb-3">
                                <div class="d-flex">
                                    <img src="${release.image_url}" 
                                         class="me-3" 
                                         style="width: 80px; height: 120px; object-fit: cover; border-radius: 5px;"
                                         alt="${release.title}"
                                         onerror="this.src='assets/images/placeholder.jpg'">
                                    <div>
                                        <h6 class="mb-1">${release.title}</h6>
                                        <small class="text-muted">${release.time_jst} JST</small>
                                        ${release.studio ? `<p class="mb-1 small">Studio: ${release.studio}</p>` : ''}
                                        ${release.episodes ? `<p class="mb-1 small">Episodes: ${release.episodes}</p>` : ''}
                                        <div class="synopsis-preview small text-muted mt-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                            ${release.synopsis}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
    }
    return html;
}