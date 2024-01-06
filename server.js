const express = require('express');
const app = express();
const port = 5000;

const quizPassword = "Agreed2_Abrasion_Preppy_Display";

const easyQs = "What is the melee weapon of the Trooper loadout?  -j- Are you allowed to use glitches while on-duty for TMS? -j- Should you wear a PBST uniform while on-duty for TMS?  -j- Are TMS uniforms required to be worn at raids? -j- Are you allowed to save the core while on-duty for TMS? -j- How many core cooling fans are there?  -j- How many core laser buttons are there? -j- Are TMS members allowed to drain the radiation leak when the temperature is 1500?  -j- While on-duty for TMS, do you kill Security on sight? -j- Can you use TMS weapons while not on-duty for TMS?  -j- At what temperature does the core begin meltdown  at?  -j- At what temperature does the core begin freezedown at?  -j- Other than meltdown and freezedown, what is one other raid objective TMS does? -j- Are you allowed to attack a PBST member who is going to  get their loadout? -j- While on-duty for TMS, are you allowed to kill other syndicates? -j-  Should you attack a member in spawn? -j-  While you are on-duty as TMS, should you explode a nuke train near the TMS Hideout?  -j- Spamming one of the reactor power buttons ends up doing what?  -j- How do you set your ranktag to TMS?  -j- How do you turn off your ranktag? -j- Should you attack members in the PET/Medical room? -j- What temperature makes the PET Hazmat suit required to be worn in the core?";
const mediumQs = "How can you empty the coolant supply? -j-  What is the process of not letting people escape via rockets called?  -j- Who are allowed to host official marked raids? -j-  What is the best core + AC/coolant setup for meltdown? -j-  What is the best core setup for freezedown?  -j-  What has the larger effect on the core, 5 fans online or coolant online and connected?  -j-  What hat, other than the suits provided at PBCC, can be used as a suit to enter the core?  -j-  Name one of the places TMS goes to for dismissal  after an official marked raid.  -j-  Where is the TMS area located at PBCC?  -j- Please tell me where the two core entrances are located. -j-  Where is E-Coolant located at PBCC? Give a general location. -j- Please tell me the 2 different entrances to the server room next to E-Coolant.  -j-  What is the code to the E-Coolant door?  -j- How do you sabotage the coolant pipe? -j- Other than a Katana and Upgraded Guns, what special/unique item do Inquisitors get in their loadouts? -j-  What is one of the disasters that is beneficial towards a MELTDOWN and why?  -j- What is a disaster that is beneficial towards a FREEZEDOWN and why? -j- How can you refill the coolant tank supply WITHOUT using the Coolant Production? -j- What is the lowest rank that can give permission to restrict rooms and put users on KOS? -j- What's the automatic post-raid objective once a meltdown/freezedown occurs? -j- What is the E-Coolant success rate if all three tanks filled to the proper level (69%-81%)? -j- How do you explode a nuke train? -j-  What is the main objective of a Yes-Survivor Run?  -j- While all lasers are on and the reactor power is set to 4, can the coolant and all fans online together lower the temperature of the core? -j- Name 2 events at PBCC, NOT including meltdown and freezedown. -j- What rank is allowed to organize a mega raid? -j- What occurs in Reactor Power while it is locked? -j- How does a laser lock? -j- What signifies a locked laser?";
const hardQs = "What would you do if you see an on duty TMS insulting other members? -j-  What would you do if you see someone that you know is not a moderator flying around the map? -j- What would you do if you see a TMS ranked member using their tools to spawnkill? -j- You glitch through the map into an advantageous spot where you can shoot PBST without them seeing you, what should you do? -j- During a meltdown, a recruit declares an unofficial NSR, and starts killing neutrals at the rocket silos, what should you do?";

const easyQuestions = easyQs.split(' -j- ');
const mediumQuestions = mediumQs.split(' -j- ');
const hardQuestions = hardQs.split(' -j- ');

const webhook = "https://discord.com/api/webhooks/993003152221683742/IgSNqVnKgG-AqVICbo5jpt_-jcA7m9vyl2GUXFF3RpP8F-it9icnqrO8_BNsjb40Eo1J";

function buildSuccessParams(evaluator, quiz) {
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

function sendSuccessEmbed(evaluator, quiz) {
    fetch(webhook, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(buildSuccessParams(evaluator, quiz))
    }).then(res => {
        console.log("Sent success embed to Discord");
    })
}

function sendFailureEmbed(evaluator, password) {
    fetch(webhook, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(buildFailureParams(evaluator, password))
    }).then(res => {
        console.log("Sent failure embed to Discord");
    })
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
