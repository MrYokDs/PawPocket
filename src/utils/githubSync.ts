import { Base64 } from 'js-base64';
import type { GitSyncConfig } from '../types/gitSync';
import type { IncomeMap } from '../types/income';
import { normalizeIncomeData } from './storage';

const GITHUB_API_BASE = 'https://api.github.com';

interface GitHubContentResponse {
  sha: string;
  content?: string;
  encoding?: string;
}

interface GitHubPutResponse {
  content?: {
    sha: string;
  };
  commit?: {
    html_url?: string;
  };
}

/**
 * ตรวจสอบความครบถ้วนของการตั้งค่า GitHub Sync ก่อนเรียก API
 *
 * @param config การตั้งค่า GitHub Sync
 */
function validateGitConfig(config: GitSyncConfig): void {
  if (!config.owner.trim() || !config.repo.trim()) {
    throw new Error('กรุณากรอกชื่อ Owner และชื่อ Repository ให้ครบถ้วน');
  }
  if (!config.branch.trim()) {
    throw new Error('กรุณาระบุชื่อ Branch เช่น main');
  }
  if (!config.filePath.trim()) {
    throw new Error('กรุณาระบุพาธไฟล์ เช่น data/incomes.json');
  }
  if (!config.token.trim()) {
    throw new Error('กรุณากรอก GitHub Personal Access Token ก่อนใช้งาน');
  }
}

/**
 * สร้าง URL สำหรับ GitHub Contents API โดยเข้ารหัสแต่ละส่วนของพาธอย่างถูกต้อง
 *
 * @param config การตั้งค่า GitHub Sync
 * @returns URL ปลายทางของ GitHub REST API
 */
function buildContentsUrl(config: GitSyncConfig): string {
  const cleanPath = config.filePath
    .trim()
    .replace(/^\/+/, '')
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${GITHUB_API_BASE}/repos/${encodeURIComponent(config.owner.trim())}/${encodeURIComponent(config.repo.trim())}/contents/${cleanPath}`;
}

/**
 * สร้าง URL สำหรับ GET พร้อมพารามิเตอร์ป้องกันแคชจากเบราว์เซอร์ (แก้ปัญหาได้ sha เก่าจนติด 409)
 *
 * @param config การตั้งค่า GitHub Sync
 * @returns URL สำหรับดึงข้อมูลล่าสุดจาก GitHub โดยไม่ติดแคช
 */
function buildFreshGetUrl(config: GitSyncConfig): string {
  const baseUrl = buildContentsUrl(config);
  const ref = encodeURIComponent(config.branch.trim());
  return `${baseUrl}?ref=${ref}&_t=${Date.now()}`;
}

/**
 * สร้าง HTTP Headers สำหรับเรียก GitHub REST API
 *
 * @param token GitHub Personal Access Token
 * @returns ออบเจ็กต์ Headers
 */
function buildHeaders(token: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token.trim()}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

/**
 * ดึงค่า sha ล่าสุดของไฟล์บน GitHub โดยไม่ใช้แคชของเบราว์เซอร์
 *
 * @param config การตั้งค่า GitHub Sync
 * @returns ค่า sha ล่าสุด หรือ undefined หากยังไม่มีไฟล์บน GitHub
 */
async function fetchLatestFileSha(config: GitSyncConfig): Promise<string | undefined> {
  const checkResponse = await fetch(buildFreshGetUrl(config), {
    method: 'GET',
    headers: buildHeaders(config.token),
    cache: 'no-store',
  });

  if (checkResponse.status === 404) {
    return undefined;
  }

  if (!checkResponse.ok) {
    throw new Error(await formatGitHubError(checkResponse));
  }

  const existingData = (await checkResponse.json()) as GitHubContentResponse;
  return existingData.sha;
}

/**
 * ดึงข้อมูลไฟล์รายได้ล่าสุดจาก GitHub Repository (Pull) โดยไม่ติดแคช
 * ใช้ js-base64 ถอดรหัสเพื่อรองรับภาษาไทย UTF-8 100%
 *
 * @param config การตั้งค่า GitHub Sync
 * @returns ข้อมูลรายได้และค่า sha ล่าสุดของไฟล์บน GitHub
 */
export async function pullIncomesFromGitHub(
  config: GitSyncConfig
): Promise<{ entries: IncomeMap; sha: string | null }> {
  validateGitConfig(config);

  const response = await fetch(buildFreshGetUrl(config), {
    method: 'GET',
    headers: buildHeaders(config.token),
    cache: 'no-store',
  });

  if (response.status === 404) {
    return { entries: {}, sha: null };
  }

  if (!response.ok) {
    throw new Error(await formatGitHubError(response));
  }

  const data = (await response.json()) as GitHubContentResponse;
  if (!data.content) {
    return { entries: {}, sha: data.sha };
  }

  // ลบอักขระขึ้นบรรทัดใหม่ที่ GitHub API แทรกใน Base64 ก่อนถอดรหัสด้วย js-base64
  const cleanBase64 = data.content.replace(/\n/g, '');
  const decodedJsonText = Base64.decode(cleanBase64);
  const parsed = JSON.parse(decodedJsonText) as unknown;

  return {
    entries: normalizeIncomeData(parsed),
    sha: data.sha,
  };
}

/**
 * บันทึกข้อมูลรายได้ทั้งหมดขึ้น GitHub Repository (Push)
 * ดึง sha สดใหม่ทุกครั้งโดยไม่ใช้แคช และลองใหม่อัตโนมัติ 1 ครั้งหากชน 409
 * ใช้ js-base64 เข้ารหัสเพื่อรองรับภาษาไทย UTF-8 100%
 *
 * @param config การตั้งค่า GitHub Sync
 * @param entries พจนานุกรมข้อมูลรายได้ทั้งหมด
 * @returns ค่า sha ใหม่และลิงก์ commit บน GitHub
 */
export async function pushIncomesToGitHub(
  config: GitSyncConfig,
  entries: IncomeMap
): Promise<{ sha: string; commitUrl?: string }> {
  validateGitConfig(config);

  const url = buildContentsUrl(config);
  const headers = buildHeaders(config.token);

  const payload = {
    app: 'PawPocket',
    updatedAt: new Date().toISOString(),
    entries,
  };
  const jsonString = JSON.stringify(payload, null, 2);
  const encodedContent = Base64.encode(jsonString);

  // ลองส่งสูงสุด 2 รอบ (หากรอบแรกชน 409 จากจังหวะอัปเดตของ GitHub จะดึง sha ล่าสุดแล้วลองใหม่ทันที)
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const existingSha = await fetchLatestFileSha(config);

    const body: Record<string, string> = {
      message: `อัปเดตข้อมูลรายได้ PawPocket (${Object.keys(entries).length} วัน)`,
      content: encodedContent,
      branch: config.branch.trim(),
    };

    if (existingSha) {
      body.sha = existingSha;
    }

    const putResponse = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (putResponse.ok) {
      const result = (await putResponse.json()) as GitHubPutResponse;
      return {
        sha: result.content?.sha ?? '',
        commitUrl: result.commit?.html_url,
      };
    }

    if (putResponse.status === 409 && attempt === 0) {
      continue;
    }

    throw new Error(await formatGitHubError(putResponse));
  }

  throw new Error('ไฟล์บน GitHub มีการเปลี่ยนแปลง กรุณาลองกดซิงค์ใหม่อีกครั้ง');
}

/**
 * แปลงข้อความ Error จาก GitHub API ให้เป็นภาษาไทยที่เข้าใจง่าย
 *
 * @param response ออบเจ็กต์ Response ที่เกิดข้อผิดพลาด
 * @returns ข้อความแจ้งเตือนภาษาไทย
 */
async function formatGitHubError(response: Response): Promise<string> {
  if (response.status === 401) {
    return 'Token ไม่ถูกต้องหรือหมดอายุ กรุณาตรวจสอบ Personal Access Token';
  }
  if (response.status === 403) {
    return 'ไม่มีสิทธิ์เข้าถึง Repository นี้ กรุณาตรวจสอบสิทธิ์ Contents (Read & Write) ของ Token';
  }
  if (response.status === 404) {
    return 'ไม่พบ Repository หรือ Branch ที่ระบุ กรุณาตรวจสอบชื่ออีกครั้ง';
  }
  if (response.status === 409) {
    return 'ไฟล์บน GitHub มีการเปลี่ยนแปลง กรุณาลองกดซิงค์ใหม่อีกครั้ง';
  }

  try {
    const data = (await response.json()) as { message?: string };
    return data.message
      ? `GitHub API ผิดพลาด (${response.status}): ${data.message}`
      : `GitHub API ผิดพลาด (${response.status})`;
  } catch {
    return `GitHub API ผิดพลาด (${response.status})`;
  }
}
