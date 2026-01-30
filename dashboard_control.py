from flask import Flask, jsonify
from flask_cors import CORS
import threading

from knife_video_test import start_knife_detection

app = Flask(__name__)
CORS(app)

knife_thread = None
knife_running = False

@app.route("/start-knife", methods=["POST"])
def start_knife():
    global knife_thread, knife_running

    if not knife_running:
        knife_running = True
        knife_thread = threading.Thread(
            target=start_knife_detection,
            daemon=True
        )
        knife_thread.start()
        print("🔪 Knife detection thread started")
        return jsonify({"status": "knife started"})

    return jsonify({"status": "knife already running"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "backend alive"})

if __name__ == "__main__":
    print("🚀 Backend running at http://127.0.0.1:5000")
    app.run(port=5000)
