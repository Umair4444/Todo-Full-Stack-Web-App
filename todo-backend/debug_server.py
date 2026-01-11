import sys
import os
sys.stdout.reconfigure(line_buffering=True)  # Enable line buffering

from main import app
import uvicorn

print("About to start server...", flush=True)
try:
    uvicorn.run(
        app, 
        host="127.0.0.1", 
        port=8080, 
        log_level="info",
        access_log=True
    )
    print("Server started successfully", flush=True)
except Exception as e:
    print(f"Error starting server: {e}", flush=True)
    import traceback
    traceback.print_exc()