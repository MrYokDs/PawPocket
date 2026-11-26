import dayjs from 'dayjs';
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  PawPrint,
  RotateCcw,
} from 'lucide-react';
import RainbowCard from '../../../components/RainbowCard';
import { formatCompactCurrency } from '../../../utils/expressionParser';
import { formatThaiMonthYear } from '../../../utils/incomeMath';
import type { IncomeCalendarProps } from '../types';

/** หัวตารางวันในสัปดาห์ภาษาไทย */
const WEEKDAY_HEADERS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

/** สีจุดสายรุ้งพาสเทลสำหรับตกแต่งวันที่มีรายได้ */
const RAINBOW_DOT_COLORS = [
  '#FF9AA2',
  '#FFB7B2',
  '#FFDAC1',
  '#B5EAD7',
  '#C7CEEA',
];

/**
 * ปฏิทินรายได้รายเดือนแบบโต้ตอบได้ คลิกที่วันใดก็ได้เพื่อดูหรือแก้ไขข้อมูลทันที
 *
 * @param props ข้อมูลเดือน วันที่เลือก และสถิติรายวัน
 * @returns คอมโพเนนต์ปฏิทินรายได้รายเดือน
 */
export default function IncomeCalendar({
  currentMonthKey,
  selectedDate,
  monthlySummary,
  onChangeMonth,
  onSelectDate,
}: IncomeCalendarProps) {
  const monthStart = dayjs(`${currentMonthKey}-01`);
  const firstWeekday = monthStart.day();
  const todayStr = dayjs().format('YYYY-MM-DD');
  const thisMonthKey = dayjs().format('YYYY-MM');

  const leadingBlanks = Array.from({ length: firstWeekday }, (_, i) => i);

  const handlePrevMonth = () => {
    onChangeMonth(monthStart.subtract(1, 'month').format('YYYY-MM'));
  };

  const handleNextMonth = () => {
    onChangeMonth(monthStart.add(1, 'month').format('YYYY-MM'));
  };

  const handleGoThisMonth = () => {
    onChangeMonth(thisMonthKey);
    onSelectDate(todayStr);
  };

  return (
    <RainbowCard contentClassName="p-4 sm:p-6">
      {/* ส่วนหัวปฏิทิน + ปุ่มเลื่อนเดือน */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-pink-200 bg-pink-50/70 text-pink-600 transition hover:bg-pink-100 active:scale-95"
            aria-label="เดือนก่อนหน้า"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h2 className="min-w-[140px] text-center text-base font-bold text-[#4a2c3a] sm:min-w-[170px] sm:text-lg">
            {formatThaiMonthYear(currentMonthKey)}
          </h2>

          <button
            type="button"
            onClick={handleNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-pink-200 bg-pink-50/70 text-pink-600 transition hover:bg-pink-100 active:scale-95"
            aria-label="เดือนถัดไป"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoThisMonth}
          className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs font-semibold text-pink-600 shadow-2xs transition hover:bg-pink-50 active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          เดือนนี้
        </button>
      </div>

      {/* หัววันในสัปดาห์ */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center sm:gap-2">
        {WEEKDAY_HEADERS.map((dayName, idx) => (
          <div
            key={dayName}
            className={`py-1 text-xs font-bold ${
              idx === 0
                ? 'text-rose-500'
                : idx === 6
                  ? 'text-indigo-500'
                  : 'text-[#8a5d72]'
            }`}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* ตารางวันที่ */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {leadingBlanks.map((blank) => (
          <div key={`blank-${blank}`} className="min-h-[60px] sm:min-h-[72px]" />
        ))}

        {monthlySummary.dailyStats.map((stat) => {
          const isSelected = stat.date === selectedDate;
          const isToday = stat.date === todayStr;
          const isBestDay =
            Boolean(monthlySummary.bestDay) &&
            monthlySummary.bestDay?.date === stat.date;
          const dotColor =
            RAINBOW_DOT_COLORS[stat.dayNumber % RAINBOW_DOT_COLORS.length];

          return (
            <button
              key={stat.date}
              type="button"
              onClick={() => onSelectDate(stat.date)}
              className={`group relative flex min-h-[60px] flex-col items-center justify-between rounded-2xl border p-1.5 text-left transition-all sm:min-h-[72px] sm:p-2 ${
                isSelected
                  ? 'border-pink-400 bg-gradient-to-b from-pink-100/90 to-rose-50 shadow-sm ring-2 ring-pink-300/70'
                  : stat.hasEntry
                    ? 'border-pink-200/80 bg-gradient-to-b from-white to-[#FFF5F8] hover:border-pink-300 hover:shadow-xs'
                    : 'border-pink-100/60 bg-white/70 hover:border-pink-200 hover:bg-pink-50/40'
              }`}
            >
              {/* แถวบน: เลขวัน + ไอคอนวันนี้/Best Day */}
              <div className="flex w-full items-center justify-between">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    isToday
                      ? 'bg-pink-500 text-white shadow-xs'
                      : isSelected
                        ? 'text-pink-700'
                        : 'text-[#4a2c3a]'
                  }`}
                >
                  {stat.dayNumber}
                </span>

                {isBestDay ? (
                  <Crown
                    className="h-3.5 w-3.5 text-amber-500"
                    aria-label="วันที่ได้รายได้เยอะที่สุด"
                  />
                ) : stat.hasEntry ? (
                  <PawPrint
                    className="h-3 w-3 opacity-80"
                    style={{ color: dotColor }}
                  />
                ) : null}
              </div>

              {/* แถวล่าง: ยอดเงินรวมของวันนั้น */}
              {stat.hasEntry ? (
                <div className="mt-1 w-full text-center">
                  <span className="block truncate rounded-lg bg-white/90 px-1 py-0.5 text-[10px] font-bold text-pink-600 shadow-2xs sm:text-[11px]">
                    {formatCompactCurrency(stat.totalAmount)}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-pink-200 group-hover:text-pink-300">
                  ·
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* คำอธิบายสัญลักษณ์ด้านล่างปฏิทิน */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-pink-100 pt-3 text-[11px] text-[#8a5d72]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-pink-500" />
          วันนี้
        </span>
        <span className="inline-flex items-center gap-1.5">
          <PawPrint className="h-3.5 w-3.5 text-pink-400" />
          วันที่มีรายได้
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Crown className="h-3.5 w-3.5 text-amber-500" />
          วันที่ได้เยอะสุดในเดือน
        </span>
      </div>
    </RainbowCard>
  );
}

