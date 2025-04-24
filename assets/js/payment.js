function initiateDonation() {
    const donationModal = new bootstrap.Modal(document.getElementById('donationModal'));
    donationModal.show();
}

async function processPayment(method) {
    const amount = document.getElementById('donationAmount').value;
    
    switch(method) {
        case 'paypal':
            window.location.href = `https://www.paypal.com/paypalme/YOUR_PAYPAL_USERNAME/${amount}`;
            break;
        case 'gpay':
            showQRCode('gpay');
            break;
        case 'upi':
            showQRCode('upi');
            break;
    }
}

function showQRCode(type) {
    const qrContainer = document.getElementById('qrContainer');
    const paymentInfo = document.getElementById('paymentInfo');
    
    if (type === 'upi') {
        qrContainer.innerHTML = `<img src="assets/images/upi-qr.png" alt="UPI QR Code" class="img-fluid">`;
        paymentInfo.innerHTML = `
            <p>UPI ID: your.upi@bank</p>
            <p>Scan with any UPI app (PhonePe, BHIM, Paytm, etc.)</p>
        `;
    } else if (type === 'gpay') {
        qrContainer.innerHTML = `<img src="assets/images/gpay-qr.png" alt="Google Pay QR Code" class="img-fluid">`;
        paymentInfo.innerHTML = `
            <p>Google Pay Number: +91 XXXXXXXXXX</p>
            <p>Scan with Google Pay app</p>
        `;
    }
    
    document.getElementById('qrSection').style.display = 'block';
}