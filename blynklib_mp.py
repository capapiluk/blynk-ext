# Copyright (c) 2015-2019 Volodymyr Shymanskyy
# Modified for MicroPython 1.6.0 + MicroBlock by Cap_Apiluk
# Source: https://github.com/blynkkk/lib-python
# License: MIT
# MicroPython 1.6.0 compatible — no f-strings

import struct
import time
import sys
import socket

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

__version__ = '0.2.6-mp'


class Blynk(object):

    def __init__(self, auth, **kwargs):
        self.auth       = auth
        self.server     = kwargs.get('server',     'blynk.cloud')
        self.port       = kwargs.get('port',       80)
        self.heartbeat  = kwargs.get('heartbeat',  10) * 1000
        self.rcv_buffer = kwargs.get('rcv_buffer', 1024)
        self.log        = kwargs.get('log',        None)

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
        if self._conn:
            try:
                self._conn.close()
            except:
                pass
            self._conn = None

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
