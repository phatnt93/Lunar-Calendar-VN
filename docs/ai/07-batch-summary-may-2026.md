# Batch Summary - May 2026 (Phase 2)

## 1. Overview

Đợt cập nhật này tập trung vào việc hoàn thiện logic cốt lõi về thông báo, làm giàu dữ liệu ngày lễ và cải thiện trải nghiệm người dùng (UX) thông qua các hiệu ứng tương tác mượt mà.

## 2. Detailed Changes

### 2.1. Notification System & Settings

- **Custom Notifications**: Người dùng có thể chọn số ngày nhắc trước (0-7 ngày) và khung giờ thông báo hàng ngày trong trang Options.
- **Background Logic**: Cập nhật `background.ts` sử dụng `chrome.alarms` để kiểm tra sự kiện mỗi 30 phút, đảm bảo gửi thông báo đúng giờ và không lặp lại trong ngày.
- **Storage**: Sử dụng `@plasmohq/storage` để đồng bộ cấu hình thông báo.

### 2.2. Data Enrichment (Holidays)

- **Holidays Data**: Mở rộng `src/assets/holidays.json` với hơn 15 ngày lễ mới (Solar & Lunar).
- **Lunar Festivals**: Bổ sung đầy đủ 3 ngày Tết Nguyên Đán và các ngày lễ truyền thống khác.

### 2.3. Backup & Restore

- **Export**: Tính năng xuất toàn bộ ghi chú cá nhân ra file `.json` để lưu trữ.
- **Import**: Tính năng nhập dữ liệu từ file backup, hỗ trợ kiểm tra định dạng và cấu trúc dữ liệu trước khi ghi đè.

### 2.4. UI/UX Refinement (Premium Feel)

- **Hover Tooltips**: Hiển thị danh sách sự kiện nhanh khi di chuột qua các ngày trên lịch.
- **Animations**:
  - **Fade & Slide**: Hiệu ứng chuyển cảnh khi thay đổi ngày/tháng.
  - **Staggered List**: Hiệu ứng xuất hiện lần lượt cho các mục sự kiện.
  - **Hover Lift**: Hiệu ứng nổi khối nhẹ cho các thẻ sự kiện khi tương tác.

### 2.5. Draggable Content Script Widget

- **Dragging Mechanism**: Triển khai logic kéo thả dựa trên các sự kiện `mousedown`, `mousemove` và `mouseup` xử lý trực tiếp tọa độ trong Content Script.
- **Persistence**: Sử dụng `useStorage` để lưu tọa độ (`bottom`, `right`). Vị trí được đồng bộ tự động giữa các tab khác nhau.
- **Boundary Detection**: Thêm logic giới hạn tọa độ để widget luôn nằm trong khung hình của trình duyệt (viewport).

## 3. Decisions & Trade-offs

- **Zodiac Images**: Đã tạm dừng việc triển khai bộ 12 con giáp động theo yêu cầu của người dùng để tập trung vào các tính năng chức năng.
- **Notification Frequency**: Chọn chu kỳ 30 phút cho background script để cân bằng giữa độ chính xác về thời gian và hiệu năng pin/tài nguyên.

## 4. Next Steps

- Tối ưu hóa hiệu năng render cho danh sách sự kiện dài.
- Xem xét bổ sung tính năng đồng bộ ghi chú qua Cloud (ngoài Google Calendar).
