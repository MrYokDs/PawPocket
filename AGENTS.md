# AGENTS.md — กฎและมาตรฐานหลักของโปรเจกต์ PawPocket 🐱🌈💖

เอกสารฉบับนี้คือมาตรฐานหลักที่ AI Agent และนักพัฒนาทุกคนต้องปฏิบัติตามอย่างเคร่งครัดตลอดการพัฒนาโปรเจกต์ **PawPocket** (เว็บแอปบันทึกรายได้พิเศษรายวัน)

---

## กฎเหล็กประจำโปรเจกต์ (Project Golden Rules)

1. **Check Before Create (ตรวจสอบก่อนสร้างเสมอ)**
   - ตรวจสอบไฟล์ที่มีอยู่แล้วใน `src/types/`, `src/components/`, และ `src/utils/` ก่อนสร้างไฟล์หรือฟังก์ชันใหม่เสมอ ห้ามเขียนโค้ดซ้ำซ้อน

2. **File Length Limit (จำกัดความยาวไฟล์)**
   - ห้ามไฟล์โค้ดใดยาวเกิน **500–600 บรรทัด** หากไฟล์เริ่มยาวให้แตกเป็น Sub-component ใน `sections/` หรือแยกฟังก์ชันออกไปไว้ใน `src/utils/`

3. **Naming Conventions (มาตรฐานการตั้งชื่อ)**
   - ตัวแปร (Variables) และฟังก์ชัน (Functions) ใช้ `camelCase`
   - Component, Interface, Type และ Enum ใช้ `PascalCase`

4. **Base64 Handling (การจัดการ Base64 ที่รองรับภาษาไทย)**
   - **ห้ามใช้ `btoa()` และ `atob()` โดยเด็ดขาด** เนื่องจากไม่รองรับอักขระ UTF-8 / ภาษาไทย
   - ให้ใช้ไลบรารี `js-base64` (`Base64.encode` / `Base64.decode`) เท่านั้น

5. **Modular Page Architecture (โครงสร้างหน้าแบบแยกส่วน)**
   - ทุกหน้าใน `src/pages/` ต้องจัดเป็นโฟลเดอร์ `src/pages/<PageName>/` ที่ประกอบด้วย:
     - `<PageName>.tsx` (ไฟล์หลักคุม State และจัด Layout)
     - `types.ts` (Type เฉพาะของหน้านั้น)
     - `index.ts` (Re-export)
     - `sections/` (ชิ้นส่วน UI ย่อยของหน้า)
   - ทุกไฟล์หน้าหลักต้องมีคอมเมนต์ระบุ Route ด้านบนสุดของไฟล์ เช่น `/** Route: / */`
   - มีไฟล์ `src/pages/<PageName>.tsx` ที่ Re-export จาก `./<PageName>/<PageName>`

6. **Centralized Routing (รวมศูนย์เส้นทาง)**
   - รวมศูนย์เส้นทาง (Route Paths) ทั้งหมดไว้ที่ `src/routes/paths.ts` และกำหนด Route ทั้งหมดที่ `src/routes/AppRoutes.tsx`
   - ห้าม Hardcode path กระจายตามคอมโพเนนต์

7. **Continuous Learning Trigger (ระบบจดจำบทเรียนอัตโนมัติ)**
   - ทุกครั้งที่ผู้ใช้พูดคำว่า **"คราวหลัง..."** หรือ **"ครั้งหน้า..."** เพื่อสอนหรือปรับพฤติกรรมการทำงาน ให้สร้างสกิลใหม่เก็บไว้ใน `.agents/skills/<skill-name>/SKILL.md` อัตโนมัติทันที

8. **Obsolete Code Policy (นโยบายการลบโค้ดเก่า)**
   - ห้ามลบไฟล์หรือโค้ดเก่าโดยพลการ ต้องแจ้งและขออนุญาตจากผู้ใช้ก่อนเสมอ

9. **Thai Comments & Plans (คอมเมนต์และแผนงานภาษาไทย)**
   - เขียน JSDoc อธิบายฟังก์ชัน (`@param`, `@returns`) คอมเมนต์สำคัญ และแผนการทำงานเป็น **ภาษาไทย** ที่ชัดเจน อ่านเข้าใจง่าย

10. **Mandatory Build Check (บังคับทดสอบ Build ทุกครั้ง)**
    - รันทดสอบคำสั่ง Build (`yarn build` หรือ `npm run build`) อัตโนมัติทุกครั้งหลังแก้ไขโค้ด และต้องผ่านโดยไม่มี Error

11. **Autonomous Workspace Terminal (รันคำสั่ง Terminal ภายใน Workspace)**
    - อนุญาตให้รันคำสั่ง Terminal ภายในโฟลเดอร์ Workspace ได้อัตโนมัติ
    - ห้ามแก้ไขหรือยุ่งเกี่ยวกับไฟล์นอกโฟลเดอร์ Workspace เด็ดขาด

12. **Semantic Versioning & Auto Git Commit/Push**
    - เมื่อพัฒนาฟีเจอร์หรือแก้ไขเสร็จและ Build ผ่าน ให้ปรับเลขเวอร์ชันใน `package.json` ตามมาตรฐาน **SemVer (`MAJOR.MINOR.PATCH`)**
    - จากนั้นรัน `git add .`, `git commit -m "<ข้อความสรุปภาษาไทย>"`, และ `git push` อัตโนมัติ (เมื่อโปรเจกต์ผูก Remote Repository เรียบร้อยแล้ว)

13. **Knowledge Graph (Graphify)**
    - หากในเครื่องมีการติดตั้ง `graphify` ให้รันคำสั่ง `graphify update .` หลังการ Build เพื่ออัปเดต Knowledge Graph ของโปรเจกต์ให้เป็นปัจจุบันเสมอ

---

## ชุดสกิลประจำโปรเจกต์ (`.agents/skills/`)
- `common-skills` — มาตรฐานโค้ด, โครงสร้าง Modular, ภาษาไทย, ห้าม `btoa/atob`, จำกัดความยาวไฟล์
- `autonomous-build-verification` — การทดสอบ Build อัตโนมัติทุกครั้งหลังแก้โค้ด
- `workspace-terminal-execution` — ขอบเขตความปลอดภัยของการรันคำสั่ง Terminal
- `autonomous-git-commit` — การปรับ SemVer และการ Commit/Push ภาษาไทยอัตโนมัติ
- `graphify` — แนวทางการใช้งานและอัปเดต Knowledge Graph

