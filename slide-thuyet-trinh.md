# KỊCH BẢN THUYẾT TRÌNH ĐỒ ÁN: MILKSHOP ONLINE (10 SLIDES)

Dưới đây là cấu trúc 10 slide chuyên nghiệp, súc tích dành cho buổi báo cáo.

---

## Slide 1: Tiêu đề & Giới thiệu Nhóm
**Tiêu đề:** Hệ thống Quản lý Bán sữa Trực tuyến - MilkShop Online
**Nội dung:**
*   **Môn học:** Cơ sở Lập trình Web
*   **Giảng viên hướng dẫn:** [Tên GVHD]
*   **Nhóm thực hiện (Nhóm 1):**
    1.  **Phạm Duy An (Nhóm trưởng):** Trang Giới thiệu, Trang Liên hệ, Google Maps.
    2.  **Bùi Đào Đức Anh:** Trang chủ, Design System, Chi tiết sản phẩm, Dữ liệu mẫu.
    3.  **Đỗ Tuấn Anh:** StorageService, Shared Core, Danh sách sản phẩm, Admin sản phẩm.
    4.  **Nguyễn Quang Hiếu:** Giỏ hàng, Đặt hàng, Đăng nhập/Đăng ký, Phân quyền.
    5.  **Phan Văn Hiếu:** Admin Layout, Dashboard, Quản lý đơn hàng, Quản lý coupon.

*(Đã gộp trang giới thiệu thành viên vào slide thông tin đề tài để tối ưu số lượng slide)*

---

## Slide 2: Đặt vấn đề & Mục tiêu dự án
**Tiêu đề:** Tại sao lại chọn đề tài này?
**Nội dung:**
*   **Thực trạng:** Nhu cầu tiêu thụ các sản phẩm từ sữa rất lớn, nhưng khâu quản lý bán hàng thường dùng sổ tay, công cụ thô sơ.
*   **Giải pháp:** Xây dựng website bán hàng trực tuyến chuyên nghiệp.
*   **Mục tiêu chính:**
    *   Tạo ra nền tảng mua sắm sữa tiện lợi cho Khách hàng.
    *   Cung cấp hệ thống quản lý tập trung cho Admin.
    *   Vận hành hoàn toàn bằng JavaScript ở phía client để áp dụng lý thuyết môn học.

---

## Slide 3: Công nghệ sử dụng
**Tiêu đề:** Stack Công nghệ Cốt lõi
**Nội dung:**
*   **Cấu trúc & Giao diện:** 
    *   HTML5 (Cấu trúc ngữ nghĩa - Semantic).
    *   CSS3 (Sử dụng Custom Properties/Variables).
*   **Xử lý Logic (Không dùng Framework):**
    *   Vanilla JavaScript (ES6+).
*   **Lưu trữ dữ liệu:**
    *   Web Storage API (LocalStorage).
*   **Thư viện hỗ trợ:** SweetAlert2 (Thông báo Popup), Chart.js (Vẽ biểu đồ thống kê), Font Awesome (Icon).

---

## Slide 4: Kiến trúc hệ thống
**Tiêu đề:** Kiến trúc phần mềm 4 tầng
**Nội dung:**
*(Gợi ý chèn ảnh: Mở file `baocao.md`, copy đoạn code PlantUML của `Sơ đồ kiến trúc 4 tầng` dán vào trang web plantuml.com để lấy ảnh PNG dán vào slide)*
*   **Tầng 1 - Presentation:** 12 thẻ HTML, giao diện trực tiếp tương tác với người dùng.
*   **Tầng 2 - Business Logic:** 12 module xử lý nghiệp vụ riêng biệt cho từng trang.
*   **Tầng 3 - Shared Core:** Các chức năng dùng chung (`app-core.js`, Auth, Navigation).
*   **Tầng 4 - Data Access:** Module `StorageService` làm nhiệm vụ truy xuất dữ liệu từ LocalStorage.

---

## Slide 5: Chức năng Khách hàng (Customer)
**Tiêu đề:** Trải nghiệm Khách hàng (Front-office)
**Nội dung:**
*(Gợi ý chèn ảnh: Chụp màn hình file `index.html` lúc web đang chạy hoặc chụp màn hình lúc đang ở `cart.html`)*
*   **Auth:** Đăng ký, Đăng nhập.
*   **Khám phá:** Duyệt danh sách SP, tìm kiếm realtime (debounce 300ms), bộ lọc và sắp xếp.
*   **Mua sắm:** Thêm giỏ hàng, cập nhật số lượng, kiểm tra tồn kho.
*   **Thanh toán:** Áp mã giảm giá, xác nhận thông tin đơn hàng và Checkout.
*   **Tương tác:** Thêm Yêu thích (Wishlist), Chấm sao đánh giá SP.

---

## Slide 6: Chức năng Quản trị (Admin)
**Tiêu đề:** Quản lý cửa hàng (Back-office)
**Nội dung:**
*(Gợi ý chèn ảnh: Chụp màn hình file `admin/index.html` hiển thị các biểu đồ thống kê)*
*   **Dashboard:** Tổng quan số liệu (Sản phẩm, đơn hàng, trạng thái tồn kho) thông qua biểu đồ Chart.js.
*   **Quản lý Sản phẩm & Tồn kho:** Danh sách, Thêm mới, Chỉnh sửa, Xóa sản phẩm.
*   **Xử lý Đơn hàng:** Cập nhật các trạng thái (Chờ xử lý -> Đang giao -> Hoàn thành).
*   **Công cụ Marketing:** Quản lý, đóng/mở mã giảm giá (Coupons).
*   **Công cụ Data:** Xuất, nhập toàn bộ cơ sở dữ liệu hệ thống (Export/Import dạng JSON).

---

## Slide 7: Điểm nhấn Kỹ thuật (Technical Highlights)
**Tiêu đề:** Yếu tố Công nghệ Nổi bật
**Nội dung:**
*   **Mô hình IIFE (Immediately Invoked Function Expression):**
    *   Đảm bảo tính đóng gói (encapsulation) trong JS.
    *   Tránh xung đột tên biến ở Global Scope.
*   **Hệ thống Database giả lập:**
    *   Xây dựng cấu trúc đa bảng: Accounts, Products, Orders, Cart, Coupons, Ratings.
    *   Tự động sinh dữ liệu mẫu (Auto Seed) ở lần truy cập đầu.
*   **Tính toàn vẹn Dữ liệu:** Đồng bộ trừ số lượng kho sau khi đặt hàng thành công.

---

## Slide 8: Kỹ thuật Giao diện (UI/UX)
**Tiêu đề:** Tối ưu hóa Trải nghiệm Người dùng
**Nội dung:**
*   **Tự động Phân quyền UI:** Điều hướng Customer về Trang chủ và Admin về Dashboard sau đăng nhập.
*   **Chế độ Tối (Dark Mode):** 
    *   Thao tác chuyển đổi tức thì không cần tải lại trang.
    *   CSS Variables động cho phép tự động phản hồi theo theme.
*   **Thiết kế Đáp ứng (Responsive Design):**
    *   Hiển thị linh hoạt 1-4 cột tùy thiết bị.
    *   Menu Mobile (Hamburger) trực quan.

---

## Slide 9: Kiểm thử & Đánh giá (Testing)
**Tiêu đề:** Đảm bảo Chất lượng
**Nội dung:**
*   **Kết quả Kiểm thử Chức năng:**
    *   Pass 30/30 kịch bản kiểm thử ở môi trường Local.
    *   Chặn chặt chẽ các hành vi mua lố kho, mã giảm giá hết hạn, đơn chưa đạt giá trị mua tối thiểu.
*   **Kiểm thử Đa nền tảng:**
    *   Giao diện giữ nguyên bố cục trên các trình duyệt Chrome, Edge, Firefox, Safari.
    *   Hiển thị tốt từ Tablet đến Mobile màn hình hẹp (320px).

---

## Slide 10: Trình diễn Demo & Lời kết
**Tiêu đề:** Tổng kết & Live Demo
**Nội dung:**
*   **Kết quả đạt được:** Hoàn thiện 100% ứng dụng MilkShop Online thuần JS đáp ứng đầy đủ yêu cầu thương mại điện tử cơ bản.
*   **Định hướng tương lai:**
    *   Tích hợp Backend và Database (MySQL/MongoDB).
    *   Bảo mật quy trình thanh toán qua bên thứ ba (VNPay, Momo).
*   **Dành thời gian DEMO Ứng dụng thực tế và trả lời câu hỏi (Q&A).** 
    *   *Lời cảm ơn đến Thầy và Hội đồng.*
