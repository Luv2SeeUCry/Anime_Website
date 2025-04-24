const articles = [
    {
        id: 1,
        title: "Top 10 Best Romance Anime of All Time",
        excerpt: "From 'Kimi ni Todoke' to 'Toradora', discover the most heartwarming romance anime that will make you believe in love...",
        image: "assets/images/romance-anime.jpg",
        url: "articles/romance-anime.html",
        publishDate: "2023-10-15", // Changed date format for easier comparison
        fullTitle: "Top 10 Best Romance Anime of All Time - Anime Dynasty",
        description: "Romance anime has given us some of the most heartwarming and memorable love stories. From sweet high school romances to mature relationships, here are our top 10 picks that will make your heart flutter."
    },
    {
        id: 2,
        title: "15 Must-Watch Comedy Anime Series",
        excerpt: "Looking for a good laugh? Check out these hilarious anime series from 'Grand Blue' to 'Gintama'...",
        image: "assets/images/comedy-anime.jpg",
        url: "articles/comedy-anime.html",
        publishDate: "2023-10-15", // Updated format
        fullTitle: "15 Must-Watch Comedy Anime Series - Anime Dynasty",
        description: "Looking for a good laugh? These comedy anime series offer the perfect blend of humor, entertainment, and memorable characters that will keep you laughing throughout each episode."
    },
    {
        id: 3,
        title: "Top 10 Best Slice of Life Anime to Watch",
        excerpt: "Relax with these wholesome slice of life anime series that will warm your heart...",
        image: "assets/images/slice-of-life.jpg",
        url: "articles/slice-of-life.html",
        publishDate: "2023-10-15", // Updated format
        fullTitle: "Top 10 Best Slice of Life Anime - Anime Dynasty",
        description: "Slice of life anime offers a peaceful escape into everyday moments and heartwarming experiences. Here are our top picks that perfectly capture the beauty of ordinary life."
    },
    {
        id: 4,
        title: "Top 10 Romantic Comedy Anime to Watch",
        excerpt: "New to rom-com anime? Start with these perfect blend of romance and humor...",
        image: "assets/images/romcom-anime.jpg",
        url: "articles/romcom-anime.html",
        publishDate: "2023-10-15", // Updated format
        fullTitle: "Top 10 Romantic Comedy Anime - Anime Dynasty",
        description: "Romantic comedies offer the perfect blend of heartwarming moments and laugh-out-loud situations. Here are our top picks for anime series that masterfully combine romance with comedy."
    }
];

function loadArticles() {
    const currentDate = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    // Filter articles less than a week old (for home page only)
    const recentArticles = articles.filter(article => {
        const publishDate = new Date(article.publishDate);
        return (currentDate - publishDate) <= oneWeek;
    });

    // Load recent articles on home page
    const homeContainer = document.getElementById('article-container');
    if (homeContainer) {
        homeContainer.innerHTML = '';
        recentArticles.slice(0, 3).forEach(article => {
            const articleHtml = createArticleCard(article);
            homeContainer.innerHTML += articleHtml;
        });
    }

    // Load ALL articles on articles page
    const allArticlesContainer = document.getElementById('all-articles-container');
    if (allArticlesContainer) {
        allArticlesContainer.innerHTML = '';
        articles.forEach(article => {  // Using the full articles array instead of recentArticles
            const articleHtml = createArticleCard(article);
            allArticlesContainer.innerHTML += articleHtml;
        });
    }
}

function createArticleCard(article) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card bg-dark h-100">
                <div class="position-relative">
                    <img src="${article.image}" class="card-img-top" alt="${article.title}" style="height: 300px; object-fit: cover;">
                    <div class="position-absolute top-0 start-0 w-100 h-100" 
                         style="background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4));">
                    </div>
                    <div class="position-absolute bottom-0 start-0 w-100 pb-2.5">
                        <a href="${article.url}" class="btn btn-primary w-75 mx-auto d-block">Read More</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadArticles);