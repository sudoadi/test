const video = document.getElementById('video');
const resultDiv = document.getElementById('result');

let scannerActive = false;

async function startScanner() {
    if (scannerActive) {
        stopScanner();
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        scannerActive = true;
        scanQRCode();
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera.');
    }
}

function stopScanner() {
    const stream = video.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.srcObject = null;
    scannerActive = false;
}

function scanQRCode() {
    const qrCodeScanner = new QrScanner(video, (result) => {
        resultDiv.textContent = `QR Code Content: ${result}`;
        stopScanner();
    });
    qrCodeScanner.start();
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
