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
- **Options Page**: Allows configuring settings such as the Quote Language (VN, EN, CN) and connecting/disconnecting Google Calendar, synchronized via `@plasmohq/storage`.
- **Content Script Widget**: Injects a floating mini-calendar widget into all web pages.
  - **Draggable & Persistent**: Users can drag the widget to any position on the screen. The position is saved via `@plasmohq/storage` and synced across all tabs.
  - **Collapsed**: Displays solar date prominently with a small lunar date/month indicator.
  - **Expanded**: Displays detailed current date info (Solar prominent, Lunar below).
- **Google Calendar Integration**: 
  - Users can connect their personal Google Calendar via OAuth2 (`chrome.identity`).
  - Fetches events using the Google Calendar REST API.
  - Displays blue dots on the calendar grid for days with events.
  - Shows an "Sự kiện trong ngày" (Events of the day) list in the detailed info panel.
- **Holidays & Events**: 
  - Comprehensive holiday list in `holidays.json` (Solar & Lunar).
  - Countdown logic to show "Sắp tới" (Upcoming) events on the dashboard.
- **Notification System**: 
  - Background script (`background.ts`) sends daily notifications for upcoming events.
  - Configurable "Remind before X days" and "Notification Time" in Options.
- **Backup & Restore**: 
  - Export personal events to JSON.
  - Import personal events from JSON with validation.
- **UI/UX Polish**:
  - Hover tooltips on calendar grid to preview events.
  - Smooth animations (Fade, Slide, Staggered appearance) for a premium feel.

## 2. Known Assets
- **Fonts**: Montserrat (Light, Regular, Medium, SemiBold, Bold) are included and configured.
- **Background**: Uses `assets/imgs/bg.png` for a traditional aesthetic.
- **Zodiac Images**: Uses `zodiac-horse.png`. The plan for 12 dynamic zodiac images has been intentionally omitted/simplified.

## 3. Outstanding Issues
- **Error Handling**: Basic validation for date formats is present but could be more robust.
- **Mobile responsiveness**: The current fixed width (750px) is optimized for desktop popups.
