$(document).ready(function () {

    // Close task
    $(".close").click(function () {
        if (confirm("Are you sure you want to delete this task?")) {
            $(this).parent().hide()
        }
    });

    // Like task
    $(".action").click(function () {
        if ($(this).find('img').hasClass('like')) {
            if ($(this).find('img').attr('src') == 'images/like.png') {
                $(this).find('img').attr('src', 'images/like-active.png');
            } else {
                $(this).find('img').attr('src', 'images/like.png');
            }
        }
    });

    // Drag a task
    $('.task').draggable({
        cursor: 'move',
        revert: true,
        revertDuration: 0,
        delay: 200,
        connectToSortable: ".column",
        stop: function (event, ui) {
            $(ui.helper).css('width', "");
        }
    });


    // Drop a task inside a column
    $(".column").sortable({
        items: ".task",
    });

    // Drop a task inside a column
    $(".column").droppable({
        accept: ".task",
    });

    // Drag a task
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
    $('.column-options').click(function (event) {
        $('.column-options-dropdown').hide();
        $(this).parent().find('.column-options-dropdown').css('display', 'flex');
        event.stopPropagation();
    });

    // Hide column options when click outside 
    $(document).click(function () {
        $('.column-options-dropdown').hide();
    });

    // Hide column when click on close column
    $('.close-column').on('click', function (event) {
        if (confirm("Are you sure you want to delete this column?")) {
            $(this).parent().parent().hide("3000");
        }
    });

});

