import requests

# Test the API endpoint without trailing slash
try:
    response = requests.get("http://127.0.0.1:8000/api/v1/todos?offset=0&limit=100")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}...")  # Print first 200 chars
    print(f"Headers: {dict(response.headers)}")
except Exception as e:
    print(f"Error: {e}")