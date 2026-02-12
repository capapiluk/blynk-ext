// ============================================================
// Blynk IoT — Python Generators
// MicroBlock + MicroPython 1.6.0
// ============================================================

var BLYNK_IMPORT = 'import blynklib_mp as blynklib';

// Generator 1 — blynk_init
Blockly.Python['blynk_init'] = function(block) {
    Blockly.Python.definitions_['import_blynk'] = BLYNK_IMPORT;
    var auth   = Blockly.Python.valueToCode(block, 'auth',   Blockly.Python.ORDER_ATOMIC) || '""';
    var server = Blockly.Python.valueToCode(block, 'server', Blockly.Python.ORDER_ATOMIC) || '"blynk.cloud"';
    var port   = Blockly.Python.valueToCode(block, 'port',   Blockly.Python.ORDER_ATOMIC) || '80';
    Blockly.Python.definitions_['blynk_obj'] =
        'blynk = blynklib.Blynk(' + auth + ', server=' + server + ', port=' + port + ')';
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
