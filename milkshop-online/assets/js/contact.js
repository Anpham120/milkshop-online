$(document).ready(function () {

  'use strict';

  $('#contactForm').on('submit', function (e) {

    e.preventDefault();

    var isValid = true;

    var name = $('#contactName').val().trim();
    var email = $('#contactEmail').val().trim();
    var message = $('#contactMessage').val().trim();

    if (!name) {

      showFieldError('#contactName', '#contactNameError', 'Vui lòng nhập họ tên');
      isValid = false; 
    } else {
      clearFieldError('#contactName', '#contactNameError'); 
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      showFieldError('#contactEmail', '#contactEmailError', 'Vui lòng nhập email hợp lệ');
      isValid = false;
    } else {
      clearFieldError('#contactEmail', '#contactEmailError');
    }

    if (!message) {
      showFieldError('#contactMessage', '#contactMessageError', 'Vui lòng nhập nội dung');
      isValid = false;
    } else {
      clearFieldError('#contactMessage', '#contactMessageError');
    }

    if (!isValid) return;

    var contacts = JSON.parse(localStorage.getItem('milkshop_contacts') || '[]');

    contacts.push({
      name: name,
      email: email,
      phone: $('#contactPhone').val().trim(), 
      subject: $('#contactSubject').val().trim(), 
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
      clearFieldError('#contactName', '#contactNameError');
    }
  });

  $('#contactEmail').on('input', function () {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test($(this).val().trim())) {
      clearFieldError('#contactEmail', '#contactEmailError');
    }
  });

  $('#contactMessage').on('input', function () {
    if ($(this).val().trim()) {
      clearFieldError('#contactMessage', '#contactMessageError');
    }
  });

  function showFieldError(inputSelector, errorSelector, message) {

    $(inputSelector).addClass('is-invalid');

    $(errorSelector).text(message).show();
  }

  function clearFieldError(inputSelector, errorSelector) {

    $(inputSelector).removeClass('is-invalid');

    $(errorSelector).hide();
  }
});
