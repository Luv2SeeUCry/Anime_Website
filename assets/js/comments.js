// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

// Authentication status check
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
        const username = localStorage.getItem('username');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        showCommentSection(username, isAdmin);
    } else {
        showLoginSection();
    }
}

// Show/Hide Sections
function showLoginSection() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('commentSection').classList.add('d-none');
}

function showCommentSection(username, isAdmin) {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('commentSection').classList.remove('d-none');
    document.getElementById('loggedInUser').textContent = `Logged in as ${username}${isAdmin ? ' (Admin)' : ''}`;
    loadComments();
}

function showRegister() {
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    registerModal.show();
}

async function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    try {
        // Get existing users or initialize empty array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username already exists
        if (users.some(user => user.username === username)) {
            alert('Username already exists');
            return;
        }

        // Check if email already exists
        if (users.some(user => user.email === email)) {
            alert('Email already exists');
            return;
        }

        // Add new user
        users.push({
            username,
            email,
            password, // In a real app, this should be hashed
            isAdmin: false
        });

        // Save updated users array
        localStorage.setItem('users', JSON.stringify(users));
        
        // Close modal
        const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        registerModal.hide();
        
        // Clear form
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        // Show success message and prompt to login
        alert('Registration successful! Please login with your credentials.');
        showLoginSection();
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

// Update login function to check against registered users
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // For demo purposes, check if it's the admin user
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('authToken', 'demo-token');
            localStorage.setItem('username', 'admin');
            localStorage.setItem('isAdmin', 'true');
            showCommentSection('admin', true);
            return;
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Store auth info
            localStorage.setItem('authToken', 'demo-token');
            localStorage.setItem('username', user.username);
            localStorage.setItem('isAdmin', user.isAdmin);
            
            // Show comment section
            showCommentSection(user.username, user.isAdmin);
        } else {
            alert('Invalid username or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    showLoginSection();
}

// Comment Functions
async function postComment() {
    const commentText = document.getElementById('commentText').value.trim();
    if (!commentText) {
        alert('Please enter a comment');
        return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Please login to post comments');
        return;
    }

    try {
        // Get existing comments or initialize empty array
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        
        // Create new comment object
        const newComment = {
            id: Date.now(), // Use timestamp as unique ID
            text: commentText,
            username: localStorage.getItem('username'),
            timestamp: new Date().toISOString(),
            mentions: extractMentions(commentText)
        };

        // Add new comment to array
        comments.push(newComment);

        // Save updated comments array
        localStorage.setItem('comments', JSON.stringify(comments));

        // Clear input and reload comments
        document.getElementById('commentText').value = '';
        loadComments();

    } catch (error) {
        console.error('Error posting comment:', error);
        alert('Failed to post comment. Please try again.');
    }
}

function deleteComment(commentId) {
    const currentUser = localStorage.getItem('username');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    if (isAdmin || comment.username === currentUser) {
        const updatedComments = comments.filter(c => c.id !== commentId);
        localStorage.setItem('comments', JSON.stringify(updatedComments));
        loadComments();
    } else {
        alert('You do not have permission to delete this comment.');
    }
}

function processCommentText(text) {
    // Convert @mentions to clickable links
    return text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
}

function extractMentions(text) {
    const mentions = text.match(/@(\w+)/g) || [];
    return mentions.map(mention => mention.substring(1));
}

function loadComments() {
    const commentsContainer = document.getElementById('comments-container');
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const currentUser = localStorage.getItem('username');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    commentsContainer.innerHTML = comments.map(comment => `
        <div class="comment bg-dark text-light p-3 mb-3 rounded">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong>${comment.username}</strong>
                <div>
                    <small class="text-muted">${new Date(comment.timestamp).toLocaleString()}</small>
                    ${(isAdmin || comment.username === currentUser) ? 
                        `<button class="btn btn-danger btn-sm ms-2" onclick="deleteComment(${comment.id})">
                            <i class="fas fa-trash"></i>
                        </button>` : 
                        ''}
                </div>
            </div>
            <p class="mb-0">${comment.text}</p>
            ${comment.mentions.length > 0 ? 
                `<div class="mentions mt-2">
                    <small class="text-muted">Mentioned: ${comment.mentions.join(', ')}</small>
                </div>` : 
                ''}
        </div>
    `).join('');

    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p class="text-muted">No comments yet. Be the first to comment!</p>';
    }
}

// Add mention suggestion functionality
document.getElementById('commentText')?.addEventListener('input', function(e) {
    const cursorPos = this.selectionStart;
    const text = this.value;
    const lastAtSymbol = text.lastIndexOf('@', cursorPos);
    
    if (lastAtSymbol !== -1 && lastAtSymbol < cursorPos) {
        const query = text.substring(lastAtSymbol + 1, cursorPos).toLowerCase();
        showMentionSuggestions(query);
    } else {
        hideMentionSuggestions();
    }
});

function showMentionSuggestions(query) {
    // Get all unique usernames from comments
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const usernames = [...new Set(comments.map(c => c.username))];
    
    const matches = usernames.filter(username => 
        username.toLowerCase().includes(query) && username !== localStorage.getItem('username')
    );

    const suggestionBox = document.getElementById('mentionSuggestions') || 
        createMentionSuggestionsBox();

    if (matches.length > 0) {
        suggestionBox.innerHTML = matches.map(username => 
            `<div class="suggestion" onclick="insertMention('${username}')">${username}</div>`
        ).join('');
        suggestionBox.style.display = 'block';
    } else {
        suggestionBox.style.display = 'none';
    }
}

function createMentionSuggestionsBox() {
    const box = document.createElement('div');
    box.id = 'mentionSuggestions';
    box.className = 'mention-suggestions';
    document.getElementById('commentSection').appendChild(box);
    return box;
}

function hideMentionSuggestions() {
    const suggestionBox = document.getElementById('mentionSuggestions');
    if (suggestionBox) {
        suggestionBox.style.display = 'none';
    }
}

function insertMention(username) {
    const textarea = document.getElementById('commentText');
    const text = textarea.value;
    const cursorPos = textarea.selectionStart;
    const lastAtSymbol = text.lastIndexOf('@', cursorPos);
    
    const beforeMention = text.substring(0, lastAtSymbol);
    const afterMention = text.substring(cursorPos);
    
    textarea.value = beforeMention + '@' + username + ' ' + afterMention;
    textarea.focus();
    hideMentionSuggestions();
}