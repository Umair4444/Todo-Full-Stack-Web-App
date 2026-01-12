import sys
import traceback

try:
    from main import app
    print('Main import successful')
except ImportError as e:
    print(f"ImportError: {e}")
    print("Traceback:")
    traceback.print_exc()
except Exception as e:
    print(f"General Error: {e}")
    print("Traceback:")
    traceback.print_exc()