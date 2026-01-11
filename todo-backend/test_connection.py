import requests

try:
    # Test the health endpoint
    response = requests.get("http://localhost:8000/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test the todos endpoint
    response = requests.get("http://localhost:8000/api/v1/todos")
    print(f"Todos Status Code: {response.status_code}")
    print(f"Todos Response: {response.text}")
    
except requests.exceptions.ConnectionError:
    print("Could not connect to the server. Please make sure it's running on http://localhost:8000")
except Exception as e:
    print(f"An error occurred: {e}")