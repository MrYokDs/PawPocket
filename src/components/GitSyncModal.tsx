import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  CloudDownload,
  CloudUpload,
  Download,
  Eye,
  EyeOff,
  Github,
  Loader2,
  ShieldCheck,
  Upload,
  X,
  AlertCircle,
} from 'lucide-react';
import type { GitSyncConfig, SyncStatus } from '../types/gitSync';

interface GitSyncModalProps {
  /** เปิดแสดง Modal อยู่หรือไม่ */
  isOpen: boolean;
  /** ปิด Modal */
  onClose: () => void;
  /** การตั้งค่า GitHub Sync ปัจจุบัน */
  config: GitSyncConfig;
  /** สถานะการซิงค์ล่าสุด */
  syncStatus: SyncStatus;
  /** บันทึกการตั้งค่าลง LocalStorage */
  onSaveConfig: (nextConfig: GitSyncConfig) => void;
  /** ดึงข้อมูลจาก GitHub (Pull) */
  onPullFromGit: (configToUse: GitSyncConfig) => Promise<void>;
  /** ส่งข้อมูลขึ้น GitHub (Push) */
  onPushToGit: (configToUse: GitSyncConfig) => Promise<void>;
  /** ส่งออกไฟล์ JSON */
  onExportJson: () => void;
  /** นำเข้าไฟล์ JSON */
  onImportJson: (file: File) => Promise<void>;
}

/**
 * หน้าต่าง Modal สำหรับตั้งค่าการซิงค์ข้อมูลขึ้น GitHub และสำรองข้อมูล JSON
 *
 * @param props พร็อพส์ควบคุมการทำงานของ GitSyncModal
 * @returns คอมโพเนนต์ Modal ตั้งค่า GitHub Sync
 */
export default function GitSyncModal({
  isOpen,
  onClose,
  config,
  syncStatus,
  onSaveConfig,
  onPullFromGit,
  onPushToGit,
  onExportJson,
  onImportJson,
}: GitSyncModalProps) {
  const [formState, setFormState] = useState<GitSyncConfig>(config);
  const [showToken, setShowToken] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormState(config);
      setSavedNotice(false);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const isBusy = syncStatus.state === 'syncing';

  const handleFieldChange = <K extends keyof GitSyncConfig>(
    key: K,
    value: GitSyncConfig[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
    setSavedNotice(false);
  };

  const handleSave = () => {
    onSaveConfig(formState);
    setSavedNotice(true);
  };

  const handlePull = async () => {
    onSaveConfig(formState);
    await onPullFromGit(formState);
  };

  const handlePush = async () => {
    onSaveConfig(formState);
    await onPushToGit(formState);
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await onImportJson(file);
    event.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-pink-950/35 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="git-sync-modal-title"
    >
      <div className="rainbow-border-gradient max-h-[92vh] w-full max-w-lg overflow-hidden rounded-[28px] p-[2px] shadow-2xl">
        <div className="flex max-h-[calc(92vh-4px)] flex-col overflow-y-auto rounded-[26px] bg-white p-5 sm:p-6">
          {/* ส่วนหัว Modal */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-sm">
                <Github className="h-5 w-5" />
              </div>
              <div>
                <h2
                  id="git-sync-modal-title"
                  className="text-lg font-bold text-[#4a2c3a]"
                >
                  ซิงค์ข้อมูล GitHub & สำรองไฟล์
                </h2>
                <p className="text-xs text-pink-600/80">
                  เก็บข้อมูลรายได้ไว้บน GitHub ส่วนตัว รองรับภาษาไทย 100%
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-pink-400 transition hover:bg-pink-50 hover:text-pink-600"
              aria-label="ปิดหน้าต่าง"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* แถบแจ้งเตือนความปลอดภัย */}
          <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-2.5 text-xs text-emerald-800">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <p>
              Personal Access Token จะถูกเก็บไว้เฉพาะใน{' '}
              <span className="font-semibold">LocalStorage</span>{' '}
              ของเบราว์เซอร์เครื่องนี้เท่านั้น ไม่มีการส่งไปยังเซิร์ฟเวอร์อื่นนอกจาก GitHub API โดยตรง
            </p>
          </div>

          {/* ฟอร์มตั้งค่า GitHub */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#6b4255]">
                  GitHub Owner (Username)
                </label>
                <input
                  type="text"
                  value={formState.owner}
                  onChange={(e) => handleFieldChange('owner', e.target.value)}
                  placeholder="เช่น your-username"
                  className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-3 py-2 text-sm text-[#4a2c3a] outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#6b4255]">
                  Repository Name
                </label>
                <input
                  type="text"
                  value={formState.repo}
                  onChange={(e) => handleFieldChange('repo', e.target.value)}
                  placeholder="เช่น meow-income-data"
                  className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-3 py-2 text-sm text-[#4a2c3a] outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#6b4255]">
                  Branch
                </label>
                <input
                  type="text"
                  value={formState.branch}
                  onChange={(e) => handleFieldChange('branch', e.target.value)}
                  placeholder="main"
                  className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-3 py-2 text-sm text-[#4a2c3a] outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#6b4255]">
                  File Path
                </label>
                <input
                  type="text"
                  value={formState.filePath}
                  onChange={(e) => handleFieldChange('filePath', e.target.value)}
                  placeholder="data/incomes.json"
                  className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-3 py-2 text-sm text-[#4a2c3a] outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#6b4255]">
                Personal Access Token (สิทธิ์ Contents: Read & Write)
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={formState.token}
                  onChange={(e) => handleFieldChange('token', e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx หรือ github_pat_xxxx"
                  className="w-full rounded-xl border border-pink-200 bg-pink-50/30 py-2 pr-10 pl-3 text-sm text-[#4a2c3a] outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200"
                />
                <button
                  type="button"
                  onClick={() => setShowToken((prev) => !prev)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1 text-pink-400 hover:bg-pink-100 hover:text-pink-600"
                  aria-label={showToken ? 'ซ่อน Token' : 'แสดง Token'}
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* สวิตช์ Auto-Sync */}
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-pink-100 bg-pink-50/40 px-3.5 py-2.5">
              <div>
                <span className="block text-sm font-semibold text-[#4a2c3a]">
                  Auto-Sync หลังบันทึก/ลบข้อมูล
                </span>
                <span className="text-xs text-[#8a5d72]">
                  ส่งข้อมูลขึ้น GitHub อัตโนมัติทุกครั้งที่แก้ไขรายได้
                </span>
              </div>
              <input
                type="checkbox"
                checked={formState.autoSync}
                onChange={(e) => handleFieldChange('autoSync', e.target.checked)}
                className="h-5 w-5 accent-pink-500"
              />
            </label>
          </div>

          {/* แสดงสถานะการซิงค์ */}
          {(syncStatus.message || savedNotice) && (
            <div
              className={`mt-4 flex items-start gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-medium ${
                syncStatus.state === 'error'
                  ? 'border border-rose-200 bg-rose-50 text-rose-700'
                  : syncStatus.state === 'syncing'
                    ? 'border border-amber-200 bg-amber-50 text-amber-800'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {syncStatus.state === 'syncing' && (
                <Loader2 className="mt-0.5 h-4 w-4 flex-shrink-0 animate-spin" />
              )}
              {syncStatus.state === 'error' && (
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              )}
              {(syncStatus.state === 'success' || savedNotice) &&
                syncStatus.state !== 'syncing' &&
                syncStatus.state !== 'error' && (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                )}
              <span>
                {savedNotice && !syncStatus.message
                  ? 'บันทึกการตั้งค่า GitHub Sync เรียบร้อยแล้ว'
                  : syncStatus.message}
              </span>
            </div>
          )}

          {/* ปุ่มดำเนินการ GitHub Sync */}
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isBusy}
              className="rounded-xl border border-pink-200 bg-pink-50 px-3 py-2.5 text-sm font-semibold text-pink-700 transition hover:bg-pink-100 disabled:opacity-60"
            >
              บันทึกตั้งค่า
            </button>
            <button
              type="button"
              onClick={handlePull}
              disabled={isBusy}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-60"
            >
              <CloudDownload className="h-4 w-4" />
              ดึงข้อมูล (Pull)
            </button>
            <button
              type="button"
              onClick={handlePush}
              disabled={isBusy}
              className="rainbow-btn-bg flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60"
            >
              <CloudUpload className="h-4 w-4" />
              ส่งขึ้น Git (Push)
            </button>
          </div>

          {/* เส้นคั่นส่วน Export / Import JSON */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-pink-100" />
            <span className="text-xs font-medium text-pink-400">
              หรือสำรองข้อมูลแบบไฟล์ JSON
            </span>
            <div className="h-px flex-1 bg-pink-100" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onExportJson}
              className="flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-white px-3 py-2.5 text-sm font-semibold text-[#6b4255] transition hover:border-pink-300 hover:bg-pink-50"
            >
              <Download className="h-4 w-4 text-pink-500" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-white px-3 py-2.5 text-sm font-semibold text-[#6b4255] transition hover:border-pink-300 hover:bg-pink-50"
            >
              <Upload className="h-4 w-4 text-pink-500" />
              Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileSelected}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

