//jquery

var playing = false;
var score;
var trialsLeft;
var step;
var action; // setinterval

var fruits = ['apple.gif', 'grapes.png', 'mango.jpg', 'orange.jpg', 'pineapple.gif'];
// var fruits = ['mango', 'orange']

$(function () {
    $(".startreset").click(function () {
        // we are playing
        if (playing == true) {
            location.reload();
        } else {


            $(".gameover").hide();
            playing = true;  // initiate the game
            score = 0;
            $(".scorevalue").html(0);

            // trials Left
            trialsLeft = 3;
            $(".trialsLeft").show();
            addHearts();  // adding the hearts to the trialsLeft box

            $(".startreset").html("Reset Game");

            // for fruits 
            startAction();

        }
    });

    // cutting the fruit
    $("#fruit1").mouseover(function () {
        score++;
        $(".scorevalue").html(score);
        $(".sliceSound")[0].play();  // gives array where first element is audio src

        //hide fruit and explode
        clearInterval(action);
        $("#fruit1").hide("explode", 500);

        // jquery ui feature
        // startAction;
        setTimeout(startAction, 800);
    });






    // for fruits
    function startAction() {
        $("#fruit1").show();  //generating fruit

        chooseFruit();  // creating the random fruit

        // choosing the positon of fruit
        $("#fruit1").css({ 'left': Math.round(600 * Math.random()), 'top': -50 });

        step = 1 + Math.round(5 * Math.random())

        // moving the fruit down
        action = setInterval(function () {
            $("#fruit1").css('top', $("#fruit1").position().top + step);

            // checking if the fruit is to low


            if ($("#fruit1").position().top > $(".fruitContainer").height()) {


                // check trilas are left
                if (trialsLeft > 1) {
                    $("#fruit1").show();  //generating fruit

                    chooseFruit();  // creating the random fruit

                    // choosing the positon of fruit
                    $("#fruit1").css({ 'left': Math.round(600 * Math.random()), 'top': -50 });

                    step = 1 + Math.round(5 * Math.random())

                    // reduce trials
                    trialsLeft = trialsLeft - 1;
                    addHearts();
                }
                else {
                    playing = false;
                    $(".startreset").html("Start Game");
                    $(".gameover").show();
                    $(".gameover").html("<p>Game Over</p><p>Your score is " + score + "</p>");

                    $(".trialsLeft").hide();
                    clearInterval(action);
                    $("#fruit1").hide();
                }
            }


        }, 10)


    }

    // random fruit 
    function chooseFruit() {
        $("#fruit1").attr('src', "Images/" + fruits[Math.round(4 * Math.random())]);
    }



    // adding hearts
    function addHearts() {
        $(".trialsLeft").empty();
        for (var i = 1; i <= trialsLeft; i++) {

            $(".trialsLeft").append("<img src='Images/Heart shape.png' class='life'>");
        }
    }

});