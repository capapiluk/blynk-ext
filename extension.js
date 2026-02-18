({
    name: "Blynk IoT",
    description: "Blynk IoT Platform for MicroPython v1.6+ ESP32/ESP8266/Raspberry Pi (Updated for latest Blynk library v1.3.2)",
    author: "Cap_Apiluk",
    category: "Communication",  
    version: "2.0.0",
    icon: "static/icon.png",
    color: "#00C7B7",

    blocks: [
        {   // เชื่อมต่อ
            xml: `<block type="blynk_init">
                    <value name="auth"><shadow type="text"><field name="TEXT">YourAuthToken</field></shadow></value>
                    <value name="server"><shadow type="text"><field name="TEXT">blynk.cloud</field></shadow></value>
                    <value name="port"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                  </block>`
        },
        {   // Run
            xml: `<block type="blynk_run"></block>`
        },
        {   // Virtual Write
            xml: `<block type="blynk_virtual_write">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                  </block>`
        },
        {   // handle_event read
            xml: `<block type="blynk_handle_read">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  </block>`
        },
        {   // handle_event write
            xml: `<block type="blynk_handle_write">
                    <field name="VAR">values</field>
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  </block>`
        },
        {   // handle connect
            xml: `<block type="blynk_handle_connect"></block>`
        },
        {   // handle disconnect
            xml: `<block type="blynk_handle_disconnect"></block>`
        },
        {   // sync_virtual
            xml: `<block type="blynk_sync_virtual">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  </block>`
        },
        {   // set_property
            xml: `<block type="blynk_set_property">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <value name="prop"><shadow type="text"><field name="TEXT">color</field></shadow></value>
                    <value name="value"><shadow type="text"><field name="TEXT">#FF0000</field></shadow></value>
                  </block>`
        },
        {   // notify
            xml: `<block type="blynk_notify">
                    <value name="message"><shadow type="text"><field name="TEXT">Alert!</field></shadow></value>
                  </block>`
        },
        {   // email
            xml: `<block type="blynk_email">
                    <value name="to"><shadow type="text"><field name="TEXT">you@email.com</field></shadow></value>
                    <value name="subject"><shadow type="text"><field name="TEXT">Subject</field></shadow></value>
                    <value name="body"><shadow type="text"><field name="TEXT">Message body</field></shadow></value>
                  </block>`
        },
        {   // log_event
            xml: `<block type="blynk_log_event">
                    <value name="event_name"><shadow type="text"><field name="TEXT">sensor_alert</field></shadow></value>
                    <value name="description"><shadow type="text"><field name="TEXT">Value out of range</field></shadow></value>
                  </block>`
        },
        {   // is_connected
            xml: `<block type="blynk_is_connected"></block>`
        },
        {   // get_value
            xml: `<block type="blynk_get_value">
                    <value name="values"><shadow type="variables_get"><field name="VAR">values</field></shadow></value>
                    <value name="index"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                  </block>`
        },
        {   // template_id
            xml: `<block type="blynk_template_id">
                    <value name="template_id"><shadow type="text"><field name="TEXT">TMPL000000</field></shadow></value>
                  </block>`
        },
        {   // device_name
            xml: `<block type="blynk_device_name">
                    <value name="name"><shadow type="text"><field name="TEXT">My Device</field></shadow></value>
                  </block>`
        },
        {   // firmware_version
            xml: `<block type="blynk_firmware_version">
                    <value name="version"><shadow type="text"><field name="TEXT">1.0.0</field></shadow></value>
                  </block>`
        },
        {   // update_property  
            xml: `<block type="blynk_update_property">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <value name="property"><shadow type="text"><field name="TEXT">color</field></shadow></value>
                    <value name="value"><shadow type="text"><field name="TEXT">#FF0000</field></shadow></value>
                  </block>`
        },
        {   // batch_send_start
            xml: `<block type="blynk_batch_start"></block>`
        },
        {   // batch_send_end 
            xml: `<block type="blynk_batch_end"></block>`
        },
        {   // wifi_connect (ESP32)
            xml: `<block type="blynk_wifi_connect">
                    <value name="ssid"><shadow type="text"><field name="TEXT">YourWiFi</field></shadow></value>
                    <value name="password"><shadow type="text"><field name="TEXT">YourPassword</field></shadow></value>
                  </block>`
        },
        {   // wifi_info (ESP32)
            xml: `<block type="blynk_wifi_info"></block>`
        },
        {   // memory_info (ESP32)
            xml: `<block type="blynk_memory_info"></block>`
        }
    ],

    js: [
        "blynk_blocks.js",
        "blynk_generators.js"
    ],

    modules: [
        {
            name: "blynklib_mp",
            path: "modules/blynklib_mp.py"
        }
    ]
});
