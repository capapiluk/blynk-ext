# Simple Blynk Test for MicroPython 1.6.0 ESP32
# Use this to test basic connectivity before trying complex examples

import blynklib_mp as blynklib
import time
import sys

# WiFi credentials - CHANGE THESE!
WIFI_SSID = "YourWiFi"
WIFI_PASSWORD = "YourPassword"

# Blynk credentials - CHANGE THESE!  
AUTH_TOKEN = "YourAuthToken"

print("=== Simple Blynk Test ===")

# Step 1: Test basic connectivity
print("\nStep 1: Testing connectivity...")
if blynklib.test_connectivity(WIFI_SSID, WIFI_PASSWORD):
    print("[OK] Basic connectivity working")
else:
    print("[ERROR] Connectivity failed - check WiFi credentials")
    sys.exit(1)

# Step 2: Test Blynk connection
print("\nStep 2: Testing Blynk connection...")
try:
    blynk = blynklib.Blynk(
        AUTH_TOKEN,
        server="blynk.cloud",
        port=80,
        heartbeat=10,
        heartbeat_timeout=30
    )
    
    # Simple connection test 
    connected = False
    for i in range(30):  # Try for 30 seconds
        blynk.run()
        if blynk.state == blynklib.CONNECTED:
            print("[OK] Blynk connected successfully!")
            connected = True
            break
        elif i % 5 == 0:
            print("  Attempting connection... ({}/30)".format(i+1))
        time.sleep(1)
        
    if not connected:
        print("[ERROR] Blynk connection timeout")
        sys.exit(1)
    
    # Step 3: Test simple virtual write
    print("\nStep 3: Testing virtual pin...")
    blynk.virtual_write(1, "Test from ESP32")
    print("[OK] Virtual write sent")
    
    # Keep connection alive for a few seconds
    print("\nRunning for 10 seconds...")
    for i in range(100):
        blynk.run()
        time.sleep(0.1)
    
    print("[OK] Test completed successfully!")
    
except Exception as e:
    print("[ERROR] Test failed:", str(e))
    try:
        sys.print_exception(e)
    except:
        print("Exception details not available")