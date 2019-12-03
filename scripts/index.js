let username = getUsername();

$(document).ready(function () {

    addEventListeners();

    loadEvents();

    $(".new-event").on('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        let title = $(this).find('input[name="title"]').val();
        let date = $(this).find('input[name="date"]').val();
        let categoryTitle = $(this).parent().find('h2').html();
        let id = storeEventCookie(categoryTitle, title, date);
        createEvent(categoryTitle,title,date,id);
        $(this).find('input[name="title"]').val('');
        $(this).find('input[name="date"]').val('');
        addEventListeners();
    });

    $(".new-category").on('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        let title = $(this).find('input[name="title"]').val();
        createCategory(title);
        $(this).find('input[name="title"]').val('');
        addEventListeners();
        $(".new-event").on('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            let title = $(this).find('input[name="title"]').val();
            let date = $(this).find('input[name="date"]').val();
            let categoryTitle = $(this).parent().find('h2').html();
            let id = storeEventCookie(categoryTitle, title, date);
            createEvent(categoryTitle,title,date,id);
            $(this).find('input[name="title"]').val('');
            $(this).find('input[name="date"]').val('');
            addEventListeners();
        });
    });

    $(".regist").submit(function (evt) {
        evt.preventDefault();
        console.log("regist");

        var inputsArray = Array.from($(".regist input.field"));
        let inputs = $(this).parent().parent().find("input");

        console.log(findCookie(inputsArray))
        if (findCookie(inputsArray) > 0) {
            alert("El email: " + inputsArray[0].value + " ya existe");
        } else {
            storeCookie(inputsArray);
            window.location.replace("list.html");
        }
    });

    $(".login").submit(function (evt) {
        evt.preventDefault();
        var inputsArray = Array.from($(".login input.field"));
        let found = findCookie(inputsArray);
        if (found == 2) {

            window.location.replace("list.html");
        } else {
            alert("Usuario y/o contraseña erroneos " + found);
        }
    });

});

function addEventListeners() {

    // Close event
    $(".close").on('click', function () {
        if (confirm("Are you sure you want to delete this?")) {
            $(this).parent().hide()
            let id = $(this).parent().attr('id');
            console.log(id + "=hola; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;")
            document.cookie = id+"= ; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/list.html;";
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
            let id = $(this).attr('id');
            let category = $(this).parent().parent().find('h2').html();
            let title = $(this).find('h3').html();
            let date = $(this).find('li:nth-child(2)').html();
            changeEventCookie(category, title, date, id)
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
        if (confirm("Estas segur@ de que deseas archivar la actividad?. Se borrarán todas las actividades de esta categoría.")) {
            $(this).parent().parent().hide("3000");
            //Borrar todas las cookies que se encuentren en esta actividad.
            archiveCategory($(this).parent().parent().find('h2').html());
        }
    });

    $(".div-regist a").on("click", function () {
        $(".alertLog").addClass("showjs");
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

function createEvent(categoryTitle,title,date,id){
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
            <div class="event" id=`+id+`>
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

function storeEventCookie(category, title, date) {
    let id = username + "-" + Math.floor(Math.random() * 100000)+"A";
    let storeString = id + "=";
    storeString += category + ",";
    storeString += title + ",";
    storeString += date;
    storeString += ";path=/list.html";
    document.cookie = storeString;
    return id;
}

function changeEventCookie(category, title, date, id) {
    let storeString = id + "=";
    storeString += category + ",";
    storeString += title + ",";
    storeString += date;
    storeString += ";path=/list.html";
    document.cookie = storeString;
}

function loadEvents(){
    let cookies = splitCookies();
    for(let i = 0; i< cookies.length; i++){
        let cookie = cookies[i].substring(cookies[i].indexOf("=")+1);
        let elementArray = cookie.split(',');
        let id = cookies[i].substring(0, cookies[i].indexOf("=") - 1)
        if (id.includes(username+"-")) createEvent(elementArray[0], elementArray[1], elementArray[2], id);
    }
    addEventListeners();
}

function storeCookie(array) {
    let storeString = "";
    storeString = array[0].value + "=";
    array.slice(1).forEach(elem => {
        storeString += elem.value + ",";
    });
    let username = storeString.substring(storeString.indexOf("=") + 1, storeString.indexOf(","));
    storeString += ";path=/home.html";
    document.cookie = storeString;
    document.cookie = "username=" + username +";path=/;"
}

function findCookie(array) {

    arrayCookie = splitCookies();
    for (let a = 0; a < arrayCookie.length; a++) {

        if (findEmail(array[0].value, arrayCookie[a])) {

            if (findPass(array[1].value, arrayCookie[a])) {
                username = arrayCookie[a].substring(arrayCookie[a].indexOf('=') + 1, arrayCookie[a].indexOf(','));
                document.cookie = "username=" + username + ";path=/;"
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
    if (emailCookie.indexOf(" ") == 0){
        emailCookie = cookieemail[0].substring(1, positionequal);
    } 
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

function getUsername(){
    let cookieElements = splitCookies();
    for(let i =0; i<cookieElements.length; i++){
        if(cookieElements[i].includes("username")){
            return cookieElements[i].substring(cookieElements[i].indexOf("=") + 1);
        }
    }
}

function archiveCategory(categoryTitle){
    let cookies = splitCookies();
    let category = "="+categoryTitle+",";
    for(let a = 0; a < cookies.length; a++){
        if(cookies[a].includes(category)){
            document.cookie = cookies[a]+"; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/list.html;";
        }
    }
}