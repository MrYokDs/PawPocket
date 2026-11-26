import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Calculator,
  Calendar,
  Check,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import RainbowCard from '../../../components/RainbowCard';
import {
  formatCurrency,
  parseIncomeExpression,
} from '../../../utils/expressionParser';
import { formatThaiFullDate } from '../../../utils/incomeMath';
import type { IncomeFormCardProps } from '../types';

/** ปุ่มลัดสำหรับกดบวกยอดเพิ่มทีละ 75 บาทอย่างรวดเร็วบนมือถือ */
const QUICK_AMOUNTS = [75, 150, 225, 300];

/** แท็กหมายเหตุที่ใช้บ่อยสำหรับกดเลือกได้ทันที */
const QUICK_NOTE_TAGS = ['OT', 'O1000'];

/**
 * ฟอร์มกรอกและแก้ไขรายได้พิเศษรายวัน รองรับสูตรบวก/ลบเลขแบบ Real-time Preview
 *
 * @param props พร็อพส์ควบคุมฟอร์มกรอกรายได้
 * @returns คอมโพเนนต์การ์ดฟอร์มกรอกรายได้
 */
export default function IncomeFormCard({
  selectedDate,
  existingEntry,
  onChangeDate,
  onSaveEntry,
  onDeleteEntry,
}: IncomeFormCardProps) {
  const [expression, setExpression] = useState('');
  const [note, setNote] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // เมื่อเปลี่ยนวันที่หรือข้อมูลเดิมเปลี่ยน ให้ดึงสูตรและหมายเหตุเดิมมาแสดงอัตโนมัติ
  useEffect(() => {
    setExpression(existingEntry?.expression ?? '');
    setNote(existingEntry?.note ?? '');
    setConfirmDelete(false);
  }, [selectedDate, existingEntry]);

  const parsed = parseIncomeExpression(expression);
  const todayStr = dayjs().format('YYYY-MM-DD');
  const isEditingExisting = Boolean(existingEntry);

  /** ต่อท้ายตัวเลขลงในช่องสูตรด้วยปุ่มลัด */
  const handleQuickAppend = (amount: number) => {
    setExpression((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return String(amount);
      if (/[+-]$/.test(trimmed)) return `${trimmed}${amount}`;
      return `${trimmed}+${amount}`;
    });
  };

  /** เติมเครื่องหมาย + ต่อท้ายเพื่อพิมพ์ยอดถัดไปได้ทันที */
  const handleAppendPlus = () => {
    setExpression((prev) => {
      const trimmed = prev.trim();
      if (!trimmed || /[+-]$/.test(trimmed)) return trimmed;
      return `${trimmed}+`;
    });
  };

  /** สลับเพิ่มหรือลบแท็กหมายเหตุ (เช่น OT, O1000) ในช่องหมายเหตุ */
  const handleToggleNoteTag = (tag: string) => {
    setNote((prev) => {
      const tokens = prev
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      const exists = tokens.includes(tag);
      const nextTokens = exists
        ? tokens.filter((item) => item !== tag)
        : [...tokens, tag];
      return nextTokens.join(' ');
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!parsed.isValid) return;

    onSaveEntry({
      date: selectedDate,
      expression: parsed.normalizedExpression,
      totalAmount: parsed.total,
      note: note.trim() ? note.trim() : undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDeleteEntry(selectedDate);
    setConfirmDelete(false);
  };

  return (
    <RainbowCard contentClassName="p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#4a2c3a] sm:text-lg">
              {isEditingExisting ? 'แก้ไขรายได้วันที่เลือก' : 'จดรายได้พิเศษ'}
            </h2>
            <p className="text-xs text-[#8a5d72]">
              พิมพ์ตัวเลขหรือสูตรบวก/ลบ เช่น <span className="font-semibold text-pink-600">100+200+300</span>
            </p>
          </div>
        </div>

        {selectedDate !== todayStr && (
          <button
            type="button"
            onClick={() => onChangeDate(todayStr)}
            className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700 transition hover:bg-pink-200"
          >
            กลับไปวันนี้
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* เลือกวันที่ */}
        <div>
          <label
            htmlFor="income-date-input"
            className="mb-1.5 flex items-center justify-between text-xs font-semibold text-[#6b4255]"
          >
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-pink-500" />
              วันที่บันทึก
            </span>
            <span className="font-normal text-pink-500">
              {formatThaiFullDate(selectedDate)}
            </span>
          </label>
          <input
            id="income-date-input"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) onChangeDate(e.target.value);
            }}
            className="w-full rounded-2xl border border-pink-200 bg-pink-50/40 px-3.5 py-2.5 text-sm font-medium text-[#4a2c3a] outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* ช่องกรอกสูตรบวกเลข */}
        <div>
          <label
            htmlFor="income-expression-input"
            className="mb-1.5 block text-xs font-semibold text-[#6b4255]"
          >
            ยอดรายได้ / สูตรบวกเลข (บาท)
          </label>
          <input
            id="income-expression-input"
            type="text"
            inputMode="decimal"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="เช่น 75+150+225 หรือ 100+200+300"
            className="w-full rounded-2xl border-2 border-pink-200 bg-white px-4 py-3 text-lg font-semibold tracking-wide text-[#4a2c3a] outline-none transition placeholder:text-sm placeholder:font-normal placeholder:text-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          />

          {/* ปุ่มลัดสำหรับบวกเลขไวๆ บนมือถือ */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleQuickAppend(amt)}
                className="rounded-xl border border-pink-200 bg-pink-50/70 px-2.5 py-1 text-xs font-semibold text-pink-700 transition hover:bg-pink-100 active:scale-95"
              >
                +{amt}
              </button>
            ))}
            <button
              type="button"
              onClick={handleAppendPlus}
              className="inline-flex items-center gap-0.5 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              เติม +
            </button>
          </div>
        </div>

        {/* แถบ Real-time Preview ผลรวม */}
        <div
          className={`rounded-2xl border px-4 py-3 transition-colors ${
            parsed.isValid
              ? 'border-emerald-200 bg-gradient-to-r from-[#FFF5F8] via-[#FFF9EC] to-[#EFFBF5]'
              : expression.trim()
                ? 'border-rose-200 bg-rose-50/70'
                : 'border-pink-100 bg-pink-50/40'
          }`}
        >
          {parsed.isValid ? (
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6b4255]">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  รวมเป็นเงิน ({parsed.items.length} รายการ):
                </div>
                <div className="text-xl font-bold text-pink-600">
                  {formatCurrency(parsed.total)}
                </div>
              </div>
              {parsed.wasTruncated && (
                <p className="text-[11px] font-medium text-amber-700">
                  คำนวณเฉพาะส่วนด้านหน้า:{' '}
                  <span className="font-bold">{parsed.normalizedExpression}</span>
                </p>
              )}
            </div>
          ) : (
            <p
              className={`text-xs font-medium ${
                expression.trim() ? 'text-rose-600' : 'text-[#8a5d72]'
              }`}
            >
              {expression.trim()
                ? parsed.errorMessage
                : 'ผลรวมแบบ Real-time จะแสดงตรงนี้ทันทีเมื่อเริ่มพิมพ์ตัวเลข ✨'}
            </p>
          )}
        </div>

        {/* ช่องหมายเหตุ */}
        <div>
          <label
            htmlFor="income-note-input"
            className="mb-1.5 block text-xs font-semibold text-[#6b4255]"
          >
            หมายเหตุ (ไม่บังคับ)
          </label>
          <input
            id="income-note-input"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น OT, O1000, งานฟรีแลนซ์, ทิปพิเศษ..."
            className="w-full rounded-2xl border border-pink-200 bg-pink-50/30 px-3.5 py-2.5 text-sm text-[#4a2c3a] outline-none transition placeholder:text-pink-300 focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200"
          />

          {/* แท็กหมายเหตุที่ใช้บ่อย */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {QUICK_NOTE_TAGS.map((tag) => {
              const isSelected = note
                .trim()
                .split(/\s+/)
                .includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleNoteTag(tag)}
                  className={`rounded-xl border px-3 py-1 text-xs font-semibold transition active:scale-95 ${
                    isSelected
                      ? 'border-pink-400 bg-pink-500 text-white shadow-2xs'
                      : 'border-pink-200 bg-pink-50/70 text-pink-700 hover:bg-pink-100'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* ปุ่มบันทึก / อัปเดต / ลบ */}
        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
          <button
            type="submit"
            disabled={!parsed.isValid}
            className="rainbow-btn-bg flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink-300/50 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {isEditingExisting ? 'อัปเดตข้อมูล' : 'บันทึกรายได้'}
          </button>

          {isEditingExisting && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className={`flex items-center justify-center gap-1.5 rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99] ${
                confirmDelete
                  ? 'border-rose-500 bg-rose-500 text-white hover:bg-rose-600'
                  : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              {confirmDelete ? 'กดอีกครั้งเพื่อยืนยันลบ' : 'ลบรายการวันนี้'}
            </button>
          )}
        </div>
      </form>
    </RainbowCard>
  );
}

