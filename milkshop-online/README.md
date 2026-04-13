# 🥛 MilkShop Online

> Website quản lý & bán sữa trực tuyến — Đồ án cuối kỳ môn **Cơ sở Lập trình Web**  
> Trường Đại học CMC — Khoa CNTT&TT — Nhóm 1

---

## 📋 Giới thiệu

MilkShop Online là hệ thống website bán sữa trực tuyến với đầy đủ chức năng cho **hai vai trò** (Admin & Khách hàng). Website được phát triển hoàn toàn bằng công nghệ front-end, lưu trữ dữ liệu bằng LocalStorage — không cần backend hay database server.

### Điểm nổi bật

- 🔐 **Phân quyền Admin / Khách hàng** — Giao diện và chức năng riêng biệt
- 🛒 **Quy trình mua hàng hoàn chỉnh** — Duyệt sản phẩm → Giỏ hàng → Mã giảm giá → Đặt hàng
- 📊 **Dashboard Admin chuyên nghiệp** — Quản lý sản phẩm, đơn hàng, coupon, thống kê
- 🌙 **Dark Mode** — Hỗ trợ giao diện sáng/tối trên toàn bộ website
- 📱 **Responsive** — Tương thích Mobile / Tablet / Desktop

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| HTML5 | — | Cấu trúc trang |
| CSS3 (Custom Properties) | — | Giao diện, Dark Mode, biến CSS toàn cục |
| JavaScript ES6+ | — | Logic xử lý, DOM manipulation |
| jQuery | 3.7.1 | Xử lý DOM, events |
| Bootstrap | 5.3.3 | Responsive layout, modal, dropdown |
| Font Awesome | 6.5.1 | Icon hệ thống |
| Google Fonts (Inter) | 300–900 | Typography hiện đại |
| Chart.js | 4.4.1 | Biểu đồ thống kê (Bar, Doughnut) |
| SweetAlert2 | 11 | Thông báo & xác nhận đẹp |
| LocalStorage API | — | Lưu trữ dữ liệu client-side |

---

## 📂 Cấu trúc dự án

```
milkshop-online/
│
├── index.html                  # Trang chủ (Hero Carousel, Flash Sale, Sản phẩm nổi bật)
├── products.html               # Danh sách sản phẩm (Filter, Sort, Pagination)
├── product-detail.html         # Chi tiết sản phẩm (Rating, Related Products)
├── cart.html                   # Giỏ hàng & Đặt hàng (Coupon)
├── about.html                  # Giới thiệu cửa hàng
├── contact.html                # Liên hệ (Form + Google Maps)
├── login.html                  # Đăng nhập
├── register.html               # Đăng ký tài khoản
│
├── admin/                      # ── KÊNH QUẢN TRỊ ──
│   ├── index.html              # Dashboard (Thống kê tổng quan)
│   ├── products.html           # Quản lý sản phẩm (CRUD)
│   ├── orders.html             # Quản lý đơn hàng
│   ├── coupons.html            # Quản lý mã giảm giá
│   └── statistics.html         # Thống kê & Biểu đồ & Lịch HSD
│
└── assets/
    ├── css/                    # ── 10 FILE CSS ──
    │   ├── common.css          # Style gốc: navbar, footer, dark mode, :root variables
    │   ├── home.css            # Trang chủ: hero slider, flash sale, featured
    │   ├── products.css        # Danh sách SP: filter sidebar, card, badges
    │   ├── product-detail.css  # Chi tiết SP: gallery, trust badges
    │   ├── cart.css            # Giỏ hàng: coupon, summary
    │   ├── about.css           # Giới thiệu: timeline, team cards
    │   ├── contact.css         # Liên hệ: form, map, info cards
    │   ├── auth.css            # Đăng ký: form styling
    │   ├── login.css           # Đăng nhập: split layout
    │   ├── admin.css           # Admin: sidebar, topbar, dashboard, tables
    │   └── statistics.css      # Thống kê: charts, calendar, deadline list
    │
    ├── js/                     # ── 16 FILE JS ──
    │   │
    │   │  ── Core Layer ──
    │   ├── storageService.js   # IIFE — CRUD LocalStorage, cart, orders, coupons, export/import
    │   ├── shared.js           # Auth guard, formatPrice, debounce, SweetAlert2 wrappers
    │   ├── main.js             # Navbar, footer, cart badge, wishlist, scroll-to-top
    │   │
    │   │  ── Customer Pages ──
    │   ├── home.js             # Hero carousel, flash sale, featured/bestseller/new arrivals
    │   ├── products.js         # Filter/sort/pagination, dual-range price, brand filter
    │   ├── product-detail.js   # Detail render, qty control, related products
    │   ├── cart.js             # Cart CRUD, coupon apply/validate, cross-tab sync
    │   ├── contact.js          # Contact form validation & localStorage save
    │   ├── login.js            # Login authentication + redirect
    │   ├── register.js         # Registration with full validation
    │   │
    │   │  ── Admin Pages ──
    │   ├── admin.js            # Sidebar, topbar, auth guard (admin only)
    │   ├── admin-dashboard.js  # Stats cards, expiring products, recent orders
    │   ├── admin-products.js   # Product CRUD table + advanced validation
    │   ├── admin-orders.js     # Order management + search
    │   ├── admin-coupons.js    # Coupon CRUD + toggle status
    │   └── statistics.js       # Chart.js charts, deadline list, calendar view
    │
    └── img/                    # ── HÌNH ẢNH ──
        ├── logo-milkshop.png   # Logo website
        ├── hero-banner-*.png   # Banner trang chủ
        ├── no-image.svg        # Placeholder ảnh lỗi
        ├── *.jpg               # Ảnh sản phẩm sữa
        └── *.png               # Icon social, payment methods
```

---

## ⚡ Chức năng chính

### 🛍️ Khách hàng

| Chức năng | Mô tả |
|-----------|-------|
| **Duyệt sản phẩm** | Grid view, filter theo danh mục / giá / nhãn hàng / trạng thái |
| **Tìm kiếm** | Realtime search với debounce 300ms |
| **Flash Sale** | Countdown timer, giảm giá ngẫu nhiên mỗi ngày |
| **Chi tiết sản phẩm** | Ảnh lớn, rating, trust badges, sản phẩm liên quan |
| **Giỏ hàng** | Thêm/xóa/cập nhật số lượng, áp dụng mã giảm giá |
| **Mã giảm giá** | Nhập mã hoặc click chip gợi ý, validate tự động |
| **Đặt hàng** | Xác nhận đặt hàng với SweetAlert2 |
| **Wishlist** | Yêu thích sản phẩm (lưu localStorage) |
| **Đăng ký / Đăng nhập** | Form validation đầy đủ, phân quyền |

### 🔧 Admin Panel

| Chức năng | Mô tả |
|-----------|-------|
| **Dashboard** | Tổng quan: tổng SP, còn/hết hàng, đơn hàng, doanh thu |
| **Quản lý sản phẩm** | CRUD đầy đủ, validation NSX/HSD, trùng tên, phân trang |
| **Quản lý đơn hàng** | Xem, tìm kiếm, xóa đơn hàng |
| **Quản lý mã giảm giá** | CRUD coupon (% / cố định), bật/tắt, theo dõi lượt dùng |
| **Thống kê** | Biểu đồ Chart.js (sản phẩm/danh mục, trạng thái, giá TB) |
| **Lịch HSD** | Calendar view hiển thị sản phẩm sắp hết hạn |
| **Export / Import** | Xuất/nhập dữ liệu JSON |

---

## 🎁 Tính năng nâng cao (Bonus)

- 🌙 **Dark Mode / Light Mode** — Toggle trên navbar, áp dụng toàn bộ website + admin
- 📊 **Biểu đồ thống kê** — Chart.js (cột, tròn, giá trung bình theo danh mục)
- 📅 **Lịch hạn sử dụng** — Calendar view với color-coded events
- ⚡ **Flash Sale** — Countdown timer, random discount mỗi ngày
- ❤️ **Wishlist** — Yêu thích sản phẩm (localStorage)
- 🎫 **Mã giảm giá (Coupon)** — Hỗ trợ % và cố định, validate đơn tối thiểu
- 🔐 **Phân quyền** — Admin Panel riêng biệt, auth guard
- 📝 **Đăng ký tài khoản** — Validation phone VN, trùng username, terms
- 🖱️ **Drag & Drop** — Kéo thả đổi trạng thái sản phẩm
- 📤 **Export / Import JSON** — Sao lưu & khôi phục toàn bộ dữ liệu
- 📱 **Responsive** — Mobile / Tablet / Desktop
- 🔀 **Grid / List view** — Chuyển đổi chế độ xem sản phẩm
- 🔝 **Scroll to Top** — Nút cuộn lên đầu trang
- 🔔 **Toast Notifications** — Thông báo nhẹ không reload
- 🗺️ **Google Maps** — Bản đồ vị trí cửa hàng trang Liên hệ
- 🔄 **Cross-tab Sync** — Giỏ hàng & coupon đồng bộ giữa các tab

---

## 🚀 Cách chạy

1. **Clone repo:**
   ```bash
   git clone https://github.com/Anpham120/milkshop-online.git
   cd milkshop-online
   ```

2. **Mở `index.html`** bằng trình duyệt (hoặc dùng **Live Server** trong VS Code)

3. **Tài khoản demo:**

   | Vai trò | Username | Password | Quyền |
   |---------|----------|----------|-------|
   | Admin | `admin` | `123456` | CRUD sản phẩm, đơn hàng, coupon, thống kê |
   | Khách hàng | `khach` | `123456` | Xem SP, mua hàng, giỏ hàng, wishlist |

4. **Hoặc tự đăng ký** tài khoản mới tại trang `register.html`

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
├────────────────────┬────────────────────────────────┤
│   Customer Pages   │         Admin Pages            │
│ (index, products,  │ (dashboard, products, orders,  │
│  cart, contact...) │  coupons, statistics)           │
├────────────────────┴────────────────────────────────┤
│              shared.js + main.js                    │
│        (Auth, Utils, Navbar, Footer, Dark Mode)     │
├─────────────────────────────────────────────────────┤
│              storageService.js (IIFE)               │
│   (CRUD Products, Cart, Orders, Coupons, Stats)     │
├─────────────────────────────────────────────────────┤
│                  LocalStorage                       │
│  milkshop_products | milkshop_cart | milkshop_orders│
│  milkshop_coupons  | milkshop_session | ...         │
└─────────────────────────────────────────────────────┘
```

---

## 👥 Thành viên nhóm

| STT | Họ tên | MSSV | Phụ trách |
|-----|--------|------|-----------|
| 1 | Phạm Duy An (Nhóm trưởng) | BIT240002 | Trang chủ, Flash Sale, Wishlist, Sản phẩm nổi bật |
| 2 | Bùi Đào Đức Anh | BIT240025 | CRUD sản phẩm, StorageService, Filter/Sort, Chi tiết SP |
| 3 | Đỗ Tuấn Anh | BIT240015 | Giỏ hàng, Đặt hàng, Đăng nhập/Đăng ký, Phân quyền |
| 4 | Nguyễn Quang Hiếu | BIT240091 | Layout chung, Navbar, Footer, Dark Mode, Responsive, Giới thiệu |
| 5 | Phan Văn Hiếu | BIT240094 | Thống kê, Biểu đồ Chart.js, Lịch hạn sử dụng, Liên hệ |

---

## 📄 Giấy phép

Đồ án cuối kỳ — Trường Đại học CMC — Khoa CNTT&TT — 2026
