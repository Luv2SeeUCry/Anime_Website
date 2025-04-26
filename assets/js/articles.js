// Article data
const articles = [
    {
        id: 1,
        title: "TOP 10 BEST ROMANCE ANIME OF ALL TIME",
        image: "assets/images/romance-anime.jpg",
        link: "articles/romance-anime.html",
        category: "romance"
    },
    {
        id: 2,
        title: "15 MUST-WATCH COMEDY ANIME",
        image: "assets/images/comedy-anime.jpg",
        link: "articles/comedy-anime.html",
        category: "comedy"
    },
    {
        id: 3,
        title: "TOP 10 BEST SLICE OF LIFE ANIME TO WATCH",
        image: "assets/images/slice-of-life.jpg",
        link: "articles/slice-of-life.html",
        category: "slice-of-life"
    },
    {
        id: 4,
        title: "TOP 10 ROMANTIC COMEDY ANIME",
        image: "assets/images/romcom-anime.jpg",
        link: "articles/romcom-anime.html",
        category: "romcom"
    }
];

// Function to render articles
function renderArticles() {
    const container = document.getElementById('all-articles-container');
    container.innerHTML = articles.map(article => `
        <div class="col-md-4 mb-4">
            <div class="article-card">
                <img src="${article.image}" class="w-100" alt="${article.title}">
                <a href="${article.link}" class="read-more-btn">
                    <i class="fas fa-book-open"></i> Read More
                </a>
            </div>
        </div>
    `).join('');
}

// Add CSS styles for article cards
const style = document.createElement('style');
style.textContent = `
    .article-card {
        border-radius: 15px;
        overflow: hidden;
        position: relative;
        height: 300px;
    }

    .article-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .read-more-btn {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #dc3545;
        color: white;
        text-decoration: none;
        padding: 8px 20px;
        border-radius: 5px;
        font-size: 0.9rem;
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }

    .read-more-btn:hover {
        background-color: #c82333;
        color: white;
        text-decoration: none;
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', renderArticles);