# Coding Rules & Best Practices

## 1. Tech Stack Rules
- Use **TypeScript** for all new logic. Avoid `any` where possible.
- Use **Tailwind CSS** for layout and utility styling. Custom CSS should be placed in `src/style.css` when Tailwind isn't sufficient (e.g., custom colors, font faces).
- Use **dayjs** for handling modern Date operations instead of native `Date` where applicable, except in the core astronomical calculations.

## 2. Core Algorithm Strictness
- **DO NOT** modify `src/utils/LunarCalendar.ts` without extensive testing against known lunar calendars. This algorithm relies on precise mathematical formulas and Julian date logic.
- Do not invent business rules around lunar leap months or solar terms. Rely on the existing algorithms.

## 3. Extension Constraints
- Plasmo uses Shadow DOM for injected UI. Be cautious when using global CSS selectors.
- Keep the bundle size minimal. Large assets should be optimized.

## 4. Documentation
- Update these AI docs if structural or architectural changes are introduced.
- Mark uncertain implementation details or missing assets as `[NEED CONFIRMATION]`.

## 5. CodeGraph-First Workflow
- Before performing any task related to source code, read the relevant CodeGraph context first.
- Use CodeGraph for structural understanding: entry points, symbol definitions, callers/callees, impact analysis, and cross-file dependencies.
- Use native text search only for literal strings, comments, assets, or after CodeGraph has identified the specific files to inspect.
- For architecture, bug context, or feature work, start with `codegraph_context`, then use `codegraph_explore` for the focused symbols/files it surfaces.
