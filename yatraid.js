// Snowfall
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let snowflakes = [];
for (let i = 0; i < 100; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    d: Math.random() + 1
  });
}

function drawSnowflakes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.beginPath();
  snowflakes.forEach(s => {
    ctx.moveTo(s.x, s.y);
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2, true);
  });
  ctx.fill();
  snowflakes.forEach(s => {
    s.y += Math.pow(s.d, 2) + 1;
    if (s.y > canvas.height) {
      s.x = Math.random() * canvas.width;
      s.y = 0;
    }
  });
}
setInterval(drawSnowflakes, 25);

// Face verification
const yatraBtn = document.getElementById("yatraBtn");
const cameraModal = document.getElementById("cameraModal");
const video = document.getElementById("camera");
const statusText = document.getElementById("status");
const locationText = document.getElementById("location");

yatraBtn.addEventListener("click", () => {
  cameraModal.classList.remove("hidden");

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;

      let seconds = 0;
      const duration = Math.floor(Math.random() * 4) + 7;
      const timer = setInterval(() => {
        seconds++;
        statusText.textContent = `Scanning... ${seconds}s`;
        if (seconds >= duration) {
          clearInterval(timer);
          stream.getTracks().forEach(track => track.stop());
          statusText.textContent = "Verification complete ✅";
          fetchLocation();
        }
      }, 1000);
    })
    .catch(() => alert("Camera access denied!"));
});

function fetchLocation() {
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      locationText.textContent = `Location: ${data.city}, ${data.region}, ${data.country_name}`;
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    })
    .catch(() => {
      locationText.textContent = "Location not available.";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    });
}
