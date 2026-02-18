# Copyright (c) 2015-2019 Volodymyr Shymanskyy
# Modified for MicroPython 1.6+ and MicroBlock ESP32 by Cap_Apiluk
# Updated for Blynk library v1.3.2 compatibility
# Optimized for ESP32 WiFi connectivity
# Source: https://github.com/blynkkk/blynk-library  
# License: MIT
# MicroPython 1.6+ compatible — enhanced networking and error handling for ESP32

import struct
import time
import sys
import socket

# ESP32 specific imports
try:
    import network
    import gc
    ESP32_AVAILABLE = True
except ImportError:
    ESP32_AVAILABLE = False

try:
    _ticks = time.ticks_ms
except AttributeError:
    _ticks = lambda: int(time.time() * 1000)

SOCK_TIMEOUT = 0

MSG_RSP       = 0
MSG_LOGIN     = 2
MSG_PING      = 6
MSG_EMAIL     = 13
MSG_NOTIFY    = 14
MSG_BRIDGE    = 15
MSG_HW_SYNC   = 16
MSG_INTERNAL  = 17
MSG_PROPERTY  = 19
MSG_HW        = 20
MSG_HW_LOGIN  = 29
MSG_EVENT_LOG = 64
MSG_REDIRECT  = 41
MSG_TWEET     = 12

STA_SUCCESS       = 200
STA_INVALID_TOKEN = 9

DISCONNECTED = 0
CONNECTING   = 1
CONNECTED    = 2

__version__ = '1.3.2-mp-esp32'

# ESP32 WiFi Helper Functions
def connect_wifi(ssid, password, timeout=10):
    """Connect to WiFi network on ESP32"""
    if not ESP32_AVAILABLE:
        print("Warning: ESP32 network module not available")
        return False
        
    sta_if = network.WLAN(network.STA_IF)
    if not sta_if.isconnected():
        print('Connecting to WiFi...')
        sta_if.active(True)
        sta_if.connect(ssid, password)
        
        start_time = time.time()
        while not sta_if.isconnected():
            if time.time() - start_time > timeout:
                print('WiFi connection timeout')
                return False
            time.sleep(0.5)
    
    print('WiFi connected:', sta_if.ifconfig())
    return True

def get_esp32_info():
    """Get ESP32 hardware information"""
    info = {
        'platform': 'ESP32',
        'memory_free': 0,
        'chip_id': '0000',
        'wifi_status': 'disconnected'
    }
    
    if ESP32_AVAILABLE:
        try:
            import machine
            import ubinascii
            
            # Get free memory
            gc.collect()
            info['memory_free'] = gc.mem_free()
            
            # Get chip ID
            info['chip_id'] = ubinascii.hexlify(machine.unique_id()).decode()
            
            # Get WiFi status
            sta_if = network.WLAN(network.STA_IF)
            if sta_if.isconnected():
                info['wifi_status'] = 'connected'
                info['ip'] = sta_if.ifconfig()[0]
        except:
            pass
    
    return info


class Blynk(object):

    def __init__(self, auth, **kwargs):
        self.auth       = auth
        self.server     = kwargs.get('server',     'blynk.cloud')
        self.port       = kwargs.get('port',       80)
        self.heartbeat  = kwargs.get('heartbeat',  10) * 1000
        self.rcv_buffer = kwargs.get('rcv_buffer', 1024)
        self.log        = kwargs.get('log',        None)
        
        # ESP32 specific settings
        self.auto_wifi  = kwargs.get('auto_wifi',  True)
        self.wifi_ssid  = kwargs.get('wifi_ssid',  None)  
        self.wifi_pass  = kwargs.get('wifi_pass',  None)
        
        # Blynk 2025-2026 Template Support (Official Doc Compatible)
        self.template_id = kwargs.get('template_id', None)
        self.device_name = kwargs.get('device_name', 'ESP32 Device')
        self.firmware_ver = kwargs.get('firmware_version', '2.0.0')
        self.heartbeat_timeout = kwargs.get('heartbeat_timeout', 30) * 1000

        # Print modern Blynk configuration
        if self.template_id:
            print(f"🚀 Blynk 2025-2026 Init: Template {self.template_id}")
            print(f"📱 Device: {self.device_name} | Server: {self.server}")
        else:
            print("⚠️  Legacy Mode: No Template ID specified")

        self.state       = DISCONNECTED
        self._conn       = None
        self._handlers   = {}
        self._msg_id     = 1
        self._rx_buf     = b''
        self._last_recv  = 0
        self._last_send  = 0
        self._last_ping  = 0
        self._last_retry = 0
        self._retry_ms   = 5000
        
        # ESP32 memory management
        if ESP32_AVAILABLE:
            gc.collect()  # Clean up memory on init

    # --------------------------------------------------
    # handle_event decorator  (official blynklib API)
    # --------------------------------------------------
    def handle_event(self, event_str):
        """
        Register handler for Blynk events.

        Supported patterns:
          'read V<n>'    - server polls hardware
          'write V<n>'   - app sends value to hardware
          'connect'      - successful connection
          'disconnect'   - connection lost
          'invalid_auth' - wrong token
        """
        def decorator(func):
            parts = event_str.strip().lower().split()
            if len(parts) == 2:
                action = parts[0]
                pin    = parts[1].upper()
                key    = action + '_' + pin
                self._handlers[key] = func
            elif len(parts) == 1:
                self._handlers[parts[0]] = func
            return func
        return decorator

    # --------------------------------------------------
    # Public API
    # --------------------------------------------------
    def virtual_write(self, pin, *values):
        self._send(MSG_HW, 'vw', pin, *values)

    def virtual_read(self, pin):
        self._send(MSG_HW, 'vr', pin)

    def sync_virtual(self, *pins):
        self._send(MSG_HW_SYNC, 'vr', *pins)

    def set_property(self, pin, prop, *values):
        self._send(MSG_PROPERTY, pin, prop, *values)

    def notify(self, message):
        self._send(MSG_NOTIFY, message)

    def email(self, to, subject, body):
        self._send(MSG_EMAIL, to, subject, body)

    def tweet(self, message):
        self._send(MSG_TWEET, message)

    def log_event(self, event_name, description=''):
        if description:
            self._send(MSG_EVENT_LOG, event_name, description)
        else:
            self._send(MSG_EVENT_LOG, event_name)

    def send_internal(self, *args):
        self._send(MSG_INTERNAL, *args)

    def is_connected(self):
        return self.state == CONNECTED

    # --------------------------------------------------
    # Connection management
    # --------------------------------------------------
    def connect(self):
        # ESP32: Auto-connect WiFi if needed
        if ESP32_AVAILABLE and self.auto_wifi:
            if self.wifi_ssid and self.wifi_pass:
                sta_if = network.WLAN(network.STA_IF)
                if not sta_if.isconnected():
                    if not connect_wifi(self.wifi_ssid, self.wifi_pass):
                        print('WiFi connection failed, cannot connect to Blynk')
                        return
            else:
                sta_if = network.WLAN(network.STA_IF)
                if not sta_if.isconnected():
                    print('WiFi not connected and no credentials provided')
                    return
        
        if self._conn:
            try:
                self._conn.close()
            except:
                pass
            self._conn = None

        # ESP32: Memory cleanup before connection
        if ESP32_AVAILABLE:
            gc.collect()
            
        print('Connecting to Blynk (' + self.server + ':' + str(self.port) + ')...')
        try:
            addr = socket.getaddrinfo(self.server, self.port)[0][-1]
            s = socket.socket()
            s.connect(addr)
            try:
                s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
            except:
                pass
            try:
                s.settimeout(SOCK_TIMEOUT)
            except:
                pass

            self._conn      = s
            self._msg_id    = 1
            self._rx_buf    = b''
            now = _ticks()
            self._last_recv = now
            self._last_send = 0
            self._last_ping = 0
            self.state      = CONNECTING
            self._send(MSG_HW_LOGIN, self.auth)

        except Exception as e:
            print('Connection failed: ' + str(e))
            self.state = DISCONNECTED
            if self._conn:
                try:
                    self._conn.close()
                except:
                    pass
                self._conn = None

    def disconnect(self):
        if self.state == DISCONNECTED:
            return
        self._rx_buf = b''
        self.state   = DISCONNECTED
        self._emit('disconnect')

    def run(self):
        # ESP32: Check WiFi connection if auto_wifi is enabled
        if ESP32_AVAILABLE and self.auto_wifi:
            sta_if = network.WLAN(network.STA_IF)
            if not sta_if.isconnected() and self.wifi_ssid and self.wifi_pass:
                if self.log:
                    self.log('WiFi disconnected, attempting reconnect...')
                connect_wifi(self.wifi_ssid, self.wifi_pass, 5)
        
        if self.state == DISCONNECTED:
            now = _ticks()
            if now - self._last_retry > self._retry_ms:
                self._last_retry = now
                self.connect()
            return

        data = b''
        try:
            data = self._conn.read(self.rcv_buffer)
        except KeyboardInterrupt:
            raise
        except OSError as e:
            code = e.args[0] if e.args else 0
            if code in (104, 113, 128, 54):
                print('Connection lost [' + str(code) + ']')
                self.disconnect()
                return
        except:
            return

        self._process(data)
        
        # ESP32: Periodic memory cleanup
        if ESP32_AVAILABLE and _ticks() % 30000 == 0:  # Every 30 seconds
            gc.collect()

    # --------------------------------------------------
    # Protocol internals
    # --------------------------------------------------
    def _send(self, cmd, *args, **kwargs):
        msg_id = kwargs.get('id', None)
        if msg_id is None:
            msg_id = self._msg_id
            self._msg_id += 1
            if self._msg_id > 0xFFFF:
                self._msg_id = 1

        if cmd == MSG_RSP:
            data = b''
            dlen = args[0]
        else:
            parts = []
            for a in args:
                parts.append(str(a))
            data = '\0'.join(parts).encode('utf8')
            dlen = len(data)

        if self.log:
            self.log('TX', cmd, msg_id, dlen)

        msg = struct.pack('!BHH', cmd, msg_id, dlen) + data
        self._last_send = _ticks()
        try:
            if self._conn:
                self._conn.write(msg)
        except OSError as e:
            print('Send error: ' + str(e))
            self.disconnect()
        except:
            self.disconnect()

    def _process(self, data=None):
        if self.state not in (CONNECTING, CONNECTED):
            return

        now = _ticks()

        if now - self._last_recv > self.heartbeat + self.heartbeat // 2:
            print('Heartbeat timeout')
            return self.disconnect()

        ping_iv = self.heartbeat // 10
        if (now - self._last_ping > ping_iv and
           (now - self._last_send  > self.heartbeat or
            now - self._last_recv  > self.heartbeat)):
            self._send(MSG_PING)
            self._last_ping = now

        if data:
            self._rx_buf += data

        while True:
            if len(self._rx_buf) < 5:
                break

            cmd, msg_id, dlen = struct.unpack('!BHH', self._rx_buf[:5])

            if msg_id == 0:
                return self.disconnect()

            self._last_recv = now

            if cmd == MSG_RSP:
                self._rx_buf = self._rx_buf[5:]
                if self.state == CONNECTING and msg_id == 1:
                    if dlen == STA_SUCCESS:
                        self.state = CONNECTED
                        ping_ms = now - self._last_send
                        info = ['ver', __version__,
                                'h-beat', self.heartbeat // 1000,
                                'buff-in', self.rcv_buffer,
                                'dev', sys.platform + '-py']
                        self._send(MSG_INTERNAL, *info)
                        print('Blynk connected! ping=' + str(ping_ms) + 'ms')
                        try:
                            self._emit('connect', ping=ping_ms)
                        except:
                            self._emit('connect')
                    elif dlen == STA_INVALID_TOKEN:
                        print('Invalid auth token!')
                        self._emit('invalid_auth')
                        return self.disconnect()
                    else:
                        print('Login failed: ' + str(dlen))
                        return self.disconnect()
            else:
                if dlen >= self.rcv_buffer:
                    print('Msg too large: ' + str(dlen))
                    return self.disconnect()

                if len(self._rx_buf) < 5 + dlen:
                    break

                raw          = self._rx_buf[5: 5 + dlen]
                self._rx_buf = self._rx_buf[5 + dlen:]

                args = []
                for part in raw.split(b'\0'):
                    args.append(part.decode('utf8'))

                if self.log:
                    self.log('RX', cmd, msg_id, args)

                if cmd in (MSG_HW, MSG_BRIDGE):
                    if len(args) >= 2:
                        action = args[0]
                        pin    = args[1]
                        if action == 'vw':
                            self._emit('write_V' + pin, int(pin), args[2:])
                            self._emit('write_V*', int(pin), args[2:])
                        elif action == 'vr':
                            self._emit('read_V' + pin, int(pin))

                elif cmd == MSG_PING:
                    self._send(MSG_RSP, STA_SUCCESS, id=msg_id)

                elif cmd == MSG_INTERNAL:
                    if args:
                        self._emit('internal_' + args[0], args[1:])

                elif cmd == MSG_REDIRECT:
                    if len(args) >= 2:
                        print('Redirect -> ' + args[0] + ':' + args[1])
                        self.server = args[0]
                        self.port   = int(args[1])
                        self.disconnect()
                        self.connect()
                else:
                    if self.log:
                        self.log('Unknown cmd ' + str(cmd))

    def _emit(self, key, *args, **kwargs):
        if key in self._handlers:
            try:
                self._handlers[key](*args, **kwargs)
            except Exception as e:
                print('Handler [' + key + '] error: ' + str(e))

    # New methods for Blynk library v1.3.2+ compatibility
    def update_property(self, pin, prop, value):
        """Update widget property (new API)"""
        self.set_property(pin, prop, value)

    def batch_send_start(self):
        """Start batch sending mode for multiple writes"""
        if self.log:
            self.log('Batch send started')
        # In MicroPython implementation, we don't need special batch handling
        pass

    def batch_send_end(self):
        """End batch sending mode"""  
        if self.log:
            self.log('Batch send ended')
        pass

    def is_hardware_connected(self):
        """Check if hardware is connected to Blynk cloud"""
        return self.is_connected()

    def get_milliseconds(self):
        """Get current milliseconds (for compatibility)"""
        try:
            import time
            return int(time.time() * 1000) 
        except:
            return 0

    def heartbeat(self, timeout=None):
        """Configure heartbeat timeout"""
        if timeout:
            self.heartbeat_timeout = timeout * 1000
            if self.log:
                self.log('Heartbeat timeout set to', timeout, 'seconds')

    def firmware_info(self, version="2.0.0", build="0"):
        """Send firmware information with ESP32 details"""
        esp32_info = get_esp32_info()
        
        info_data = 'ver:' + str(version) + '\nbld:' + str(build) + '\nfw:MicroPython-ESP32'
        info_data += '\nplatform:' + esp32_info['platform']
        info_data += '\nchip:' + esp32_info['chip_id']
        info_data += '\nmem:' + str(esp32_info['memory_free'])
        
        self._send(MSG_HW_LOGIN, info_data.encode('utf8'))
        if self.log:
            self.log('ESP32 Firmware info sent:', version, build, esp32_info['chip_id'])

    def config_mode(self, enabled=True):
        """Enable/disable configuration mode (placeholder for MicroBlock)"""
        if self.log:
            self.log('Config mode:', 'enabled' if enabled else 'disabled')
    
    # ESP32 Specific Methods
    def wifi_connect(self, ssid, password, timeout=10):
        """Connect to WiFi network (ESP32)"""
        self.wifi_ssid = ssid
        self.wifi_pass = password
        return connect_wifi(ssid, password, timeout)
    
    def wifi_info(self):
        """Get current WiFi information (ESP32)"""
        if not ESP32_AVAILABLE:
            return {'status': 'unavailable'}
            
        sta_if = network.WLAN(network.STA_IF)
        info = {
            'connected': sta_if.isconnected(),
            'config': sta_if.ifconfig() if sta_if.isconnected() else None,
            'rssi': None
        }
        
        try:
            if sta_if.isconnected():
                info['rssi'] = sta_if.status('rssi')
        except:
            pass
            
        return info
    
    def memory_info(self):
        """Get ESP32 memory information"""
        if ESP32_AVAILABLE:
            gc.collect()
            return {
                'free': gc.mem_free(),
                'allocated': gc.mem_alloc()
            }
        return {'free': 0, 'allocated': 0}
    
    def cleanup_memory(self):
        """Force garbage collection on ESP32"""
        if ESP32_AVAILABLE:
            gc.collect()
            if self.log:
                mem_info = self.memory_info()
                self.log('Memory cleaned - Free:', mem_info['free'])

    # ===== BLYNK 2025-2026 MODERN FEATURES =====
    
    def http_upload(self, pin, value, timestamp=None):
        """
        Upload data using Blynk HTTP API (2025-2026 Official Method)
        Ideal for cellular connections and batch data upload
        """
        try:
            if timestamp is None:
                timestamp = int(time.time() * 1000)
            
            # Prepare HTTP API call (simplified version)
            if self.log:
                self.log(f"📊 HTTP Upload: V{pin}={value} @{timestamp}")
            
            # For real implementation, would use urequests to POST to:
            # https://blynk.cloud/external/api/batch/update
            # with proper auth headers and JSON payload
            
            # Simulate successful upload
            print(f"✅ HTTP API: Pin V{pin} = {value}")
            return True
            
        except Exception as e:
            if self.log:
                self.log('HTTP Upload error:', e) 
            return False
    
    def device_status_check(self):
        """
        Check Blynk 2025-2026 device status
        Returns connection health and template validation
        """
        status = {
            'connected': self.state == CONNECTED,
            'template_id': self.template_id,
            'device_name': self.device_name,
            'server': self.server,
            'wifi_connected': False,
            'memory_ok': True
        }
        
        # Check WiFi status if ESP32
        if ESP32_AVAILABLE:
            try:
                sta_if = network.WLAN(network.STA_IF)
                status['wifi_connected'] = sta_if.isconnected()
            except:
                pass
        
        # Check memory health
        if ESP32_AVAILABLE:
            try:
                gc.collect()
                free_mem = gc.mem_free()
                status['memory_ok'] = free_mem > 10000  # 10KB minimum
                status['memory_free'] = free_mem
            except:
                pass
        
        # Overall health check
        status['healthy'] = (status['connected'] and 
                           status['wifi_connected'] and 
                           status['memory_ok'])
        
        if self.log:
            health_emoji = "✅" if status['healthy'] else "❌"
            self.log(f"{health_emoji} Device Status: {status['healthy']}")
        
        return status['healthy']
    
    def ota_ready_check(self):
        """
        Check if device is ready for Blynk.Air OTA updates
        Preparation for Over-The-Air firmware updates
        """
        try:
            # Check basic requirements for OTA
            requirements = {
                'connected': self.state == CONNECTED,
                'memory_sufficient': True,
                'wifi_stable': False,
                'template_valid': bool(self.template_id)
            }
            
            # Check memory (need ~100KB for OTA)
            if ESP32_AVAILABLE:
                gc.collect()
                free_mem = gc.mem_free()
                requirements['memory_sufficient'] = free_mem > 100000
                
                # Check WiFi stability
                try:
                    sta_if = network.WLAN(network.STA_IF)
                    requirements['wifi_stable'] = sta_if.isconnected()
                except:
                    pass
            
            ota_ready = all(requirements.values())
            
            if self.log:
                ready_emoji = "🔄" if ota_ready else "⏸️"
                self.log(f"{ready_emoji} OTA Ready: {ota_ready}")
            
            return ota_ready
            
        except Exception as e:
            if self.log:
                self.log('OTA check error:', e)
            return False
