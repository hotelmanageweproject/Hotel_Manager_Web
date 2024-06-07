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

function showDetailsPopup(bookingid) {
    console.log("Kick: " + bookingid);
    fetch(`/browse/booking/api/booking-details/${bookingid}`)
    .then(response => response.json())
    .then(data => {
        const overlay = document.getElementById('documentDetailsPopupOverlay');
        const popup = document.getElementById('documentDetailsPopup');
        const content = popup.querySelector('.document-popup-content');
        
        content.innerHTML = ''; // Xóa nội dung cũ
        console.log(data);

        data.forEach(detail => {
            if (!detail.bookingid || !detail.paymentid) {
                content.innerHTML += '<div>Không có thông tin đặt phòng hoặc phòng.</div>';
            } else {
                const paymentRow = document.createElement('div');
                paymentRow.className = 'row';
                paymentRow.innerHTML = `<div class="key">Payment ID:</div><div class="value">${detail.paymentid}</div>`;

                const discountRow = document.createElement('div');
                discountRow.className = 'row';
                discountRow.innerHTML = `<div class="key">Discount:</div><div class="value">${detail.discount}</div>`;

                const totalRow = document.createElement('div');
                totalRow.className = 'row';
                totalRow.innerHTML = `<div class="key">Total Amount:</div><div class="value">${detail.totalamount}</div>`;

                const addchargeRow = document.createElement('div');
                addchargeRow.className = 'row';
                addchargeRow.innerHTML = `<div class="key">Additional Charge:</div><div class="value">${detail.additionalcharge}</div>`;

                const paymentmethodRow = document.createElement('div');
                paymentmethodRow.className = 'row';
                paymentmethodRow.innerHTML = `<div class="key">Payment Method:</div><div class="value">${detail.paymentmethod}</div>`;

                const paymentdateRow = document.createElement('div');
                paymentdateRow.className = 'row';
                paymentdateRow.innerHTML = `<div class="key">Payment Date:</div><div class="value">${detail.paymentdate}</div>`;

                const paymentstatusRow = document.createElement('div');
                paymentstatusRow.className = 'row';
                paymentstatusRow.innerHTML = `<div class="key">Payment Status:</div><div class="value">${detail.paymentstatus}</div>`;

                const noteRow = document.createElement('div');
                noteRow.className = 'row';
                noteRow.innerHTML = `<div class="key">Note:</div><div class="value">${detail.note}</div>`;

                content.appendChild(paymentRow);
                content.appendChild(discountRow);
                content.appendChild(totalRow);
                content.appendChild(addchargeRow);
                content.appendChild(paymentmethodRow);
                content.appendChild(paymentdateRow);
                content.appendChild(paymentstatusRow);
                content.appendChild(noteRow);
            }
        });

        overlay.style.display = 'block'; // Hiển thị popup
    })
    .catch(error => {
        console.error('Error fetching booking details:', error);
        const content = document.getElementById('documentDetailsPopup').querySelector('.document-popup-content');
        content.innerHTML = '<div>Lỗi khi tải thông tin đơn.</div>';
    });
}

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const bookingid = urlParams.get('bookingid');
    const roomid = urlParams.get('roomid');
    if (success === 'trueadd' && bookingid > 0) {
      alert(`Booking added successfully, Booking ID: ${bookingid}`);
    } else if (success === 'trueadd' && roomid > 0) {
      alert(`Booking room added successfully, Booking ID: ${bookingid} Room ID: ${roomid}`); 
    } else if (success === 'trueadd' && bookingid == 0) {
      alert(`Booking is already existed, please try again!`);
    };
    if (success === 'truedel' && bookingid > 0) {
      alert(`Booking deleted successfully,Booking ID: ${bookingid}`);
    } else if (success === 'truedel' && roomid > 0) {
        alert(`Booking room deleted successfully,Booking ID: ${bookingid} Room ID: ${roomid}`);
    } else if (success === 'truedel' && bookingid == 0) {
        alert(`Booking is not existed, please try again!`);
    }
    if (success === 'trueupdate' && bookingid > 0) {
      alert(`Booking updated successfully, Booking ID: ${bookingid}`);
    } else if (success === 'trueupdate' && roomid > 0) {
        alert(`Booking room updated successfully,Booking ID: ${bookingid} Room ID: ${roomid}`);
    } else if (success === 'trueupdate' && bookingid == 0) {
        alert(`Booking is not existed, please try again!`);
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