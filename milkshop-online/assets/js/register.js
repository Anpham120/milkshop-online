$(document).ready(function () {

  'use strict';

  if (localStorage.getItem('milkshop_session')) {

    window.location.href = 'index.html';
    return; 
  }

  applyTheme(localStorage.getItem('milkshop_theme') || 'light');

  $('.auth-toggle-pw').on('click', function () {

    var targetId = $(this).data('target');

    var input = $('#' + targetId);

    var icon = $(this).find('i');

    if (input.attr('type') === 'password') {

      input.attr('type', 'text');

      icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {

      input.attr('type', 'password');

      icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
  });

  function saveAccount(account) {

    var accounts = getRegisteredAccounts();

    accounts.push(account);

    localStorage.setItem('milkshop_accounts', JSON.stringify(accounts));
  }

  $('.auth-input').on('input', function () {

    if ($(this).val().trim()) {

      $(this).removeClass('is-invalid');

      $(this).closest('.auth-field').find('.auth-error').hide();
    }
  });

  $('#registerForm').on('submit', function (e) {

    e.preventDefault();

    var fullName = $('#regFullName').val().trim();
    var username = $('#regUsername').val().trim();
    var phone = $('#regPhone').val().trim();

    var password = $('#regPassword').val();
    var confirmPassword = $('#regConfirmPassword').val();

    var agreeTerms = $('#agreeTerms').is(':checked');

    var isValid = true;

    if (!fullName) {
      $('#regFullName').addClass('is-invalid'); 
      $('#fullNameError').text('Vui lòng nhập họ và tên').show(); 
      isValid = false; 
    } else {
      $('#regFullName').removeClass('is-invalid');
      $('#fullNameError').hide();
    }

    if (!username) {

      $('#regUsername').addClass('is-invalid');
      $('#regUsernameError').text('Vui lòng nhập tên đăng nhập').show();
      isValid = false;
    } else if (username.length < 3) {

      $('#regUsername').addClass('is-invalid');
      $('#regUsernameError').text('Tên đăng nhập tối thiểu 3 ký tự').show();
      isValid = false;
    } else {

      var existing = getRegisteredAccounts().find(function (acc) { return acc.username === username; });

      var demoMatch = ['admin', 'khach'].indexOf(username) >= 0;

      if (existing || demoMatch) {
        $('#regUsername').addClass('is-invalid'); 
        $('#regUsernameError').text('Tên đăng nhập đã tồn tại').show();
        isValid = false;
      } else {

        $('#regUsername').removeClass('is-invalid');
        $('#regUsernameError').hide();
      }
    }

    var phoneRegex = /^(0[1-9])\d{8}$/;
    if (!phone) {

      $('#regPhone').addClass('is-invalid');
      $('#phoneError').text('Vui lòng nhập số điện thoại').show();
      isValid = false;
    } else if (!phoneRegex.test(phone)) {

      $('#regPhone').addClass('is-invalid');
      $('#phoneError').text('Số điện thoại không hợp lệ (VD: 0868427362)').show();
      isValid = false;
    } else {

      $('#regPhone').removeClass('is-invalid');
      $('#phoneError').hide();
    }

    if (!password || password.length < 6) {
      $('#regPassword').addClass('is-invalid');
      $('#regPasswordError').text('Mật khẩu tối thiểu 6 ký tự').show();
      isValid = false;
    } else {
      $('#regPassword').removeClass('is-invalid');
      $('#regPasswordError').hide();
    }

    if (confirmPassword !== password) {
      $('#regConfirmPassword').addClass('is-invalid'); 
      $('#confirmPasswordError').text('Mật khẩu xác nhận không khớp').show();
      isValid = false;

    } else if (!confirmPassword) {
      $('#regConfirmPassword').addClass('is-invalid'); 
      $('#confirmPasswordError').text('Vui lòng nhập lại mật khẩu').show();
      isValid = false;
    } else {
      $('#regConfirmPassword').removeClass('is-invalid');
      $('#confirmPasswordError').hide();
    }

    if (!agreeTerms) {

      Swal.fire({
        icon: 'warning',
        title: 'Chưa đồng ý điều khoản',
        text: 'Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật để tiếp tục.'
      });
      isValid = false;
    }

    if (!isValid) return;

    var newAccount = {
      username: username,
      password: password,
      role: 'customer', 
      fullName: fullName,
      phone: phone,
      createdAt: new Date().toISOString() 
    };

    saveAccount(newAccount);

    Swal.fire({
      icon: 'success',
      title: 'Đăng ký thành công!',
      text: 'Tài khoản "' + username + '" đã được tạo. Đang chuyển sang đăng nhập...',
      timer: 2000, 
      showConfirmButton: false 
    }).then(function () {

      window.location.href = 'login.html';
    });
  });
});
