/**
 * @file main.js
 * @description Controller chính cho giao diện Khách hàng (Front-office).
 * Quản lý vòng đời trang, render cấu trúc dùng chung (Navbar, Footer), 
 * điều hướng phân quyền (Auth Guard) và xử lý các sự kiện DOM cơ bản.
 * Dựa trên app-core.js.
 * @version 1.0.0
 * @author Nhóm 1 - Cơ sở Lập trình Web
 */

$(document).ready(function () {
  'use strict';

  var role = getRole();

  if (role === 'admin') {
    renderAdminViewBar();
    initDarkMode();
    return;
  }

  renderNavbar();
  renderFooter();
  initDarkMode();
  updateCartBadge();
  setActiveNavLink();
  initNavbarScroll();
  protectPage();
});

/**
 * Bảo vệ trang theo phân quyền.
 * Nếu tài khoản không phải là 'customer' mà truy cập trang giỏ hàng/thanh toán,
 * hệ thống sẽ tự động điều hướng về login.html để đảm bảo an toàn nghiệp vụ.
 */
function protectPage() {
  var page = getCurrentPage();
  if (page === 'cart' && getRole() !== 'customer') {
    window.location.href = 'login.html';
  }
}

/**
 * Render Navbar (Thanh điều hướng) tự động.
 * Sinh DOM HTML cho Menu và xử lý trạng thái Đăng nhập / Đăng xuất của Session hiện tại.
 */
function renderNavbar() {
  var session = getSession();

  var navItems =
    '<li class="nav-item"><a class="nav-link" href="index.html" data-page="index"><i class="fas fa-home me-1"></i> Trang ch\u1EE7</a></li>' +
    '<li class="nav-item"><a class="nav-link" href="products.html" data-page="products"><i class="fas fa-box me-1"></i> S\u1EA3n ph\u1EA9m</a></li>' +
    '<li class="nav-item position-relative"><a class="nav-link" href="cart.html" data-page="cart"><i class="fas fa-shopping-cart me-1"></i> Gi\u1ECF h\u00E0ng<span class="cart-badge" id="cartBadge" style="display:none;">0</span></a></li>' +
    '<li class="nav-item"><a class="nav-link" href="about.html" data-page="about"><i class="fas fa-info-circle me-1"></i> Gi\u1EDBi thi\u1EC7u</a></li>' +
    '<li class="nav-item"><a class="nav-link" href="contact.html" data-page="contact"><i class="fas fa-headset me-1"></i> Li\u00EAn h\u1EC7</a></li>';

  var authBtn = session
    ? '<div class="dropdown">' +
        '<button class="btn btn-sm btn-outline-milkshop dropdown-toggle" data-bs-toggle="dropdown"><i class="fas fa-user-circle me-1"></i>' + session.fullName + '</button>' +
        '<ul class="dropdown-menu dropdown-menu-end">' +
          '<li><span class="dropdown-item-text text-muted"><i class="fas fa-id-badge me-1"></i>Kh\u00E1ch h\u00E0ng</span></li>' +
          '<li><hr class="dropdown-divider"></li>' +
          '<li><a class="dropdown-item" href="#" id="btnLogout"><i class="fas fa-sign-out-alt me-1"></i>\u0110\u0103ng xu\u1EA5t</a></li>' +
        '</ul></div>'
    : '<a href="login.html" class="btn btn-sm btn-primary-milkshop"><i class="fas fa-sign-in-alt me-1"></i>\u0110\u0103ng nh\u1EADp</a>';

  var navbar =
    '<nav class="navbar navbar-expand-lg navbar-milkshop"><div class="container">' +
      '<a class="navbar-brand" href="index.html"><img src="assets/img/logo-milkshop.png" alt="MilkShop" class="navbar-logo"><span>MilkShop</span></a>' +
      '<button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain"><span class="navbar-toggler-icon"></span></button>' +
      '<div class="collapse navbar-collapse" id="navbarMain">' +
        '<ul class="navbar-nav ms-auto me-3 align-items-center gap-1">' + navItems + '</ul>' +
        '<div class="d-flex align-items-center gap-2">' +
          '<button class="btn-dark-mode" id="btnDarkMode" title="Ch\u1EBF \u0111\u1ED9 s\u00E1ng/t\u1ED1i"><i class="fas fa-moon"></i></button>' +
          authBtn +
        '</div>' +
      '</div>' +
    '</div></nav>';

  var el = document.getElementById('navbar-placeholder');
  if (el) el.innerHTML = navbar;
  else document.body.insertAdjacentHTML('afterbegin', navbar);

  $(document).on('click', '#btnLogout', function (e) {
    e.preventDefault();
    logout();
  });
}

function renderFooter() {
  var footer =
    '<footer class="footer-milkshop"><div class="container"><div class="row g-3">' +

      '<div class="col-lg-4 col-md-6">' +
        '<div class="footer-brand"><img src="assets/img/logo-milkshop.png" alt="MilkShop Logo" class="footer-logo"></div>' +
        '<ul class="footer-info-list">' +
          '<li><i class="fas fa-map-marker-alt"></i>V\u1EA1n Ph\u00FAc, H\u00E0 \u0110\u00F4ng, H\u00E0 N\u1ED9i</li>' +
          '<li><i class="fas fa-phone"></i>0868 427 362</li>' +
          '<li><i class="fas fa-envelope"></i>apham5206@gmail.com</li>' +
        '</ul>' +
        '<div class="footer-socials">' +
          '<a href="#" title="Facebook"><img src="assets/img/facebook.png" alt="Facebook"></a>' +
          '<a href="#" title="Instagram"><img src="assets/img/instagram.png" alt="Instagram"></a>' +
          '<a href="#" title="Shopee"><img src="assets/img/shopee.png" alt="Shopee"></a>' +
          '<a href="#" title="TikTok"><img src="assets/img/tiktok.png" alt="TikTok"></a>' +
        '</div>' +
        '<div class="footer-newsletter">' +
          '<p class="newsletter-title"><i class="fas fa-paper-plane me-1"></i>\u0110\u0103ng k\u00FD nh\u1EADn khuy\u1EBFn m\u00E3i</p>' +
          '<form class="newsletter-form" id="newsletterForm">' +
            '<input type="email" placeholder="Email c\u1EE7a b\u1EA1n..." required id="newsletterEmail">' +
            '<button type="submit"><i class="fas fa-arrow-right"></i></button>' +
          '</form>' +
        '</div>' +
      '</div>' +

      '<div class="col-lg-2 col-md-3">' +
        '<h5 class="footer-heading">Ch\u00EDnh S\u00E1ch</h5>' +
        '<ul class="footer-links">' +
          '<li><a href="#">Ch\u00EDnh s\u00E1ch b\u1EA3o m\u1EADt</a></li>' +
          '<li><a href="#">Ch\u00EDnh s\u00E1ch ho\u00E0n tr\u1EA3</a></li>' +
          '<li><a href="#">Ch\u00EDnh s\u00E1ch v\u1EADn chuy\u1EC3n</a></li>' +
          '<li><a href="#">Ch\u00EDnh s\u00E1ch thanh to\u00E1n</a></li>' +
        '</ul>' +
      '</div>' +

      '<div class="col-lg-3 col-md-3">' +
        '<h5 class="footer-heading">H\u1ED7 Tr\u1EE3</h5>' +
        '<ul class="footer-links">' +
          '<li><a href="#">H\u01B0\u1EDBng d\u1EABn mua h\u00E0ng</a></li>' +
          '<li><a href="#">H\u01B0\u1EDBng d\u1EABn thanh to\u00E1n</a></li>' +
          '<li><a href="#">H\u01B0\u1EDBng d\u1EABn v\u1EADn chuy\u1EC3n</a></li>' +
          '<li><a href="#">H\u01B0\u1EDBng d\u1EABn \u0111\u1ED5i tr\u1EA3</a></li>' +
        '</ul>' +
      '</div>' +

      '<div class="col-lg-3 col-md-6">' +
        '<h5 class="footer-heading">Gi\u1EDD M\u1EDF C\u1EEDa</h5>' +
        '<ul class="footer-links">' +
          '<li><i class="far fa-clock me-1"></i>Th\u1EE9 2 - Th\u1EE9 6: 8:00 - 21:00</li>' +
          '<li><i class="far fa-clock me-1"></i>Th\u1EE9 7 - CN: 9:00 - 20:00</li>' +
        '</ul>' +
        '<h5 class="footer-heading mt-2">Thanh To\u00E1n</h5>' +
        '<div class="footer-payments">' +
          '<img src="assets/img/visa.png" alt="Visa" title="Visa">' +
          '<img src="assets/img/mastercard.png" alt="MasterCard" title="MasterCard">' +
          '<img src="assets/img/momo.png" alt="Momo" title="Momo">' +
          '<img src="assets/img/vnpay.png" alt="VNPay" title="VNPay">' +
          '<img src="assets/img/shopeepay.png" alt="ShopeePay" title="ShopeePay">' +
          '<img src="assets/img/payment-cod.jpg" alt="Ship COD" title="Ship COD">' +
        '</div>' +
        '<div class="footer-map">' +
          '<iframe src="https://maps.google.com/maps?q=V%E1%BA%A1n+Ph%C3%BAc,+H%C3%A0+%C4%90%C3%B4ng,+H%C3%A0+N%E1%BB%99i&output=embed" width="100%" height="70" style="border:0;border-radius:6px;margin-top:8px" allowfullscreen="" loading="lazy"></iframe>' +
        '</div>' +
      '</div>' +

    '</div>' +
    '<div class="footer-bottom"><div class="footer-bottom-inner">' +
      '<p>\u00A9 2026 MilkShop. Nh\u00F3m 1 \u2014 C\u01A1 s\u1EDF L\u1EADp tr\u00ECnh Web.</p>' +
      '<div class="footer-verified"><i class="fas fa-shield-alt"></i> \u0110\u00E3 \u0111\u0103ng k\u00FD B\u1ED9 C\u00F4ng Th\u01B0\u01A1ng</div>' +
    '</div></div>' +
    '</div></footer>';

  var el = document.getElementById('footer-placeholder');
  if (el) el.innerHTML = footer;
  else document.body.insertAdjacentHTML('beforeend', footer);

  $(document).on('submit', '#newsletterForm', function (e) {
    e.preventDefault();
    var email = $('#newsletterEmail').val().trim();
    if (email) {

      var subscribers = JSON.parse(localStorage.getItem('milkshop_newsletter') || '[]');
      if (subscribers.indexOf(email) === -1) {
        subscribers.push(email);
        localStorage.setItem('milkshop_newsletter', JSON.stringify(subscribers));
        showToast('Đăng ký thành công! Cảm ơn bạn ❤️', 'success');
      } else {
        showToast('Email này đã được đăng ký rồi!', 'info');
      }
      $('#newsletterEmail').val('');
    }
  });

  $(document).on('click', '.footer-links a[href="#"]', function (e) {
    e.preventDefault();
    showToast('Tính năng đang được cập nhật!', 'info');
  });
}

function updateCartBadge() {
  if (!isCustomer()) return;
  var cart = JSON.parse(localStorage.getItem('milkshop_cart') || '[]');
  var total = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
  var badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = total > 99 ? '99+' : total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
}

function setActiveNavLink() {
  var page = getCurrentPage();
  document.querySelectorAll('.nav-link[data-page]').forEach(function (link) {
    if (link.getAttribute('data-page') === page) link.classList.add('active');
  });
}

function getCurrentPage() {
  var path = window.location.pathname;
  var filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
  return filename || 'index';
}

function initNavbarScroll() {
  $(window).on('scroll', function () {
    var navbar = document.querySelector('.navbar-milkshop');
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 10 ? 'var(--shadow-md)' : 'var(--shadow-sm)';
  });
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('milkshop_wishlist') || '[]');
}

function toggleWishlist(productId) {
  var list = getWishlist();
  var idx = list.indexOf(productId);
  if (idx === -1) {
    list.push(productId);
    showToast('\u0110\u00E3 th\u00EAm v\u00E0o Y\u00EAu th\u00EDch \u2764\uFE0F', 'success');
  } else {
    list.splice(idx, 1);
    showToast('\u0110\u00E3 b\u1ECF kh\u1ECFi Y\u00EAu th\u00EDch', 'warning');
  }
  localStorage.setItem('milkshop_wishlist', JSON.stringify(list));
  return idx === -1;
}

function isInWishlist(productId) {
  return getWishlist().indexOf(productId) !== -1;
}

$(document).on('click', '.card-heart', function (e) {
  e.preventDefault();
  e.stopPropagation();
  var card = $(this).closest('[data-id]');
  var productId = card.data('id') || card.find('[data-id]').data('id');
  if (!productId) return;
  $(this).toggleClass('active', toggleWishlist(productId));
});

function renderAdminViewBar() {
  var bar =
    '<div style="position:fixed;top:0;left:0;right:0;z-index:9999;background:linear-gradient(135deg,#1e293b,#334155);color:#fff;padding:10px 24px;display:flex;align-items:center;justify-content:space-between;font-size:0.85rem;box-shadow:0 2px 8px rgba(0,0,0,0.2);">' +
      '<span><i class="fas fa-eye me-2"></i>\u0110ang xem giao di\u1EC7n kh\u00E1ch h\u00E0ng</span>' +
      '<a href="admin/index.html" style="background:#2563eb;color:#fff;padding:6px 16px;border-radius:6px;text-decoration:none;font-weight:600;font-size:0.8rem;">' +
        '<i class="fas fa-arrow-left me-1"></i>Quay l\u1EA1i Admin</a>' +
    '</div>';
  document.body.insertAdjacentHTML('afterbegin', bar);
  document.body.style.paddingTop = '48px';
}
