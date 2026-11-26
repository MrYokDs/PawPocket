import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, Crown, RotateCcw } from 'lucide-react';
import RainbowCard from '../../../components/RainbowCard';
import { formatCurrency } from '../../../utils/expressionParser';
import { formatThaiMonthYear } from '../../../utils/incomeMath';
import type { DailyIncomeListProps } from '../types';

/**
 * ตารางรายการรายได้รวมรายวันเฉพาะวันที่มีการบันทึกในเดือนที่กำลังดู
 * เหมาะสำหรับไล่ดูและแตะเลือกแก้ไขได้รวดเร็วบนมือถือ
 *
 * @param props ข้อมูลสรุปรายเดือนและฟังก์ชันเลือกวัน/เปลี่ยนเดือน
 * @returns คอมโพเนนต์ตารางรายการรายได้รายวัน
 */
export default function DailyIncomeList({
  currentMonthKey,
  selectedDate,
  monthlySummary,
  onChangeMonth,
  onSelectDate,
}: DailyIncomeListProps) {
  const monthStart = dayjs(`${currentMonthKey}-01`);
  const thisMonthKey = dayjs().format('YYYY-MM');
  const todayStr = dayjs().format('YYYY-MM-DD');

  // แสดงเฉพาะวันที่มีรายได้ เรียงจากวันล่าสุดลงไป
  const recordedDays = monthlySummary.dailyStats
    .filter((stat) => stat.hasEntry)
    .slice()
    .reverse();

  return (
    <RainbowCard contentClassName="p-4">
      {/* ส่วนหัวเลือกเดือน */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              onChangeMonth(monthStart.subtract(1, 'month').format('YYYY-MM'))
            }
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-pink-200 bg-pink-50/70 text-pink-600 active:scale-95"
            aria-label="เดือนก่อนหน้า"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[125px] text-center text-sm font-bold text-[#4a2c3a]">
            {formatThaiMonthYear(currentMonthKey)}
          </span>
          <button
            type="button"
            onClick={() =>
              onChangeMonth(monthStart.add(1, 'month').format('YYYY-MM'))
            }
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-pink-200 bg-pink-50/70 text-pink-600 active:scale-95"
            aria-label="เดือนถัดไป"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onChangeMonth(thisMonthKey);
            onSelectDate(todayStr);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-pink-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-pink-600 active:scale-95"
        >
          <RotateCcw className="h-3 w-3" />
          เดือนนี้
        </button>
      </div>

      {/* ตารางรายการรายได้รายวัน */}
      {recordedDays.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/30 py-8 text-center">
          <p className="font-cute text-sm font-semibold text-pink-500">
            เดือนนี้ยังไม่มีรายการที่บันทึกเลยเมี้ยว 🐾
          </p>
          <p className="mt-1 text-xs text-[#8a5d72]">
            กรอกรายได้ด้านบนเพื่อเริ่มจดวันแรกได้เลย
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-pink-100">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-pink-50/80 text-[11px] font-semibold text-[#8a5d72]">
                <th className="px-3 py-2">วันที่</th>
                <th className="px-2 py-2">สูตร / หมายเหตุ</th>
                <th className="px-3 py-2 text-right">รวม (บาท)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100/80 bg-white">
              {recordedDays.map((stat) => {
                const isSelected = stat.date === selectedDate;
                const isBestDay = monthlySummary.bestDay?.date === stat.date;

                return (
                  <tr
                    key={stat.date}
                    onClick={() => onSelectDate(stat.date)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-pink-100/70'
                        : 'hover:bg-pink-50/50 active:bg-pink-100/50'
                    }`}
                  >
                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-[#4a2c3a]">
                      <div className="flex items-center gap-1">
                        <span>{dayjs(stat.date).format('D MMM')}</span>
                        {isBestDay && (
                          <Crown
                            className="h-3.5 w-3.5 text-amber-500"
                            aria-label="วันที่ได้เยอะสุด"
                          />
                        )}
                      </div>
                    </td>
                    <td className="max-w-[140px] px-2 py-2.5">
                      <p className="truncate font-medium text-[#6b4255]">
                        {stat.expression}
                      </p>
                      {stat.note && (
                        <p className="truncate text-[11px] text-pink-500">
                          {stat.note}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-bold text-pink-600">
                      {formatCurrency(stat.totalAmount, false)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </RainbowCard>
  );
}

