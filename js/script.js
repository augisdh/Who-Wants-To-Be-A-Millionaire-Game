"use strict";

let millgame = new Vue({
    el: "#millgame",
    data: {
        questions: [],
        currentView: "intro",
        level: 0,
        currentQuestion: {},
        userAnswer: null,
        fiftyPressed: false,
        callPressed: false,
        callSays: "",
        callSaysIndex: 0,
        audiencePressed: false,
        audienceSays: "",
        audienceSaysIndex: 0,
        audiencePressed: false,
        scoreList: ["100", "200", "300", "500", "1000", "2000", "4000", "8000", "16 000", "32 000", "64 000", "125 000", "250 000", "500 000", "1 MILLION"],
        feedBackVisable: false,
        feedBackMessage: "",
        feedBackClass: null,
        playAudioWrong: false,
        playAudioCorrect: false,
        playAudioStart: false,
    },
    methods: {
        playGame: function(){
            this.playAudioWrong = false;
            this.playAudioCorrect = false,
            this.playAudioStart = true;
            this.showFeedBack("Let's PLAY!");
            this.level = 0;
            this.userAnswer = null;
            this.fiftyPressed = false;
            this.callPressed = false;
            this.audiencePressed = false,
            this.currentView = 'gameplay';
            loadJson();
        },
        sumbitAnswer: function(){
            if(this.level === 14 && this.userAnswer === this.currentQuestion.correct){
                this.showFeedBack("CONGRATULATIONS!");
                this.currentView = 'gameWon';
            } else if(this.userAnswer === this.currentQuestion.correct){
                this.playAudioCorrect = true;
                this.showFeedBack("Correct!", "correct-green");
                this.level += 1;
                loadJson();
                this.userAnswer = null;
            } else {
                this.playAudioWrong = true;
                this.showFeedBack("Wrong answer!", "wrong-red");
                this.currentView = 'gameOver';
            }
        },
        collectMoneyWon: function(){
            if(this.level > 0){
                this.showFeedBack("CONGRATULATIONS!");
                this.currentView = 'cashOut';
            }
        },
        leaveGame: function(){
            this.playAudioWrong = false;
            this.playAudioCorrect = false;
            this.playAudioStart = false;
            this.showFeedBack("COME BACK LATER TO WIN MILLION");
            this.currentView = 'intro';
        },
        removeTwoWrongQuestions: function(){
            this.currentQuestion.answers.splice(0, 4, this.currentQuestion.answers[this.currentQuestion.correct], this.currentQuestion.answers[(this.currentQuestion.correct +1) % 4]);
            this.currentQuestion.correct = 0;
            this.fiftyPressed = true;
        },
        callFriendHelp: function(){
            let chance = Math.random();

            if(chance <= 0.6){
                let isCorrect = Math.random();

                if(isCorrect <= 0.95){
                    this.callSaysIndex = this.currentQuestion.correct;
                    this.callSays = 'I know the answer. The correct answer is: ' + "\"" + this.currentQuestion.answers[this.callSaysIndex] + "\"";
                } else {
                    this.callSaysIndex = Math.floor(Math.random() * 4);
                    this.callSays = 'I know the answer. The correct answer is: ' + "\"" + this.currentQuestion.answers[this.callSaysIndex] + "\"";
                }
            } else if(chance <= 0.9){
                let isCorrect = Math.random();

                if(isCorrect <= 0.6){
                    this.callSaysIndex = this.currentQuestion.correct;
                    this.callSays = 'I\'m almost sure, it\'s: ' + "\"" + this.currentQuestion.answers[this.callSaysIndex] + "\"";
                } else {
                    this.callSaysIndex = Math.floor(Math.random() * 4);
                    this.callSays = 'I\'m almost sure, it\'s: ' + "\"" + this.currentQuestion.answers[this.callSaysIndex] + "\"";
                }
            } else {
                this.callSaysIndex = Math.floor(Math.random() * 4);
                this.callSays = 'I don\'t know the answer, my guess is: ' + "\"" + this.currentQuestion.answers[this.callSaysIndex] + "\"";
            }
            this.userAnswer = this.callSaysIndex;
            this.callPressed = true; 
        },
        audienceHelp: function(){
            let chance = Math.random();

            if(chance <= 0.7){
                let isCorrect = Math.random();

                if(isCorrect <= 0.7){
                    this.audienceSaysIndex = this.currentQuestion.correct;
                    this.audienceSays = 'Most of the audience said. The correct answer is: ' + "\"" + this.currentQuestion.answers[this.audienceSaysIndex] + "\"";
                } else {
                    this.callSaysIndex = Math.floor(Math.random() * 4);
                    this.audienceSays = 'Most of the audience said. The correct answer is: ' + "\"" + this.currentQuestion.answers[this.audienceSaysIndex] + "\"";
                }
            } else {
                this.callSaysIndex = Math.floor(Math.random() * 4);
                this.audienceSays = 'Most of the audience guessed the answer and said. The correct answer is: ' + "\"" + this.currentQuestion.answers[this.audienceSaysIndex] + "\"";
            }
            this.userAnswer = this.audienceSaysIndex;
            this.audiencePressed = true;
        },
        showFeedBack: function(message, classColor){
            this.feedBackVisable = true;
            this.feedBackMessage = message;
            this.feedBackClass = classColor;
            setTimeout(() => {
                this.feedBackVisable = false;
                this.feedBackMessage = "";
                this.feedBackClass = null;
            }, 2000)
        },
    }
});

function loadJson(){
    fetch("http://localhost:3012/games/")
        .then(function(response){
            response.json()
                .then(function(data){
                    if(data){
                        millgame.questions = data;
                        let all = millgame.questions[millgame.level];
                        millgame.currentQuestion = all.questions[getRandomInt(0, 9)];
                    }
                })
        })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}