window.addEventListener("DOMContentLoaded", () => {

  const knifeBtn = document.getElementById("startKnifeBtn"); 
  // ⬆️ this ID MUST exist on your button

  if (!knifeBtn) {
    console.error("❌ startKnifeBtn not found in dashboard.html");
    return;
  }

  knifeBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/start-knife", {
        method: "POST"
      });

      if (!res.ok) {
        throw new Error("Backend responded but with error");
      }

      const data = await res.json();
      console.log("✅ Backend response:", data);

      knifeBtn.innerText = "🔴 KNIFE DETECTION RUNNING";
      knifeBtn.style.background = "linear-gradient(90deg, #ff5252, #ff1744)";
      knifeBtn.disabled = true;

    } catch (err) {
      alert("❌ Backend not running on port 5000");
      console.error(err);
    }
  });

});
