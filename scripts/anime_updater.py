import feedparser
import json
import os
import requests
from datetime import datetime
import re
from bs4 import BeautifulSoup
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AnimeUpdater:
    def __init__(self):
        self.rss_url = "https://subsplease.org/rss/?r=1080"
        self.base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.image_path = os.path.join(self.base_path, "assets", "images", "ongoing")
        self.js_file = os.path.join(self.base_path, "assets", "js", "ongoing-anime.js")
        
        # Create required directories
        os.makedirs(self.image_path, exist_ok=True)
        os.makedirs(f"{self.base_path}/episodes", exist_ok=True)
        os.makedirs(os.path.dirname(self.js_file), exist_ok=True)

    def fetch_latest_episodes(self):
        logger.info("Fetching data from SubsPlease...")
        try:
            api_url = "https://subsplease.org/api/?f=schedule&tz=Asia/Tokyo"
            response = requests.get(api_url)
            data = response.json()

            shows_data = data.get('schedule', {})
            if not shows_data:
                api_url = "https://subsplease.org/api/?f=latest&tz=Asia/Tokyo"
                response = requests.get(api_url)
                shows_data = response.json().get('data', [])

            if not shows_data:
                logger.warning("No entries found in both APIs")
                return self.get_default_anime()
        except Exception as e:
            logger.error(f"Error fetching API data: {e}")
            return self.get_default_anime()

        # ✅ Flatten the nested list
        all_shows = []
        if isinstance(shows_data, dict):
            for day_shows in shows_data.values():
                if isinstance(day_shows, list):
                    all_shows.extend(day_shows)
        elif isinstance(shows_data, list):
            all_shows = shows_data

        episodes = []
        current_anime = [  # Spring 2025 Anime Season (April-June)
            # Monday
            "Sword of the Demon Hunter - Kijin Gentoshou",
            "My Hero Academia Vigilantes",
            "Aharen-san wa Hakarenai season 2",
            "The Mononoke Lecture Logs of Chuzenji-sensei",
            "Summer Pockets",
            # Tuesday
            "The Shiunji Family Children",
            # Wednesday
            "The Beginning After The End",
            "Please Put Them On, Takamine-san",
            "Your Forma",
            "The Too-Perfect Saint",
            "Lycoris Recoil -Friends are thieves of time.-",
            # Thursday
            "Rock is a Lady's Modesty",
            "The Brilliant Healer's New Life in the Shadows",
            "Devil May Cry",
            "Wind Breaker Season 2",
            "Moonrise",
            "Ninja to Koroshiya no Futarigurashi",
            # Friday
            "Danjoru",
            "Bye Bye Earth Season 2",
            "Fire Force Season 3",
            "Tegonia",
            # Saturday
            "Anne Shirley",
            "Lazarus",
            "I'm the Evil Lord of an Intergalactic Empire!",
            "SHOSHIMIN: How to Become Ordinary Season 2",
            "Kowloon Generic Romance",
            # Sunday
            "Kakushite Makina-san",
            "The Unaware Atelier Master",
            "Yandere Dark Elf",
            "Go! Go! Loser Ranger! Season 2",
            "From Old Country Bumpkin to Master Swordsman",
            "Witch Watch",
            "To Be Hero X"
        ]

        for show in all_shows:
            try:
                if not isinstance(show, dict):
                    logger.warning(f"Skipping invalid show format: {show}")
                    continue

                anime_title = show.get('title', show.get('show', ''))
                episode_num = show.get('episode', 1)
                page = show.get('page', '')
                release_time = show.get('time', '')

                if any(current.lower() in anime_title.lower() for current in current_anime):
                    logger.info(f"Processing: {anime_title} - Episode {episode_num}")
                    
                    # Create episode HTML file
                    episode_filename = f"{anime_title.lower().replace(' ', '-')}-episode-{episode_num}.html"
                    episode_path = os.path.join(self.base_path, "episodes", episode_filename)
                    
                    # Create episode HTML content
                    episode_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{anime_title} Episode {episode_num} - Anime Dynasty</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">
                <h1>Anime Dynasty</h1>
            </div>
            <ul>
                <li><a href="../index.html">Home</a></li>
                <li><a href="../articles.html">Articles</a></li>
                <li><a href="../ongoing-anime.html">Latest Releases</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <div class="episode-container">
            <h1>{anime_title} - Episode {episode_num}</h1>
            <div class="episode-video-container">
                <div class="video-player">
                    <div class="video-options">
                        <button class="server-btn active">Server 1</button>
                        <button class="server-btn">Server 2</button>
                        <button class="server-btn">Server 3</button>
                    </div>
                    <div class="video-frame">
                        <iframe src="about:blank" 
                                id="video-iframe"
                                allowfullscreen
                                frameborder="0"
                                width="100%"
                                height="100%">
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <footer>
        <p>&copy; 2024 Anime Dynasty. All rights reserved.</p>
    </footer>
    <script>
        const servers = {{
            'Server 1': 'about:blank',
            'Server 2': 'about:blank',
            'Server 3': 'about:blank'
        }};
        
        document.querySelectorAll('.server-btn').forEach(function(button) {{
            button.addEventListener('click', function() {{
                document.querySelectorAll('.server-btn').forEach(function(btn) {{
                    btn.classList.remove('active');
                }});
                button.classList.add('active');
                document.getElementById('video-iframe').src = servers[button.textContent];
            }});
        }});
    </script>
</body>
</html>"""
                    
                    # Write episode HTML file
                    with open(episode_path, 'w', encoding='utf-8') as f:
                        f.write(episode_html)

                    img_filename = f"{anime_title.lower().replace(' ', '-')}-{episode_num}.jpg"
                    img_path = f"assets/images/ongoing/{img_filename}"

                    show_url = f"https://subsplease.org/shows/{page}"
                    try:
                        full_img_path = os.path.join(self.base_path, img_path)
                        if not os.path.exists(full_img_path):
                            page_resp = requests.get(show_url, timeout=10)
                            soup = BeautifulSoup(page_resp.content, 'html.parser')
                            img_tag = soup.find('img', {'class': 'show-poster'})
                            if img_tag and img_tag.get('src'):
                                img_data = requests.get(img_tag['src'], timeout=10).content
                                with open(full_img_path, 'wb') as f:
                                    f.write(img_data)
                                logger.info(f"Saved image for {anime_title}")
                            else:
                                img_path = "assets/images/ongoing/default.jpg"
                    except Exception as img_error:
                        logger.error(f"Error fetching image: {img_error}")
                        img_path = "assets/images/ongoing/default.jpg"

                    episodes.append({
                        'id': len(episodes) + 1,
                        'title': anime_title,
                        'currentEpisode': episode_num,
                        'releaseDay': datetime.now().strftime('%A'),
                        'releaseTime': release_time,
                        'image': img_path,
                        'subtitles': 'English',
                        'streamUrl': f"episodes/{anime_title.lower().replace(' ', '-')}-episode-{episode_num}.html",
                        'status': 'Ongoing'
                    })

            except Exception as e:
                logger.error(f"Error processing show: {e}")

        logger.info(f"Successfully processed {len(episodes)} episodes")
        return episodes or self.get_default_anime()

    def get_default_anime(self):
        return [{
            'id': 1,
            'title': 'Solo Leveling',
            'currentEpisode': 1,
            'releaseDay': 'Saturday',
            'releaseTime': '14:30',
            'image': 'assets/images/ongoing/default.jpg',
            'subtitles': 'English',
            'streamUrl': 'episodes/solo-leveling-episode-1.html',
            'status': 'Ongoing'
        }]

    def update_js_file(self, episodes):
        try:
            # Get latest 6 episodes for home page
            latest_six = episodes[:6] if len(episodes) > 6 else episodes
            
            js_content = (
                f"const latestSixAnime = {json.dumps(latest_six, indent=2)};\n\n"
                f"const allOngoingAnime = {json.dumps(episodes, indent=2)};\n\n"
                "function loadLatestReleases() {\n"
                "    const container = document.getElementById('latest-releases-grid');\n"
                "    if (!container) return;\n"
                "    \n"
                "    container.innerHTML = '';\n"
                "    latestSixAnime.forEach(anime => {\n"
                "        const card = document.createElement('div');\n"
                "        card.className = 'anime-card';\n"
                "        card.innerHTML = `\n"
                "            <img src='${anime.image}' alt='${anime.title}'>\n"
                "            <div class='anime-info'>\n"
                "                <h3>${anime.title}</h3>\n"
                "                <p>Episode ${anime.currentEpisode}</p>\n"
                "                <p>${anime.releaseDay} at ${anime.releaseTime}</p>\n"
                "                <p>Status: ${anime.status}</p>\n"
                "            </div>\n"
                "        `;\n"
                "        card.onclick = () => window.location.href = anime.streamUrl;\n"
                "        container.appendChild(card);\n"
                "    });\n"
                "}\n\n"
                "let isShowingAll = false;\n\n"
                "function toggleAnimeView() {\n"
                "    isShowingAll = !isShowingAll;\n"
                "    const container = document.getElementById('anime-container');\n"
                "    const viewAllBtn = document.getElementById('view-all-btn');\n"
                "    if (isShowingAll) {\n"
                "        container.classList.add('show-all');\n"
                "        loadAnimeList(allOngoingAnime);\n"
                "        viewAllBtn.textContent = 'Show Less';\n"
                "    } else {\n"
                "        container.classList.remove('show-all');\n"
                "        loadAnimeList(latestAnime);\n"
                "        viewAllBtn.textContent = 'View All';\n"
                "    }\n"
                "}\n\n"
                "function loadAnimeList(animeList) {\n"
                "    const container = document.getElementById('anime-container');\n"
                "    container.innerHTML = '';\n"
                "    animeList.forEach(anime => {\n"
                "        const card = document.createElement('div');\n"
                "        card.className = 'anime-card';\n"
                "        card.innerHTML = `\n"
                "            <img src=\"${anime.image}\" alt=\"${anime.title}\">\n"
                "            <div class=\"anime-info\">\n"
                "                <h3>${anime.title}</h3>\n"
                "                <p>Episode ${anime.currentEpisode}</p>\n"
                "                <p>${anime.releaseDay} at ${anime.releaseTime}</p>\n"
                "                <p>Status: ${anime.status}</p>\n"
                "            </div>\n"
                "        `;\n"
                "        card.onclick = () => window.location.href = anime.streamUrl;\n"
                "        container.appendChild(card);\n"
                "    });\n"
                "}\n\n"
                "document.addEventListener('DOMContentLoaded', () => {\n"
                "    if (document.getElementById('latest-releases-grid')) {\n"
                "        loadLatestReleases();\n"
                "    } else if (document.getElementById('anime-container')) {\n"
                "        loadAnimeList(latestAnime);\n"
                "    }\n"
                "});\n"
            )

            with open(self.js_file, 'w') as f:
                f.write(js_content)
            logger.info("Updated ongoing-anime.js successfully")
        except Exception as e:
            logger.error(f"Error updating JS file: {e}")

    def run_update(self):
        episodes = self.fetch_latest_episodes()
        self.update_js_file(episodes)

if __name__ == "__main__":
    updater = AnimeUpdater()
    updater.run_update()
