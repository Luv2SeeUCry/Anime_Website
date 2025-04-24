// User management
// Add at the top with other variables
let currentUser = null;
let isAdmin = false;

// Add this function to check stored credentials
function checkStoredCredentials() {
    const storedUser = localStorage.getItem('currentUser');
    const storedAdmin = localStorage.getItem('isAdmin');
    const storedPassword = localStorage.getItem('password');
    
    if (storedUser && storedPassword) {
        // Verify stored credentials with server
        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: storedUser, 
                password: storedPassword 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = storedUser;
                isAdmin = data.isAdmin || false;
                showCommentSection();
                loadComments();
            } else {
                // Clear invalid stored credentials
                localStorage.clear();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            localStorage.clear();
        });
    }
}

// Update login function to store password
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = username;
            isAdmin = data.isAdmin || false;
            // Store only session token, not password
            localStorage.setItem('currentUser', currentUser);
            localStorage.setItem('isAdmin', isAdmin);
            localStorage.setItem('sessionToken', data.token); // Server should provide a token
            showCommentSection();
            loadComments();
        } else {
            alert(data.message || 'Invalid credentials');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed. Please try again.');
    });
}

// Update the logout function
function logout() {
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    document.getElementById('loginSection').classList.remove('d-none');
    document.getElementById('commentSection').classList.add('d-none');
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    checkStoredCredentials();
    loadComments();
});

// Add these functions to your existing comments.js

function showRegister() {
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    registerModal.show();
}


// Add this function to show/hide comment sections
function showCommentSection() {
    if (currentUser) {
        document.getElementById('loginSection').classList.add('d-none');
        document.getElementById('commentSection').classList.remove('d-none');
        document.getElementById('loggedInUser').textContent = `Logged in as: ${currentUser}`;
    } else {
        document.getElementById('loginSection').classList.remove('d-none');
        document.getElementById('commentSection').classList.add('d-none');
    }
}

// Add this function to load comments
// Update the loadComments function to include delete button for admins
function loadComments() {
    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) return;

    fetch('http://localhost:5000/api/comments')
        .then(response => response.json())
        .then(comments => {
            commentsContainer.innerHTML = comments.map(comment => `
                <div class="comment">
                    <div class="comment-header">
                        <span>${comment.username}</span>
                        <span>${comment.timestamp}</span>
                        ${isAdmin ? `
                            <button class="btn btn-sm btn-danger" onclick="deleteComment(${comment.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                    <div class="comment-content">${comment.text}</div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error loading comments:', error);
        });
}

// Add the deleteComment function
function deleteComment(commentId) {
    if (!isAdmin || !currentUser) return;

    if (confirm('Are you sure you want to delete this comment?')) {
        fetch(`http://localhost:5000/api/comments/${commentId}?username=${currentUser}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadComments(); // Reload comments after deletion
            } else {
                alert('Failed to delete comment: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete comment');
        });
    }
}

function addCommentToDOM(comment) {
    const container = document.getElementById('comments-container');
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    
    const date = new Date(comment.timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    const deleteButton = isAdmin ? 
        `<button class="btn btn-danger btn-sm" onclick="deleteComment(${comment.id})">
            <i class="fas fa-trash"></i>
         </button>` : '';

    commentElement.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${comment.username}</span>
            <div class="d-flex align-items-center gap-2">
                <span class="comment-date">${formattedDate}</span>
                ${deleteButton}
            </div>
        </div>
        <div class="comment-content">${comment.text}</div>
    `;

    container.insertBefore(commentElement, container.firstChild);
}

// Add mention click handler
function handleMentionClick(username) {
    document.getElementById('commentText').value += `@${username} `;
    document.getElementById('commentText').focus();
}

// Add CSS for mentions
const style = document.createElement('style');
style.textContent = `
    .mention {
        color: #007bff;
        font-weight: bold;
        cursor: pointer;
    }
    .mention:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(style);

// At the top of the file, after variable declarations
window.login = login;
window.showRegister = showRegister;
window.register = register;
window.logout = logout;
window.postComment = postComment;
window.deleteComment = deleteComment;