# Current State

## 1. Implemented Features
- **Popup UI**: The extension popup successfully renders a styled calendar (`HomePage.tsx`).
- **Calendar Grid**: Displays a 6-week grid, filling previous/next month days properly.
- **Detailed Info Panel**: 
  - Shows current selected date (Solar & Lunar).
  - Shows Can Chi for Day, Month, Year.
  - Displays Solar Term (Tiết khí).
  - Displays list of Good Hours (Giờ hoàng đạo).
- **Daily Quotes**: Fetches quotes correctly based on the day of the year from `daily_quotations.json`.
- **Advanced Tools**: Input fields exist to quickly jump to a solar date, and to convert between Solar and Lunar dates.
- **Options Page**: Allows configuring settings such as the Quote Language (VN, EN, CN), synchronized via `@plasmohq/storage`.
- **Content Script Widget**: Injects a draggable/floating mini-widget into all web pages that shows the current Solar and Lunar date.
- **Google Calendar Integration**: 
  - Users can connect their personal Google Calendar via OAuth2 (`chrome.identity`).
  - Fetches events using the Google Calendar REST API.
  - Displays blue dots on the calendar grid for days with events.
  - Shows an "Sự kiện trong ngày" (Events of the day) list in the detailed info panel.

## 2. Known Assets
- **Fonts**: Montserrat (Light, Regular, Medium, SemiBold, Bold) are included and configured.
- **Background**: Uses `assets/imgs/bg.png` for a traditional aesthetic.
- **Zodiac Images**: Currently only `zodiac-horse.png` is integrated and hardcoded in the UI. [NEED CONFIRMATION] Are the other 11 zodiac animals supposed to be added?

## 3. Outstanding Issues
- **Hardcoded Image**: `HomePage.tsx` currently hardcodes the Horse zodiac image regardless of the actual selected year.
- **Error Handling**: Missing strong error handling for incorrect date formats in the advanced conversion inputs.
