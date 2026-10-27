# Webprog4 — Feladatkezelő

Féléves feladat: **AngularJS 1.x + TypeScript + Bootstrap 5** egyoldalas alkalmazás.

## Futtatás helyben

```bash
npm install
npm start
```

Ez lefordítja a TypeScriptet (`dist/app.js`), majd elindít egy statikus szervert a **http://localhost:3000** címen.

Ha a fordítás már megvan:

```bash
npm run build
npm run serve
```

Alternatíva Pythonnal (build után):

```bash
npm run build
python3 -m http.server 3000
```

Majd nyisd meg a böngészőben: `http://localhost:3000`.

## Követelmény-térkép

| # | Követelmény | Hol jelenik meg |
|---|-------------|-----------------|
| 1 | Adatlista TypeScriptből | `src/data.ts` → `INITIAL_TASKS`; lista: `index.html` `ng-repeat` |
| 2 | Hozzáadás / módosítás űrlappal + tiltás | `index.html` űrlap; `src/app.ts` → `submitForm`, `startEdit` |
| 3 | ≥2 eseménytípus (látható hatás) | `ng-click` (Kész / Szerkeszt / Töröl); `ng-keyup` Enter a szűrőn → `onFilterKeyup` |
| 4 | Two-way binding + interpoláció ≥2 helyen | `ng-model="form.title"` + élő előnézet; `ng-model="filterText"` + „Aktív szűrő” szöveg |
| 5 | Valós idejű, case-insensitive szűrés | `filterText` + `filteredTasks()` az `src/app.ts`-ben |
| 6 | Számított érték TS modulból | `src/stats.ts` → `computeTotalMinutes`, `computeProgressPercent`; template: `{{ totalMinutes() }}`, `{{ progressPercent() }}` |
| 7 | Form validáció + vizuális hiba + disabled submit | `ng-required` / `ng-minlength`; `.invalid-hint`; gomb: `ng-disabled="taskForm.$invalid \|\| !isFormValid()"` |
| 8 | Dinamikus CSS / osztály adatból | `ng-class="rowClass(task)"`, `badgeClass`; `css/styles.css` → `.task-done` áthúzás, prioritás színek |

## Struktúra

```
├── index.html          # AngularJS nézet + Bootstrap 5
├── css/styles.css      # Dinamikus státusz / prioritás stílusok
├── src/
│   ├── models.ts       # Task típusok
│   ├── data.ts         # Kezdő lista (TS tömb)
│   ├── stats.ts        # Számított értékek
│   └── app.ts          # AngularJS modul + controller
├── dist/app.js         # Lefordított JS (npm run build)
├── package.json
└── tsconfig.json
```
