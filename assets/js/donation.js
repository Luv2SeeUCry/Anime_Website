let selectedAmount = 0;
let selectedPaymentMethod = '';

// Handle amount selection
document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedAmount = parseInt(this.dataset.amount);
        updateConfirmButton();
    });
});

// Handle custom amount input
const customAmountInput = document.querySelector('.custom-amount-input');
customAmountInput.addEventListener('input', function() {
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
    selectedAmount = parseInt(this.value) || 0;
    updateConfirmButton();
});

function updateConfirmButton() {
    const confirmBtn = document.querySelector('.donate-confirm-btn');
    confirmBtn.disabled = !(selectedAmount > 0);
}

// Handle donation confirmation
document.querySelector('.donate-confirm-btn').addEventListener('click', async function() {
    const isAnonymous = document.querySelector('#anonymousDonation').checked;
    
    if (selectedAmount < 1) {
        alert('Please select a valid amount');
        return;
    }

    try {
        const options = {
            ...razorpayConfig,
            amount: selectedAmount * 100, // Razorpay expects amount in paise
            handler: function(response) {
                // Payment successful
                handlePaymentSuccess(response, isAnonymous);
            },
            modal: {
                ondismiss: function() {
                    console.log('Payment modal closed');
                }
            },
            prefill: {
                name: '', // Can be populated if you have user info
                email: '',
                contact: ''
            }
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
        
    } catch (error) {
        console.error('Payment initialization failed:', error);
        alert('Unable to initialize payment. Please try again.');
    }
});

async function handlePaymentSuccess(response, isAnonymous) {
    try {
        // Here you would typically make an API call to your backend
        // to verify and record the payment
        const verificationData = {
            paymentId: response.razorpay_payment_id,
            amount: selectedAmount,
            isAnonymous: isAnonymous,
            timestamp: new Date().toISOString()
        };

        // For demo purposes, just logging
        console.log('Payment successful:', verificationData);
        
        // Show success message
        alert('Thank you for your donation!');
        
        // Reset form
        resetDonationForm();
        
        // Close modal
        const modal = document.getElementById('donationModal');
        const bsModal = bootstrap.Modal.getInstance(modal);
        bsModal.hide();
        
    } catch (error) {
        console.error('Payment verification failed:', error);
        alert('Payment verification failed. Please contact support.');
    }
}

function resetDonationForm() {
    selectedAmount = 0;
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
    customAmountInput.value = '';
    document.querySelector('#anonymousDonation').checked = false;
    updateConfirmButton();
}

// Initialize Razorpay
function initializeRazorpay() {
    const options = {
        key: 'YOUR_TEST_KEY_ID', // Replace with your Razorpay test key
        currency: 'INR',
        name: 'Anime Dynasty',
        description: 'Support Anime Dynasty',
        image: '../assets/images/logo.png',
        handler: function (response) {
            handlePaymentSuccess(response);
        },
        modal: {
            ondismiss: function() {
                handlePaymentFailure('Payment cancelled by user');
            }
        },
        prefill: {
            name: '',
            email: ''
        },
        theme: {
            color: '#ff4757'
        }
    };
    return options;
}

// Process donation with proper error handling
async function processDonation(donationData) {
    try {
        const options = initializeRazorpay();
        options.amount = donationData.amount * 100; // Convert to smallest currency unit
        options.prefill.name = donationData.isAnonymous ? 'Anonymous' : donationData.name || '';
        options.prefill.email = donationData.email || '';

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (error) {
        handlePaymentFailure(error.message);
    }
}

// Handle successful payments with verification
async function handlePaymentSuccess(response) {
    try {
        // Verify payment signature on server
        const verificationData = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
        };

        // Make API call to your backend for payment verification
        const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(verificationData)
        });

        if (!verificationResponse.ok) {
            throw new Error('Payment verification failed');
        }

        const result = await verificationResponse.json();
        
        if (result.verified) {
            showSuccessMessage('Thank you for your donation!');
            resetDonationForm();
            closeDonationModal();
        } else {
            throw new Error('Payment verification failed');
        }

    } catch (error) {
        handlePaymentFailure(error.message);
    }
}

// Handle payment failures
function handlePaymentFailure(errorMessage) {
    showErrorMessage(`Payment failed: ${errorMessage}`);
    console.error('Payment error:', errorMessage);
}

// Show success message
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        <strong>Success!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.donation-message').appendChild(alertDiv);
}

// Show error message
function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        <strong>Error!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.donation-message').appendChild(alertDiv);
}

// Close donation modal
function closeDonationModal() {
    const modal = document.getElementById('donationModal');
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal.hide();
}

// Close button functionality
const closeButton = document.querySelector('.btn-close');
closeButton.addEventListener('click', function() {
    const modal = document.getElementById('donationModal');
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal.hide();
});
