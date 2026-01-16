# Setting up Database for Todo Backend

## Option 1: Neon Serverless PostgreSQL (Recommended)

1. Go to [Neon Console](https://console.neon.tech/) and sign up for a free account
2. Create a new project
3. Once the project is created, go to the Project Settings
4. Under the "Connection Details" section, copy the connection string
5. The connection string will look something like:
   ```
   postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```
6. Update your `.env` file with this connection string:
   ```
   DATABASE_URL=postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

## Option 2: Local PostgreSQL Server

If you prefer to use a local PostgreSQL server:

1. Install PostgreSQL on your system
2. Create a database for the project:
   ```sql
   CREATE DATABASE todo_app;
   CREATE USER todo_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE todo_app TO todo_user;
   ```
3. Update your `.env` file with the local connection string:
   ```
   DATABASE_URL=postgresql://todo_user:secure_password@localhost:5432/todo_app
   ```

## Initialize the Database Tables

After setting up your database, you need to initialize the tables:

1. Make sure your virtual environment is activated:
   ```bash
   # On Windows:
   venv\Scripts\activate
   ```

2. Run the database initialization:
   ```bash
   python -c "from src.database.database import init_db; init_db()"
   ```

Or if you have alembic set up:
   ```bash
   alembic upgrade head
   ```

## Running the Application

Once your database is set up and initialized:

1. Make sure your virtual environment is activated
2. Install dependencies: `pip install -r requirements.txt`
3. Run the application: `uvicorn src.main:app --reload`