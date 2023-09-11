alterAttribute();

async function alterAttribute() {
    //get attribute to compare against
    curValue = game.user.character.system.health.value;
    minValue = game.user.character.system.health.min;
    maxValue = game.user.character.system.health.max;
    curWounds = game.user.character.system.hits.value;
    maxWounds = game.user.character.system.hits.max;
    //set value to add
    msgHeader = 'HEALTH LOST';
    msgImg = 'modules/fvtt_mosh_1e_psg/icons/attributes/health.png';
    valueMod = -1;
    //set new value level
    if (curValue + valueMod <= minValue) {
        newValue = maxValue + (curValue + valueMod);
        newWounds = curWounds + 1;
        if (newWounds > maxWounds) {
            newValue = minValue;
            msgOutcome = `You are at death's door.<br><br>@Macro[Death Save]{Make a Death Save}`;
        } else {
            msgOutcome = `Health decreased by ${valueMod} points. You gain a wound and now have ${newValue} Health.<br><br>@Macro[Wound Check]{Make a Wound Check}`;
        }
    } else {
        newValue = curValue + valueMod;
        newWounds = curWounds;
        msgOutcome = `Health decreased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
    }
    //create value flavor text
    if (game.user.character.system.class.value === 'Android') {
        msgFlavor = `Your pain receptors indicate core damage.<br><br>`;
    } else {
        msgFlavor = `You wince from the pain.<br><br>`;
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
    //get speaker character
    activeCharacter = canvas.scene.data.tokens.find(token => token.name = game.user.character.name);
    //push chat message
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({token: activeCharacter}),
        content: macroResult
    });
    //update characters value level
    game.user.character.update({'system.health.value': newValue});
    game.user.character.update({'system.hits.value': newWounds});
}