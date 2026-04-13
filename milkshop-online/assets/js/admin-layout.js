$(document).ready(function () {
  'use strict';

  if (!isAdmin()) {
    window.location.href = '../login.html';
    return;
  }

  renderAdminSidebar();
  renderAdminTopbar();
  initSidebarToggle();
  initDarkMode();
});

function renderAdminSidebar() {
  var page = getAdminPage();

  var menuItems = [
    { label: 'QU\u1EA2N L\u00DD', type: 'label' },
    { icon: 'fa-tachometer-alt', label: 'Dashboard', href: 'index.html', page: 'index' },
    { icon: 'fa-box', label: 'S\u1EA3n ph\u1EA9m', href: 'products.html', page: 'products' },
    { icon: 'fa-receipt', label: '\u0110\u01A1n h\u00E0ng', href: 'orders.html', page: 'orders' },
    { icon: 'fa-ticket-alt', label: 'M\u00E3 gi\u1EA3m gi\u00E1', href: 'coupons.html', page: 'coupons' },
    { type: 'divider' },
    { label: 'KH\u00C1C', type: 'label' },
    { icon: 'fa-store', label: 'V\u1EC1 trang kh\u00E1ch', href: '../products.html', page: '' },
    { icon: 'fa-sign-out-alt', label: '\u0110\u0103ng xu\u1EA5t', href: '#', page: 'logout', id: 'btnAdminLogout' }
  ];

  var navHtml = '';
  menuItems.forEach(function (item) {
    if (item.type === 'label') {
      navHtml += '<div class="admin-nav-label">' + item.label + '</div>';
    } else if (item.type === 'divider') {
      navHtml += '<div class="admin-nav-divider"></div>';
    } else {
      var active = item.page === page ? ' active' : '';
      var idAttr = item.id ? ' id="' + item.id + '"' : '';
      navHtml += '<a class="admin-nav-item' + active + '" href="' + item.href + '"' + idAttr + '>' +
        '<i class="fas ' + item.icon + '"></i><span>' + item.label + '</span></a>';
    }
  });

  var sidebar =
    '<aside class="admin-sidebar" id="adminSidebar">' +
      '<a class="admin-sidebar-brand" href="index.html">' +
        '<img src="../assets/img/logo-milkshop.png" alt="MilkShop" onerror="this.style.display=\'none\'">' +
        '<div class="brand-text"><span class="brand-name">MilkShop</span><span class="brand-sub">Admin Panel</span></div>' +
      '</a>' +
      '<nav>' + navHtml + '</nav>' +
    '</aside>';

  $('body').prepend(sidebar);
  $('body').prepend('<div class="admin-sidebar-overlay" id="sidebarOverlay"></div>');

  $(document).on('click', '#btnAdminLogout', function (e) {
    e.preventDefault();
    logout();
  });
}

function renderAdminTopbar() {
  var session = getSession();
  var pageTitles = {
    'index': 'Dashboard',
    'products': 'Qu\u1EA3n l\u00FD s\u1EA3n ph\u1EA9m',
    'orders': 'Qu\u1EA3n l\u00FD \u0111\u01A1n h\u00E0ng',
    'coupons': 'Qu\u1EA3n l\u00FD m\u00E3 gi\u1EA3m gi\u00E1'
  };
  var title = pageTitles[getAdminPage()] || 'Admin';

  var topbar =
    '<header class="admin-topbar">' +
      '<div class="admin-topbar-left">' +
        '<button class="admin-toggle-sidebar" id="btnToggleSidebar"><i class="fas fa-bars"></i></button>' +
        '<h5>' + title + '</h5>' +
      '</div>' +
      '<div class="admin-topbar-right">' +
        '<button class="btn-dark-mode" id="btnDarkMode" title="Ch\u1EBF \u0111\u1ED9 s\u00E1ng/t\u1ED1i"><i class="fas fa-moon"></i></button>' +
        '<div class="dropdown">' +
          '<button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">' +
            '<i class="fas fa-user-circle me-1"></i>' + (session ? session.fullName : 'Admin') +
          '</button>' +
          '<ul class="dropdown-menu dropdown-menu-end">' +
            '<li><span class="dropdown-item-text text-muted"><i class="fas fa-shield-alt me-1"></i>Qu\u1EA3n tr\u1ECB vi\u00EAn</span></li>' +
            '<li><hr class="dropdown-divider"></li>' +
            '<li><a class="dropdown-item" href="#" id="btnAdminLogout2"><i class="fas fa-sign-out-alt me-1"></i>\u0110\u0103ng xu\u1EA5t</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</header>';

  $('.admin-main').prepend(topbar);

  $(document).on('click', '#btnAdminLogout2', function (e) {
    e.preventDefault();
    logout();
  });
}

function initSidebarToggle() {
  $(document).on('click', '#btnToggleSidebar', function () {
    $('#adminSidebar').toggleClass('open');
    $('#sidebarOverlay').toggleClass('show');
  });

  $(document).on('click', '#sidebarOverlay', function () {
    $('#adminSidebar').removeClass('open');
    $('#sidebarOverlay').removeClass('show');
  });
}

function getAdminPage() {
  var path = window.location.pathname;
  var filename = path.split('/').pop().replace('.html', '');
  return filename || 'index';
}
