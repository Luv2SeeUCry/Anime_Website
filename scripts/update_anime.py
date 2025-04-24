import os
import json
import re

def fetch_anime_data():
    anime_list = [
        {
            "title": "Sword of the Demon Hunter - Kijin Gentoshou",
            "day": "Monday",
            "time": "22:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "My Hero Academia Vigilantes",
            "day": "Monday",
            "time": "17:30",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Aharen-san wa Hakarenai Season 2",
            "day": "Tuesday",
            "time": "21:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "The Mononoke Lecture Logs of Chuzenji-sensei: He Just Solves All the Mysteries",
            "day": "Tuesday",
            "time": "22:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Summer Pockets",
            "day": "Wednesday",
            "time": "21:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "The Shiunji Family Children",
            "day": "Wednesday",
            "time": "22:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "The Beginning After The End",
            "day": "Thursday",
            "time": "21:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Please Put Them On, Takamine-san",
            "day": "Thursday",
            "time": "22:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Your Forma",
            "day": "Thursday",
            "time": "23:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "The Too-Perfect Saint: Tossed Aside by My Fiance and Sold To Another Kingdom",
            "day": "Thursday",
            "time": "23:30",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Rock is a Lady's Modesty",
            "day": "Thursday",
            "time": "24:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "The Brilliant Healer's New Life in the Shadows",
            "day": "Friday",
            "time": "20:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Wind Breaker Season 2",
            "day": "Friday",
            "time": "20:30",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Danjoru - Can a Friendship Between A Boy and a Girl Hold Up (No, It Can't!!)",
            "day": "Friday",
            "time": "21:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Bye Bye Earth Season 2",
            "day": "Friday",
            "time": "21:30",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Fire Force Season 3 Part 1",
            "day": "Friday",
            "time": "25:25",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Teogonia",
            "day": "Friday",
            "time": "22:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Anne Shirley",
            "day": "Saturday",
            "time": "21:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Lazarus",
            "day": "Saturday",
            "time": "23:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "I'm the Evil Lord of an Intergalactic Empire!",
            "day": "Saturday",
            "time": "22:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "SHOSHIMIN: How to Become Ordinary Season 2",
            "day": "Saturday",
            "time": "22:30",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Kowloon Generic Romance",
            "day": "Saturday",
            "time": "24:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Kakushite Makina-san",
            "day": "Sunday",
            "time": "20:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "The Unaware Atelier Master",
            "day": "Sunday",
            "time": "20:30",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Yandere Dark Elf: She Chased Me All the Way From Another World",
            "day": "Sunday",
            "time": "21:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Go! Go! Loser Ranger! Season 2",
            "day": "Sunday",
            "time": "21:30",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "From Old Country Bumpkin to Master Swordsman",
            "day": "Sunday",
            "time": "21:30",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "Witch Watch",
            "day": "Sunday",
            "time": "22:00",
            "episode": 3,
            "status": "Ongoing"
        },
        {
            "title": "To Be Hero X",
            "day": "Sunday",
            "time": "22:30",
            "episode": 3,
            "status": "Ongoing"
        }
    ]
    return anime_list

def setup_anime_assets(anime):
    base_dir = 'd:/python-projects/Anime_Website'
    images_dir = f'{base_dir}/assets/images/ongoing'
    
    # Create directory if it doesn't exist
    os.makedirs(images_dir, exist_ok=True)
    
    # Define image paths for each anime
    image_mapping = {
        "Sword of the Demon Hunter - Kijin Gentoshou": "kijin-gentoshou-poster.jpg",
        "My Hero Academia Vigilantes": "mha-vigilantes-poster.jpg",
        "Aharen-san wa Hakarenai Season 2": "aharen-san-s2-poster.jpg",
        "The Mononoke Lecture Logs of Chuzenji-sensei: He Just Solves All the Mysteries": "chuzenji-sensei-poster.jpg",
        "Summer Pockets": "summer-pockets-poster.jpg",
        "The Shiunji Family Children": "shiunji-family-poster.jpg",
        "The Beginning After The End": "tbate-poster.jpg",
        "Please Put Them On, Takamine-san": "takamine-san-poster.jpg",
        "Your Forma": "your-forma-poster.jpg",
        "The Too-Perfect Saint: Tossed Aside by My Fiance and Sold To Another Kingdom": "too-perfect-saint-poster.jpg",
        "Rock is a Lady's Modesty": "rock-lady-poster.jpg",
        "The Brilliant Healer's New Life in the Shadows": "brilliant-healer-poster.jpg",
        "Wind Breaker Season 2": "wind-breaker-s2-poster.jpg",
        "Danjoru - Can a Friendship Between A Boy and a Girl Hold Up (No, It Can't!!)": "danjoru-poster.jpg",
        "Bye Bye Earth Season 2": "bye-bye-earth-s2-poster.jpg",
        "Fire Force Season 3 Part 1": "fire-force-s3-poster.jpg",
        "Teogonia": "teogonia-poster.jpg",
        "Anne Shirley": "anne-shirley-poster.jpg",
        "Lazarus": "lazarus-poster.jpg",
        "I'm the Evil Lord of an Intergalactic Empire!": "evil-lord-poster.jpg",
        "SHOSHIMIN: How to Become Ordinary Season 2": "shoshimin-s2-poster.jpg",
        "Kowloon Generic Romance": "kowloon-romance-poster.jpg",
        "Kakushite Makina-san": "makina-san-poster.jpg",
        "The Unaware Atelier Master": "atelier-master-poster.jpg",
        "Yandere Dark Elf: She Chased Me All the Way From Another World": "yandere-dark-elf-poster.jpg",
        "Go! Go! Loser Ranger! Season 2": "loser-ranger-s2-poster.jpg",
        "From Old Country Bumpkin to Master Swordsman": "bumpkin-swordsman-poster.jpg",
        "Witch Watch": "witch-watch-poster.jpg",
        "To Be Hero X": "to-be-hero-x-poster.jpg"
    }
    
    # Get image filename for this anime
    image_filename = image_mapping.get(anime["title"], "default.jpg")
    image_path = f'{images_dir}/{image_filename}'
    
    # Create a placeholder if image doesn't exist
    if not os.path.exists(image_path):
        print(f"Please add poster image for {anime['title']} at: {image_path}")
        with open(image_path, 'wb') as f:
            f.write(b'placeholder_image')
    
    return f'assets/images/ongoing/{image_filename}'

def update_anime_js(anime_list):
    js_file_path = 'd:/python-projects/Anime_Website/assets/js/ongoing-anime.js'
    os.makedirs(os.path.dirname(js_file_path), exist_ok=True)
    
    formatted_anime = [{
        "title": anime["title"],
        "currentEpisode": anime["episode"],
        "releaseDay": anime["day"],
        "releaseTime": anime["time"],
        "status": anime["status"],
        "image": setup_anime_assets(anime),
        "streamUrl": "episodes/" + format_url_title(anime["title"]) + f"-episode-{anime['episode']}.html"
    } for anime in anime_list]
    
    js_content = f'''const latestSixAnime = {json.dumps(formatted_anime[:6], indent=2)};
const allOngoingAnime = {json.dumps(formatted_anime, indent=2)};'''
    
    with open(js_file_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

def format_url_title(title):
    formatted = title.lower()
    formatted = re.sub(r'[^a-z0-9\s-]', '', formatted)
    formatted = re.sub(r'\s+', '-', formatted)
    formatted = re.sub(r'-+', '-', formatted)
    return formatted.strip('-')

def update_episode_files(anime):
    base_dir = 'd:/python-projects/Anime_Website'
    episodes_dir = f'{base_dir}/episodes'
    url_title = format_url_title(anime["title"])
    downloads_dir = f'{base_dir}/downloads/{url_title}'
    
    # Create resolution directories
    resolutions = ['360p', '720p', '1080p']
    for resolution in resolutions:
        os.makedirs(f'{downloads_dir}/{resolution}', exist_ok=True)
    
    for ep_num in range(1, anime['episode'] + 1):
        episode_html = create_episode_html(anime, ep_num)
        episode_file = f'{episodes_dir}/{url_title}-episode-{ep_num}.html'
        
        with open(episode_file, 'w', encoding='utf-8') as f:
            f.write(episode_html)
        
        # Create placeholder files for each resolution
        for resolution in resolutions:
            video_file = f'{downloads_dir}/{resolution}/episode-{ep_num}.mp4'
            if not os.path.exists(video_file):
                with open(video_file, 'wb') as f:
                    f.write(b'placeholder')

def create_episode_html(anime, episode_num):
    url_title = format_url_title(anime["title"])
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{anime["title"]} - Episode {episode_num} - AnimeVerse</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="bg-dark text-light">
    <div class="container py-5">
        <h1>{anime["title"]}</h1>
        <h2>Episode {episode_num}</h2>
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-grid">
                    <select class="form-select" id="episodeSelect" onchange="if(this.value) window.location.href=this.value">
                        <option value="">Previous Episodes</option>
                        {' '.join([f'<option value="{format_url_title(anime["title"])}-episode-{i}.html">Episode {i}</option>' for i in range(1, episode_num + 1)])}
                    </select>
                </div>
            </div>
        </div>
        <div class="video-container mb-4">
            <div class="resolution-selector mb-3">
                <select class="form-select" id="qualitySelect" onchange="changeQuality(this.value)">
                    <option value="1080p">1080p</option>
                    <option value="720p">720p</option>
                    <option value="360p">360p</option>
                </select>
            </div>
            <video controls class="w-100" id="videoPlayer">
                <source src="../downloads/{url_title}/1080p/episode-{episode_num}.mp4" type="video/mp4" id="videoSource">
                Your browser does not support the video tag.
            </video>
        </div>
        <div class="episode-info mb-4">
            <p><i class="fas fa-calendar me-2"></i>Release Day: {anime["day"]}</p>
            <p><i class="fas fa-clock me-2"></i>Release Time: {anime["time"]}</p>
            <p><i class="fas fa-info-circle me-2"></i>Status: {anime["status"]}</p>
        </div>
        <div class="d-grid">
            <a href="../ongoing-anime.html" class="btn btn-primary btn-lg">
                <i class="fas fa-arrow-left me-2"></i>Back to Anime List
            </a>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function changeQuality(quality) {{
            const videoPlayer = document.getElementById('videoPlayer');
            const videoSource = document.getElementById('videoSource');
            const currentTime = videoPlayer.currentTime;
            const wasPlaying = !videoPlayer.paused;
            
            videoSource.src = '../downloads/{url_title}/' + quality + '/episode-{episode_num}.mp4';
            videoPlayer.load();
            
            videoPlayer.addEventListener('loadedmetadata', function() {{
                videoPlayer.currentTime = currentTime;
                if (wasPlaying) {{
                    videoPlayer.play();
                }}
            }}, {{ once: true }});
        }}
    </script>
</body>
</html>'''

def main():
    # Create base directories first
    base_dir = 'd:/python-projects/Anime_Website'
    os.makedirs(f'{base_dir}/episodes', exist_ok=True)
    os.makedirs(f'{base_dir}/downloads', exist_ok=True)
    os.makedirs(f'{base_dir}/assets/images/ongoing', exist_ok=True)
    os.makedirs(f'{base_dir}/assets/js', exist_ok=True)

    # Then process the anime data
    anime_list = fetch_anime_data()
    update_anime_js(anime_list)
    
    # Create episodes for each anime
    for anime in anime_list:
        try:
            update_episode_files(anime)
        except Exception as e:
            print(f"Error processing {anime['title']}: {str(e)}")

if __name__ == '__main__':
    main()