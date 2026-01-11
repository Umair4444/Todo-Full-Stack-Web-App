import sys
import os
sys.path.insert(0, os.path.abspath('.'))

# Import the test functions
import tests.test_todo_api as test_module
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from main import app
from src.database.database import get_session


def run_toggle_test():
    """Run the toggle test to verify functionality"""
    # Create an in-memory SQLite database for testing
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    SQLModel.metadata.create_all(bind=engine)
    
    with Session(engine) as session:
        def get_session_override():
            return session

        app.dependency_overrides[get_session] = get_session_override
        client = TestClient(app)
        
        try:
            # Run the toggle test
            test_module.test_toggle_completion(client, session)
            print("✓ test_toggle_completion passed")
            
            # Run the not found test
            test_module.test_toggle_completion_not_found(client, session)
            print("✓ test_toggle_completion_not_found passed")
            
            print("\nAll toggle tests ran successfully!")
            
        except Exception as e:
            print(f"✗ Test failed with error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            app.dependency_overrides.clear()


if __name__ == "__main__":
    run_toggle_test()