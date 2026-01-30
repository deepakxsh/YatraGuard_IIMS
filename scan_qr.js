window.onload = () => {
  let status = document.getElementById("scan-status");

  // Step 1: Fake scanning
  setTimeout(() => {
    status.innerText = "Scanning QR Code…";
  }, 1000);

  // Step 2: Fraud detection
  setTimeout(() => {
    let fraudPopup = document.getElementById("fraud-popup");
    fraudPopup.innerHTML = "<h3>✅ QR Verified</h3><p>AI confirms your QR is authentic.</p>";
    fraudPopup.classList.remove("hidden");

    setTimeout(() => {
      fraudPopup.classList.add("hidden");
      showRoomOptions();
    }, 2000);
  }, 3000);
};

function showRoomOptions() {
  let roomPopup = document.getElementById("room-popup");
  roomPopup.innerHTML = `
    <h3>AI Room Allocation</h3>
    <p>We found 3 available rooms for you:</p>
    <div class="room-options">
      <div class="room-card" onclick="selectRoom('203 - Sea View')">
        <b>Room 203</b><br>Sea View 🌊<br><small>Best for quiet stay</small>
      </div>
      <div class="room-card" onclick="selectRoom('310 - Near Elevator')">
        <b>Room 310</b><br>Near Elevator 🛗<br><small>Quick access</small>
      </div>
      <div class="room-card" onclick="selectRoom('515 - Luxury Suite')">
        <b>Room 515</b><br>Luxury Suite 🏨<br><small>Premium comfort</small>
      </div>
    </div>
  `;
  roomPopup.classList.remove("hidden");
}

function selectRoom(room) {
  document.getElementById("room-popup").classList.add("hidden");
  let recPopup = document.getElementById("recommend-popup");
  recPopup.innerHTML = `
    <div style="
      padding: 32px 24px;
      border-radius: 22px;
      background: linear-gradient(135deg, rgba(255,152,0,0.12) 0%, rgba(30,30,40,0.96) 100%);
      box-shadow: 0 8px 32px rgba(255,152,0,0.18), 0 2px 16px #ff9800;
      border: 2px solid rgba(255,152,0,0.18);
      backdrop-filter: blur(10px);
      ">
      <h3 style="
        margin-top: 0;
        margin-bottom: 18px;
        font-size: 1.6rem;
        font-weight: 700;
        color: #ffb74d;
        text-shadow: 0 2px 8px rgba(255,152,0,0.18);
        letter-spacing: 1px;
      ">Welcome! 🎉</h3>
      <p style="
        margin-bottom: 28px;
        font-size: 1.15rem;
        color: #fff;
        background: rgba(255,152,0,0.08);
        border-radius: 8px;
        padding: 10px 0;
        box-shadow: 0 1px 6px rgba(255,152,0,0.08);
      ">You selected <b>${room}</b></p>
      <h4 style="
        margin-bottom: 18px;
        font-size: 1.18rem;
        color: #ffb74d;
        font-weight: 600;
        letter-spacing: 0.5px;
      ">Our Recommendations</h4>
      <ul style="
        text-align:left;
        margin: 0 0 0 0;
        padding: 0;
        list-style: none;
      ">
        <li style="
          margin-bottom: 22px;
          padding: 16px 18px;
          background: linear-gradient(90deg, rgba(255,152,0,0.09) 0%, rgba(255,255,255,0.05) 100%);
          border-radius: 12px;
          font-size: 1.08rem;
          box-shadow: 0 2px 8px rgba(255,152,0,0.08);
        ">🍽️ <b>Visit the Rooftop Dining at 8PM</b><br><span style="color:#ffb74d;">They offer special discounts!</span></li>
        <li style="
          margin-bottom: 22px;
          padding: 16px 18px;
          background: linear-gradient(90deg, rgba(255,152,0,0.09) 0%, rgba(255,255,255,0.05) 100%);
          border-radius: 12px;
          font-size: 1.08rem;
          box-shadow: 0 2px 8px rgba(255,152,0,0.08);
        ">🚖 <b>Take cash while going out of the hotel</b><br><span style="color:#ffb74d;">Internet doesn't work here sometimes</span></li>
        <li style="
          margin-bottom: 0;
          padding: 16px 18px;
          background: linear-gradient(90deg, rgba(255,152,0,0.09) 0%, rgba(255,255,255,0.05) 100%);
          border-radius: 12px;
          font-size: 1.08rem;
          box-shadow: 0 2px 8px rgba(255,152,0,0.08);
        ">🏊 <b>Hotel is offering spa discount</b><br><span style="color:#ffb74d;">Take the chance!</span></li>
      </ul>
    </div>
  `;
  recPopup.classList.remove("hidden");
}