alterAttribute();

async function alterAttribute() {
    //get attribute to compare against
    curValue = game.user.character.system.hits.max;
    minValue = 0;
    maxValue = game.user.character.system.hits.max;
    //set value to add
    msgHeader = 'MAXIMUM HEALTH LOST';
    msgImg = 'modules/fvtt_mosh_1e_psg/icons/macros/wound_check.png';
    valueMod = -1;
    //set new value level
    if (curValue + valueMod <= minValue) {
        newValue = curValue + valueMod;
        msgOutcome = `<strong>You have died.</strong> Roll up a new character.`;
    } else {
        newValue = curValue + valueMod;
        msgOutcome = `Maximum Wounds decreased from <strong>${curValue}</strong> to <strong>${newValue}</strong>.`;
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
    //get speaker character
    activeCharacter = canvas.scene.data.tokens.find(token => token.name = game.user.character.name);
    //push chat message
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({token: activeCharacter}),
        content: macroResult
    });
    //update characters value level
    game.user.character.update({'system.hits.max': newValue});
}