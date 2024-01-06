const express = require('express');
const app = express();
const port = 5000;

const quizPassword = process.env.quizPassword;

const easyQs = process.env.easyQuestions;
const mediumQs = process.env.mediumQuestions;
const hardQs = process.env.hardQuestions;

const easyQuestions = easyQs.split(' -j- ');
const mediumQuestions = mediumQs.split(' -j- ');
const hardQuestions = hardQs.split(' -j- ');

/*function buildSuccessParams(evaluator, quiz) {
    const successparams = {
        content: evaluator + " requested the quiz questions!" + quiz,
    }

    return successparams
}

function buildFailureParams(evaluator, password) {
    const failureparams = {
        content: evaluator + " had the wrong password when requesting quiz questions!" + " (`" + password + "`)",
    }

    return failureparams
}
*/

function sendSuccessEmbed(evaluator, quiz) {
    /*fetch(webhook, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(buildSuccessParams(evaluator, quiz))
    }).then(res => {
        console.log("Sent success embed to Discord");
    })*/

    console.log(evaluator + " requested the quiz questions!" + quiz);
}

function sendFailureEmbed(evaluator, password) {
    /*fetch(webhook, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(buildFailureParams(evaluator, password))
    }).then(res => {
        console.log("Sent failure embed to Discord");
    })*/

    console.log(evaluator + " had the wrong password when requesting quiz questions!" + " (`" + password + "`)");
}

function chooseQuestions(difficulty) {
    var easyResult = [];
    var medResult = [];
    var hardResult = [];

    var ranNum = 1;

    if (difficulty == "Easy") {
        for (let i = 0; i < 2; i++) {
            ranNum = Math.floor(Math.random() * easyQuestions.length);
            easyResult.push(easyQuestions[ranNum]);
            easyQuestions.splice(ranNum, 1);
        }

        easyQuestions.push(easyResult[0]);
        easyQuestions.push(easyResult[1]);

        return easyResult;
    }

    if (difficulty == "Medium") {
        for (let i = 0; i < 4; i++) {
            ranNum = Math.floor(Math.random() * mediumQuestions.length);
            medResult.push(mediumQuestions[ranNum]);
            mediumQuestions.splice(ranNum, 1);
        }

        mediumQuestions.push(medResult[0]);
        mediumQuestions.push(medResult[1]);
        mediumQuestions.push(medResult[2]);
        mediumQuestions.push(medResult[3]);

        return medResult;
    }


    if (difficulty == "Hard") {
        for (let i = 0; i < 2; i++) {

            ranNum = Math.floor(Math.random() * hardQuestions.length);
            hardResult.push(hardQuestions[ranNum]);
            hardQuestions.splice(ranNum, 1);

        }

        hardQuestions.push(hardResult[0]);
        hardQuestions.push(hardResult[1]);

        return hardResult;
    }


}


app.use(express.json())

app.get('/quiz/:id/:evaluator', (request, response) => {
    const { id } = request.params;
    const { evaluator } = request.params;

    if (id != quizPassword) {
        response.status(401).send({ message: "Invalid password, try again!" })
        sendFailureEmbed(evaluator, id);
        return;
    }

    var toSendEasy = chooseQuestions("Easy")
    var toSendMed = chooseQuestions("Medium")
    var toSendHard = chooseQuestions("Hard")

    response.status(200).send({
        easy: toSendEasy,
        medium: toSendMed,
        hard: toSendHard
    })

    var loggingString = "\n\nSent the following quiz:\n" + "**Easy**: " + toSendEasy + "\n**Medium**: " + toSendMed + "\n**Hard**: " + toSendHard;

    sendSuccessEmbed(evaluator, loggingString);

});

app.get('/', (req, res) => res.send('TMS Quiz API!'));

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
