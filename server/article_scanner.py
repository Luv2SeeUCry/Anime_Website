from flask import Flask, jsonify
import os
import json
from datetime import datetime

app = Flask(__name__)

@app.route('/get-articles')
def get_articles():
    articles_dir = '../articles'
    articles = []
    
    for filename in os.listdir(articles_dir):
        if filename.endswith('.html'):
            with open(os.path.join(articles_dir, filename), 'r', encoding='utf-8') as f:
                content = f.read()
                # Extract title, description, and date from meta tags
                title = content.split('<title>')[1].split(' - AnimeVerse')[0]
                # Get file creation date if no date specified
                date = datetime.fromtimestamp(os.path.getctime(
                    os.path.join(articles_dir, filename))).strftime('%B %d, %Y')
                
                articles.append({
                    'title': title,
                    'description': 'Read this exciting article about ' + title,
                    'date': date,
                    'image': f'assets/images/{filename.replace(".html", ".jpg")}',
                    'url': f'articles/{filename}'
                })
    
    return jsonify(articles)

if __name__ == '__main__':
    app.run(port=5000)