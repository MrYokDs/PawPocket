import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PawPrint,
} from 'lucide-react';
import { formatThaiMonthYear } from '../utils/incomeMath';

/** หัวตารางวันในสัปดาห์ภาษาไทย */
const WEEKDAYS_TH = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

/** ชื่อเดือนภาษาไทยแบบย่อ */
const MONTHS_SHORT_TH = [
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

type PickerMode = 'day' | 'month' | 'year';

interface PastelDatePickerProps {
  /** ค่าวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD */
  value: string;
  /** ฟังก์ชันเมื่อผู้ใช้เลือกวันที่ใหม่ */
  onChange: (dateStr: string) => void;
  /** id ของปุ่มเพื่อเชื่อมกับ label */
  id?: string;
}

/**
 * แปลงวันที่ YYYY-MM-DD เป็นรูปแบบสั้นภาษาไทย พ.ศ. เช่น "26 พ.ย. 2569"
 *
 * @param dateStr วันที่ในรูปแบบ YYYY-MM-DD
 * @returns ข้อความวันที่ภาษาไทยแบบสั้น
 */
function formatThaiShortDate(dateStr: string): string {
  const d = dayjs(dateStr);
  if (!d.isValid()) return dateStr;
  return `${d.date()} ${MONTHS_SHORT_TH[d.month()]} ${d.year() + 543}`;
}

/**
 * ตัวเลือกวันที่แบบกำหนดเองสไตล์ชมพู-สายรุ้งพาสเทล
 * รองรับการกดหัวข้อตรงกลางเพื่อสลับเลือกเดือน และกดซ้ำเพื่อเลือกปี (พ.ศ.)
 *
 * @param props ค่าวันที่ปัจจุบันและ callback เมื่อเปลี่ยนวัน
 * @returns คอมโพเนนต์ตัวเลือกวันที่ธีม PawPocket
 */
export default function PastelDatePicker({
  value,
  onChange,
  id,
}: PastelDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode>('day');
  const [viewMonthKey, setViewMonthKey] = useState(() => value.slice(0, 7));
  const containerRef = useRef<HTMLDivElement | null>(null);

  // อัปเดตเดือนในปฏิทินป๊อปอัพให้ตรงกับวันที่ที่เลือกเสมอ
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setViewMonthKey(value.slice(0, 7));
    }
  }, [value]);

  // รีเซ็ตกลับไปหน้าเลือกวันทุกครั้งที่เปิดป๊อปอัพใหม่
  useEffect(() => {
    if (isOpen) {
      setPickerMode('day');
    }
  }, [isOpen]);

  // ปิดปฏิทินเมื่อคลิกนอกกรอบหรือกดปุ่ม Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const monthStart = dayjs(`${viewMonthKey}-01`);
  const viewYear = monthStart.year();
  const viewMonth = monthStart.month();
  const daysInMonth = monthStart.daysInMonth();
  const firstWeekday = monthStart.day();
  const todayStr = dayjs().format('YYYY-MM-DD');
  const selectedDayjs = dayjs(value);

  // ช่วงปี 12 ปีสำหรับโหมดเลือกปี
  const yearRangeStart = Math.floor(viewYear / 12) * 12;
  const yearGrid = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

  const leadingBlanks = Array.from({ length: firstWeekday }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrev = () => {
    if (pickerMode === 'day') {
      setViewMonthKey(monthStart.subtract(1, 'month').format('YYYY-MM'));
    } else if (pickerMode === 'month') {
      setViewMonthKey(monthStart.subtract(1, 'year').format('YYYY-MM'));
    } else {
      setViewMonthKey(monthStart.subtract(12, 'year').format('YYYY-MM'));
    }
  };

  const handleNext = () => {
    if (pickerMode === 'day') {
      setViewMonthKey(monthStart.add(1, 'month').format('YYYY-MM'));
    } else if (pickerMode === 'month') {
      setViewMonthKey(monthStart.add(1, 'year').format('YYYY-MM'));
    } else {
      setViewMonthKey(monthStart.add(12, 'year').format('YYYY-MM'));
    }
  };

  /** สลับโหมดเมื่อกดตรงกลาง: วัน -> เดือน -> ปี -> วัน */
  const handleCenterTitleClick = () => {
    setPickerMode((prev) => {
      if (prev === 'day') return 'month';
      if (prev === 'month') return 'year';
      return 'day';
    });
  };

  const handleSelectDay = (dayNumber: number) => {
    const nextDate = monthStart.date(dayNumber).format('YYYY-MM-DD');
    onChange(nextDate);
    setIsOpen(false);
  };

  const handleSelectMonth = (monthIndex: number) => {
    setViewMonthKey(monthStart.month(monthIndex).format('YYYY-MM'));
    setPickerMode('day');
  };

  const handleSelectYear = (yearValue: number) => {
    setViewMonthKey(monthStart.year(yearValue).format('YYYY-MM'));
    setPickerMode('month');
  };

  const handleSelectToday = () => {
    onChange(todayStr);
    setViewMonthKey(todayStr.slice(0, 7));
    setPickerMode('day');
    setIsOpen(false);
  };

  const headerTitle =
    pickerMode === 'day'
      ? formatThaiMonthYear(viewMonthKey)
      : pickerMode === 'month'
        ? `พ.ศ. ${viewYear + 543}`
        : `${yearRangeStart + 543} - ${yearRangeStart + 11 + 543}`;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ปุ่มเลือกวันที่เต็มความกว้าง (ไม่ล้นกรอบบน iOS/Android) */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-2xl border px-3.5 text-sm font-semibold text-[#4a2c3a] outline-none transition ${
          isOpen
            ? 'border-pink-400 bg-white ring-2 ring-pink-200'
            : 'border-pink-200 bg-pink-50/40 hover:border-pink-300 hover:bg-white'
        }`}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          <Calendar className="h-4 w-4 flex-shrink-0 text-pink-500" />
          <span className="truncate">{formatThaiShortDate(value)}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-pink-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* ปฏิทินป๊อปอัพธีมชมพู-สายรุ้งพาสเทล */}
      {isOpen && (
        <div className="rainbow-border-gradient absolute left-0 right-0 z-30 mt-2 rounded-[24px] p-[2px] shadow-xl shadow-pink-200/70">
          <div className="rounded-[22px] bg-white p-3.5">
            {/* แถบหัวเลือกเดือน/ปี (กดตรงกลางเพื่อสลับเลือกเดือน -> ปี) */}
            <div className="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition hover:bg-pink-100 active:scale-95"
                aria-label="ก่อนหน้า"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleCenterTitleClick}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold text-[#4a2c3a] transition hover:bg-pink-50 hover:text-pink-600 active:scale-95"
                title={
                  pickerMode === 'day'
                    ? 'แตะเพื่อเลือกเดือน'
                    : pickerMode === 'month'
                      ? 'แตะเพื่อเลือกปี'
                      : 'แตะเพื่อกลับไปเลือกวัน'
                }
              >
                <PawPrint className="h-3.5 w-3.5 text-pink-400" />
                <span>{headerTitle}</span>
                <ChevronDown className="h-3.5 w-3.5 text-pink-400" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition hover:bg-pink-100 active:scale-95"
                aria-label="ถัดไป"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* โหมด 1: เลือกวันที่ */}
            {pickerMode === 'day' && (
              <>
                <div className="mb-1.5 grid grid-cols-7 gap-1 text-center">
                  {WEEKDAYS_TH.map((dayLabel, idx) => (
                    <span
                      key={dayLabel}
                      className={`py-0.5 text-[11px] font-bold ${
                        idx === 0
                          ? 'text-rose-500'
                          : idx === 6
                            ? 'text-indigo-500'
                            : 'text-[#8a5d72]'
                      }`}
                    >
                      {dayLabel}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {leadingBlanks.map((blank) => (
                    <div key={`blank-${blank}`} className="h-9" />
                  ))}

                  {days.map((dayNumber) => {
                    const dateStr = monthStart.date(dayNumber).format('YYYY-MM-DD');
                    const isSelected = dateStr === value;
                    const isToday = dateStr === todayStr;

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => handleSelectDay(dayNumber)}
                        className={`flex h-9 w-full items-center justify-center rounded-xl text-xs font-semibold transition active:scale-95 ${
                          isSelected
                            ? 'rainbow-btn-bg text-white shadow-sm'
                            : isToday
                              ? 'bg-pink-100/90 font-bold text-pink-700 ring-1 ring-pink-300'
                              : 'text-[#4a2c3a] hover:bg-pink-50'
                        }`}
                      >
                        {dayNumber}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* โหมด 2: เลือกเดือน */}
            {pickerMode === 'month' && (
              <div className="grid grid-cols-3 gap-2 py-1">
                {MONTHS_SHORT_TH.map((monthLabel, idx) => {
                  const isCurrentSelected =
                    selectedDayjs.year() === viewYear &&
                    selectedDayjs.month() === idx;
                  const isViewingMonth = viewMonth === idx;

                  return (
                    <button
                      key={monthLabel}
                      type="button"
                      onClick={() => handleSelectMonth(idx)}
                      className={`flex h-10 items-center justify-center rounded-xl text-xs font-semibold transition active:scale-95 ${
                        isCurrentSelected
                          ? 'rainbow-btn-bg text-white shadow-sm'
                          : isViewingMonth
                            ? 'bg-pink-100 text-pink-700 ring-1 ring-pink-300'
                            : 'bg-pink-50/40 text-[#4a2c3a] hover:bg-pink-100/70'
                      }`}
                    >
                      {monthLabel}
                    </button>
                  );
                })}
              </div>
            )}

            {/* โหมด 3: เลือกปี (พ.ศ.) */}
            {pickerMode === 'year' && (
              <div className="grid grid-cols-3 gap-2 py-1">
                {yearGrid.map((yearValue) => {
                  const isCurrentSelected = selectedDayjs.year() === yearValue;
                  const isViewingYear = viewYear === yearValue;

                  return (
                    <button
                      key={yearValue}
                      type="button"
                      onClick={() => handleSelectYear(yearValue)}
                      className={`flex h-10 items-center justify-center rounded-xl text-xs font-semibold transition active:scale-95 ${
                        isCurrentSelected
                          ? 'rainbow-btn-bg text-white shadow-sm'
                          : isViewingYear
                            ? 'bg-pink-100 text-pink-700 ring-1 ring-pink-300'
                            : 'bg-pink-50/40 text-[#4a2c3a] hover:bg-pink-100/70'
                      }`}
                    >
                      {yearValue + 543}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ส่วนท้าย: ปุ่มวันนี้ และ ปิด */}
            <div className="mt-3 flex items-center justify-between border-t border-pink-100 pt-2.5">
              <button
                type="button"
                onClick={handleSelectToday}
                className="rounded-xl bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-600 transition hover:bg-pink-100"
              >
                เลือกวันนี้
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-[#8a5d72] transition hover:bg-pink-50"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
