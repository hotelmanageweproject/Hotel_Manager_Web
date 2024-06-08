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
    document.getElementById('current-date').textContent = date;
  }

//function to change color of class when hover and back to normal when mouse leave
function changeColor() {
    var classes = ["menu-item1", "menu-item2", "menu-item3", "frame-parent", "frame-group", "frame-container", "frame-button", "frame-parent1", "button92", "button-5","button-01"];
    classes.forEach(function(className) {
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

//function to click on frame-parent and go to SearchCustomerPage
function goToSearchCustomerPage() {
    var elements = document.getElementsByClassName("frame-parent");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function () {
            window.location.href = "/browse/customer";
        });
    }
}

//function to click on frame-group and go to SearchRoomPage
function goToSearchRoomPage() {
    var elements = document.getElementsByClassName("frame-group");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function () {
            window.location.href = "/browse/room";
        });
    }
}

//function to click on frame-container and go to SearchBookingPage
function goToSearchBookingPage() {
    var elements = document.getElementsByClassName("frame-container");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function () {
            window.location.href = "/browse/booking";
        });
    }
}

//function to click on frame-button and go to SearchServicePage
function goToSearchServicePage() {
    var elements = document.getElementsByClassName("frame-button");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function () {
            window.location.href = "/browse/service";
        });
    }
}

//function to click on frame-parent1 and go to SearchEmployeePage
function goToSearchEmployeePage() {
    var elements = document.getElementsByClassName("frame-parent1");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function () {
            window.location.href = "/browse/employee";
        });
    }
}

// Function to handle file upload
function handleFileUpload(event) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; 
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        console.log('Uploaded file:', file);
    });

    fileInput.click();
}
const addButton = document.querySelector('.button-01');
addButton.addEventListener('click', handleFileUpload);

// Function to handle file download
function handleFileDownload() {
    const fileURL = '/path/to/file.pdf';
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = 'exported_file.pdf';
    link.click();
}
const exportButton = document.querySelector('.button-5');
exportButton.addEventListener('click', handleFileDownload);

//Popup Add
var addModal = document.getElementById("addPopup");
var addBtn = document.querySelector(".button72"); 
var addSpan = document.getElementsByClassName("close")[0];
addBtn.onclick = function(event) {
  event.stopPropagation();
  addModal.style.display = "block";
}
addSpan.onclick = function(event) {
  event.stopPropagation(); 
  addModal.style.display = "none";
}

//Popup Update
var updateModal = document.getElementById("updatePopup");
var updateBtn = document.querySelector(".button32"); 
var updateSpan = document.getElementsByClassName("update-close")[0];
updateBtn.onclick = function() {
  updateModal.style.display = "block";
}
updateSpan.onclick = function() {
  updateModal.style.display = "none";
}

// Popup Delete
var deleteModal = document.getElementById("deletePopup");
var deleteBtn = document.querySelector(".button62");
var deleteSpan = document.getElementsByClassName("delete-close")[0];
deleteBtn.onclick = function() {
  deleteModal.style.display = "block";
}
deleteSpan.onclick = function() {
  deleteModal.style.display = "none";
}

// Unified window.onclick function to handle clicks outside of any modals
window.onclick = function(event) {
  if (event.target == addModal) {
    addModal.style.display = "none";
  } else if (event.target == updateModal) {
    updateModal.style.display = "none";
  } else if (event.target == deleteModal) {
    deleteModal.style.display = "none";
  }
}

function showDetailsPopup(customerid) {
    console.log("Kick: " + customerid);
    fetch(`/browse/customer/api/customer-details/${customerid}`)
    .then(response => response.json())
    .then(data => {
        const overlay = document.getElementById('documentDetailsPopupOverlay');
        const popup = document.getElementById('documentDetailsPopup');
        const content = popup.querySelector('.document-popup-content');
        
        content.innerHTML = ''; // Xóa nội dung cũ
        console.log(data);
        
        if (data.length > 0) {
            const discountRow = document.createElement('div');
            discountRow.className = 'row';
            discountRow.innerHTML = `<div class="key">Discount:</div><div class="value">${data[0].discount}%</div>`;
            content.appendChild(discountRow);
        }
        const separator = document.createElement('p');
        separator.innerHTML = '------------------------------------------------------------------------';
        content.appendChild(separator);
        // Tạo một đối tượng để lưu trữ tổng số tiền cho mỗi bookingid
        const bookingTotals = {};
        let currentBookingId = null;

        data.forEach((detail, index) => {
            if (!detail.bookingid || !detail.roomid) {
                content.innerHTML += '<div>Không có thông tin đặt phòng hoặc phòng.</div>';
            } else {
                const checkinDate = new Date(detail.checkin);
                const checkoutDate = new Date(detail.checkout);
                const timeDiff = Math.abs(checkoutDate - checkinDate);
                const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Số ngày
                const totalAmount = daysDiff * detail.pricepernight;

                // Tính tổng số tiền cho mỗi bookingid
                if (!bookingTotals[detail.bookingid]) {
                    bookingTotals[detail.bookingid] = 0;
                }
                bookingTotals[detail.bookingid] += totalAmount;

                // Kiểm tra nếu bookingid thay đổi
                if (currentBookingId !== null && currentBookingId !== detail.bookingid) {
                    const totalRow = document.createElement('div');
                    totalRow.className = 'row';
                    totalRow.innerHTML = `<div class="key">Total amount of Booking ID ${currentBookingId}:</div><div class="value">${bookingTotals[currentBookingId].toLocaleString('vi-VN')} VND</div>`;
                    content.appendChild(totalRow);

                    // Thêm dấu phân tách giữa các bookingid khác nhau
                    const separator = document.createElement('p');
                    separator.innerHTML = '------------------------------------------------------------------------';
                    content.appendChild(separator);
                }

                currentBookingId = detail.bookingid;

                const bookingRow = document.createElement('div');
                bookingRow.className = 'row';
                bookingRow.innerHTML = `<div class="key">Booking ID:</div><div class="value">${detail.bookingid}</div>`;

                const roomRow = document.createElement('div');
                roomRow.className = 'row';
                roomRow.innerHTML = `<div class="key">Room ID:</div><div class="value">${detail.roomid}</div>`;

                const priceRow = document.createElement('div');
                priceRow.className = 'row';
                priceRow.innerHTML = `<div class="key">Price Per Night:</div><div class="value">${detail.pricepernight.toLocaleString('vi-VN')} VND</div>`;

                const checkinRow = document.createElement('div');
                checkinRow.className = 'row';
                checkinRow.innerHTML = `<div class="key">Check-in:</div><div class="value">${detail.checkin}</div>`;

                const checkoutRow = document.createElement('div');
                checkoutRow.className = 'row';
                checkoutRow.innerHTML = `<div class="key">Check-out:</div><div class="value">${detail.checkout}</div>`;

                content.appendChild(bookingRow);
                content.appendChild(roomRow);
                content.appendChild(priceRow);
                content.appendChild(checkinRow);
                content.appendChild(checkoutRow);

                // Thêm xuống dòng giữa các roomid trong cùng một bookingid
                const br = document.createElement('br');
                content.appendChild(br);

                // Nếu đây là phần tử cuối cùng, hiển thị tổng số tiền cho bookingid hiện tại
                if (index === data.length - 1) {
                    const totalRow = document.createElement('div');
                    totalRow.className = 'row';
                    totalRow.innerHTML = `<div class="key">Total for Booking ID ${currentBookingId}:</div><div class="value">${bookingTotals[currentBookingId].toLocaleString('vi-VN')} VND</div>`;
                    content.appendChild(totalRow);
                }
            }
        });

        overlay.style.display = 'block'; // Hiển thị popup
    })
    .catch(error => {
        console.error('Error fetching customer details:', error);
        const content = document.getElementById('documentDetailsPopup').querySelector('.document-popup-content');
        content.innerHTML = '<div>Lỗi khi tải thông tin khách hàng.</div>';
    });
}

  // Trong file JavaScript trên trang client
  window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const customerid = urlParams.get('customerid');
    const err = urlParams.get('err');

    if (success === 'trueadd' && customerid !== '0') {
      Swal.fire('Success!', `Customer added successfully, Customer ID: ${customerid}`, 'success');
    }
    if (success === 'falseadd' || (success === 'trueadd' && customerid === '0')) {
      Swal.fire('Warning!', decodeURIComponent(err) + ' Customer is already existed, please try again!', 'error').then(() => {
        window.location.href = '/browse/customer';
      });
    }

    if (success === 'truedel' && customerid !== '0') {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Deleted!', `Customer deleted successfully, Customer ID: ${customerid}`, 'success').then(() => {
            window.location.href = '/browse/customer';
          });
        }
      });
    } 
    if (success === 'falsedel' || (success === 'truedel' && customerid === '0')) {
      Swal.fire('Error!', decodeURIComponent(err) + ' Customer is not existed, please try again!', 'error').then(() => {
        window.location.href = '/browse/customer';
      });
    }

    if (success === 'trueupdate' && customerid !== '0') {
      Swal.fire('Updated!', `Customer updated successfully, Customer ID: ${customerid}`, 'success');
    } 
    
    if (success === 'falseupdate' || (success === 'trueupdate' && customerid === '0')) {
        Swal.fire('Error!', decodeURIComponent(err) + ' Customer is not existed, please try again!', 'error').then(() => {
            window.location.href = '/browse/customer';
        });
    }
});

  function sort(order) {
    console.log("Sorting order:", order); // Thêm dòng này để kiểm tra
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('sort', order);
    window.location.search = urlParams.toString();
  }

  function toggleDropdown() {
    var dropdown = document.getElementById("dropdownMenu");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  }