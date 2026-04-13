$(document).ready(function () {
  'use strict';

  var appliedCoupon = null;
  var appliedDiscount = 0;

  initCustomerView();

  function initCustomerView() {
    $('#pageTitle').html('<i class="fas fa-shopping-cart me-2"></i>Giỏ hàng');
    $('#pageDesc').text('Quản lý các sản phẩm bạn đã chọn mua');
    $('#customerView').removeClass('view-hidden');
    renderCart();
    renderCouponSuggestions();

    window.addEventListener('storage', function (e) {
      if (e.key === 'milkshop_coupons') {
        renderCouponSuggestions();
      }
    });

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
            clearCoupon();
            renderCart();
            updateCartBadge();
            showToast('Đã xóa giỏ hàng!', 'success');
          }
        });
    });

    $('#btnPlaceOrder').on('click', function () {
      var cart = StorageService.getCart();
      if (cart.length === 0) {
        showToast('Giỏ hàng trống! Hãy thêm sản phẩm trước.', 'warning');
        return;
      }

      Swal.fire({
        title: '<div style="display:flex;align-items:center;gap:8px;justify-content:center">' +
          '<div style="width:36px;height:36px;background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:50%;display:flex;align-items:center;justify-content:center">' +
          '<i class="fas fa-shopping-bag" style="color:#fff;font-size:0.9rem"></i></div>' +
          '<span style="font-size:1.15rem">Thông tin đặt hàng</span></div>',
        html:
          '<div style="text-align:left;max-width:440px;margin:0 auto">' +

          '<div style="background:#f8fafc;border-radius:12px;padding:16px 18px;margin-bottom:14px;border:1px solid #e2e8f0">' +
          '<div style="font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;margin-bottom:12px">' +
          '<i class="fas fa-shipping-fast me-1" style="color:#2563eb"></i> Thông tin giao hàng</div>' +

          '<div style="position:relative;margin-bottom:12px">' +
          '<div style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:0.85rem"><i class="fas fa-user"></i></div>' +
          '<input id="swalName" class="swal2-input" placeholder="Họ và tên người nhận *" style="margin:0;width:100%;padding-left:36px;border-radius:8px;border:1.5px solid #e2e8f0;height:42px;font-size:0.9rem;transition:border .2s">' +
          '</div>' +

          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">' +
          '<div style="position:relative">' +
          '<div style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:0.85rem"><i class="fas fa-phone"></i></div>' +
          '<input id="swalPhone" class="swal2-input" placeholder="Số điện thoại *" style="margin:0;width:100%;padding-left:36px;border-radius:8px;border:1.5px solid #e2e8f0;height:42px;font-size:0.9rem">' +
          '</div>' +
          '<div style="position:relative">' +
          '<div style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:0.85rem"><i class="fas fa-envelope"></i></div>' +
          '<input id="swalEmail" class="swal2-input" placeholder="Email (tùy chọn)" style="margin:0;width:100%;padding-left:36px;border-radius:8px;border:1.5px solid #e2e8f0;height:42px;font-size:0.9rem">' +
          '</div>' +
          '</div>' +

          '<div style="position:relative;margin-bottom:12px">' +
          '<div style="position:absolute;left:12px;top:12px;color:#94a3b8;font-size:0.85rem"><i class="fas fa-map-marker-alt"></i></div>' +
          '<input id="swalAddress" class="swal2-input" placeholder="Địa chỉ giao hàng đầy đủ *" style="margin:0;width:100%;padding-left:36px;border-radius:8px;border:1.5px solid #e2e8f0;height:42px;font-size:0.9rem">' +
          '</div>' +

          '<div style="position:relative">' +
          '<div style="position:absolute;left:12px;top:10px;color:#94a3b8;font-size:0.85rem"><i class="fas fa-comment-dots"></i></div>' +
          '<textarea id="swalNote" class="swal2-textarea" placeholder="Ghi chú đơn hàng (tùy chọn)" style="margin:0;width:100%;padding-left:36px;border-radius:8px;border:1.5px solid #e2e8f0;min-height:50px;font-size:0.9rem;resize:none"></textarea>' +
          '</div>' +
          '</div>' +

          '<div style="background:#f8fafc;border-radius:12px;padding:16px 18px;border:1px solid #e2e8f0">' +
          '<div style="font-weight:700;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;margin-bottom:12px">' +
          '<i class="fas fa-credit-card me-1" style="color:#7c3aed"></i> Phương thức thanh toán</div>' +

          '<div id="paymentOptions" style="display:flex;flex-direction:column;gap:8px">' +

          '<label class="pm-option" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:2px solid #e2e8f0;border-radius:10px;cursor:pointer;transition:all .25s ease;background:#fff">' +
          '<input type="radio" name="swalPayment" value="cod" checked style="display:none">' +
          '<div class="pm-icon" style="width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#dcfce7;flex-shrink:0">' +
          '<i class="fas fa-truck" style="color:#16a34a;font-size:1rem"></i></div>' +
          '<div style="flex:1"><div style="font-weight:600;font-size:0.88rem;color:#1e293b">Thanh toán khi nhận hàng (COD)</div>' +
          '<div style="font-size:0.75rem;color:#94a3b8">Trả tiền mặt cho nhân viên giao hàng</div></div>' +
          '<div class="pm-check" style="width:22px;height:22px;border-radius:50%;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s"></div>' +
          '</label>' +

          '<label class="pm-option" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:2px solid #e2e8f0;border-radius:10px;cursor:pointer;transition:all .25s ease;background:#fff">' +
          '<input type="radio" name="swalPayment" value="banking" style="display:none">' +
          '<div class="pm-icon" style="width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#dbeafe;flex-shrink:0">' +
          '<i class="fas fa-university" style="color:#2563eb;font-size:1rem"></i></div>' +
          '<div style="flex:1"><div style="font-weight:600;font-size:0.88rem;color:#1e293b">Chuyển khoản ngân hàng</div>' +
          '<div style="font-size:0.75rem;color:#94a3b8">Internet Banking / QR Code</div></div>' +
          '<div class="pm-check" style="width:22px;height:22px;border-radius:50%;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s"></div>' +
          '</label>' +

          '<label class="pm-option" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:2px solid #e2e8f0;border-radius:10px;cursor:pointer;transition:all .25s ease;background:#fff">' +
          '<input type="radio" name="swalPayment" value="ewallet" style="display:none">' +
          '<div class="pm-icon" style="width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#fef3c7;flex-shrink:0">' +
          '<i class="fas fa-wallet" style="color:#d97706;font-size:1rem"></i></div>' +
          '<div style="flex:1"><div style="font-weight:600;font-size:0.88rem;color:#1e293b">Ví điện tử</div>' +
          '<div style="font-size:0.75rem;color:#94a3b8">MoMo / ZaloPay / VNPay</div></div>' +
          '<div class="pm-check" style="width:22px;height:22px;border-radius:50%;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s"></div>' +
          '</label>' +

          '</div>' +
          '</div>' +

          '</div>',
        width: 520,
        confirmButtonText: '<i class="fas fa-arrow-right me-1"></i>Tiếp tục xác nhận',
        confirmButtonColor: '#2563eb',
        showCancelButton: true,
        cancelButtonText: 'Hủy bỏ',
        cancelButtonColor: '#94a3b8',
        focusConfirm: false,
        customClass: { popup: 'checkout-popup' },
        didOpen: function () {

          var radios = document.querySelectorAll('input[name="swalPayment"]');
          function updatePM() {
            radios.forEach(function (r) {
              var label = r.closest('label');
              var check = label.querySelector('.pm-check');
              if (r.checked) {
                label.style.borderColor = '#2563eb';
                label.style.background = '#eff6ff';
                label.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                check.style.borderColor = '#2563eb';
                check.style.background = '#2563eb';
                check.innerHTML = '<i class="fas fa-check" style="color:#fff;font-size:0.65rem"></i>';
              } else {
                label.style.borderColor = '#e2e8f0';
                label.style.background = '#fff';
                label.style.boxShadow = 'none';
                check.style.borderColor = '#e2e8f0';
                check.style.background = '#fff';
                check.innerHTML = '';
              }
            });
          }
          updatePM();
          radios.forEach(function (r) { r.addEventListener('change', updatePM); });

          document.querySelectorAll('.swal2-popup input, .swal2-popup textarea').forEach(function (el) {
            el.addEventListener('focus', function () { el.style.borderColor = '#2563eb'; el.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)'; });
            el.addEventListener('blur', function () { el.style.borderColor = '#e2e8f0'; el.style.boxShadow = 'none'; });
          });
        },
        preConfirm: function () {
          var name = document.getElementById('swalName').value.trim();
          var phone = document.getElementById('swalPhone').value.trim();
          var address = document.getElementById('swalAddress').value.trim();
          var note = document.getElementById('swalNote').value.trim();
          var paymentEl = document.querySelector('input[name="swalPayment"]:checked');
          var payment = paymentEl ? paymentEl.value : '';
          if (!name || !phone || !address) {
            Swal.showValidationMessage('Vui lòng nhập đầy đủ họ tên, SĐT và địa chỉ!');
            return false;
          }
          if (!/^0\d{8,9}$/.test(phone)) {
            Swal.showValidationMessage('Số điện thoại không hợp lệ (VD: 0868427362)');
            return false;
          }
          if (!payment) {
            Swal.showValidationMessage('Vui lòng chọn phương thức thanh toán!');
            return false;
          }
          return { name: name, phone: phone, address: address, note: note, paymentMethod: payment };
        }
      }).then(function (step1) {
        if (!step1.isConfirmed) return;
        var info = step1.value;

        var subtotal = StorageService.getCartTotal();
        var vatAmount = Math.round(subtotal * StorageService.VAT_RATE);
        var finalTotal = subtotal + vatAmount - appliedDiscount;

        var payLabels = {
          cod: '<i class="fas fa-truck me-1" style="color:#16a34a"></i>COD — Thanh toán khi nhận hàng',
          banking: '<i class="fas fa-university me-1" style="color:#2563eb"></i>Chuyển khoản ngân hàng',
          ewallet: '<i class="fas fa-wallet me-1" style="color:#d97706"></i>Ví điện tử (MoMo/ZaloPay/VNPay)'
        };

        var cartItems = StorageService.getCart();
        var itemsHtml = '<div style="max-height:120px;overflow-y:auto;margin-bottom:10px">';
        cartItems.forEach(function (item) {
          itemsHtml += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.82rem;border-bottom:1px dashed #f1f5f9">' +
            '<span style="color:#475569">' + item.name + ' × ' + item.quantity + '</span>' +
            '<span style="font-weight:600;color:#1e293b">' + formatPrice(item.subtotal) + '</span></div>';
        });
        itemsHtml += '</div>';

        var summary = '<div style="text-align:left;font-size:0.9rem">' +

          '<div style="background:#f8fafc;border-radius:10px;padding:14px 16px;margin-bottom:12px;border:1px solid #e2e8f0">' +
          '<div style="font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;margin-bottom:8px">Thông tin nhận hàng</div>' +
          '<div style="display:grid;gap:6px;font-size:0.88rem">' +
          '<div style="display:flex;align-items:center;gap:8px"><i class="fas fa-user" style="color:#2563eb;width:16px;text-align:center"></i><strong>' + info.name + '</strong></div>' +
          '<div style="display:flex;align-items:center;gap:8px"><i class="fas fa-phone" style="color:#16a34a;width:16px;text-align:center"></i>' + info.phone + '</div>' +
          '<div style="display:flex;align-items:center;gap:8px"><i class="fas fa-map-marker-alt" style="color:#ef4444;width:16px;text-align:center"></i>' + info.address + '</div>' +
          (info.note ? '<div style="display:flex;align-items:center;gap:8px"><i class="fas fa-comment-dots" style="color:#f59e0b;width:16px;text-align:center"></i><em class="text-muted">' + info.note + '</em></div>' : '') +
          '<div style="display:flex;align-items:center;gap:8px"><i class="fas fa-credit-card" style="color:#7c3aed;width:16px;text-align:center"></i>' + (payLabels[info.paymentMethod] || info.paymentMethod) + '</div>' +
          '</div></div>' +

          '<div style="background:#f8fafc;border-radius:10px;padding:14px 16px;border:1px solid #e2e8f0">' +
          '<div style="font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;margin-bottom:8px">Chi tiết đơn hàng</div>' +
          itemsHtml +
          '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.85rem;color:#64748b">' +
          '<span>Tạm tính</span><span>' + formatPrice(subtotal) + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.85rem;color:#64748b">' +
          '<span>Thuế VAT (8%)</span><span>+' + formatPrice(vatAmount) + '</span></div>' +
          (appliedCoupon ?
            '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.85rem;color:#16a34a">' +
            '<span><i class="fas fa-tag me-1"></i>Mã ' + appliedCoupon.code + '</span><span>-' + formatPrice(appliedDiscount) + '</span></div>' : '') +
          '<div style="display:flex;justify-content:space-between;padding:8px 0 0;margin-top:6px;border-top:2px solid #2563eb;font-size:1.05rem;font-weight:700;color:#1e293b">' +
          '<span>Tổng thanh toán</span><span style="color:#2563eb">' + formatPrice(finalTotal) + '</span></div>' +
          '</div>' +

          (info.paymentMethod !== 'cod' ?
            '<div style="background:linear-gradient(135deg,#eff6ff,#f0fdf4);border-radius:10px;padding:16px;margin-top:12px;border:1px solid #e2e8f0;text-align:center">' +
            '<div style="font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;margin-bottom:10px">' +
            '<i class="fas fa-qrcode me-1" style="color:#2563eb"></i> Quét mã QR để thanh toán</div>' +
            '<div style="background:#fff;border-radius:10px;padding:12px;display:inline-block;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.06)">' +
            '<img src="assets/img/qr.jpg" alt="QR thanh toán" style="width:180px;height:180px;object-fit:contain;border-radius:6px">' +
            '</div>' +
            '<div style="margin-top:10px;font-size:0.8rem;color:#64748b;line-height:1.6">' +
            '<div style="font-weight:600;color:#1e293b;margin-bottom:4px">Nội dung chuyển khoản:</div>' +
            '<div style="background:#fff;border-radius:6px;padding:8px 12px;border:1px dashed #2563eb;font-family:monospace;font-size:0.85rem;color:#2563eb;font-weight:600">' +
            'MILKSHOP ' + formatPrice(finalTotal).replace(/[^\d]/g, '') +
            '</div>' +
            '<div style="margin-top:6px;font-size:0.75rem;color:#94a3b8"><i class="fas fa-info-circle me-1"></i>Đơn hàng sẽ được xử lý sau khi xác nhận thanh toán</div>' +
            '</div>' +
            '</div>' : '') +

          '</div>';

        Swal.fire({
          title: '<div style="display:flex;align-items:center;gap:8px;justify-content:center">' +
            '<div style="width:36px;height:36px;background:linear-gradient(135deg,#16a34a,#22c55e);border-radius:50%;display:flex;align-items:center;justify-content:center">' +
            '<i class="fas fa-clipboard-check" style="color:#fff;font-size:0.9rem"></i></div>' +
            '<span style="font-size:1.15rem">Xác nhận đơn hàng</span></div>',
          html: summary,
          width: 500,
          confirmButtonText: '<i class="fas fa-check-circle me-1"></i>Xác nhận đặt hàng',
          confirmButtonColor: '#16a34a',
          showCancelButton: true,
          cancelButtonText: '<i class="fas fa-arrow-left me-1"></i>Quay lại',
          cancelButtonColor: '#94a3b8'
        }).then(function (step2) {
          if (!step2.isConfirmed) return;

          if (appliedCoupon) {
            StorageService.useCoupon(appliedCoupon.code);
          }

          info.paymentMethod = info.paymentMethod || 'cod';
          var order = StorageService.placeOrder(info);
          if (order) {
            if (appliedCoupon || appliedDiscount > 0) {
              var orders = StorageService.getAllOrders();
              var idx = orders.findIndex(function (o) { return o.id === order.id; });
              if (idx > -1) {
                if (appliedCoupon) orders[idx].couponCode = appliedCoupon.code;
                orders[idx].discount = appliedDiscount;
                orders[idx].total = order.total - appliedDiscount;
                localStorage.setItem('milkshop_orders', JSON.stringify(orders));
              }
            }

            Swal.fire({
              icon: 'success',
              title: 'Đặt hàng thành công!',
              html: 'Mã đơn hàng: <strong>' + order.id + '</strong><br>Tổng tiền: <strong>' + formatPrice(order.total - appliedDiscount) + '</strong>' +
                (appliedCoupon ? '<br>Mã giảm giá: <strong>' + appliedCoupon.code + '</strong> (-' + formatPrice(appliedDiscount) + ')' : ''),
              confirmButtonColor: '#2563eb'
            });

            clearCoupon();
            renderCart();
            updateCartBadge();
          }
        });
      });
    });

    $('#btnApplyCoupon').on('click', function () {
      handleApplyCoupon();
    });

    $('#couponInput').on('keypress', function (e) {
      if (e.which === 13) {
        e.preventDefault();
        handleApplyCoupon();
      }
    });

    $(document).on('click', '.btn-qty-minus', function () {
      var id = $(this).data('id');
      var cart = StorageService.getCart();
      var item = cart.find(function (c) { return c.productId === id; });
      if (item && item.quantity > 1) {
        StorageService.updateCartQuantity(id, item.quantity - 1);
      } else {
        StorageService.removeFromCart(id);
      }
      revalidateCoupon();
      renderCart();
      updateCartBadge();
    });

    $(document).on('click', '.btn-qty-plus', function () {
      var id = $(this).data('id');
      var cart = StorageService.getCart();
      var item = cart.find(function (c) { return c.productId === id; });
      if (item) {
        var result = StorageService.updateCartQuantity(id, item.quantity + 1);
        if (result && result.error) {
          showStockWarning(result);
          return;
        }
      }
      revalidateCoupon();
      renderCart();
      updateCartBadge();
    });

    $(document).on('change', '.qty-input', function () {
      var id = $(this).data('id');
      var val = parseInt($(this).val()) || 1;
      if (val < 1) val = 1;
      var result = StorageService.updateCartQuantity(id, val);
      if (result && result.error) {
        showStockWarning(result);
      }
      revalidateCoupon();
      renderCart();
      updateCartBadge();
    });

    $(document).on('keypress', '.qty-input', function (e) {
      if (e.which < 48 || e.which > 57) e.preventDefault();
    });

    $(document).on('click', '.btn-remove-cart-item', function () {
      var id = $(this).data('id');
      StorageService.removeFromCart(id);
      revalidateCoupon();
      renderCart();
      updateCartBadge();
      showToast('Đã xóa khỏi giỏ hàng!', 'success');
    });
  }

  function handleApplyCoupon() {
    var code = $('#couponInput').val().trim();
    if (!code) {
      showCouponResult('Vui lòng nhập mã giảm giá!', 'error');
      return;
    }

    var cart = StorageService.getCart();
    if (cart.length === 0) {
      showCouponResult('Giỏ hàng đang trống!', 'error');
      return;
    }

    var subtotal = StorageService.getCartTotal();
    var result = StorageService.applyCoupon(code, subtotal);

    if (result.valid) {
      appliedCoupon = result.coupon;
      appliedDiscount = result.discount;
      showCouponResult(result.message, 'success');
      $('#couponInput').prop('disabled', true);
      $('#btnApplyCoupon').html('<i class="fas fa-times me-1"></i>Hủy').addClass('coupon-btn-cancel');
      $('#btnApplyCoupon').off('click').on('click', function () {
        clearCoupon();
        renderCart();
      });
    } else {
      showCouponResult(result.message, 'error');
    }

    renderCart();
  }

  function clearCoupon() {
    appliedCoupon = null;
    appliedDiscount = 0;
    $('#couponInput').val('').prop('disabled', false);
    $('#btnApplyCoupon').html('<i class="fas fa-check me-1"></i>Áp dụng').removeClass('coupon-btn-cancel');
    $('#btnApplyCoupon').off('click').on('click', function () { handleApplyCoupon(); });
    $('#couponResult').html('');
    $('#discountRow').addClass('d-none');
  }

  function revalidateCoupon() {
    if (!appliedCoupon) return;
    var subtotal = StorageService.getCartTotal();
    if (subtotal === 0) {
      clearCoupon();
      return;
    }
    var result = StorageService.applyCoupon(appliedCoupon.code, subtotal);
    if (result.valid) {
      appliedDiscount = result.discount;
    } else {
      clearCoupon();
      showCouponResult('Coupon không còn phù hợp với giỏ hàng!', 'error');
    }
  }

  function showCouponResult(message, type) {
    var icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    var cls = type === 'success' ? 'coupon-success' : 'coupon-error';
    $('#couponResult').html('<div class="coupon-msg ' + cls + '"><i class="fas ' + icon + ' me-1"></i>' + message + '</div>');
  }

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
      updateSummary(0, 0);
      return;
    }

    var html = '';
    cart.forEach(function (item) {
      var priceDisplay = '';
      if (item.discount > 0) {
        priceDisplay = '<span style="text-decoration:line-through;color:#888;font-size:0.8rem">' + formatPrice(item.originalPrice) + '</span> ' +
          '<span style="color:#ef4444;font-weight:600">' + formatPrice(item.price) + '</span>' +
          ' <span style="background:#fef2f2;color:#ef4444;font-size:0.7rem;padding:1px 6px;border-radius:10px;font-weight:600">-' + item.discount + '%</span>';
      } else {
        priceDisplay = '<span style="color:var(--primary);font-weight:600">' + formatPrice(item.price) + '</span>';
      }

      html += '<div class="cart-item fade-in">' +
        '<img src="' + (item.image || 'assets/img/no-image.svg') + '" alt="' + item.name + '" class="cart-item-img" onerror="this.src=\'assets/img/no-image.svg\'">' +
        '<div class="cart-item-info">' +
        '<h6>' + item.name + '</h6>' +
        '<span class="cart-item-price">' + priceDisplay + ' / sản phẩm</span>' +
        '</div>' +
        '<div class="cart-item-quantity">' +
        '<button class="btn btn-outline-secondary btn-qty-minus" data-id="' + item.productId + '">' +
        '<i class="fas fa-minus"></i>' +
        '</button>' +
        '<input type="number" class="qty-input" data-id="' + item.productId + '" value="' + item.quantity + '" min="1" max="' + (item.stock || 999) + '">' +
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
    updateSummary(StorageService.getCartTotal(), appliedDiscount);
  }

  function updateSummary(subtotal, discount) {
    var vatAmount = Math.round(subtotal * StorageService.VAT_RATE);
    $('#subtotalDisplay').text(formatPrice(subtotal));

    if ($('#vatRow').length === 0) {

      var vatHtml = '<div class="summary-row" id="vatRow">' +
        '<span>Thuế VAT (8%)</span>' +
        '<span id="vatDisplay" class="text-warning">+' + formatPrice(vatAmount) + '</span>' +
        '</div>';
      $('.summary-row').first().after(vatHtml);
    } else {
      $('#vatDisplay').text('+' + formatPrice(vatAmount));
    }

    if (discount > 0) {
      $('#discountRow').removeClass('d-none');
      $('#discountDisplay').text('-' + formatPrice(discount));
      $('#totalDisplay').text(formatPrice(subtotal + vatAmount - discount));
    } else {
      $('#discountRow').addClass('d-none');
      $('#totalDisplay').text(formatPrice(subtotal + vatAmount));
    }
  }

  function renderCouponSuggestions() {
    var $box = $('#couponSuggestions');
    if (!$box.length) return;

    var now = new Date();
    var todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

    var coupons = StorageService.getAllCoupons().filter(function (c) {
      return c.isActive && c.expiryDate >= todayStr && c.usageCount < c.usageLimit;
    });

    if (coupons.length === 0) {
      $box.html('<small class="text-muted">Hiện không có mã giảm giá nào.</small>');
      return;
    }

    var html = '<small class="text-muted d-block mb-1"><i class="fas fa-lightbulb me-1 text-warning"></i>Mã có thể dùng:</small>';
    coupons.forEach(function (c) {
      var hint = c.type === 'percent'
        ? 'Giảm ' + c.value + '%'
        : 'Giảm ' + Number(c.value).toLocaleString('vi-VN') + 'đ';
      if (c.minOrderValue > 0) hint += ' (đơn từ ' + Number(c.minOrderValue).toLocaleString('vi-VN') + 'đ)';
      html += '<span class="coupon-chip" data-code="' + c.code + '" title="' + hint + '" style="cursor:pointer;display:inline-flex;align-items:center;gap:4px;background:#fff3e0;border:1px solid #ffb74d;color:#e65100;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;">' +
        '<i class="fas fa-tag" style="font-size:10px"></i>' + c.code +
        '<span style="font-weight:400;color:#888;font-size:11px;margin-left:2px;">— ' + hint + '</span>' +
        '</span>';
    });

    $box.html(html);

    $box.on('click', '.coupon-chip', function () {
      var code = $(this).data('code');
      $('#couponInput').val(code).focus();

      $('#couponInput').css('border-color', '#ffb74d');
      setTimeout(function () { $('#couponInput').css('border-color', ''); }, 1000);
    });
  }

});
