# Privacy Policy — Lịch Vạn Niên VN

**Last updated: May 5, 2025**

---

## 1. Introduction

Lịch Vạn Niên VN ("the Extension", "we", "our", or "us") is a Chrome Extension that provides a Vietnamese Lunar Calendar. This Privacy Policy explains how we handle your data when you use our Extension, including the optional Google Calendar integration feature.

We are committed to protecting your privacy. We do **not** sell, trade, or rent your personal data to any third party.

---

## 2. Data We Collect

### 2.1 Data We Do NOT Collect
- We do **not** collect or store any personally identifiable information (PII) on our servers.
- We do **not** have any backend servers, databases, or analytics tracking.
- We do **not** collect usage statistics, crash reports, or behavioral data.
- We do **not** read, copy, or store the content of your Google Calendar events.

### 2.2 Data Stored Locally On Your Device
The Extension stores a small amount of data in your browser's local extension storage (`chrome.storage`):
- **Quote Language preference** (`quoteLang`): A string value (`"vn"`, `"en"`, or `"cn"`) representing your selected display language for daily quotations.
- **Google OAuth Token** (if you choose to connect Google Calendar): A temporary access token issued by Google. This token is cached by Chrome's identity system (`chrome.identity`) on your local device only and is never transmitted to our servers.

---

## 3. Google Calendar Integration

This is an **optional** feature. If you choose to connect your Google Calendar:

### 3.1 What We Access
- We request **read-only** access to your Google Calendar via the scope: `https://www.googleapis.com/auth/calendar.readonly`.
- This access is used **solely** to retrieve your calendar events and display them inside the Extension popup for your personal viewing convenience.

### 3.2 How We Use It
- We fetch event data (event title, start time, end time) directly from Google's API (`https://www.googleapis.com/calendar/v3/`).
- Fetched events are held **temporarily in memory** (React component state) only while the Extension popup is open and are **never written to disk, transmitted to any server, or shared with any third party**.
- We only fetch events for the **currently viewed month** to minimize data access.

### 3.3 What We Do NOT Do
- We do **not** read, access, or modify any other Google account data.
- We do **not** create, edit, or delete any Calendar events.
- We do **not** store or log your calendar event content anywhere.
- We do **not** share your calendar data with any third party.

### 3.4 Revoking Access
You can disconnect your Google Calendar at any time by navigating to the Extension's **Options page** and clicking "Ngắt kết nối" (Disconnect). You can also revoke access directly from your [Google Account Permissions page](https://myaccount.google.com/permissions).

---

## 4. Permissions We Request

| Permission | Reason |
|---|---|
| `identity` | Required to authenticate with Google using `chrome.identity.getAuthToken` to obtain an OAuth2 token. |
| `storage` | Required to persist user preferences (e.g., quote language setting) locally across browser sessions. |

---

## 5. Third-Party Services

When using the Google Calendar integration, your data is subject to **Google's Privacy Policy**: [https://policies.google.com/privacy](https://policies.google.com/privacy).

We have no affiliation with Google LLC. We use Google's official public APIs in accordance with their Terms of Service.

---

## 6. Children's Privacy

The Extension is not directed at children under the age of 13. We do not knowingly collect any personal information from children.

---

## 7. Changes to This Policy

We may update this Privacy Policy from time to time. Any changes will be reflected by an updated "Last updated" date at the top of this document. Continued use of the Extension after changes constitutes acceptance of the new policy.

---

## 8. Contact

If you have any questions about this Privacy Policy, please contact the developer at:

**Email**: thanhphat.uit@gmail.com
