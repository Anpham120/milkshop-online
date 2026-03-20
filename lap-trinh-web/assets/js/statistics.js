$(document).ready(function () {
  'use strict';

  var chartCategory = null;
  var chartStatus = null;
  var chartAvgPrice = null;

  loadStats();
  renderCharts();
  renderDeadlineList();

  // Xuất JSON
  $('#btnExportJSON').on('click', function () {
    StorageService.exportJSON();
    showToast('Đã export dữ liệu thành công!', 'success');
  });

  // Nhập JSON
  $('#importFile').on('change', function () {
    var file = this.files[0];
    if (!file) return;

    StorageService.importJSON(file).then(function () {
      showToast('Đã import dữ liệu thành công!', 'success');
      loadStats();
      renderCharts();
      renderDeadlineList();
      updateCartBadge();
    }).catch(function () {
      showToast('Lỗi khi import file! Vui lòng kiểm tra định dạng JSON.', 'error');
    });

    $('#importFile').val('');
  });

  // Xóa toàn bộ
  $('#btnClearAll').on('click', function () {
    showConfirm('Xóa tất cả dữ liệu?', 'Hành động này sẽ xóa toàn bộ sản phẩm, giỏ hàng và đơn hàng. Không thể hoàn tác!')
      .then(function (result) {
        if (result.isConfirmed) {
          StorageService.clearAll();
          loadStats();
          renderCharts();
          renderDeadlineList();
          updateCartBadge();
          showToast('Đã xóa tất cả dữ liệu và khôi phục mặc định!', 'success');
        }
      });
  });

  // ====================================
  // TẢI THỐNG KÊ
  // ====================================
  function loadStats() {
    var stats = StorageService.getProductStats();
    var orders = StorageService.getAllOrders();
    var totalRevenue = orders.reduce(function (sum, o) { return sum + o.total; }, 0);

    $('#statTotal').text(stats.total);
    $('#statCategories').text(Object.keys(stats.byCategory).length);
    $('#statConHang').text(stats.conHang);
    $('#statHetHang').text(stats.hetHang);
    $('#statOrders').text(orders.length);
    $('#statRevenue').text(formatPrice(totalRevenue));

    // Tỷ lệ phần trăm
    if (stats.total > 0) {
      $('#statConHangPct').text(Math.round(stats.conHang / stats.total * 100));
      $('#statHetHangPct').text(Math.round(stats.hetHang / stats.total * 100));
    }
  }

  // ====================================
  // VẼ BIỂU ĐỒ
  // ====================================
  function renderCharts() {
    var stats = StorageService.getProductStats();

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var textColor = isDark ? '#cbd5e1' : '#475569';
    var gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

    if (chartCategory) chartCategory.destroy();
    if (chartStatus) chartStatus.destroy();
    if (chartAvgPrice) chartAvgPrice.destroy();

    // --- Bar Chart: Sản phẩm theo loại ---
    var categories = Object.keys(stats.byCategory);
    var categoryCounts = categories.map(function (c) { return stats.byCategory[c]; });
    var categoryColors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'];

    var ctxCategory = document.getElementById('chartCategory');
    if (ctxCategory) {
      chartCategory = new Chart(ctxCategory.getContext('2d'), {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Số lượng',
            data: categoryCounts,
            backgroundColor: categoryColors.slice(0, categories.length).map(function (c) { return c + '20'; }),
            borderColor: categoryColors.slice(0, categories.length),
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: textColor, font: { weight: 600 } }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { color: textColor, stepSize: 1, font: { weight: 500 } }, grid: { color: gridColor } }
          }
        }
      });
    }

    // --- Doughnut Chart: Trạng thái ---
    var ctxStatus = document.getElementById('chartStatus');
    if (ctxStatus) {
      chartStatus = new Chart(ctxStatus.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Còn hàng', 'Hết hàng'],
          datasets: [{
            data: [stats.conHang, stats.hetHang],
            backgroundColor: ['#10b981', '#f43f5e'],
            borderWidth: 0,
            spacing: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: textColor, padding: 16, usePointStyle: true, font: { weight: 600, size: 13 } }
            }
          }
        }
      });
    }

    // --- Bar Chart: Giá trung bình ---
    var avgCategories = Object.keys(stats.avgPriceByCategory);
    var avgPrices = avgCategories.map(function (c) { return stats.avgPriceByCategory[c]; });

    var ctxAvgPrice = document.getElementById('chartAvgPrice');
    if (ctxAvgPrice) {
      chartAvgPrice = new Chart(ctxAvgPrice.getContext('2d'), {
        type: 'bar',
        data: {
          labels: avgCategories,
          datasets: [{
            label: 'Giá TB (VNĐ)',
            data: avgPrices,
            backgroundColor: function (ctx) {
              var chart = ctx.chart;
              var area = chart.chartArea;
              if (!area) return '#8b5cf620';
              var gradient = chart.ctx.createLinearGradient(0, area.bottom, 0, area.top);
              gradient.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
              gradient.addColorStop(1, 'rgba(139, 92, 246, 0.25)');
              return gradient;
            },
            borderColor: '#8b5cf6',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: textColor, font: { weight: 600 } }, grid: { display: false } },
            y: {
              beginAtZero: true,
              ticks: {
                color: textColor,
                font: { weight: 500 },
                callback: function (value) {
                  if (value >= 1000) return (value / 1000) + 'K';
                  return value;
                }
              },
              grid: { color: gridColor }
            }
          }
        }
      });
    }
  }

  // ====================================
  // DANH SÁCH HẠN SỬ DỤNG
  // ====================================
  function renderDeadlineList() {
    var products = StorageService.getAllProducts();
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sắp xếp theo hạn sử dụng tăng dần
    var sorted = products
      .filter(function (p) { return p.deadline; })
      .sort(function (a, b) { return new Date(a.deadline) - new Date(b.deadline); })
      .slice(0, 8);

    if (sorted.length === 0) {
      $('#deadlineList').html(
        '<div class="deadline-empty">' +
          '<i class="fas fa-calendar-check"></i>' +
          '<p>Chưa có sản phẩm nào</p>' +
        '</div>'
      );
      return;
    }

    var html = '';
    sorted.forEach(function (p) {
      var deadlineDate = new Date(p.deadline);
      var diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

      var dotClass, dateClass, urgencyText;
      if (diffDays <= 7) {
        dotClass = 'deadline-dot-danger';
        dateClass = 'deadline-date-danger';
        urgencyText = diffDays <= 0 ? 'Đã hết hạn' : diffDays + ' ngày nữa';
      } else if (diffDays <= 30) {
        dotClass = 'deadline-dot-warning';
        dateClass = 'deadline-date-warning';
        urgencyText = diffDays + ' ngày nữa';
      } else {
        dotClass = 'deadline-dot-success';
        dateClass = 'deadline-date-success';
        urgencyText = formatDate(p.deadline);
      }

      html += '<div class="deadline-item">' +
        '<div class="deadline-dot ' + dotClass + '"></div>' +
        '<div class="deadline-item-info">' +
          '<div class="deadline-item-name">' + p.name + '</div>' +
          '<div class="deadline-item-category">' + p.category + ' &bull; ' + formatPrice(p.price) + '</div>' +
        '</div>' +
        '<div class="deadline-item-date ' + dateClass + '">' + urgencyText + '</div>' +
      '</div>';
    });

    $('#deadlineList').html(html);
  }
});
