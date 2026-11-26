import dayjs from 'dayjs';
import type {
  DailyStat,
  IncomeMap,
  MonthlyComparisonItem,
  MonthlySummary,
  OverallSummary,
} from '../types/income';

/** ชื่อเดือนภาษาไทยแบบเต็ม */
const THAI_MONTHS_FULL = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

/** ชื่อเดือนภาษาไทยแบบย่อ */
const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

/** ชื่อวันในสัปดาห์ภาษาไทย */
const THAI_WEEKDAYS = [
  'อาทิตย์',
  'จันทร์',
  'อังคาร',
  'พุธ',
  'พฤหัสบดี',
  'ศุกร์',
  'เสาร์',
];

/**
 * แปลง key เดือน (YYYY-MM) เป็นชื่อเดือนและปี พ.ศ. ภาษาไทย
 *
 * @param monthKey เดือนในรูปแบบ YYYY-MM
 * @param short ใช้ชื่อเดือนแบบย่อหรือไม่
 * @returns ข้อความเดือนและปี พ.ศ. เช่น "พฤศจิกายน 2569"
 */
export function formatThaiMonthYear(monthKey: string, short = false): string {
  const d = dayjs(`${monthKey}-01`);
  if (!d.isValid()) return monthKey;
  const monthName = short ? THAI_MONTHS_SHORT[d.month()] : THAI_MONTHS_FULL[d.month()];
  const buddhistYear = d.year() + 543;
  return `${monthName} ${buddhistYear}`;
}

/**
 * แปลงวันที่ (YYYY-MM-DD) เป็นรูปแบบวันที่ภาษาไทยแบบอ่านง่าย
 *
 * @param dateStr วันที่ในรูปแบบ YYYY-MM-DD
 * @returns เช่น "วันพฤหัสบดีที่ 26 พ.ย. 2569"
 */
export function formatThaiFullDate(dateStr: string): string {
  const d = dayjs(dateStr);
  if (!d.isValid()) return dateStr;
  const weekday = THAI_WEEKDAYS[d.day()];
  const monthShort = THAI_MONTHS_SHORT[d.month()];
  const buddhistYear = d.year() + 543;
  return `วัน${weekday}ที่ ${d.date()} ${monthShort} ${buddhistYear}`;
}

/**
 * ตรวจสอบว่าข้อความหมายเหตุมีแท็กที่ระบุอยู่หรือไม่
 *
 * @param note ข้อความหมายเหตุ
 * @param tag ชื่อแท็ก เช่น "OT" หรือ "O1000"
 * @returns true หากพบแท็กในข้อความ
 */
function hasNoteTag(note: string | undefined, tag: string): boolean {
  if (!note) return false;
  return note
    .trim()
    .split(/\s+/)
    .includes(tag);
}

/**
 * คำนวณสถิติสรุปรายเดือนจากข้อมูลรายได้ทั้งหมด
 *
 * @param entries พจนานุกรมข้อมูลรายได้ทั้งหมด
 * @param monthKey เดือนที่ต้องการสรุปในรูปแบบ YYYY-MM
 * @returns ข้อมูลสรุปรายเดือนครบถ้วน
 */
export function calculateMonthlySummary(
  entries: IncomeMap,
  monthKey: string
): MonthlySummary {
  const startOfMonth = dayjs(`${monthKey}-01`);
  const daysInMonth = startOfMonth.daysInMonth();
  const dailyStats: DailyStat[] = [];

  let totalAmount = 0;
  let recordedDaysCount = 0;
  let otDaysCount = 0;
  let o1000DaysCount = 0;
  let bestDay: DailyStat | null = null;

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateStr = startOfMonth.date(day).format('YYYY-MM-DD');
    const entry = entries[dateStr];
    const hasEntry = Boolean(entry && entry.totalAmount > 0);
    const amount = entry ? entry.totalAmount : 0;

    const stat: DailyStat = {
      date: dateStr,
      dayNumber: day,
      totalAmount: amount,
      expression: entry?.expression ?? '',
      note: entry?.note,
      hasEntry,
    };

    dailyStats.push(stat);

    if (entry) {
      totalAmount += amount;
      if (amount > 0) {
        recordedDaysCount += 1;
        if (hasNoteTag(entry.note, 'O1000')) {
          o1000DaysCount += 1;
        }
        if (hasNoteTag(entry.note, 'OT')) {
          otDaysCount += 1;
        }
        if (!bestDay || amount > bestDay.totalAmount) {
          bestDay = stat;
        }
      }
    }
  }

  const roundedTotal = Math.round(totalAmount * 100) / 100;
  const averagePerRecordedDay =
    recordedDaysCount > 0
      ? Math.round((roundedTotal / recordedDaysCount) * 100) / 100
      : 0;

  return {
    monthKey,
    totalAmount: roundedTotal,
    averagePerRecordedDay,
    recordedDaysCount,
    otDaysCount,
    o1000DaysCount,
    bestDay,
    dailyStats,
  };
}

/**
 * คำนวณสรุปรายได้สะสมโดยรวมทั้งหมด และเปรียบเทียบรายเดือนย้อนหลัง
 *
 * @param entries พจนานุกรมข้อมูลรายได้ทั้งหมด
 * @returns ข้อมูลสรุปรายได้สะสมทั้งหมดและประวัติรายเดือน
 */
export function calculateOverallSummary(entries: IncomeMap): OverallSummary {
  const allEntries = Object.values(entries);
  let totalAmount = 0;
  let totalRecordedDays = 0;
  let totalOtDays = 0;
  let totalO1000Days = 0;

  const monthBuckets = new Map<string, { totalAmount: number; recordedDaysCount: number }>();

  for (const entry of allEntries) {
    if (!entry || typeof entry.totalAmount !== 'number') continue;

    totalAmount += entry.totalAmount;
    if (entry.totalAmount > 0) {
      totalRecordedDays += 1;
      if (hasNoteTag(entry.note, 'O1000')) {
        totalO1000Days += 1;
      }
      if (hasNoteTag(entry.note, 'OT')) {
        totalOtDays += 1;
      }
    }

    const monthKey = entry.date.slice(0, 7);
    const current = monthBuckets.get(monthKey) ?? {
      totalAmount: 0,
      recordedDaysCount: 0,
    };
    current.totalAmount = Math.round((current.totalAmount + entry.totalAmount) * 100) / 100;
    if (entry.totalAmount > 0) {
      current.recordedDaysCount += 1;
    }
    monthBuckets.set(monthKey, current);
  }

  const roundedTotal = Math.round(totalAmount * 100) / 100;
  const averagePerRecordedDay =
    totalRecordedDays > 0
      ? Math.round((roundedTotal / totalRecordedDays) * 100) / 100
      : 0;

  const monthlyHistory: MonthlyComparisonItem[] = Array.from(monthBuckets.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([monthKey, stats]) => ({
      monthKey,
      label: formatThaiMonthYear(monthKey, true),
      totalAmount: stats.totalAmount,
      recordedDaysCount: stats.recordedDaysCount,
    }));

  return {
    totalAmount: roundedTotal,
    totalRecordedDays,
    totalOtDays,
    totalO1000Days,
    averagePerRecordedDay,
    monthlyHistory,
  };
}

