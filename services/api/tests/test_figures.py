from fastapi.testclient import TestClient
from services.api.app.main import app

client = TestClient(app)


def test_list_figures():
    response = client.get("/api/v1/figures")
    assert response.status_code == 200
    data = response.json()
    assert "figures" in data
    assert data["total"] >= 6

    figure_ids = [f["figure_id"] for f in data["figures"]]
    assert "ada_lovelace" in figure_ids
    assert "marcus_aurelius" in figure_ids
    assert "galileo_galilei" in figure_ids
    assert "frederick_douglass" in figure_ids
    assert "marie_curie" in figure_ids
    assert "leonardo_da_vinci" in figure_ids


def test_get_figure_detail():
    response = client.get("/api/v1/figures/ada_lovelace")
    assert response.status_code == 200
    data = response.json()
    assert data["figure_id"] == "ada_lovelace"
    assert "Analytical Engine" in data["short_biography"]
    assert len(data["known_voice_traits"]) > 0
    assert len(data["known_gaps"]) > 0
    assert len(data["starter_prompts"]) > 0


def test_get_figure_sources():
    response = client.get("/api/v1/figures/ada_lovelace/sources")
    assert response.status_code == 200
    data = response.json()
    assert data["figure_id"] == "ada_lovelace"
    assert data["total"] >= 2
    for src in data["sources"]:
        assert src["figure_id"] == "ada_lovelace"
        assert src["rights_status"] == "public_domain"
        assert src["source_quality"] == "primary_archive"
