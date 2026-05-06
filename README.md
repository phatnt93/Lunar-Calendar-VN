# Lịch Vạn Niên - VN

![Lịch Vạn Niên Logo](assets/icon.png)

Tiện ích mở rộng cho trình duyệt Chrome giúp xem lịch âm, ngày hoàng đạo, tiết khí và đồng bộ lịch Google.

🔗 **Xem trang giới thiệu:** [https://phatnt93.github.io/Lunar-Calendar-VN/](https://phatnt93.github.io/Lunar-Calendar-VN/)

## Tính năng nổi bật

- **Xem lịch tháng:** Giao diện lịch tháng đầy đủ với ngày dương và ngày âm.
- **Chi tiết ngày:** Xem Can Chi, Tiết Khí, Giờ Hoàng Đạo và danh ngôn mỗi ngày.
- **Đồng bộ Google Calendar:** Hiển thị sự kiện cá nhân ngay trên lịch.
- **Chuyển đổi ngày:** Công cụ chuyển đổi nhanh giữa âm lịch và dương lịch.
- **Mini Widget:** Widget nổi trên trang web để xem nhanh ngày tháng.

## Cài đặt

Hiện tại bạn có thể cài đặt bằng cách tải mã nguồn và load extension thủ công:

1. Clone repository này.
2. Chạy `pnpm install`.
3. Chạy `pnpm dev`.
4. Mở Chrome, vào `chrome://extensions/`.
5. Bật "Developer mode".
6. Chọn "Load unpacked" và trỏ tới thư mục `build/chrome-mv3-dev`.

## Phát triển

Dự án sử dụng [Plasmo framework](https://docs.plasmo.com/).

### Chạy development:
```bash
pnpm dev
```

### Build bản production:
```bash
pnpm build
```

## Giấy phép

Mã nguồn được phát hành dưới giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.
