({
    name: "Blynk IoT",
    description: "Blynk IoT Platform for MicroPython ESP32/ESP8266 (based on blynkkk/lib-python)",
    author: "Cap_Apiluk",
    category: "Communication",
    version: "1.0.0",
    icon: "/static/icon.svg",
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
                    <value name="index"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                  </block>`
        }
    ],

    js: [
        "/blynk_blocks.js",
        "/blynk_generators.js"
    ],

    modules: [
        {
            name: "blynklib_mp",
            path: "/modules/blynklib_mp.py"
        }
    ]
});
