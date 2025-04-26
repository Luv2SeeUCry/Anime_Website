from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
from datetime import datetime
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static')
# Enable CORS with more specific settings
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080", "http://127.0.0.1:8080"],
        "methods": ["GET", "POST", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

def init_db():
    conn = sqlite3.connect('anime_dynasty.db')
    c = conn.cursor()
    
    # Drop existing tables and indexes to avoid conflicts
    c.execute('DROP TABLE IF EXISTS comments')
    c.execute('DROP TABLE IF EXISTS users')
    
    # First create the users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL,
                  email TEXT,
                  telegram_id TEXT,
                  google_id TEXT,
                  role TEXT DEFAULT 'user',
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    # Create default admin user using environment variables
    admin_username = os.getenv('ADMIN_USERNAME', 'admin')
    admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')  # fallback for development
    admin_password_hash = generate_password_hash(admin_password)
    
    c.execute('''INSERT OR IGNORE INTO users 
                (username, password, role) 
                VALUES (?, ?, ?)''',
             (admin_username, admin_password_hash, 'admin'))
    
    # Then create the comments table with proper foreign key
    c.execute('''CREATE TABLE IF NOT EXISTS comments
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  episode_id TEXT NOT NULL,
                  user_id INTEGER NOT NULL,
                  content TEXT NOT NULL,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users (id))''')
    
    # Create indexes after all tables are created
    c.execute('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_comments_episode_id ON comments(episode_id)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id)')
    
    conn.commit()
    conn.close()

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    conn = sqlite3.connect('anime_dynasty.db')
    c = conn.cursor()
    try:
        # Check if username already exists
        c.execute('SELECT id FROM users WHERE username = ?', (data['username'],))
        if c.fetchone():
            return jsonify({'error': 'Username already exists'}), 400
            
        # Check if email already exists
        c.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        if c.fetchone():
            return jsonify({'error': 'Email already exists'}), 400
            
        # Hash the password
        hashed_password = generate_password_hash(data['password'])
        
        # Insert new user
        c.execute('''
            INSERT INTO users (username, email, password, role)
            VALUES (?, ?, ?, 'user')
        ''', (data['username'], data['email'], hashed_password))
        
        conn.commit()
        return jsonify({'success': True, 'message': 'Registration successful'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing username or password'}), 400

    conn = sqlite3.connect('anime_dynasty.db')
    c = conn.cursor()
    try:
        c.execute('SELECT id, username, password, role FROM users WHERE username = ?',
                 (data['username'],))
        user = c.fetchone()
        
        if user and check_password_hash(user[2], data['password']):
            return jsonify({
                'success': True,
                'userId': user[0], 
                'username': user[1],
                'role': user[3]
            }), 200
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/comments/<episode_id>', methods=['GET'])
def get_comments(episode_id):
    if not episode_id:
        return jsonify({'error': 'Episode ID is required'}), 400

    conn = sqlite3.connect('anime_dynasty.db')
    c = conn.cursor()
    try:
        c.execute('''SELECT comments.*, users.username 
                     FROM comments 
                     JOIN users ON comments.user_id = users.id 
                     WHERE episode_id = ? 
                     ORDER BY timestamp DESC''', (episode_id,))
        comments = [{'id': row[0], 
                    'episodeId': row[1],
                    'userId': row[2],
                    'content': row[3], 
                    'timestamp': row[4],
                    'username': row[5]} for row in c.fetchall()]
        return jsonify(comments)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/comments', methods=['POST'])
def post_comment():
    data = request.json
    required_fields = ['episodeId', 'userId', 'content']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = sqlite3.connect('anime_dynasty.db')
    c = conn.cursor()
    try:
        c.execute('SELECT id FROM users WHERE id = ?', (data['userId'],))
        if not c.fetchone():
            return jsonify({'error': 'User not found'}), 404

        c.execute('''INSERT INTO comments (episode_id, user_id, content) 
                    VALUES (?, ?, ?)''',
                 (data['episodeId'], data['userId'], data['content']))
        conn.commit()
        
        c.execute('''SELECT comments.*, users.username 
                     FROM comments 
                     JOIN users ON comments.user_id = users.id 
                     WHERE comments.id = last_insert_rowid()''')
        comment = c.fetchone()
        return jsonify({
            'success': True,
            'comment': {
                'id': comment[0],
                'episodeId': comment[1],
                'userId': comment[2],
                'content': comment[3],
                'timestamp': comment[4],
                'username': comment[5]
            }
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    data = request.json
    if not data or 'userId' not in data:
        return jsonify({'error': 'Missing user ID'}), 400

    conn = sqlite3.connect('anime_dynasty.db')
    c = conn.cursor()
    try:
        # Check if the user is an admin
        c.execute('SELECT role FROM users WHERE id = ?', (data['userId'],))
        user = c.fetchone()
        if not user or user[0] != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        # Check if comment exists
        c.execute('SELECT id FROM comments WHERE id = ?', (comment_id,))
        if not c.fetchone():
            return jsonify({'error': 'Comment not found'}), 404

        # Delete the comment
        c.execute('DELETE FROM comments WHERE id = ?', (comment_id,))
        conn.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/admin/change-password', methods=['POST'])
def change_admin_password():
    data = request.json
    if not data or 'userId' not in data or 'currentPassword' not in data or 'newPassword' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    if len(data['newPassword']) < 6:
        return jsonify({'error': 'New password must be at least 6 characters long'}), 400

    conn = sqlite3.connect('anime_dynasty.db')
    c = conn.cursor()
    try:
        # Verify user is admin
        c.execute('SELECT password, role FROM users WHERE id = ?', (data['userId'],))
        user = c.fetchone()
        
        if not user or user[1] != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
            
        # Verify current password
        if not check_password_hash(user[0], data['currentPassword']):
            return jsonify({'error': 'Current password is incorrect'}), 401
            
        # Update password
        new_password_hash = generate_password_hash(data['newPassword'])
        c.execute('UPDATE users SET password = ? WHERE id = ?',
                 (new_password_hash, data['userId']))
        conn.commit()
        
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    init_db()
    app.run(debug=True)