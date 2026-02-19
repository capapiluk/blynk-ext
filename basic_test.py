# Basic Blynk Test - MicroPython 1.6.0 Compatible
# This is the simplest possible test for Blynk connectivity

import blynklib_mp as blynklib
import time
import network

print("=== Basic Blynk Test ===")

# =========================================
# STEP 1: CONFIGURE YOUR SETTINGS HERE
# =========================================
WIFI_SSID = "YourWiFi"           # Change this
WIFI_PASSWORD = "YourPassword"   # Change this  
AUTH_TOKEN = "YourAuthToken"     # Change this

# =========================================
# STEP 2: TEST WIFI CONNECTION 
# =========================================
print("\n[1] Testing WiFi...")

try:
    sta_if = network.WLAN(network.STA_IF)
    
    if not sta_if.isconnected():
        print("Connecting to WiFi:", WIFI_SSID)
        sta_if.active(True)
        sta_if.connect(WIFI_SSID, WIFI_PASSWORD)
        
        # Wait for connection
        timeout = 15
        while not sta_if.isconnected() and timeout > 0:
            print("  Waiting...", timeout)
            time.sleep(1)
            timeout -= 1
            
        if not sta_if.isconnected():
            print("[ERROR] WiFi connection failed")
            print("Check SSID and password")
        else:
            print("[OK] WiFi connected:", sta_if.ifconfig()[0])
    else:
        print("[OK] Already connected:", sta_if.ifconfig()[0])
        
except Exception as e:
    print("[ERROR] WiFi setup failed:", str(e))

# =========================================
# STEP 3: TEST BLYNK CONNECTION
# =========================================
print("\n[2] Testing Blynk...")

try:
    # Create Blynk object
    blynk = blynklib.Blynk(AUTH_TOKEN)
    
    # Try to connect
    print("Connecting to Blynk...")
    connected = False
    
    for attempt in range(20):  # 20 second timeout
        blynk.run()
        
        if blynk.state == 2:  # CONNECTED state
            print("[OK] Blynk connected!")
            connected = True
            break
            
        print("  Attempt", attempt + 1, "- State:", blynk.state)
        time.sleep(1)
    
    if not connected:
        print("[ERROR] Could not connect to Blynk")
        print("Check your AUTH_TOKEN")
    else:
        # Test virtual pin
        print("\n[3] Testing virtual pin...")
        blynk.virtual_write(1, 42)
        print("[OK] Data sent to V1")
        
        # Keep alive
        print("\n[4] Keeping connection alive for 5 seconds...")
        for i in range(50):
            blynk.run()
            time.sleep(0.1)
        
        print("[OK] All tests passed!")
        
except Exception as e:
    print("[ERROR] Blynk test failed:", str(e))
    # Print more details if available
    try:
        import sys
        sys.print_exception(e)
    except:
        pass

print("\n=== Test Complete ===")