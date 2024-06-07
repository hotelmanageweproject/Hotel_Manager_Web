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

function showDetailsPopup(serviceid) {
    fetch(`/browse/service/api/service-details/${serviceid}`)
    .then(response => response.json())
    .then(data => {
        const overlay = document.getElementById('documentDetailsPopupOverlay');
        const popup = document.getElementById('documentDetailsPopup');
        const content = popup.querySelector('.document-popup-content');
        
        content.innerHTML = ''; // Xóa nội dung cũ

        data.forEach(detail => {
            if (!detail.managerid) {
                content.innerHTML += '<div>Không có thông tin quản lí.</div>';
            } else {
                const serviceidRow = document.createElement('div');
                serviceidRow.className = 'row'
                serviceidRow.innerHTML = `<div class="key">Service ID:</div><div class="value">${detail.serviceid}</div>`;

                const manageridRow = document.createElement('div');
                manageridRow.className = 'row'
                manageridRow.innerHTML = `<div class="key">Manager ID:</div><div class="value">${detail.managerid}</div>`;

                const departmentidRow = document.createElement('div');
                departmentidRow.className = 'row'
                departmentidRow.innerHTML = `<div class="key">Department ID:</div><div class="value">${detail.departmentid}</div>`;

                const personalidRow = document.createElement('div');
                personalidRow.className = 'row'
                personalidRow.innerHTML = `<div class="key">Personal ID:</div><div class="value">${detail.personalid}</div>`;

                const firstnameRow = document.createElement('div');
                firstnameRow.className = 'row'
                firstnameRow.innerHTML = `<div class="key">First Name:</div><div class="value">${detail.firstname}</div>`;

                const lastnameRow = document.createElement('div');
                lastnameRow.className = 'row'
                lastnameRow.innerHTML = `<div class="key">Last Name:</div><div class="value">${detail.lastname}</div>`;

                const birthdateRow = document.createElement('div');
                birthdateRow.className = 'row'
                birthdateRow.innerHTML = `<div class="key">Birthdate:</div><div class="value">${detail.birthdate}</div>`;

                const genderRow = document.createElement('div');
                genderRow.className = 'row'
                genderRow.innerHTML = `<div class="key">Gender:</div><div class="value">${detail.gender}</div>`;

                const emailRow = document.createElement('div');
                emailRow.className = 'row'
                emailRow.innerHTML = `<div class="key">Email:</div><div class="value">${detail.email}</div>`;

                const phoneRow = document.createElement('div');
                phoneRow.className = 'row'
                phoneRow.innerHTML = `<div class="key">Phone:</div><div class="value">${detail.phone}</div>`;

                const addressRow = document.createElement('div');
                addressRow.className = 'row'
                addressRow.innerHTML = `<div class="key">Address:</div><div class="value">${detail.address}</div>`;

                const currentsalRow = document.createElement('div');
                currentsalRow.className = 'row'
                currentsalRow.innerHTML = `<div class="key">Current Salary:</div><div class="value">${detail.currentsal}</div>`;

                const startdateRow = document.createElement('div');
                startdateRow.className = 'row'
                startdateRow.innerHTML = `<div class="key">Start Date:</div><div class="value">${detail.startdate}</div>`;

                const enddateRow = document.createElement('div');
                enddateRow.className = 'row'
                enddateRow.innerHTML = `<div class="key">End Date:</div><div class="value">${detail.enddate}</div>`;

                content.appendChild(serviceidRow);
                content.appendChild(manageridRow);
                content.appendChild(departmentidRow);
                content.appendChild(personalidRow);
                content.appendChild(firstnameRow);
                content.appendChild(lastnameRow);
                content.appendChild(birthdateRow);
                content.appendChild(genderRow);
                content.appendChild(emailRow);
                content.appendChild(phoneRow);
                content.appendChild(addressRow);
                content.appendChild(currentsalRow);
                content.appendChild(startdateRow);
                content.appendChild(enddateRow);            
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
    const serviceid = urlParams.get('serviceid');
    const departmentid1 = urlParams.get('departmentid1');

    if (success === 'trueadd' && serviceid > 0) {
      Swal.fire('Success!', `Service added successfully, Service ID: ${serviceid}`, 'success');
    } else if (success === 'trueadd' && serviceid == 0) {
      Swal.fire('Warning!', 'Service is already existed, please try again!', 'warning');
    } 
    if (success === 'truedel') {
      Swal.fire('Deleted!', `Service deleted successfully, Service ID: ${serviceid}`, 'success');
    } 
    if (success === 'trueupdate' && serviceid > 0) {
      Swal.fire('Updated!', `Service updated successfully, Service ID: ${serviceid}`, 'success');
    } else if (success === 'trueupdate' && departmentid1 > 0) {
        Swal.fire('Updated!', `Service updated successfully, Department ID: ${departmentid1}`, 'success');
    } else if (success === 'trueupdate' && serviceid == 0 && departmentid1 == 0) {
        Swal.fire('Error!', 'Service is not existed, please try again!', 'error');
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