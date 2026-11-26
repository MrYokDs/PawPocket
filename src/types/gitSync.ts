/** การตั้งค่าการซิงค์ข้อมูลขึ้น GitHub Repository */
export interface GitSyncConfig {
  /** ชื่อเจ้าของ Repository (Username หรือ Organization) */
  owner: string;
  /** ชื่อ Repository */
  repo: string;
  /** ชื่อ Branch เช่น main */
  branch: string;
  /** พาธไฟล์ JSON ปลายทาง เช่น data/incomes.json */
  filePath: string;
  /** GitHub Personal Access Token (เก็บเฉพาะใน LocalStorage) */
  token: string;
  /** เปิดการซิงค์อัตโนมัติหลังบันทึก/ลบหรือไม่ */
  autoSync: boolean;
}

/** สถานะการทำงานของระบบ GitHub Sync */
export type SyncStatusState = 'idle' | 'syncing' | 'success' | 'error';

/** ข้อมูลสถานะการซิงค์ล่าสุดสำหรับแสดงผลบน UI */
export interface SyncStatus {
  /** สถานะปัจจุบัน */
  state: SyncStatusState;
  /** ข้อความอธิบายสถานะภาษาไทย */
  message: string;
  /** เวลาที่ซิงค์สำเร็จล่าสุด (ISO String) */
  lastSyncedAt?: string;
}

