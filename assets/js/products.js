$(document).ready(function () {
  'use strict';

  var currentPage = 1;
  var itemsPerPage = 8;
  var viewMode = 'grid';
  var editingId = null;

  var productModal = new bootstrap.Modal(document.getElementById('productModal'));

  applyUrlParams();
  renderProducts();

  // Ẩn nút quản lý cho khách hàng
  if (!isAdmin()) {
    $('#btnAddProduct').hide();
  }

  // Tìm kiếm (chống gọi liên tục)
  $('#searchInput').on('input', debounce(function () {
    currentPage = 1;
    renderProducts();
  }, 300));

  // Lọc & Sắp xếp
  $('#filterStatus, #filterCategory, #sortBy').on('change', function () {
    currentPage = 1;
    renderProducts();
  });

  // Thêm sản phẩm
  $('#btnAddProduct').on('click', function () {
    editingId = null;
    $('#modalTitle').text('Thêm sản phẩm mới');
    $('#productForm')[0].reset();
    $('#productId').val('');
    clearValidation();
    productModal.show();
  });

  // Lưu sản phẩm
  $('#btnSaveProduct').on('click', function () {
    saveProduct();
  });

  // Chuyển chế độ xem
  $('#viewGrid').on('click', function () {
    viewMode = 'grid';
    $(this).addClass('active');
    $('#viewList').removeClass('active');
    renderProducts();
  });

  $('#viewList').on('click', function () {
    viewMode = 'list';
    $(this).addClass('active');
    $('#viewGrid').removeClass('active');
    renderProducts();
  });

  // Kiểm tra dữ liệu trực tiếp
  $('#productName').on('input', function () { validateField('name'); });
  $('#productDescription').on('input', function () { validateField('description'); });
  $('#productPrice').on('input', function () { validateField('price'); });
  $('#productDeadline').on('change', function () { validateField('deadline'); });
  $('#productCategory').on('change', function () { validateField('category'); });

  // Ủy quyền sự kiện: Sửa, Xóa, Đổi trạng thái, Thêm giỏ
  $(document).on('click', '.btn-edit-product', function () {
    openEditModal($(this).data('id'));
  });

  $(document).on('click', '.btn-delete-product', function () {
    deleteProduct($(this).data('id'));
  });

  $(document).on('click', '.btn-toggle-product', function () {
    StorageService.toggleProductStatus($(this).data('id'));
    renderProducts();
    showToast('Đã cập nhật trạng thái!', 'success');
  });

  // Thêm vào giỏ hàng (khách hàng)
  $(document).on('click', '.btn-cart-product', function () {
    StorageService.addToCart($(this).data('id'), 1);
    updateCartBadge();
    showToast('Đã thêm vào giỏ hàng!', 'success');
  });

  // Phân trang
  $(document).on('click', '.page-link-custom', function (e) {
    e.preventDefault();
    var page = $(this).data('page');
    if (page && page !== currentPage) {
      currentPage = page;
      renderProducts();
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  });

  // Kéo thả sản phẩm
  $(document).on('dragstart', '.product-card[draggable]', function (e) {
    e.originalEvent.dataTransfer.setData('text/plain', $(this).data('id'));
    $(this).addClass('dragging');
  });

  $(document).on('dragend', '.product-card[draggable]', function () {
    $(this).removeClass('dragging');
    $('.product-card').removeClass('drag-over');
  });

  $(document).on('dragover', '.product-card[draggable]', function (e) {
    e.preventDefault();
    $(this).addClass('drag-over');
  });

  $(document).on('dragleave', '.product-card[draggable]', function () {
    $(this).removeClass('drag-over');
  });

  $(document).on('drop', '.product-card[draggable]', function (e) {
    e.preventDefault();
    $(this).removeClass('drag-over');
    var draggedId = e.originalEvent.dataTransfer.getData('text/plain');
    var targetId = $(this).data('id');

    if (draggedId && targetId && draggedId !== targetId) {
      var draggedProduct = StorageService.getProductById(draggedId);
      var targetProduct = StorageService.getProductById(targetId);
      if (draggedProduct && targetProduct) {
        StorageService.updateProduct(draggedId, { status: targetProduct.status });
        StorageService.updateProduct(targetId, { status: draggedProduct.status });
        renderProducts();
        showToast('Đã đổi trạng thái sản phẩm!', 'success');
      }
    }
  });

  // Đọc tham số URL
  function applyUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var category = params.get('category');
    if (category) {
      $('#filterCategory').val(category);
    }
  }

  // HIỂN THỊ SẢN PHẨM
  function renderProducts() {
    var products = getFilteredProducts();
    var totalProducts = products.length;
    var totalPages = Math.ceil(totalProducts / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

    var start = (currentPage - 1) * itemsPerPage;
    var end = start + itemsPerPage;
    var pageProducts = products.slice(start, end);

    $('#productCount').text(totalProducts + ' sản phẩm');

    var container = $('#productsContainer');
    container.removeClass('list-view');
    if (viewMode === 'list') container.addClass('list-view');

    if (pageProducts.length === 0) {
      container.html(
        '<div class="col-12">' +
          '<div class="empty-state">' +
            '<i class="fas fa-search"></i>' +
            '<h4>Không tìm thấy sản phẩm</h4>' +
            '<p>Thử thay đổi điều kiện tìm kiếm hoặc lọc.</p>' +
          '</div>' +
        '</div>'
      );
      $('#paginationNav').hide();
      return;
    }

    var html = '';
    pageProducts.forEach(function (product, index) {
      var deadlineClass = isExpired(product.deadline) ? 'expired' : '';
      var colClass = viewMode === 'grid' ? 'col-lg-3 col-md-4 col-sm-6' : 'col-12';

      html += '<div class="' + colClass + ' product-card fade-in" draggable="true" data-id="' + product.id + '" style="animation-delay:' + (index * 0.05) + 's">' +
        '<div class="card-milkshop">' +
          '<div class="img-wrapper">' +
            '<img src="' + product.image + '" class="card-img-top" alt="' + product.name + '" onerror="this.src=\'assets/img/suatuoivinamilk.jpg\'">' +
          '</div>' +
          '<div class="card-body">' +
            '<div class="product-meta">' +
              '<span class="badge-category ' + getCategoryBadgeClass(product.category) + '">' + product.category + '</span>' +
              '<span class="badge-status btn-toggle-status ' + getStatusBadgeClass(product.status) + '" data-id="' + product.id + '" title="Click để đổi trạng thái">' + product.status + '</span>' +
            '</div>' +
            '<h5 class="card-title">' + product.name + '</h5>' +
            '<p class="card-text">' + truncateText(product.description, viewMode === 'list' ? 120 : 60) + '</p>' +
            '<div class="d-flex justify-content-between align-items-center mb-2">' +
              '<span class="price-tag">' + formatPrice(product.price) + '</span>' +
              '<span class="product-deadline ' + deadlineClass + '">' +
                '<i class="fas fa-clock"></i> ' + formatDate(product.deadline) +
              '</span>' +
            '</div>' +
            '<div class="card-actions">' +
              (isAdmin() ?
                '<button class="btn btn-sm btn-outline-milkshop btn-edit-product" data-id="' + product.id + '" title="Sửa">' +
                  '<i class="fas fa-edit"></i>' +
                '</button>' +
                '<button class="btn btn-sm btn-danger-milkshop btn-delete-product" data-id="' + product.id + '" title="Xóa">' +
                  '<i class="fas fa-trash"></i>' +
                '</button>' +
                '<button class="btn btn-sm btn-toggle-product ' + (product.status === 'Còn hàng' ? 'btn-success-milkshop' : 'btn-secondary') + '" data-id="' + product.id + '" title="Đổi trạng thái">' +
                  '<i class="fas fa-exchange-alt"></i>' +
                '</button>'
              :
                '<button class="btn btn-sm btn-primary-milkshop btn-cart-product" data-id="' + product.id + '" title="Thêm vào giỏ">' +
                  '<i class="fas fa-cart-plus"></i>' +
                '</button>'
              ) +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    });

    container.html(html);
    renderPagination(totalPages);
  }

  // LỌC + SẮP XẾP
  function getFilteredProducts() {
    var products = StorageService.getAllProducts();
    var search = $('#searchInput').val().trim().toLowerCase();
    var status = $('#filterStatus').val();
    var category = $('#filterCategory').val();
    var sortBy = $('#sortBy').val();

    if (search) {
      products = products.filter(function (p) {
        return p.name.toLowerCase().indexOf(search) > -1 ||
               p.description.toLowerCase().indexOf(search) > -1;
      });
    }

    if (status) {
      products = products.filter(function (p) { return p.status === status; });
    }

    if (category) {
      products = products.filter(function (p) { return p.category === category; });
    }

    if (sortBy) {
      products.sort(function (a, b) {
        switch (sortBy) {
          case 'deadline-asc': return new Date(a.deadline) - new Date(b.deadline);
          case 'deadline-desc': return new Date(b.deadline) - new Date(a.deadline);
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'name-asc': return a.name.localeCompare(b.name);
          default: return 0;
        }
      });
    }

    return products;
  }

  // PHÂN TRANG
  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      $('#paginationNav').hide();
      return;
    }

    $('#paginationNav').show();
    var html = '';

    html += '<li class="page-item ' + (currentPage === 1 ? 'disabled' : '') + '">' +
      '<a class="page-link page-link-custom" href="#" data-page="' + (currentPage - 1) + '">' +
        '<i class="fas fa-chevron-left"></i>' +
      '</a></li>';

    for (var i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        html += '<li class="page-item ' + (i === currentPage ? 'active' : '') + '">' +
          '<a class="page-link page-link-custom" href="#" data-page="' + i + '">' + i + '</a></li>';
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }

    html += '<li class="page-item ' + (currentPage === totalPages ? 'disabled' : '') + '">' +
      '<a class="page-link page-link-custom" href="#" data-page="' + (currentPage + 1) + '">' +
        '<i class="fas fa-chevron-right"></i>' +
      '</a></li>';

    $('#pagination').html(html);
  }

  // LƯU SẢN PHẨM (Tạo mới/Cập nhật)
  function saveProduct() {
    if (!validateForm()) return;

    var data = {
      name: $('#productName').val().trim(),
      description: $('#productDescription').val().trim(),
      price: Number($('#productPrice').val()),
      deadline: $('#productDeadline').val(),
      category: $('#productCategory').val(),
      status: $('#productStatus').val(),
      image: $('#productImage').val().trim() || 'assets/img/suatuoivinamilk.jpg'
    };

    if (editingId) {
      StorageService.updateProduct(editingId, data);
      showToast('Đã cập nhật sản phẩm!', 'success');
    } else {
      StorageService.createProduct(data);
      showToast('Đã thêm sản phẩm mới!', 'success');
    }

    productModal.hide();
    renderProducts();

  }

  // SỬA SẢN PHẨM
  function openEditModal(id) {
    var product = StorageService.getProductById(id);
    if (!product) return;

    editingId = id;
    $('#modalTitle').text('Sửa sản phẩm');
    $('#productId').val(id);
    $('#productName').val(product.name);
    $('#productDescription').val(product.description);
    $('#productPrice').val(product.price);
    $('#productDeadline').val(product.deadline);
    $('#productCategory').val(product.category);
    $('#productStatus').val(product.status);
    $('#productImage').val(product.image);
    clearValidation();
    productModal.show();
  }

  // XÓA SẢN PHẨM
  function deleteProduct(id) {
    var product = StorageService.getProductById(id);
    if (!product) return;

    showConfirm(
      'Xóa sản phẩm?',
      'Bạn có chắc muốn xóa "' + product.name + '"? Hành động này không thể hoàn tác.'
    ).then(function (result) {
      if (result.isConfirmed) {
        StorageService.deleteProduct(id);
        renderProducts();

        showToast('Đã xóa sản phẩm!', 'success');
      }
    });
  }

  // KIỂM TRA DỮ LIỆU
  function validateForm() {
    var isValid = true;
    if (!validateField('name')) isValid = false;
    if (!validateField('description')) isValid = false;
    if (!validateField('price')) isValid = false;
    if (!validateField('deadline')) isValid = false;
    if (!validateField('category')) isValid = false;
    return isValid;
  }

  function validateField(field) {
    var valid = true;

    switch (field) {
      case 'name':
        var name = $('#productName').val().trim();
        if (!name) {
          setInvalid('productName', 'nameError', 'Tên sản phẩm không được để trống');
          valid = false;
        } else { setValid('productName', 'nameError'); }
        break;

      case 'description':
        var desc = $('#productDescription').val().trim();
        if (!desc || desc.length < 10) {
          setInvalid('productDescription', 'descriptionError', 'Mô tả phải có tối thiểu 10 ký tự');
          valid = false;
        } else { setValid('productDescription', 'descriptionError'); }
        break;

      case 'price':
        var price = Number($('#productPrice').val());
        if (!price || price <= 0) {
          setInvalid('productPrice', 'priceError', 'Giá phải lớn hơn 0');
          valid = false;
        } else { setValid('productPrice', 'priceError'); }
        break;

      case 'deadline':
        var deadline = $('#productDeadline').val();
        var today = new Date().toISOString().slice(0, 10);
        if (!deadline || deadline < today) {
          setInvalid('productDeadline', 'deadlineError', 'Hạn sử dụng không được nhỏ hơn ngày hiện tại');
          valid = false;
        } else { setValid('productDeadline', 'deadlineError'); }
        break;

      case 'category':
        var cat = $('#productCategory').val();
        if (!cat) {
          setInvalid('productCategory', 'categoryError', 'Vui lòng chọn loại sữa');
          valid = false;
        } else { setValid('productCategory', 'categoryError'); }
        break;
    }

    return valid;
  }

  function setInvalid(inputId, errorId, message) {
    $('#' + inputId).addClass('is-invalid');
    $('#' + errorId).text(message).show();
  }

  function setValid(inputId, errorId) {
    $('#' + inputId).removeClass('is-invalid');
    $('#' + errorId).hide();
  }

  function clearValidation() {
    $('.form-control-milkshop').removeClass('is-invalid');
    $('.invalid-feedback-milkshop').hide();
  }
});
