$(function () {
    // slider
    $('#slider').slider({
        min: 3,
        max: 40,
        slide: function (event, ui) {
            $('#circle').height(ui.value);
            $('#circle').width(ui.value);
        }
    });

    // canvas
    var paint = false; // for (painting or erasing) or not
    var paintErase = 'paint';

    // get canvas and context
    var canvas = document.getElementById("paint");
    var context = canvas.getContext("2d");

    // get canvas container
    var container = $(".container");

    // initial mouse position
    var mouse = { x: 0, y: 0 };

    // onload saved work from local storage
    if (localStorage.getItem('imgCanvas') != null) {
        var img = new Image();
        img.onload = function () {
            context.drawImage(img, 0, 0);
        }
        img.src = localStorage.getItem('imgCanvas');
    }

    // set drawing parameters
    context.lineWidth = "3";
    context.lineCap = "round";
    context.lineJoin = "round";

    // clicking inside container
    container.mousedown(function (e) {
        paint = true;
        context.beginPath();
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.moveTo(mouse.x, mouse.y);
    });

    container.mousemove(function (e) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        if (paint == true) {

            if (paintErase == "paint") {
                context.strokeStyle = $("#paintColor").val();
            }
            else {
                context.strokeStyle = "white";
            }
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
        }
    });

    container.mouseup(function () {
        paint = false;
    });
    container.mouseleave(function () {
        paint = false;
    });

    // erase button
    $('#erase').click(function () {
        if (paintErase == "paint") {
            paintErase = "erase";
        }
        else {
            paintErase = "paint";
        }
        $(this).toggleClass('eraseMode');
    });

    // reset button
    $('#reset').click(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        paintErase = "paint";
        $("#erase").removeClass("eraseMode");

    });

    // save button -> localstorage
    $('#save').click(function () {
        if (typeof (localStorage) != null) {
            // save and converst to graphical url and save to local storage
            localStorage.setItem("imgCanvas", canvas.toDataURL());
        }
        else {
            alert("Your browser does not support Local storage");
        }
    });

    // change color input
    $("#paintColor").change(function () {
        console.log($(this).val());
        $('#circle').css("background", $(this).val());
    });

    // changing linewidth with resp to slider
    $('#slider').slider({
        min: 3,
        max: 40,
        slide: function (event, ui) {
            $('#circle').height(ui.value);
            $('#circle').width(ui.value);
            context.lineWidth = ui.value;
        }
    });





})

// canvas -javascript for demo
    // var canvas = document.getElementById("paint");
    // var context = canvas.getContext("2d");
    // Create a path 
    // context.beginPath();
    // Set the path width 
    // context.lineWidth = "10";
    // Set the path color 
    // context.strokeStyle = "green";
    // linecap(round,butt,square)
    // context.lineCap = "round";
    // set linejoin(bevel,round,miter)
    // context.lineJoin = "round";
    // context.moveTo(100, 250);  ->  position the context point
    // new position
    // context.lineTo(150, 50);
    // context.lineTo(250, 250);
    // make line visible
    // context.stroke();
