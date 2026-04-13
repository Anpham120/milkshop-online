$(document).ready(function () {
  var products = StorageService.getAllProducts();
  var orders = StorageService.getAllOrders();
  var now = new Date();

  $('#statTotal').text(products.length);
  var conHang = products.filter(function (p) { return p.status === 'Còn hàng'; });
  var hetHang = products.filter(function (p) { return p.status === 'Hết hàng'; });
  $('#statConHang').text(conHang.length);
  $('#statHetHang').text(hetHang.length);
  $('#statOrders').text(orders.length);

  var totalRevenue = orders.reduce(function (s, o) { return s + o.total; }, 0);
  var totalVat = orders.reduce(function (s, o) { return s + (o.vatAmount || 0); }, 0);
  $('#statRevenue').html(formatPrice(totalRevenue) + '<small style="display:block;font-size:11px;color:#888;font-weight:normal">(gồm VAT: ' + formatPrice(totalVat) + ')</small>');

  var cats = {};
  products.forEach(function (p) { if (p.category) cats[p.category] = true; });
  $('#statCategories').text(Object.keys(cats).length);

  var knownBrands = ['Vinamilk', 'TH', 'Mộc Châu', 'Dalat', 'Ensure', 'Similac', 'Dielac', 'Ông Thọ', 'Yakult', 'Probi'];
  var brands = {};
  products.forEach(function (p) {
    knownBrands.forEach(function (b) {
      if (p.name && p.name.indexOf(b) !== -1) brands[b] = true;
    });
  });
  $('#statBrands').text(Object.keys(brands).length);

  var expiring = products.filter(function (p) {
    var d = new Date(p.deadline);
    var diff = (d - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  }).sort(function (a, b) {
    return new Date(a.deadline) - new Date(b.deadline);
  });
  $('#statExpiring').text(expiring.length);

  var lowStock = products.filter(function (p) {
    return p.stock !== undefined && p.stock <= 5 && p.status === 'Còn hàng';
  });
  if ($('#statLowStock').length) {
    $('#statLowStock').text(lowStock.length);
  }

  if (expiring.length === 0) {
    $('#expiringProducts').html('<tr><td colspan="5" class="text-center text-muted py-4"><i class="fas fa-check-circle text-success me-2"></i>Tất cả sản phẩm còn hạn sử dụng tốt</td></tr>');
  } else {
    var html = '';
    expiring.slice(0, 5).forEach(function (p) {
      var d = new Date(p.deadline);
      var daysLeft = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

      var badgeClass, badgeText;
      if (daysLeft <= 3) {
        badgeClass = 'bg-danger text-white';
        badgeText = daysLeft + ' ngày';
      } else if (daysLeft <= 7) {
        badgeClass = 'bg-warning text-dark';
        badgeText = daysLeft + ' ngày';
      } else {
        badgeClass = 'bg-info text-white';
        badgeText = daysLeft + ' ngày';
      }

      html += '<tr>' +
        '<td><div class="d-flex align-items-center gap-2">' +
          '<img src="' + (p.image ? '../' + p.image : '../assets/img/no-image.svg') + '" class="product-thumb" onerror="this.src=\'../assets/img/no-image.svg\'">' +
          '<span class="product-name">' + p.name + '</span>' +
        '</div></td>' +
        '<td>' + (p.category || '—') + '</td>' +
        '<td>' + formatPrice(p.price) + '</td>' +
        '<td class="' + (daysLeft <= 7 ? 'text-danger fw-bold' : '') + '">' + formatDate(p.deadline) + '</td>' +
        '<td><span class="badge rounded-pill ' + badgeClass + '">' + badgeText + '</span></td>' +
      '</tr>';
    });
    $('#expiringProducts').html(html);
  }

  if (orders.length === 0) {
    $('#recentOrders').html('<tr><td colspan="3" class="text-center text-muted py-4"><i class="fas fa-inbox me-2"></i>Chưa có đơn hàng nào</td></tr>');
  } else {
    var recentOrders = orders.slice(-5).reverse();
    var oHtml = '';
    recentOrders.forEach(function (o) {
      oHtml += '<tr>' +
        '<td><span class="fw-semibold text-primary">' + (o.id || '—') + '</span></td>' +
        '<td>' + formatDate(o.date) + '</td>' +
        '<td class="fw-semibold">' + formatPrice(o.total) + (o.vatAmount ? ' <small class="text-muted">(VAT: ' + formatPrice(o.vatAmount) + ')</small>' : '') + '</td>' +
      '</tr>';
    });
    $('#recentOrders').html(oHtml);
  }

  $('#btnExportJSON').on('click', function () {
    StorageService.exportJSON();
    showToast('Đã export dữ liệu thành công!', 'success');
  });

  $('#importFile').on('change', function () {
    var file = this.files[0];
    if (!file) return;
    StorageService.importJSON(file).then(function () {
      showToast('Đã import dữ liệu thành công! Trang sẽ tải lại...', 'success');
      setTimeout(function () { location.reload(); }, 1000);
    }).catch(function () {
      showToast('Lỗi khi import file! Vui lòng kiểm tra định dạng JSON.', 'error');
    });
    $('#importFile').val('');
  });

  $('#btnClearAll').on('click', function () {
    showConfirm('Xóa tất cả dữ liệu?', 'Hành động này sẽ xóa toàn bộ sản phẩm, giỏ hàng và đơn hàng. Không thể hoàn tác!')
      .then(function (result) {
        if (result.isConfirmed) {
          StorageService.clearAll();
          showToast('Đã xóa tất cả dữ liệu và khôi phục mặc định!', 'success');
          setTimeout(function () { location.reload(); }, 1000);
        }
      });
  });
});
