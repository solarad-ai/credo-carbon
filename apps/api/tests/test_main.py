from fastapi.testclient import TestClient
from apps.api.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "CredoCarbon API"}

def test_docs_endpoint():
    response = client.get("/docs")
    assert response.status_code == 200
