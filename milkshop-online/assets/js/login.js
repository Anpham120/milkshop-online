$(document).ready(function () {

  'use strict';

  if (localStorage.getItem('milkshop_session')) {
    try {

      var session = JSON.parse(localStorage.getItem('milkshop_session'));

      if (session && session.role === 'admin') {

        window.location.href = 'admin/index.html';
      } else {

        window.location.href = 'index.html';
      }
    } catch (e) {

      window.location.href = 'index.html';
    }

    return;
  }

  applyTheme(localStorage.getItem('milkshop_theme') || 'light');

  var DEMO_ACCOUNTS = [

    { username: 'admin', password: '123456', role: 'admin', fullName: 'Quản trị viên' },

    { username: 'khach', password: '123456', role: 'customer', fullName: 'Khách hàng' }
  ];

  function getAllAccounts() {

    return DEMO_ACCOUNTS.concat(getRegisteredAccounts());
  }

  $('#btnTogglePassword').on('click', function () {

    var input = $('#loginPassword');

    var icon = $(this).find('i');

    if (input.attr('type') === 'password') {

      input.attr('type', 'text');

      icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {

      input.attr('type', 'password');

      icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
  });

  $('#loginForm').on('submit', function (e) {

    e.preventDefault();

    var username = $('#loginUsername').val().trim();

    var password = $('#loginPassword').val().trim();

    var isValid = true;

    if (!username) {

      $('#loginUsername').addClass('is-invalid');

      $('#usernameError').show();

      isValid = false;
    } else {

      $('#loginUsername').removeClass('is-invalid');

      $('#usernameError').hide();
    }

    if (!password) {

      $('#loginPassword').addClass('is-invalid');

      $('#passwordError').show();

      isValid = false;
    } else {

      $('#loginPassword').removeClass('is-invalid');

      $('#passwordError').hide();
    }

    if (!isValid) return;

    var allAccounts = getAllAccounts();

    var account = allAccounts.find(function (acc) {

      return acc.username === username && acc.password === password;
    });

    if (account) {

      var session = {

        username: account.username,

        role: account.role,

        fullName: account.fullName,

        loginTime: new Date().toISOString()
      };

      localStorage.setItem('milkshop_session', JSON.stringify(session));

      var roleText = account.role === 'admin' ? 'Quản trị viên' : 'Khách hàng';

      Swal.fire({

        icon: 'success',

        title: 'Đăng nhập thành công!',

        text: 'Chào mừng ' + account.fullName + ' (' + roleText + ')',

        timer: 1500,

        showConfirmButton: false
      }).then(function () {

        window.location.href = account.role === 'admin' ? 'admin/index.html' : 'index.html';
      });
    } else { 

      Swal.fire({

        icon: 'error',

        title: 'Đăng nhập thất bại',

        text: 'Sai tên đăng nhập hoặc mật khẩu!'
      });
    }
  });

  $('#loginUsername').on('input', function () {

    if ($(this).val().trim()) {

      $(this).removeClass('is-invalid');

      $('#usernameError').hide();
    }
  });

  $('#loginPassword').on('input', function () {

    if ($(this).val().trim()) {

      $(this).removeClass('is-invalid');

      $('#passwordError').hide();
    }
  });
});
