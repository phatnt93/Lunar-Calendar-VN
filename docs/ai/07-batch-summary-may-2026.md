# Batch Summary - May 2026 (Phase 2)

## 1. Overview

Đợt cập nhật này tập trung vào việc hoàn thiện logic cốt lõi về thông báo, đồng bộ hóa dữ liệu đám mây và cải thiện trải nghiệm người dùng (UX) thông qua các hiệu ứng tương tác mượt mà.

## 2. Detailed Changes

### 2.1. Notification System & Settings

- **Custom Notifications**: Người dùng có thể chọn số ngày nhắc trước (0-7 ngày) và khung giờ thông báo hàng ngày trong trang Options.
- **Background Logic**: Cập nhật `background.ts` sử dụng `chrome.alarms` để kiểm tra sự kiện mỗi 30 phút.
- **Storage**: Sử dụng `@plasmohq/storage` để đồng bộ cấu hình thông báo.

### 2.2. Data Enrichment (Holidays)

- **Holidays Data**: Mở rộng `src/assets/holidays.json` với hơn 15 ngày lễ mới (Solar & Lunar).
- **Lunar Festivals**: Bổ sung đầy đủ 3 ngày Tết Nguyên Đán và các ngày lễ truyền thống khác.

### 2.3. Google Cloud Data Sync

- **Mechanism**: Sử dụng **Google Drive App Data Folder** để lưu trữ file backup ẩn.
- **Sync Flow**: Tự động thực hiện hợp nhất (Merge) dữ liệu dựa trên `updatedAt` khi mở ứng dụng hoặc khi có thay đổi.
- **OAuth2**: Mở rộng scope `drive.appdata` để cấp quyền truy cập không gian lưu trữ riêng của ứng dụng.

### 2.4. Backup & Restore (Local)

- **Export**: Tính năng xuất toàn bộ ghi chú cá nhân ra file `.json` để lưu trữ.
- **Import**: Tính năng nhập dữ liệu từ file backup, hỗ trợ kiểm tra định dạng và cấu trúc dữ liệu trước khi ghi đè.

### 2.5. UI/UX Refinement (Premium Feel)

- **Hover Tooltips**: Hiển thị danh sách sự kiện nhanh khi di chuột qua các ngày trên lịch.
- **Animations**:
  - **Fade & Slide**: Hiệu ứng chuyển cảnh khi thay đổi ngày/tháng.
  - **Staggered List**: Hiệu ứng xuất hiện lần lượt cho các mục sự kiện.
  - **Hover Lift**: Hiệu ứng nổi khối nhẹ cho các thẻ sự kiện khi tương tác.

### 2.6. Draggable Content Script Widget

- **Dragging Mechanism**: Triển khai logic kéo thả dựa trên các sự kiện `mousedown`, `mousemove` và `mouseup`.
- **Performance Fix**: Sử dụng `localPos` (state) để cập nhật tọa độ tức thời khi kéo, tránh lỗi ghi Storage quá nhiều (`MAX_WRITE_OPERATIONS_PER_MINUTE`).
- **Persistence**: Vị trí được lưu vào storage chỉ khi kết thúc thao tác kéo (`mouseup`).
- **Show/Hide Toggle**: Thêm công tắc bật/tắt hiển thị widget trong trang Options.
- **Boundary Detection**: Thêm logic giới hạn tọa độ để widget luôn nằm trong khung hình (viewport).

### 2.7. Startup Quote Toast

- **Session-based Display**: Hiển thị một câu châm ngôn (Quote) ở góc trên bên phải màn hình khi trình duyệt vừa khởi động. Sử dụng `chrome.storage.session` để đảm bảo chỉ hiển thị 1 lần duy nhất trong suốt phiên làm việc của trình duyệt.
- **UI/UX**: Giao diện Glassmorphism mượt mà (backdrop-blur), tự động biến mất sau 10 giây hoặc khi người dùng click vào.
- **Daily Content**: Tái sử dụng dữ liệu từ `daily_quotations.json` và cấu hình ngôn ngữ của người dùng.

## 3. Decisions & Trade-offs

- **Zodiac Images**: Tạm dừng triển khai bộ 12 con giáp động theo yêu cầu của người dùng.
- **Sync Strategy**: Chọn phương pháp "Merge by updatedAt" để đảm bảo tính nhất quán dữ liệu mà không cần server trung gian.

## 4. Next Steps

- Tối ưu hóa hiệu năng render cho danh sách sự kiện dài.
- Xem xét tính năng đồng bộ qua các dịch vụ Cloud khác (OneDrive/Dropbox).
