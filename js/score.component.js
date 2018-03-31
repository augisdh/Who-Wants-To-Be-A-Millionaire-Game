"use strict";

Vue.component('score', {
    props: ['currentLevel', 'score'],
    template: `
        <div>
            <ul class="scoreMoneyList">
                <li v-for="(score, index) in scoreList" v-bind:class="{'scoreListWon': currentLevel === index, 'moneyWon': index < currentLevel}"> {{score}} </li>
            </ul>
        </div>
    `,
    data: function(){
        return {
            scoreList: [
                "100", "200", "300", "500", "1000", "2000", "4000", "8000", "16 000", "32 000", "64 000", "125 000", "250 000", "500 000", "1 MILLION"
            ]
        }
    }
})