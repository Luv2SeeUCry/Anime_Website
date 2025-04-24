import os
import json
from datetime import datetime

def update_articles_json():
    # Use absolute paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    articles_dir = os.path.join(base_dir, 'articles')
    images_dir = os.path.join(base_dir, 'assets', 'images')
    json_file = os.path.join(base_dir, 'data', 'articles.json')

    # Check if directories exist
    if not os.path.exists(articles_dir):
        print(f"Articles directory not found: {articles_dir}")
        return
    
    # Get all article HTML files
    article_files = [f for f in os.listdir(articles_dir) if f.endswith('.html')]
    
    if not article_files:
        print("No article files found!")
        return

    articles = []
    for article_file in article_files:
        article_path = os.path.join(articles_dir, article_file)
        try:
            with open(article_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Extract title from HTML
                title = content.split('<title>')[1].split(' - AnimeVerse')[0]
                
                # Create article entry
                article_id = article_file.replace('.html', '')
                image_name = f"{article_id}.jpg"
                
                articles.append({
                    "id": article_id,
                    "title": title,
                    "description": f"Read about {title}",
                    "date": datetime.now().strftime("%Y-%m-%d"),
                    "image": f"assets/images/{image_name}",
                    "url": f"articles/{article_file}"
                })
                print(f"Added article: {title}")

        except Exception as e:
            print(f"Error processing {article_file}: {str(e)}")

    if articles:
        # Sort articles by date (newest first)
        articles.sort(key=lambda x: x['date'], reverse=True)

        # Save to articles.json
        try:
            os.makedirs(os.path.dirname(json_file), exist_ok=True)
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump({"articles": articles}, f, indent=4)
            print(f"Successfully updated {json_file}")
        except Exception as e:
            print(f"Error saving JSON file: {str(e)}")
    else:
        print("No articles to save!")

if __name__ == "__main__":
    update_articles_json()