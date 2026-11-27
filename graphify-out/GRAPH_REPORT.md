# Graph Report - PawPocket  (2026-11-27)

## Corpus Check
- 40 files · ~14,872 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .webmanifest 1, .css 1)

## Summary
- 211 nodes · 412 edges · 18 communities (10 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b0a3de8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- githubSync.ts
- package.json
- Dashboard/Dashboard.tsx
- compilerOptions
- incomeMath.ts
- compilerOptions
- PastelDatePicker.tsx
- PawPocket 🐱🌈💖
- AGENTS.md — กฎและมาตรฐานหลักของโปรเจกต์ PawPocket 🐱🌈💖
- Workspace Terminal Execution
- Autonomous Build Verification
- Autonomous Git Commit & Semantic Versioning
- Common Skills — มาตรฐานการเขียนโค้ด PawPocket
- Graphify Knowledge Graph Skill
- tsconfig.json
- graphify.md
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `Dashboard()` - 23 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 16 edges
4. `RainbowCard()` - 13 edges
5. `formatThaiMonthYear()` - 12 edges
6. `formatCurrency()` - 11 edges
7. `lucide-react` - 10 edges
8. `dayjs` - 9 edges
9. `SummaryCards()` - 9 edges
10. `formatCompactCurrency()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `PastelDatePicker()` --calls--> `formatThaiMonthYear()`  [EXTRACTED]
  src/components/PastelDatePicker.tsx → src/utils/incomeMath.ts
- `IncomeFormCard()` --calls--> `PastelDatePicker()`  [EXTRACTED]
  src/pages/Dashboard/sections/IncomeFormCard.tsx → src/components/PastelDatePicker.tsx
- `Dashboard()` --calls--> `pullIncomesFromGitHub()`  [EXTRACTED]
  src/pages/Dashboard/Dashboard.tsx → src/utils/githubSync.ts
- `Dashboard()` --calls--> `pushIncomesToGitHub()`  [EXTRACTED]
  src/pages/Dashboard/Dashboard.tsx → src/utils/githubSync.ts
- `Dashboard()` --calls--> `calculateMonthlySummary()`  [EXTRACTED]
  src/pages/Dashboard/Dashboard.tsx → src/utils/incomeMath.ts

## Import Cycles
- None detected.

## Communities (18 total, 8 thin omitted)

### Community 0 - "githubSync.ts"
Cohesion: 0.19
Nodes (18): GitSyncModalProps, GitSyncConfig, SyncStatus, SyncStatusState, buildContentsUrl(), buildFreshGetUrl(), buildHeaders(), fetchLatestFileSha() (+10 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (32): dependencies, dayjs, js-base64, lucide-react, react, react-dom, react-router-dom, description (+24 more)

### Community 2 - "Dashboard/Dashboard.tsx"
Cohesion: 0.16
Nodes (30): lucide-react, CatMascot(), CatMascotProps, CatMood, resolveCatState(), GitSyncModal(), RainbowCard(), RainbowCardProps (+22 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+11 more)

### Community 4 - "incomeMath.ts"
Cohesion: 0.15
Nodes (19): DailyIncomeListProps, IncomeCalendarProps, IncomeFormCardProps, MobileSummaryBarProps, MonthlyChartSectionProps, SummaryCardsProps, DailyStat, ExpressionParseResult (+11 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 6 - "PastelDatePicker.tsx"
Cohesion: 0.14
Nodes (13): dayjs, react, react-dom, react-router-dom, App(), formatThaiShortDate(), MONTHS_SHORT_TH, PastelDatePicker() (+5 more)

### Community 8 - "PawPocket 🐱🌈💖"
Cohesion: 0.33
Nodes (5): PawPocket 🐱🌈💖, ฟีเจอร์หลัก, วิธี Deploy ขึ้น Vercel (vercel.app), วิธีรันโปรเจกต์บนเครื่อง (Local Development), วิธีสร้าง GitHub Personal Access Token สำหรับ GitHub Sync

### Community 10 - "AGENTS.md — กฎและมาตรฐานหลักของโปรเจกต์ PawPocket 🐱🌈💖"
Cohesion: 0.50
Nodes (3): AGENTS.md — กฎและมาตรฐานหลักของโปรเจกต์ PawPocket 🐱🌈💖, กฎเหล็กประจำโปรเจกต์ (Project Golden Rules), ชุดสกิลประจำโปรเจกต์ (`.agents/skills/`)

### Community 11 - "Workspace Terminal Execution"
Cohesion: 0.50
Nodes (3): Workspace Terminal Execution, ข้อห้ามเด็ดขาด, ขอบเขตที่อนุญาต

## Knowledge Gaps
- **94 isolated node(s):** `name`, `private`, `version`, `type`, `description` (+89 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 105 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dayjs` connect `PastelDatePicker.tsx` to `githubSync.ts`, `package.json`, `Dashboard/Dashboard.tsx`, `incomeMath.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Dashboard/Dashboard.tsx` to `githubSync.ts`, `package.json`, `PastelDatePicker.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _94 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.062388591800356503 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `PastelDatePicker.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._