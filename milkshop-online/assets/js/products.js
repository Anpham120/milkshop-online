$(document).ready(function () {
  'use strict';

  var currentPage = 1;
  var itemsPerPage = 9;
  var viewMode = 'grid';
  var editingId = null;

  var productModal = new bootstrap.Modal(document.getElementById('productModal'));

  applyUrlParams();
  renderProducts();

  $('#btnAddProduct').hide();
  $('#addProductWrapper').hide();

  $('#searchInput').on('input', debounce(function () {
    currentPage = 1;
    renderProducts();
  }, 300));

  $('#sortBy').on('change', function () {
    currentPage = 1;
    renderProducts();
  });

  $('#btnToggleFilter').on('click', function () {
    $(this).toggleClass('active');
    $('#filterAdvanced').toggleClass('open');
  });

  $('input[name="filterCategoryAll"]').on('change', function () {
    if ($(this).is(':checked')) {
      $('input[name="filterCategory"]').prop('checked', false);
    }
    currentPage = 1;
    renderProducts();
  });

  $('input[name="filterCategory"]').on('change', function () {
    var anyChecked = $('input[name="filterCategory"]:checked').length > 0;
    $('input[name="filterCategoryAll"]').prop('checked', !anyChecked);
    currentPage = 1;
    renderProducts();
  });

  $('input[name="filterStatus"]').on('change', function () {
    currentPage = 1;
    renderProducts();
  });

  $('input[name="filterBrand"]').on('change', function () {
    currentPage = 1;
    renderProducts();
  });

  $('input[name="filterPrice"]').on('change', function () {
    currentPage = 1;
    renderProducts();
  });

  $('#btnResetFilter').on('click', function () {
    $('input[name="filterCategoryAll"]').prop('checked', true);
    $('input[name="filterCategory"]').prop('checked', false);
    $('input[name="filterStatus"][value=""]').prop('checked', true);
    $('input[name="filterPrice"][value=""]').prop('checked', true);
    $('input[name="filterBrand"]').prop('checked', false);

    $('#searchInput').val('');
    $('#sortBy').val('');
    currentPage = 1;
    renderProducts();
  });

  $('#btnAddProduct').on('click', function () {
    editingId = null;
    $('#modalTitle').text('Thêm sản phẩm mới');
    $('#productForm')[0].reset();
    $('#productId').val('');
    clearValidation();
    productModal.show();
  });

  $('#btnSaveProduct').on('click', function () {
    saveProduct();
  });

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

  $('#productName').on('input', function () { validateField('name'); });
  $('#productDescription').on('input', function () { validateField('description'); });
  $('#productPrice').on('input', function () {
    var raw = $(this).val().replace(/\./g, '').replace(/[^0-9]/g, '');
    if (raw) {
      $(this).val(Number(raw).toLocaleString('vi-VN'));
    }
    validateField('price');
  });
  $('#productDeadline').on('change', function () { validateField('deadline'); });
  $('#productCategory').on('change', function () { validateField('category'); });

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

  $(document).on('click', '.btn-cart-product', function () {
    if (!isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa đăng nhập',
        text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.',
        confirmButtonText: 'Đăng nhập ngay',
        showCancelButton: true,
        cancelButtonText: 'Để sau'
      }).then(function (result) {
        if (result.isConfirmed) {
          window.location.href = 'login.html';
        }
      });
      return;
    }
    var result = StorageService.addToCart($(this).data('id'), 1);
    if (result && result.error) {
      showStockWarning(result);
      return;
    }
    updateCartBadge();
    showToast('Đã thêm vào giỏ hàng!', 'success');
  });

  $(document).on('click', '.page-link-custom', function (e) {
    e.preventDefault();
    var page = $(this).data('page');
    if (page && page !== currentPage) {
      currentPage = page;
      renderProducts();
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  });

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

  function applyUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var category = params.get('category');
    if (category) {
      $('input[name="filterCategoryAll"]').prop('checked', false);
      $('input[name="filterCategory"][value="' + category + '"]').prop('checked', true);
    }
  }

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

    var flashItems = getFlashSaleItems();

    var html = '';
    pageProducts.forEach(function (product, index) {
      var deadlineClass = isExpired(product.deadline) ? 'expired' : '';
      var colClass = viewMode === 'grid' ? 'col-lg-4 col-md-6 col-sm-6' : 'col-12';
      var rating = StorageService.getProductRating(product.id);
      var stars = generateStars(rating.avg);
      var reviewCount = rating.count;

      var discountPercent = flashItems[product.id] || 0;

      var statusIcon = product.status === 'Còn hàng' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
      var discountBadgeHtml = discountPercent > 0
        ? '<span class="card-discount-badge">-' + discountPercent + '%</span>'
        : '';

      var priceHtml = '';
      if (discountPercent > 0) {
        var discountedPrice = Math.round(product.price * (1 - discountPercent / 100));
        priceHtml = '<span class="price-original">' + formatPrice(product.price) + '</span> <span class="price-tag price-sale">' + formatPrice(discountedPrice) + '</span>';
      } else {
        priceHtml = '<span class="price-tag">' + formatPrice(product.price) + '</span>';
      }

      html += '<div class="' + colClass + ' product-card fade-in" draggable="true" data-id="' + product.id + '" style="animation-delay:' + (index * 0.05) + 's">' +
        '<div class="card-milkshop">' +
        '<div class="img-wrapper">' +
        '<a href="product-detail.html?id=' + product.id + '"><img src="' + product.image + '" class="card-img-top" alt="' + product.name + '" onerror="this.src=\'assets/img/no-image.svg\'"></a>' +
        '<span class="card-status-badge ' + (product.status === 'Còn hàng' ? 'status-in-stock' : 'status-out-stock') + '">' + statusIcon + ' ' + product.status + '</span>' +
        discountBadgeHtml +
        '<span class="card-heart" title="Yêu thích"><i class="far fa-heart"></i></span>' +
        '</div>' +
        '<div class="card-body">' +
        '<h5 class="card-title"><a href="product-detail.html?id=' + product.id + '" class="text-decoration-none" style="color:inherit">' + product.name + '</a></h5>' +
        '<div class="product-info-row">' +
        '<span class="info-cat"><i class="fas fa-tag"></i> ' + product.category + '</span>' +
        '<span class="info-deadline ' + deadlineClass + '"><i class="fas fa-calendar-alt"></i> HSD: ' + formatDate(product.deadline) + '</span>' +
        '</div>' +
        '<div class="product-info-row" style="margin-top:2px">' +
        '<span style="font-size:12px;color:' + (product.stock !== undefined ? (product.stock <= 0 ? '#ef4444' : (product.stock <= 5 ? '#ef4444' : (product.stock <= 20 ? '#f59e0b' : '#10b981'))) : '#888') + ';font-weight:600"><i class="fas fa-warehouse" style="font-size:10px"></i> Kho: ' + (product.stock !== undefined ? product.stock : 0) + ' sp</span>' +
        '</div>' +
        '<div class="product-rating">' + stars + (reviewCount > 0 ? ' <span class="rating-count">(' + reviewCount + ')</span>' : '') + '</div>' +
        '<div class="card-bottom">' +
        priceHtml +
        (product.status === 'Còn hàng'
          ? '<button class="btn btn-sm btn-add-cart btn-cart-product" data-id="' + product.id + '" title="Thêm vào giỏ">' +
          '<i class="fas fa-cart-plus me-1"></i>Thêm' +
          '</button>'
          : '<button class="btn btn-sm btn-add-cart btn-cart-product" disabled title="Sản phẩm đã hết hàng" style="opacity:0.45;cursor:not-allowed;filter:grayscale(1);">' +
          '<i class="fas fa-cart-plus me-1"></i>Thêm' +
          '</button>') +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    });

    container.html(html);
    renderPagination(totalPages);

    container.find('.card-heart').each(function () {
      var pid = $(this).closest('[data-id]').data('id');
      if (pid && typeof isInWishlist === 'function' && isInWishlist(pid)) {
        $(this).addClass('active');
      }
    });
  }

  function generateStars(avg) {
    if (!avg || avg <= 0) return '<span class="text-muted" style="font-size:0.8rem">Chưa có đánh giá</span>';
    var full = Math.floor(avg);
    var half = (avg - full) >= 0.3 ? 1 : 0;
    if (full + half > 5) half = 0;
    var empty = 5 - full - half;
    var html = '';
    for (var i = 0; i < full; i++) html += '<i class="fas fa-star star-gold"></i>';
    if (half) html += '<i class="fas fa-star-half-alt star-gold"></i>';
    for (var j = 0; j < empty; j++) html += '<i class="far fa-star star-gray"></i>';
    return html;
  }

  function getFilteredProducts() {
    var products = StorageService.getAllProducts();
    var search = $('#searchInput').val().trim().toLowerCase();
    var status = $('input[name="filterStatus"]:checked').val();

    var selectedCategories = [];
    $('input[name="filterCategory"]:checked').each(function () {
      selectedCategories.push($(this).val());
    });
    var sortBy = $('#sortBy').val();

    var selectedBrands = [];
    $('input[name="filterBrand"]:checked').each(function () {
      selectedBrands.push($(this).val());
    });

    if (search) {
      products = products.filter(function (p) {
        return p.name.toLowerCase().indexOf(search) > -1 ||
          (p.description || '').toLowerCase().indexOf(search) > -1;
      });
    }

    if (status) {
      products = products.filter(function (p) { return p.status === status; });
    }

    if (selectedCategories.length > 0) {
      products = products.filter(function (p) {
        return selectedCategories.indexOf(p.category) > -1;
      });
    }

    if (selectedBrands.length > 0) {
      var brandMap = {
        'Vinamilk': ['Vinamilk', 'Ông Thọ', 'Probi', 'Dielac', 'Ngôi Sao'],
        'Abbott': ['Ensure', 'Similac', 'Glucerna'],
        'TH': ['TH'],
        'Mộc Châu': ['Mộc Châu'],
        'Dalat': ['Dalat'],
        'Yakult': ['Yakult']
      };
      var keywords = [];
      selectedBrands.forEach(function (brand) {
        var subs = brandMap[brand] || [brand];
        subs.forEach(function (s) { keywords.push(s); });
      });
      products = products.filter(function (p) {
        return keywords.some(function (kw) {
          return p.name && p.name.indexOf(kw) !== -1;
        });
      });
    }

    var priceRange = $('input[name="filterPrice"]:checked').val();
    if (priceRange) {
      var parts = priceRange.split('-');
      var minPrice = parseInt(parts[0]);
      var maxPrice = parseInt(parts[1]);
      products = products.filter(function (p) {
        return p.price >= minPrice && p.price <= maxPrice;
      });
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

  function saveProduct() {
    if (!validateForm()) return;

    var data = {
      name: $('#productName').val().trim(),
      description: $('#productDescription').val().trim(),
      price: Number($('#productPrice').val().replace(/\./g, '')),
      deadline: $('#productDeadline').val(),
      category: $('#productCategory').val(),
      status: $('#productStatus').val(),
      image: $('#productImage').val().trim() || 'assets/img/no-image.svg'
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

  function openEditModal(id) {
    var product = StorageService.getProductById(id);
    if (!product) return;

    editingId = id;
    $('#modalTitle').text('Sửa sản phẩm');
    $('#productId').val(id);
    $('#productName').val(product.name);
    $('#productDescription').val(product.description);
    $('#productPrice').val(Number(product.price).toLocaleString('vi-VN'));
    $('#productDeadline').val(product.deadline);
    $('#productCategory').val(product.category);
    $('#productStatus').val(product.status);
    $('#productImage').val(product.image);
    clearValidation();
    productModal.show();
  }

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
        var price = Number($('#productPrice').val().replace(/\./g, ''));
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
