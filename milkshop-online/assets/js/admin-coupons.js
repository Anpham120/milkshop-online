$(document).ready(function () {
  'use strict';

  var ITEMS_PER_PAGE = 10;
  var currentPage = 1;
  var couponModal = new bootstrap.Modal(document.getElementById('couponModal'));

  function formatCurrency(num) {
    if (!num && num !== 0) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function parseCurrency(str) {
    if (!str) return 0;
    return parseInt(str.toString().replace(/\./g, ''), 10) || 0;
  }

  $(document).on('input', '.currency-input', function () {
    var raw = this.value.replace(/\./g, '').replace(/[^0-9]/g, '');
    if (raw === '') { this.value = ''; return; }
    var num = parseInt(raw, 10);
    var cursorPos = this.selectionStart;
    var oldLen = this.value.length;
    this.value = formatCurrency(num);
    var newLen = this.value.length;

    var newPos = cursorPos + (newLen - oldLen);
    this.setSelectionRange(newPos, newPos);
  });

  updateStats();
  renderTable();

  $('#inputType').on('change', function () {
    toggleTypeHint();
  });

  function toggleTypeHint() {
    if ($('#inputType').val() === 'percent') {
      $('#valueHint').text('% giảm giá (1-100)');
      $('#inputMaxDiscount').closest('.col-6').show();
    } else {
      $('#valueHint').text('Số tiền giảm (VNĐ)');
      $('#inputMaxDiscount').closest('.col-6').hide();
    }
  }

  $('#btnAddCoupon').on('click', function () {
    $('#couponId').val('');
    $('#couponForm')[0].reset();
    $('#couponModalTitle').html('<i class="fas fa-plus-circle me-2"></i>Thêm mã giảm giá');
    toggleTypeHint();
    couponModal.show();
  });

  $('#btnSaveCoupon').on('click', function () {
    var code = $('#inputCode').val().trim();
    var type = $('#inputType').val();
    var value = Number($('#inputValue').val());
    var maxDiscount = parseCurrency($('#inputMaxDiscount').val());
    var minOrder = parseCurrency($('#inputMinOrder').val());
    var usageLimit = Number($('#inputUsageLimit').val()) || 50;
    var expiry = $('#inputExpiry').val();
    var description = $('#inputDescription').val().trim();

    code = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
    $('#inputCode').val(code);

    if (!code || !value || !expiry) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc!', 'warning');
      return;
    }

    if (code.length < 3) {
      showToast('Mã coupon phải có ít nhất 3 ký tự!', 'warning');
      return;
    }

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(expiry) < today) {
      showToast('Hạn sử dụng phải là ngày hôm nay hoặc trong tương lai!', 'warning');
      return;
    }

    if (type === 'percent' && (value < 1 || value > 100)) {
      showToast('Phần trăm giảm giá phải từ 1 đến 100!', 'warning');
      return;
    }
    if (type === 'fixed' && value < 1000) {
      showToast('Số tiền giảm tối thiểu 1.000đ!', 'warning');
      return;
    }

    if (minOrder < 0) {
      showToast('Đơn tối thiểu không được âm!', 'warning');
      return;
    }

    var data = {
      code: code,
      type: type,
      value: value,
      maxDiscount: maxDiscount,
      minOrderValue: minOrder,
      usageLimit: usageLimit,
      expiryDate: expiry,
      description: description
    };

    var editId = $('#couponId').val();
    if (editId) {
      var result = StorageService.updateCoupon(editId, data);
      if (result && result.error) {
        showToast(result.error, 'error');
        return;
      }
      showToast('Cập nhật coupon thành công!', 'success');
    } else {
      var result = StorageService.createCoupon(data);
      if (result && result.error) {
        showToast(result.error, 'error');
        return;
      }
      showToast('Thêm coupon thành công!', 'success');
    }

    couponModal.hide();
    updateStats();
    renderTable();
  });

  $(document).on('click', '.btn-edit-coupon', function () {
    var id = $(this).data('id');
    var coupons = StorageService.getAllCoupons();
    var coupon = coupons.find(function (c) { return c.id === id; });
    if (!coupon) return;

    $('#couponId').val(coupon.id);
    $('#inputCode').val(coupon.code);
    $('#inputType').val(coupon.type);
    $('#inputValue').val(coupon.value);
    $('#inputMaxDiscount').val(coupon.maxDiscount ? formatCurrency(coupon.maxDiscount) : '');
    $('#inputMinOrder').val(coupon.minOrderValue ? formatCurrency(coupon.minOrderValue) : '');
    $('#inputUsageLimit').val(coupon.usageLimit);
    $('#inputExpiry').val(coupon.expiryDate);
    $('#inputDescription').val(coupon.description);
    $('#couponModalTitle').html('<i class="fas fa-edit me-2"></i>Sửa mã giảm giá');
    toggleTypeHint();
    couponModal.show();
  });

  $(document).on('click', '.btn-delete-coupon', function () {
    var id = $(this).data('id');
    showConfirm('Xóa coupon?', 'Bạn có chắc muốn xóa mã giảm giá này?')
      .then(function (result) {
        if (result.isConfirmed) {
          StorageService.deleteCoupon(id);
          showToast('Đã xóa coupon!', 'success');
          updateStats();
          renderTable();
        }
      });
  });

  $(document).on('click', '.btn-toggle-coupon', function () {
    var id = $(this).data('id');
    var updated = StorageService.toggleCouponStatus(id);
    if (updated) {
      showToast(updated.isActive ? 'Đã bật coupon!' : 'Đã tắt coupon!', 'success');
      updateStats();
      renderTable();
    }
  });

  $('#searchInput, #filterType, #filterStatus').on('input change', function () {
    currentPage = 1;
    renderTable();
  });

  $(document).on('click', '.page-link', function (e) {
    e.preventDefault();
    var pg = parseInt($(this).data('page'));
    if (pg >= 1) { currentPage = pg; renderTable(); }
  });

  function renderTable() {
    var filtered = getFiltered();
    var total = filtered.length;
    var totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var page = filtered.slice(start, start + ITEMS_PER_PAGE);
    var now = new Date();

    var html = '';
    if (page.length === 0) {
      html = '<tr><td colspan="8" class="text-center text-muted py-5"><i class="fas fa-ticket-alt fa-2x mb-2 d-block opacity-50"></i>Chưa có mã giảm giá nào</td></tr>';
    } else {
      page.forEach(function (c) {
        var expiry = new Date(c.expiryDate + 'T23:59:59');
        var isExpired = now > expiry;

        var typeBadge = c.type === 'percent'
          ? '<span class="status-badge status-active"><i class="fas fa-percentage"></i> Giảm %</span>'
          : '<span class="status-badge status-warning"><i class="fas fa-money-bill"></i> Giảm tiền</span>';

        var valueDisplay = c.type === 'percent'
          ? c.value + '% (tối đa ' + (c.maxDiscount > 0 ? c.maxDiscount.toLocaleString('vi-VN') + 'đ' : '∞') + ')'
          : c.value.toLocaleString('vi-VN') + 'đ';

        var statusBadge = '';
        if (isExpired) {
          statusBadge = '<span class="status-badge status-inactive"><i class="fas fa-circle"></i> Hết hạn</span>';
        } else if (c.usageCount >= c.usageLimit) {
          statusBadge = '<span class="status-badge status-inactive"><i class="fas fa-circle"></i> Hết lượt</span>';
        } else if (c.isActive) {
          statusBadge = '<span class="status-badge status-active"><i class="fas fa-circle"></i> Hoạt động</span>';
        } else {
          statusBadge = '<span class="status-badge status-inactive"><i class="fas fa-circle"></i> Đã tắt</span>';
        }

        html += '<tr>' +
          '<td><code class="fw-bold">' + c.code + '</code>' +
            (c.description ? '<br><small class="text-muted">' + c.description + '</small>' : '') +
          '</td>' +
          '<td>' + typeBadge + '</td>' +
          '<td class="fw-semibold">' + valueDisplay + '</td>' +
          '<td>' + (c.minOrderValue > 0 ? c.minOrderValue.toLocaleString('vi-VN') + 'đ' : '—') + '</td>' +
          '<td>' + c.usageCount + ' / ' + c.usageLimit + '</td>' +
          '<td>' + formatDate(c.expiryDate) + '</td>' +
          '<td>' + statusBadge + '</td>' +
          '<td class="text-center">' +
            '<div class="d-flex gap-1 justify-content-center">' +
              '<button class="btn-action btn-edit-coupon" data-id="' + c.id + '" title="Sửa"><i class="fas fa-edit"></i></button>' +
              '<button class="btn-action btn-toggle-coupon" data-id="' + c.id + '" title="' + (c.isActive ? 'Tắt' : 'Bật') + '"><i class="fas fa-' + (c.isActive ? 'toggle-off' : 'toggle-on') + '"></i></button>' +
              '<button class="btn-action btn-action-danger btn-delete-coupon" data-id="' + c.id + '" title="Xóa"><i class="fas fa-trash"></i></button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      });
    }

    $('#couponTableBody').html(html);

    $('#tableInfo').text('Hiển thị ' + page.length + ' / ' + total + ' coupon');

    var pagHtml = '';
    pagHtml += '<li class="page-item ' + (currentPage === 1 ? 'disabled' : '') + '"><a class="page-link" href="#" data-page="' + (currentPage - 1) + '">‹</a></li>';
    for (var i = 1; i <= totalPages; i++) {
      pagHtml += '<li class="page-item ' + (i === currentPage ? 'active' : '') + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>';
    }
    pagHtml += '<li class="page-item ' + (currentPage === totalPages ? 'disabled' : '') + '"><a class="page-link" href="#" data-page="' + (currentPage + 1) + '">›</a></li>';
    $('#pagination').html(pagHtml);
  }

  function updateStats() {
    var coupons = StorageService.getAllCoupons();
    var now = new Date();
    var active = 0, used = 0, expired = 0;
    coupons.forEach(function (c) {
      used += c.usageCount;
      var exp = new Date(c.expiryDate + 'T23:59:59');
      if (now > exp) expired++;
      else if (c.isActive) active++;
    });
    $('#statTotal').text(coupons.length);
    $('#statActive').text(active);
    $('#statUsed').text(used);
    $('#statExpired').text(expired);
  }

  function getFiltered() {
    var coupons = StorageService.getAllCoupons();
    var search = $('#searchInput').val().trim().toLowerCase();
    var type = $('#filterType').val();
    var status = $('#filterStatus').val();
    var now = new Date();

    if (search) {
      coupons = coupons.filter(function (c) {
        return c.code.toLowerCase().indexOf(search) > -1 ||
               (c.description || '').toLowerCase().indexOf(search) > -1;
      });
    }
    if (type) coupons = coupons.filter(function (c) { return c.type === type; });
    if (status === 'active') coupons = coupons.filter(function (c) { return c.isActive && now <= new Date(c.expiryDate + 'T23:59:59'); });
    if (status === 'inactive') coupons = coupons.filter(function (c) { return !c.isActive; });
    if (status === 'expired') coupons = coupons.filter(function (c) { return now > new Date(c.expiryDate + 'T23:59:59'); });

    return coupons;
  }

});
