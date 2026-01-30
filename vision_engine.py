# vision_engine.py

import cv2
from ultralytics import YOLO
from collections import deque
from alert_state import alert_state, recompute_alert

KNIFE_MODEL_PATH = "models/knife_best.pt"
RUN_MODEL_PATH = "models/running_best.pt"

knife_model = YOLO(KNIFE_MODEL_PATH)
run_model = YOLO(RUN_MODEL_PATH)

def start_vision():
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ Camera not opened")
        return

    print("🎥 Camera started")

    knife_memory = deque(maxlen=7)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)

        # ---------------- KNIFE DETECTION ----------------
        knife_results = knife_model(frame, conf=0.2, verbose=False)
        knife_frame = False

        for r in knife_results:
            for box in r.boxes:
                cls = knife_model.names[int(box.cls[0])]
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                if cls != "person":
                    knife_frame = True
                    cv2.rectangle(frame, (x1,y1),(x2,y2),(0,0,255),2)
                    cv2.putText(frame,"KNIFE",(x1,y1-5),
                                cv2.FONT_HERSHEY_SIMPLEX,0.6,(0,0,255),2)

        knife_memory.append(knife_frame)
        if sum(knife_memory) >= 3:
            alert_state["knife_count"] += 1

        # ---------------- RUNNING DETECTION ----------------
        run_results = run_model(frame, conf=0.4, verbose=False)
        running_now = False

        for r in run_results:
            for box in r.boxes:
                cls = run_model.names[int(box.cls[0])]
                x1,y1,x2,y2 = map(int, box.xyxy[0])
                if cls == "running":
                    running_now = True
                    cv2.rectangle(frame,(x1,y1),(x2,y2),(0,255,255),2)
                    cv2.putText(frame,"RUNNING",(x1,y1-5),
                                cv2.FONT_HERSHEY_SIMPLEX,0.6,(0,255,255),2)

        alert_state["running"] = running_now
        recompute_alert()

        # ---------------- ALERT TEXT ----------------
        if alert_state["level"] == "RED":
            cv2.putText(frame,"🚨 RED ALERT",(30,40),
                        cv2.FONT_HERSHEY_SIMPLEX,1,(0,0,255),3)
        elif alert_state["level"] == "YELLOW":
            cv2.putText(frame,"⚠️ RUNNING",(30,40),
                        cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,255),3)

        cv2.imshow("YatraGuard Live AI", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
