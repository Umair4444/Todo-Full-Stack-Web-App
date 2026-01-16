import requests
import time

# Wait a moment for the server to start
time.sleep(2)

# Make a few requests to trigger logs
print("Making requests to the server...")
response = requests.get("http://127.0.0.1:8000/")
print(f"Response: {response.status_code} - {response.json()}")

response = requests.get("http://127.0.0.1:8000/docs")
print(f"Docs response: {response.status_code}")

response = requests.get("http://127.0.0.1:8000/api/todos")
print(f"Todos response: {response.status_code} - {response.text}")

print("Requests completed.")