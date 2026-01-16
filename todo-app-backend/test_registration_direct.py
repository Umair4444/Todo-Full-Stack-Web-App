from sqlmodel import Session, select
from src.models.user_model import User, UserCreate
from src.database.database import get_session
from src.config.settings import settings
import asyncio

async def test_registration():
    # Simulate the exact registration process
    user_data = UserCreate(
        email="testdirect@example.com",
        password="TestPass123!",
        first_name="Test",
        last_name="User"
    )
    
    print("Getting session...")
    session_generator = get_session()
    db = next(session_generator)  # Get the session from the generator
    
    try:
        print("Checking if user exists...")
        existing_user = db.exec(select(User).where(User.email == user_data.email)).first()
        if existing_user:
            print("User already exists")
            return

        print("Creating new user...")
        user = User(
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name
        )

        print("Setting password...")
        user.set_password(user_data.password)

        print("Adding user to database...")
        db.add(user)
        
        print("Committing transaction...")
        db.commit()
        print("Refreshing user...")
        db.refresh(user)
        
        print(f"User created successfully with ID: {user.id}")
        
        # Verify the user exists in the database
        print("Verifying user exists in database...")
        verified_user = db.exec(select(User).where(User.email == user_data.email)).first()
        if verified_user:
            print(f"User verified in database: {verified_user.id}")
        else:
            print("ERROR: User not found in database after commit!")
            
    finally:
        print("Closing session...")
        db.close()

if __name__ == "__main__":
    asyncio.run(test_registration())