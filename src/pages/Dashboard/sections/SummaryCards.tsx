import { CalendarDays, Crown, PawPrint, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import RainbowCard from '../../../components/RainbowCard';
import {
  formatCompactCurrency,
  formatCurrency,
  parseIncomeExpression,
} from '../../../utils/expressionParser';
import { formatThaiFullDate, formatThaiMonthYear } from '../../../utils/incomeMath';
import type { SummaryCardsProps } from '../types';

/**
 * แสดงการ์ดสรุปยอดรายได้ 3 มุมมอง: รายวัน, รายเดือน, และโดยรวมทั้งหมด
 *
 * @param props ข้อมูลสรุปรายวัน รายเดือน และสะสมทั้งหมด
 * @returns คอมโพเนนต์การ์ดสรุปยอดทั้ง 3 ใบ
 */
export default function SummaryCards({
  selectedDate,
  selectedEntry,
  monthlySummary,
  overallSummary,
  onSelectDate,
  onSelectMonth,
}: SummaryCardsProps) {
  const parsedItems = selectedEntry
    ? parseIncomeExpression(selectedEntry.expression).items
    : [];

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* 1. การ์ดสรุปรายวัน */}
      <RainbowCard contentClassName="flex h-full flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
              <PawPrint className="h-3.5 w-3.5" />
              สรุปรายวัน
            </span>
            <span className="text-xs font-medium text-[#8a5d72]">
              {formatThaiFullDate(selectedDate)}
            </span>
          </div>

          <p className="mt-2 text-3xl font-bold tracking-tight text-pink-600">
            {formatCurrency(selectedEntry?.totalAmount ?? 0)}
          </p>

          {selectedEntry?.note && (
            <p className="mt-1.5 rounded-xl bg-pink-50/80 px-2.5 py-1.5 text-xs text-[#6b4255]">
              📝 {selectedEntry.note}
            </p>
          )}
        </div>

        {/* แสดงรายการย่อยจากสูตรที่กรอก */}
        <div className="mt-4 border-t border-pink-100 pt-3">
          <p className="mb-1.5 text-xs font-semibold text-[#8a5d72]">
            รายการย่อยจากสูตร ({parsedItems.length} รายการ)
          </p>
          {parsedItems.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {parsedItems.map((item, idx) => (
                <span
                  key={`${item.raw}-${idx}`}
                  className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
                    item.operator === '-'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-gradient-to-r from-pink-100 to-amber-100 text-[#5c3648]'
                  }`}
                >
                  {idx === 0 && item.operator === '+' ? '' : item.operator}
                  {item.value.toLocaleString('th-TH', { maximumFractionDigits: 2 })}
                </span>
              ))}
            </div>
          ) : (
            <p className="font-cute text-xs text-pink-400">
              ยังไม่มีรายการในวันนี้ กรอกสูตรด้านล่างได้เลยน้า~
            </p>
          )}
        </div>
      </RainbowCard>

      {/* 2. การ์ดสรุปรายเดือน */}
      <RainbowCard contentClassName="flex h-full flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              <CalendarDays className="h-3.5 w-3.5" />
              สรุปรายเดือน
            </span>
            <span className="text-xs font-semibold text-[#8a5d72]">
              {formatThaiMonthYear(monthlySummary.monthKey)}
            </span>
          </div>

          <p className="mt-2 text-3xl font-bold tracking-tight text-[#4a2c3a]">
            {formatCurrency(monthlySummary.totalAmount)}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-pink-50/70 px-3 py-2">
              <span className="block text-[11px] text-[#8a5d72]">เฉลี่ยต่อวัน</span>
              <span className="text-sm font-bold text-pink-600">
                {formatCurrency(monthlySummary.averagePerRecordedDay)}
              </span>
            </div>
            <div className="rounded-2xl bg-emerald-50/70 px-3 py-2">
              <span className="block text-[11px] text-[#557a67]">วันที่มีรายได้</span>
              <span className="text-sm font-bold text-emerald-700">
                {monthlySummary.recordedDaysCount} วัน
              </span>
            </div>
          </div>
        </div>

        {/* วันที่ได้เยอะสุด (Best Day) */}
        <div className="mt-4 border-t border-pink-100 pt-3">
          {monthlySummary.bestDay ? (
            <button
              type="button"
              onClick={() => onSelectDate(monthlySummary.bestDay!.date)}
              className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#FFF0F5] via-[#FFF7E8] to-[#F0FBF6] px-3 py-2 text-left transition hover:brightness-95"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#6b4255]">
                <Crown className="h-4 w-4 text-amber-500" />
                Best Day (วันที่ {monthlySummary.bestDay.dayNumber})
              </span>
              <span className="text-xs font-bold text-pink-600">
                {formatCurrency(monthlySummary.bestDay.totalAmount)}
              </span>
            </button>
          ) : (
            <p className="font-cute text-xs text-pink-400">
              เดือนนี้ยังไม่มี Best Day มาเริ่มจดวันแรกกันเถอะ! ✨
            </p>
          )}
        </div>
      </RainbowCard>

      {/* 3. การ์ดสรุปโดยรวมทั้งหมด */}
      <RainbowCard contentClassName="flex h-full flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Wallet className="h-3.5 w-3.5" />
              สะสมทั้งหมด
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-pink-500">
              <Sparkles className="h-3.5 w-3.5" />
              {overallSummary.totalRecordedDays} วันที่จด
            </span>
          </div>

          <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-700">
            {formatCurrency(overallSummary.totalAmount)}
          </p>

          <p className="mt-1 text-xs text-[#8a5d72]">
            เฉลี่ยรวมทุกวันที่บันทึก:{' '}
            <span className="font-semibold text-[#4a2c3a]">
              {formatCurrency(overallSummary.averagePerRecordedDay)} / วัน
            </span>
          </p>
        </div>

        {/* เปรียบเทียบรายเดือนย้อนหลัง */}
        <div className="mt-4 border-t border-pink-100 pt-3">
          <div className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-[#8a5d72]">
            <TrendingUp className="h-3.5 w-3.5 text-pink-500" />
            เปรียบเทียบรายเดือนย้อนหลัง
          </div>

          {overallSummary.monthlyHistory.length > 0 ? (
            <div className="max-h-24 space-y-1.5 overflow-y-auto pr-1">
              {overallSummary.monthlyHistory.slice(0, 6).map((item) => {
                const maxTotal = Math.max(
                  ...overallSummary.monthlyHistory.map((m) => m.totalAmount),
                  1
                );
                const widthPercent = Math.max(
                  10,
                  Math.round((item.totalAmount / maxTotal) * 100)
                );
                const isActive = item.monthKey === monthlySummary.monthKey;

                return (
                  <button
                    key={item.monthKey}
                    type="button"
                    onClick={() => onSelectMonth(item.monthKey)}
                    className={`group flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left transition ${
                      isActive ? 'bg-pink-50' : 'hover:bg-pink-50/50'
                    }`}
                  >
                    <span className="w-16 flex-shrink-0 text-[11px] font-medium text-[#6b4255]">
                      {item.label}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-pink-100/70">
                      <div
                        className="rainbow-bar-bg h-full rounded-full transition-all duration-300"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                    <span className="w-16 flex-shrink-0 text-right text-[11px] font-bold text-pink-600">
                      {formatCompactCurrency(item.totalAmount)}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="font-cute text-xs text-pink-400">
              เมื่อเริ่มบันทึกหลายเดือน จะเห็นกราฟเปรียบเทียบตรงนี้นะเมี้ยว 🌈
            </p>
          )}
        </div>
      </RainbowCard>
    </section>
  );
}

