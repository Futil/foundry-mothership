addCondition("Cowardice",1);

async function addCondition(conditionName,sevIncrease) {
    //detect whether player has condition yet + proceed accordingly
    if (game.user.character.items.getName(conditionName) != undefined) {
        //get old severity
        oldValue = game.user.character.items.getName(conditionName).system.severity;
        newValue = game.user.character.items.getName(conditionName).system.severity + sevIncrease;
        //increase severity of the condition
        game.user.character.items.getName(conditionName).update({'system.severity': newValue});
        //create message text
        msgFlavor = `Your condition worsens. Severity has increased from <strong>` + oldValue + `</strong> to <strong>` + newValue + `</strong>.`;
    } else {
        //give the character the condition
        const itemData = game.items.getName(conditionName).toObject();
        await game.user.character.createEmbeddedDocuments("Item", [itemData]);
        //set severity of the condition
        game.user.character.items.getName(conditionName).update({'system.severity': sevIncrease});
        //create message text
        msgFlavor = `You now suffer from this condition, with a severity of <strong>` + sevIncrease + `</strong>.`;
    }
    //get image url
    msgImg = game.user.character.items.getName(conditionName).img;
    //create chat message
    macroResult = `
    <div class="mosh">
        <div class="rollcontainer">
            <div class="flexrow" style="margin-bottom: 5px;">
                <div class="rollweaponh1">${conditionName}</div>
                <div style="text-align: right"><img class="roll-image" src="${msgImg}" /></div>
            </div>
            <div class="description"" style="margin-bottom: 20px;">
                <div class="body">${msgFlavor}</div>
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
}