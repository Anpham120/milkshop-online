/**
 * @file storage-service.js
 * @description Lớp dịch vụ thao tác dữ liệu lõi (Data Access Layer). 
 * Cung cấp toàn bộ các hàm API giả lập để thực hiện CRUD với LocalStorage.
 * Áp dụng mô hình IIFE (Immediately Invoked Function Expression) để đảm bảo tính đóng gói.
 * @version 1.0.0
 * @author Nhóm 1 - Cơ sở Lập trình Web
 */

var StorageService = (function () {
  'use strict';

  var KEYS = {
    PRODUCTS: 'milkshop_products',
    CART: 'milkshop_cart',
    ORDERS: 'milkshop_orders',
    COUPONS: 'milkshop_coupons',
    RATINGS: 'milkshop_ratings'
  };

  var VAT_RATE = 0.08;

  var _RAW = [
    ['p1','Sữa tươi Vinamilk 100%','Sữa tươi tiệt trùng Vinamilk 100% nguyên chất, giàu canxi và protein, tốt cho sức khỏe cả gia đình.',32000,'2025-12-15','2026-06-15','Sữa tươi','Còn hàng','sua-tuoi-vinamilk.jpg',50,30],
    ['p2','Sữa tươi TH True Milk','Sữa tươi sạch TH True Milk từ trang trại bò sữa công nghệ cao Israel, không chất bảo quản.',35000,'2025-11-20','2026-05-20','Sữa tươi','Còn hàng','th-true-milk.jpg',45,15],
    ['p3','Sữa tươi Mộc Châu Milk','Sữa tươi thanh trùng Mộc Châu Milk từ cao nguyên Mộc Châu, hương vị thơm ngon tự nhiên.',30000,'2025-10-01','2026-04-01','Sữa tươi','Hết hàng','mocchau.jpg',0,0],
    ['p4','Sữa tươi Dalat Milk','Sữa tươi tiệt trùng Dalat Milk từ vùng cao nguyên Lâm Đồng, vị ngọt nhẹ tự nhiên.',28000,'2026-01-10','2026-07-10','Sữa tươi','Còn hàng','dalatmilk.jpg',30,0],
    ['p5','Sữa bột Ensure Gold','Sữa bột Ensure Gold bổ sung dinh dưỡng đầy đủ cho người lớn tuổi, hỗ trợ hệ miễn dịch.',850000,'2025-06-01','2026-12-01','Sữa bột','Còn hàng','ensure-gold.jpg',25,10],
    ['p6','Sữa bột Similac IQ 4','Sữa bột Similac IQ số 4 dành cho trẻ từ 2-6 tuổi, bổ sung HMO và DHA giúp phát triển trí não.',520000,'2025-09-30','2026-09-30','Sữa bột','Còn hàng','similac.jpg',20,0],
    ['p7','Sữa bột Dielac Grow Plus','Sữa bột Dielac Grow Plus của Vinamilk dành cho trẻ từ 1-2 tuổi, hỗ trợ phát triển chiều cao vượt trội.',380000,'2025-10-15','2026-10-15','Sữa bột','Còn hàng','dielac.jpg',35,20],
    ['p8','Sữa đặc Ông Thọ','Sữa đặc có đường Ông Thọ nhãn trắng, thơm béo đậm đà, dùng pha cà phê và chế biến món ăn.',22000,'2025-05-30','2026-11-30','Sữa bột','Còn hàng','sua-dac-ong-tho.jpg',80,0],
    ['p9','Sữa đặc Ngôi Sao Phương Nam','Sữa đặc có đường Ngôi Sao Phương Nam, vị ngọt thanh, dùng pha chế đồ uống và nấu ăn.',20000,'2025-10-20','2026-10-20','Sữa bột','Còn hàng','sua-dac-ngoi-sao.jpg',60,0],
    ['p10','Sữa chua TH True Yogurt','Sữa chua ăn TH True Yogurt từ sữa tươi sạch, vị tự nhiên, giàu lợi khuẩn tốt cho hệ tiêu hóa.',30000,'2026-02-15','2026-04-15','Sữa chua','Còn hàng','th-yogurt.jpg',40,0],
    ['p11','Sữa chua uống Yakult','Sữa chua uống Yakult chứa hàng tỷ lợi khuẩn L.Casei Shirota, tăng cường sức đề kháng.',25000,'2026-03-05','2026-04-05','Sữa chua','Còn hàng','yakult.jpg',100,10],
    ['p12','Sữa chua uống Probi','Sữa chua uống men sống Probi của Vinamilk, bổ sung lợi khuẩn Probiotics, hỗ trợ tiêu hóa khỏe.',28000,'2026-02-20','2026-04-20','Sữa chua','Còn hàng','sua-chua-probi.jpg',55,0],
    ['p13','Sữa hạt óc chó TH True Nut','Sữa hạt óc chó TH True Nut giàu omega-3, vitamin E, tốt cho não bộ và tim mạch.',39000,'2026-01-20','2026-07-20','Sữa hạt','Còn hàng','sua-hat-oc-cho.jpg',3,20],
    ['p14','Sữa hạt hạnh nhân Vinamilk','Sữa hạt hạnh nhân Vinamilk Super Nut không đường, giàu vitamin E, ít calo, phù hợp cho người ăn kiêng.',38000,'2026-02-15','2026-08-15','Sữa hạt','Còn hàng','sua-hat-hanh-nhan.jpg',8,0],
    ['p15','Sữa 9 loại hạt Vinamilk','Sữa 9 loại hạt Vinamilk Super Nut bổ sung dinh dưỡng từ hạt óc chó, hạnh nhân, macca, ít đường.',42000,'2026-03-10','2026-09-10','Sữa hạt','Còn hàng','sua-9-loai-hat.jpg',15,25]
  ];

  var SEED_DATA = _RAW.map(function (r) {
    return { id: r[0], name: r[1], description: r[2], price: r[3], mfgDate: r[4], deadline: r[5], category: r[6], status: r[7], image: 'assets/img/' + r[8], stock: r[9] || 0, discount: r[10] || 0 };
  });

  /**
   * @function initData
   * @description Tự động khởi tạo dữ liệu mẫu (Seed Data) nếu hệ thống chưa có dữ liệu.
   * Đồng thời thực hiện Migration dữ liệu (đồng bộ các trường mới như stock, discount)
   * cho các bản ghi cũ đang tồn tại trong LocalStorage.
   */
  function initData() {
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SEED_DATA));
    } else {

      var existing = JSON.parse(localStorage.getItem(KEYS.PRODUCTS));
      var needUpdate = false;
      existing.forEach(function (p) {
        var seed = SEED_DATA.find(function (s) { return s.id === p.id; });
        if (seed) {
          if (p.stock === undefined) { p.stock = seed.stock; needUpdate = true; }
          if (p.discount === undefined) { p.discount = seed.discount; needUpdate = true; }
          if (!p.mfgDate) { p.mfgDate = seed.mfgDate; needUpdate = true; }
        }
      });
      if (needUpdate) {
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(existing));
      }
    }
    if (!localStorage.getItem(KEYS.CART)) {
      localStorage.setItem(KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.ORDERS)) {

      var now = Date.now();
      var DAY = 86400000;
      var sampleOrders = [
        {
          id: 'ORD1001', date: new Date(now - 13 * DAY).toISOString(), status: 'Đã giao',
          items: [
            { productId: 'p1', name: 'Sữa tươi Vinamilk 100%', price: 22400, originalPrice: 32000, discount: 30, quantity: 3, subtotal: 67200 },
            { productId: 'p5', name: 'Sữa bột Ensure Gold', price: 765000, originalPrice: 850000, discount: 10, quantity: 1, subtotal: 765000 }
          ],
          subtotal: 832200, vatAmount: 66576, total: 898776
        },
        {
          id: 'ORD1002', date: new Date(now - 10 * DAY).toISOString(), status: 'Đã giao',
          items: [
            { productId: 'p11', name: 'Sữa chua uống Yakult', price: 22500, originalPrice: 25000, discount: 10, quantity: 4, subtotal: 90000 },
            { productId: 'p10', name: 'Sữa chua TH True Yogurt', price: 30000, originalPrice: 30000, discount: 0, quantity: 2, subtotal: 60000 }
          ],
          subtotal: 150000, vatAmount: 12000, total: 162000
        },
        {
          id: 'ORD1003', date: new Date(now - 7 * DAY).toISOString(), status: 'Đã giao',
          items: [
            { productId: 'p7', name: 'Sữa bột Dielac Grow Plus', price: 304000, originalPrice: 380000, discount: 20, quantity: 1, subtotal: 304000 },
            { productId: 'p2', name: 'Sữa tươi TH True Milk', price: 29750, originalPrice: 35000, discount: 15, quantity: 2, subtotal: 59500 }
          ],
          subtotal: 363500, vatAmount: 29080, total: 392580,
          couponCode: 'CHAO2026', discount: 39258
        },
        {
          id: 'ORD1004', date: new Date(now - 5 * DAY).toISOString(), status: 'Đang giao',
          items: [
            { productId: 'p13', name: 'Sữa hạt óc chó TH True Nut', price: 31200, originalPrice: 39000, discount: 20, quantity: 2, subtotal: 62400 },
            { productId: 'p15', name: 'Sữa 9 loại hạt Vinamilk', price: 31500, originalPrice: 42000, discount: 25, quantity: 1, subtotal: 31500 },
            { productId: 'p4', name: 'Sữa tươi Dalat Milk', price: 28000, originalPrice: 28000, discount: 0, quantity: 3, subtotal: 84000 }
          ],
          subtotal: 177900, vatAmount: 14232, total: 192132
        },
        {
          id: 'ORD1005', date: new Date(now - 2 * DAY).toISOString(), status: 'Đang giao',
          items: [
            { productId: 'p6', name: 'Sữa bột Similac IQ 4', price: 520000, originalPrice: 520000, discount: 0, quantity: 1, subtotal: 520000 },
            { productId: 'p8', name: 'Sữa đặc Ông Thọ', price: 22000, originalPrice: 22000, discount: 0, quantity: 5, subtotal: 110000 }
          ],
          subtotal: 630000, vatAmount: 50400, total: 680400,
          couponCode: 'GIAM30K', discount: 30000
        },
        {
          id: 'ORD1006', date: new Date(now - 1 * DAY).toISOString(), status: 'Đã đặt',
          items: [
            { productId: 'p14', name: 'Sữa hạt hạnh nhân Vinamilk', price: 38000, originalPrice: 38000, discount: 0, quantity: 2, subtotal: 76000 },
            { productId: 'p12', name: 'Sữa chua uống Probi', price: 28000, originalPrice: 28000, discount: 0, quantity: 3, subtotal: 84000 },
            { productId: 'p9', name: 'Sữa đặc Ngôi Sao Phương Nam', price: 20000, originalPrice: 20000, discount: 0, quantity: 2, subtotal: 40000 }
          ],
          subtotal: 200000, vatAmount: 16000, total: 216000
        }
      ];
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(sampleOrders));
    }
    if (!localStorage.getItem(KEYS.COUPONS)) {
      localStorage.setItem(KEYS.COUPONS, JSON.stringify([
        {
          id: 'cpn1',
          code: 'CHAO2026',
          type: 'percent',
          value: 10,
          maxDiscount: 50000,
          minOrderValue: 100000,
          usageLimit: 50,
          usageCount: 0,
          expiryDate: '2026-06-30',
          isActive: true,
          description: 'Giảm 10% tối đa 50k cho đơn từ 100k'
        },
        {
          id: 'cpn2',
          code: 'GIAM30K',
          type: 'fixed',
          value: 30000,
          maxDiscount: 30000,
          minOrderValue: 200000,
          usageLimit: 30,
          usageCount: 0,
          expiryDate: '2026-05-31',
          isActive: true,
          description: 'Giảm 30.000đ cho đơn từ 200k'
        },
        {
          id: 'cpn3',
          code: 'SUABIM',
          type: 'percent',
          value: 15,
          maxDiscount: 80000,
          minOrderValue: 150000,
          usageLimit: 20,
          usageCount: 0,
          expiryDate: '2026-04-30',
          isActive: true,
          description: 'Giảm 15% tối đa 80k cho đơn từ 150k'
        }
      ]));
    }

    if (!localStorage.getItem(KEYS.RATINGS)) {
      localStorage.setItem(KEYS.RATINGS, JSON.stringify({
        'p1':  [5, 4, 5, 4, 5, 5, 4, 5, 5, 4, 5, 3],
        'p2':  [4, 5, 4, 4, 5, 4, 5, 3, 4, 5],
        'p3':  [3, 4, 3, 2, 4, 3],
        'p4':  [4, 5, 4, 4, 3, 5, 4],
        'p5':  [5, 5, 4, 5, 5, 4, 5, 5, 4, 5, 4, 5, 5],
        'p6':  [4, 3, 4, 5, 4, 5, 4, 3, 4],
        'p7':  [5, 4, 5, 5, 4, 4, 5, 5],
        'p8':  [4, 5, 5, 4, 5, 4, 3, 4, 5, 4, 5],
        'p9':  [3, 4, 4, 3, 5, 4, 4],
        'p10': [5, 4, 5, 4, 5, 5, 4],
        'p11': [5, 5, 4, 5, 4, 5, 5, 4, 5, 5, 4, 5, 5, 4],
        'p12': [4, 4, 3, 5, 4, 4, 5, 3],
        'p13': [4, 5, 4, 5, 5, 4, 5],
        'p14': [3, 4, 4, 5, 4, 3],
        'p15': [5, 4, 5, 5, 4, 5, 4, 5, 5]
      }));
    }
  }

  initData();

  function getAllProducts() {
    return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]');
  }

  function getProductById(id) {
    var products = getAllProducts();
    return products.find(function (p) { return p.id === id; }) || null;
  }

  function createProduct(data) {
    var products = getAllProducts();
    var stockVal = Number(data.stock);
    var newProduct = {
      id: 'p' + Date.now(),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      deadline: data.deadline,
      category: data.category,
      status: stockVal <= 0 ? 'Hết hàng' : (data.status || 'Còn hàng'),
      image: data.image || 'assets/img/no-image.svg',
      stock: stockVal >= 0 ? stockVal : 0,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  }

  function updateProduct(id, data) {
    var products = getAllProducts();
    var index = products.findIndex(function (p) { return p.id === id; });
    if (index === -1) return null;

    Object.keys(data).forEach(function (key) {
      products[index][key] = data[key];
    });
    products[index].updatedAt = new Date().toISOString();

    var stock = products[index].stock;
    if (stock !== undefined) {
      products[index].status = stock <= 0 ? 'Hết hàng' : 'Còn hàng';
    }

    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    return products[index];
  }

  function deleteProduct(id) {
    var products = getAllProducts();
    var filtered = products.filter(function (p) { return p.id !== id; });
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(filtered));

    removeFromCart(id);
    return true;
  }

  function getCart() {
    var cart = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    var products = getAllProducts();

    return cart.map(function (item) {
      var product = products.find(function (p) { return p.id === item.productId; });
      if (!product) return null;

      var discountPct = product.discount || 0;
      var finalPrice = discountPct > 0 ? Math.round(product.price * (1 - discountPct / 100)) : product.price;
      return {
        productId: item.productId,
        name: product.name,
        price: finalPrice,
        originalPrice: product.price,
        discount: discountPct,
        image: product.image,
        quantity: item.quantity,
        subtotal: finalPrice * item.quantity,
        stock: product.stock !== undefined ? product.stock : 999
      };
    }).filter(function (item) { return item !== null; });
  }

  function addToCart(productId, quantity) {
    quantity = quantity || 1;
    var product = getProductById(productId);
    if (!product) return { error: 'Sản phẩm không tồn tại!' };

    var stock = product.stock !== undefined ? product.stock : 999;
    var cart = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    var existingIndex = cart.findIndex(function (item) { return item.productId === productId; });
    var currentQty = existingIndex > -1 ? cart[existingIndex].quantity : 0;

    if (currentQty + quantity > stock) {
      return {
        error: 'Vượt quá số lượng tồn kho!',
        productName: product.name,
        stock: stock,
        inCart: currentQty,
        requested: currentQty + quantity
      };
    }

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ productId: productId, quantity: quantity });
    }

    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  function updateCartQuantity(productId, quantity) {
    var product = getProductById(productId);
    var maxStock = (product && product.stock !== undefined) ? product.stock : 999;
    quantity = Math.max(1, quantity);
    if (quantity > maxStock) {
      return {
        error: 'Vượt quá số lượng tồn kho!',
        productName: product ? product.name : '',
        stock: maxStock,
        inCart: 0,
        requested: quantity
      };
    }
    var cart = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    var index = cart.findIndex(function (item) { return item.productId === productId; });
    if (index > -1) {
      cart[index].quantity = quantity;
      localStorage.setItem(KEYS.CART, JSON.stringify(cart));
    }
    return cart;
  }

  function removeFromCart(productId) {
    var cart = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    var filtered = cart.filter(function (item) { return item.productId !== productId; });
    localStorage.setItem(KEYS.CART, JSON.stringify(filtered));
    return filtered;
  }

  function clearCart() {
    localStorage.setItem(KEYS.CART, JSON.stringify([]));
  }

  function getCartTotal() {
    var cart = getCart();
    return cart.reduce(function (sum, item) { return sum + item.subtotal; }, 0);
  }

  function placeOrder(customerInfo) {
    var cart = getCart();
    if (cart.length === 0) return null;

    var subtotal = getCartTotal();
    var vatAmount = Math.round(subtotal * VAT_RATE);
    var order = {
      id: 'ORD' + Date.now(),
      items: cart,
      subtotal: subtotal,
      vatAmount: vatAmount,
      total: subtotal + vatAmount,
      date: new Date().toISOString(),
      status: 'Đã đặt',
      customerName: (customerInfo && customerInfo.name) || '',
      customerPhone: (customerInfo && customerInfo.phone) || '',
      customerAddress: (customerInfo && customerInfo.address) || '',
      customerNote: (customerInfo && customerInfo.note) || '',
      paymentMethod: (customerInfo && customerInfo.paymentMethod) || 'cod'
    };

    var products = getAllProducts();
    cart.forEach(function (item) {
      var idx = products.findIndex(function (p) { return p.id === item.productId; });
      if (idx > -1) {
        products[idx].stock = Math.max(0, (products[idx].stock || 0) - item.quantity);
        if (products[idx].stock <= 0) {
          products[idx].status = 'Hết hàng';
        }
      }
    });
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));

    var orders = getAllOrders();
    orders.push(order);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    clearCart();
    return order;
  }

  function getAllOrders() {
    return JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]');
  }

  function getAllCoupons() {
    return JSON.parse(localStorage.getItem(KEYS.COUPONS) || '[]');
  }

  function getCouponByCode(code) {
    var coupons = getAllCoupons();
    var upper = code.trim().toUpperCase();
    return coupons.find(function (c) { return c.code.toUpperCase() === upper; }) || null;
  }

  function createCoupon(data) {
    var coupons = getAllCoupons();

    var exists = coupons.find(function (c) { return c.code.toUpperCase() === data.code.trim().toUpperCase(); });
    if (exists) return { error: 'Mã coupon đã tồn tại!' };

    var coupon = {
      id: 'cpn' + Date.now(),
      code: data.code.trim().toUpperCase(),
      type: data.type || 'percent',
      value: Number(data.value),
      maxDiscount: Number(data.maxDiscount) || 0,
      minOrderValue: Number(data.minOrderValue) || 0,
      usageLimit: Number(data.usageLimit) || 100,
      usageCount: 0,
      expiryDate: data.expiryDate,
      isActive: data.isActive !== false,
      description: data.description || '',
      createdAt: new Date().toISOString()
    };
    coupons.push(coupon);
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
    return coupon;
  }

  function updateCoupon(id, data) {
    var coupons = getAllCoupons();
    var index = coupons.findIndex(function (c) { return c.id === id; });
    if (index === -1) return null;

    if (data.code) {
      var duplicate = coupons.find(function (c) {
        return c.id !== id && c.code.toUpperCase() === data.code.trim().toUpperCase();
      });
      if (duplicate) return { error: 'Mã coupon đã tồn tại!' };
    }

    Object.keys(data).forEach(function (key) {
      coupons[index][key] = data[key];
    });
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
    return coupons[index];
  }

  function deleteCoupon(id) {
    var coupons = getAllCoupons();
    var filtered = coupons.filter(function (c) { return c.id !== id; });
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(filtered));
    return true;
  }

  function toggleCouponStatus(id) {
    var coupons = getAllCoupons();
    var index = coupons.findIndex(function (c) { return c.id === id; });
    if (index === -1) return null;
    coupons[index].isActive = !coupons[index].isActive;
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
    return coupons[index];
  }

  /**
   * Xác thực và tính giảm giá từ coupon
   * @returns {{ valid: boolean, discount: number, message: string, coupon: object }}
   */
  function applyCoupon(code, cartTotal) {
    var coupon = getCouponByCode(code);
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Mã giảm giá không tồn tại!' };
    }
    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'Mã giảm giá đã bị vô hiệu hóa!' };
    }

    var now = new Date();
    var expiry = new Date(coupon.expiryDate + 'T23:59:59');
    if (now > expiry) {
      return { valid: false, discount: 0, message: 'Mã giảm giá đã hết hạn!' };
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'Mã giảm giá đã hết lượt sử dụng!' };
    }

    if (cartTotal < coupon.minOrderValue) {
      return { valid: false, discount: 0, message: 'Đơn hàng tối thiểu ' + coupon.minOrderValue.toLocaleString('vi-VN') + 'đ để dùng mã này!' };
    }

    var discount = 0;
    if (coupon.type === 'percent') {
      discount = Math.round(cartTotal * coupon.value / 100);
      if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    if (discount > cartTotal) discount = cartTotal;

    return { valid: true, discount: discount, message: 'Áp dụng thành công! Giảm ' + discount.toLocaleString('vi-VN') + 'đ', coupon: coupon };
  }

  /**
   * Ghi nhận coupon đã dùng (tăng usageCount)
   */
  function useCoupon(code) {
    var coupons = getAllCoupons();
    var upper = code.trim().toUpperCase();
    var index = coupons.findIndex(function (c) { return c.code.toUpperCase() === upper; });
    if (index > -1) {
      coupons[index].usageCount++;
      localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
    }
  }

  function getProductStats() {
    var products = getAllProducts();
    var stats = {
      total: products.length,
      conHang: 0,
      hetHang: 0,
      byCategory: {},
      avgPriceByCategory: {}
    };

    var categoryPrices = {};

    products.forEach(function (p) {
      if (p.status === 'Còn hàng') stats.conHang++;
      else stats.hetHang++;

      if (!stats.byCategory[p.category]) stats.byCategory[p.category] = 0;
      stats.byCategory[p.category]++;

      if (!categoryPrices[p.category]) categoryPrices[p.category] = [];
      categoryPrices[p.category].push(p.price);
    });

    Object.keys(categoryPrices).forEach(function (cat) {
      var prices = categoryPrices[cat];
      stats.avgPriceByCategory[cat] = Math.round(
        prices.reduce(function (sum, p) { return sum + p; }, 0) / prices.length
      );
    });

    return stats;
  }

  function exportJSON() {
    var data = {
      products: getAllProducts(),
      cart: JSON.parse(localStorage.getItem(KEYS.CART) || '[]'),
      orders: getAllOrders(),
      exportDate: new Date().toISOString()
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'milkshop_data_' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        try {
          var data = JSON.parse(e.target.result);
          if (data.products) localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(data.products));
          if (data.cart) localStorage.setItem(KEYS.CART, JSON.stringify(data.cart));
          if (data.orders) localStorage.setItem(KEYS.ORDERS, JSON.stringify(data.orders));
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = function () { reject(new Error('Đọc file thất bại')); };
      reader.readAsText(file);
    });
  }

  function clearAll() {
    localStorage.removeItem(KEYS.PRODUCTS);
    localStorage.removeItem(KEYS.CART);
    localStorage.removeItem(KEYS.ORDERS);
    initData();
  }

  function getAllRatings() {
    return JSON.parse(localStorage.getItem(KEYS.RATINGS) || '{}');
  }

  function addRating(productId, stars) {
    if (stars < 1 || stars > 5) return false;
    var ratings = getAllRatings();
    if (!ratings[productId]) ratings[productId] = [];
    ratings[productId].push(stars);
    localStorage.setItem(KEYS.RATINGS, JSON.stringify(ratings));
    return true;
  }

  function getProductRating(productId) {
    var ratings = getAllRatings();
    var list = ratings[productId] || [];
    if (list.length === 0) return { avg: 0, count: 0 };
    var sum = 0;
    for (var i = 0; i < list.length; i++) sum += list[i];
    return { avg: Math.round((sum / list.length) * 10) / 10, count: list.length };
  }

  return {
    VAT_RATE: VAT_RATE,
    getAllProducts: getAllProducts,
    getProductById: getProductById,
    createProduct: createProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,

    getCart: getCart,
    addToCart: addToCart,
    updateCartQuantity: updateCartQuantity,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    getCartTotal: getCartTotal,
    placeOrder: placeOrder,
    getAllOrders: getAllOrders,
    getProductStats: getProductStats,
    getAllCoupons: getAllCoupons,
    getCouponByCode: getCouponByCode,
    createCoupon: createCoupon,
    updateCoupon: updateCoupon,
    deleteCoupon: deleteCoupon,
    toggleCouponStatus: toggleCouponStatus,
    applyCoupon: applyCoupon,
    useCoupon: useCoupon,
    addRating: addRating,
    getProductRating: getProductRating,
    exportJSON: exportJSON,
    importJSON: importJSON,
    clearAll: clearAll
  };
})();
