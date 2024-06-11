//function to get current date
function getCurrentDate() {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  return day + "/" + month + "/" + year;
}
function updateDate() {
  const date = getCurrentDate();
  document.getElementById("current-date").textContent = date;
}

//function to change color of class when hover and back to normal when mouse leave
function changeColor() {
  var classes = [
    "menu-item1",
    "menu-item2",
    "menu-item3",
    "frame-parent",
    "frame-group",
    "frame-container",
    "frame-button",
    "frame-parent1",
  ];
  classes.forEach(function (className) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("mouseover", function () {
        this.style.backgroundColor = "#f0f0f0";
        this.style.transform = "scale(1.1)"; // Thêm hiệu ứng phóng to
        this.style.transition = "transform 0.3s ease"; // Thêm hiệu ứng chuyển đổi mượt mà
      });
      elements[i].addEventListener("mouseout", function () {
        this.style.backgroundColor = "white";
        this.style.transform = "scale(1)"; // Trả lại kích thước ban đầu
      });
    }
  });
}
//function to click on menu item 1 and go to HomePage
function goToHomePage() {
  var elements = document.getElementsByClassName("menu-item1");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function () {
      window.location.href = "/";
    });
  }
}

//function to click on menu item 2 and go to BrowseHomePage
function goToBrowseHomePage() {
  var elements = document.getElementsByClassName("menu-item2");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function () {
      window.location.href = "/browse";
    });
  }
}

//function to click on menu item 3 and go to StaticHomePage
function goToStaticHomePage() {
  var elements = document.getElementsByClassName("menu-item3");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function () {
      window.location.href = "/static";
    });
  }
}

function changeYear1(direction) {
  const yearElement = document.getElementById("chart-year");
  let currentYear = parseInt(yearElement.textContent);
  currentYear += direction;
  yearElement.textContent = currentYear;
  updateChart(document.getElementById("chart-date-selector").value);
}
function changeYear2(direction) {
  const yearElement = document.getElementById("occupancy-chart-year");
  let currentYear = parseInt(yearElement.textContent);
  currentYear += direction;
  yearElement.textContent = currentYear;
  updateHotelStatistic(
    document.getElementById("occupancy-chart-year-selector").value
  );
}

function changeYear3(direction) {
  const yearElement = document.getElementById("length-of-stay-chart-year");
  let currentYear = parseInt(yearElement.textContent);
  currentYear += direction;
  yearElement.textContent = currentYear;
  updateHotelStatistic(
    document.getElementById("LOS-chart-year-selector").value
  );
}

var myChart;

function initializeChart() {
  var ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [], // Khởi tạo trống
      datasets: [], // Khởi tạo trống
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              var label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value / 1000000 + "M" + " VNĐ";
            },
          },
        },
      },
    },
  });

  // Initialize the chart with the default selection
  updateChart(document.getElementById("chart-date-selector").value);
}

function updateChart(selectedValue) {
  fetch(`/static/chart-data?period=${selectedValue}`)
    .then(function(response) { return response.json(); })
    .then(function(data) {
      var labels = [];
      var datasets = [];

      switch (selectedValue) {
        case "today":
          labels = data.map(function(item) { return new Date(item.paymentdate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }); });
          datasets = [
            {
              label: "Today",
              data: data.map(function(item) { return item.totalamount; }),
              borderColor: "green",
              backgroundColor: "rgba(189, 226, 185, 0.4)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Yesterday",
              data: data.map(function(item) { return item.totalamount; }),
              borderColor: "purple",
              backgroundColor: "rgba(178, 176, 234, 0.4)",
              fill: true,
              borderDash: [5, 5],
              tension: 0.4,
            },
          ];
          break;
        case "week":
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          var thisWeekAmounts = Array(7).fill(0);
          var lastWeekAmounts = Array(7).fill(0);
          var thisWeekDates = Array(7).fill('');
          var lastWeekDates = Array(7).fill('');

          data.forEach(item => {
            const dayIndex = new Date(item.paymentdate).getDay() - 1; // getDay() trả về 0 cho Chủ Nhật, 1 cho Thứ Hai, ...
            const formattedDate = new Date(item.paymentdate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
            if (item.week_type === 'this_week') {
              thisWeekAmounts[dayIndex] = item.totalamount;
              thisWeekDates[dayIndex] = formattedDate;
            } else if (item.week_type === 'last_week') {
              lastWeekAmounts[dayIndex] = item.totalamount;
              lastWeekDates[dayIndex] = formattedDate;
            }
          });

          datasets = [
            {
              label: "This Week",
              data: thisWeekAmounts,
              borderColor: "green",
              backgroundColor: "rgba(189, 226, 185, 0.4)",
              fill: true,
              tension: 0.4,
              paymentDates: thisWeekDates // Lưu trữ ngày thanh toán cho mỗi điểm
            },
            {
              label: "Last Week",
              data: lastWeekAmounts,
              borderColor: "purple",
              backgroundColor: "rgba(178, 176, 234, 0.4)",
              fill: true,
              borderDash: [5, 5],
              tension: 0.4,
              paymentDates: lastWeekDates // Lưu trữ ngày thanh toán cho mỗi điểm
            }
          ];
          break;
        case "month":
          // Sắp xếp dữ liệu theo ngày để đảm bảo thứ tự
          data.sort((a, b) => new Date(a.paymentdate) - new Date(b.paymentdate));
          
          // Tạo nhãn cho các ngày trong tháng
          const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
          labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));

          // Tách dữ liệu cho tháng này và tháng trước
          const thisMonthData = data.filter(item => new Date(item.paymentdate).getMonth() === new Date().getMonth());
          const lastMonthData = data.filter(item => new Date(item.paymentdate).getMonth() === new Date().getMonth() - 1);

          // Tạo mảng dữ liệu cho tháng này và tháng trước
          const thisMonthAmounts = Array(daysInMonth).fill(0);
          const lastMonthAmounts = Array(daysInMonth).fill(0);

          thisMonthData.forEach(item => {
            const day = new Date(item.paymentdate).getDate() - 1;
            thisMonthAmounts[day] = item.totalamount;
          });

          lastMonthData.forEach(item => {
            const day = new Date(item.paymentdate).getDate() - 1;
            lastMonthAmounts[day] = item.totalamount;
          });

          datasets = [
            {
              label: "This Month",
              data: thisMonthAmounts,
              borderColor: "green",
              backgroundColor: "rgba(189, 226, 185, 0.4)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Last Month",
              data: lastMonthAmounts,
              borderColor: "purple",
              backgroundColor: "rgba(178, 176, 234, 0.4)",
              fill: true,
              borderDash: [5, 5],
              tension: 0.4,
            },
          ];
          break;
        case "year":
          // Tạo nhãn cho các tháng trong năm
          labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          // Tạo mảng dữ liệu cho các tháng trong năm
          const thisYearAmounts = Array(12).fill(0);
          const lastYearAmounts = Array(12).fill(0);

          // Tách dữ liệu cho năm nay và năm ngoái
          const thisYearData = data.filter(item => new Date(item.month).getFullYear() === new Date().getFullYear());
          const lastYearData = data.filter(item => new Date(item.month).getFullYear() === new Date().getFullYear() - 1);

          // Điều chỉnh dữ liệu doanh thu tăng lên một tháng
          thisYearData.forEach(item => {
            const month = (new Date(item.month).getUTCMonth() + 1) % 12;
            thisYearAmounts[month] = item.totalamount;
          });

          lastYearData.forEach(item => {
            const month = (new Date(item.month).getUTCMonth() + 1) % 12;
            lastYearAmounts[month] = item.totalamount;
          });

          datasets = [
            {
              label: "This Year",
              data: thisYearAmounts,
              borderColor: "green",
              backgroundColor: "rgba(189, 226, 185, 0.4)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Last Year",
              data: lastYearAmounts,
              borderColor: "purple",
              backgroundColor: "rgba(178, 176, 234, 0.4)",
              fill: true,
              borderDash: [5, 5],
              tension: 0.4,
            }
          ];
          break;
        default:
          console.error("Invalid selection");
          return;
      }

      myChart.data.labels = labels;
      myChart.data.datasets = datasets;
      myChart.options = {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';
              var amount = tooltipItem.yLabel;
              var date = data.datasets[tooltipItem.datasetIndex].paymentDates ? data.datasets[tooltipItem.datasetIndex].paymentDates[tooltipItem.index] : '';
              return `${label}: ${amount} on ${date}`;
            }
          }
        }
      };
      myChart.update();
    })
    .catch(function(error) {
      console.error('Error fetching chart data:', error);
    });
}

function dateTruncWeek(date, offset = 0) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) + offset; // Điều chỉnh để Thứ Hai là ngày đầu tuần
  console.log(diff);
  return new Date(date.setDate(diff));
}
function updateHotelStatistic(period) {
    
    const dateInput = document.getElementById('HS-date-selector').value;
    if (!dateInput) {
      //alert('Please select a date.');
      Swal.fire('Error!', 'Please select a date.', 'error');
      return;
    }
    fetch(`/static/hotelStatistic?period=${period}&date=${dateInput}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          //alert(data.error);
          Swal.fire('Error!', data.error, 'error');
        } else {
          document.querySelector('.value.bookings').textContent = data.bookings || '0';
          document.querySelector('.value.customers').textContent = data.customers || '0';
          document.querySelector('.value.rooms').textContent = data.rooms || '0';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        //alert('An error occurred while fetching hotel statistics.');
        Swal.fire('Error!', 'An error occurred while fetching hotel statistics.', 'error');
      });
  }


function showPopup(popupId) {
  var popup = document.getElementById(popupId);
  var overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  popup.style.display = "block";
}

function closePopup() {
  var popups = document.getElementsByClassName("popup");
  var overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  for (var i = 0; i < popups.length; i++) {
    popups[i].style.display = "none";
  }
}
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closePopup();
  }
});
document
  .querySelector(".search2")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchPaymentData(); // Gọi hàm này để kiểm tra và hiển thị popup nếu có dữ liệu
    }
  });

function showPopupSearch() {
  document.getElementById("TotalBillPopup").style.display = "flex";
  document.getElementById("overlay").style.display = "block"; // Show the overlay if it exists
}

document.querySelector(".search2").addEventListener("input", function () {
  const inputValue = this.value;
  document.getElementById("total-bill-value").textContent = inputValue;
});

//Dropdown cho method thanh toán

document.querySelectorAll(".option").forEach((option) => {
  option.addEventListener("click", function () {
    const selected = document.querySelector(".dropdown-selected");
    selected.textContent = this.textContent;
    selected.prepend(this.querySelector("img").cloneNode(true));
    this.parentNode.style.display = "none";
  });
});

//nhập vào VND cho totalamountofbookingid
document
  .getElementById("totalamountofbookingid")
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Loại bỏ tất cả các k tự không phải số
    value = new Intl.NumberFormat("vi-VN").format(value); // Định dạng số theo kiểu Việt Nam
    e.target.value = value + " VND"; // Thêm đơn vị tiền tệ
  });

document
  .getElementById("totalamountofbookingid")
  .addEventListener("focus", function (e) {
    if (e.target.value === "0 VND") {
      e.target.value = "";
    }
  });
document
  .getElementById("totalamountofbookingid")
  .addEventListener("blur", function (e) {
    if (e.target.value === "") {
      e.target.value = "0 VND";
    }
  });

// Nhập vào VND cho additionalcharge
document
  .getElementById("additionalcharge")
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Loại bỏ tất cả các ký tự không phải số
    value = new Intl.NumberFormat("vi-VN").format(value); // Định dạng số theo kiểu Việt Nam
    e.target.value = value + " VND"; // Thêm đơn vị tiền tệ
  });

document
  .getElementById("additionalcharge")
  .addEventListener("focus", function (e) {
    if (e.target.value === "0 VND") {
      e.target.value = "";
    }
  });
document
  .getElementById("additionalcharge")
  .addEventListener("blur", function (e) {
    if (e.target.value === "") {
      e.target.value = "0 VND";
    }
  });

function fetchPaymentData() {
  const bookingid = document.getElementById("bookingidInput").value;
  if (!bookingid) {
    console.log("No booking ID provided.");
    return; // Thoát khỏi hàm nếu không có booking ID
  }
  fetch(`/static/searchPayment?bookingid=${bookingid}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        //alert(data.error);
        Swal.fire('Error!', data.error, 'error');
      } else {
        const formatter = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        document.getElementById("display-bookingid").textContent =
          data.bookingid || "N/A";
        document.getElementById("display-customerid").textContent =
          data.personalid || "N/A";
        document.getElementById("display-paymentmethod").textContent =
          data.paymentmethod || "N/A";
        document.getElementById("display-paymentdate").textContent =
          data.paymentdate || "N/A";
        document.getElementById("display-note").textContent =
          data.note || "N/A";
        document.getElementById("display-additionalcharge").textContent =
          data.additionalcharge
            ? formatter.format(data.additionalcharge)
            : "N/A";
        document.getElementById("display-discount").textContent = data.discount
          ? data.discount + "%"
          : "N/A";
        document.getElementById("total-amount-value").textContent =
          data.totalamount ? formatter.format(data.totalamount) : "N/A";

        document.getElementById("TotalBillPopup").style.display = "flex";
        document.getElementById("overlay").style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      //alert("An error occurred while fetching payment details.");
      Swal.fire('Error!', 'An error occurred while fetching payment details.', 'error');
    });
}

function fetchServiceRanking() {
  fetch("/static/serviceRanking")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector(".ranking-service-table tbody");
      tableBody.innerHTML = ""; // Xóa nội dung cũ
      data.forEach((service, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}. ${service.servicename}</td>
            <td>${service.numofreceipt}</td>
          `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      //alert("An error occurred while fetching service ranking.");
      Swal.fire('Error!', 'An error occurred while fetching service ranking.', 'error');
    });
}

function fetchCustomerRanking() {
  fetch("/static/customerRanking")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector(".ranking-customer-table tbody");
      tableBody.innerHTML = ""; // Xóa nội dung cũ
      data.forEach((customer, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}. ${customer.customername} (${
          customer.personalid
        })</td>
            <td>${customer.numofbooking}</td>
          `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      //alert("An error occurred while fetching customer ranking.");
      Swal.fire('Error!', 'An error occurred while fetching customer ranking.', 'error');
    });
}

function fetchServiceRankingFull() {
  fetch("/static/serviceRankingFull")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector(
        "#RankingServiceInfo .popup-body .popup-column"
      );
      tableBody.innerHTML = ""; // Xóa nội dung cũ
      data.forEach((service, index) => {
        const row = document.createElement("div");
        row.innerHTML = `
            <p>${index + 1}. ${service.servicename} - ${
          service.numofreceipt
        } receipts</p>
          `;
        tableBody.appendChild(row);
      });
      showPopup("RankingServiceInfo");
    })
    .catch((error) => {
      console.error("Error:", error);
      //alert("An error occurred while fetching service ranking.");
      Swal.fire('Error!', 'An error occurred while fetching service ranking.', 'error');
    });
}

function fetchCustomerRankingFull() {
  fetch("/static/customerRankingFull")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector(
        "#RankingCustomersInfo .popup-body .popup-column"
      );
      tableBody.innerHTML = ""; // Xóa nội dung cũ
      data.forEach((customer, index) => {
        const row = document.createElement("div");
        row.innerHTML = `
            <p>${index + 1}. ${customer.customername} (${
          customer.personalid
        }) - ${customer.numofbooking} bookings</p>
          `;
        tableBody.appendChild(row);
      });
      showPopup("RankingCustomersInfo");
    })
    .catch((error) => {
      console.error("Error:", error);
      //alert("An error occurred while fetching customer ranking.");
      Swal.fire('Error!', 'An error occurred while fetching customer ranking.', 'error');
    });
}

document.querySelectorAll('.payment-option').forEach(button => {
    button.addEventListener('click', function() {
      // Xóa class 'selected' khỏi tất cả các nút
      document.querySelectorAll('.payment-option').forEach(btn => {
        btn.classList.remove('selected');
      });
      // Thêm class 'selected' vào nút được nhấp
      this.classList.add('selected');
    });
  });

  document.querySelectorAll('.payment-option').forEach(button => {
    button.addEventListener('click', function() {
      const paymentMethodInput = document.getElementById('paymentmethod');
      paymentMethodInput.value = this.value;
  
      // Thêm class 'selected' để làm nổi bật nút được chọn (tùy chọn)
      document.querySelectorAll('.payment-option').forEach(btn => btn.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  var occupancyChart; // Biến toàn cục

  function initializeOccupancyChart() {
    const ctx = document.getElementById('occupancyChart').getContext('2d');
    occupancyChart = new Chart(ctx, { // Sử dụng biến toàn cục
      type: 'pie',
      data: {
        labels: ['Occupied', 'Available'],
        datasets: [{
          label: 'Room Occupancy',
          data: [75, 25], // Giả sử 75% phòng đã được thuê và 25% còn trống
          backgroundColor: [
            '#8BC1F7',
            '#F4B678'
          ],
          borderColor: [
            '#439bf2',
            '#ee9031'
          ],
          borderWidth: 0.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Đảm bảo biểu đồ không bị méo
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
          datalabels: {
            formatter: (value, ctx) => {
              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map(data => {
                sum += data;
              });
              let percentage = (value * 100 / sum).toFixed(2) + "%";
              return percentage;
            },
            color: '#000',
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
  
  function updateOccupancyChart(timeframe) {
    // Giả sử bạn có một API hoặc một cách nào đó để lấy dữ liệu dựa trên timeframe
    // Dưới đây là dữ liệu giả định
    var data = [63, 37]; // Mặc định

    occupancyChart.data.datasets[0].data = data;
    occupancyChart.update();
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    initializeOccupancyChart();
  });

  function updateLengthOfStayChart(selectedYear) {
    const ctx = document.getElementById('lengthOfStayChart').getContext('2d');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = fetchLengthOfStayData(selectedYear);

    if (window.lengthOfStayChartInstance) {
        window.lengthOfStayChartInstance.destroy();
    }

    window.lengthOfStayChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Average Length of Stay (days)',
                data: data,
                backgroundColor: '#A2D9D9',
                borderColor: '#008080',
                borderWidth: 0.5
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function fetchLengthOfStayData(year) {
  const currentYear = new Date().getFullYear();
  // Tạo dữ liệu ngẫu nhiên cho mỗi tháng
  const randomData = Array.from({ length: 12 }, () => (Math.random() * 2 + 2).toFixed(1));

  return randomData;
}

function changeYear3(change) {
    const yearSpan = document.getElementById('length-of-stay-chart-year');
    let currentYear = parseInt(yearSpan.innerText);
    currentYear += change;
    yearSpan.innerText = currentYear;
    updateLengthOfStayChart(currentYear);
}

document.addEventListener('DOMContentLoaded', function() {
    const currentYear = parseInt(document.getElementById('length-of-stay-chart-year').innerText);
    updateLengthOfStayChart(currentYear);
}); 