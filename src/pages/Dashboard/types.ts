import type {
  IncomeEntry,
  MonthlySummary,
  OverallSummary,
} from '../../types/income';

/** พร็อพส์สำหรับส่วนการ์ดสรุปยอด (รายวัน / รายเดือน / รวมทั้งหมด) */
export interface SummaryCardsProps {
  /** วันที่ที่เลือกอยู่ในรูปแบบ YYYY-MM-DD */
  selectedDate: string;
  /** รายการรายได้ของวันที่เลือก (ถ้ามี) */
  selectedEntry?: IncomeEntry;
  /** ข้อมูลสรุปรายเดือนของเดือนที่กำลังดู */
  monthlySummary: MonthlySummary;
  /** ข้อมูลสรุปโดยรวมทั้งหมด */
  overallSummary: OverallSummary;
  /** เลือกวันที่จากปุ่มลัด เช่น วันที่ได้เยอะที่สุด */
  onSelectDate: (dateStr: string) => void;
  /** เปลี่ยนเดือนที่กำลังดูบนปฏิทิน */
  onSelectMonth: (monthKey: string) => void;
}

/** พร็อพส์สำหรับฟอร์มกรอกและแก้ไขรายได้แบบสูตรบวกเลข */
export interface IncomeFormCardProps {
  /** วันที่ที่เลือกอยู่ในรูปแบบ YYYY-MM-DD */
  selectedDate: string;
  /** รายการรายได้เดิมของวันที่เลือก (ถ้ามี) */
  existingEntry?: IncomeEntry;
  /** เปลี่ยนวันที่ที่เลือก */
  onChangeDate: (dateStr: string) => void;
  /** บันทึกหรืออัปเดตรายการรายได้ */
  onSaveEntry: (entry: IncomeEntry) => void;
  /** ลบรายการรายได้ของวันที่เลือก */
  onDeleteEntry: (dateStr: string) => void;
}

/** พร็อพส์สำหรับปฏิทินรายได้รายเดือนแบบโต้ตอบได้ */
export interface IncomeCalendarProps {
  /** เดือนที่กำลังแสดงในรูปแบบ YYYY-MM */
  currentMonthKey: string;
  /** วันที่ที่เลือกอยู่ในรูปแบบ YYYY-MM-DD */
  selectedDate: string;
  /** ข้อมูลสรุปรายเดือน (มี dailyStats และ bestDay) */
  monthlySummary: MonthlySummary;
  /** เปลี่ยนเดือนที่กำลังแสดง */
  onChangeMonth: (nextMonthKey: string) => void;
  /** เลือกวันที่บนปฏิทิน */
  onSelectDate: (dateStr: string) => void;
}

/** พร็อพส์สำหรับส่วนกราฟแท่งสีรุ้งพาสเทลรายวันในเดือน */
export interface MonthlyChartSectionProps {
  /** ข้อมูลสรุปรายเดือน */
  monthlySummary: MonthlySummary;
  /** วันที่ที่เลือกอยู่ */
  selectedDate: string;
  /** คลิกแท่งกราฟเพื่อเลือกวันนั้น */
  onSelectDate: (dateStr: string) => void;
}

/** พร็อพส์สำหรับแถบสรุปข้อมูลแบบย่อบนมือถือ */
export interface MobileSummaryBarProps {
  /** ยอดรวมของวันที่เลือก */
  selectedAmount: number;
  /** ยอดรวมทั้งเดือนที่กำลังดู */
  monthlyTotal: number;
  /** จำนวนวันที่มีรายได้ในเดือนนี้ */
  monthlyRecordedDays: number;
  /** ยอดรวมสะสมทั้งหมด */
  overallTotal: number;
}

/** พร็อพส์สำหรับตารางรายการรายได้รายวันบนมือถือ */
export interface DailyIncomeListProps {
  /** เดือนที่กำลังแสดงในรูปแบบ YYYY-MM */
  currentMonthKey: string;
  /** วันที่ที่เลือกอยู่ในรูปแบบ YYYY-MM-DD */
  selectedDate: string;
  /** ข้อมูลสรุปรายเดือน */
  monthlySummary: MonthlySummary;
  /** เปลี่ยนเดือนที่กำลังแสดง */
  onChangeMonth: (nextMonthKey: string) => void;
  /** เลือกวันที่จากรายการเพื่อโหลดขึ้นฟอร์ม */
  onSelectDate: (dateStr: string) => void;
}

