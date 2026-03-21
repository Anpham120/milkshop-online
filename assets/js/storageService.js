/* ====================================
   STORAGE SERVICE — MilkShop Online
   CRUD qua LocalStorage, seed data
   ==================================== */

var StorageService = (function () {
  'use strict';

  var KEYS = {
    PRODUCTS: 'milkshop_products',
    CART: 'milkshop_cart',
    ORDERS: 'milkshop_orders'
  };

  // ====================================
  // DỮ LIỆU MẪU — 15 sản phẩm
  // ====================================
  var SEED_DATA = [
    {
      id: 'p1',
      name: 'Sữa tươi Vinamilk 100%',
      description: 'Sữa tươi tiệt trùng Vinamilk 100% nguyên chất, giàu canxi và protein, tốt cho sức khỏe cả gia đình.',
      price: 32000,
      deadline: '2026-06-15',
      category: 'Sữa tươi',
      status: 'Còn hàng',
      image: 'assets/img/suatuoivinamilk.jpg'
    },
    {
      id: 'p2',
      name: 'Sữa tươi TH True Milk',
      description: 'Sữa tươi sạch TH True Milk từ trang trại bò sữa công nghệ cao Israel, không chất bảo quản.',
      price: 35000,
      deadline: '2026-05-20',
      category: 'Sữa tươi',
      status: 'Còn hàng',
      image: 'assets/img/th_true_milk.jpg'
    },
    {
      id: 'p3',
      name: 'Sữa tươi Mộc Châu Milk',
      description: 'Sữa tươi thanh trùng Mộc Châu Milk từ cao nguyên Mộc Châu, hương vị thơm ngon tự nhiên.',
      price: 30000,
      deadline: '2026-04-01',
      category: 'Sữa tươi',
      status: 'Hết hàng',
      image: 'assets/img/mocchau.jpg'
    },
    {
      id: 'p4',
      name: 'Sữa tươi Dalat Milk',
      description: 'Sữa tươi tiệt trùng Dalat Milk từ vùng cao nguyên Lâm Đồng, vị ngọt nhẹ tự nhiên.',
      price: 28000,
      deadline: '2026-07-10',
      category: 'Sữa tươi',
      status: 'Còn hàng',
      image: 'assets/img/dalatmilk.jpg'
    },
    {
      id: 'p5',
      name: 'Sữa bột Ensure Gold',
      description: 'Sữa bột Ensure Gold bổ sung dinh dưỡng đầy đủ cho người lớn tuổi, hỗ trợ hệ miễn dịch.',
      price: 850000,
      deadline: '2026-12-01',
      category: 'Sữa bột',
      status: 'Còn hàng',
      image: 'assets/img/ensure_gold.jpg'
    },
    {
      id: 'p6',
      name: 'Sữa bột Similac IQ 4',
      description: 'Sữa bột Similac IQ số 4 dành cho trẻ từ 2-6 tuổi, bổ sung HMO và DHA giúp phát triển trí não.',
      price: 520000,
      deadline: '2026-09-30',
      category: 'Sữa bột',
      status: 'Còn hàng',
      image: 'assets/img/similac.jpg'
    },
    {
      id: 'p7',
      name: 'Sữa bột Dielac Grow Plus',
      description: 'Sữa bột Dielac Grow Plus của Vinamilk dành cho trẻ từ 1-2 tuổi, hỗ trợ phát triển chiều cao vượt trội.',
      price: 380000,
      deadline: '2026-10-15',
      category: 'Sữa bột',
      status: 'Còn hàng',
      image: 'assets/img/dielac.jpg'
    },
    {
      id: 'p8',
      name: 'Sữa đặc Ông Thọ',
      description: 'Sữa đặc có đường Ông Thọ nhãn trắng, thơm béo đậm đà, dùng pha cà phê và chế biến món ăn.',
      price: 22000,
      deadline: '2026-11-30',
      category: 'Sữa bột',
      status: 'Còn hàng',
      image: 'assets/img/ong_tho.jpg'
    },
    {
      id: 'p9',
      name: 'Sữa đặc Ngôi Sao Phương Nam',
      description: 'Sữa đặc có đường Ngôi Sao Phương Nam, vị ngọt thanh, dùng pha chế đồ uống và nấu ăn.',
      price: 20000,
      deadline: '2026-10-20',
      category: 'Sữa bột',
      status: 'Còn hàng',
      image: 'assets/img/ngoi_sao.jpg'
    },
    {
      id: 'p10',
      name: 'Sữa chua TH True Yogurt',
      description: 'Sữa chua ăn TH True Yogurt từ sữa tươi sạch, vị tự nhiên, giàu lợi khuẩn tốt cho hệ tiêu hóa.',
      price: 30000,
      deadline: '2026-04-15',
      category: 'Sữa chua',
      status: 'Còn hàng',
      image: 'assets/img/th_yogurt.jpg'
    },
    {
      id: 'p11',
      name: 'Sữa chua uống Yakult',
      description: 'Sữa chua uống Yakult chứa hàng tỷ lợi khuẩn L.Casei Shirota, tăng cường sức đề kháng.',
      price: 25000,
      deadline: '2026-04-05',
      category: 'Sữa chua',
      status: 'Còn hàng',
      image: 'assets/img/yakult.jpg'
    },
    {
      id: 'p12',
      name: 'Sữa chua uống Probi',
      description: 'Sữa chua uống men sống Probi của Vinamilk, bổ sung lợi khuẩn Probiotics, hỗ trợ tiêu hóa khỏe.',
      price: 28000,
      deadline: '2026-04-20',
      category: 'Sữa chua',
      status: 'Còn hàng',
      image: 'assets/img/suaprobie.jpg'
    },
    {
      id: 'p13',
      name: 'Sữa hạt óc chó TH True Nut',
      description: 'Sữa hạt óc chó TH True Nut giàu omega-3, vitamin E, tốt cho não bộ và tim mạch.',
      price: 39000,
      deadline: '2026-07-20',
      category: 'Sữa hạt',
      status: 'Còn hàng',
      image: 'assets/img/suahatoccho.jpg'
    },
    {
      id: 'p14',
      name: 'Sữa hạt hạnh nhân Vinamilk',
      description: 'Sữa hạt hạnh nhân Vinamilk Super Nut không đường, giàu vitamin E, ít calo, phù hợp cho người ăn kiêng.',
      price: 38000,
      deadline: '2026-08-15',
      category: 'Sữa hạt',
      status: 'Còn hàng',
      image: 'assets/img/suahathanhnhan.jpg'
    },
    {
      id: 'p15',
      name: 'Sữa 9 loại hạt Vinamilk',
      description: 'Sữa 9 loại hạt Vinamilk Super Nut bổ sung dinh dưỡng từ hạt óc chó, hạnh nhân, macca, ít đường.',
      price: 42000,
      deadline: '2026-09-10',
      category: 'Sữa hạt',
      status: 'Còn hàng',
      image: 'assets/img/sua9loaihat.jpg'
    }
  ];

  // ====================================
  // KHỞI TẠO — Thêm dữ liệu mẫu nếu chưa có
  // ====================================
  function initData() {
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SEED_DATA));
    }
    if (!localStorage.getItem(KEYS.CART)) {
      localStorage.setItem(KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.ORDERS)) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
    }
  }

  // Gọi init khi load
  initData();

  // ====================================
  // QUẢN LÝ SẢN PHẨM (CRUD)
  // ====================================
  function getAllProducts() {
    return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]');
  }

  function getProductById(id) {
    var products = getAllProducts();
    return products.find(function (p) { return p.id === id; }) || null;
  }

  function createProduct(data) {
    var products = getAllProducts();
    var newProduct = {
      id: 'p' + Date.now(),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      deadline: data.deadline,
      category: data.category,
      status: data.status || 'Còn hàng',
      image: data.image || 'assets/img/no-image.svg',
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

    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    return products[index];
  }

  function deleteProduct(id) {
    var products = getAllProducts();
    var filtered = products.filter(function (p) { return p.id !== id; });
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(filtered));

    // Xóa khỏi giỏ hàng nếu có
    removeFromCart(id);
    return true;
  }

  function toggleProductStatus(id) {
    var product = getProductById(id);
    if (!product) return null;
    var newStatus = product.status === 'Còn hàng' ? 'Hết hàng' : 'Còn hàng';
    return updateProduct(id, { status: newStatus });
  }

  // ====================================
  // GIỎ HÀNG
  // ====================================
  function getCart() {
    var cart = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    var products = getAllProducts();

    return cart.map(function (item) {
      var product = products.find(function (p) { return p.id === item.productId; });
      if (!product) return null;
      return {
        productId: item.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    }).filter(function (item) { return item !== null; });
  }

  function addToCart(productId, quantity) {
    quantity = quantity || 1;
    var cart = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    var existingIndex = cart.findIndex(function (item) { return item.productId === productId; });

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ productId: productId, quantity: quantity });
    }

    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  function updateCartQuantity(productId, quantity) {
    var cart = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    var index = cart.findIndex(function (item) { return item.productId === productId; });
    if (index > -1) {
      cart[index].quantity = Math.max(1, quantity);
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

  // ====================================
  // ĐƠN HÀNG
  // ====================================
  function placeOrder() {
    var cart = getCart();
    if (cart.length === 0) return null;

    var total = getCartTotal();
    var order = {
      id: 'ORD' + Date.now(),
      items: cart,
      total: total,
      date: new Date().toISOString(),
      status: 'Đã đặt'
    };

    var orders = getAllOrders();
    orders.push(order);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    clearCart();
    return order;
  }

  function getAllOrders() {
    return JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]');
  }

  // ====================================
  // THỐNG KÊ
  // ====================================
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

  // ====================================
  // XUẤT / NHẬP DỮ LIỆU
  // ====================================
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

  // ====================================
  // XÓA TOÀN BỘ DỮ LIỆU
  // ====================================
  function clearAll() {
    localStorage.removeItem(KEYS.PRODUCTS);
    localStorage.removeItem(KEYS.CART);
    localStorage.removeItem(KEYS.ORDERS);
    initData();
  }

  // ====================================
  // GIAO DIỆN CÔNG KHAI (PUBLIC API)
  // ====================================
  return {
    getAllProducts: getAllProducts,
    getProductById: getProductById,
    createProduct: createProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    toggleProductStatus: toggleProductStatus,
    getCart: getCart,
    addToCart: addToCart,
    updateCartQuantity: updateCartQuantity,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    getCartTotal: getCartTotal,
    placeOrder: placeOrder,
    getAllOrders: getAllOrders,
    getProductStats: getProductStats,
    exportJSON: exportJSON,
    importJSON: importJSON,
    clearAll: clearAll
  };
})();
