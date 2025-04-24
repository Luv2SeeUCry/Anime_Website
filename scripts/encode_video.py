import subprocess
import os

def encode_video(input_file, output_dir, episode_num):
    resolutions = {
        '1080p': '1920x1080',
        '720p': '1280x720',
        '360p': '640x360'
    }
    
    for quality, resolution in resolutions.items():
        output_file = f"{output_dir}/{quality}/episode-{episode_num}.mp4"
        
        command = [
            'ffmpeg',
            '-i', input_file,  # Input file
            '-vf', f'scale={resolution}',  # Resolution
            '-c:v', 'libx264',  # Video codec
            '-crf', '23',  # Quality (lower = better, 18-28 is good)
            '-c:a', 'aac',  # Audio codec
            '-b:a', '128k',  # Audio bitrate
            output_file
        ]
        
        subprocess.run(command)