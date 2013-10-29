$(document).ready(function () {
    $(function () {
        hint();
    })

    //Generate random number and set other variables
    var answer = Math.floor(Math.random() * 101);
    console.log(answer);
    var prevDistance = null;
    var attempts = 1;

    function hint() {
        $('#submit').click(submit);
        $('.guess').keydown(function (e) {
            if (e.keyCode == 13) {
                submit();
            }
        });

    }

    //Submit guess
    function submit() {
        var guess = $('.guess').val();
        console.log(guess);
        var valid = validate(guess);
        if (valid == true) {
            check(guess);
        }
    }

    function validate(guess) {
        //Check for nulls or invalid values
        if (guess == '') {
            $('#hotColdDisplay').html('Please select a value');
            return false;
        } else if (guess > 100 || guess < 1) {
            $('#hotColdDisplay').html("Error: Must be between 1 and 100").css({ color: 'red' });
            $('.guess').val('');
            return false;
        }
        return true;
    }

    function check(guess) {
        //Get distance of first guess from answer
        distance = Math.abs(guess - answer);

        //Display congrats if correct answer
        if (guess == answer) {
            console.log("Congratulations");
            $('#hotColdDisplay').html('Congratulations! - ' + attempts + ' Guesses!').css({ color: 'SeaGreen' });
            $('.coldArrow').fadeOut('slow').css('display', 'none');
            $('.hotArrow').fadeOut('slow').css('display', 'none')
        }
        else if (prevDistance == null) {
            firstGuess(guess, answer);

        } else {
            hotOrCold(prevDistance, distance, guess, answer);
     
        }

        //set distance from answer
        prevDistance = distance;

    }


    function firstGuess(guess, answer) {
        if (guess < answer) {
            console.log('Too low');
            $('#hotColdDisplay').html('Too low, guess higher!');
        }
        else if (guess > answer) {
            console.log('Too high');
            $('#hotColdDisplay').html('Too high, guess lower!');
        }
        attempts = attempts + 1;
       
    }

    //Check for 'hotter' 'colder'
    function hotOrCold(prevDistance, distance, guess, answer) {

        if (prevDistance > distance) {

            if (guess < answer) {
                $('#hotColdDisplay').html('Getting warmer...guess higher!').css({ color: 'FireBrick ' });
                $('.hotArrow').fadeOut('slow').fadeIn('slow').css('display', 'block');
                $('.coldArrow').fadeOut('slow').css('display', 'none');
            }
            else if (guess > answer) {
                $('#hotColdDisplay').html('Getting warmer...guess lower!').css({ color: 'FireBrick ' });
                $('.hotArrow').fadeOut('slow').fadeIn('slow').css('display', 'block');
                $('.coldArrow').fadeOut('slow').css('display', 'none');
            }

        }
        else if (prevDistance < distance) {

            if (guess < answer) {
                $('#hotColdDisplay').html('Brr, getting colder...guess higher!').css({ color: 'DodgerBlue' });
                $('.coldArrow').fadeOut('slow').fadeIn('slow').css('display', 'block');
                $('.hotArrow').fadeOut('slow').css('display', 'none')
            }
            else if (guess > answer) {
                $('#hotColdDisplay').html('Brr, getting colder... guess lower!').css({ color: 'DodgerBlue' });
                $('.coldArrow').fadeOut('slow').fadeIn('slow').css('display', 'block');
                $('.hotArrow').fadeOut('slow').css('display', 'none')
            }
            
        }
       
        attempts = attempts + 1;
    };

    $('#startOver').click(function (e) {
        e.preventDefault();
        answer = Math.floor(Math.random() * 100);
        console.log(answer);
        $('.coldArrow').fadeOut('slow').css('display', 'none');
        $('.hotArrow').fadeOut('slow').css('display', 'none')
        $('#hotColdDisplay').html('');
        prevDistance = null;
        attempts = 1;
        $('.guess').val('');
    });
});