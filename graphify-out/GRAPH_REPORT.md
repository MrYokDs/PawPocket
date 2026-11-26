# Graph Report - PawPocket  (2026-11-26)

## Corpus Check
- 36 files · ~9,392 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 194 nodes · 355 edges · 20 communities (12 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3df9dad6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Dashboard/Dashboard.tsx
- package.json
- IncomeFormCard.tsx
- compilerOptions
- incomeMath.ts
- compilerOptions
- main.tsx
- devDependencies
- PawPocket 🐱🌈💖
- CatMascot.tsx
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
1. `Dashboard()` - 21 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 16 edges
4. `RainbowCard()` - 11 edges
5. `SummaryCards()` - 9 edges
6. `formatCurrency()` - 9 edges
7. `pullIncomesFromGitHub()` - 8 edges
8. `formatThaiMonthYear()` - 8 edges
9. `dayjs` - 7 edges
10. `lucide-react` - 7 edges

## Surprising Connections (you probably didn't know these)
- `resolveCatState()` --calls--> `formatCurrency()`  [EXTRACTED]
  src/components/CatMascot.tsx → src/utils/expressionParser.ts
- `Dashboard()` --calls--> `CatMascot()`  [EXTRACTED]
  src/pages/Dashboard/Dashboard.tsx → src/components/CatMascot.tsx
- `Dashboard()` --calls--> `RainbowCard()`  [EXTRACTED]
  src/pages/Dashboard/Dashboard.tsx → src/components/RainbowCard.tsx
- `Dashboard()` --calls--> `IncomeCalendar()`  [EXTRACTED]
  src/pages/Dashboard/Dashboard.tsx → src/pages/Dashboard/sections/IncomeCalendar.tsx
- `Dashboard()` --calls--> `IncomeFormCard()`  [EXTRACTED]
  src/pages/Dashboard/Dashboard.tsx → src/pages/Dashboard/sections/IncomeFormCard.tsx

## Import Cycles
- None detected.

## Communities (20 total, 8 thin omitted)

### Community 0 - "Dashboard/Dashboard.tsx"
Cohesion: 0.17
Nodes (25): dayjs, GitSyncModal(), GitSyncModalProps, Dashboard(), GitSyncConfig, SyncStatus, SyncStatusState, buildContentsUrl() (+17 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (24): dependencies, dayjs, js-base64, lucide-react, react, react-dom, react-router-dom, description (+16 more)

### Community 2 - "IncomeFormCard.tsx"
Cohesion: 0.24
Nodes (17): lucide-react, react, RainbowCard(), RainbowCardProps, IncomeCalendar(), RAINBOW_DOT_COLORS, WEEKDAY_HEADERS, IncomeFormCard() (+9 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+11 more)

### Community 4 - "incomeMath.ts"
Cohesion: 0.19
Nodes (15): IncomeCalendarProps, IncomeFormCardProps, MonthlyChartSectionProps, SummaryCardsProps, DailyStat, ExpressionParseResult, IncomeEntry, IncomeMap (+7 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 6 - "main.tsx"
Cohesion: 0.27
Nodes (5): react-dom, react-router-dom, App(), AppRoutes(), ROUTE_PATHS

### Community 7 - "devDependencies"
Cohesion: 0.25
Nodes (8): devDependencies, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react

### Community 8 - "PawPocket 🐱🌈💖"
Cohesion: 0.33
Nodes (5): PawPocket 🐱🌈💖, ฟีเจอร์หลัก, วิธี Deploy ขึ้น Vercel (vercel.app), วิธีรันโปรเจกต์บนเครื่อง (Local Development), วิธีสร้าง GitHub Personal Access Token สำหรับ GitHub Sync

### Community 9 - "CatMascot.tsx"
Cohesion: 0.50
Nodes (4): CatMascot(), CatMascotProps, CatMood, resolveCatState()

### Community 10 - "AGENTS.md — กฎและมาตรฐานหลักของโปรเจกต์ PawPocket 🐱🌈💖"
Cohesion: 0.50
Nodes (3): AGENTS.md — กฎและมาตรฐานหลักของโปรเจกต์ PawPocket 🐱🌈💖, กฎเหล็กประจำโปรเจกต์ (Project Golden Rules), ชุดสกิลประจำโปรเจกต์ (`.agents/skills/`)

### Community 11 - "Workspace Terminal Execution"
Cohesion: 0.50
Nodes (3): Workspace Terminal Execution, ข้อห้ามเด็ดขาด, ขอบเขตที่อนุญาต

## Knowledge Gaps
- **89 isolated node(s):** `name`, `private`, `version`, `type`, `description` (+84 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 100 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dayjs` connect `Dashboard/Dashboard.tsx` to `package.json`, `IncomeFormCard.tsx`, `incomeMath.ts`, `main.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `IncomeFormCard.tsx` to `Dashboard/Dashboard.tsx`, `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _89 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._