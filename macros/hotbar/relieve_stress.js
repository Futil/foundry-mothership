async function relieveStress(stressMod) {
	//get attribute to compare against
	curStress = game.user.character.system.other.stress.value;
  //set new stress level
  if (curStress + stressMod < 2) {
    newStress = 2;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  } else {
    newStress = curStress + stressMod;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  }
  //create stress flavor text
  if (game.user.character.system.class.value === 'Android') {
    msgFlavor = `You soft-reset, purging unnecessary background processes.<br><br>`;
  } else {
    msgFlavor = `You feel a sense of calm wash over you.<br><br>`;
  }
  //create chat variables
  if (stressMod < 0 && newStress === 2 && stressDiff === 0) {
    msgOutcome = `You are already as calm as possible.`;
  } else {
    msgOutcome = `Stress decreased from <strong>${curStress}</strong> to <strong>${newStress}</strong>.`;
  }
  //create chat message
  macroResult = `
  <div class="mosh">
    <div class="rollcontainer">
      <div class="flexrow" style="margin-bottom: 5px;">
        <div class="rollweaponh1">STRESS RELIEVED</div>
        <div style="text-align: right"><img class="roll-image" src="modules/fvtt_mosh_1e_psg/icons/macros/relieve_stress.png" /></div>
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
  //update characters stress level
  game.user.character.update({'system.other.stress.value': newStress});
}

async function rollStress(rollString) {
	//translate rollString into foundry roll string format
	if (rollString.includes("[") === true) {
	  //extract dice needed
	  rollDice = rollString.substr(0,rollString.indexOf("[")).concat(',',rollString.substr(0,rollString.indexOf("[")));
	  //make adv/dis template
	  rollAdv = '{[diceSet]}kl';
	  rollDis = '{[diceSet]}kh';
	  //make foundry roll string
	  if (rollString.includes("[+]") === true) {
		rollStringParsed = rollAdv.replace("[diceSet]",rollDice);
	  } else if (rollString.includes("[-]") === true) {
		rollStringParsed = rollDis.replace("[diceSet]",rollDice);
	  }
	} else {
	  rollStringParsed = rollString;
	}
	//get attribute to compare against
	curStress = game.user.character.system.other.stress.value;
  //roll dice
  let macroRoll = await new Roll(rollStringParsed).evaluate();
  //set stressmod
  stressMod = macroRoll.total;
  //set new stress level
  if (curStress + stressMod > 20) {
    newStress = 20;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  } else {
    newStress = curStress + stressMod;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  }
  //update characters stress level
  game.user.character.update({'system.other.stress.value': newStress});
  //create stress flavor text
  if (game.user.character.system.class.value === 'Android') {
    msgFlavor = `You soft-reset, purging unnecessary background processes.<br><br>`;
  } else {
    msgFlavor = `You feel a sense of calm wash over you.<br><br>`;
  }
  //create chat variables
  if (stressMod < 0 && newStress === 2 && stressDiff === 0) {
    msgOutcome = `You are already as calm as possible.`;
  } else {
    msgOutcome = `Stress decreased from <strong>${curStress}</strong> to <strong>${newStress}</strong>.`;
  }
  //create chat message
  macroResult = `
  <div class="mosh">
    <div class="rollcontainer">
      <div class="flexrow" style="margin-bottom: 5px;">
        <div class="rollweaponh1">STRESS RELIEVED</div>
        <div style="text-align: right"><img class="roll-image" src="modules/fvtt_mosh_1e_psg/icons/macros/relieve_stress.png" /></div>
      </div>
      <div class="description"" style="margin-bottom: 20px;">
        <div class="body">
        ${msgFlavor} ${msgOutcome}
        </div>
      </div>
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

new Dialog({
title: `Relieve Stress`,
content: `
<style>
.macro_window{
  background: rgb(230,230,230);
  border-radius: 9px;
}
.macro_img{
  display: flex;
  justify-content: center;
}
.macro_desc{
  font-family: "Roboto", sans-serif;
  font-size: 10.5pt;
  font-weight: 400;
  padding-top: 8px;
  padding-right: 8px;
  padding-bottom: 8px;
}
.grid-2col {
  display: grid;
  grid-column: span 2 / span 2;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px;
  padding: 0;
}
</style>

<div class ="macro_window" style="margin-bottom : 7px;">
<div class="grid grid-2col" style="grid-template-columns: 150px auto">
  <div class="macro_img"><img src="modules/fvtt_mosh_1e_psg/icons/macros/relieve_stress.png" style="border:none"/></div>
  <div class="macro_desc"><h3>Relieve Stress</h3>Occasionally, certain moments, places, or events can automatically <strong>relieve your stress.</strong> Escaping perilous situations, finding a serene location, or experiencing a touching moment with a loved one can have meaningful impacts on your mood and outlook on life. If your stress is getting close to 20, you should consider making a <strong>Rest Save</strong> - as the effects of a failed <strong>Panic Check</strong> can be devastating.</div>    
</div>
</div>

<h4>Select your modification:</h4>
`,
buttons: {
  button1: {
  label: `Relieve 1 Stress`,
  callback: () => relieveStress(-1),
  icon: `<i class="fas fa-angle-down"></i>`
  },
  button2: {
  label: `Relieve 2 Stress`,
  callback: () => relieveStress(-2),
  icon: `<i class="fas fa-angle-double-down"></i>`
  },
  button3: {
  label: `Relieve 1d5 Stress`,
  callback: () => rollStress(`-1d5`),
  icon: `<i class="fas fa-arrow-circle-down"></i>`
  }
}
},{width: 600,height: 265}).render(true);