from main import app

print("All routes:")
for i, route in enumerate(app.routes):
    print(f"{i}: {type(route).__name__}")
    if hasattr(route, 'path'):
        print(f"  Path: {route.path}")
    if hasattr(route, 'methods'):
        print(f"  Methods: {route.methods}")
    if hasattr(route, 'tags'):
        print(f"  Tags: {route.tags}")
    if hasattr(route, 'name'):
        print(f"  Name: {route.name}")
    print()