from fastapi.testclient import TestClient
from services.api.app.main import app

client = TestClient(app)


def test_health_checks():
    live_res = client.get("/health/live")
    assert live_res.status_code == 200
    assert live_res.json()["status"] == "healthy"

    ready_res = client.get("/health/ready")
    assert ready_res.status_code == 200
    assert ready_res.json()["catalog_loaded"] is True
    assert ready_res.json()["figures_count"] >= 6


def test_conversation_lifecycle_and_messages():
    # 1. Create conversation
    conv_res = client.post("/api/v1/conversations", json={
        "figure_id": "marcus_aurelius",
        "user_id": "test_scholar",
        "settings": {"retention_days": 30}
    })
    assert conv_res.status_code == 200
    conv_data = conv_res.json()
    conv_id = conv_data["conversation_id"]
    assert conv_data["figure_id"] == "marcus_aurelius"

    # 2. Submit question
    msg_res = client.post(f"/api/v1/conversations/{conv_id}/messages", json={
        "message": "How do you prepare for dealing with meddling or ungrateful people in the morning?"
    })
    assert msg_res.status_code == 200
    answer_data = msg_res.json()
    assert answer_data["figure_id"] == "marcus_aurelius"
    assert answer_data["overall_status"] in ["grounded", "mixed"]
    assert len(answer_data["segments"]) > 0

    # 3. Retrieve conversation history
    hist_res = client.get(f"/api/v1/conversations/{conv_id}")
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    assert hist_data["conversation"]["conversation_id"] == conv_id
    assert len(hist_data["messages"]) == 2  # user + assistant

    # 4. Submit feedback on the assistant message
    fb_res = client.post("/api/v1/feedback", json={
        "message_id": answer_data["message_id"],
        "conversation_id": conv_id,
        "figure_id": "marcus_aurelius",
        "feedback_type": "general",
        "comment": "Accurate quote citation from Book II of Meditations."
    })
    assert fb_res.status_code == 200
    assert fb_res.json()["status"] == "received"


def test_source_and_chunk_endpoints():
    # Test valid source
    source_res = client.get("/api/v1/sources/source_ada_001")
    assert source_res.status_code == 200
    src_data = source_res.json()
    assert src_data["figure_id"] == "ada_lovelace"
    assert "Analytical Engine" in src_data["title"]

    # Test valid chunk context
    chunk_res = client.get("/api/v1/sources/source_ada_001/chunks/chunk_ada_001")
    assert chunk_res.status_code == 200
    chunk_data = chunk_res.json()
    assert chunk_data["chunk"]["chunk_id"] == "chunk_ada_001"
    assert "Jacquard-loom" in chunk_data["chunk"]["text"]
    assert chunk_data["surrounding_text"] is not None

    # Test non-existent source
    non_existent = client.get("/api/v1/sources/source_non_existent")
    assert non_existent.status_code == 404
