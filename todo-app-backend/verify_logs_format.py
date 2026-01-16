from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from main import app
from src.database.database import get_session
from tests.test_utils import create_test_user_and_auth_headers
import json

# Create in-memory database for testing
engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
SQLModel.metadata.create_all(bind=engine)

def get_session_override():
    return Session(engine)

app.dependency_overrides[get_session] = get_session_override
client = TestClient(app)

print('Creating test user...')
headers, user_data = create_test_user_and_auth_headers(Session(engine), client)
print(f"User created: {user_data['id']}")

print('Creating a todo to generate logs...')
todo_data = {
    'title': 'Test Todo for Logs',
    'description': 'Testing the logs endpoint',
    'is_completed': False
}
response = client.post('/api/todos', json=todo_data, headers=headers)
print(f"Create todo response status: {response.status_code}")
if response.status_code == 200:
    created_todo = response.json()
    todo_id = created_todo['id']
    print(f'Created todo with ID: {todo_id}')
else:
    print(f"Failed to create todo: {response.text}")

print('Updating the todo to generate an UPDATE log...')
update_data = {
    'title': 'Updated Test Todo',
    'is_completed': True
}
response = client.put(f'/api/todos/{todo_id}', json=update_data, headers=headers)
print(f"Update todo response status: {response.status_code}")
if response.status_code == 200:
    print('Updated todo successfully')
else:
    print(f"Failed to update todo: {response.text}")

print('Fetching logs...')
response = client.get('/api/todos/logs', headers=headers)
print(f"Get logs response status: {response.status_code}")
if response.status_code == 200:
    logs = response.json()
    print(f'Received {len(logs)} logs')
    
    if logs:
        print('Sample log structure:')
        sample_log = logs[0]
        print(json.dumps(sample_log, indent=2, default=str))
    else:
        print('No logs found (which is valid for a fresh test)')
else:
    print(f"Failed to get logs: {response.text}")

print('\nAll checks completed!')