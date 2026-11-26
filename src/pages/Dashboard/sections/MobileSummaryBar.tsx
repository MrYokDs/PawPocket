import { CalendarDays, PawPrint, Wallet } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/expressionParser';
import type { MobileSummaryBarProps } from '../types';

/**
 * แถบสรุปข้อมูลขนาดกะทัดรัดสำหรับหน้าจอมือถือ (วันที่เลือก / เดือนนี้ / สะสมรวม)
 *
 * @param props ยอดสรุปรายวัน รายเดือน และสะสมทั้งหมด
 * @returns คอมโพเนนต์แถบสรุปข้อมูลขนาดเล็กสำหรับมือถือ
 */
export default function MobileSummaryBar({
  selectedAmount,
  monthlyTotal,
  monthlyRecordedDays,
  overallTotal,
}: MobileSummaryBarProps) {
  return (
    <section
      aria-label="สรุปรายได้แบบย่อ"
      className="grid grid-cols-3 gap-2"
    >
      <div className="rounded-2xl border border-pink-200/80 bg-white/95 px-2.5 py-2.5 text-center shadow-xs">
        <div className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-pink-600">
          <PawPrint className="h-3 w-3" />
          วันที่เลือก
        </div>
        <p className="truncate text-sm font-bold text-pink-600">
          {formatCompactCurrency(selectedAmount)}
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200/80 bg-white/95 px-2.5 py-2.5 text-center shadow-xs">
        <div className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-amber-700">
          <CalendarDays className="h-3 w-3" />
          เดือนนี้ ({monthlyRecordedDays} วัน)
        </div>
        <p className="truncate text-sm font-bold text-[#4a2c3a]">
          {formatCompactCurrency(monthlyTotal)}
        </p>
      </div>

      <div className="rounded-2xl border border-indigo-200/80 bg-white/95 px-2.5 py-2.5 text-center shadow-xs">
        <div className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-indigo-600">
          <Wallet className="h-3 w-3" />
          สะสมรวม
        </div>
        <p className="truncate text-sm font-bold text-indigo-700">
          {formatCompactCurrency(overallTotal)}
        </p>
      </div>
    </section>
  );
}

