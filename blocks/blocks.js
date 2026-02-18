// ============================================================
// Blynk IoT — Blockly Block Definitions
// MicroBlock + MicroPython 1.6+
// Updated for Blynk library v1.3.2 compatibility 
// ============================================================

// Block 0 — Blynk 2025 Complete Setup (Template ID + WiFi + Connection)
Blockly.Blocks['blynk_wifi_setup'] = {
  init: function() {
    this.appendValueInput('template_id')
        .setCheck('String')
        .appendField('🚀 Blynk 2025 Setup - Template ID');
    this.appendValueInput('template_name')
        .setCheck('String')
        .appendField('Template Name');
    this.appendValueInput('ssid')
        .setCheck('String')
        .appendField('WiFi SSID');
    this.appendValueInput('password')
        .setCheck('String')
        .appendField('รหัส WiFi');
    this.appendValueInput('auth')
        .setCheck('String')
        .appendField('Auth Token');
    this.appendValueInput('server')
        .setCheck('String')
        .appendField('Server');
    this.appendValueInput('port')
        .setCheck('Number')
        .appendField('Port');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Blynk 2025-2026 Complete Setup\n✅ Template ID (Required!)\n✅ WiFi Auto-Connect\n✅ Modern blynk.cloud server\n✅ Static Token support');
    this.setHelpUrl('https://docs.blynk.io/en/getting-started/supported-boards');
  }
};

// Block 1 — เชื่อมต่อ Blynk
Blockly.Blocks['blynk_init'] = {
  init: function() {
    this.appendValueInput('auth')
        .setCheck('String')
        .appendField('Blynk เชื่อมต่อ Token');
    this.appendValueInput('server')
        .setCheck('String')
        .appendField('Server');
    this.appendValueInput('port')
        .setCheck('Number')
        .appendField('Port');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('สร้าง Blynk object และเชื่อมต่อ server\nport 80 = HTTP, port 443 = HTTPS');
    this.setHelpUrl('');
  }
};

// Block 2 — blynk.run()
Blockly.Blocks['blynk_run'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Blynk Run');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('ต้องเรียกใน loop ตลอดเวลา ไม่เช่นนั้นจะ disconnect');
    this.setHelpUrl('');
  }
};

// Block 3 — virtual_write
Blockly.Blocks['blynk_virtual_write'] = {
  init: function() {
    this.appendValueInput('pin')
        .setCheck('Number')
        .appendField('Blynk ส่งค่า V');
    this.appendValueInput('value')
        .setCheck(null)
        .appendField('ค่า');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('ส่งค่าไป Virtual Pin เพื่อแสดงที่ Widget บน App');
    this.setHelpUrl('');
  }
};

// Block 4 — handle_event 'read V<n>'
Blockly.Blocks['blynk_handle_read'] = {
  init: function() {
    this.appendValueInput('pin')
        .setCheck('Number')
        .appendField('Blynk เมื่อ App อ่าน V');
    this.appendStatementInput('body')
        .setCheck(null)
        .appendField('ทำ');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('ทำงานเมื่อ App ขอค่าจาก Virtual Pin\nใช้ virtual_write ตอบกลับ');
    this.setHelpUrl('');
  }
};

// Block 5 — handle_event 'write V<n>'
Blockly.Blocks['blynk_handle_write'] = {
  init: function() {
    this.appendValueInput('pin')
        .setCheck('Number')
        .appendField('Blynk เมื่อ App ส่งค่ามา V');
    this.appendDummyInput()
        .appendField('เก็บค่าใน')
        .appendField(new Blockly.FieldVariable('values'), 'VAR');
    this.appendStatementInput('body')
        .setCheck(null)
        .appendField('ทำ');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('ทำงานเมื่อ App ส่งค่ามาที่ Virtual Pin\nค่าที่ได้เป็น list เช่น values[0]');
    this.setHelpUrl('');
  }
};

// Block 6 — handle_event 'connect'
Blockly.Blocks['blynk_handle_connect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Blynk เมื่อเชื่อมต่อสำเร็จ');
    this.appendStatementInput('body')
        .setCheck(null)
        .appendField('ทำ');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip('ทำงานครั้งเดียวหลังเชื่อมต่อสำเร็จ');
    this.setHelpUrl('');
  }
};

// Block 7 — handle_event 'disconnect'
Blockly.Blocks['blynk_handle_disconnect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Blynk เมื่อหลุดการเชื่อมต่อ');
    this.appendStatementInput('body')
        .setCheck(null)
        .appendField('ทำ');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('ทำงานเมื่อการเชื่อมต่อขาด (auto-reconnect จะทำงานเองใน run())');
    this.setHelpUrl('');
  }
};

// Block 8 — sync_virtual
Blockly.Blocks['blynk_sync_virtual'] = {
  init: function() {
    this.appendValueInput('pin')
        .setCheck('Number')
        .appendField('Blynk Sync Virtual Pin V');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('ขอค่าล่าสุดจาก Blynk server สำหรับ virtual pin นั้น');
    this.setHelpUrl('');
  }
};

// Block 9 — set_property
Blockly.Blocks['blynk_set_property'] = {
  init: function() {
    this.appendValueInput('pin')
        .setCheck('Number')
        .appendField('Blynk ตั้งค่า Widget V');
    this.appendValueInput('prop')
        .setCheck('String')
        .appendField('Property');
    this.appendValueInput('value')
        .setCheck(null)
        .appendField('ค่า');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
    this.setTooltip('เปลี่ยน property ของ Widget\nเช่น color="#FF0000"  label="Temp"  min=0  max=100');
    this.setHelpUrl('');
  }
};

// Block 10 — notify
Blockly.Blocks['blynk_notify'] = {
  init: function() {
    this.appendValueInput('message')
        .setCheck('String')
        .appendField('Blynk แจ้งเตือนมือถือ');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
    this.setTooltip('ส่ง Push Notification ไปยัง Blynk App บนมือถือ');
    this.setHelpUrl('');
  }
};

// Block 11 — email
Blockly.Blocks['blynk_email'] = {
  init: function() {
    this.appendValueInput('to')
        .setCheck('String')
        .appendField('Blynk ส่งอีเมล ถึง');
    this.appendValueInput('subject')
        .setCheck('String')
        .appendField('หัวข้อ');
    this.appendValueInput('body')
        .setCheck('String')
        .appendField('เนื้อหา');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
    this.setTooltip('ส่ง Email ผ่าน Blynk (ต้องตั้งค่า Email widget ใน App ก่อน)');
    this.setHelpUrl('');
  }
};

// Block 12 — log_event
Blockly.Blocks['blynk_log_event'] = {
  init: function() {
    this.appendValueInput('event_name')
        .setCheck('String')
        .appendField('Blynk บันทึก Event');
    this.appendValueInput('description')
        .setCheck('String')
        .appendField('รายละเอียด');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
    this.setTooltip('บันทึก event ลง Blynk Timeline');
    this.setHelpUrl('');
  }
};

// Block 13 — is_connected (value block)
Blockly.Blocks['blynk_is_connected'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Blynk เชื่อมต่ออยู่?');
    this.setOutput(true, 'Boolean');
    this.setColour(180);
    this.setTooltip('คืนค่า True ถ้า connected');
    this.setHelpUrl('');
  }
};

// Block 14 — get value from values[index]
Blockly.Blocks['blynk_get_value'] = {
  init: function() {
    this.appendValueInput('values')
        .setCheck(null)
        .appendField('ค่าจาก Blynk');
    this.appendValueInput('index')
        .setCheck('Number')
        .appendField('ตำแหน่ง');
    this.setOutput(true, null);
    this.setColour(210);
    this.setTooltip('ดึงค่า values[index] จาก write handler\nindex เริ่มที่ 0');
    this.setHelpUrl('');
  }
};

// Block 15 — Template ID (New in v1.3.2+)
Blockly.Blocks['blynk_template_id'] = {
  init: function() {
    this.appendValueInput('template_id')
        .setCheck('String')
        .appendField('Blynk Template ID');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('ตั้งค่า Template ID สำหรับ Blynk IoT (v1.3.2+)\nเช่น TMPL000000');
    this.setHelpUrl('');
  }
};

// Block 16 — Device Name (New in v1.3.2+)
Blockly.Blocks['blynk_device_name'] = {
  init: function() {
    this.appendValueInput('name')
        .setCheck('String')
        .appendField('Blynk Device Name');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('ตั้งชื่ออุปกรณ์สำหรับ Blynk IoT');
    this.setHelpUrl('');
  }
};

// Block 17 — Firmware Version (New in v1.3.2+)
Blockly.Blocks['blynk_firmware_version'] = {
  init: function() {
    this.appendValueInput('version')
        .setCheck('String')
        .appendField('Firmware Version');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('ตั้งค่าเวอร์ชันของ Firmware\nเช่น 1.0.0');
    this.setHelpUrl('');
  }
};

// Block 18 — Update Property (Enhanced set_property)
Blockly.Blocks['blynk_update_property'] = {
  init: function() {
    this.appendValueInput('pin')
        .setCheck('Number')
        .appendField('อัพเดท Property V');
    this.appendValueInput('property')
        .setCheck('String')
        .appendField('Property');
    this.appendValueInput('value')
        .setCheck(null)
        .appendField('ค่า');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('อัพเดท Widget Property ใน Blynk v1.3.2+\nProperty: color, label, min, max, step');
    this.setHelpUrl('');
  }
};

// Block 19 — Batch Send Start (Performance improvement)
Blockly.Blocks['blynk_batch_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Blynk Batch Send เริ่ม');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
    this.setTooltip('เริ่มการส่งแบบ Batch หลายค่าพร้อมกัน\nเพิ่มประสิทธิภาพเมื่อส่งหลายค่า');
    this.setHelpUrl('');
  }
};

// Block 20 — Batch Send End
Blockly.Blocks['blynk_batch_end'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Blynk Batch Send จบ');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
    this.setTooltip('จบการส่งแบบ Batch\nส่งข้อมูลทั้งหมดไปยัง Blynk Cloud');
    this.setHelpUrl('');
  }
};

// Block 21 — WiFi Connect (ESP32)
Blockly.Blocks['blynk_wifi_connect'] = {
  init: function() {
    this.appendValueInput('ssid')
        .setCheck('String')
        .appendField('ESP32 เชื่อมต่อ WiFi');
    this.appendValueInput('password')
        .setCheck('String')
        .appendField('รหัสผ่าน');
    this.setOutput(true, 'Boolean');
    this.setColour(220);
    this.setTooltip('เชื่อมต่อ WiFi บน ESP32\nคืนค่า True ถ้าเชื่อมต่อสำเร็จ');
    this.setHelpUrl('');
  }
};

// Block 22 — WiFi Info (ESP32)
Blockly.Blocks['blynk_wifi_info'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('ESP32 ข้อมูล WiFi');
    this.setOutput(true, null);
    this.setColour(220);
    this.setTooltip('ข้อมูลการเชื่อมต่อ WiFi บน ESP32\nคืนค่า dictionary ที่มี IP, RSSI, สถานะ');
    this.setHelpUrl('');
  }
};

// Block 23 — Memory Info (ESP32)
Blockly.Blocks['blynk_memory_info'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('ESP32 ข้อมูล Memory');
    this.setOutput(true, null);
    this.setColour(220);
    this.setTooltip('ข้อมูล Memory ฟรี ESP32\nคืนค่าจำนวน bytes');
    this.setHelpUrl('');
  }
};

// ===== Blynk 2025-2026 MODERN FEATURES =====

// Block 24 — HTTP API Upload (Official Doc Method)
Blockly.Blocks['blynk_http_upload'] = {
  init: function() {
    this.appendValueInput('pin')
        .setCheck('Number')
        .appendField('📊 HTTP API Upload Pin');
    this.appendValueInput('value')
        .setCheck(['Number', 'String'])
        .appendField('Value');
    this.appendValueInput('timestamp')
        .setCheck('Number')
        .appendField('Timestamp (optional)');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip('Blynk 2025-2026 HTTP API\n✅ Batch data upload\n✅ Cellular-friendly\n✅ Timestamped data\nIdeal for low-power devices');
    this.setHelpUrl('https://docs.blynk.io/en/blynk.cloud/device-https-api');
  }
};

// Block 25 — Device Status Check (Modern)
Blockly.Blocks['blynk_device_status'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('🔍 Device Status Check');
    this.setOutput(true, 'Boolean');
    this.setColour(45);
    this.setTooltip('Check 2025-2026 device status\n✅ Connection health\n✅ Template validation\n✅ Server response');
    this.setHelpUrl('');
  }
};

// Block 26 — OTA Ready Status
Blockly.Blocks['blynk_ota_ready'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('🔄 OTA Update Ready?');
    this.setOutput(true, 'Boolean');  
    this.setColour(45);
    this.setTooltip('Blynk.Air OTA Preparation\n✅ Check firmware update availability\n✅ Prepare for Over-The-Air updates');
    this.setHelpUrl('https://docs.blynk.io/en/blynk.edgent/updating-devices-firmwares-ota');
  }
};
