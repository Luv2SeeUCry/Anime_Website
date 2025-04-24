document.addEventListener('DOMContentLoaded', function() {
    loadUpcomingReleases();
});

function loadUpcomingReleases() {
    const container = document.getElementById('upcoming-releases');
    if (!container) return;

    container.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-light" role="status"></div></div>';

    fetch('http://localhost:5000/api/upcoming')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(releases => {
            if (releases.length === 0) {
                container.innerHTML = '<div class="col-12"><div class="alert alert-info">No upcoming releases scheduled.</div></div>';
                return;
            }
            const groupedByDay = groupReleasesByDay(releases);
            container.innerHTML = generateScheduleHTML(groupedByDay);
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

function groupReleasesByDay(releases) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const grouped = {};
    days.forEach(day => grouped[day] = []);
    
    releases.forEach(release => {
        if (release.day_of_week in grouped) {
            grouped[release.day_of_week].push(release);
        }
    });
    
    return grouped;
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
                                    <img src="${release.image_url || 'assets/images/placeholder.jpg'}" 
                                         class="me-3" style="width: 80px; height: 120px; object-fit: cover;">
                                    <div>
                                        <h6 class="mb-1">${release.title}</h6>
                                        <small class="text-muted">${release.time_jst} JST</small>
                                        ${release.studio ? `<p class="mb-1 small">Studio: ${release.studio}</p>` : ''}
                                        ${release.episodes ? `<p class="mb-1 small">Episodes: ${release.episodes}</p>` : ''}
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