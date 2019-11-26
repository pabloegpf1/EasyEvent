$(document).ready(function () {

    $("#colorblind").click(function () {
        if ($("body").css("--main-color") ==  "rgb(137, 206, 174)"){
            $("body").get(0).style.setProperty("--main-color", "green");
            $("body").get(0).style.setProperty("--text-color", "white");
            $(this).find("h4").html("Modo daltónico off");
        }else{
            $("body").get(0).style.setProperty("--main-color", "rgb(137, 206, 174)");
            $("body").get(0).style.setProperty("--text-color", "black");
            $(this).find("h4").html("Modo daltónico");
        }
    });

});

