alterAttribute();

async function alterAttribute() {
    //get attribute to compare against
    curValue = game.user.character.system.health.value;
    minValue = game.user.character.system.health.min;
    maxValue = game.user.character.system.health.max;
    curWounds = game.user.character.system.hits.value;
    maxWounds = game.user.character.system.hits.max;
    //roll dice
    let macroRoll = await new Roll("1d10").evaluate();
    //turn 10 to 0
    if (macroRoll.total === 10) {macroRoll.total = 0}
    //set stressmod
    valueMod = macroRoll.total;
    //set value to add
    msgHeader = 'HEALTH GAINED';
    msgImg = 'modules/fvtt_mosh_1e_psg/icons/attributes/health.png';
    //set new value level
    if (curValue + valueMod > maxValue) {
        newValue = maxValue;
        valueDiff = newValue - curValue;
        actorImpact = valueMod - valueDiff;
        newWounds = curWounds;
    } else if (curValue + valueMod < minValue) {
        newValue = minValue;
        valueDiff = newValue - curValue;
        actorImpact = valueMod - valueDiff;
    } else {
        newValue = curValue + valueMod;
        valueDiff = newValue - curValue;
        actorImpact = valueMod - valueDiff;
        newWounds = curWounds;
    }
    //update characters value level
    game.user.character.update({'system.health.value': newValue});
    game.user.character.update({'system.hits.value': newWounds});
    //create value flavor text
    if (game.user.character.system.class.value === 'Android') {
        msgFlavor = `System resources free up and you feel energized.<br><br>`;
    } else {
        msgFlavor = `You feel a burst of energy.<br><br>`;
    }
    //create chat variables
    if (valueMod > 0 && newValue === maxValue && valueDiff === 0) {
        msgOutcome = `You are already at full health.`;
    } else if (valueMod > 0 && valueDiff > 0) {
        msgOutcome = `Health increased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
    } else if (valueMod < 0 && valueDiff < 0) {
        msgOutcome = `Health decreased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
    } else if (valueMod < 0 && valueDiff < 0 && newValue <= minValue) {
        woundImpact = 1;
        newWounds = curWounds + 1;
        newValue = maxValue+actorImpact;
        msgOutcome = `Health decreased by ${valueMod} points. You gain a wound and now have ${newValue} Health.<br><br>@Macro[Wound Check]{Make a Wound Check}`;
    } else if (valueMod < 0 && valueDiff < 0 && newValue <= minValue  && curWounds === maxWounds) {
        woundImpact = 0;
        newWounds = curWounds;
        msgOutcome = `You are at death's door.<br><br>@Macro[Death Save]{Make a Death Save}`;
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