/** Route: / */
import { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  CheckCircle2,
  Cloud,
  CloudOff,
  Heart,
  Loader2,
  PawPrint,
  Sparkles,
} from 'lucide-react';
import CatMascot from '../../components/CatMascot';
import GitSyncModal from '../../components/GitSyncModal';
import RainbowCard from '../../components/RainbowCard';
import type { GitSyncConfig, SyncStatus } from '../../types/gitSync';
import type { IncomeEntry, IncomeMap } from '../../types/income';
import { pullIncomesFromGitHub, pushIncomesToGitHub } from '../../utils/githubSync';
import {
  calculateMonthlySummary,
  calculateOverallSummary,
  formatThaiFullDate,
} from '../../utils/incomeMath';
import {
  exportIncomesToJsonFile,
  loadGitSyncConfig,
  loadIncomeEntries,
  parseImportedIncomesJson,
  saveGitSyncConfig,
  saveIncomeEntries,
} from '../../utils/storage';
import IncomeCalendar from './sections/IncomeCalendar';
import IncomeFormCard from './sections/IncomeFormCard';
import MonthlyChartSection from './sections/MonthlyChartSection';
import SummaryCards from './sections/SummaryCards';

/**
 * หน้าแดชบอร์ดหลักของ PawPocket รวมระบบกรอกสูตรรายได้ ปฏิทิน กราฟสีรุ้ง และ GitHub Sync
 *
 * @returns คอมโพเนนต์หน้า Dashboard หลัก
 */
export default function Dashboard() {
  const todayStr = dayjs().format('YYYY-MM-DD');

  const [entries, setEntries] = useState<IncomeMap>(() => loadIncomeEntries());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(
    todayStr.slice(0, 7)
  );
  const [gitConfig, setGitConfig] = useState<GitSyncConfig>(() =>
    loadGitSyncConfig()
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    state: 'idle',
    message: '',
  });
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /** แสดงแถบแจ้งเตือนสั้นๆ ด้านบนหน้าจอ */
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  }, []);

  /** คำนวณสรุปรายเดือนและสรุปโดยรวมแบบ Memoized */
  const monthlySummary = useMemo(
    () => calculateMonthlySummary(entries, currentMonthKey),
    [entries, currentMonthKey]
  );

  const overallSummary = useMemo(
    () => calculateOverallSummary(entries),
    [entries]
  );

  const selectedEntry = entries[selectedDate];

  /** ส่งข้อมูลขึ้น GitHub (Push) */
  const handlePushToGit = useCallback(
    async (configToUse: GitSyncConfig, entriesToPush?: IncomeMap) => {
      const targetEntries = entriesToPush ?? entries;
      setSyncStatus({
        state: 'syncing',
        message: 'กำลังบันทึกข้อมูลขึ้น GitHub...',
      });
      try {
        await pushIncomesToGitHub(configToUse, targetEntries);
        const nowIso = new Date().toISOString();
        setSyncStatus({
          state: 'success',
          message: `ส่งข้อมูลขึ้น GitHub สำเร็จ (${dayjs(nowIso).format('HH:mm:ss')})`,
          lastSyncedAt: nowIso,
        });
        showToast('ซิงค์ข้อมูลขึ้น GitHub สำเร็จแล้วเมี้ยว! 🌈');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'ไม่สามารถส่งข้อมูลขึ้น GitHub ได้';
        setSyncStatus({ state: 'error', message });
      }
    },
    [entries, showToast]
  );

  /** ดึงข้อมูลจาก GitHub (Pull) มาอัปเดตลง LocalStorage */
  const handlePullFromGit = useCallback(
    async (configToUse: GitSyncConfig) => {
      setSyncStatus({
        state: 'syncing',
        message: 'กำลังดึงข้อมูลจาก GitHub...',
      });
      try {
        const { entries: pulledEntries } = await pullIncomesFromGitHub(configToUse);
        setEntries(pulledEntries);
        saveIncomeEntries(pulledEntries);
        const nowIso = new Date().toISOString();
        setSyncStatus({
          state: 'success',
          message: `ดึงข้อมูลจาก GitHub สำเร็จ (${Object.keys(pulledEntries).length} วัน)`,
          lastSyncedAt: nowIso,
        });
        showToast('ดึงข้อมูลจาก GitHub เรียบร้อยแล้วเมี้ยว! 🐾');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'ไม่สามารถดึงข้อมูลจาก GitHub ได้';
        setSyncStatus({ state: 'error', message });
      }
    },
    [showToast]
  );

  /** เลือกวันที่และซิงค์เดือนบนปฏิทินให้ตรงกัน */
  const handleSelectDate = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    setCurrentMonthKey(dateStr.slice(0, 7));
  }, []);

  /** บันทึกหรืออัปเดตรายการรายได้ พร้อมทำ Auto-Sync หากเปิดใช้งาน */
  const handleSaveEntry = useCallback(
    (entry: IncomeEntry) => {
      const nextEntries: IncomeMap = {
        ...entries,
        [entry.date]: entry,
      };
      setEntries(nextEntries);
      saveIncomeEntries(nextEntries);
      showToast(`บันทึกรายได้วันที่ ${dayjs(entry.date).format('D/M')} เรียบร้อยแล้ว 💖`);

      if (gitConfig.autoSync && gitConfig.token.trim() && gitConfig.owner.trim() && gitConfig.repo.trim()) {
        void handlePushToGit(gitConfig, nextEntries);
      }
    },
    [entries, gitConfig, handlePushToGit, showToast]
  );

  /** ลบรายการรายได้ของวันที่เลือก พร้อมทำ Auto-Sync หากเปิดใช้งาน */
  const handleDeleteEntry = useCallback(
    (dateStr: string) => {
      const nextEntries: IncomeMap = { ...entries };
      delete nextEntries[dateStr];
      setEntries(nextEntries);
      saveIncomeEntries(nextEntries);
      showToast('ลบรายการรายได้ของวันนี้เรียบร้อยแล้ว');

      if (gitConfig.autoSync && gitConfig.token.trim() && gitConfig.owner.trim() && gitConfig.repo.trim()) {
        void handlePushToGit(gitConfig, nextEntries);
      }
    },
    [entries, gitConfig, handlePushToGit, showToast]
  );

  /** บันทึกการตั้งค่า GitHub Sync ลง LocalStorage */
  const handleSaveGitConfig = useCallback((nextConfig: GitSyncConfig) => {
    setGitConfig(nextConfig);
    saveGitSyncConfig(nextConfig);
  }, []);

  /** ส่งออกไฟล์ JSON สำรอง */
  const handleExportJson = useCallback(() => {
    exportIncomesToJsonFile(entries);
    showToast('ดาวน์โหลดไฟล์สำรอง JSON เรียบร้อยแล้ว! ✨');
  }, [entries, showToast]);

  /** นำเข้าข้อมูลจากไฟล์ JSON */
  const handleImportJson = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const importedEntries = parseImportedIncomesJson(text);
        const mergedEntries: IncomeMap = {
          ...entries,
          ...importedEntries,
        };
        setEntries(mergedEntries);
        saveIncomeEntries(mergedEntries);
        setSyncStatus({
          state: 'success',
          message: `นำเข้าไฟล์สำเร็จ (${Object.keys(importedEntries).length} วัน)`,
        });
        showToast('นำเข้าข้อมูลจากไฟล์ JSON สำเร็จแล้วเมี้ยว! 🌈');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'ไฟล์ JSON ไม่ถูกต้อง';
        setSyncStatus({ state: 'error', message });
      }
    },
    [entries, showToast]
  );

  const isGitConfigured = Boolean(
    gitConfig.owner.trim() && gitConfig.repo.trim() && gitConfig.token.trim()
  );

  return (
    <div className="min-h-screen pb-14">
      {/* แถบสายรุ้งพาสเทลบางๆ ด้านบนสุด */}
      <div className="rainbow-bar-bg h-2 w-full" />

      {/* Toast แจ้งเตือนแบบลอย */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-40 animate-bounce rounded-2xl border border-pink-200 bg-white/95 px-4 py-2.5 text-xs font-semibold text-pink-700 shadow-lg shadow-pink-200/60 backdrop-blur-sm sm:text-sm">
          {toastMessage}
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-5 px-4 pt-5 sm:px-6 lg:px-8">
        {/* ส่วนหัวแอปพลิเคชัน */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rainbow-border-gradient flex h-12 w-12 items-center justify-center rounded-2xl p-[2px] shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
                <PawPrint className="h-6 w-6 text-pink-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold tracking-tight text-[#4a2c3a] sm:text-2xl">
                  PawPocket
                </h1>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <p className="font-cute text-xs text-[#8a5d72] sm:text-sm">
                บันทึกรายได้พิเศษรายวัน สดใสไปกับน้องแมวและสายรุ้ง
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSyncModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-pink-200 bg-white/90 px-4 py-2.5 text-xs font-semibold text-[#5c3648] shadow-sm transition hover:border-pink-300 hover:bg-pink-50 active:scale-95 sm:text-sm"
          >
            {syncStatus.state === 'syncing' ? (
              <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
            ) : syncStatus.state === 'error' ? (
              <CloudOff className="h-4 w-4 text-rose-500" />
            ) : isGitConfigured ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <Cloud className="h-4 w-4 text-pink-500" />
            )}
            <span>GitHub Sync & สำรองข้อมูล</span>
          </button>
        </header>

        {/* การ์ดน้องแมว Mascot + กล่องคำพูด */}
        <RainbowCard contentClassName="p-4 sm:p-5">
          <CatMascot
            selectedAmount={selectedEntry?.totalAmount ?? 0}
            hasEntry={Boolean(selectedEntry)}
            monthlyAverage={monthlySummary.averagePerRecordedDay}
            selectedDateLabel={formatThaiFullDate(selectedDate)}
          />
        </RainbowCard>

        {/* การ์ดสรุปยอด 3 ใบ (รายวัน / รายเดือน / สะสมทั้งหมด) */}
        <SummaryCards
          selectedDate={selectedDate}
          selectedEntry={selectedEntry}
          monthlySummary={monthlySummary}
          overallSummary={overallSummary}
          onSelectDate={handleSelectDate}
          onSelectMonth={setCurrentMonthKey}
        />

        {/* โซนหลัก: ฟอร์มกรอกรายได้ + ปฏิทินโต้ตอบ */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <IncomeFormCard
              selectedDate={selectedDate}
              existingEntry={selectedEntry}
              onChangeDate={handleSelectDate}
              onSaveEntry={handleSaveEntry}
              onDeleteEntry={handleDeleteEntry}
            />
          </div>

          <div className="lg:col-span-7">
            <IncomeCalendar
              currentMonthKey={currentMonthKey}
              selectedDate={selectedDate}
              monthlySummary={monthlySummary}
              onChangeMonth={setCurrentMonthKey}
              onSelectDate={handleSelectDate}
            />
          </div>
        </div>

        {/* กราฟแท่งสีรุ้งพาสเทลรายวันในเดือน */}
        <MonthlyChartSection
          monthlySummary={monthlySummary}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />

        {/* ฟุตเตอร์น่ารัก */}
        <footer className="flex items-center justify-center gap-1.5 pt-2 text-xs text-[#9c7286]">
          <span>สร้างด้วย</span>
          <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" />
          <span>PawPocket • ข้อมูลบันทึกอัตโนมัติในเครื่องของคุณ</span>
        </footer>
      </div>

      {/* Modal ตั้งค่า GitHub Sync & Export/Import JSON */}
      <GitSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        config={gitConfig}
        syncStatus={syncStatus}
        onSaveConfig={handleSaveGitConfig}
        onPullFromGit={handlePullFromGit}
        onPushToGit={(cfg) => handlePushToGit(cfg)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />
    </div>
  );
}
