$(document).ready(function () {

  'use strict';

  loadFeaturedProducts();

  loadBestSellers();

  loadNewArrivals();

  loadCategoryCounts();

  initFlashCountdown();

  loadFlashSaleProducts();

  initTypingEffect();

  initCounterAnimation();

  initSmoothScroll();

  initParallax();

  initHeroSlider();
});

function initFlashCountdown() {

  function update() {

    var now = new Date();

    var end = new Date();

    end.setHours(23, 59, 59, 999);

    var diff = end - now;

    if (diff <= 0) {
      diff = 86400000; 
    }

    var h = Math.floor(diff / 3600000);

    var m = Math.floor((diff % 3600000) / 60000);

    var s = Math.floor((diff % 60000) / 1000); 

    $('#cdHours').text(h < 10 ? '0' + h : h);
    $('#cdMinutes').text(m < 10 ? '0' + m : m);
    $('#cdSeconds').text(s < 10 ? '0' + s : s);
  }

  update();

  setInterval(update, 1000);
}

function loadFlashSaleProducts() {

  var products = StorageService.getAllProducts();

  var flashItems = getFlashSaleItems();

  var saleProducts = products.filter(function (p) {
    return flashItems[p.id] && flashItems[p.id] > 0 && p.status === 'Còn hàng';
  }).slice(0, 4); 

  var container = document.getElementById('flashSaleProducts');

  if (!container) return;

  if (saleProducts.length === 0) {

    container.innerHTML = '<div class="col-12"><p style="color:rgba(255,255,255,0.6);font-size:0.9rem">Hiện chưa có sản phẩm giảm giá.</p></div>';

    return;
  }

  var showCart = isCustomer();

  var html = '';

  saleProducts.forEach(function (product, index) {

    var discount = flashItems[product.id];

    var salePrice = Math.round(product.price * (1 - discount / 100));

    var priceHtml = '<span class="price-original">' + formatPrice(product.price) + '</span> <span class="product-price price-sale">' + formatPrice(salePrice) + '</span>';

    html += '<div class="col-lg-3 col-md-6 fade-in" style="animation-delay:' + (index * 0.1) + 's">' +

      '<div class="card-milkshop card-milkshop-flash h-100">' +

        '<div class="img-wrapper">' +

          '<a href="product-detail.html?id=' + product.id + '"><img src="' + product.image + '" class="card-img-top" alt="' + product.name + '"></a>' +

          '<span class="card-discount-badge"><i class="fas fa-bolt me-1"></i>-' + discount + '%</span>' +
        '</div>' +

        '<div class="card-body d-flex flex-column">' +

          '<div class="d-flex justify-content-between align-items-start mb-2">' +

            '<span class="badge-category ' + getCategoryBadgeClass(product.category) + '">' + product.category + '</span>' +
          '</div>' +

          '<h5 class="card-title"><a href="product-detail.html?id=' + product.id + '" class="text-decoration-none" style="color:inherit">' + product.name + '</a></h5>' +

          '<div class="flex-grow-1"></div>' +

          '<div class="card-price-row mt-auto">' +

            priceHtml +

            (showCart ?

              '<button class="btn btn-sm btn-primary-milkshop btn-add-cart-flash" data-id="' + product.id + '" title="Thêm vào giỏ"><i class="fas fa-cart-plus"></i></button>'
            :

              '<a href="product-detail.html?id=' + product.id + '" class="btn btn-sm btn-primary-milkshop" title="Xem chi tiết"><i class="fas fa-eye"></i></a>'
            ) +
          '</div>' + 
        '</div>' + 
      '</div>' + 
    '</div>'; 
  });

  container.innerHTML = html;

  if (showCart) {

    $(container).find('.btn-add-cart-flash').on('click', function () {

      if (!isLoggedIn()) {

        Swal.fire({ icon: 'warning', title: 'Chưa đăng nhập', text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.', confirmButtonText: 'Đăng nhập ngay', showCancelButton: true, cancelButtonText: 'Để sau' }).then(function (r) { if (r.isConfirmed) window.location.href = 'login.html'; });

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
  }
}

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

  var flashItems = getFlashSaleItems();

  var html = '';

  featured.forEach(function (product, index) {

    var discount = flashItems[product.id] || 0;

    var discountBadge = discount > 0
      ? '<span class="card-discount-badge"><i class="fas fa-bolt me-1"></i>-' + discount + '%</span>'
      : '';

    var priceHtml = '';

    if (discount > 0) {

      var salePrice = Math.round(product.price * (1 - discount / 100));

      priceHtml = '<span class="price-original">' + formatPrice(product.price) + '</span> <span class="product-price price-sale">' + formatPrice(salePrice) + '</span>';
    } else {

      priceHtml = '<span class="product-price">' + formatPrice(product.price) + '</span>';
    }

    html += '<div class="col-lg-3 col-md-6 featured-card fade-in" style="animation-delay:' + (index * 0.1) + 's">' +
      '<div class="card-milkshop h-100">' +

        '<div class="img-wrapper">' +
          '<a href="product-detail.html?id=' + product.id + '"><img src="' + product.image + '" class="card-img-top" alt="' + product.name + '"></a>' +
          discountBadge +
        '</div>' +

        '<div class="card-body d-flex flex-column">' +

          '<div class="d-flex justify-content-between align-items-start mb-2">' +
            '<span class="badge-category ' + getCategoryBadgeClass(product.category) + '">' + product.category + '</span>' +

            '<span class="badge-status ' + getStatusBadgeClass(product.status) + '">' + product.status + '</span>' +
          '</div>' +

          '<h5 class="card-title"><a href="product-detail.html?id=' + product.id + '" class="text-decoration-none" style="color:inherit">' + product.name + '</a></h5>' +

          '<p class="card-text flex-grow-1">' + truncateText(product.description, 60) + '</p>' +

          '<div class="card-price-row mt-auto">' +
            priceHtml +

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

      var id = $(this).data('id');

      var result = StorageService.addToCart(id, 1);

      if (result && result.error) {
        showStockWarning(result);
        return;
      }

      updateCartBadge();

      showToast('Đã thêm vào giỏ hàng!', 'success');
    });
  }
}

function loadBestSellers() {

  var orders = StorageService.getAllOrders();

  var products = StorageService.getAllProducts();

  var showCart = isCustomer();

  var flashItems = getFlashSaleItems();

  var buyCount = {};

  orders.forEach(function (order) {

    if (order.items) {

      order.items.forEach(function (item) {

        buyCount[item.productId] = (buyCount[item.productId] || 0) + item.quantity;
      });
    }
  });

  if (Object.keys(buyCount).length === 0) {

    var available = products.filter(function (p) { return p.status === 'Còn hàng'; });

    available.forEach(function (p, i) {
      buyCount[p.id] = Math.max(50 - i * 5, 5); 
    });
  }

  var sorted = products.slice().sort(function (a, b) {
    return (buyCount[b.id] || 0) - (buyCount[a.id] || 0);
  }).slice(0, 4); 

  if (sorted.length === 0) {

    $('#bestsellerProducts').html(
      '<div class="col-12"><div class="empty-state"><i class="fas fa-chart-line"></i><h4>Chưa có dữ liệu bán hàng</h4></div></div>'
    );
    return;
  }

  var html = '';

  sorted.forEach(function (product, index) {

    var soldCount = buyCount[product.id] || 0;

    var discount = flashItems[product.id] || 0;

    var discountBadge = discount > 0
      ? '<span class="card-discount-badge"><i class="fas fa-bolt me-1"></i>-' + discount + '%</span>'
      : '';

    var priceHtml = '';

    if (discount > 0) {
      var salePrice = Math.round(product.price * (1 - discount / 100));
      priceHtml = '<span class="price-original">' + formatPrice(product.price) + '</span> <span class="product-price price-sale">' + formatPrice(salePrice) + '</span>';
    } else { 
      priceHtml = '<span class="product-price">' + formatPrice(product.price) + '</span>';
    }

    var rankBadge = '';

    if (index < 3) {

      var rankIcons = ['<i class="fas fa-trophy me-1"></i>', '<i class="fas fa-medal me-1"></i>', '<i class="fas fa-award me-1"></i>'];

      rankBadge = '<span class="rank-badge rank-' + (index + 1) + '">' + rankIcons[index] + 'TOP ' + (index + 1) + '</span>';
    }

    html += '<div class="col-lg-3 col-md-6 bestseller-card fade-in" style="animation-delay:' + (index * 0.1) + 's">' +
      '<div class="card-milkshop h-100">' + 
        '<div class="img-wrapper">' + 
          '<a href="product-detail.html?id=' + product.id + '"><img src="' + product.image + '" class="card-img-top" alt="' + product.name + '"></a>' +
          discountBadge + 
          rankBadge + 
        '</div>' +
        '<div class="card-body d-flex flex-column">' + 
          '<div class="d-flex justify-content-between align-items-start mb-2">' + 
            '<span class="badge-category ' + getCategoryBadgeClass(product.category) + '">' + product.category + '</span>' +

            '<span class="sold-count"><i class="fas fa-shopping-bag me-1"></i>Đã bán ' + soldCount + '</span>' +
          '</div>' +

          '<h5 class="card-title"><a href="product-detail.html?id=' + product.id + '" class="text-decoration-none" style="color:inherit">' + product.name + '</a></h5>' +
          '<div class="flex-grow-1"></div>' + 
          '<div class="card-price-row mt-auto">' + 
            priceHtml + 

            (showCart ?
              '<button class="btn btn-sm btn-primary-milkshop btn-add-cart-best" data-id="' + product.id + '" title="Thêm vào giỏ"><i class="fas fa-cart-plus"></i></button>'
            :
              '<a href="product-detail.html?id=' + product.id + '" class="btn btn-sm btn-primary-milkshop" title="Xem chi tiết"><i class="fas fa-eye"></i></a>'
            ) +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  });

  $('#bestsellerProducts').html(html);

  if (showCart) {
    $('.btn-add-cart-best').on('click', function () {

      if (!isLoggedIn()) {
        Swal.fire({ icon: 'warning', title: 'Chưa đăng nhập', text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.', confirmButtonText: 'Đăng nhập ngay', showCancelButton: true, cancelButtonText: 'Để sau' }).then(function (r) { if (r.isConfirmed) window.location.href = 'login.html'; });
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
  }
}

function loadNewArrivals() {

  var products = StorageService.getAllProducts();

  var showCart = isCustomer();

  var flashItems = getFlashSaleItems();

  var sorted = products.slice().sort(function (a, b) {

    var numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    var numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;

    return numB - numA;
  }).slice(0, 4); 

  if (sorted.length === 0) {

    $('#newArrivalProducts').html(
      '<div class="col-12"><div class="empty-state"><i class="fas fa-box-open"></i><h4>Chưa có sản phẩm mới</h4></div></div>'
    );
    return;
  }

  var html = '';

  sorted.forEach(function (product, index) {

    var discount = flashItems[product.id] || 0;

    var discountBadge = discount > 0
      ? '<span class="card-discount-badge"><i class="fas fa-bolt me-1"></i>-' + discount + '%</span>'
      : '';

    var priceHtml = '';
    if (discount > 0) {
      var salePrice = Math.round(product.price * (1 - discount / 100)); 
      priceHtml = '<span class="price-original">' + formatPrice(product.price) + '</span> <span class="product-price price-sale">' + formatPrice(salePrice) + '</span>';
    } else {
      priceHtml = '<span class="product-price">' + formatPrice(product.price) + '</span>';
    }

    html += '<div class="col-lg-3 col-md-6 newarrival-card fade-in" style="animation-delay:' + (index * 0.1) + 's">' +
      '<div class="card-milkshop h-100">' +
        '<div class="img-wrapper">' + 
          '<a href="product-detail.html?id=' + product.id + '"><img src="' + product.image + '" class="card-img-top" alt="' + product.name + '"></a>' +
          discountBadge + 

          '<span class="new-badge"><i class="fas fa-star me-1"></i>Mới</span>' +
        '</div>' +
        '<div class="card-body d-flex flex-column">' +
          '<div class="d-flex justify-content-between align-items-start mb-2">' +

            '<span class="badge-category ' + getCategoryBadgeClass(product.category) + '">' + product.category + '</span>' +
            '<span class="badge-status ' + getStatusBadgeClass(product.status) + '">' + product.status + '</span>' +
          '</div>' +

          '<h5 class="card-title"><a href="product-detail.html?id=' + product.id + '" class="text-decoration-none" style="color:inherit">' + product.name + '</a></h5>' +

          '<p class="card-text flex-grow-1">' + truncateText(product.description, 60) + '</p>' +
          '<div class="card-price-row mt-auto">' +
            priceHtml + 

            (showCart ?
              '<button class="btn btn-sm btn-primary-milkshop btn-add-cart-new" data-id="' + product.id + '" title="Thêm vào giỏ"><i class="fas fa-cart-plus"></i></button>'
            :
              '<a href="product-detail.html?id=' + product.id + '" class="btn btn-sm btn-primary-milkshop" title="Xem chi tiết"><i class="fas fa-eye"></i></a>'
            ) +
          '</div>' + 
        '</div>' + 
      '</div>' + 
    '</div>'; 
  });

  $('#newArrivalProducts').html(html);

  if (showCart) {
    $('.btn-add-cart-new').on('click', function () {

      if (!isLoggedIn()) {
        Swal.fire({ icon: 'warning', title: 'Chưa đăng nhập', text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.', confirmButtonText: 'Đăng nhập ngay', showCancelButton: true, cancelButtonText: 'Để sau' }).then(function (r) { if (r.isConfirmed) window.location.href = 'login.html'; });
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

function initTypingEffect() {

  var phrases = ['gia đình bạn', 'sức khỏe bé yêu', 'mọi lứa tuổi', 'cuộc sống khỏe'];

  var target = document.getElementById('typingTarget');

  if (!target) return;

  var phraseIdx = 0;

  var charIdx = 0;

  var isDeleting = false;

  var speed = 100;

  function type() {

    var current = phrases[phraseIdx];

    if (!isDeleting) {

      target.textContent = current.substring(0, charIdx + 1);

      charIdx++;

      if (charIdx === current.length) {

        isDeleting = true;

        speed = 2000; 
      } else {

        speed = 80 + Math.random() * 60;
      }
    } else {

      target.textContent = current.substring(0, charIdx - 1);

      charIdx--;

      if (charIdx === 0) {

        isDeleting = false;

        phraseIdx = (phraseIdx + 1) % phrases.length;

        speed = 400;
      } else {

        speed = 40;
      }
    }

    setTimeout(type, speed);
  }

  type();
}

function loadRealStats() {

  var products = StorageService.getAllProducts();

  var categories = {};
  var brands = {};

  var knownBrands = ['Vinamilk', 'TH', 'Mộc Châu', 'Dalat', 'Ensure', 'Similac', 'Dielac', 'Ông Thọ', 'Ngôi Sao', 'Yakult', 'Probi'];

  products.forEach(function (p) {

    if (p.category) categories[p.category] = true;

    knownBrands.forEach(function (b) {
      if (p.name && p.name.indexOf(b) !== -1) brands[b] = true;
    });
  });

  $('#statProducts').attr('data-count', products.length);
  $('#statCategories').attr('data-count', Object.keys(categories).length);
  $('#statBrands').attr('data-count', Object.keys(brands).length);
}

function initCounterAnimation() {

  loadRealStats();

  var counted = false;

  function animateCounters() {

    $('.stat-number[data-count]').each(function () {

      var $el = $(this);

      var target = parseInt($el.data('count'), 10);

      var duration = 1500;

      var start = 0;

      var startTime = null;

      function step(timestamp) {

        if (!startTime) startTime = timestamp;

        var progress = Math.min((timestamp - startTime) / duration, 1);

        var eased = 1 - Math.pow(1 - progress, 3);

        var value = Math.floor(eased * target);

        $el.text(value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value);

        if (progress < 1) {

          requestAnimationFrame(step);
        } else {

          $el.text(target >= 1000 ? (target / 1000).toFixed(0) + 'K' : target);
        }
      }

      requestAnimationFrame(step);
    });
  }

  $(window).on('scroll', function () {

    if (counted) return;

    var statsEl = $('.hero-stats');

    if (statsEl.length) {

      var top = statsEl.offset().top;

      var windowBottom = $(window).scrollTop() + $(window).height();

      if (windowBottom > top + 50) {

        counted = true;

        animateCounters();
      }
    }
  });

  setTimeout(function () { $(window).trigger('scroll'); }, 500); 
}

function initSmoothScroll() {

  $(document).on('click', '.btn-scroll-down', function (e) {

    e.preventDefault();

    var target = $(this).attr('href');

    if ($(target).length) {

      $('html, body').animate({

        scrollTop: $(target).offset().top - 80 
      }, 800, 'swing'); 
    }
  });
}

function initParallax() {

  $(window).on('scroll', function () {

    var scrollTop = $(window).scrollTop();

    var hero = $('.hero-carousel');

    if (hero.length && scrollTop < hero.outerHeight()) {

      $('.hero-slide.active').css('background-position-y', (scrollTop * 0.3) + 'px');
    }
  });
}

function initHeroSlider() {

  var slides = $('.hero-slide');

  var dots = $('.hero-dot');

  if (slides.length <= 1) return;

  var current = 0;

  var total = slides.length;

  var timer;

  var isTransitioning = false;

  function goTo(idx) {

    var prevIdx = current;

    var nextIdx = ((idx % total) + total) % total;

    if (nextIdx === prevIdx || isTransitioning) return;

    isTransitioning = true;

    current = nextIdx;

    slides.removeClass('leaving');

    $(slides[prevIdx]).removeClass('active').addClass('leaving');

    $(slides[current]).addClass('active');

    dots.removeClass('active');

    $(dots[current]).addClass('active');

    setTimeout(function () {

      slides.removeClass('leaving');

      isTransitioning = false;
    }, 1100);
  }

  function next() { goTo(current + 1); }

  function prev() { goTo(current - 1); }

  function startAuto() {

    clearInterval(timer);

    timer = setInterval(next, 5000);
  }

  dots.on('click', function () {

    clearInterval(timer);

    goTo(parseInt($(this).data('slide')));

    startAuto();
  });

  $('#heroNext').on('click', function () {

    clearInterval(timer);

    next();

    startAuto();
  });

  $('#heroPrev').on('click', function () {

    clearInterval(timer);

    prev();

    startAuto();
  });

  $('.hero-carousel').on('mouseenter', function () {

    clearInterval(timer);
  }).on('mouseleave', function () {

    startAuto();
  });

  startAuto();
}
