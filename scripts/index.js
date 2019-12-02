$(document).ready(function () {

    addEventListeners();

    $(".new-event").on('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        let title = $(this).find('input[name="title"]').val();
        let date = $(this).find('input[name="date"]').val();
        let categoryTitle = $(this).parent().find('h2').html();
        console.log(categoryTitle)
        createEvent(categoryTitle,title,date);
        $(this).find('input[name="title"]').val('')
        $(this).find('input[name="date"]').val('')
        addEventListeners();
    });

    $(".new-category").on('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        let title = $(this).find('input[name="title"]').val();
        createCategory(title);
        $(this).find('input[name="title"]').val('')
        addEventListeners();
    });

});

function addEventListeners() {

    // Close event
    $(".close").on('click', function () {
        if (confirm("Are you sure you want to delete this?")) {
            $(this).parent().hide()
        }
    });

    // Like event
    $(".like").on('click', function () {
        if ($(this).attr('src') == 'images/like.png') {
            $(this).attr('src', 'images/like-active.png');
        } else {
            $(this).attr('src', 'images/like.png');
        }
    });

    // Drag a event
    $('.event').draggable({
        cursor: 'move',
        revert: true,
        revertDuration: 0,
        delay: 200,
        connectToSortable: ".event-list",
        stop: function (event, ui) {
            $(ui.helper).css('width', "");
        }
    });

    // Drop a event inside a category
    $(".event-list").sortable({
        items: ".event",
    }).disableSelection();

    // Drop a event inside a category
    $(".event-list").droppable({
        accept: ".event",
    });

    // Drag a category
    $('.category').draggable({
        cursor: 'move',
        delay: 200,
        connectToSortable: ".board",
        stop: function (event, ui) {
            $(ui.helper).css('width', "");
            $(ui.helper).css('height', "");
        }
    });

    // Drop a category inside board
    $(".board").sortable({
        items: ".category",
    });

    // Drop a category inside board
    $(".board").droppable({
        accept: ".category",
    });

    // Show category options 
    $('.category-options').on('click', function (event) {
        $('.category-options-dropdown').hide();
        $(this).parent().find('.category-options-dropdown').css('display', 'flex');
        event.stopPropagation();
    });

    // Hide category options when click outside 
    $(document).on('click', function () {
        $('.category-options-dropdown').hide();
    });

    // Hide category when click on close category
    $('.close-category').on('click', function (event) {
        if (confirm("Are you sure you want to delete this category?")) {
            $(this).parent().parent().hide("3000");
        }
    });

    $(".div-regist a").on("click", function () {
        $(".alertLog").addClass("showjs");
    });

    $(".regist").submit(function (evt) {
        var inputsArray = Array.from($(".regist input.field"));

        console.log(inputsArray);
        let inputs = $(this).parent().parent().find("input");

        if (findCookie(inputsArray) > 0) {
            evt.preventDefault();
            alert("El email: " + inputsArray[0].value + " ya existe");
        } else {
            storeCookie(inputsArray);
        }
    });

    $(".login").submit(function (evt) {
        evt.preventDefault();
        var inputsArray = Array.from($(".login input.field"));
        console.log(inputsArray[1].value);
        let found = findCookie(inputsArray);
        if (found == 2) {
            window.location.replace("list.html");
        } else {
            alert("Usuario y/o contraseña erroneos " + found);
        }
    });

    // Reject notification
    $(".reject").on('click', function () {
        if (confirm("Are you sure you want to reject?")) {
            $(this).parent().hide()
        }
    });

    // Accept notification
    $(".join").on('click', function () {
        if (confirm("Do you want to add this event to your list?")) {
            $(this).parent().hide();
        }
    });

}

function createCategory(title) {
     $('.new-category').before(`
            <div class="category">
                <a class="category-options" href="#"><img src="images/menu.png" alt="options"></a>
                <div class="category-options-dropdown">
                    <a class="close-category" href="#">Archive list</a>
                    <a href="#">Clone list</a>
                    <a href="#">Share list</a>
                    <a href="#">Settings</a>
                </div>
                <h2>`+ title + `</h2>
                <div class="event-list">
                </div>
                <form class="new-event">
                    <input class="form-control mr-sm-1" name="title" placeholder="Title" aria-label="New Event">
                    <input class="form-control mr-sm-1" name="date" type="date" aria-label="date">
                </form>
            </div>
        `) 
}

function createEvent(categoryTitle,title,date){
    let categoryPointer = undefined;
    $(".category").each(function (index) {
        if ($(this).find('h2').html() == categoryTitle){
            categoryPointer = $(this);
        }
    });
    if (categoryPointer == undefined){
        createCategory(categoryTitle);
        categoryPointer = $('.new-category').prev();
    }
    categoryPointer.find('.event-list').append(`
            <div class="event">
                <a class="close" href="#"><img src="images/close.png" alt="close"></a>
                <h3>`+ title + `</h3>
                <ul class="event-description">
                    <li><img class="like new" src="images/like.png" alt="like"></li>
                    <li>`+ date + `</li>
                </ul>
            </div>
        `)
}

function checkform(elem) {
    if (elem.value == "") {
    }
}

function storeCookie(array) {
    let storeString = "";
    storeString = array[0].value + " = ";
    array.slice(1).forEach(elem => {
        storeString += elem.value + ",";
    });
    storeString += ";path=/";
    document.cookie = storeString;
}

function findCookie(array) {

    arrayCookie = splitCookies();
    for (let a = 0; a < arrayCookie.length; a++) {

        if (findEmail(array[0].value, arrayCookie[a])) {

            if (findPass(array[1].value, arrayCookie[a])) {
                return 2;
            }
            return 1;
        }
    }
    return 0;
}

function splitCookies() {
    var splited = document.cookie.split(";");
    return splited;
}

function findEmail(email, cookie) {
    var cookieemail = cookie.split(",");
    var positionequal = cookieemail[0].indexOf('=');
    let emailCookie = cookieemail[0].substring(0, positionequal);
    if (emailCookie == email) {
        return true;
    }
    return false;
}

function findPass(password, cookie) {
    var cookiepassword = cookie.split(",");
    if (cookiepassword[1] == password) {
        return true;
    }
    return false;
}
