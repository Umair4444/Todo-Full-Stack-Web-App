from main import app
import uvicorn

if __name__ == "__main__":
    print("Starting server on port 8080...")
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8080,
        log_level="debug",
        access_log=True
    )