console.log("login.js loaded");

const loginBtn = document.getElementById("loginBtn");
const cameraModal = document.getElementById("cameraModal");
const video = document.getElementById("camera");
const statusText = document.getElementById("status");

const MODEL_URL = "./models";

async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  console.log("Face models loaded");
}

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

loginBtn.onclick = async () => {
  const aadhaar = document.getElementById("aadhaar").value.trim();
  const bookingId = document.getElementById("bookingId").value.trim();

  // 🔓 DEMO / JUDGE BYPASS CODE
  if (
    bookingId === "DEMO" ||
    aadhaar === "DEMO"
  ) {
    console.log("Demo mode activated");

    localStorage.setItem("yatraguard_token", "DEMO_LOGIN");
    localStorage.setItem("yatraguard_user", "DEMO_USER");

    window.location.href = "dashboard.html";
    return;
  }

  // ❗ Normal flow below
  if (!aadhaar) {
    alert("Enter Aadhaar");
    return;
  }

  const storedFace = localStorage.getItem("aadhaar_face_" + aadhaar);
  if (!storedFace) {
    alert("Face not enrolled for this Aadhaar");
    return;
  }

  cameraModal.classList.remove("hidden");
  statusText.innerText = "Verifying face...";

  await loadModels();
  await startCamera();

  setTimeout(() => verifyFace(aadhaar), 3000);
};


async function verifyFace(aadhaar) {
  const storedDescriptor = new Float32Array(
    JSON.parse(localStorage.getItem("aadhaar_face_" + aadhaar))
  );

  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true)
    .withFaceDescriptor();

  if (!detection) {
    statusText.innerText = "❌ No face detected";
    return;
  }

  const distance = faceapi.euclideanDistance(
    detection.descriptor,
    storedDescriptor
  );

  console.log("Face distance:", distance);

  if (distance < 0.5) {
    statusText.innerText = "✅ Face verified successfully";

    // 🔐 CREATE LOGIN SESSION
    localStorage.setItem("yatraguard_token", "LOGGED_IN");
    localStorage.setItem("yatraguard_user", aadhaar);

    // 🧭 REDIRECT TO DASHBOARD
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } else {
    statusText.innerText = "❌ Face does not match";
  }
}
// 🚨 Force instruction modal acknowledgement
window.onload = () => {
  const modal = document.getElementById("instructionModal");
  const okBtn = document.getElementById("instructionOk");

  okBtn.onclick = () => {
    modal.style.display = "none";
  };
};
