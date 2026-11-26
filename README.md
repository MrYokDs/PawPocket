# MeowIncome 🐱🌈💖

เว็บแอปพลิเคชันบันทึกรายได้พิเศษรายวันสไตล์น่ารักสดใส (Kawaii Pastel Pink & Rainbow) ใช้งานง่ายทั้งบนมือถือและคอมพิวเตอร์

## ฟีเจอร์หลัก
- **Smart Expression Input:** กรอกตัวเลขปกติหรือสูตรบวก/ลบเลขต่อเนื่อง เช่น `100+200+300` หรือ `150+50.5-20+300` ด้วย Safe Math Parser (ไม่ใช้ `eval`) พร้อมแสดงผลรวมแบบ Real-time Preview และเก็บสูตรดิบไว้แก้ไขต่อท้ายได้สะดวก
- **บันทึกและแก้ไขวันย้อนหลังได้เต็มรูปแบบ:** เลือกวันย้อนหลังเพื่อเพิ่ม แก้ไข หรือลบรายการได้ตลอดเวลา
- **ปฏิทินรายได้แบบโต้ตอบได้:** ดูภาพรวมรายเดือนพร้อมยอดเงินในแต่ละวัน ไฮไลต์วันนี้และวันที่ได้เยอะที่สุด (Best Day) คลิกที่วันใดก็ได้เพื่อโหลดข้อมูลขึ้นมาแก้ไขทันที
- **แดชบอร์ดสรุปยอดครบถ้วน:** สรุปรายวัน (พร้อมแยกรายการย่อยจากสูตร), สรุปรายเดือน (ยอดรวม, ค่าเฉลี่ย, จำนวนวัน, Best Day, กราฟแท่งสีรุ้งพาสเทล) และสรุปสะสมทั้งหมดพร้อมเปรียบเทียบรายเดือนย้อนหลัง
- **น้องแมว Mascot SVG:** มีแอนิเมชันหูกระดิก/หางแกว่ง เปลี่ยนสีหน้าและคำพูดตามยอดรายได้ของวันที่เลือก
- **LocalStorage + GitHub Sync + Export/Import JSON:** บันทึกอัตโนมัติในเครื่อง ซิงค์ข้อมูลขึ้น GitHub Repository ส่วนตัว (เข้ารหัสด้วย `js-base64` รองรับภาษาไทย 100%) และสำรอง/นำเข้าไฟล์ `.json` ได้

---

## วิธีรันโปรเจกต์บนเครื่อง (Local Development)

```bash
# 1. ติดตั้งแพ็กเกจ
npm install

# 2. รันเซิร์ฟเวอร์พัฒนา
npm run dev

# 3. ทดสอบ Build สำหรับ Production
npm run build
```

> **หมายเหตุสำหรับ Windows PowerShell:** หากติดนโยบาย ExecutionPolicy สามารถใช้ `npm.cmd install`, `npm.cmd run dev`, และ `npm.cmd run build` แทนได้

---

## วิธีสร้าง GitHub Personal Access Token สำหรับ GitHub Sync

1. ไปที่ GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. กด **Generate new token**
3. ตั้งชื่อ Token และเลือก **Only select repositories** โดยเลือก Repository ที่ใช้เก็บไฟล์ข้อมูล (เช่น `meow-income-data`)
4. ในหัวข้อ **Repository permissions** ให้ตั้งค่า **Contents** เป็น **Read and write**
5. กด **Generate token** แล้วคัดลอก Token มาวางในหน้าต่าง **GitHub Sync & สำรองข้อมูล** บนเว็บแอป
   - *ความปลอดภัย:* Token จะถูกเก็บเฉพาะใน `localStorage` ของเบราว์เซอร์คุณเท่านั้น ไม่มีการ Hardcode ลงในซอร์สโค้ด

---

## วิธี Deploy ขึ้น Vercel (vercel.app)

โปรเจกต์นี้เตรียมไฟล์ `vercel.json` สำหรับ SPA Rewrite ไว้เรียบร้อยแล้ว:

1. สร้าง Repository ใหม่บน GitHub และ Push โค้ดขึ้นไป:
   ```bash
   git init
   git add .
   git commit -m "เริ่มต้นโปรเจกต์ MeowIncome เวอร์ชัน 1.0.0"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```
2. เข้าเว็บ [vercel.com](https://vercel.com) และล็อกอินด้วย GitHub
3. กด **Add New... → Project** แล้วเลือก Repository ของคุณ
4. Vercel จะตรวจจับ **Vite** อัตโนมัติ (Build Command: `npm run build`, Output Directory: `dist`)
5. กด **Deploy** รอไม่กี่วินาทีก็จะได้ลิงก์ `https://<project-name>.vercel.app` พร้อมใช้งานทันที!

