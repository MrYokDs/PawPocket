import { BarChart3, Sparkles } from 'lucide-react';
import RainbowCard from '../../../components/RainbowCard';
import {
  formatCompactCurrency,
  formatCurrency,
} from '../../../utils/expressionParser';
import { formatThaiMonthYear } from '../../../utils/incomeMath';
import type { MonthlyChartSectionProps } from '../types';

/** ชุดสีสายรุ้งพาสเทลสำหรับแท่งกราฟรายวัน */
const PASTEL_RAINBOW_COLORS = [
  '#FF9AA2',
  '#FFB7B2',
  '#FFDAC1',
  '#E2F0CB',
  '#B5EAD7',
  '#C7CEEA',
];

/**
 * กราฟแท่งสีรุ้งพาสเทลแสดงรายได้รายวันในเดือนที่กำลังดู คลิกแท่งเพื่อเลือกวันนั้นได้
 *
 * @param props ข้อมูลสรุปรายเดือนและฟังก์ชันเลือกวัน
 * @returns คอมโพเนนต์ส่วนกราฟแท่งสีรุ้งพาสเทล
 */
export default function MonthlyChartSection({
  monthlySummary,
  selectedDate,
  onSelectDate,
}: MonthlyChartSectionProps) {
  const maxAmount = Math.max(
    ...monthlySummary.dailyStats.map((d) => d.totalAmount),
    0
  );

  return (
    <RainbowCard contentClassName="p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFDAC1] to-[#B5EAD7] text-[#4a2c3a]">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#4a2c3a] sm:text-lg">
              กราฟรายได้รายวัน ({formatThaiMonthYear(monthlySummary.monthKey)})
            </h2>
            <p className="text-xs text-[#8a5d72]">
              แตะที่แท่งกราฟเพื่อดูหรือแก้ไขรายได้ของวันนั้นได้เลย
            </p>
          </div>
        </div>

        {monthlySummary.averagePerRecordedDay > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
            <Sparkles className="h-3.5 w-3.5" />
            ค่าเฉลี่ย {formatCurrency(monthlySummary.averagePerRecordedDay)}/วัน
          </span>
        )}
      </div>

      {maxAmount === 0 ? (
        <div className="flex h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-pink-50/30 px-4 text-center">
          <p className="font-cute text-sm font-semibold text-pink-500">
            ยังไม่มีข้อมูลรายได้ในเดือน {formatThaiMonthYear(monthlySummary.monthKey)} เลยเมี้ยว 🌈
          </p>
          <p className="mt-1 text-xs text-[#8a5d72]">
            ลองกรอกรายได้ด้านบน แล้วแท่งกราฟสีรุ้งพาสเทลจะเด้งขึ้นมาทันที!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex h-56 min-w-[540px] items-end gap-1.5 rounded-2xl bg-gradient-to-b from-[#FFF8FB] to-white px-3 pt-8 pb-3 sm:min-w-0 sm:gap-2">
            {monthlySummary.dailyStats.map((stat, index) => {
              const heightPercent =
                stat.totalAmount > 0
                  ? Math.max(10, Math.round((stat.totalAmount / maxAmount) * 100))
                  : 4;
              const isSelected = stat.date === selectedDate;
              const barColor =
                PASTEL_RAINBOW_COLORS[index % PASTEL_RAINBOW_COLORS.length];

              return (
                <button
                  key={stat.date}
                  type="button"
                  onClick={() => onSelectDate(stat.date)}
                  title={`วันที่ ${stat.dayNumber}: ${formatCurrency(stat.totalAmount)}`}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end focus:outline-none"
                >
                  {/* Tooltip ยอดเงินเมื่อ Hover หรือวันที่เลือก */}
                  {stat.totalAmount > 0 && (
                    <span
                      className={`pointer-events-none absolute -top-7 z-10 whitespace-nowrap rounded-lg px-1.5 py-0.5 text-[10px] font-bold shadow-xs transition-opacity ${
                        isSelected
                          ? 'bg-pink-500 text-white opacity-100'
                          : 'bg-[#4a2c3a] text-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {formatCompactCurrency(stat.totalAmount)}
                    </span>
                  )}

                  {/* ตัวแท่งกราฟสีรุ้งพาสเทล */}
                  <div
                    className={`w-full max-w-[22px] rounded-t-xl transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-pink-500 ring-offset-1'
                        : 'group-hover:brightness-95'
                    }`}
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: stat.totalAmount > 0 ? barColor : '#FCE7F3',
                    }}
                  />

                  {/* เลขวันที่ด้านล่าง */}
                  <span
                    className={`mt-1.5 text-[10px] font-semibold ${
                      isSelected
                        ? 'rounded-full bg-pink-500 px-1.5 text-white'
                        : stat.totalAmount > 0
                          ? 'text-[#6b4255]'
                          : 'text-pink-300'
                    }`}
                  >
                    {stat.dayNumber}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </RainbowCard>
  );
}

