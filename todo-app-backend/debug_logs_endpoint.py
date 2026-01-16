from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from main import app  # Import the FastAPI app
from src.database.database import get_session
from tests.test_utils import create_test_user_and_auth_headers

# Create in-memory database for testing
engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
SQLModel.metadata.create_all(bind=engine)

def get_session_override():
    return Session(engine)

app.dependency_overrides[get_session] = get_session_override
client = TestClient(app)

print("Creating test user...")
headers, user_data = create_test_user_and_auth_headers(Session(engine), client)

print("Making request to /api/todos/logs...")
response = client.get("/api/todos/logs", headers=headers)

print(f"Status Code: {response.status_code}")
print(f"Response Text: {response.text}")

if response.status_code != 200:
    print("\nTrying to access the OpenAPI schema to see the route definition...")
    schema_response = client.get("/openapi.json")
    print(f"Schema Status: {schema_response.status_code}")
    
    # Look for the todos/logs route in the schema
    if schema_response.status_code == 200:
        schema = schema_response.json()
        paths = schema.get("paths", {})
        for path, methods in paths.items():
            if "logs" in path.lower():
                print(f"Found path: {path}")
                print(f"Methods: {methods}")