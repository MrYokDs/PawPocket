import { formatCurrency } from '../utils/expressionParser';

export type CatMood = 'pleading' | 'happy' | 'starry';

interface CatMascotProps {
  /** ยอดรวมรายได้ของวันที่เลือก */
  selectedAmount: number;
  /** มีรายการบันทึกในวันที่เลือกแล้วหรือไม่ */
  hasEntry: boolean;
  /** ค่าเฉลี่ยรายได้ต่อวันในเดือนที่ดูอยู่ */
  monthlyAverage: number;
  /** ชื่อวันที่เลือกแบบภาษาไทย */
  selectedDateLabel: string;
}

/**
 * คำนวณอารมณ์และคำพูดของน้องแมวตามยอดรายได้ของวันที่เลือก
 *
 * @param selectedAmount ยอดรายได้ของวันที่เลือก
 * @param hasEntry มีข้อมูลของวันที่เลือกแล้วหรือไม่
 * @param monthlyAverage ค่าเฉลี่ยต่อวันในเดือนนั้น
 * @returns อารมณ์และข้อความในกล่องคำพูด
 */
function resolveCatState(
  selectedAmount: number,
  hasEntry: boolean,
  monthlyAverage: number
): { mood: CatMood; title: string; message: string } {
  if (!hasEntry || selectedAmount <= 0) {
    return {
      mood: 'pleading',
      title: 'เมี้ยว~ รอจดอยู่น้า',
      message: 'วันนี้ยังไม่ได้บันทึกรายได้พิเศษเลย ลองพิมพ์สูตรเช่น 100+200+300 ดูสิ!',
    };
  }

  if (monthlyAverage > 0 && selectedAmount > monthlyAverage) {
    return {
      mood: 'starry',
      title: 'ปังทะลุสายรุ้ง! ✨🌈',
      message: `ว้าววว! ได้ตั้ง ${formatCurrency(selectedAmount)} สูงกว่าค่าเฉลี่ยเดือนนี้ (${formatCurrency(monthlyAverage)}) เก่งสุดๆ ไปเลยเมี้ยว!`,
    };
  }

  return {
    mood: 'happy',
    title: 'เก่งมากเลยเมี้ยว! 💖',
    message: `จดรายได้ ${formatCurrency(selectedAmount)} เรียบร้อยแล้ว ขยันแบบนี้ขอให้เงินไหลมาเทมาน้า~`,
  };
}

/**
 * ตัวการ์ตูนน้องแมว SVG สไตล์ Kawaii พร้อมแอนิเมชันหูกระดิก/หางแกว่งและกล่องคำพูด
 *
 * @param props ข้อมูลรายได้เพื่อกำหนดสีหน้าและคำพูดของน้องแมว
 * @returns คอมโพเนนต์น้องแมวพร้อมกล่องคำพูด
 */
export default function CatMascot({
  selectedAmount,
  hasEntry,
  monthlyAverage,
  selectedDateLabel,
}: CatMascotProps) {
  const { mood, title, message } = resolveCatState(
    selectedAmount,
    hasEntry,
    monthlyAverage
  );

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
      {/* ตัวน้องแมว SVG */}
      <div className="relative flex-shrink-0">
        <svg
          viewBox="0 0 160 150"
          className="animate-cat-float h-28 w-28 drop-shadow-sm sm:h-32 sm:w-32"
          role="img"
          aria-label="น้องแมว PawPocket"
        >
          {/* สายรุ้งด้านหลังเมื่อได้เยอะกว่าค่าเฉลี่ย */}
          {mood === 'starry' && (
            <g opacity="0.9">
              <path
                d="M 16 112 A 64 64 0 0 1 144 112"
                fill="none"
                stroke="#FF9AA2"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 24 112 A 56 56 0 0 1 136 112"
                fill="none"
                stroke="#FFDAC1"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 32 112 A 48 48 0 0 1 128 112"
                fill="none"
                stroke="#B5EAD7"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 40 112 A 40 40 0 0 1 120 112"
                fill="none"
                stroke="#C7CEEA"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* หางน้องแมวแกว่งไปมา */}
          <g className="animate-tail-wag">
            <path
              d="M 118 116 C 142 114, 148 92, 136 82 C 129 76, 122 83, 126 90 C 131 98, 126 105, 114 107"
              fill="#FFF5F8"
              stroke="#FF8FAB"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>

          {/* ลำตัวกลมๆ น่ารัก */}
          <ellipse
            cx="80"
            cy="115"
            rx="38"
            ry="26"
            fill="#FFFFFF"
            stroke="#FF8FAB"
            strokeWidth="4"
          />

          {/* พุงสีชมพูอ่อน */}
          <ellipse cx="80" cy="119" rx="22" ry="15" fill="#FFF0F5" />

          {/* หูซ้ายกระดิก */}
          <g className="animate-ear-left">
            <path
              d="M 43 60 L 36 26 L 66 42 Z"
              fill="#FFFFFF"
              stroke="#FF8FAB"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d="M 46 53 L 43 35 L 59 44 Z" fill="#FFB7C5" />
          </g>

          {/* หูขวากระดิก */}
          <g className="animate-ear-right">
            <path
              d="M 117 60 L 124 26 L 94 42 Z"
              fill="#FFFFFF"
              stroke="#FF8FAB"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d="M 114 53 L 117 35 L 101 44 Z" fill="#FFB7C5" />
          </g>

          {/* หัวแมว */}
          <ellipse
            cx="80"
            cy="74"
            rx="42"
            ry="34"
            fill="#FFFFFF"
            stroke="#FF8FAB"
            strokeWidth="4"
          />

          {/* ลายหน้าผาก */}
          <path
            d="M 73 43 L 73 51 M 80 41 L 80 52 M 87 43 L 87 51"
            stroke="#FFB7C5"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* แก้มชมพู */}
          <ellipse cx="52" cy="81" rx="7.5" ry="4.5" fill="#FF9AA2" opacity="0.55" />
          <ellipse cx="108" cy="81" rx="7.5" ry="4.5" fill="#FF9AA2" opacity="0.55" />

          {/* ดวงตาตามอารมณ์ */}
          {mood === 'pleading' && (
            <g>
              <circle cx="63" cy="72" r="6.5" fill="#4A2C3A" />
              <circle cx="65" cy="70" r="2.3" fill="#FFFFFF" />
              <circle cx="61" cy="74.5" r="1.2" fill="#FFFFFF" />

              <circle cx="97" cy="72" r="6.5" fill="#4A2C3A" />
              <circle cx="99" cy="70" r="2.3" fill="#FFFFFF" />
              <circle cx="95" cy="74.5" r="1.2" fill="#FFFFFF" />
            </g>
          )}

          {mood === 'happy' && (
            <g>
              <path
                d="M 56 74 Q 63 65 70 74"
                fill="none"
                stroke="#4A2C3A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 90 74 Q 97 65 104 74"
                fill="none"
                stroke="#4A2C3A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {mood === 'starry' && (
            <g>
              <circle cx="63" cy="72" r="7" fill="#4A2C3A" />
              <path
                d="M 63 67 L 64.5 70.5 L 68 72 L 64.5 73.5 L 63 77 L 61.5 73.5 L 58 72 L 61.5 70.5 Z"
                fill="#FFE066"
              />
              <circle cx="97" cy="72" r="7" fill="#4A2C3A" />
              <path
                d="M 97 67 L 98.5 70.5 L 102 72 L 98.5 73.5 L 97 77 L 95.5 73.5 L 92 72 L 95.5 70.5 Z"
                fill="#FFE066"
              />
            </g>
          )}

          {/* จมูกและปากแมว (w) */}
          <polygon points="77,78 83,78 80,82" fill="#FF6B9D" />
          <path
            d="M 73 84 Q 76.5 89 80 83 Q 83.5 89 87 84"
            fill="none"
            stroke="#4A2C3A"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* หนวดแมว */}
          <path
            d="M 30 74 L 44 76 M 29 82 L 44 82 M 130 74 L 116 76 M 131 82 L 116 82"
            stroke="#FF8FAB"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* อุ้งเท้าหน้า */}
          <ellipse
            cx="64"
            cy="127"
            rx="9"
            ry="6.5"
            fill="#FFFFFF"
            stroke="#FF8FAB"
            strokeWidth="3"
          />
          <ellipse
            cx="96"
            cy="127"
            rx="9"
            ry="6.5"
            fill="#FFFFFF"
            stroke="#FF8FAB"
            strokeWidth="3"
          />

          {/* ปลอกคอและกระดิ่งสีทอง */}
          <path
            d="M 58 103 Q 80 111 102 103"
            fill="none"
            stroke="#FF6B9D"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="80" cy="110" r="5" fill="#FFD166" stroke="#E89F24" strokeWidth="1.5" />

          {/* เอฟเฟกต์หัวใจ/ประกายดาวลอย */}
          {mood === 'happy' && (
            <path
              className="animate-sparkle"
              d="M 134 36 C 134 31, 141 31, 141 36 C 141 31, 148 31, 148 36 C 148 42, 141 47, 141 47 C 141 47, 134 42, 134 36 Z"
              fill="#FF6B9D"
            />
          )}
          {mood === 'starry' && (
            <g className="animate-sparkle">
              <path
                d="M 22 30 L 24.5 36.5 L 31 39 L 24.5 41.5 L 22 48 L 19.5 41.5 L 13 39 L 19.5 36.5 Z"
                fill="#FFD166"
              />
              <path
                d="M 138 24 L 140 29 L 145 31 L 140 33 L 138 38 L 136 33 L 131 31 L 136 29 Z"
                fill="#FF6B9D"
              />
            </g>
          )}
        </svg>
      </div>

      {/* กล่องคำพูดน้องแมว */}
      <div className="relative flex-1 rounded-2xl border border-pink-200/80 bg-gradient-to-br from-white via-[#FFF7FA] to-[#FFF9F2] px-4 py-3.5 shadow-sm">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <span className="font-cute text-base font-bold text-pink-600">{title}</span>
          <span className="rounded-full bg-pink-100/80 px-2.5 py-0.5 text-xs font-medium text-pink-700">
            {selectedDateLabel}
          </span>
        </div>
        <p className="font-cute text-sm leading-relaxed text-[#6b4255] sm:text-[15px]">
          {message}
        </p>
      </div>
    </div>
  );
}

