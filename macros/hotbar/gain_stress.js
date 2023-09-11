async function addStress(stressMod) {
	//get attribute to compare against
	curStress = game.user.character.system.other.stress.value;
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
  //create stress flavor text
  if (game.user.character.system.class.value === 'Android') {
    msgFlavor = `Power surges through your chest and you start to overheat.<br><br>`;
  } else {
    msgFlavor = `You feel tightness in your chest and start to sweat.<br><br>`;
  }
  //create chat variables
  if (stressDiff > 0 && saveImpact === 0) {
    msgOutcome = `Stress increased from <strong>${curStress}</strong> to <strong>${newStress}</strong>.`;
  } else if (stressDiff > 0 && saveImpact > 0) {
    msgOutcome = `You hit rock bottom. Stress increased from <strong>${curStress}</strong> to <strong>${newStress}</strong>. You must also <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else if (stressDiff === 0 && saveImpact > 0) {
    msgOutcome = `You feel a part of yourself drift away. <strong>Reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  }
  //create chat message
  macroResult = `
  <div class="mosh">
    <div class="rollcontainer">
      <div class="flexrow" style="margin-bottom: 5px;">
        <div class="rollweaponh1">STRESS GAINED</div>
        <div style="text-align: right"><img class="roll-image" src="modules/fvtt_mosh_1e_psg/icons/macros/gain_stress.png" /></div>
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
    msgFlavor = `Power surges through your chest and you start to overheat.<br><br>`;
  } else {
    msgFlavor = `You feel tightness in your chest and start to sweat.<br><br>`;
  }
  //create chat variables
  if (stressDiff > 0 && saveImpact === 0) {
    msgOutcome = `Stress increased from <strong>${curStress}</strong> to <strong>${newStress}</strong>.`;
  } else if (stressDiff > 0 && saveImpact > 0) {
    msgOutcome = `You hit rock bottom. Stress increased from <strong>${curStress}</strong> to <strong>${newStress}</strong>. You must also <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else if (stressDiff === 0 && saveImpact > 0) {
    msgOutcome = `You feel a part of yourself drift away. <strong>Reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  }
  //create chat message
  macroResult = `
  <div class="mosh">
    <div class="rollcontainer">
      <div class="flexrow" style="margin-bottom: 5px;">
        <div class="rollweaponh1">STRESS GAINED</div>
        <div style="text-align: right"><img class="roll-image" src="modules/fvtt_mosh_1e_psg/icons/macros/gain_stress.png" /></div>
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
title: `Gain Stress`,
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
  <div class="macro_img"><img src="modules/fvtt_mosh_1e_psg/icons/macros/gain_stress.png" style="border:none"/></div>
  <div class="macro_desc"><h3>Gain Stress</h3><strong>You gain 1 Stress every time you fail a Stat Check or Save.</strong> Occasionally, certain locations or entities can automatically give you Stress from interacting with or witnessing them. Your <strong>Minimum Stress starts at 2</strong>, and the <strong>Maximum Stress you can have is 20.</strong> Any Stress you take over 20 instead reduces the most relevant Stat or Save by that amount.</div>    
</div>
</div>

<h4>Select your modification:</h4>
`,
buttons: {
  button1: {
  label: `Gain 1 Stress`,
  callback: () => addStress(1),
  icon: `<i class="fas fa-angle-up"></i>`
  },
  button2: {
  label: `Gain 2 Stress`,
  callback: () => addStress(2),
  icon: `<i class="fas fa-angle-double-up"></i>`
  },
  button3: {
  label: `Gain 1d5 Stress`,
  callback: () => rollStress(`1d5`),
  icon: `<i class="fas fa-arrow-circle-up"></i>`
  }
}
},{width: 600,height: 265}).render(true);