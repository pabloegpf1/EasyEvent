console.log("CONECTED");
$(document).ready(function () {

    // Close event
    $(".close").on('click', function () {
        if (confirm("Are you sure you want to delete this event?")) {
            $(this).parent().hide()
        }
    });

    // Like event
    $(".like").on('click',function () {
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

    // Drop a event inside a column
    $(".event-list").sortable({
        items: ".event",
    }).disableSelection();

    // Drop a event inside a column
    $(".event-list").droppable({
        accept: ".event",
    });

    // Drag a category
    $('.column').draggable({
        cursor: 'move',
        delay: 200,
        connectToSortable: ".board",
        stop: function (event, ui) {
            $(ui.helper).css('width', "");
            $(ui.helper).css('height', "");
        }
    });

    // Drop a column inside board
    $(".board").sortable({
        items: ".column",
    });

    // Drop a column inside board
    $(".board").droppable({
        accept: ".column",
    });

    // Show column options 
    $('.column-options').on('click',function (event) {
        $('.column-options-dropdown').hide();
        $(this).parent().find('.column-options-dropdown').css('display', 'flex');
        event.stopPropagation();
    });

    // Hide column options when click outside 
    $(document).on('click',function () {
        $('.column-options-dropdown').hide();
    });

    // Hide column when click on close column
    $('.close-column').on('click', function (event) {
        if (confirm("Are you sure you want to delete this column?")) {
            $(this).parent().parent().hide("3000");
        }
    });

    $(".new-event").on('submit',function (event) {
        let title = $(this).find('input[name="title"]').val();
        $(this).before(`
            <div class="event">
                <a class="close" href="#"><img src="images/close.png" alt="close"></a>
                <h3>`
                +title+
                `</h3>
                <ul class="event-description">
                    <li><img class="like new" src="images/like.png" alt="like"></li>
                    <li>03/06/19 15:47</li>
                </ul>
            </div>
        `)
        $(this).find('input[name="title"]').val('') 
        event.preventDefault();
    });

    $(".div-regist a").on("click", function () {
        $(".alertLog").addClass("show");
    });

    


    $(".regist").submit(function(evt){
        var inputsArray = Array.prototype.slice.call($(".regist input.field"));
        
        console.log(inputsArray);
        let inputs = $(this).parent().parent().find("input");
        
        if (findCookie(inputsArray)>0) {
            evt.preventDefault();
            alert("El email: "+inputsArray[0].value+" ya existe");
        }else{
            storeCookie(inputsArray);
        }
    });

    $(".login").submit(function (evt){
        var inputsArray = [].slice.calls($(".login input.field"));
        console.log(inputsArray[0].value);
        if (findCookie(inputsArray)!=2) {
            evt.preventDefault();
        }
    });
});

function checkform(elem){
    if(elem.value == ""){
    }
}

function storeCookie(array){
    let storeString = "";
    storeString = array[0].value + " = ";
    array.slice(1).forEach(elem => {
        console.log(elem.value);
        storeString += elem.value +", ";
    });
    storeString += ";path=/";
    document.cookie = storeString;
}

function findCookie(array){
    let found = 0;
    arrayCookie = splitCookies();
    arrayCookie.forEach(element => {
        if (findEmail(array[0].value, element)) {
            if (findPass(array[1].value, element)) {
                found++;
            }
            found++;
        }
    });
    return found;
}

function splitCookies(){
    var splited = document.cookie.split(";");
    return splited;
}

function findEmail(email, cookie){
    return cookie.includes(email);
}

function findPass(password, cookie){
    return cookie.includes(password);
}
