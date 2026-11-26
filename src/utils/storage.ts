import dayjs from 'dayjs';
import type { GitSyncConfig } from '../types/gitSync';
import type { IncomeEntry, IncomeMap } from '../types/income';
import { parseIncomeExpression } from './expressionParser';

const INCOMES_STORAGE_KEY = 'meow_income_entries_v1';
const GIT_SYNC_CONFIG_KEY = 'meow_income_git_config_v1';

/** ค่าเริ่มต้นของการตั้งค่า GitHub Sync */
export const DEFAULT_GIT_SYNC_CONFIG: GitSyncConfig = {
  owner: '',
  repo: '',
  branch: 'main',
  filePath: 'data/incomes.json',
  token: '',
  autoSync: false,
};

/**
 * โหลดข้อมูลรายได้ทั้งหมดจาก LocalStorage
 *
 * @returns พจนานุกรมข้อมูลรายได้ทั้งหมด
 */
export function loadIncomeEntries(): IncomeMap {
  try {
    const raw = localStorage.getItem(INCOMES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return normalizeIncomeData(parsed);
  } catch {
    return {};
  }
}

/**
 * บันทึกข้อมูลรายได้ทั้งหมดลง LocalStorage
 *
 * @param entries พจนานุกรมข้อมูลรายได้ทั้งหมด
 */
export function saveIncomeEntries(entries: IncomeMap): void {
  localStorage.setItem(INCOMES_STORAGE_KEY, JSON.stringify(entries));
}

/**
 * โหลดการตั้งค่า GitHub Sync จาก LocalStorage
 *
 * @returns ออบเจ็กต์การตั้งค่า GitHub Sync
 */
export function loadGitSyncConfig(): GitSyncConfig {
  try {
    const raw = localStorage.getItem(GIT_SYNC_CONFIG_KEY);
    if (!raw) return { ...DEFAULT_GIT_SYNC_CONFIG };
    const parsed = JSON.parse(raw) as Partial<GitSyncConfig>;
    return {
      ...DEFAULT_GIT_SYNC_CONFIG,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_GIT_SYNC_CONFIG };
  }
}

/**
 * บันทึกการตั้งค่า GitHub Sync ลง LocalStorage (เก็บ Token เฉพาะในเครื่องผู้ใช้)
 *
 * @param config การตั้งค่า GitHub Sync
 */
export function saveGitSyncConfig(config: GitSyncConfig): void {
  localStorage.setItem(GIT_SYNC_CONFIG_KEY, JSON.stringify(config));
}

/**
 * ตรวจสอบและจัดรูปข้อมูลรายได้จาก JSON ให้เป็น IncomeMap ที่ปลอดภัย
 *
 * @param rawData ข้อมูลดิบที่ได้จากการ parse JSON
 * @returns พจนานุกรมข้อมูลรายได้ในรูปแบบ IncomeMap
 */
export function normalizeIncomeData(rawData: unknown): IncomeMap {
  const result: IncomeMap = {};
  if (!rawData || typeof rawData !== 'object') return result;

  // รองรับทั้งรูปแบบ { entries: {...} }, IncomeMap โดยตรง, และ Array ของ IncomeEntry
  const source =
    'entries' in rawData &&
    typeof (rawData as { entries: unknown }).entries === 'object' &&
    (rawData as { entries: unknown }).entries !== null
      ? (rawData as { entries: unknown }).entries
      : rawData;

  const list: unknown[] = Array.isArray(source)
    ? source
    : Object.values(source as Record<string, unknown>);

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const candidate = item as Partial<IncomeEntry>;
    if (!candidate.date || !/^\d{4}-\d{2}-\d{2}$/.test(candidate.date)) continue;

    const expression =
      typeof candidate.expression === 'string' && candidate.expression.trim()
        ? candidate.expression.trim()
        : typeof candidate.totalAmount === 'number'
          ? String(candidate.totalAmount)
          : '';

    const parsedExpr = parseIncomeExpression(expression);
    const totalAmount = parsedExpr.isValid
      ? parsedExpr.total
      : typeof candidate.totalAmount === 'number' && Number.isFinite(candidate.totalAmount)
        ? Math.round(candidate.totalAmount * 100) / 100
        : 0;

    result[candidate.date] = {
      date: candidate.date,
      expression: expression || String(totalAmount),
      totalAmount,
      note: typeof candidate.note === 'string' ? candidate.note : undefined,
      updatedAt:
        typeof candidate.updatedAt === 'string'
          ? candidate.updatedAt
          : new Date().toISOString(),
    };
  }

  return result;
}

/**
 * ส่งออกข้อมูลรายได้ทั้งหมดเป็นไฟล์ JSON ดาวน์โหลดลงเครื่อง
 *
 * @param entries พจนานุกรมข้อมูลรายได้ทั้งหมด
 */
export function exportIncomesToJsonFile(entries: IncomeMap): void {
  const payload = {
    app: 'MeowIncome',
    exportedAt: new Date().toISOString(),
    entries,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `meow-income-backup-${dayjs().format('YYYY-MM-DD')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * อ่านและตรวจสอบข้อมูลจากข้อความ JSON ที่ผู้ใช้ต้องการนำเข้า
 *
 * @param rawText ข้อความ JSON จากไฟล์ที่อัปโหลด
 * @returns พจนานุกรมข้อมูลรายได้ทั้งหมด
 */
export function parseImportedIncomesJson(rawText: string): IncomeMap {
  const parsed = JSON.parse(rawText) as unknown;
  const normalized = normalizeIncomeData(parsed);
  if (Object.keys(normalized).length === 0) {
    throw new Error('ไม่พบข้อมูลรายได้ที่ถูกต้องในไฟล์ JSON นี้');
  }
  return normalized;
}

