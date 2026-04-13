/**
 * @file app-core.js
 * @description Lớp Shared Core cung cấp các hàm tiện ích dùng chung (Utilities) 
 * cho toàn bộ hệ thống bao gồm cả Front-office (Khách hàng) và Back-office (Admin).
 * Bao gồm: Xác thực (Auth), Định dạng dữ liệu (Formatting), Debouncers, UI Handlers.
 * @version 1.0.0
 * @author Nhóm 1 - Cơ sở Lập trình Web
 */

/**
 * Lấy thông tin phiên đăng nhập hiện tại từ LocalStorage
 * @returns {Object|null} Thông tin session hoặc null nếu chưa đăng nhập
 */
function getSession() {
  try {
    return JSON.parse(localStorage.getItem('milkshop_session'));
  } catch (e) {
    return null;
  }
}

function getRole() {
  var session = getSession();
  return session ? session.role : null;
}

function isAdmin() {
  return getRole() === 'admin';
}

function isCustomer() {
  return getRole() === 'customer';
}

function isLoggedIn() {
  return getSession() !== null;
}

function logout() {
  localStorage.removeItem('milkshop_session');
  window.location.href = window.location.pathname.indexOf('/admin/') > -1
    ? '../login.html'
    : 'login.html';
}

/**
 * Định dạng số tiền sang chuẩn tiền tệ Việt Nam (VND)
 * @param {number} price - Mức giá cần định dạng
 * @returns {string} Mức giá đã format (VD: 100.000 ₫)
 */
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function isExpired(deadline) {
  if (!deadline) return false;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(deadline) < today;
}

function truncateText(text, maxLength) {
  maxLength = maxLength || 80;
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getCategoryBadgeClass(category) {
  var map = {
    'S\u1EEFa t\u01B0\u01A1i': 'badge-sua-tuoi',
    'S\u1EEFa b\u1ED9t': 'badge-sua-bot',
    'S\u1EEFa chua': 'badge-sua-chua',
    'S\u1EEFa h\u1EA1t': 'badge-sua-hat'
  };
  return map[category] || 'badge-sua-tuoi';
}

function getStatusBadgeClass(status) {
  return status === 'C\u00F2n h\u00E0ng' ? 'badge-con-hang' : 'badge-het-hang';
}

/**
 * Kỹ thuật Debounce giúp hoãn việc gọi hàm liên tục, 
 * rất hữu ích tối ưu hóa sự kiện oninput trong ô tìm kiếm.
 * @param {Function} func - Hàm cần thực thi
 * @param {number} wait - Thời gian chờ (ms)
 * @returns {Function} Hàm đã được tối ưu
 */
function debounce(func, wait) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
}

function showToast(message, icon) {
  icon = icon || 'success';
  var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: function (toast) {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  Toast.fire({ icon: icon, title: message });
}

function showStockWarning(result) {
  var stock = result.stock || 0;
  var inCart = result.inCart || 0;
  var canAdd = Math.max(0, stock - inCart);

  var html = '<div style="text-align:left;font-size:0.95rem;line-height:1.8">';
  html += '<i class="fas fa-box-open" style="color:#2563eb"></i> Tồn kho: <strong>' + stock + '</strong> sản phẩm';
  if (inCart > 0) {
    html += '<br><i class="fas fa-shopping-cart" style="color:#f59e0b"></i> Trong giỏ: <strong>' + inCart + '</strong> — còn thêm được <strong style="color:#16a34a">' + canAdd + '</strong>';
  }
  html += '</div>';

  Swal.fire({
    icon: 'warning',
    title: 'Vượt quá tồn kho!',
    html: html,
    confirmButtonText: 'Đã hiểu',
    confirmButtonColor: '#2563eb'
  });
}

function showConfirm(title, text) {
  return Swal.fire({
    title: title,
    html: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: '\u0110\u1ED3ng \u00FD',
    cancelButtonText: 'H\u1EE7y'
  });
}

function initDarkMode() {
  var savedTheme = localStorage.getItem('milkshop_theme') || 'light';
  applyTheme(savedTheme);

  $(document).on('click', '#btnDarkMode', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('milkshop_theme', newTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  var icon = document.querySelector('#btnDarkMode i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

function getRegisteredAccounts() {
  try {
    return JSON.parse(localStorage.getItem('milkshop_accounts') || '[]');
  } catch (e) {
    return [];
  }
}

function getFlashSaleItems() {
  var products = StorageService.getAllProducts();
  var items = {};
  products.forEach(function (p) {
    if (p.discount && p.discount > 0) {
      items[p.id] = p.discount;
    }
  });
  return items;
}

(function initScrollToTop() {
  var btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  btn.title = 'Lên đầu trang';
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 300);
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
