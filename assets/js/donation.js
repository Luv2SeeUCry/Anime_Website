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

// This function would need to be implemented with your actual payment gateway
async function processDonation(donationData) {
    // Integrate with your preferred payment gateway here (Razorpay, Stripe, etc.)
    // This is where you'd handle the actual payment processing
    console.log('Processing donation:', donationData);
    
    // For demonstration purposes, we're just returning a promise
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
}

// Close button functionality
const closeButton = document.querySelector('.btn-close');
closeButton.addEventListener('click', function() {
    const modal = document.getElementById('donationModal');
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal.hide();
});
});