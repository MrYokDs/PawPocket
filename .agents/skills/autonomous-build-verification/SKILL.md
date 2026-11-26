---
name: autonomous-build-verification
description: สิทธิ์และขั้นตอนการรันคำสั่ง Build ทดสอบอัตโนมัติทุกครั้งหลังแก้ไขโค้ด เพื่อให้มั่นใจว่าโปรเจกต์คอมไพล์ผ่าน 0 Error
---

# Autonomous Build Verification

## ขั้นตอนการทำงาน
1. หลังแก้ไขโค้ด TypeScript / React / CSS ทุกครั้ง ให้รันคำสั่งทดสอบ Build อัตโนมัติภายใน Workspace:
   - ใช้ `yarn build` (หรือ `yarn.cmd build` บน Windows PowerShell) หากใช้ Yarn
   - หรือ `npm run build` (หรือ `npm.cmd run build` บน Windows PowerShell) หากใช้ npm
2. ตรวจสอบให้แน่ใจว่าทั้ง TypeScript type-check (`tsc`) และ Vite production bundle (`vite build`) ผ่านด้วย exit code `0` ไม่มี Error
3. หากพบ Error ใดๆ ให้แก้ไขให้ครบทุกจุดแล้วรัน Build ซ้ำจนกว่าจะผ่านสมบูรณ์ก่อนส่งมอบงาน

