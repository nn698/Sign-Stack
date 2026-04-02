const video = document.getElementById('webcam');
const canvas = document.getElementById('output_canvas');
const ctx = canvas.getContext('2d');
const predictionEl = document.getElementById('prediction');
const captionEl = document.getElementById('live-caption');
const sentenceEl = document.getElementById('sentence-output');

let lastLetter = "";
let fullSentence = "";
let isSpeaking = false;

// 1. Voice Function
function speak(text) {
    if (window.speechSynthesis.speaking) return;
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
}

async function setupAI() {
    const detector = await handPoseDetection.createDetector(
        handPoseDetection.SupportedModels.MediaPipeHands, 
        { runtime: 'mediapipe', solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands', modelType: 'full' }
    );

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadeddata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        detect(detector);
    };
}

async function detect(detector) {
    const hands = await detector.estimateHands(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (hands.length > 0) {
        const landmarks = hands[0].keypoints;
        drawHand(landmarks);
        
        const letter = analyzeSign(landmarks);
        if (letter && letter !== lastLetter) {
            updateResult(letter);
        }
    }
    requestAnimationFrame(() => detect(detector));
}

// 2. Sign Logic (Basic Finger Counting)
function analyzeSign(pts) {
    const indexUp = pts[8].y < pts[6].y;
    const middleUp = pts[12].y < pts[10].y;
    const ringUp = pts[16].y < pts[14].y;
    const pinkyUp = pts[20].y < pts[18].y;
    const thumbUp = pts[4].x < pts[3].x; // Assuming right hand

    if (indexUp && !middleUp && !ringUp && !pinkyUp) return "D"; // Pointing
    if (indexUp && middleUp && !ringUp && !pinkyUp) return "V"; // Victory
    if (indexUp && middleUp && ringUp && pinkyUp && thumbUp) return "HELLO";
    if (!indexUp && !middleUp && !ringUp && !pinkyUp) return "A"; // Fist
    return null;
}

function updateResult(letter) {
    lastLetter = letter;
    predictionEl.innerText = letter;
    captionEl.innerText = `Sign Detected: ${letter}`;
    
    // Speak and add to sentence
    speak(letter);
    fullSentence += " " + letter;
    sentenceEl.innerText = fullSentence;
}

function drawHand(points) {
    ctx.fillStyle = "#00f2ff";
    points.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 2*Math.PI); ctx.fill();
    });
}

function clearSentence() {
    fullSentence = "";
    sentenceEl.innerText = "";
}

setupAI();