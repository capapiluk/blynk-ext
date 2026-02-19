// ============================================================
// Blynk IoT — Python Generators 2025-2026
// MicroBlock + MicroPython 1.6+ 
// Updated for Blynk Official Documentation compatibility
// Supports: Template ID, Modern blynk.cloud, Static Tokens
// ============================================================

var BLYNK_IMPORT = 'import blynklib_mp as blynklib';
var WIFI_IMPORT = 'import network';

// Generator 0 — Blynk 2025 Complete Setup (Template ID + WiFi + Connection)
Blockly.Python['blynk_wifi_setup'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    Blockly.Python.definitions_['import_wifi'] = WIFI_IMPORT;
    
    var template_id   = Blockly.Python.valueToCode(block, 'template_id',   Blockly.Python.ORDER_ATOMIC) || '"TMPL000000000"';
    var template_name = Blockly.Python.valueToCode(block, 'template_name', Blockly.Python.ORDER_ATOMIC) || '"My Device"';
    var ssid          = Blockly.Python.valueToCode(block, 'ssid',          Blockly.Python.ORDER_ATOMIC) || '"YourWiFi"';
    var password      = Blockly.Python.valueToCode(block, 'password',      Blockly.Python.ORDER_ATOMIC) || '"YourPassword"';
    var auth          = Blockly.Python.valueToCode(block, 'auth',          Blockly.Python.ORDER_ATOMIC) || '""';
    var server        = Blockly.Python.valueToCode(block, 'server',        Blockly.Python.ORDER_ATOMIC) || '"blynk.cloud"';
    var port          = Blockly.Python.valueToCode(block, 'port',          Blockly.Python.ORDER_ATOMIC) || '80';
    
    // Blynk 2025-2026 Setup: Template ID + WiFi + Connection
    Blockly.Python.definitions_['blynk_template_config'] = 
        '# BLYNK 2025-2026 Configuration\n' +
        'BLYNK_TEMPLATE_ID = ' + template_id + '\n' +
        'BLYNK_TEMPLATE_NAME = ' + template_name + '\n' +
        'BLYNK_AUTH_TOKEN = ' + auth;
        
    Blockly.Python.definitions_['wifi_connect'] = 
        'sta_if = network.WLAN(network.STA_IF)\n' +
        'if not sta_if.isconnected():\n' +
        '    print("Connecting to WiFi...")\n' +
        '    sta_if.active(True)\n' +
        '    sta_if.connect(' + ssid + ', ' + password + ')\n' +
        '    while not sta_if.isconnected():\n' +
        '        pass\n' +
        'print("WiFi Connected:", sta_if.ifconfig()[0])';
        
    Blockly.Python.definitions_['blynk_obj'] =
        '# Blynk 2025-2026 Object with Template Support\n' +
        'blynk = blynklib.Blynk(BLYNK_AUTH_TOKEN, server=' + server + ', port=' + port + 
        ', heartbeat_timeout=30, firmware_version="2.0.0", template_id=BLYNK_TEMPLATE_ID, device_name=BLYNK_TEMPLATE_NAME, auto_wifi=False)\n' +
        'print("Blynk 2025-2026 Ready! Template:", BLYNK_TEMPLATE_ID)';
    
    return '';
};

// Generator 1 — blynk_init  
Blockly.Python['blynk_init'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var auth   = Blockly.Python.valueToCode(block, 'auth',   Blockly.Python.ORDER_ATOMIC) || '""';
    var server = Blockly.Python.valueToCode(block, 'server', Blockly.Python.ORDER_ATOMIC) || '"blynk.cloud"';
    var port   = Blockly.Python.valueToCode(block, 'port',   Blockly.Python.ORDER_ATOMIC) || '80';
    
    // Enhanced initialization for ESP32 + Blynk v1.3.2+
    Blockly.Python.definitions_['blynk_obj'] =
        'blynk = blynklib.Blynk(' + auth + ', server=' + server + ', port=' + port + 
        ', heartbeat_timeout=30, firmware_version="2.0.0", device_name="ESP32 Device", auto_wifi=True)';
    return '';
};

// Generator 2 — blynk_run
Blockly.Python['blynk_run'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    return 'blynk.run()\n';
};

// Generator 3 — virtual_write
Blockly.Python['blynk_virtual_write'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var pin   = Blockly.Python.valueToCode(block, 'pin',   Blockly.Python.ORDER_ATOMIC) || '0';
    var value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC) || '0';
    return 'blynk.virtual_write(' + pin + ', ' + value + ')\n';
};

// Generator 4 — handle_event 'read V<n>'
Blockly.Python['blynk_handle_read'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var pin  = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC) || '0';
    var body = Blockly.Python.statementToCode(block, 'body') || '    pass\n';
    var fn   = 'blynk_read_v' + pin.replace(/\D/g, '');
    var code = '\n@blynk.handle_event("read V' + pin + '")\n';
    code    += 'def ' + fn + '(pin):\n';
    code    += body;
    code    += '\n';
    return code;
};

// Generator 5 — handle_event 'write V<n>'
Blockly.Python['blynk_handle_write'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var pin  = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC) || '0';
    var varN = Blockly.Python.nameDB_.getName(
                   block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var body = Blockly.Python.statementToCode(block, 'body') || '    pass\n';
    var fn   = 'blynk_write_v' + pin.replace(/\D/g, '');
    var code = '\n@blynk.handle_event("write V' + pin + '")\n';
    code    += 'def ' + fn + '(pin, ' + varN + '):\n';
    code    += body;
    code    += '\n';
    return code;
};

// Generator 6 — handle_event 'connect'
Blockly.Python['blynk_handle_connect'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var body = Blockly.Python.statementToCode(block, 'body') || '    pass\n';
    var code = '\n@blynk.handle_event("connect")\n';
    code    += 'def blynk_on_connect():\n';
    code    += body;
    code    += '\n';
    return code;
};

// Generator 7 — handle_event 'disconnect'
Blockly.Python['blynk_handle_disconnect'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var body = Blockly.Python.statementToCode(block, 'body') || '    pass\n';
    var code = '\n@blynk.handle_event("disconnect")\n';
    code    += 'def blynk_on_disconnect():\n';
    code    += body;
    code    += '\n';
    return code;
};

// Generator 8 — sync_virtual
Blockly.Python['blynk_sync_virtual'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC) || '0';
    return 'blynk.sync_virtual(' + pin + ')\n';
};

// Generator 9 — set_property
Blockly.Python['blynk_set_property'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var pin   = Blockly.Python.valueToCode(block, 'pin',   Blockly.Python.ORDER_ATOMIC) || '0';
    var prop  = Blockly.Python.valueToCode(block, 'prop',  Blockly.Python.ORDER_ATOMIC) || '"color"';
    var value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC) || '""';
    return 'blynk.set_property(' + pin + ', ' + prop + ', ' + value + ')\n';
};

// Generator 10 — notify
Blockly.Python['blynk_notify'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var msg = Blockly.Python.valueToCode(block, 'message', Blockly.Python.ORDER_ATOMIC) || '""';
    return 'blynk.notify(' + msg + ')\n';
};

// Generator 11 — email
Blockly.Python['blynk_email'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var to      = Blockly.Python.valueToCode(block, 'to',      Blockly.Python.ORDER_ATOMIC) || '""';
    var subject = Blockly.Python.valueToCode(block, 'subject', Blockly.Python.ORDER_ATOMIC) || '""';
    var body    = Blockly.Python.valueToCode(block, 'body',    Blockly.Python.ORDER_ATOMIC) || '""';
    return 'blynk.email(' + to + ', ' + subject + ', ' + body + ')\n';
};

// Generator 12 — log_event
Blockly.Python['blynk_log_event'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var name = Blockly.Python.valueToCode(block, 'event_name',  Blockly.Python.ORDER_ATOMIC) || '""';
    var desc = Blockly.Python.valueToCode(block, 'description', Blockly.Python.ORDER_ATOMIC) || '""';
    return 'blynk.log_event(' + name + ', ' + desc + ')\n';
};

// Generator 13 — is_connected
Blockly.Python['blynk_is_connected'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    return ['blynk.is_connected()', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Generator 14 — get_value
Blockly.Python['blynk_get_value'] = function(block) {
    var values = Blockly.Python.valueToCode(block, 'values', Blockly.Python.ORDER_ATOMIC) || '[]';
    var index  = Blockly.Python.valueToCode(block, 'index',  Blockly.Python.ORDER_ATOMIC) || '0';
    return [values + '[' + index + ']', Blockly.Python.ORDER_ATOMIC];
};

// Generator 15 — Template ID (New in v1.3.2+)
Blockly.Python['blynk_template_id'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var template_id = Blockly.Python.valueToCode(block, 'template_id', Blockly.Python.ORDER_ATOMIC) || '""';
    Blockly.Python.definitions_['blynk_template_id'] = 'blynk.template_id = ' + template_id;
    return '';
};

// Generator 16 — Device Name (New in v1.3.2+)
Blockly.Python['blynk_device_name'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var name = Blockly.Python.valueToCode(block, 'name', Blockly.Python.ORDER_ATOMIC) || '""';
    Blockly.Python.definitions_['blynk_device_name'] = 'blynk.device_name = ' + name;
    return '';
};

// Generator 17 — Firmware Version (New in v1.3.2+)
Blockly.Python['blynk_firmware_version'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var version = Blockly.Python.valueToCode(block, 'version', Blockly.Python.ORDER_ATOMIC) || '"1.0.0"';
    return 'blynk.firmware_info(' + version + ')\n';
};

// Generator 18 — Update Property (Enhanced set_property)  
Blockly.Python['blynk_update_property'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var pin      = Blockly.Python.valueToCode(block, 'pin',      Blockly.Python.ORDER_ATOMIC) || '0';
    var property = Blockly.Python.valueToCode(block, 'property', Blockly.Python.ORDER_ATOMIC) || '"color"';
    var value    = Blockly.Python.valueToCode(block, 'value',    Blockly.Python.ORDER_ATOMIC) || '""';
    return 'blynk.update_property(' + pin + ', ' + property + ', ' + value + ')\n';
};

// Generator 19 — Batch Send Start (Performance improvement)
Blockly.Python['blynk_batch_start'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    return 'blynk.batch_send_start()\n';
};

// Generator 20 — Batch Send End
Blockly.Python['blynk_batch_end'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    return 'blynk.batch_send_end()\n';
};

// Generator 21 — WiFi Connect (ESP32)
Blockly.Python['blynk_wifi_connect'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var ssid = Blockly.Python.valueToCode(block, 'ssid', Blockly.Python.ORDER_ATOMIC) || '""';
    var password = Blockly.Python.valueToCode(block, 'password', Blockly.Python.ORDER_ATOMIC) || '""';
    return ['blynk.wifi_connect(' + ssid + ', ' + password + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Generator 22 — WiFi Info (ESP32)
Blockly.Python['blynk_wifi_info'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    return ['blynk.wifi_info()', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Generator 23 — Memory Info (ESP32)
Blockly.Python['blynk_memory_info'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    return ['blynk.memory_info()', Blockly.Python.ORDER_FUNCTION_CALL];
};

// ===== BLYNK 2025-2026 MODERN GENERATORS =====

// Generator 24 — HTTP API Upload (Official Doc Compatible)
Blockly.Python['blynk_http_upload'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    Blockly.Python.definitions_['import_time'] = 'import time';
    
    var pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC) || '0';
    var value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC) || '0';
    var timestamp = Blockly.Python.valueToCode(block, 'timestamp', Blockly.Python.ORDER_ATOMIC) || 'None';
    
    // Use current time if no timestamp provided
    var code = 'timestamp_val = ' + timestamp + ' if ' + timestamp + ' is not None else int(time.time() * 1000)\n';
    code += 'blynk.http_upload(' + pin + ', ' + value + ', timestamp_val)\n';
    return code;
};

// Generator 25 — Device Status Check
Blockly.Python['blynk_device_status'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    return ['blynk.device_status_check()', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Generator 26 — OTA Ready Status
Blockly.Python['blynk_ota_ready'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    return ['blynk.ota_ready_check()', Blockly.Python.ORDER_FUNCTION_CALL];
};
