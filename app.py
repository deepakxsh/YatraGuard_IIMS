from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List

app = FastAPI()

authority_connections: List[WebSocket] = []

@app.get("/")
def home():
    return {"status": "YatraGuard backend is running"}

@app.websocket("/ws/authority")
async def authority_ws(ws: WebSocket):
    await ws.accept()
    authority_connections.append(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        authority_connections.remove(ws)

@app.post("/test-alert")
async def test_alert():
    alert = {
        "yatra_id": "ABC123",
        "level": "RED",
        "reason": "TEST ALERT"
    }
    for ws in authority_connections:
        await ws.send_json(alert)
    return {"sent": True}
