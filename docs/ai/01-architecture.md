# Architecture & Tech Stack

## 1. Technology Stack
- **Framework**: Plasmo (Chrome Extension Framework)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS (`style.css` with Montserrat fonts)
- **Date Manipulation**: `dayjs`

## 2. Directory Structure
- `src/`
  - `popup.tsx`: The entry point for the extension's popup UI.
  - `content.tsx`: Content script logic. It injects and scopes Tailwind CSS into the Shadow DOM.
  - `pages/`
    - `HomePage.tsx`: The main component containing the calendar UI, state management, and interaction logic.
  - `utils/`
    - `LunarCalendar.ts`: Core algorithm for Vietnamese lunar calendar calculation (based on Hồ Ngọc Đức's algorithm).
    - `helper.ts`: Helper utilities for generating calendar grids and parsing dates.
    - `dailyQuotations.ts`: Utility for fetching daily quotes.
    - `ZodiacImages.ts`: Utility for exporting zodiac image assets.
- `assets/`
  - Fonts, background images, and `daily_quotations.json`.

## 3. Core Mechanisms
- **Lunar Calculations**: Fully offline calculation using astronomical algorithms (Julian Day, Sun Longitude, New Moon) defined in `LunarCalendar.ts`.
- **Styling Scope**: Plasmo injects UI into a Shadow DOM. To support Tailwind's `rem` units, `content.tsx` actively converts `rem` to `px` values.
- **State Management**: React `useState` and `useEffect` are used heavily in `HomePage.tsx` to handle date selection, month navigation, and conversion features.
