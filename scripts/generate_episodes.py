import os
from string import Template

def create_episode_page(anime, episode):
    template_path = '../episodes/episode-template.html'
    with open(template_path, 'r') as f:
        template = Template(f.read())
    
    episode_content = template.substitute(
        title=anime['title'],
        episode=episode,
        video_url=f"https://your-video-source/{anime['id']}/{episode}"
    )
    
    filename = f"{anime['title'].lower().replace(' ', '-')}-{episode}.html"
    with open(f'../episodes/{filename}', 'w') as f:
        f.write(episode_content)

def main():
    # Get anime list from ongoing-anime.js
    # Generate pages for each new episode
    pass

if __name__ == "__main__":
    main()