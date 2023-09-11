woundCheck('Gore & Massive Wound','1d10');

async function woundCheck(rollTable,rollString) {
    //init vars
    rollAdvDis = rollString.includes("[");
    //translate rollString into foundry roll string format
    if (rollAdvDis === true) {
    //extract dice needed
    rollDice = rollString.substr(0,rollString.indexOf("[")).concat(',',rollString.substr(0,rollString.indexOf("[")));
    //make adv/dis template
    rollTemplate = '{[diceSet]}';
    //make foundry roll string
    rollStringParsed = rollTemplate.replace("[diceSet]",rollDice);
    } else {
    rollStringParsed = rollString;
    }
    //roll dice
    let macroRoll = await new Roll(rollStringParsed).evaluate();
    //assign to vars + replace 10s with 0s
    if (rollAdvDis === true) {
    //get values
    rollA1 = macroRoll.dice[0].results[0].result;
    rollB1 = macroRoll.dice[1].results[0].result;
    //replace 10s
    if (rollA1 === 10) {rollA1 = 0;}
    if (rollB1 === 10) {rollB1 = 0;}
    } else {
    //get values
    rollA1 = macroRoll.dice[0].results[0].result;
    //replace 10s
    if (rollA1 === 10) {rollA1= 0;}
    }
    //choose best value based on Adv/Dis
    if (rollAdvDis === true) {
    if (rollString.includes("[+]") === true) {
        if(rollA1 < rollB1) { 
        finalRoll = rollA1;
        } else {
        finalRoll = rollB1;
        }
    } else if (rollString.includes("[-]") === true) {
        if(rollA1 > rollB1) { 
        finalRoll = rollA1;
        } else {
        finalRoll = rollB1;
        }
    }
    } else {
    finalRoll = rollA1;
    }
    //get table result
    tableResult = game.tables.getName(rollTable).getResultsForRoll(finalRoll);
    //create chat message template
    macroResult = `
    <div class="mosh">
    <div class="rollcontainer">
        <div class="flexrow" style="margin-bottom : 5px;">
        <div class="rollweaponh1">${tableResult[0].parent.name}</div>
        <div style="text-align: right"><img class="roll-image" src="${tableResult[0].img}" title="${tableResult[0].parent.name}" /></div>
        </div>
        <div class="description" style="margin-bottom : 20px;">${tableResult[0].text}</div>
    </div>
    </div>
    `;
    //make message ID
    chatId = randomID();
    //get speaker character
    activeCharacter = canvas.scene.data.tokens.find(token => token.name = game.user.character.name);
    //make message
    macroMsg = await macroRoll.toMessage({
    id: chatId,
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({token: activeCharacter}),
    content: macroResult
    },{keepId:true});
    //make dice
    await game.dice3d.waitFor3DAnimationByMessageID(chatId);
}