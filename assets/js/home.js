$(document).ready(function () {
  'use strict';

  loadFeaturedProducts();
  loadCategoryCounts();
});

function loadFeaturedProducts() {
  var products = StorageService.getAllProducts();
  var featured = products.filter(function (p) { return p.status === 'Còn hàng'; }).slice(0, 4);

  if (featured.length === 0) {
    $('#featuredProducts').html(
      '<div class="col-12">' +
        '<div class="empty-state">' +
          '<i class="fas fa-box-open"></i>' +
          '<h4>Chưa có sản phẩm</h4>' +
          '<p>Hãy thêm sản phẩm trong trang Quản lý sản phẩm.</p>' +
        '</div>' +
      '</div>'
    );
    return;
  }

  var showCart = isCustomer();

  var html = '';
  featured.forEach(function (product, index) {
    html += '<div class="col-lg-3 col-md-6 featured-card fade-in" style="animation-delay:' + (index * 0.1) + 's">' +
      '<div class="card-milkshop h-100">' +
        '<div class="img-wrapper">' +
          '<img src="' + product.image + '" class="card-img-top" alt="' + product.name + '">' +
        '</div>' +
        '<div class="card-body d-flex flex-column">' +
          '<div class="d-flex justify-content-between align-items-start mb-2">' +
            '<span class="badge-category ' + getCategoryBadgeClass(product.category) + '">' + product.category + '</span>' +
            '<span class="badge-status ' + getStatusBadgeClass(product.status) + '">' + product.status + '</span>' +
          '</div>' +
          '<h5 class="card-title">' + product.name + '</h5>' +
          '<p class="card-text flex-grow-1">' + truncateText(product.description, 60) + '</p>' +
          '<div class="d-flex justify-content-between align-items-center mt-auto">' +
            '<span class="product-price">' + formatPrice(product.price) + '</span>' +
            (showCart ?
              '<button class="btn btn-sm btn-primary-milkshop btn-add-cart-home" data-id="' + product.id + '">' +
                '<i class="fas fa-cart-plus"></i>' +
              '</button>'
            :
              '<a href="products.html" class="btn btn-sm btn-primary-milkshop">' +
                '<i class="fas fa-eye"></i>' +
              '</a>'
            ) +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  });

  $('#featuredProducts').html(html);

  if (showCart) {
    $('.btn-add-cart-home').on('click', function () {
      var id = $(this).data('id');
      StorageService.addToCart(id, 1);
      updateCartBadge();
      showToast('Đã thêm vào giỏ hàng!', 'success');
    });
  }
}

function loadCategoryCounts() {
  var stats = StorageService.getProductStats();
  var byCategory = stats.byCategory;

  $('#countSuaTuoi').text((byCategory['Sữa tươi'] || 0) + ' sản phẩm');
  $('#countSuaBot').text((byCategory['Sữa bột'] || 0) + ' sản phẩm');
  $('#countSuaChua').text((byCategory['Sữa chua'] || 0) + ' sản phẩm');
  $('#countSuaHat').text((byCategory['Sữa hạt'] || 0) + ' sản phẩm');
}
