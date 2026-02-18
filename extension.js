({
    name: "Blynk IoT",
    description: "Blynk IoT Platform for MicroPython v1.6+ ESP32/ESP8266/Raspberry Pi (Updated for latest Blynk library v1.3.2)",
    author: "Cap_Apiluk",
    category: "Communication",  
    version: "2.0.0",
    icon: "/static/icon.png",
    color: "#00C7B7",

    blocks: [
        // ===== ตั้งค่าครั้งแรก (Setup) =====
        {   // 1. เชื่อมต่อ WiFi (ESP32)
            xml: `<block type="blynk_wifi_connect">
                    <value name="ssid"><shadow type="text"><field name="TEXT">YourWiFi</field></shadow></value>
                    <value name="password"><shadow type="text"><field name="TEXT">YourPassword</field></shadow></value>
                  </block>`
        },
        {   // 2. Template ID
            xml: `<block type="blynk_template_id">
                    <value name="template_id"><shadow type="text"><field name="TEXT">TMPL000000</field></shadow></value>
                  </block>`
        },
        {   // 3. ชื่อ Device
            xml: `<block type="blynk_device_name">
                    <value name="name"><shadow type="text"><field name="TEXT">My Device</field></shadow></value>
                  </block>`
        },
        {   // 4. Firmware Version
            xml: `<block type="blynk_firmware_version">
                    <value name="version"><shadow type="text"><field name="TEXT">1.0.0</field></shadow></value>
                  </block>`
        },
        {   // 5. เชื่อมต่อ Blynk
            xml: `<block type="blynk_init">
                    <value name="auth"><shadow type="text"><field name="TEXT">YourAuthToken</field></shadow></value>
                    <value name="server"><shadow type="text"><field name="TEXT">blynk.cloud</field></shadow></value>
                    <value name="port"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                  </block>`
        },
        
        // ===== ใช้งานหลัก (Main) =====
        {   // 6. Blynk Run (ต้องมี!)
            xml: `<block type="blynk_run"></block>`
        },
        {   // 7. ส่งค่าไป App
            xml: `<block type="blynk_virtual_write">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                  </block>`
        },
        {   // 8. ขอค่าจาก App
            xml: `<block type="blynk_sync_virtual">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  </block>`
        },
        {   // 9. เช็คสถานะ
            xml: `<block type="blynk_is_connected"></block>`
        },
        
        // ===== รับข้อมูล (Events) =====
        {   // 10. เมื่อ App เขียนค่า
            xml: `<block type="blynk_handle_write">
                    <field name="VAR">values</field>
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  </block>`
        },
        {   // 11. เมื่อ App อ่านค่า
            xml: `<block type="blynk_handle_read">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  </block>`
        },
        {   // 12. เมื่อเชื่อมต่อ
            xml: `<block type="blynk_handle_connect"></block>`
        },
        {   // 13. เมื่อขาดการเชื่อมต่อ
            xml: `<block type="blynk_handle_disconnect"></block>`
        },
        {   // 14. ดึงค่าจาก values
            xml: `<block type="blynk_get_value">
                    <value name="values"><shadow type="variables_get"><field name="VAR">values</field></shadow></value>
                    <value name="index"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                  </block>`
        },
        
        // ===== การแจ้งเตือน (Notifications) =====
        {   // 15. Push Notification
            xml: `<block type="blynk_notify">
                    <value name="message"><shadow type="text"><field name="TEXT">Alert!</field></shadow></value>
                  </block>`
        },
        {   // 16. ส่ง Email
            xml: `<block type="blynk_email">
                    <value name="to"><shadow type="text"><field name="TEXT">you@email.com</field></shadow></value>
                    <value name="subject"><shadow type="text"><field name="TEXT">Subject</field></shadow></value>
                    <value name="body"><shadow type="text"><field name="TEXT">Message body</field></shadow></value>
                  </block>`
        },
        {   // 17. บันทึก Event
            xml: `<block type="blynk_log_event">
                    <value name="event_name"><shadow type="text"><field name="TEXT">sensor_alert</field></shadow></value>
                    <value name="description"><shadow type="text"><field name="TEXT">Value out of range</field></shadow></value>
                  </block>`
        },
        
        // ===== ขั้นสูง (Advanced) =====
        {   // 18. ตั้งค่า Widget
            xml: `<block type="blynk_set_property">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <value name="prop"><shadow type="text"><field name="TEXT">color</field></shadow></value>
                    <value name="value"><shadow type="text"><field name="TEXT">#FF0000</field></shadow></value>
                  </block>`
        },
        {   // 19. อัพเดต Property
            xml: `<block type="blynk_update_property">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <value name="property"><shadow type="text"><field name="TEXT">color</field></shadow></value>
                    <value name="value"><shadow type="text"><field name="TEXT">#FF0000</field></shadow></value>
                  </block>`
        },
        {   // 20. เริ่มส่งหลายค่า
            xml: `<block type="blynk_batch_start"></block>`
        },
        {   // 21. จบการส่งหลายค่า
            xml: `<block type="blynk_batch_end"></block>`
        },
        {   // 22. ข้อมูล WiFi
            xml: `<block type="blynk_wifi_info"></block>`
        },
        {   // 23. ข้อมูล Memory
            xml: `<block type="blynk_memory_info"></block>`
        }
    ],

    js: [
        "/blocks.js",
        "/generators.js"
    ],

    modules: [
        {
            name: "blynklib_mp",
            path: "/modules/blynklib_mp.py"
        }
    ]
});
