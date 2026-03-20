$(document).ready(function () {
  'use strict';

  var currentDate = new Date();

  renderCalendar();

  $('#btnPrevMonth').on('click', function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  $('#btnNextMonth').on('click', function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  $('#btnToday').on('click', function () {
    currentDate = new Date();
    renderCalendar();
  });

  function renderCalendar() {
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();

    var monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    $('#calendarTitle').text(monthNames[month] + ', ' + year);

    var products = StorageService.getAllProducts();

    var productsByDate = {};
    products.forEach(function (p) {
      if (p.deadline) {
        var dateKey = p.deadline;
        if (!productsByDate[dateKey]) productsByDate[dateKey] = [];
        productsByDate[dateKey].push(p);
      }
    });

    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var daysInPrevMonth = new Date(year, month, 0).getDate();

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var html = '';
    var totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    for (var i = 0; i < totalCells; i++) {
      var dayNumber;
      var dateObj;
      var isOtherMonth = false;

      if (i < firstDay) {
        dayNumber = daysInPrevMonth - firstDay + i + 1;
        dateObj = new Date(year, month - 1, dayNumber);
        isOtherMonth = true;
      } else if (i >= firstDay + daysInMonth) {
        dayNumber = i - firstDay - daysInMonth + 1;
        dateObj = new Date(year, month + 1, dayNumber);
        isOtherMonth = true;
      } else {
        dayNumber = i - firstDay + 1;
        dateObj = new Date(year, month, dayNumber);
      }

      var dateKey = dateObj.toISOString().slice(0, 10);
      var isToday = dateObj.getTime() === today.getTime();
      var classes = 'calendar-day';
      if (isOtherMonth) classes += ' other-month';
      if (isToday) classes += ' today';

      html += '<div class="' + classes + '">';
      html += '<div class="day-number">' + dayNumber + '</div>';

      var dayProducts = productsByDate[dateKey];
      if (dayProducts && !isOtherMonth) {
        var maxShow = 3;
        dayProducts.slice(0, maxShow).forEach(function (p) {
          var eventClass = getDeadlineClass(p.deadline, today);
          html += '<div class="calendar-event ' + eventClass + '" title="' + p.name + ' - ' + formatPrice(p.price) + '">';
          html += p.name;
          html += '</div>';
        });

        if (dayProducts.length > maxShow) {
          html += '<div class="calendar-event calendar-event-more">+' + (dayProducts.length - maxShow) + ' khác</div>';
        }
      }

      html += '</div>';
    }

    $('#calendarBody').html(html);
  }

  function getDeadlineClass(deadline, today) {
    var deadlineDate = new Date(deadline);
    var diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return 'calendar-event-danger';
    if (diffDays <= 30) return 'calendar-event-warning';
    return 'calendar-event-success';
  }
});
