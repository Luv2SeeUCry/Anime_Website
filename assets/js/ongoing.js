document.addEventListener('DOMContentLoaded', function() {
    const animeGrid = document.getElementById('anime-grid');
    
    allOngoingAnime.forEach(anime => {
        const card = createAnimeCard(anime);
        animeGrid.appendChild(card);
    });
});

function createAnimeCard(anime) {
    const card = document.createElement('div');
    card.className = 'col';
    
    // Format title for URL to match Python script's format
    const urlTitle = anime.title.toLowerCase()
        .replace(' - ', '-')    // Replace " - " with "-"
        .replace(/\s+/g, '-');  // Replace remaining spaces with "-"
    
    let episodeSelect = `
        <select class="form-select form-select-sm mb-2" onchange="if(this.value) window.location.href=this.value;">
            <option value="">Previous Episodes</option>
            <option value="episodes/${urlTitle}-episode-1.html">Episode 1</option>
            <option value="episodes/${urlTitle}-episode-2.html">Episode 2</option>
        </select>
    `;

    card.innerHTML = `
        <div class="card h-100 bg-dark text-light">
            <img src="${anime.image}" class="card-img-top" alt="${anime.title}">
            <div class="card-body">
                <h5 class="card-title">${anime.title}</h5>
                <p class="card-text">Latest: Episode ${anime.currentEpisode}</p>
                <p class="card-text">Release: ${anime.releaseDay} at ${anime.releaseTime}</p>
                <p class="card-text"><small class="text-muted">Status: ${anime.status}</small></p>
                <div class="episode-links">
                    ${episodeSelect}
                    <a href="episodes/${urlTitle}-episode-${anime.currentEpisode}.html" 
                       class="btn btn-primary w-100">
                       Watch Latest Episode
                    </a>
                </div>
            </div>
        </div>
    `;
    return card;
}