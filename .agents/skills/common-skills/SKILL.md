---
name: common-skills
description: มาตรฐานการเขียนโค้ดของโปรเจกต์ MeowIncome ทั้งโครงสร้าง Modular Folder, การใช้ภาษาไทยใน JSDoc, ห้ามใช้ btoa/atob, และจำกัดความยาวไฟล์ไม่เกิน 500-600 บรรทัด
---

# Common Skills — มาตรฐานการเขียนโค้ด MeowIncome

## ข้อปฏิบัติหลัก
1. **Check Before Create:** ตรวจสอบ `src/types/`, `src/components/`, และ `src/utils/` ก่อนสร้างไฟล์หรือฟังก์ชันใหม่ทุกครั้ง
2. **File Length Limit:** ห้ามเขียนไฟล์โค้ดใดยาวเกิน **500–600 บรรทัด** หากเริ่มยาวให้แยกเป็น Sub-component ใน `sections/` หรือแยก Utility
3. **Naming Conventions:**
   - ตัวแปรและฟังก์ชัน: `camelCase`
   - Component, Interface, Type: `PascalCase`
4. **ห้ามใช้ `btoa()` / `atob()` เด็ดขาด:** ใช้ `js-base64` (`Base64.encode`, `Base64.decode`) เท่านั้น เพื่อรองรับภาษาไทย (UTF-8) 100%
5. **Modular Page Architecture:**
   - ทุกหน้าใน `src/pages/` ต้องมีโฟลเดอร์ `src/pages/<PageName>/` ที่ประกอบด้วย `<PageName>.tsx`, `types.ts`, `index.ts`, และ `sections/`
   - ใส่คอมเมนต์ระบุ Route ด้านบนสุดของไฟล์หน้าหลัก เช่น `/** Route: / */`
6. **Centralized Routing:** เก็บเส้นทางทั้งหมดที่ `src/routes/paths.ts` และ `src/routes/AppRoutes.tsx` ห้าม Hardcode path
7. **JSDoc ภาษาไทย:** เขียน JSDoc อธิบายฟังก์ชันพร้อม `@param` และ `@returns` เป็นภาษาไทย
8. **Obsolete Code Policy:** ห้ามลบไฟล์หรือโค้ดเก่าโดยพลการ ต้องขออนุญาตผู้ใช้ก่อนเสมอ
9. **Continuous Learning Trigger:** เมื่อผู้ใช้พูดคำว่า *"คราวหลัง..."* หรือ *"ครั้งหน้า..."* ให้บันทึกเป็นสกิลใหม่ใน `.agents/skills/<skill-name>/SKILL.md` อัตโนมัติ

