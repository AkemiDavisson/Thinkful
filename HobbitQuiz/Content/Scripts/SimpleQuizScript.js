$(document).ready(function () {

    var submitButton = $(".submit");
    var adventureButton = $(".continue");
    var nextButton = $(".next");
    var tryAgainButton = $(".tryAgain");

    //load youtube api and videos on load
    loadPlayers();

    introScreen();

    //displays 1st question after countdown
    adventureButton.on('click', function () {
        adventureButton.addClass('hidden');
        countDown();
    });

    //check answer on submit
    submitButton.on('click', function () {
        questionManager.checkAnswer();
    });

    //next question
    nextButton.on('click', questionManager.displayQuestion);

    //reset quiz
    tryAgainButton.on('click', questionManager.resetQuiz);
});

//Questions object, holds questions, multiple choice answers, correct answer, and videoId. 
questionsObject = {

    q1: {
        question: "Who is the first dwarf to come to Bilbo’s door at the beginning of The Hobbit?",
        mcanswers: ["Fili", "Bofur", "Dwalin", "Kili"],
        correctanswer: "Dwalin",
        videoCode: "GZC7dgPqW4c"
    },
    q2: {
        question: "What is the name of the home where Elrond and his elves live?",
        mcanswers: ["Lake Town", "Mirkwood", "Bag End", "Rivendell"],
        correctanswer: "Rivendell",
        videoCode: "t9L8Er_oqAQ"
    },
    q3: {
        question: "When is Durin's Day?",
        mcanswers: ["On an honest-to-gosh Blue Moon",
        "The Hunter's Moon",
        "The first day of the last moon of autumn",
        "The Harvest Moon"
        ],
        correctanswer: "The first day of the last moon of autumn",
        videoCode: "-JzKklW9fR4"
    },
    q4: {
        question: "Who are the two youngest dwarves?",
        mcanswers: ["Oin and Gloin", "Nori and Ori", "Fili and Kili", "Bifur and Bofur"],
        correctanswer: "Fili and Kili",
        videoCode: "v4y_B3ep4EU"
    },

    q5: {
        question: "What is the name of the creature Bilbo encounters in the goblin caves?",
        mcanswers: ["Bard", "Gollum", "Beorn", "Smeagal"],
        correctanswer: "Gollum",
        videoCode: "haRsNCoLnHQ"
    }

};

function introScreen() {

    $('#error, #questionNumber, .quizform, .submit').addClass('hidden');
    $('.question').text('I\'m looking for someone to share in an adventure...');

};

function countDown() {
    var count = 5;
    var counter = document.getElementById('counter');
    counter.innerHTML = count;

    var interval = setInterval(function () {
        if (count > 1) {
            count--;
            counter.innerHTML = count;
        }
        else {
            clearInterval(interval);
            questionManager.displayQuestion();
        }
    }, 1000);

};

//Question manager 
var questionManager = (function () {
    var currentNumber = 1;
    var correctAnswers = 0;

    //shows current question
    function displayQuestion() {

        if (currentNumber <= 5) {

            //method to set elements
            updateElementsToDisplay();

            //current question position 
            var currentQuestion = questionsObject['q' + currentNumber];
            var answer = $('label.answer');

            //Set question 
            $('.question').text(currentQuestion.question);

            //Loop to add multiple choice answers to the form
            for (var i = 0; i < currentQuestion.mcanswers.length; i++) {
                answer.eq(i).html('<input type="radio" name="choice"/>'
                    + currentQuestion.mcanswers[i]);
            }
        }

        else {
            quizEnd();
        }

    };

    //Updates element to display in quiz 
    function updateElementsToDisplay() {

        $('#error, #counter, .next').addClass('hidden');

        $('#questionNumber').text('Question ' + currentNumber + " out of 5");

        $('.quizform, #questionNumber, #correctAnswers, .submit').removeClass('hidden');
    };

    //on submit, checks answer 
    function checkAnswer() {

        var currentQuestion = questionsObject['q' + currentNumber];
        var answer = currentQuestion.correctanswer;
        var userAnswer = $('input[type=radio]:checked').parent().text();

        //check for blanks 
        if (userAnswer == "") {
            //show error message
            $('#error').removeClass('hidden')
        }
        else {
            $('#error').addClass('hidden');

            //correct answer
            if (userAnswer == answer) {

                correctAnswers++;
                answerResult(answer + " is correct!");
            }
                //incorrect answer
            else {

                answerResult("Incorrect, the correct answer was " + answer);
            }
            currentNumber++;

            //update correct answers span
            $('#correctAnswers').text('Correct answers: ' + correctAnswers);
        }
    };

    //displays answer result page and video
    function answerResult(message) {
        $('.quizform, #questionNumber, #correctAnswers, .submit').addClass('hidden');
        $('.next').removeClass('hidden');

        //show correct/incorrect message animate to fade
        $(".question").animate({ opacity: 0 }, function () {
            $(this).text(message)
                .animate({ opacity: 1 });
        })

        //call video clip
        displayVideo(currentNumber);
    };

    //Method after quiz finished
    function quizEnd() {
        $('.next').addClass('hidden');
        $('.tryAgain').removeClass('hidden');

        player5.pauseVideo();
        $('#player5').hide();

        //Perfect score 
        if (correctAnswers == 5) {
            $('.question').text("Perfect score! Are you sure you're not a wise? Here's your reward!");
            displaySneakPeak(correctAnswers);
        }
            //Good score
        else if (correctAnswers == 4) {

            $('.question').text('Great job! Thanks for playing!');
            displaySneakPeak(correctAnswers);
        }
            //Not great score, prompted to try again
        else if (correctAnswers <= 3) {
            $('.question').text("Oops. Try again and you may get a surprise! Thanks for playing!");
        }
    };

    //Reset/restart quiz
    function resetQuiz() {
        //return variables to default/reset quiz form
        currentNumber = 1;
        correctAnswers = 0;

        $('.tryAgain').addClass('hidden');
        $('#correctAnswers').text('');

        //display first question again
        displayQuestion();
    };

    return {
        displayQuestion: displayQuestion,
        checkAnswer: checkAnswer,
        quizEnd: quizEnd,
        resetQuiz: resetQuiz
    };

})();

var player1, player2, player3, player4, player5, player6, player7;

//Creates an Iframe and YoutubePlayer on page load
function loadPlayers() {
    //load youtube api
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    //after youtube api is loaded this function runs, loads all videos
    window.onYouTubePlayerAPIReady = function () {
        player1 = new YT.Player('player', {
            width: "854",
            height: "480",
            videoId: questionsObject['q1'].videoCode,
            playerVars: { 'autoplay': 0 }
        });
        player2 = new YT.Player('player2', {
            width: "854",
            height: "480",
            videoId: questionsObject['q2'].videoCode,
            playerVars: { 'autoplay': 0 , 'start': 10}
        });
        player3 = new YT.Player('player3', {
            width: "854",
            height: "480",
            videoId: questionsObject['q3'].videoCode,
            playerVars: { 'autoplay': 0, 'start': 104 }
        });
        player4 = new YT.Player('player4', {
            width: "854",
            height: "480",
            videoId: questionsObject['q4'].videoCode,
            playerVars: { 'autoplay': 0 }
        });
        player5 = new YT.Player('player5', {
            width: "854",
            height: "480",
            videoId: questionsObject['q5'].videoCode,
            playerVars: { 'autoplay': 0 }
        });
        player6 = new YT.Player('player6', {
            width: "854",
            height: "480",
            videoId: 'Qt1MvdPYD1U',
            playerVars: { 'autoplay': 0 }
        });
        player7 = new YT.Player('player7', {
            width: "854",
            height: "480",
            videoId: 'fnaojlfdUbs',
            playerVars: { 'autoplay': 0 }
        });

        //hide the iframes within page till used
        $('#player').hide();
        $('#player2').hide();
        $('#player3').hide();
        $('#player4').hide();
        $('#player5').hide();
        $('#player6').hide();
        $('#player7').hide();

    }

};

//Switch statement displays video based on current question number
function displayVideo(currentNumber) {
    var nextButton = $(".next");

    switch (currentNumber) {
        case 1:
            if (player1) {
                $('#player').show();
                player1.seekTo(0);
                player1.playVideo();
                nextButton.click(function () {
                    player1.stopVideo();
                    $('#player').hide();
                });
            }
            break;
        case 2:
            if (player2) {
                $('#player2').show();
                player2.seekTo(0);
                player2.playVideo();
                nextButton.click(function () {
                    player2.stopVideo();
                    $('#player2').hide();
                });
            }
            break;
        case 3:
            if (player3) {
                $('#player3').show();
                player3.seekTo(104);
                player3.playVideo();
                nextButton.click(function () {
                    player3.stopVideo();
                    $('#player3').hide();
                });
            }
            break;
        case 4:
            if (player4) {
                $('#player4').show();
                player4.seekTo(0);
                player4.playVideo();
                nextButton.click(function () {
                    player4.stopVideo();
                    $('#player4').hide();
                });
            }
            break;
        case 5:
            if (player5) {
                $('#player5').show();
                player5.seekTo(0);
                player5.playVideo();
                nextButton.click(function () {
                    player5.stopVideo();
                    $('#player5').hide();
                });
            }
            break;
        default:
            break;
    }
}

//final video 'sneak peek' Hobbit trailer
function displaySneakPeak(correctAnswers) {
    var tryAgain = $('.tryAgain');

    if (correctAnswers == 5) {
        $('#player6').show();
        player6.seekTo(0);
        player6.playVideo();
        tryAgain.click(function () {
            player6.stopVideo();
            $('#player6').hide();
        })
    }
    else if (correctAnswers == 4) {
        $('#player7').show();
        player7.seekTo(0);
        player7.playVideo();
        tryAgain.click(function () {
            player7.stopVideo();
            $('#player7').hide();
        })
    }
};


