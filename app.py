from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import hashlib
import os
from contextlib import contextmanager

app = Flask(__name__)
app.static_folder = 'assets'
app.static_url_path = '/assets'
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

def init_db():
    conn = sqlite3.connect('anime_dynasty.db')
    c = conn.cursor()
    
    # Create comments table only since we don't need users table anymore
    c.execute('''CREATE TABLE IF NOT EXISTS comments
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT,
                  text TEXT,
                  timestamp TEXT,
                  episode_id TEXT)''')
    
    conn.commit()
    conn.close()

@app.route('/')
def serve_static():
    return send_from_directory('.', 'index.html')

@app.route('/assets/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('assets/js', filename)

@app.route('/assets/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('assets/images', filename)

@app.route('/assets/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('assets/css', filename)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)