$(document).ready(function () {
  'use strict';

  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    var isValid = true;
    var name = $('#contactName').val().trim();
    var email = $('#contactEmail').val().trim();
    var message = $('#contactMessage').val().trim();

    if (!name) {
      $('#contactName').addClass('is-invalid');
      $('#contactNameError').text('Vui lòng nhập họ tên').show();
      isValid = false;
    } else {
      $('#contactName').removeClass('is-invalid');
      $('#contactNameError').hide();
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      $('#contactEmail').addClass('is-invalid');
      $('#contactEmailError').text('Vui lòng nhập email hợp lệ').show();
      isValid = false;
    } else {
      $('#contactEmail').removeClass('is-invalid');
      $('#contactEmailError').hide();
    }

    if (!message) {
      $('#contactMessage').addClass('is-invalid');
      $('#contactMessageError').text('Vui lòng nhập nội dung').show();
      isValid = false;
    } else {
      $('#contactMessage').removeClass('is-invalid');
      $('#contactMessageError').hide();
    }

    if (!isValid) return;

    var contacts = JSON.parse(localStorage.getItem('milkshop_contacts') || '[]');
    contacts.push({
      name: name,
      email: email,
      message: message,
      date: new Date().toISOString()
    });
    localStorage.setItem('milkshop_contacts', JSON.stringify(contacts));

    Swal.fire({
      icon: 'success',
      title: 'Gửi thành công!',
      text: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
      confirmButtonColor: '#2563eb'
    });

    $('#contactForm')[0].reset();
  });

  $('#contactName').on('input', function () {
    if ($(this).val().trim()) {
      $(this).removeClass('is-invalid');
      $('#contactNameError').hide();
    }
  });

  $('#contactEmail').on('input', function () {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test($(this).val().trim())) {
      $(this).removeClass('is-invalid');
      $('#contactEmailError').hide();
    }
  });

  $('#contactMessage').on('input', function () {
    if ($(this).val().trim()) {
      $(this).removeClass('is-invalid');
      $('#contactMessageError').hide();
    }
  });
});
