document.addEventListener('DOMContentLoaded', function() {
    // Initialize articles
    loadArticles();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

document.getElementById('gpayButton').addEventListener('click', function(e) {
    e.preventDefault();
    // Add your Google Pay payment logic here
    alert('Google Pay payment integration will be added here');
});

document.getElementById('phonepeButton').addEventListener('click', function(e) {
    e.preventDefault();
    // Add your PhonePe payment logic here
    alert('PhonePe payment integration will be added here');
});

document.getElementById('paytmButton').addEventListener('click', function(e) {
    e.preventDefault();
    // Add your Paytm payment logic here
    alert('Paytm payment integration will be added here');
});