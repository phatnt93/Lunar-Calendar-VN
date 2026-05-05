# Google OAuth Verification — Submission Guide

Tài liệu này giúp anh điền đầy đủ thông tin khi submit form xác minh OAuth trên Google Cloud Console.
Đường dẫn: **Google Cloud Console → Google Auth Platform → Verification Center**.

---

## Bước 1: Branding (Thông tin thương hiệu)

Vào mục **Branding** trong Google Auth Platform và điền:

| Trường | Nội dung cần điền |
|---|---|
| **App name** | `Lịch Vạn Niên VN` |
| **User support email** | `thanhphat.uit@gmail.com` |
| **App logo** | Upload icon của Extension (128x128px) |
| **Application home page** | URL trang Chrome Web Store của Extension |
| **Application privacy policy link** | URL bài đăng Privacy Policy (xem Bước 0 bên dưới) |
| **Application terms of service link** | Có thể để trống hoặc dùng cùng URL Privacy Policy |
| **Authorized domains** | Để trống (Extension không có backend) |
| **Developer contact email** | `thanhphat.uit@gmail.com` |

---

## Bước 0: Publish Privacy Policy (QUAN TRỌNG — Làm trước)

Google bắt buộc Privacy Policy phải là **một trang web có thể truy cập công khai** (public URL). Anh cần chọn một trong các cách sau để host file `docs/privacy-policy.md`:

### Cách khuyến nghị: Dùng GitHub Pages hoặc GitHub Raw
1. Đẩy file `docs/privacy-policy.md` lên GitHub repository của dự án.
2. Dùng link trực tiếp: `https://github.com/[username]/[repo]/blob/main/docs/privacy-policy.md`
3. Hoặc convert sang HTML và bật GitHub Pages.

### Cách khác: Dùng Google Sites (miễn phí, nhanh)
1. Truy cập [sites.google.com](https://sites.google.com).
2. Tạo một trang mới.
3. Paste nội dung Privacy Policy vào.
4. Publish trang đó lên và lấy URL.

---

## Bước 2: Data Access — Khai báo Scope

Vào mục **Data Access** và thêm scope:
- Bấm **Add or remove scopes**.
- Tìm và chọn: `https://www.googleapis.com/auth/calendar.readonly`
- Bấm **Update**.

### Lý do sử dụng scope (Justification — Anh cần điền bằng tiếng Anh)

Khi Google hỏi "How does your app use this scope?", anh dán đoạn sau:

> "The Lịch Vạn Niên VN Chrome Extension optionally integrates with the user's personal Google Calendar to enhance the calendar viewing experience. When the user explicitly grants permission, the extension reads their upcoming calendar events (read-only) and displays event titles and times directly within the extension popup alongside the corresponding Vietnamese Lunar Calendar date. This allows users to see both their personal schedule and the traditional lunar date information in one convenient place. The extension does not store, transmit, or share any calendar data. All fetched data is held temporarily in memory only while the popup is open."

---

## Bước 3: Verification Center — Submit

Vào mục **Verification Center** và bấm **Prepare for verification** (hoặc **Submit for verification**):

### Video demo (BẮT BUỘC)
Google yêu cầu một video **không chỉnh sửa, không có watermark**, dài tối đa 5 phút, quay màn hình thể hiện:
1. Người dùng cài Extension từ Chrome Web Store.
2. Bấm vào icon Extension để mở popup.
3. Bấm nút **"Kết nối Google Calendar"** → Màn hình Google OAuth hiện ra.
4. Người dùng đăng nhập → **Cấp quyền** `calendar.readonly`.
5. Quay lại popup → Thấy sự kiện hiển thị trên lưới lịch (chấm xanh) và danh sách "Sự kiện trong ngày".

**Anh có thể dùng:** OBS Studio, Windows Game Bar (`Win + G → Record`), hoặc Loom để quay màn hình.

### Link video: Upload lên YouTube (không công khai/unlisted là được) và paste URL vào form.

---

## Bước 4: Thông tin bổ sung (Additional Information)

| Trường | Nội dung |
|---|---|
| **Your app's use of the restricted scopes** | Dán lại đoạn justification ở Bước 2 |
| **Does your app store user data?** | **No** |
| **Does your app share user data?** | **No** |
| **Where is user data stored?** | Không có (để trống hoặc ghi "Data is not stored") |

---

## Checklist Trước Khi Submit

- [ ] Privacy Policy đã được publish lên URL công khai.
- [ ] URL Privacy Policy đã điền vào mục Branding.
- [ ] Scope `calendar.readonly` đã được thêm vào mục Data Access.
- [ ] Đã quay video demo và upload lên YouTube (unlisted).
- [ ] Đã điền xong phần Justification cho scope.
- [ ] Bấm **Publish app** (chuyển trạng thái từ Testing → In Production).
- [ ] Bấm **Submit for verification** ở Verification Center.

---

## Thời gian chờ

- Google thường mất **4–6 tuần** để review.
- Trong thời gian chờ, người dùng vẫn **có thể đăng nhập** nhưng sẽ thấy màn hình cảnh báo "Unverified app". Họ cần bấm **"Advanced" → "Go to Lịch Vạn Niên VN (unsafe)"** để tiếp tục.
- Sau khi được verify, màn hình cảnh báo sẽ biến mất hoàn toàn.
