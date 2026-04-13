$(document).ready(function () {

  var params = new URLSearchParams(window.location.search);

  var productId = params.get('id');

  if (!productId) {

    showNotFound();
    return; 
  }

  var product = StorageService.getProductById(productId);

  if (!product) {

    showNotFound();
    return; 
  }

  renderProductDetail(product);

  renderRelatedProducts(product);
});

function renderProductDetail(product) {

  document.title = product.name + ' — MilkShop';

  $('#breadcrumbName').text(product.name);

  var flashItems = getFlashSaleItems();

  var discount = flashItems[product.id] || 0;

  var statusClass = product.status === 'Còn hàng' ? 'badge-status-in' : 'badge-status-out';

  var statusIcon = product.status === 'Còn hàng' ? 'fa-check-circle' : 'fa-times-circle';

  var badgesHtml = '<span class="detail-badge ' + statusClass + '"><i class="fas ' + statusIcon + '"></i> ' + product.status + '</span>';

  if (discount > 0) {
    badgesHtml += '<span class="detail-badge badge-sale"><i class="fas fa-bolt"></i> -' + discount + '%</span>';
  }

  var ratingData = StorageService.getProductRating(product.id);
  var starsHtml = ''; 

  var reviewCount = ratingData.count;

  if (ratingData.avg > 0) {

    var full = Math.floor(ratingData.avg);

    var half = (ratingData.avg - full) >= 0.3 ? 1 : 0;

    if (full + half > 5) half = 0;

    var empty = 5 - full - half;

    for (var i = 0; i < full; i++) starsHtml += '<i class="fas fa-star"></i>';

    if (half) starsHtml += '<i class="fas fa-star-half-alt"></i>';

    for (var j = 0; j < empty; j++) starsHtml += '<i class="far fa-star"></i>';
  } else {

    starsHtml = '<span class="text-muted" style="font-size:0.85rem">Chưa có đánh giá</span>';
  }

  var priceHtml = '';

  if (discount > 0) {

    var salePrice = Math.round(product.price * (1 - discount / 100));

    var saveAmount = product.price - salePrice;

    priceHtml =
      '<div class="detail-price-original">' + formatPrice(product.price) + '</div>' + 
      '<div><span class="detail-price-current">' + formatPrice(salePrice) + '</span>' + 
      '<span class="detail-price-save">Tiết kiệm ' + formatPrice(saveAmount) + '</span></div>'; 
  } else {

    priceHtml = '<div class="detail-price-current detail-price-normal">' + formatPrice(product.price) + '</div>';
  }

  var now = new Date(); 
  var deadline = new Date(product.deadline); 

  var isExpired = deadline < now;

  var deadlineClass = isExpired ? 'expired' : '';

  var deadlineText = isExpired ? 'Đã hết hạn' : formatDate(product.deadline);

  var wishlistActive = typeof isInWishlist === 'function' && isInWishlist(product.id) ? ' active' : '';

  var isOutOfStock = product.status !== 'Còn hàng'; 

  var disabledAttr = isOutOfStock ? ' disabled' : '';

  var disabledText = isOutOfStock ? 'Hết hàng' : '<i class="fas fa-cart-plus"></i> Thêm vào giỏ';

  var html =
    '<div class="detail-grid">' +

      '<div class="detail-image-wrap">' +

        '<img src="' + product.image + '" alt="' + product.name + '" onerror="this.src=\'assets/img/no-image.svg\'">' +

        '<div class="detail-badges">' + badgesHtml + '</div>' +
      '</div>' +

      '<div class="detail-info">' +

        '<span class="detail-category"><i class="fas fa-tag"></i> ' + product.category + '</span>' +

        '<h1 class="detail-title">' + product.name + '</h1>' +

        '<div class="detail-rating">' +
          '<span class="stars">' + starsHtml + '</span>' +

          (reviewCount > 0 ? '<span class="count">(' + reviewCount + ' đánh giá)</span>' : '') +
        '</div>' +

        '<div class="detail-price-box">' + priceHtml + '</div>' +

        '<div class="detail-desc">' + product.description + '</div>' +

        '<div class="detail-meta">' +

          '<div class="detail-meta-item"><i class="fas fa-calendar-alt"></i><span>Hạn sử dụng: <strong class="' + deadlineClass + '">' + deadlineText + '</strong></span></div>' +
          '<div class="detail-meta-item"><i class="fas fa-boxes"></i><span>Danh mục: <strong>' + product.category + '</strong></span></div>' +

          '<div class="detail-meta-item"><i class="fas fa-warehouse"></i><span>Tồn kho: <strong style="color:' + (product.stock <= 5 ? '#ef4444' : (product.stock <= 20 ? '#f59e0b' : '#10b981')) + '">' + (product.stock !== undefined ? product.stock + ' sản phẩm' : 'Không rõ') + '</strong></span></div>' +
          '<div class="detail-meta-item"><i class="fas fa-barcode"></i><span>Mã SP: <strong>' + product.id.toUpperCase() + '</strong></span></div>' +
        '</div>' +

        '<div class="detail-actions">' +

          '<div class="qty-group">' +
            '<button type="button" id="qtyMinus"><i class="fas fa-minus"></i></button>' + 

            '<input type="number" id="qtyInput" value="1" min="1" max="' + (product.stock || 99) + '">' +
            '<button type="button" id="qtyPlus"><i class="fas fa-plus"></i></button>' + 
          '</div>' +

          '<button class="btn-add-detail" id="btnAddToCart" data-id="' + product.id + '"' + disabledAttr + '>' + disabledText + '</button>' +

          '<button class="btn-wishlist-detail' + wishlistActive + '" id="btnWishlist" data-id="' + product.id + '" title="Yêu thích">' +

            '<i class="' + (wishlistActive ? 'fas' : 'far') + ' fa-heart"></i>' +
          '</button>' +
        '</div>' +

        '<div class="detail-trust">' +
          '<div class="trust-item"><i class="fas fa-shield-alt"></i><span>Hàng chính hãng 100%</span></div>' +
          '<div class="trust-item"><i class="fas fa-truck"></i><span>Giao hàng nhanh 24h</span></div>' +
          '<div class="trust-item"><i class="fas fa-undo"></i><span>Đổi trả trong 7 ngày</span></div>' +
        '</div>' +

        '<div class="detail-user-rating" style="margin-top:20px;padding:16px;background:rgba(255,255,255,0.05);border-radius:12px;border:1px solid rgba(255,255,255,0.1)">' +
          '<h5 style="margin-bottom:12px;font-weight:600"><i class="fas fa-star me-2" style="color:#f59e0b"></i>Đánh giá sản phẩm này</h5>' +

          '<div id="userRatingStars" style="font-size:1.8rem;cursor:pointer;display:flex;gap:4px">' +
            '<i class="far fa-star rating-star" data-star="1" style="color:#d1d5db;transition:color 0.2s"></i>' +
            '<i class="far fa-star rating-star" data-star="2" style="color:#d1d5db;transition:color 0.2s"></i>' +
            '<i class="far fa-star rating-star" data-star="3" style="color:#d1d5db;transition:color 0.2s"></i>' +
            '<i class="far fa-star rating-star" data-star="4" style="color:#d1d5db;transition:color 0.2s"></i>' +
            '<i class="far fa-star rating-star" data-star="5" style="color:#d1d5db;transition:color 0.2s"></i>' +
          '</div>' +

          '<p id="ratingFeedback" style="margin-top:8px;font-size:0.9rem;color:#9ca3af"></p>' +
        '</div>' +
      '</div>' +
    '</div>';

  $('#productDetailContent').html(html);

  $('#userRatingStars').on('mouseenter', '.rating-star', function () {

    var hoverVal = $(this).data('star');

    $('#userRatingStars .rating-star').each(function () {
      var s = $(this).data('star');

      $(this).css('color', s <= hoverVal ? '#f59e0b' : '#d1d5db')
             .removeClass('far fas').addClass(s <= hoverVal ? 'fas' : 'far'); 
    });

  }).on('mouseleave', function () {

    $('#userRatingStars .rating-star').each(function () {
      $(this).css('color', '#d1d5db').removeClass('fas').addClass('far');
    });
  });

  $('#userRatingStars').on('click', '.rating-star', function () {
    var starVal = $(this).data('star'); 

    StorageService.addRating(product.id, starVal);

    var newRating = StorageService.getProductRating(product.id);

    var newStars = '';

    var full = Math.floor(newRating.avg);
    var half = (newRating.avg - full) >= 0.3 ? 1 : 0;
    if (full + half > 5) half = 0;
    var empty = 5 - full - half;
    for (var k = 0; k < full; k++) newStars += '<i class="fas fa-star"></i>';
    if (half) newStars += '<i class="fas fa-star-half-alt"></i>';
    for (var l = 0; l < empty; l++) newStars += '<i class="far fa-star"></i>';

    $('.detail-rating .stars').html(newStars);

    $('.detail-rating .count').text('(' + newRating.count + ' đánh giá)');

    $('#ratingFeedback').html('<i class="fas fa-check-circle text-success me-1"></i>Cảm ơn bạn đã đánh giá <b>' + starVal + ' sao</b>! Trung bình: <b>' + newRating.avg + '/5</b>');

    showToast('Đã đánh giá ' + starVal + ' sao!', 'success');
  });

  $('#qtyMinus').on('click', function () {

    var val = parseInt($('#qtyInput').val()) || 1;

    if (val > 1) $('#qtyInput').val(val - 1);
  });

  $('#qtyPlus').on('click', function () {
    var val = parseInt($('#qtyInput').val()) || 1;

    var maxStock = product.stock !== undefined ? product.stock : 99;
    if (val < maxStock) {

      $('#qtyInput').val(val + 1);
    } else {

      showToast('Kho chỉ còn ' + maxStock + ' sản phẩm!', 'warning');
    }
  });

  $('#btnAddToCart').on('click', function () {

    if (!isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa đăng nhập',
        text: 'Bạn cần đăng nhập để thêm vào giỏ hàng.',
        confirmButtonText: 'Đăng nhập ngay',
        showCancelButton: true,
        cancelButtonText: 'Để sau'
      }).then(function (result) {

        if (result.isConfirmed) window.location.href = 'login.html';
      });
      return; 
    }

    var qty = parseInt($('#qtyInput').val()) || 1;

    var result = StorageService.addToCart(product.id, qty);

    if (result && result.error) {
      showStockWarning(result); 
      return; 
    }

    updateCartBadge();

    showToast('Đã thêm ' + qty + ' sản phẩm vào giỏ hàng!', 'success');
  });

  $('#btnWishlist').on('click', function () {

    if (typeof toggleWishlist === 'function') {

      var added = toggleWishlist(product.id);

      $(this).toggleClass('active', added);

      $(this).find('i').toggleClass('far', !added).toggleClass('fas', added);
    }
  });
}

function renderRelatedProducts(product) {
  var allProducts = StorageService.getAllProducts(); 

  var related = allProducts.filter(function (p) {
    return p.category === product.category && p.id !== product.id && p.status === 'Còn hàng';
  }).slice(0, 4); 

  if (related.length === 0) {

    related = allProducts.filter(function (p) {
      return p.id !== product.id && p.status === 'Còn hàng';
    }).sort(function () { return 0.5 - Math.random(); }).slice(0, 4);
  }

  if (related.length === 0) {
    $('.section-related-products').hide();
    return;
  }

  var flashItems = getFlashSaleItems();

  var html = ''; 

  related.forEach(function (p) {
    var disc = flashItems[p.id] || 0;

    var discBadge = disc > 0
      ? '<span class="card-discount-badge"><i class="fas fa-bolt me-1"></i>-' + disc + '%</span>'
      : '';

    var priceHtml = '';
    if (disc > 0) {

      var sp = Math.round(p.price * (1 - disc / 100));
      priceHtml = '<span class="price-original">' + formatPrice(p.price) + '</span> <span class="price-tag price-sale">' + formatPrice(sp) + '</span>';
    } else {
      priceHtml = '<span class="price-tag">' + formatPrice(p.price) + '</span>';
    }

    html +=
      '<div class="col-lg-3 col-md-6 related-card">' +
        '<a href="product-detail.html?id=' + p.id + '" class="text-decoration-none">' +
          '<div class="card-milkshop h-100">' +
            '<div class="img-wrapper">' + 
              '<img src="' + p.image + '" class="card-img-top" alt="' + p.name + '" onerror="this.src=\'assets/img/no-image.svg\'">' +
              discBadge + 
            '</div>' +
            '<div class="card-body">' +
              '<h5 class="card-title" style="font-size:0.9rem">' + p.name + '</h5>' + 
              '<div>' + priceHtml + '</div>' + 
            '</div>' +
          '</div>' +
        '</a>' +
      '</div>';
  });

  $('#relatedProducts').html(html);
}

function showNotFound() {
  $('#productDetailContent').html(
    '<div class="product-not-found">' +
      '<i class="fas fa-search"></i>' + 
      '<h3>Không tìm thấy sản phẩm</h3>' +
      '<p>Sản phẩm này không tồn tại hoặc đã bị xóa.</p>' +

      '<a href="products.html" class="btn btn-primary-milkshop"><i class="fas fa-arrow-left me-2"></i>Quay lại cửa hàng</a>' +
    '</div>'
  );

  $('.section-related-products').hide();
}
