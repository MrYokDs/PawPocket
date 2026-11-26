import { CalendarDays, PawPrint, Tag, Wallet } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/expressionParser';
import type { MobileSummaryBarProps } from '../types';

/**
 * แถบสรุปข้อมูลขนาดกะทัดรัดสำหรับหน้าจอมือถือ (วันที่เลือก / เดือนนี้ / สะสมรวม + แยกจำนวนวัน OT / O1000)
 *
 * @param props ยอดสรุปรายวัน รายเดือน สะสมทั้งหมด และจำนวนวันแยกตามแท็ก
 * @returns คอมโพเนนต์แถบสรุปข้อมูลขนาดเล็กสำหรับมือถือ
 */
export default function MobileSummaryBar({
  selectedAmount,
  monthlyTotal,
  monthlyRecordedDays,
  monthlyOtDays,
  monthlyO1000Days,
  overallTotal,
}: MobileSummaryBarProps) {
  return (
    <section aria-label="สรุปรายได้แบบย่อ" className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-pink-200/80 bg-white/95 px-2.5 py-2 text-center shadow-xs">
          <div className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-pink-600">
            <PawPrint className="h-3 w-3" />
            วันที่เลือก
          </div>
          <p className="truncate text-sm font-bold text-pink-600">
            {formatCompactCurrency(selectedAmount)}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-white/95 px-2.5 py-2 text-center shadow-xs">
          <div className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-amber-700">
            <CalendarDays className="h-3 w-3" />
            เดือนนี้
          </div>
          <p className="truncate text-sm font-bold text-[#4a2c3a]">
            {formatCompactCurrency(monthlyTotal)}
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-200/80 bg-white/95 px-2.5 py-2 text-center shadow-xs">
          <div className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-indigo-600">
            <Wallet className="h-3 w-3" />
            สะสมรวม
          </div>
          <p className="truncate text-sm font-bold text-indigo-700">
            {formatCompactCurrency(overallTotal)}
          </p>
        </div>
      </div>

      {/* แถบสรุปจำนวนวันที่มีรายได้จริง แยกตามแท็ก OT / O1000 */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 rounded-2xl border border-pink-100 bg-white/90 px-3 py-1.5 text-[11px] shadow-2xs">
        <span className="inline-flex items-center gap-1 font-semibold text-[#6b4255]">
          <Tag className="h-3 w-3 text-pink-500" />
          มีรายได้จริง <strong className="text-pink-600">{monthlyRecordedDays}</strong> วัน
        </span>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-pink-100 px-2 py-0.5 font-semibold text-pink-700">
            OT {monthlyOtDays} วัน
          </span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
            O1000 {monthlyO1000Days} วัน
          </span>
        </div>
      </div>
    </section>
  );
}
