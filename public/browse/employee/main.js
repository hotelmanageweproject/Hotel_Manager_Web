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

function showDetailsPopup(staffid) {
    fetch(`/browse/employee/api/staff-details/${staffid}`)
    .then(response => response.json())
    .then(data => {
        const overlay = document.getElementById('documentDetailsPopupOverlay');
        const popup = document.getElementById('documentDetailsPopup');
        const content = popup.querySelector('.document-popup-content');
        
        content.innerHTML = ''; // Xóa nội dung cũ
        console.log(data);

        data.forEach(detail => {
            if (!detail.departmentid) {
                content.innerHTML += '<div>Không có thông tin phòng ban</div>';
            } else {
                const staffidRow = document.createElement('div');
                staffidRow.className = 'row';
                staffidRow.innerHTML = `<div class="key">Staff ID:</div><div class="value">${detail.staffid}</div>`;

                const departmentidRow = document.createElement('div');
                departmentidRow.className = 'row';
                departmentidRow.innerHTML = `<div class="key">Department ID:</div><div class="value">${detail.departmentid}</div>`;

                const departmentnameRow = document.createElement('div');
                departmentnameRow.className = 'row';
                departmentnameRow.innerHTML = `<div class="key">Department Name:</div><div class="value">${detail.name}</div>`;

                const managerRow = document.createElement('div');
                managerRow.className = 'row';
                managerRow.innerHTML = `<div class="key">Manager:</div><div class="value">${detail.manager}</div>`;

                const descriptionRow = document.createElement('div');
                descriptionRow.className = 'row';
                descriptionRow.innerHTML = `<div class="key">Description:</div><div class="value">${detail.description}</div>`;

                content.appendChild(staffidRow);
                content.appendChild(departmentidRow);
                content.appendChild(departmentnameRow);
                content.appendChild(managerRow);
                content.appendChild(descriptionRow);
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
  
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const staffid = urlParams.get('staffid');
    if (success === 'trueadd' && staffid > 0) {
      Swal.fire('Success!', `Staff added successfully, Staff ID: ${staffid}`, 'success');
    } else if (success === 'trueadd' && staffid == 0) {
      Swal.fire('Warning!', 'Staff is already existed, please try again!', 'warning');
    }
    if (success === 'truedel' && staffid > 0) {
      Swal.fire('Deleted!', `Staff deleted successfully, Staff ID: ${staffid}`, 'success');
    } else if (success === 'truedel' && staffid == 0) {
        Swal.fire('Error!', 'Staff is not existed, please try again!', 'error');
    }
    if (success === 'trueupdate' && staffid > 0) {
      Swal.fire('Updated!', `Staff updated successfully, Staff ID: ${staffid}`, 'success');
    } else if (success === 'trueupdate' && staffid == 0) {
        Swal.fire('Error!', 'Staff is not existed, please try again!', 'error');
    }
});
function toggleDropdown() {
    var dropdown = document.getElementById("dropdownMenu");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  }
  
 function sort(order) {
    console.log("Sorting order:", order); // Thêm dòng này để kiểm tra
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('sort', order);
    window.location.search = urlParams.toString();
  }
function closeDropdown() {
    var dropdown = document.getElementById("dropdownMenu");
    dropdown.style.display = "none";
}
  
document.addEventListener("click", function(event) {
    var dropdown = document.getElementById("dropdownMenu");
    var button = document.querySelector(".button92");
    if (!button.contains(event.target)) {
      closeDropdown();
    }
});