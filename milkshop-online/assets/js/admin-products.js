$(document).ready(function () {

  'use strict';

  var currentPage = 1;

  var itemsPerPage = 10;

  var editingId = null;

  var productModal = new bootstrap.Modal(document.getElementById('productModal'));

  renderTable();

  $('#searchInput').on('input', debounce(function () { currentPage = 1; renderTable(); }, 300));

  $('#filterCategory, #filterStatus').on('change', function () { currentPage = 1; renderTable(); });

  $('#productPrice').on('input', function () {

    var raw = $(this).val().replace(/[^0-9]/g, '');

    if (raw === '') { $(this).val(''); return; }

    var formatted = Number(raw).toLocaleString('vi-VN');

    $(this).val(formatted);
  });

  $('#btnAddProduct').on('click', function () {

    editingId = null;

    $('#productForm')[0].reset();

    $('#modalTitle').html('<i class="fas fa-plus-circle me-2"></i>Thêm sản phẩm');

    productModal.show();
  });

  $('#btnSaveProduct').on('click', function () {

    var name = $('#productName').val().trim();

    var category = $('#productCategory').val();

    var priceRaw = $('#productPrice').val().replace(/[^0-9]/g, '');

    var price = Number(priceRaw);

    var mfgDate = $('#productMfgDate').val();

    var deadline = $('#productDeadline').val();

    var missing = [];

    if (!name) missing.push('Tên sản phẩm');

    if (!category) missing.push('Danh mục');

    if (!priceRaw) missing.push('Giá');

    if (!mfgDate) missing.push('Ngày sản xuất');

    if (!deadline) missing.push('Hạn sử dụng');

    if ($('#productStock').val() === '') missing.push('Tồn kho');

    if (missing.length > 0) {

      Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', html: 'Vui lòng điền các trường:<br><b>' + missing.join(', ') + '</b>' });

      return;
    }

    if (name.length < 2) {

      Swal.fire({ icon: 'warning', title: 'Tên quá ngắn', text: 'Tên sản phẩm phải có ít nhất 2 ký tự!' });

      return;
    }

    if (/^\d+$/.test(name)) {

      Swal.fire({ icon: 'warning', title: 'Tên không hợp lệ', text: 'Tên sản phẩm không được chỉ gồm toàn số!' });

      return;
    }

    if (!price || price <= 0) {

      Swal.fire({ icon: 'warning', title: 'Giá không hợp lệ', text: 'Giá sản phẩm phải lớn hơn 0₫!' });

      return;
    }

    var now = new Date();

    var todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

    if (mfgDate > todayStr) {

      Swal.fire({ icon: 'warning', title: 'NSX không hợp lệ', text: 'Ngày sản xuất không được lớn hơn ngày hôm nay (' + formatDate(todayStr) + ')!' });
      return;
    }

    if (deadline <= mfgDate) {

      Swal.fire({
        icon: 'warning',
        title: 'HSD không hợp lệ',
        html: 'Hạn sử dụng <b>(' + formatDate(deadline) + ')</b> phải lớn hơn ngày sản xuất <b>(' + formatDate(mfgDate) + ')</b>!'
      });

      return;
    }

    if (!editingId) {

      var allProducts = StorageService.getAllProducts();

      var duplicate = allProducts.find(function (p) {
        return p.name.toLowerCase() === name.toLowerCase();
      });

      if (duplicate) {

        Swal.fire({ icon: 'error', title: 'Trùng tên', text: 'Sản phẩm "' + name + '" đã tồn tại!' });
        return;
      }
    }

    var stockVal = Number($('#productStock').val());

    if (stockVal < 0 || isNaN(stockVal)) {

      Swal.fire({ icon: 'warning', title: 'Tồn kho không hợp lệ', text: 'Số lượng tồn kho phải ≥ 0!' });
      return;
    }

    var discountVal = Number($('#productDiscount').val()) || 0;

    if (discountVal < 0 || discountVal > 90) {

      Swal.fire({ icon: 'warning', title: 'Giảm giá không hợp lệ', text: 'Giảm giá phải từ 0% đến 90%!' });
      return;
    }

    var data = {
      name: name,
      category: category,
      price: price,
      mfgDate: mfgDate,
      deadline: deadline, 
      status: stockVal <= 0 ? 'Hết hàng' : 'Còn hàng',
      description: $('#productDescription').val().trim(), 
      image: $('#productImage').val().trim(), 
      stock: stockVal, 
      discount: discountVal 
    };

    if (editingId) {

      StorageService.updateProduct(editingId, data);

      showToast('Cập nhật sản phẩm thành công!', 'success');
    } else {

      StorageService.createProduct(data);
      showToast('Thêm sản phẩm thành công!', 'success');
    }

    productModal.hide();

    renderTable();
  });

  $(document).on('click', '.btn-edit', function () {

    var id = $(this).data('id');

    var product = StorageService.getProductById(id);

    if (!product) return;

    editingId = id;

    $('#productName').val(product.name);
    $('#productCategory').val(product.category);

    $('#productPrice').val(Number(product.price).toLocaleString('vi-VN'));
    $('#productMfgDate').val(product.mfgDate || '');
    $('#productDeadline').val(product.deadline);

    $('#productStock').val(product.stock !== undefined ? product.stock : 0);
    $('#productDiscount').val(product.discount || 0);
    $('#productDescription').val(product.description || '');
    $('#productImage').val(product.image || '');

    $('#modalTitle').html('<i class="fas fa-edit me-2"></i>Sửa sản phẩm');

    productModal.show();
  });

  $(document).on('click', '.btn-delete', function () {

    var id = $(this).data('id');

    var product = StorageService.getProductById(id);

    Swal.fire({
      icon: 'warning',
      title: 'Xóa sản phẩm?',

      text: product ? product.name : '',
      showCancelButton: true, 
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xóa'
    }).then(function (result) {

      if (result.isConfirmed) {

        StorageService.deleteProduct(id);

        showToast('Đã xóa sản phẩm!', 'success');

        renderTable();
      }
    });
  });

  function renderTable() {

    var products = getFiltered();

    var total = products.length;

    var totalPages = Math.ceil(total / itemsPerPage) || 1;

    if (currentPage > totalPages) currentPage = totalPages;

    var start = (currentPage - 1) * itemsPerPage;

    var pageItems = products.slice(start, start + itemsPerPage);

    var all = StorageService.getAllProducts();

    $('#statTotal').text(all.length);

    $('#statConHang').text(all.filter(function (p) { return p.status === 'Còn hàng'; }).length);

    $('#statHetHang').text(all.filter(function (p) { return p.status === 'Hết hàng'; }).length);

    var cats = {};

    all.forEach(function (p) { if (p.category) cats[p.category] = true; });

    $('#statCategories').text(Object.keys(cats).length);

    if (pageItems.length === 0) {

      $('#productTableBody').html('<tr><td colspan="10" class="text-center text-muted py-4">Không tìm thấy sản phẩm nào</td></tr>');
    } else {

      var html = '';

      pageItems.forEach(function (p, i) {

        var statusClass = p.status === 'Còn hàng' ? 'status-active' : 'status-inactive';

        var deadlineDate = new Date(p.deadline);
        var now = new Date();

        var daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

        var deadlineWarn = daysLeft <= 7 && daysLeft >= 0 ? ' text-danger fw-bold' : '';

        var stockVal = p.stock !== undefined ? p.stock : 0;

        var stockBadgeClass = stockVal <= 0 ? 'badge-red' : (stockVal <= 5 ? 'badge-red' : (stockVal <= 20 ? 'badge-yellow' : 'badge-green'));

        html += '<tr>' +

          '<td class="text-muted">' + (start + i + 1) + '</td>' +

          '<td>' +
            '<div class="d-flex align-items-center gap-3">' +
              '<img src="' + (p.image ? '../' + p.image : '../assets/img/no-image.svg') + '" class="product-thumb" alt="' + p.name + '" onerror="this.src=\'../assets/img/no-image.svg\'">' +
              '<div>' +
                '<div class="product-name">' + p.name + '</div>' + 
                '<div class="product-cat">' + (p.description || '').substring(0, 50) + '</div>' + 
              '</div>' +
            '</div>' +
          '</td>' +

          '<td>' + (p.category || '—') + '</td>' +

          '<td class="fw-semibold">' + formatPrice(p.price) + '</td>' +

          '<td>' + formatDate(p.mfgDate) + '</td>' +

          '<td class="' + deadlineWarn + '">' + formatDate(p.deadline) + '</td>' +

          '<td><span class="status-badge ' + statusClass + '"><i class="fas fa-circle"></i> ' + p.status + '</span></td>' +

          '<td class="text-center"><span class="badge-num ' + stockBadgeClass + '">' + stockVal + '</span></td>' +

          '<td class="text-center">' + (p.discount > 0 ? '<span class="badge-num badge-red">-' + p.discount + '%</span>' : '<span class="text-muted">—</span>') + '</td>' +

          '<td class="text-center">' +
            '<div class="d-flex gap-1 justify-content-center">' +
              '<button class="btn-action btn-edit" data-id="' + p.id + '" title="Sửa"><i class="fas fa-edit"></i></button>' +
              '<button class="btn-action btn-action-danger btn-delete" data-id="' + p.id + '" title="Xóa"><i class="fas fa-trash"></i></button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      });

      $('#productTableBody').html(html);
    }

    $('#tableInfo').text('Hiển thị ' + pageItems.length + ' / ' + total + ' sản phẩm');

    var pagHtml = '';

    pagHtml += '<li class="page-item ' + (currentPage === 1 ? 'disabled' : '') + '"><a class="page-link" href="#" data-page="' + (currentPage - 1) + '">‹</a></li>';

    for (var pg = 1; pg <= totalPages; pg++) {

      pagHtml += '<li class="page-item ' + (pg === currentPage ? 'active' : '') + '"><a class="page-link" href="#" data-page="' + pg + '">' + pg + '</a></li>';
    }

    pagHtml += '<li class="page-item ' + (currentPage === totalPages ? 'disabled' : '') + '"><a class="page-link" href="#" data-page="' + (currentPage + 1) + '">›</a></li>';

    $('#tablePagination').html(pagHtml);
  }

  $(document).on('click', '#tablePagination .page-link', function (e) {

    e.preventDefault();

    var pg = parseInt($(this).data('page'));

    if (pg >= 1) { currentPage = pg; renderTable(); }
  });

  function getFiltered() {

    var products = StorageService.getAllProducts();

    var search = $('#searchInput').val().trim().toLowerCase();

    var cat = $('#filterCategory').val();

    var status = $('#filterStatus').val();

    if (search) {

      products = products.filter(function (p) {

        return p.name.toLowerCase().indexOf(search) > -1 ||
               (p.description || '').toLowerCase().indexOf(search) > -1;
      });
    }

    if (cat) products = products.filter(function (p) { return p.category === cat; });

    if (status) products = products.filter(function (p) { return p.status === status; });

    return products;
  }
});
