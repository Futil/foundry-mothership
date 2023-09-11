alterAttribute();

async function alterAttribute() {
    //get attribute to compare against
    curValue = game.user.character.system.health.max;
    minValue = game.user.character.system.health.min;
    maxValue = game.user.character.system.health.max;
    //set value to add
    msgHeader = 'MAXIMUM HEALTH LOST';
    msgImg = 'modules/fvtt_mosh_1e_psg/icons/attributes/health.png';
    //roll dice
    let macroRoll = await new Roll("-1d5").evaluate();
    //set stressmod
    valueMod = macroRoll.total;
    //set new value level
    if (curValue + valueMod <= minValue) {
        newValue = 0;
        msgOutcome = `<strong>You have died.</strong> Roll up a new character.`;
    } else {
        newValue = curValue + valueMod;
        msgOutcome = `Maximum Health decreased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
    }
    //update characters value level
    game.user.character.update({'system.health.max': newValue});
    //change current value if max is lower
    if (newValue < game.user.character.system.health.value) {
        game.user.character.update({'system.health.value': newValue});
    }
    //create value flavor text
    if (game.user.character.system.class.value === 'Android') {
        msgFlavor = `Your pain receptors indicate permanent damage.<br><br>`;
    } else {
        msgFlavor = `You scream out from immense pain.<br><br>`;
    }
    //create chat message
    macroResult = `
    <div class="mosh">
    <div class="rollcontainer">
        <div class="flexrow" style="margin-bottom: 5px;">
        <div class="rollweaponh1">${msgHeader}</div>
        <div style="text-align: right"><img class="roll-image" src="${msgImg}" /></div>
        </div>
        <div class="description"" style="margin-bottom: 20px;">
        <div class="body">
        ${msgFlavor} ${msgOutcome}
        </div>
        </div>
    </div>
    </div>
    `;
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