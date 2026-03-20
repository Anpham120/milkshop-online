# 🥛 MilkShop Online

> Website quản lý bán sữa trực tuyến — Đồ án cuối kỳ môn **Cơ sở Lập trình Web**

## 📋 Giới thiệu

MilkShop Online là website quản lý bán sữa với đầy đủ chức năng CRUD, tìm kiếm, lọc, sắp xếp, giỏ hàng và các tính năng nâng cao. Website được phát triển hoàn toàn bằng công nghệ front-end, lưu trữ dữ liệu bằng LocalStorage.

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mục đích |
|-----------|----------|
| HTML5, CSS3, JavaScript ES6+ | Nền tảng chính |
| Bootstrap 5 | Responsive layout |
| Font Awesome | Biểu tượng giao diện |
| Google Fonts (Inter) | Typography |
| Chart.js | Biểu đồ thống kê |
| SweetAlert2 | Thông báo đẹp |
| LocalStorage | Lưu trữ dữ liệu |

## 📂 Cấu trúc dự án

```
MilkShop/
├── index.html              # Trang chủ
├── login.html              # Đăng nhập
├── products.html           # Quản lý sản phẩm (CRUD)
├── cart.html               # Giỏ hàng / Đơn hàng
├── statistics.html         # Thống kê
├── about.html              # Giới thiệu & Liên hệ
├── calendar.html           # Lịch sản phẩm
└── assets/
    ├── css/                # 8 file CSS (common + mỗi trang)
    ├── js/                 # 9 file JS (main, storageService + mỗi trang)
    └── img/                # Hình ảnh sản phẩm
```

## ⚡ Chức năng chính

- **CRUD sản phẩm**: Thêm, xem, sửa, xóa sản phẩm sữa
- **Tìm kiếm / Lọc / Sắp xếp**: Theo tên, loại, trạng thái, giá, hạn sử dụng
- **Giỏ hàng**: Thêm sản phẩm, cập nhật số lượng, đặt hàng
- **Thống kê**: 3 loại biểu đồ Chart.js (cột, tròn, giá trung bình)
- **Đăng nhập**: 2 vai trò — Admin (`admin/123456`) và Khách (`user/123456`)
- **Phân quyền**: Admin → CRUD, Khách → Xem + Mua hàng

## 🎁 Tính năng nâng cao

- 🌙 Dark Mode / Light Mode
- 📊 Biểu đồ thống kê (Chart.js)
- 📤 Export / Import JSON
- 📅 Lịch sản phẩm (hạn sử dụng)
- 🔐 Đăng nhập + Phân quyền
- ✨ Animation (sản phẩm bay, bọt sữa, shimmer)
- 📄 Phân trang (Pagination)
- 📱 Responsive (Mobile / Tablet / Desktop)
- 🔀 Chuyển đổi Grid / List view

## 🚀 Cách chạy

1. Clone repo:
   ```bash
   git clone https://github.com/............./milkshop-online.git
   ```
2. Mở `index.html` bằng trình duyệt (hoặc dùng Live Server trong VS Code)
3. Đăng nhập:
   - **Admin**: `admin` / `123456`
   - **Khách**: `user` / `123456`

## 👥 Thành viên nhóm

| STT | Họ tên | MSSV | Phụ trách |
|-----|--------|------|-----------|
| 1 | Phạm Duy An (Nhóm trưởng) | BIT240002 | Trang chủ + Đăng nhập |
| 2 | Bùi Đào Đức Anh | BIT240025 | Quản lý sản phẩm (CRUD) |
| 3 | Đỗ Tuấn Anh | BIT240015 | Giỏ hàng + Giới thiệu |
| 4 | Nguyễn Quang Hiếu | BIT240091 | CSS/JS chung (hạ tầng) |
| 5 | Phan Văn Hiếu | BIT240094 | Thống kê + Lịch |

## 📄 Giấy phép

Đồ án cuối kỳ — Trường Đại học CMC — Khoa CNTT — 2026
