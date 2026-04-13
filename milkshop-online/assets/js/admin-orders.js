$(document).ready(function () {

  'use strict';

  renderOrders();

  $('#searchOrder').on('input', debounce(function () { renderOrders(); }, 300));

  $('#btnClearOrders').on('click', function () {

    var orders = StorageService.getAllOrders();

    if (orders.length === 0) {

      showToast('Chưa có đơn hàng nào!', 'info');

      return;
    }

    Swal.fire({
      icon: 'warning', 
      title: 'Xóa tất cả đơn hàng?', 
      text: 'Hành động này không thể hoàn tác!', 
      showCancelButton: true, 
      confirmButtonColor: '#ef4444', 
      cancelButtonText: 'Hủy', 
      confirmButtonText: 'Xóa tất cả' 
    }).then(function (result) {

      if (result.isConfirmed) {

        localStorage.removeItem('milkshop_orders');

        renderOrders();

        showToast('Đã xóa tất cả đơn hàng!', 'success');
      }
    });
  });

  $(document).on('click', '.btn-delete-order', function () {

    var orderId = $(this).data('id');

    Swal.fire({
      icon: 'warning', 
      title: 'Xóa đơn hàng?', 
      text: 'Mã: ' + orderId, 
      showCancelButton: true, 
      confirmButtonColor: '#ef4444', 
      cancelButtonText: 'Hủy', 
      confirmButtonText: 'Xóa' 
    }).then(function (result) {

      if (result.isConfirmed) {

        var orders = StorageService.getAllOrders();

        orders = orders.filter(function (o) { return o.id !== orderId; });

        localStorage.setItem('milkshop_orders', JSON.stringify(orders));

        renderOrders();

        showToast('Đã xóa đơn hàng!', 'success');
      }
    });
  });

  function renderOrders() {

    var orders = StorageService.getAllOrders();

    var search = ($('#searchOrder').val() || '').trim().toLowerCase();

    if (search) {

      orders = orders.filter(function (o) { return o.id.toLowerCase().indexOf(search) > -1; });
    }

    orders.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

    var allOrders = StorageService.getAllOrders();

    $('#orderTotal').text(allOrders.length);

    var totalRevenue = allOrders.reduce(function (s, o) { return s + o.total; }, 0);

    $('#orderRevenue').text(formatPrice(totalRevenue));

    var totalItems = allOrders.reduce(function (s, o) {
      return s + o.items.reduce(function (s2, i) { return s2 + i.quantity; }, 0);
    }, 0);

    $('#orderItems').text(totalItems);

    $('#orderAvg').text(allOrders.length > 0 ? formatPrice(Math.round(totalRevenue / allOrders.length)) : '0₫');

    if (orders.length === 0) {

      $('#orderTableBody').html('<tr><td colspan="7" class="text-center text-muted py-4">Chưa có đơn hàng nào</td></tr>');

      $('#orderInfo').text('Hiển thị 0 đơn hàng');
      return; 
    }

    var html = '';

    orders.forEach(function (order, idx) {

      var dateStr = new Date(order.date).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      var itemNames = order.items.map(function (i) {
        return i.name + ' ×' + i.quantity;
      }).join(', ');

      var customerHtml = '';

      if (order.customerName) {

        customerHtml = '<strong>' + order.customerName + '</strong>';

        if (order.customerPhone) customerHtml += '<br><small class="text-muted"><i class="fas fa-phone me-1"></i>' + order.customerPhone + '</small>';

        if (order.customerAddress) customerHtml += '<br><small class="text-muted"><i class="fas fa-map-marker-alt me-1"></i>' + order.customerAddress + '</small>';
      } else {

        customerHtml = '<span class="text-muted">—</span>';
      }

      var payLabels = { cod: '🚚 COD', banking: '🏦 Chuyển khoản', ewallet: '📱 Ví điện tử' };

      var payText = payLabels[order.paymentMethod] || (order.paymentMethod ? order.paymentMethod : '<span class="text-muted">—</span>');

      var payHtml = '<small>' + payText + '</small>';

      html += '<tr>' +

        '<td class="text-muted">' + (idx + 1) + '</td>' +

        '<td><span class="fw-semibold" style="color:var(--primary)">' + order.id + '</span></td>' +

        '<td>' + dateStr + '</td>' +

        '<td>' + customerHtml + '</td>' +

        '<td><span style="max-width:250px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + itemNames + '</span></td>' +

        '<td class="fw-bold">' + formatPrice(order.total) + (order.vatAmount ? '<br><small class="text-muted fw-normal">VAT: ' + formatPrice(order.vatAmount) + '</small>' : '') + (order.discount ? '<br><small class="text-success fw-normal">Gi\u1ea3m: -' + formatPrice(order.discount) + '</small>' : '') + '</td>' +

        '<td class="text-center">' + payHtml + '</td>' +

        '<td class="text-center">' +
          '<button class="btn-action btn-action-danger btn-delete-order" data-id="' + order.id + '" title="Xóa"><i class="fas fa-trash"></i></button>' +
        '</td>' +
      '</tr>';
    });

    $('#orderTableBody').html(html);

    $('#orderInfo').text('Hiển thị ' + orders.length + ' đơn hàng');
  }
});
