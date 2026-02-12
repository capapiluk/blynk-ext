// ============================================================
// Blynk IoT — Blockly Block Definitions
// MicroBlock + MicroPython 1.6.0
// ============================================================

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
    this.setColour('#00C7B7');
    this.setTooltip('สร้าง Blynk object และเชื่อมต่อ server\nport 80 = HTTP, port 443 = HTTPS');
    this.setHelpUrl('https://github.com/blynkkk/lib-python');
  }
};

// Block 2 — blynk.run()
Blockly.Blocks['blynk_run'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Blynk Run');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#00C7B7');
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
    this.setColour('#00C7B7');
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
    this.setColour('#1A86C8');
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
    this.setColour('#1A86C8');
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
    this.setColour('#27AE60');
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
    this.setColour('#E74C3C');
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
    this.setColour('#00C7B7');
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
    this.setColour('#8E44AD');
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
    this.setColour('#E67E22');
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
    this.setColour('#E67E22');
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
    this.setColour('#8E44AD');
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
    this.setColour('#00C7B7');
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
    this.setColour('#95A5A6');
    this.setTooltip('ดึงค่า values[index] จาก write handler\nindex เริ่มที่ 0');
    this.setHelpUrl('');
  }
};
