import cv2
from ultralytics import YOLO
from collections import deque

def start_knife_detection():
    # -----------------------------
    # CONFIG
    # -----------------------------
    MODEL_PATH = "runs/detect/knife_yolov82/weights/best.pt"
    VIDEO_SOURCE = 0  # WEBCAM

    PERSON_CONF = 0.3
    OBJECT_CONF = 0.15
    PERSISTENCE_FRAMES = 7
    HAND_ZONE_RATIO = 0.35

    # -----------------------------
    # LOAD MODEL & CAMERA
    # -----------------------------
    model = YOLO(MODEL_PATH)
    cap = cv2.VideoCapture(VIDEO_SOURCE)

    if not cap.isOpened():
        print("❌ Cannot open webcam")
        return

    print("🎥 Knife detection (WEBCAM)")
    print("Press Q to quit")

    knife_memory = deque(maxlen=PERSISTENCE_FRAMES)
    knife_trigger_count = 0
    red_alert_sent = False

    # -----------------------------
    # MAIN LOOP
    # -----------------------------
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)

        results = model(frame, conf=OBJECT_CONF, verbose=False)
        knife_frame = False

        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                label = model.names[cls_id]
                conf = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0])

                # PERSON
                if label == "person" and conf > PERSON_CONF:
                    cv2.rectangle(frame, (x1,y1), (x2,y2), (0,255,0), 2)

                # KNIFE / OBJECT
                if label != "person" and conf > OBJECT_CONF:
                    area = (x2-x1) * (y2-y1)
                    if area < 8000:
                        knife_frame = True
                        cv2.rectangle(frame, (x1,y1), (x2,y2), (0,0,255), 2)
                        cv2.putText(frame, "OBJECT IN HAND",
                                    (x1, y1-10),
                                    cv2.FONT_HERSHEY_SIMPLEX,
                                    0.6, (0,0,255), 2)

        knife_memory.append(knife_frame)

        if sum(knife_memory) >= PERSISTENCE_FRAMES:
            knife_trigger_count += 1
            cv2.putText(frame, "🚨 KNIFE THREAT DETECTED",
                        (30, 40),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1.1, (0,0,255), 3)

            if knife_trigger_count >= 3 and not red_alert_sent:
                red_alert_sent = True
                print("🚨🚨🚨 RED ALERT SENT (Knife detected 3 times)")

        cv2.imshow("YatraGuard | Knife Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("⏹ Knife detection stopped")
