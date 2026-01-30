import cv2
from alert_state import alert_state, update_alert

def start_running():
    print("🏃 Running detection started")

    cap = cv2.VideoCapture(0)
    fgbg = cv2.createBackgroundSubtractorMOG2()
    motion_threshold = 25000

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        fgmask = fgbg.apply(frame)
        motion = cv2.countNonZero(fgmask)

        if motion > motion_threshold:
            alert_state["running"] = True
        else:
            alert_state["running"] = False

        update_alert()

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    print("⏹ Running detection stopped")
