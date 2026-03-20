$(document).ready(function () {
  'use strict';

  // Phân quyền giao diện
  if (isAdmin()) {
    initAdminView();
  } else {
    initCustomerView();
  }

  // ====================================
  // GIAO DIỆN KHÁCH HÀNG — GIỎ HÀNG
  // ====================================
  function initCustomerView() {
    $('#pageTitle').html('<i class="fas fa-shopping-cart me-2"></i>Giỏ hàng');
    $('#pageDesc').text('Quản lý các sản phẩm bạn đã chọn mua');
    $('#customerView').removeClass('view-hidden');
    renderCart();

    // Xóa toàn bộ giỏ hàng
    $('#btnClearCart').on('click', function () {
      var cart = StorageService.getCart();
      if (cart.length === 0) {
        showToast('Giỏ hàng đang trống!', 'info');
        return;
      }
      showConfirm('Xóa giỏ hàng?', 'Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')
        .then(function (result) {
          if (result.isConfirmed) {
            StorageService.clearCart();
            renderCart();
            updateCartBadge();
            showToast('Đã xóa giỏ hàng!', 'success');
          }
        });
    });

    // Đặt hàng
    $('#btnPlaceOrder').on('click', function () {
      var cart = StorageService.getCart();
      if (cart.length === 0) {
        showToast('Giỏ hàng trống! Hãy thêm sản phẩm trước.', 'warning');
        return;
      }

      showConfirm('Xác nhận đặt hàng?', 'Tổng tiền: ' + formatPrice(StorageService.getCartTotal()))
        .then(function (result) {
          if (result.isConfirmed) {
            var order = StorageService.placeOrder();
            if (order) {
              Swal.fire({
                icon: 'success',
                title: 'Đặt hàng thành công!',
                html: 'Mã đơn hàng: <strong>' + order.id + '</strong><br>Tổng tiền: <strong>' + formatPrice(order.total) + '</strong>',
                confirmButtonColor: '#2563eb'
              });
              renderCart();
              updateCartBadge();
            }
          }
        });
    });

    // Giảm số lượng
    $(document).on('click', '.btn-qty-minus', function () {
      var id = $(this).data('id');
      var cart = StorageService.getCart();
      var item = cart.find(function (c) { return c.productId === id; });
      if (item && item.quantity > 1) {
        StorageService.updateCartQuantity(id, item.quantity - 1);
      } else {
        StorageService.removeFromCart(id);
      }
      renderCart();
      updateCartBadge();
    });

    // Tăng số lượng
    $(document).on('click', '.btn-qty-plus', function () {
      var id = $(this).data('id');
      var cart = StorageService.getCart();
      var item = cart.find(function (c) { return c.productId === id; });
      if (item) {
        StorageService.updateCartQuantity(id, item.quantity + 1);
      }
      renderCart();
      updateCartBadge();
    });

    // Xóa 1 sản phẩm
    $(document).on('click', '.btn-remove-cart-item', function () {
      var id = $(this).data('id');
      StorageService.removeFromCart(id);
      renderCart();
      updateCartBadge();
      showToast('Đã xóa khỏi giỏ hàng!', 'success');
    });
  }

  // Hiển thị giỏ hàng
  function renderCart() {
    var cart = StorageService.getCart();
    $('#cartItemCount').text(cart.length);

    if (cart.length === 0) {
      $('#cartItems').html(
        '<div class="empty-state">' +
          '<i class="fas fa-shopping-cart"></i>' +
          '<h4>Giỏ hàng trống</h4>' +
          '<p>Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm.</p>' +
          '<a href="products.html" class="btn btn-primary-milkshop mt-3">' +
            '<i class="fas fa-shopping-bag me-2"></i>Xem sản phẩm' +
          '</a>' +
        '</div>'
      );
      updateSummary(0);
      return;
    }

    var html = '';
    cart.forEach(function (item) {
      html += '<div class="cart-item fade-in">' +
        '<img src="' + (item.image || 'assets/img/suatuoivinamilk.jpg') + '" alt="' + item.name + '" class="cart-item-img" onerror="this.src=\'assets/img/suatuoivinamilk.jpg\'">' +
        '<div class="cart-item-info">' +
          '<h6>' + item.name + '</h6>' +
          '<span class="cart-item-price">' + formatPrice(item.price) + ' / sản phẩm</span>' +
        '</div>' +
        '<div class="cart-item-quantity">' +
          '<button class="btn btn-outline-secondary btn-qty-minus" data-id="' + item.productId + '">' +
            '<i class="fas fa-minus"></i>' +
          '</button>' +
          '<span class="qty-value">' + item.quantity + '</span>' +
          '<button class="btn btn-outline-secondary btn-qty-plus" data-id="' + item.productId + '">' +
            '<i class="fas fa-plus"></i>' +
          '</button>' +
        '</div>' +
        '<span class="cart-item-subtotal">' + formatPrice(item.subtotal) + '</span>' +
        '<button class="cart-item-remove btn-remove-cart-item" data-id="' + item.productId + '" title="Xóa">' +
          '<i class="fas fa-times"></i>' +
        '</button>' +
      '</div>';
    });

    $('#cartItems').html(html);
    updateSummary(StorageService.getCartTotal());
  }

  function updateSummary(total) {
    $('#subtotalDisplay').text(formatPrice(total));
    $('#totalDisplay').text(formatPrice(total));
  }

  // ====================================
  // GIAO DIỆN ADMIN — QUẢN LÝ ĐƠN HÀNG
  // ====================================
  function initAdminView() {
    $('#pageTitle').html('<i class="fas fa-clipboard-list me-2"></i>Quản lý đơn hàng');
    $('#pageDesc').text('Xem và xử lý đơn hàng từ khách hàng');
    $('#adminView').removeClass('view-hidden');
    renderOrders();

    // Xóa toàn bộ đơn hàng
    $('#btnClearOrders').on('click', function () {
      var orders = StorageService.getAllOrders();
      if (orders.length === 0) {
        showToast('Chưa có đơn hàng nào!', 'info');
        return;
      }
      showConfirm('Xóa tất cả đơn hàng?', 'Hành động này không thể hoàn tác!')
        .then(function (result) {
          if (result.isConfirmed) {
            localStorage.removeItem('milkshop_orders');
            renderOrders();
            showToast('Đã xóa tất cả đơn hàng!', 'success');
          }
        });
    });

    // Xóa 1 đơn hàng
    $(document).on('click', '.btn-delete-order', function () {
      var orderId = $(this).data('id');
      showConfirm('Xóa đơn hàng?', 'Mã: ' + orderId)
        .then(function (result) {
          if (result.isConfirmed) {
            var orders = StorageService.getAllOrders();
            orders = orders.filter(function (o) { return o.id !== orderId; });
            localStorage.setItem('milkshop_orders', JSON.stringify(orders));
            renderOrders();
            showToast('Đã xóa đơn hàng!', 'success');
          }
        });
    });
  }

  // Hiển thị danh sách đơn hàng
  function renderOrders() {
    var orders = StorageService.getAllOrders();

    // Cập nhật thống kê
    $('#orderTotal').text(orders.length);
    var totalRevenue = orders.reduce(function (sum, o) { return sum + o.total; }, 0);
    $('#orderRevenue').text(formatPrice(totalRevenue));
    var totalItems = orders.reduce(function (sum, o) {
      return sum + o.items.reduce(function (s, i) { return s + i.quantity; }, 0);
    }, 0);
    $('#orderItems').text(totalItems);

    if (orders.length === 0) {
      $('#orderList').html(
        '<div class="empty-state">' +
          '<i class="fas fa-clipboard-list"></i>' +
          '<h4>Chưa có đơn hàng</h4>' +
          '<p>Đơn hàng từ khách hàng sẽ hiển thị tại đây.</p>' +
        '</div>'
      );
      return;
    }

    // Sắp xếp đơn hàng mới nhất trước
    orders.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

    var html = '';
    orders.forEach(function (order, index) {
      var orderDate = new Date(order.date);
      var dateStr = orderDate.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      var itemsHtml = '';
      order.items.forEach(function (item) {
        itemsHtml += '<div class="order-product-row">' +
          '<img src="' + (item.image || 'assets/img/suatuoivinamilk.jpg') + '" alt="' + item.name + '" class="order-product-img" onerror="this.src=\'assets/img/suatuoivinamilk.jpg\'">' +
          '<div class="order-product-info">' +
            '<span class="order-product-name">' + item.name + '</span>' +
            '<span class="order-product-detail">' + formatPrice(item.price) + ' × ' + item.quantity + '</span>' +
          '</div>' +
          '<span class="order-product-subtotal">' + formatPrice(item.price * item.quantity) + '</span>' +
        '</div>';
      });

      html += '<div class="order-card fade-in" style="animation-delay:' + (index * 0.05) + 's">' +
        '<div class="order-card-header">' +
          '<div class="order-card-left">' +
            '<span class="order-id"><i class="fas fa-hashtag me-1"></i>' + order.id + '</span>' +
            '<span class="order-date"><i class="fas fa-clock me-1"></i>' + dateStr + '</span>' +
          '</div>' +
          '<div class="order-card-right">' +
            '<span class="order-total">' + formatPrice(order.total) + '</span>' +
            '<button class="btn btn-sm btn-outline-danger btn-delete-order" data-id="' + order.id + '" title="Xóa">' +
              '<i class="fas fa-trash"></i>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="order-card-body">' +
          itemsHtml +
        '</div>' +
      '</div>';
    });

    $('#orderList').html(html);
  }
});
