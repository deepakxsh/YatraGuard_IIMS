# alert_state.py

alert_state = {
    "running": False,
    "knife_count": 0,
    "level": "SAFE"
}

def recompute_alert():
    if alert_state["knife_count"] >= 3:
        alert_state["level"] = "RED"
    elif alert_state["running"]:
        alert_state["level"] = "YELLOW"
    else:
        alert_state["level"] = "SAFE"
