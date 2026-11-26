import type { ExpressionParseResult, ParsedExpressionItem } from '../types/income';

/**
 * แปลงและคำนวณสูตรบวก/ลบตัวเลขอย่างปลอดภัยโดยไม่ใช้ eval() หรือ new Function()
 * รองรับรูปแบบเช่น "500", "100+200+300", "150 + 50.5 - 20 + 300"
 * หากกรอกสูตรไม่ครบด้านท้าย เช่น "100+200+-" จะตัดเฉพาะสูตรด้านหน้าที่คำนวณได้มาคำนวณให้ทันที
 *
 * @param rawInput ข้อความสูตรหรือตัวเลขที่ผู้ใช้กรอก
 * @returns ผลลัพธ์การคำนวณ พร้อมสถานะความถูกต้องและรายการย่อยแต่ละตัว
 */
export function parseIncomeExpression(rawInput: string): ExpressionParseResult {
  const cleaned = rawInput.replace(/[\s,]/g, '');

  if (!cleaned) {
    return {
      isValid: false,
      total: 0,
      items: [],
      normalizedExpression: '',
      errorMessage: 'กรุณากรอกตัวเลขหรือสูตรบวกเลข เช่น 75+150+225',
    };
  }

  const items: ParsedExpressionItem[] = [];
  let index = 0;
  let wasTruncated = false;

  while (index < cleaned.length) {
    let operator: '+' | '-' = '+';

    if (items.length === 0) {
      if (cleaned[index] === '+' || cleaned[index] === '-') {
        operator = cleaned[index] as '+' | '-';
        index += 1;
      }
    } else {
      if (cleaned[index] !== '+' && cleaned[index] !== '-') {
        wasTruncated = true;
        break;
      }
      operator = cleaned[index] as '+' | '-';
      index += 1;
    }

    // ตรวจสอบว่ามีตัวเลขต่อท้ายเครื่องหมายหรือไม่ (รองรับทศนิยม เช่น 50.5 หรือ .5)
    const remaining = cleaned.slice(index);
    const numberMatch = /^(?:\d+(?:\.\d+)?|\.\d+)/.exec(remaining);

    if (!numberMatch) {
      wasTruncated = true;
      break;
    }

    const numberToken = numberMatch[0];
    const numericValue = Number(numberToken);
    if (!Number.isFinite(numericValue)) {
      wasTruncated = true;
      break;
    }

    items.push({
      operator,
      value: Math.round(numericValue * 100) / 100,
      raw: numberToken,
    });

    index += numberToken.length;
  }

  if (items.length === 0) {
    return {
      isValid: false,
      total: 0,
      items: [],
      normalizedExpression: '',
      errorMessage: 'ไม่พบตัวเลขที่คำนวณได้ กรุณากรอกตัวเลขเช่น 75+150',
    };
  }

  const normalizedExpression = items
    .map((item, idx) => {
      if (idx === 0 && item.operator === '+') return item.raw;
      return `${item.operator}${item.raw}`;
    })
    .join('');

  const rawTotal = items.reduce((acc, item) => {
    return item.operator === '+' ? acc + item.value : acc - item.value;
  }, 0);

  const roundedTotal = Math.round(rawTotal * 100) / 100;

  if (roundedTotal < 0) {
    return {
      isValid: false,
      total: roundedTotal,
      items,
      normalizedExpression,
      wasTruncated,
      errorMessage: 'ยอดรวมรายได้สุทธิไม่ควรติดลบนะเมี้ยว',
    };
  }

  return {
    isValid: true,
    total: roundedTotal,
    items,
    normalizedExpression,
    wasTruncated,
  };
}

/**
 * จัดรูปแบบจำนวนเงินเป็นสกุลเงินบาทพร้อมเครื่องหมายจุลภาค
 *
 * @param amount จำนวนเงิน (บาท)
 * @param showDecimals แสดงทศนิยม 2 ตำแหน่งเสมอหรือไม่ (ค่าเริ่มต้น true)
 * @returns ข้อความยอดเงิน เช่น "฿1,250.00"
 */
export function formatCurrency(amount: number, showDecimals = true): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `฿${safeAmount.toLocaleString('th-TH', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * จัดรูปแบบจำนวนเงินแบบกะทัดรัดสำหรับแสดงในช่องปฏิทินหรือแท่งกราฟ
 *
 * @param amount จำนวนเงิน (บาท)
 * @returns ข้อความยอดเงินแบบสั้น เช่น "฿600" หรือ "฿1.5k"
 */
export function formatCompactCurrency(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  if (safeAmount >= 100000) {
    return `฿${(safeAmount / 1000).toFixed(0)}k`;
  }
  if (safeAmount >= 10000) {
    return `฿${(safeAmount / 1000).toFixed(1)}k`;
  }
  const hasDecimal = Math.round(safeAmount * 100) % 100 !== 0;
  return `฿${safeAmount.toLocaleString('th-TH', {
    minimumFractionDigits: hasDecimal ? 1 : 0,
    maximumFractionDigits: 2,
  })}`;
}

