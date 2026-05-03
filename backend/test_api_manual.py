"""Manual API testing script for SellMasr"""
import uvicorn
from app.main import app
import threading
import time
import requests

# Start server in a thread
def run_server():
    uvicorn.run(app, host='127.0.0.1', port=8000, log_level='error')

server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()
time.sleep(3)

print("=" * 50)
print("SellMasr API Testing")
print("=" * 50)

# Test endpoints
endpoints = [
    ('GET', 'http://127.0.0.1:8000/', 'Root endpoint'),
    ('GET', 'http://127.0.0.1:8000/health', 'Health endpoint'),
    ('GET', 'http://127.0.0.1:8000/api/v1/health', 'API Health endpoint'),
    ('GET', 'http://127.0.0.1:8000/api/v1/products/', 'Products endpoint'),
    ('GET', 'http://127.0.0.1:8000/api/v1/categories/', 'Categories endpoint'),
]

results = []
for method, url, name in endpoints:
    try:
        r = requests.get(url, timeout=5)
        status = r.status_code
        data = r.json()
        print(f"[{'PASS' if status == 200 else 'FAIL'}] {name}: {status} - {data}")
        results.append(('PASS' if status == 200 else 'FAIL', name, status, data))
    except Exception as e:
        print(f"[FAIL] {name}: {e}")
        results.append(('FAIL', name, 0, str(e)))

# Test authentication
print("\n--- Testing Authentication ---")
try:
    r = requests.post('http://127.0.0.1:8000/api/v1/auth/register', 
        json={"email": "test@example.com", "full_name": "Test User", "password": "test123", "role": "customer"})
    print(f"[{'PASS' if r.status_code == 200 else 'FAIL'}] Register: {r.status_code}")
except Exception as e:
    print(f"[FAIL] Register: {e}")

try:
    r = requests.post('http://127.0.0.1:8000/api/v1/auth/login',
        json={"email": "test@example.com", "password": "test123"})
    print(f"[{'PASS' if r.status_code == 200 else 'FAIL'}] Login: {r.status_code}")
except Exception as e:
    print(f"[FAIL] Login: {e}")

print("\n" + "=" * 50)
print("Testing complete!")
print("=" * 50)