minusAll();

async function minusAll() {
    //get attribute to compare against
    strValue = game.user.character.system.stats.strength.value;
    spdValue = game.user.character.system.stats.speed.value;
    intValue = game.user.character.system.stats.intellect.value;
    comValue = game.user.character.system.stats.combat.value;
    sanValue = game.user.character.system.stats.sanity.value;
    ferValue = game.user.character.system.stats.fear.value;
    bodValue = game.user.character.system.stats.body.value;
    strMod = game.user.character.system.stats.strength.mod;
    spdMod = game.user.character.system.stats.speed.mod;
    intMod = game.user.character.system.stats.intellect.mod;
    comMod = game.user.character.system.stats.combat.mod;
    sanMod = game.user.character.system.stats.sanity.mod;
    ferMod = game.user.character.system.stats.fear.mod;
    bodMod = game.user.character.system.stats.body.mod;
    //reset to zero if < 0
    if (strValue + strMod - 1 >= 0) {strMod = strMod - 1};
    if (spdValue + spdMod - 1 >= 0) {spdMod = spdMod - 1};
    if (intValue + intMod - 1 >= 0) {intMod = intMod - 1};
    if (comValue + comMod - 1 >= 0) {comMod = comMod - 1};
    if (sanValue + sanMod - 1 >= 0) {sanMod = sanMod - 1};
    if (ferValue + ferMod - 1 >= 0) {ferMod = ferMod - 1};
    if (bodValue + bodMod - 1 >= 0) {bodMod = bodMod - 1};
    //set message header
    msgHeader = 'DNA INTEGRITY LOST';
    msgImg = 'modules/fvtt_mosh_1e_psg/icons/attributes/health.png';
    //create value flavor text
    if (game.user.character.system.class.value === 'Android') {
        msgFlavor = `Catastro▒ic d⟑ta ▓loss de|/~ ⋥⋱<br><br>`;
    } else {
        msgFlavor = `You stare into blackness and feel completely unable to pull yourself out of it.<br><br>`;
    }
    //create chat variables
    msgOutcome = `All stats and saves decreased by <strong>1</strong>.`;
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
    game.user.character.update({'system.stats.strength.mod': strMod});
    game.user.character.update({'system.stats.speed.mod': spdMod});
    game.user.character.update({'system.stats.intellect.mod': intMod});
    game.user.character.update({'system.stats.combat.mod': comMod});
    game.user.character.update({'system.stats.sanity.mod': sanMod});
    game.user.character.update({'system.stats.fear.mod': ferMod});
    game.user.character.update({'system.stats.body.mod': bodMod});
}