import requests
import feedparser
import json
import os
from bs4 import BeautifulSoup
from datetime import datetime
import cv2

class AnimeUpdater:
    def __init__(self):
        self.rss_url = "https://subsplease.org/rss/?r=1080"
        self.base_path = "d:/python-projects/Anime_Website"
        self.anime_data_file = f"{self.base_path}/assets/js/ongoing-anime.js"

    def get_latest_episodes(self):
        feed = feedparser.parse(self.rss_url)
        latest_episodes = []
        
        for entry in feed.entries:
            title_parts = entry.title.split(" - ")
            if len(title_parts) >= 2:
                anime_title = title_parts[0]
                episode = title_parts[1].split()[0]
                magnet_link = entry.link
                
                latest_episodes.append({
                    'title': anime_title,
                    'episode': int(episode),
                    'magnet': magnet_link,
                    'published': entry.published
                })
        
        return latest_episodes

    def capture_screenshot(self, video_path, output_path):
        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames // 3)  # Capture from 1/3 of video
        ret, frame = cap.read()
        if ret:
            cv2.imwrite(output_path, frame)
        cap.release()

    def update_anime_data(self, new_episodes):
        with open(self.anime_data_file, 'r+', encoding='utf-8') as f:
            content = f.read()
            anime_data = json.loads(content.split('const ongoingAnime = ')[1].split(';')[0])
            
            for episode in new_episodes:
                anime_exists = False
                for anime in anime_data:
                    if anime['title'].lower() == episode['title'].lower():
                        anime_exists = True
                        if episode['episode'] > anime['currentEpisode']:
                            # Update episode info
                            anime['currentEpisode'] = episode['episode']
                            # Generate screenshot path
                            screenshot_path = f"assets/images/ongoing/{anime['title'].lower().replace(' ', '-')}-{episode['episode']}.jpg"
                            anime['image'] = screenshot_path
                            # Update stream URL
                            anime['streamUrl'] = f"episodes/{anime['title'].lower().replace(' ', '-')}-episode-{episode['episode']}.html"
                
                if not anime_exists:
                    # Add new anime
                    new_anime = {
                        'id': len(anime_data) + 1,
                        'title': episode['title'],
                        'currentEpisode': episode['episode'],
                        'releaseDay': datetime.strptime(episode['published'], '%a, %d %b %Y %H:%M:%S %z').strftime('%A'),
                        'releaseTime': datetime.strptime(episode['published'], '%a, %d %b %Y %H:%M:%S %z').strftime('%H:%M'),
                        'image': f"assets/images/ongoing/{episode['title'].lower().replace(' ', '-')}-{episode['episode']}.jpg",
                        'subtitles': 'English',
                        'status': 'Ongoing'
                    }
                    anime_data.append(new_anime)

            # Write updated data back to file
            f.seek(0)
            f.write(f"const ongoingAnime = {json.dumps(anime_data, indent=4)};")
            f.truncate()

    def run_update(self):
        new_episodes = self.get_latest_episodes()
        self.update_anime_data(new_episodes)

if __name__ == "__main__":
    updater = AnimeUpdater()
    updater.run_update()