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

function showDetailsPopup(roomid) {
    fetch(`/browse/room/api/room-details/${roomid}`)
    .then(response => response.json())
    .then(data => {
        const overlay = document.getElementById('documentDetailsPopupOverlay');
        const popup = document.getElementById('documentDetailsPopup');
        const content = popup.querySelector('.document-popup-content');
        
        content.innerHTML = ''; // Xóa nội dung cũ

        data.forEach(detail => {
            if (!detail.receiptid) {
                content.innerHTML += '<div>Không có thông tin sử dụng dịch vụ.</div>';
            } else {
                const receiptRow = document.createElement('div');
                receiptRow.className = 'row';
                receiptRow.innerHTML = `<div class="key">Receipt ID:</div><div class="value">${detail.receiptid}</div>`;

                const bkidRow = document.createElement('div');
                bkidRow.className = 'row';
                bkidRow.innerHTML = `<div class="key">Booking Room ID:</div><div class="value">${detail.bkid}</div>`;

                const serviceidRow = document.createElement('div');
                serviceidRow.className = 'row';
                serviceidRow.innerHTML = `<div class="key">Service Name:</div><div class="value">${detail.servicename}</div>`;

                const totalRow = document.createElement('div');
                totalRow.className = 'row';
                totalRow.innerHTML = `<div class="key">Amount:</div><div class="value">${detail.total}</div>`;

                const dateRow = document.createElement('div');
                dateRow.className = 'row';
                dateRow.innerHTML = `<div class="key">Date of service:</div><div class="value">${detail.date}</div>`;

                const staffRow = document.createElement('div');
                staffRow.className = 'row';
                staffRow.innerHTML = `<div class="key">Staff :</div><div class="value">${detail.staffid}</div>`;

                const bookingRow = document.createElement('div');
                bookingRow.className = 'row';
                bookingRow.innerHTML = `<div class="key">Booking ID:</div><div class="value">${detail.bookingid}</div>`;
                
                content.innerHTML += '<br> <div>--------------------------------------</div>';
                content.appendChild(receiptRow);
                content.appendChild(bkidRow);
                content.appendChild(serviceidRow);
                content.appendChild(totalRow);
                content.appendChild(dateRow);
                content.appendChild(staffRow);
                content.appendChild(bookingRow);
            
            }
        });

        overlay.style.display = 'block'; // Hiển thị popup
    })
    .catch(error => {
        console.error('Error fetching customer details:', error);
        const content = document.getElementById('documentDetailsPopup').querySelector('.document-popup-content');
        content.innerHTML = '<div>Lỗi khi tải thông tin phòng</div>';
    });
}

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const roomid = urlParams.get('roomid');
    const roomtype = urlParams.get('roomtype');
    const receiptid = urlParams.get('receiptid');
    const err = urlParams.get('err');
    if (err == -1){
      window.location.href = '/browse/room';
    }
    // Xử lí lỗi khi add ở room
    if (success === 'falseadd') {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          html: decodeURIComponent(err) + '<br>Room ID or Room Type is already existed, please try again!'
        }).then(() => {
          window.location.href = '/browse/room';
        });
    }
    if (success === 'trueadd' && roomid == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error add room service!',
            html:  'Hãy kiểm tra lại bookingID và roomID đã chính xác chưa!'
          }).then(() => {
            window.location.href = '/browse/room';
          });    
    }
    if (success === 'trueadd' && roomid !== '') {
      Swal.fire('Success!', `Added successfully, ID: ${roomid}`, 'success');
    } 

    // Xử lí khi xoá không thành công
    if (success === 'falsedel') {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          html: decodeURIComponent(err) + '<br>Có vẻ bạn nhập ID không tồn tại, Please try again!'
        }).then(() => {
          window.location.href = '/browse/room';
        });
    }
    // Xử lí khi xoá thành công
    if (success === 'truedel') {
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
            if (roomid !== '0' && roomtype === null && receiptid === null) {
              Swal.fire('Deleted!', `Room deleted successfully, Room ID: ${roomid}`, 'success');
            } else if (roomtype !== '0' && roomid === null && receiptid === null) {
              Swal.fire('Deleted!', `Room Type deleted successfully, Room Type Name: ${roomtype}`, 'success');
            } else if (receiptid !== '0' && roomid === null && roomtype === null) {
              Swal.fire('Deleted!', `Room Service deleted successfully, Receipt ID: ${receiptid}`, 'success');
            }
          }
        });
    }
    
    // Xử lí khi update không thành công
    if (success === 'falseupdate') {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            html: decodeURIComponent(err) + '<br>Please try again!'
          }).then(() => {
            window.location.href = '/browse/room';
          });    
    }
    // Xử lí khi update thành công
    if (success === 'trueupdate') {
        Swal.fire({
          title: "Are you sure you want to update this?",
          text: "Please confirm your action!",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!"
        }).then((result) => {
          if (result.isConfirmed) {
            if (roomid !== '0' && roomid !== null && roomtype === null && receiptid === null) {
              Swal.fire('Updated!', `Room updated successfully, Room ID: ${roomid}`, 'success');
            } else if (roomtype !== null && roomid === null && receiptid === null) {
              Swal.fire('Updated!', `Room Type updated successfully, Room Type Name: ${roomtype}`, 'success');
            } else if (receiptid !== null && roomid === null && roomtype === null) {
              Swal.fire('Updated!', `Room Service updated successfully, Receipt ID: ${receiptid}`, 'success');
            }
          }
        });
    }
});

function sort(order) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('sort', order);
    window.location.search = urlParams.toString();
  }

  function toggleDropdown() {
    var dropdown = document.getElementById("dropdownMenu");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  }

  document.addEventListener('DOMContentLoaded', function() {
    const roomTypeInput = document.querySelector('#addPopup input[name="roomtype"]');
    const statusSelect = document.querySelector('#addPopup select[name="status"]');
    const roomTypeNameInput = document.querySelector('#addPopup input[name="name"]');
    const pricePerNightInput = document.querySelector('#addPopup input[name="pricepernight"]');
    const maxAdultInput = document.querySelector('#addPopup input[name="maxadult"]');
    const maxChildInput = document.querySelector('#addPopup input[name="maxchild"]');
  
    const roomFields = [
        roomTypeInput,
        statusSelect,
        roomTypeNameInput,
        pricePerNightInput,
        maxAdultInput,
        maxChildInput
    ];
  
    const newRoomIdInput = document.querySelector('#addPopup input[name="roomid"]');
    const bookingIdInput = document.querySelector('#addPopup input[name="bookingid"]');
    const serviceIdSelect = document.querySelector('#addPopup select[name="serviceid"]');
    const totalInInput = document.querySelector('#addPopup input[name="total_in"]');
    const dateOfServiceInput = document.querySelector('#addPopup input[name="date"]');
    const staffIdInput = document.querySelector('#addPopup input[name="staffid"]');
  
    const bookingFields = [
        bookingIdInput,
        serviceIdSelect,
        totalInInput,
        dateOfServiceInput,
        staffIdInput
    ];
  
    newRoomIdInput.addEventListener('input', function() {
      if (newRoomIdInput.value.trim() !== '') {
        roomTypeInput.addEventListener('input', function() {
          roomFields.forEach(field => field.classList.add('blinking-border'));
        });
        bookingIdInput.addEventListener('input', function() {
          bookingFields.forEach(field => field.classList.add('blinking-border'));
        });
      } else {
        roomFields.forEach(field => field.classList.remove('blinking-border'));
        bookingFields.forEach(field => field.classList.remove('blinking-border'));
      }
    });
  
    roomFields.forEach(field => {
      field.addEventListener('input', function() {
        if (roomFields.every(field => field.value.trim() === '')) {
          roomFields.forEach(field => field.classList.remove('blinking-border'));
        } else {
          roomFields.forEach(field => field.classList.add('blinking-border'));
        }
      });
    });
  
    bookingFields.forEach(field => {
      field.addEventListener('input', function() {
        if (bookingFields.every(field => field.value.trim() === '')) {
          bookingFields.forEach(field => field.classList.remove('blinking-border'));
        } else {
          bookingFields.forEach(field => field.classList.add('blinking-border'));
        }
      });
    });
  });

document.addEventListener('DOMContentLoaded', function() {
  const receiptIdInput = document.querySelector('#updatePopup input[name="receiptid"]');
  const serviceIdSelect = document.querySelector('#updatePopup select[name="serviceid"]');
  const totalInInput = document.querySelector('#updatePopup input[name="total_in"]');
  const dateOfServiceInput = document.querySelector('#updatePopup input[name="date"]');
  const staffIdInput = document.querySelector('#updatePopup input[name="staffid"]');

  const fieldsToHighlight = [
      receiptIdInput, // Thêm receiptIdInput vào danh sách này
      serviceIdSelect,
      totalInInput,
      dateOfServiceInput,
      staffIdInput
  ];

  fieldsToHighlight.forEach(field => {
      field.addEventListener('input', function() {
          if (fieldsToHighlight.every(field => field.value.trim() === '')) {
              fieldsToHighlight.forEach(field => field.classList.remove('blinking-border'));
          } else if (fieldsToHighlight.every(field => field.value.trim() !== '')) {
              fieldsToHighlight.forEach(field => field.classList.remove('blinking-border'));
          } else {
              fieldsToHighlight.forEach(field => field.classList.add('blinking-border'));
          }
      });
  });
});



