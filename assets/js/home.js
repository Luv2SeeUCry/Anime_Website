document.addEventListener('DOMContentLoaded', () => {
    const releasesGrid = document.getElementById('latest-releases-grid');
    if (!releasesGrid) return;

    fetch('assets/js/ongoing-anime.js')
        .then(response => response.text())
        .then(content => {
            const match = content.match(/const allOngoingAnime = (\[[\s\S]*?\]);/);
            if (match) {
                const allAnime = JSON.parse(match[1]);
                const recentlyReleased = allAnime.slice(0, 6);

                recentlyReleased.forEach(anime => {
                    const col = document.createElement('div');
                    col.className = 'col';
                    col.innerHTML = `
                        <div class="anime-card" onclick="window.location.href='${anime.streamUrl}'">
                            <div class="position-relative">
                                <img src="${anime.image}" alt="${anime.title}">
                                <div class="release-time">Released: ${anime.releaseDay}</div>
                            </div>
                            <div class="anime-info">
                                <h5 class="mb-2">${anime.title}</h5>
                                <p class="mb-1">Episode ${anime.currentEpisode}</p>
                                <p class="mb-0">Status: ${anime.status}</p>
                            </div>
                        </div>
                    `;
                    releasesGrid.appendChild(col);
                });
            }
        })
        .catch(error => console.error('Error loading anime data:', error));

    const upcomingContainer = document.getElementById('upcoming-releases');
    if (upcomingContainer) {
        fetch('assets/js/ongoing-anime.js')
            .then(response => response.text())
            .then(content => {
                const match = content.match(/const allOngoingAnime = (\[[\s\S]*?\]);/);
                if (match) {
                    const allAnime = JSON.parse(match[1]);
                    const upcomingFive = allAnime.slice(0, 5);

                    upcomingFive.forEach(anime => {
                        const col = document.createElement('div');
                        col.className = 'col';
                        col.innerHTML = `
                            <div class="upcoming-card">
                                <div class="position-relative">
                                    <img src="${anime.image}" alt="${anime.title}">
                                    <div class="release-date">${anime.releaseDay}</div>
                                </div>
                                <div class="upcoming-info">
                                    <h6 class="mb-2">${anime.title}</h6>
                                    <small>Next: Episode ${anime.currentEpisode + 1}</small>
                                </div>
                            </div>
                        `;
                        upcomingContainer.appendChild(col);
                    });
                }
            })
            .catch(error => console.error('Error loading upcoming anime:', error));
    }
});