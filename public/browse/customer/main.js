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
    var classes = ["menu-item1", "menu-item2", "menu-item3", "frame-parent", "frame-group", "frame-container", "frame-button", "frame-parent1"];
    classes.forEach(function(className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener("mouseover", function () {
                this.style.backgroundColor = "lightgrey";
            });
            elements[i].addEventListener("mouseout", function () {
                this.style.backgroundColor = "white";
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
    const form = document.createElement('form');
    form.method = 'post';
    form.enctype = 'multipart/form-data';
    form.action = '/browse/customer/upload';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = 'file';
    fileInput.accept = '.csv'; 

    const submitInput = document.createElement('input');
    submitInput.type = 'submit';
    submitInput.style.display = 'none';

    form.appendChild(fileInput);
    form.appendChild(submitInput);

    fileInput.addEventListener('change', () => {
        form.submit();
    });

    form.style.display = 'none';
    document.body.appendChild(form);

    fileInput.click();
}

const addButton = document.querySelector('.text4');
addButton.addEventListener('click', handleFileUpload);

// Function to handle file download


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