import requests
import json

try:
    response = requests.post(
        "http://localhost:8000/api/auth/developer/login",
        json={"email": "test@example.com", "password": "password"}
    )
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")
except Exception as e:
    print(e)
