/* ====================================
   MAIN.JS — MilkShop Online
   Thanh điều hướng, Chân trang, Chế độ tối,
   Phân quyền, Hàm tiện ích
   ==================================== */

$(document).ready(function () {
  'use strict';

  // --- Hiển thị thanh điều hướng ---
  renderNavbar();

  // --- Hiển thị chân trang ---
  renderFooter();

  // --- Khởi tạo chế độ tối ---
  initDarkMode();

  // --- Cập nhật huy hiệu giỏ hàng ---
  updateCartBadge();

  // --- Đánh dấu trang hiện tại ---
  setActiveNavLink();

  // --- Hiệu ứng cuộn thanh điều hướng ---
  initNavbarScroll();

  // --- Bảo vệ trang theo quyền ---
  protectPage();
});

// ====================================
// HÀM XÁC THỰC & PHÂN QUYỀN
// ====================================
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
  window.location.href = 'login.html';
}

// ====================================
// BẢO VỆ TRANG THEO QUYỀN
// ====================================
function protectPage() {
  var page = getCurrentPage();
  var role = getRole();

  // Trang chỉ dành cho admin
  if ((page === 'statistics' || page === 'calendar') && role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  // Giỏ hàng — cần đăng nhập
  if (page === 'cart' && role !== 'customer' && role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }
}

// ====================================
// THANH ĐIỀU HƯỚNG
// ====================================
function renderNavbar() {
  var role = getRole();
  var session = getSession();

  var navItems = '';

  // Trang chủ — luôn hiển thị
  navItems += '<li class="nav-item">' +
    '<a class="nav-link" href="index.html" data-page="index">' +
      '<i class="fas fa-home me-1"></i> Trang ch\u1EE7' +
    '</a></li>';

  // Sản phẩm — luôn hiển thị
  navItems += '<li class="nav-item">' +
    '<a class="nav-link" href="products.html" data-page="products">' +
      '<i class="fas fa-box me-1"></i> S\u1EA3n ph\u1EA9m' +
    '</a></li>';

  // Giỏ hàng — chỉ khách hàng
  if (role === 'customer') {
    navItems += '<li class="nav-item position-relative">' +
      '<a class="nav-link" href="cart.html" data-page="cart">' +
        '<i class="fas fa-shopping-cart me-1"></i> Gi\u1ECF h\u00E0ng' +
        '<span class="cart-badge" id="cartBadge" style="display:none;">0</span>' +
      '</a></li>';
  }

  // Đơn hàng — chỉ admin
  if (role === 'admin') {
    navItems += '<li class="nav-item">' +
      '<a class="nav-link" href="cart.html" data-page="cart">' +
        '<i class="fas fa-receipt me-1"></i> \u0110\u01A1n h\u00E0ng' +
      '</a></li>';
  }

  // Thống kê — chỉ admin
  if (role === 'admin') {
    navItems += '<li class="nav-item">' +
      '<a class="nav-link" href="statistics.html" data-page="statistics">' +
        '<i class="fas fa-chart-bar me-1"></i> Th\u1ED1ng k\u00EA' +
      '</a></li>';
  }

  // Lịch — chỉ admin
  if (role === 'admin') {
    navItems += '<li class="nav-item">' +
      '<a class="nav-link" href="calendar.html" data-page="calendar">' +
        '<i class="fas fa-calendar-alt me-1"></i> L\u1ECBch' +
      '</a></li>';
  }

  // Giới thiệu — luôn hiển thị
  navItems += '<li class="nav-item">' +
    '<a class="nav-link" href="about.html" data-page="about">' +
      '<i class="fas fa-info-circle me-1"></i> Gi\u1EDBi thi\u1EC7u' +
    '</a></li>';

  // Nút đăng nhập / đăng xuất
  var authBtn = '';
  if (session) {
    authBtn = '<div class="dropdown">' +
      '<button class="btn btn-sm btn-outline-milkshop dropdown-toggle" data-bs-toggle="dropdown">' +
        '<i class="fas fa-user-circle me-1"></i>' + session.fullName +
      '</button>' +
      '<ul class="dropdown-menu dropdown-menu-end">' +
        '<li><span class="dropdown-item-text text-muted"><i class="fas fa-id-badge me-1"></i>' +
          (role === 'admin' ? 'Qu\u1EA3n tr\u1ECB vi\u00EAn' : 'Kh\u00E1ch h\u00E0ng') + '</span></li>' +
        '<li><hr class="dropdown-divider"></li>' +
        '<li><a class="dropdown-item" href="#" id="btnLogout"><i class="fas fa-sign-out-alt me-1"></i>\u0110\u0103ng xu\u1EA5t</a></li>' +
      '</ul>' +
    '</div>';
  } else {
    authBtn = '<a href="login.html" class="btn btn-sm btn-primary-milkshop">' +
      '<i class="fas fa-sign-in-alt me-1"></i>\u0110\u0103ng nh\u1EADp' +
    '</a>';
  }

  var navbar = '<nav class="navbar navbar-expand-lg navbar-milkshop">' +
    '<div class="container">' +
      '<a class="navbar-brand" href="index.html"><span>MilkShop</span></a>' +
      '<button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">' +
        '<span class="navbar-toggler-icon"></span>' +
      '</button>' +
      '<div class="collapse navbar-collapse" id="navbarMain">' +
        '<ul class="navbar-nav ms-auto me-3 align-items-center gap-1">' +
          navItems +
        '</ul>' +
        '<div class="d-flex align-items-center gap-2">' +
          '<button class="btn-dark-mode" id="btnDarkMode" title="Chuy\u1EC3n ch\u1EBF \u0111\u1ED9 s\u00E1ng/t\u1ED1i">' +
            '<i class="fas fa-moon"></i>' +
          '</button>' +
          authBtn +
        '</div>' +
      '</div>' +
    '</div>' +
  '</nav>';

  var navContainer = document.getElementById('navbar-placeholder');
  if (navContainer) {
    navContainer.innerHTML = navbar;
  } else {
    document.body.insertAdjacentHTML('afterbegin', navbar);
  }

  // Xử lý đăng xuất
  $(document).on('click', '#btnLogout', function (e) {
    e.preventDefault();
    logout();
  });
}

// ====================================
// CHÂN TRANG
// ====================================
function renderFooter() {
  var role = getRole();
  var quickLinks = '';

  quickLinks += '<li class="mb-2"><a href="index.html">Trang ch\u1EE7</a></li>';
  quickLinks += '<li class="mb-2"><a href="products.html">S\u1EA3n ph\u1EA9m</a></li>';

  if (role === 'customer') {
    quickLinks += '<li class="mb-2"><a href="cart.html">Gi\u1ECF h\u00E0ng</a></li>';
  }
  if (role === 'admin') {
    quickLinks += '<li class="mb-2"><a href="statistics.html">Th\u1ED1ng k\u00EA</a></li>';
  }
  quickLinks += '<li class="mb-2"><a href="about.html">Gi\u1EDBi thi\u1EC7u</a></li>';

  var footer = '<footer class="footer-milkshop">' +
    '<div class="container">' +
      '<div class="row g-4">' +
        '<div class="col-lg-4 col-md-6">' +
          '<h5>MilkShop</h5>' +
          '<p>H\u1EC7 th\u1ED1ng qu\u1EA3n l\u00FD b\u00E1n s\u1EEFa tr\u1EF1c tuy\u1EBFn \u2014 cung c\u1EA5p s\u1EA3n ph\u1EA9m s\u1EEFa ch\u1EA5t l\u01B0\u1EE3ng cao, \u0111\u1EA3m b\u1EA3o ngu\u1ED3n g\u1ED1c r\u00F5 r\u00E0ng.</p>' +
        '</div>' +
        '<div class="col-lg-2 col-md-6">' +
          '<h5>Li\u00EAn k\u1EBFt</h5>' +
          '<ul class="list-unstyled">' + quickLinks + '</ul>' +
        '</div>' +
        '<div class="col-lg-3 col-md-6">' +
          '<h5>Li\u00EAn h\u1EC7</h5>' +
          '<ul class="list-unstyled">' +
            '<li class="mb-2"><i class="fas fa-map-marker-alt me-2"></i>V\u1EA1n Ph\u00FAc, H\u00E0 \u0110\u00F4ng, H\u00E0 N\u1ED9i</li>' +
            '<li class="mb-2"><i class="fas fa-phone me-2"></i>0868 427 362</li>' +
            '<li class="mb-2"><i class="fas fa-envelope me-2"></i>apham5206@gmail.com</li>' +
          '</ul>' +
        '</div>' +
        '<div class="col-lg-3 col-md-6">' +
          '<h5>Gi\u1EDD m\u1EDF c\u1EEDa</h5>' +
          '<ul class="list-unstyled">' +
            '<li class="mb-2">Th\u1EE9 2 - Th\u1EE9 6: 8:00 - 21:00</li>' +
            '<li class="mb-2">Th\u1EE9 7 - CN: 9:00 - 20:00</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<p>&copy; 2026 MilkShop. Nh\u00F3m 1 \u2014 C\u01A1 s\u1EDF L\u1EADp tr\u00ECnh Web.</p>' +
      '</div>' +
    '</div>' +
  '</footer>';

  var footerContainer = document.getElementById('footer-placeholder');
  if (footerContainer) {
    footerContainer.innerHTML = footer;
  } else {
    document.body.insertAdjacentHTML('beforeend', footer);
  }
}

// ====================================
// CHẾ ĐỘ TỐI
// ====================================
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

// ====================================
// HUY HIỆU GIỎ HÀNG
// ====================================
function updateCartBadge() {
  if (!isCustomer()) return;
  var cart = JSON.parse(localStorage.getItem('milkshop_cart') || '[]');
  var totalItems = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
  var badge = document.getElementById('cartBadge');
  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems > 99 ? '99+' : totalItems;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

// ====================================
// ĐÁNH DẤU LINK TRANG HIỆN TẠI
// ====================================
function setActiveNavLink() {
  var page = getCurrentPage();
  document.querySelectorAll('.nav-link[data-page]').forEach(function (link) {
    if (link.getAttribute('data-page') === page) {
      link.classList.add('active');
    }
  });
}

function getCurrentPage() {
  var path = window.location.pathname;
  var filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
  return filename || 'index';
}

// ====================================
// HIỆU ỨNG CUỘN THANH ĐIỀU HƯỚNG
// ====================================
function initNavbarScroll() {
  $(window).on('scroll', function () {
    var navbar = document.querySelector('.navbar-milkshop');
    if (!navbar) return;
    if (window.scrollY > 10) {
      navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      navbar.style.boxShadow = 'var(--shadow-sm)';
    }
  });
}

// ====================================
// HÀM TIỆN ÍCH
// ====================================

// Định dạng giá tiền VND
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

// Định dạng ngày
function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Kiểm tra sản phẩm hết hạn
function isExpired(deadline) {
  if (!deadline) return false;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(deadline) < today;
}

// Hiển thị thông báo toast (SweetAlert2)
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

// Hộp thoại xác nhận (SweetAlert2)
function showConfirm(title, text) {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: '\u0110\u1ED3ng \u00FD',
    cancelButtonText: 'H\u1EE7y'
  });
}

// Chống gọi liên tục (Debounce)
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

// Lấy class huy hiệu loại sữa
function getCategoryBadgeClass(category) {
  var map = {
    'S\u1EEFa t\u01B0\u01A1i': 'badge-sua-tuoi',
    'S\u1EEFa b\u1ED9t': 'badge-sua-bot',
    'S\u1EEFa chua': 'badge-sua-chua',
    'S\u1EEFa h\u1EA1t': 'badge-sua-hat'
  };
  return map[category] || 'badge-sua-tuoi';
}

// Lấy class huy hiệu trạng thái
function getStatusBadgeClass(status) {
  return status === 'C\u00F2n h\u00E0ng' ? 'badge-con-hang' : 'badge-het-hang';
}

// Cắt ngắn văn bản
function truncateText(text, maxLength) {
  maxLength = maxLength || 80;
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
