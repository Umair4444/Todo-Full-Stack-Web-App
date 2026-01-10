import subprocess
import sys
import os

# Change to the backend directory
os.chdir("D:/1.GITHUB/qwen-coder/Todo-Full-Stack-Web-App/backend")

# Run the alembic command
result = subprocess.run([
    sys.executable, "-m", "alembic", "revision", "--autogenerate", "-m", 
    "Initial migration for User and Todo tables"
], capture_output=True, text=True)

print(f"Return code: {result.returncode}")
print(f"Stdout: {result.stdout}")
print(f"Stderr: {result.stderr}")