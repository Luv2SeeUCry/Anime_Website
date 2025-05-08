// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    
    // Add click event listeners for login and register buttons
    const loginButton = document.querySelector('button[onclick="login()"]');
    const registerButton = document.querySelector('button[onclick="showRegister()"]');
    
    if (loginButton) {
        loginButton.addEventListener('click', login);
    }
    
    if (registerButton) {
        registerButton.addEventListener('click', showRegister);
    }
    
    // Add event listeners for register modal form
    const registerSubmitButton = document.querySelector('#registerModal button[onclick="register()"]');
    if (registerSubmitButton) {
        registerSubmitButton.addEventListener('click', register);
    }
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
    const loginSection = document.getElementById('loginSection');
    const commentSection = document.getElementById('commentSection');
    
    if (!loginSection || !commentSection) {
        console.error('Required elements not found');
        return;
    }
    
    loginSection.style.display = 'block';
    loginSection.classList.remove('d-none');
    commentSection.classList.add('d-none');
}

function showCommentSection(username, isAdmin) {
    const loginSection = document.getElementById('loginSection');
    const commentSection = document.getElementById('commentSection');
    const loggedInUser = document.getElementById('loggedInUser');
    
    if (!loginSection || !commentSection || !loggedInUser) {
        console.error('Required elements not found');
        return;
    }
    
    loginSection.style.display = 'none';
    loginSection.classList.add('d-none');
    commentSection.classList.remove('d-none');
    loggedInUser.textContent = `Logged in as ${username}${isAdmin ? ' (Admin)' : ''}`;
    loadComments();
}

function showRegister() {
    const registerModalElement = document.getElementById('registerModal');
    if (!registerModalElement) {
        console.error('Registration modal element not found');
        return;
    }
    try {
        const registerModal = new bootstrap.Modal(registerModalElement);
        registerModal.show();
    } catch (error) {
        console.error('Error showing registration modal:', error);
        alert('Failed to open registration form. Please try again.');
    }
}

// Add this function to clear all stored users (for testing)
function clearAllUsers() {
    localStorage.removeItem('users');
}

// Modify the register function to include debug logging
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    
    // Remove all previous event listeners
    const loginButton = document.querySelector('button[onclick="login()"]');
    const registerButton = document.querySelector('button[onclick="showRegister()"]');
    
    // Handle register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Remove the inline onsubmit attribute if it exists
        registerForm.removeAttribute('onsubmit');
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            register();
        });
    }
});

// Update login function to check against registered users
async function login() {
    console.log('Login function called');
    // Get values from the correct input fields
    const username = document.getElementById('username').value.trim();
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

        // Get users from localStorage and debug log
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log('Attempting login for:', username);
        console.log('Stored users:', users);

        // Find user with case-insensitive username comparison
        const user = users.find(u => {
            const usernameMatch = u.username.toLowerCase() === username.toLowerCase();
            const passwordMatch = u.password === password;
            console.log('Checking user:', u.username, 'Username match:', usernameMatch, 'Password match:', passwordMatch);
            return usernameMatch && passwordMatch;
        });

        if (user) {
            // Store auth info
            localStorage.setItem('authToken', 'demo-token');
            localStorage.setItem('username', user.username);
            localStorage.setItem('isAdmin', user.isAdmin || false);
            
            // Clean up any leftover modal artifacts
            document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            // Show comment section
            showCommentSection(user.username, user.isAdmin);
        } else {
            console.log('Login failed - no matching user found');
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

// Add missing closing bracket for loadComments function
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
            <p class="mb-0">${processCommentText(comment.text)}</p>
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
} // Add this closing bracket

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

// Add this at the bottom of the file, after all function declarations
document.addEventListener('DOMContentLoaded', function() {
    const commentText = document.getElementById('commentText');
    if (commentText) {
        commentText.addEventListener('input', function(e) {
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
    }
});

async function register() {
    console.log('Register function called');
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Enhanced validation with better error messages
    if (!username || !email || !password || !confirmPassword) {
        const missingFields = [];
        if (!username) missingFields.push('Username');
        if (!email) missingFields.push('Email');
        if (!password) missingFields.push('Password');
        if (!confirmPassword) missingFields.push('Confirm Password');
        alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
        return;
    }

    // Add password validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Add password strength validation
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Add email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    try {
        // Get existing users or initialize empty array
        let users = [];
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            try {
                users = JSON.parse(storedUsers);
            } catch (e) {
                console.error('Error parsing stored users, resetting users array');
                localStorage.removeItem('users');
            }
        }
        
        // Debug logging
        console.log('Parsed users:', users);
        console.log('Attempting to register username:', username);
        
        // Case-insensitive username check
        if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
            alert('Username already exists');
            return;
        }

        // Case-insensitive email check
        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            alert('Email already exists');
            return;
        }

        // Add new user
        const newUser = {
            username,
            email,
            password, // In a real application, this should be hashed
            isAdmin: false,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after registration
        localStorage.setItem('authToken', 'demo-token');
        localStorage.setItem('username', username);
        localStorage.setItem('isAdmin', 'false');

        // Close modal and cleanup with proper timing
        const registerModalElement = document.getElementById('registerModal');
        if (registerModalElement) {
            const registerModal = bootstrap.Modal.getInstance(registerModalElement);
            if (registerModal) {
                registerModal.hide();
                // Ensure proper cleanup after modal animation
                setTimeout(() => {
                    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                    
                    // Show success message after modal is fully closed
                    alert('Registration successful! You are now logged in.');
                    
                    // Show comment section for the new user
                    showCommentSection(username, false);
                }, 300);
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
        // Cleanup on error
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
}