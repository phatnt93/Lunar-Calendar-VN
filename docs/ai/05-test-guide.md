# Test Guide

## 1. Local Development
1. Run `pnpm dev` or `npm run dev`.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the generated build folder (e.g., `build/chrome-mv3-dev`).
5. Click the extension icon to view the popup.

## 2. Core Functionality to Test
- **Month Navigation**: Click previous/next arrows to ensure the calendar updates correctly and lunar dates recalculate.
- **Date Selection**: Clicking a date should update the detailed panel on the left.
- **Leap Year Verification**: Test lunar leap months (e.g., check dates in known lunar leap years like 2020, 2023).
- **Conversions**: 
  - Input a known solar date in "Tra cứu ngày Âm - Dương" and verify the lunar result.
  - Input a known lunar date and verify the solar result.

## 3. UI/UX Verification
- Ensure styles render correctly without overriding or being overridden by host page styles (verify Shadow DOM behavior).
- Ensure the popup size (`750px` width) fits entirely within the screen boundaries.
- Verify that daily quotes change when selecting a different day of the year.
