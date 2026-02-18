# Blynk IoT MicroBlock ESP32 Example
# This example demonstrates how to use Blynk with MicroBlock on ESP32

import blynklib_mp as blynklib
import time

# WiFi credentials
WIFI_SSID = "YourWiFiName"
WIFI_PASSWORD = "YourWiFiPassword"

# Blynk credentials  
AUTH_TOKEN = "YourAuthTokenHere"

# Initialize Blynk with ESP32 support
blynk = blynklib.Blynk(
    AUTH_TOKEN,
    server="blynk.cloud", 
    port=80,
    wifi_ssid=WIFI_SSID,
    wifi_pass=WIFI_PASSWORD,
    auto_wifi=True,
    template_id="TMPL000000",
    device_name="ESP32 MicroBlock Device",
    firmware_version="2.0.0"
)

# Example: Temperature sensor simulation
temperature = 25.0
led_pin = 2

@blynk.handle_event("read V1")
def read_temperature(pin):
    """Send temperature when app requests it"""
    global temperature
    # Simulate temperature reading (replace with actual sensor)
    import random
    temperature = 20 + random.randint(0, 20)
    blynk.virtual_write(pin, temperature)

@blynk.handle_event("write V2") 
def control_led(pin, values):
    """Control LED from app"""
    global led_pin
    try:
        state = int(values[0])
        print("LED Control - Pin:", pin, "State:", state)
        
        # Control actual LED (requires machine.Pin)
        # from machine import Pin
        # led = Pin(led_pin, Pin.OUT)
        # led.value(state)
        
        # For simulation
        if state == 1:
            print("LED ON")
        else:
            print("LED OFF")
            
    except Exception as e:
        print("LED Control Error:", e)

@blynk.handle_event("write V3")
def slider_control(pin, values):
    """Handle slider input"""
    try:
        slider_value = int(values[0])
        print("Slider Value:", slider_value)
        
        # Use slider value for PWM control
        # from machine import Pin, PWM
        # pwm = PWM(Pin(4))
        # pwm.duty(slider_value * 10)  # Scale 0-100 to 0-1023
        
    except Exception as e:
        print("Slider Control Error:", e)

@blynk.handle_event("connect")
def on_connect():
    """Called when connected to Blynk"""
    print("✅ Connected to Blynk Cloud!")
    
    # Send initial values
    blynk.virtual_write(1, temperature)
    blynk.virtual_write(4, "ESP32 Online")
    
    # Send ESP32 information
    esp32_info = blynk.get_esp32_info()
    print("ESP32 Info:", esp32_info)
    
    # Sync virtual pins
    blynk.sync_virtual(1)
    blynk.sync_virtual(2)

@blynk.handle_event("disconnect")
def on_disconnect():
    """Called when disconnected from Blynk"""
    print("❌ Disconnected from Blynk")

def send_sensor_data():
    """Send multiple sensor values efficiently"""
    global temperature
    
    # Simulate multiple sensors
    humidity = 60.5
    pressure = 1013.2
    light = 750
    
    # Use batch sending for better performance
    blynk.batch_send_start()
    blynk.virtual_write(1, temperature)
    blynk.virtual_write(5, humidity)  
    blynk.virtual_write(6, pressure)
    blynk.virtual_write(7, light)
    blynk.batch_send_end()
    
    # Update widget properties
    blynk.update_property(1, "label", "Temp: {}°C".format(temperature))
    blynk.set_property(5, "color", "#00FF00" if humidity < 70 else "#FF0000")

def main():
    """Main loop for ESP32"""
    last_sensor_update = 0
    last_memory_check = 0
    
    print("🚀 Starting ESP32 Blynk Example...")
    
    # Send firmware information
    blynk.firmware_info("2.0.0", "esp32")
    
    while True:
        try:
            # Process Blynk messages (MUST be called frequently)
            blynk.run()
            
            current_time = time.time()
            
            # Send sensor data every 10 seconds
            if current_time - last_sensor_update >= 10:
                send_sensor_data()
                last_sensor_update = current_time
            
            # Check memory every 60 seconds
            if current_time - last_memory_check >= 60:
                memory_info = blynk.memory_info()
                print("Memory - Free: {}KB, Used: {}KB".format(
                    memory_info['free'] // 1024, 
                    memory_info['allocated'] // 1024
                ))
                
                # Clean memory if low
                if memory_info['free'] < 10000:  # Less than 10KB free
                    blynk.cleanup_memory()
                    
                last_memory_check = current_time
            
            # WiFi status check
            wifi_info = blynk.wifi_info()
            if not wifi_info['connected']:
                print("⚠️ WiFi disconnected!")
            
        except KeyboardInterrupt:
            print("\n🛑 Stopping...")
            break
        except Exception as e:
            print("❌ Error in main loop:", e)
            
        # Small delay to prevent busy waiting
        time.sleep(0.1)

# Auto-start for MicroBlock
if __name__ == "__main__":
    main()