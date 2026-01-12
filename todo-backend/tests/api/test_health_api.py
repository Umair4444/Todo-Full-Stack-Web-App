import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from main import app  # Import the FastAPI app
from src.database.database import get_session


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", 
        connect_args={"check_same_thread": False}, 
        poolclass=StaticPool
    )
    SQLModel.metadata.create_all(bind=engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "response_time_ms" in data
    assert isinstance(data["response_time_ms"], (int, float))
    assert "details" in data
    assert "database" in data["details"]
    assert data["details"]["database"] == "connected"
    assert "api" in data["details"]
    assert data["details"]["api"] == "responsive"


def test_health_check_structure(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    expected_keys = {"status", "timestamp", "response_time_ms", "details"}
    assert set(data.keys()) >= expected_keys
    
    details_keys = {"database", "api"}
    assert set(data["details"].keys()) >= details_keys