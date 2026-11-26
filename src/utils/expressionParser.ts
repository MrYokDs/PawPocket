import type { ExpressionParseResult, ParsedExpressionItem } from '../types/income';

/**
 * แปลงและคำนวณสูตรบวก/ลบตัวเลขอย่างปลอดภัยโดยไม่ใช้ eval() หรือ new Function()
 * รองรับรูปแบบเช่น "500", "100+200+300", "150 + 50.5 - 20 + 300"
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
      errorMessage: 'กรุณากรอกตัวเลขหรือสูตรบวกเลข เช่น 100+200+300',
    };
  }

  // อนุญาตเฉพาะตัวเลข จุดทศนิยม และเครื่องหมาย + / -
  if (!/^[0-9+\-.]+$/.test(cleaned)) {
    return {
      isValid: false,
      total: 0,
      items: [],
      normalizedExpression: cleaned,
      errorMessage: 'ใช้ได้เฉพาะตัวเลข, จุดทศนิยม และเครื่องหมาย + หรือ - เท่านั้นนะเมี้ยว',
    };
  }

  // ห้ามลงท้ายด้วยเครื่องหมาย + หรือ - หรือจุด
  if (/[+\-.]$/.test(cleaned)) {
    return {
      isValid: false,
      total: 0,
      items: [],
      normalizedExpression: cleaned,
      errorMessage: 'สูตรยังไม่สมบูรณ์ กรุณากรอกตัวเลขต่อท้ายให้ครบ',
    };
  }

  // ห้ามมีเครื่องหมายติดกัน เช่น ++, --, +-, -+
  if (/[+-]{2,}/.test(cleaned)) {
    return {
      isValid: false,
      total: 0,
      items: [],
      normalizedExpression: cleaned,
      errorMessage: 'พบเครื่องหมายบวกหรือลบติดกัน กรุณาตรวจสอบอีกครั้ง',
    };
  }

  const items: ParsedExpressionItem[] = [];
  let index = 0;

  while (index < cleaned.length) {
    let operator: '+' | '-' = '+';

    if (cleaned[index] === '+' || cleaned[index] === '-') {
      operator = cleaned[index] as '+' | '-';
      index += 1;
    }

    let numberToken = '';
    while (index < cleaned.length && cleaned[index] !== '+' && cleaned[index] !== '-') {
      numberToken += cleaned[index];
      index += 1;
    }

    // ตรวจสอบรูปแบบตัวเลข เช่น 100, 50.5, .5 (ห้ามมีจุดหลายจุดหรือเป็นจุดเปล่า)
    if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(numberToken)) {
      return {
        isValid: false,
        total: 0,
        items: [],
        normalizedExpression: cleaned,
        errorMessage: `รูปแบบตัวเลข "${numberToken}" ไม่ถูกต้อง`,
      };
    }

    const numericValue = Number(numberToken);
    if (!Number.isFinite(numericValue)) {
      return {
        isValid: false,
        total: 0,
        items: [],
        normalizedExpression: cleaned,
        errorMessage: 'ตัวเลขมีค่ามากเกินไป',
      };
    }

    items.push({
      operator,
      value: Math.round(numericValue * 100) / 100,
      raw: numberToken,
    });
  }

  if (items.length === 0) {
    return {
      isValid: false,
      total: 0,
      items: [],
      normalizedExpression: cleaned,
      errorMessage: 'ไม่พบตัวเลขในสูตร',
    };
  }

  const rawTotal = items.reduce((acc, item) => {
    return item.operator === '+' ? acc + item.value : acc - item.value;
  }, 0);

  const roundedTotal = Math.round(rawTotal * 100) / 100;

  if (roundedTotal < 0) {
    return {
      isValid: false,
      total: roundedTotal,
      items,
      normalizedExpression: cleaned,
      errorMessage: 'ยอดรวมรายได้สุทธิไม่ควรติดลบนะเมี้ยว',
    };
  }

  return {
    isValid: true,
    total: roundedTotal,
    items,
    normalizedExpression: cleaned,
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

