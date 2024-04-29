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
