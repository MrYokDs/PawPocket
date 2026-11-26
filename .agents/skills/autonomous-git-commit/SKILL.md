---
name: autonomous-git-commit
description: มาตรฐานการปรับเลขเวอร์ชัน SemVer ใน package.json พร้อมการทำ git add, commit ภาษาไทย และ push อัตโนมัติเมื่อ Build ผ่าน
---

# Autonomous Git Commit & Semantic Versioning

## ขั้นตอนเมื่อพัฒนาฟีเจอร์หรือแก้ไขเสร็จและ Build ผ่าน
1. ปรับเลขเวอร์ชันใน `package.json` ตามมาตรฐาน **SemVer (`MAJOR.MINOR.PATCH`)**:
   - `PATCH` (เช่น `0.1.0` -> `0.1.1`): แก้บั๊ก, ปรับสไตล์เล็กน้อย, ปรับข้อความ
   - `MINOR` (เช่น `0.1.0` -> `0.2.0`): เพิ่มฟีเจอร์ใหม่ที่ไม่ทำลายของเดิม
   - `MAJOR` (เช่น `0.2.0` -> `1.0.0`): เปลี่ยนโครงสร้างใหญ่หรือ Breaking Change
2. ตรวจสอบสถานะไฟล์ด้วย `git status`
3. รันคำสั่ง:
   - `git add .`
   - `git commit -m "<ข้อความสรุปการเปลี่ยนแปลงภาษาไทย>"`
4. หากโปรเจกต์ผูก Remote Repository ไว้แล้ว ให้รัน `git push` อัตโนมัติ (หากยังไม่ได้ผูก Remote ให้แจ้งผู้ใช้ว่าสามารถ Commit ในเครื่องได้หรือรอผูก Remote ก่อน Push)

