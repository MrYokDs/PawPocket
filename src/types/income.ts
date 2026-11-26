/** ข้อมูลรายการรายได้ประจำวัน 1 วัน */
export interface IncomeEntry {
  /** วันที่ในรูปแบบ YYYY-MM-DD */
  date: string;
  /** สูตรดิบที่ผู้ใช้กรอก เช่น "100+200+300" */
  expression: string;
  /** ยอดรวมสุทธิที่คำนวณได้ (บาท) */
  totalAmount: number;
  /** หมายเหตุเพิ่มเติม (ไม่บังคับ) */
  note?: string;
  /** เวลาที่แก้ไขล่าสุด (ISO String) */
  updatedAt: string;
}

/** พจนานุกรมรายการรายได้ โดยใช้ key เป็นวันที่ YYYY-MM-DD */
export type IncomeMap = Record<string, IncomeEntry>;

/** รายการย่อยแต่ละตัวเลขที่แยกได้จากสูตรคำนวณ */
export interface ParsedExpressionItem {
  /** เครื่องหมายหน้าตัวเลข ('+' หรือ '-') */
  operator: '+' | '-';
  /** ค่าตัวเลขบวกของรายการย่อยนี้ */
  value: number;
  /** ข้อความดิบของตัวเลข */
  raw: string;
}

/** ผลลัพธ์จากการแปลงและคำนวณสูตรตัวเลขอย่างปลอดภัย */
export interface ExpressionParseResult {
  /** สูตรถูกต้องและสามารถคำนวณได้หรือไม่ */
  isValid: boolean;
  /** ยอดรวมสุทธิที่คำนวณได้ */
  total: number;
  /** รายการย่อยทั้งหมดในสูตร */
  items: ParsedExpressionItem[];
  /** สูตรที่จัดรูปเรียบร้อยแล้ว */
  normalizedExpression: string;
  /** ข้อความแจ้งเตือนกรณีสูตรไม่ถูกต้อง */
  errorMessage?: string;
}

/** สถิติรายได้ของแต่ละวันในเดือน */
export interface DailyStat {
  /** วันที่ในรูปแบบ YYYY-MM-DD */
  date: string;
  /** เลขวันที่ (1-31) */
  dayNumber: number;
  /** ยอดรวมของวันนั้น */
  totalAmount: number;
  /** สูตรดิบของวันนั้น */
  expression: string;
  /** หมายเหตุของวันนั้น */
  note?: string;
  /** มีการบันทึกรายได้ในวันนี้หรือไม่ */
  hasEntry: boolean;
}

/** ข้อมูลสรุปรายได้ประจำเดือน */
export interface MonthlySummary {
  /** เดือนในรูปแบบ YYYY-MM */
  monthKey: string;
  /** ยอดรวมทั้งหมดในเดือนนั้น */
  totalAmount: number;
  /** ค่าเฉลี่ยต่อวันที่มีการบันทึก */
  averagePerRecordedDay: number;
  /** จำนวนวันที่มีการบันทึกรายได้ในเดือนนั้น */
  recordedDaysCount: number;
  /** วันที่ได้รายได้สูงที่สุดในเดือน (null หากยังไม่มีข้อมูล) */
  bestDay: DailyStat | null;
  /** รายการสถิติครบทุกวันในเดือน */
  dailyStats: DailyStat[];
}

/** ข้อมูลสรุปเปรียบเทียบรายเดือนย้อนหลัง */
export interface MonthlyComparisonItem {
  /** เดือนในรูปแบบ YYYY-MM */
  monthKey: string;
  /** ชื่อเดือนและปี พ.ศ. แบบย่อ */
  label: string;
  /** ยอดรวมของเดือนนั้น */
  totalAmount: number;
  /** จำนวนวันที่มีรายได้ในเดือนนั้น */
  recordedDaysCount: number;
}

/** ข้อมูลสรุปรายได้สะสมทั้งหมดตั้งแต่เริ่มบันทึก */
export interface OverallSummary {
  /** รายได้สะสมรวมทั้งหมด */
  totalAmount: number;
  /** จำนวนวันที่บันทึกทั้งหมด */
  totalRecordedDays: number;
  /** ค่าเฉลี่ยต่อวันโดยรวม */
  averagePerRecordedDay: number;
  /** รายการสรุปรายเดือนเรียงจากเดือนล่าสุดย้อนหลัง */
  monthlyHistory: MonthlyComparisonItem[];
}

