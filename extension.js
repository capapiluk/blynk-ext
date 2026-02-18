({
    name: "Blynk IoT",
    description: "Blynk IoT Platform for MicroPython v1.6+ ESP32/ESP8266/Raspberry Pi (Updated for latest Blynk library v1.3.2)",
    author: "Cap_Apiluk",
    category: "Communication",  
    version: "2.0.0",
    icon: "/static/icon.png",
    color: "#00C7B7",

    blocks: [
        // ===== ตั้งค่าหลัก (เริ่มต้นใช้งาน) =====
        {   // 1. Blynk Setup (ทุกอย่างในบล็อกเดียว)
            xml: `<block type="blynk_wifi_setup">
                    <value name="ssid"><shadow type="text"><field name="TEXT">YourWiFi</field></shadow></value>
                    <value name="password"><shadow type="text"><field name="TEXT">YourPassword</field></shadow></value>
                    <value name="auth"><shadow type="text"><field name="TEXT">YourAuthToken</field></shadow></value>
                    <value name="server"><shadow type="text"><field name="TEXT">blynk.cloud</field></shadow></value>
                    <value name="port"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                  </block>`
        },
        
        // ===== ใช้งานหลัก =====
        {   // 2. Blynk Run (ต้องมี!)
            xml: `<block type="blynk_run"></block>`
        },
        {   // 3. ส่งค่าไป App
            xml: `<block type="blynk_virtual_write">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                  </block>`
        },
        
        // ===== รับข้อมูลจาก App =====
        {   // 4. เมื่อ App เขียนค่า (มีพารามิเตอร์ values)
            xml: `<block type="blynk_handle_write">
                    <field name="VAR">values</field>
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  </block>`
        },
        {   // 5. เมื่อ App อ่านค่า
            xml: `<block type="blynk_handle_read">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  </block>`
        },
        {   // 6. ดึงค่าจาก values (ใช้ใน handle_write)
            xml: `<block type="blynk_get_value">
                    <value name="values"><shadow type="variables_get"><field name="VAR">values</field></shadow></value>
                    <value name="index"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                  </block>`
        },
        
        // ===== การแจ้งเตือน =====
        {   // 7. Push Notification
            xml: `<block type="blynk_notify">
                    <value name="message"><shadow type="text"><field name="TEXT">Alert!</field></shadow></value>
                  </block>`
        },
        
        // ===== เชื่อมต่อสถานะ =====
        {   // 8. เช็คสถานะการเชื่อมต่อ
            xml: `<block type="blynk_is_connected"></block>`
        },
        {   // 9. เมื่อเชื่อมต่อสำเร็จ
            xml: `<block type="blynk_handle_connect"></block>`
        },
        {   // 10. เมื่อขาดการเชื่อมต่อ
            xml: `<block type="blynk_handle_disconnect"></block>`
        },
        
        // ===== ขั้นสูง (สำหรับผู้เชี่ยวชาญ) =====
        {   // 11. ขอค่าจาก App
            xml: `<block type="blynk_sync_virtual">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  </block>`
        },
        {   // 12. ตั้งค่า Widget สี
            xml: `<block type="blynk_set_property">
                    <value name="pin"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <value name="prop"><shadow type="text"><field name="TEXT">color</field></shadow></value>
                    <value name="value"><shadow type="text"><field name="TEXT">#FF0000</field></shadow></value>
                  </block>`
        },
        {   // 13. ส่ง Email
            xml: `<block type="blynk_email">
                    <value name="to"><shadow type="text"><field name="TEXT">you@email.com</field></shadow></value>
                    <value name="subject"><shadow type="text"><field name="TEXT">Subject</field></shadow></value>
                    <value name="body"><shadow type="text"><field name="TEXT">Message body</field></shadow></value>
                  </block>`
        },
        {   // 14. บันทึก Event
            xml: `<block type="blynk_log_event">
                    <value name="event_name"><shadow type="text"><field name="TEXT">sensor_alert</field></shadow></value>
                    <value name="description"><shadow type="text"><field name="TEXT">Value out of range</field></shadow></value>
                  </block>`
        },
        
        // ===== ESP32 เฉพาะ =====
        {   // 15. ข้อมูล WiFi (ESP32)
            xml: `<block type="blynk_wifi_info"></block>`
        },
        {   // 16. ข้อมูล Memory (ESP32)
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
