# Graph Report - PawPocket  (2026-11-26)

## Corpus Check
- 39 files · ~10,821 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 202 nodes · 389 edges · 20 communities (12 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4db258cd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Dashboard/Dashboard.tsx
- package.json
- IncomeFormCard.tsx
- compilerOptions
- incomeMath.ts
- compilerOptions
- dayjs
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
1. `Dashboard()` - 23 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 16 edges
4. `RainbowCard()` - 13 edges
5. `formatCurrency()` - 11 edges
6. `formatThaiMonthYear()` - 10 edges
7. `lucide-react` - 9 edges
8. `SummaryCards()` - 9 edges
9. `formatCompactCurrency()` - 9 edges
10. `dayjs` - 8 edges

## Surprising Connections (you probably didn't know these)
- `resolveCatState()` --calls--> `formatCurrency()`  [EXTRACTED]
  src/components/CatMascot.tsx → src/utils/expressionParser.ts
- `Dashboard()` --calls--> `CatMascot()`  [EXTRACTED]
  src/pages/Dashboard/Dashboard.tsx → src/components/CatMascot.tsx
- `Dashboard()` --calls--> `RainbowCard()`  [EXTRACTED]
  src/pages/Dashboard/Dashboard.tsx → src/components/RainbowCard.tsx
- `IncomeFormCard()` --calls--> `RainbowCard()`  [EXTRACTED]
  src/pages/Dashboard/sections/IncomeFormCard.tsx → src/components/RainbowCard.tsx
- `Dashboard()` --calls--> `DailyIncomeList()`  [EXTRACTED]
  src/pages/Dashboard/Dashboard.tsx → src/pages/Dashboard/sections/DailyIncomeList.tsx

## Import Cycles
- None detected.

## Communities (20 total, 8 thin omitted)

### Community 0 - "Dashboard/Dashboard.tsx"
Cohesion: 0.15
Nodes (30): GitSyncModal(), GitSyncModalProps, Dashboard(), IncomeFormCard(), MobileSummaryBar(), GitSyncConfig, SyncStatus, SyncStatusState (+22 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (24): dependencies, dayjs, js-base64, lucide-react, react, react-dom, react-router-dom, description (+16 more)

### Community 2 - "IncomeFormCard.tsx"
Cohesion: 0.24
Nodes (16): lucide-react, react, RainbowCard(), RainbowCardProps, DailyIncomeList(), IncomeCalendar(), RAINBOW_DOT_COLORS, WEEKDAY_HEADERS (+8 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+11 more)

### Community 4 - "incomeMath.ts"
Cohesion: 0.17
Nodes (16): DailyIncomeListProps, IncomeCalendarProps, IncomeFormCardProps, MobileSummaryBarProps, MonthlyChartSectionProps, SummaryCardsProps, DailyStat, ExpressionParseResult (+8 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 6 - "dayjs"
Cohesion: 0.24
Nodes (6): dayjs, react-dom, react-router-dom, App(), AppRoutes(), ROUTE_PATHS

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
- **90 isolated node(s):** `name`, `private`, `version`, `type`, `description` (+85 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 101 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dayjs` connect `dayjs` to `Dashboard/Dashboard.tsx`, `package.json`, `IncomeFormCard.tsx`, `incomeMath.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `IncomeFormCard.tsx` to `Dashboard/Dashboard.tsx`, `package.json`, `incomeMath.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _90 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard/Dashboard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.146218487394958 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._