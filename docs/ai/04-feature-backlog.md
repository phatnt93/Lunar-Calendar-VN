# Feature Backlog

## 1. Recommended Next Batches

### Batch 1: Dynamic Zodiac Images
- [NEED CONFIRMATION] Determine if all 12 zodiac images are required.
- Refactor `ZodiacImages.ts` and `HomePage.tsx` to dynamically display the correct zodiac animal based on the current Lunar Year's "Chi" (Tý, Sửu, Dần...).

### Batch 2: Input Validation & UX Polish
- Add error boundary/messages for invalid date formats in the "Tính năng nâng cao" section.
- Improve keyboard navigation for the date inputs.

## 2. Completed Features
- **Batch 3: Options / Settings Page**: Completed. Integrated `@plasmohq/storage` to save User preferences (e.g. Quote Language, Google Account connection).
- **Batch 4: Content Script Inject**: Completed. Added a floating mini-calendar widget to all pages that displays the solar and lunar dates.
- **Batch 5: Google Calendar Integration**: Completed. Allows users to authenticate via `chrome.identity`, reads events from Google Calendar API, and displays them on the UI.
