# Risks and Decisions

## 1. Algorithm Precision Risk
- **Risk**: The core Lunar calculations in `LunarCalendar.ts` rely on floating-point arithmetic for astronomical calculations (Julian Day, Sun Longitude). Small modifications can cascade into incorrect dates or leap months.
- **Decision**: Treat `LunarCalendar.ts` as immutable unless a confirmed bug is found. Do not invent business rules or "quick fixes" for date offsets.

## 2. Hardcoded Assets
- **Risk**: `ZodiacHorse` is hardcoded in `HomePage.tsx`, which is incorrect for years not associated with the Horse.
- **Decision**: [NEED CONFIRMATION] Need a strategy to acquire the remaining 11 zodiac images and map them dynamically to `lunarInfo.lunar.yearCanChi`.

## 3. Shadow DOM Styling (Plasmo)
- **Risk**: Tailwind relies heavily on `rem` units mapped to the `:root` font size. In Plasmo's Shadow DOM, there is no `:root`, leading to broken proportions if the host page's font size is weird.
- **Decision**: The project currently mitigates this via string replacement in `content.tsx` (converting `rem` to `px` based on a 16px root). Maintain this approach unless Plasmo releases native shadow-dom styling fixes.

## 4. Date Parsing Formats
- **Risk**: Users might input dates in various formats in the conversion fields.
- **Decision**: `helper.ts` currently restricts parsing strictly to certain formats `["DD/MM/YYYY", "D/M/YYYY", "DD/M/YYYY", "D/MM/YYYY"]`. This is safe but could result in silent failures if the user inputs `MM/DD/YYYY`.

## 5. Google OAuth & Identity API
- **Risk**: `chrome.identity.getAuthToken` binds the OAuth Client ID strictly to the Chrome Extension ID. If the local development Extension ID differs from the published Web Store Extension ID, authentication will fail with a `403` or `OAuth2 not granted` error.
- **Decision**: Implemented a mandatory process to pin the Extension ID in local development by downloading the Public Key from the Chrome Web Store Developer Dashboard and placing it directly into the `"key"` field of `package.json`'s `manifest` block.
- **Risk**: Google Calendar API requests are subject to quotas. Polling too frequently could exhaust user quotas.
- **Decision**: `HomePage.tsx` fetches events on a per-month basis and caches them in local state instead of fetching on every date click.
- **Decision**: To ensure the local development Extension ID matches the production Web Store ID, the **official Public Key from the Chrome Web Store Dashboard** must be pasted into the `"key"` field of the manifest in `package.json`. This is critical for OAuth consistency.

## 6. App Verification & Publishing
- **Risk**: Google Calendar API is a "restricted scope". The app will show a "Google hasn't verified this app" warning until verification is complete.
- **Decision**: The app must be "Published" in the Google Cloud Console (Testing -> In Production) to allow users outside the "Test users" list to log in (even with the warning). Full verification requires a video demo and a public Privacy Policy URL.
- **Decision**: When updating the extension on the Chrome Web Store, the version number in `package.json` must be manually incremented (e.g., from `0.0.4` to `0.0.5`).
