makeDialog('sanity','1d100');

//main roll function
async function rollCheck(addSkill,addPoints,rollStat,rollString) {
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
  //assign to vars + replace 100s with 0s
  if (rollAdvDis === true) {
    //get values
    rollA1 = macroRoll.dice[0].results[0].result;
    rollB1 = macroRoll.dice[1].results[0].result;
    //replace 10s
    if (rollA1 === 100) {rollA1 = 0;}
    if (rollB1 === 100) {rollB1 = 0;}
  } else {
    //get values
    rollA1 = macroRoll.dice[0].results[0].result;
    //replace 10s
    if (rollA1 === 100) {rollA1= 0;}
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
  //get stress
  let curStress = game.user.character.system.other.stress.value;
  //define vars
  let statName = '';
  let msgHeader = '';
  let statValue = 0;
  //get the value for the chosen stat
  if (rollStat === `strength`) {
    statName = `Strength`
    msgHeader = rollStat + ` check`;
    statValue = game.user.character.system.stats.strength.value + game.user.character.system.stats.strength.mod;
  } else if (rollStat === `speed`) {
    statName = `Speed`
    msgHeader = rollStat + ` check`;
    statValue = game.user.character.system.stats.speed.value + game.user.character.system.stats.speed.mod;
  } else if (rollStat === `intellect`) {
    statName = `Intellect`
    msgHeader = rollStat + ` check`;
    statValue = game.user.character.system.stats.intellect.value + game.user.character.system.stats.intellect.mod;
  } else if (rollStat === `combat`) {
    statName = `Combat`
    msgHeader = rollStat + ` check`;
    statValue = game.user.character.system.stats.combat.value + game.user.character.system.stats.combat.mod;
  } else if (rollStat === `sanity`) {
    statName = `Sanity`
    msgHeader = rollStat + ` save`;
    statValue = game.user.character.system.stats.sanity.value + game.user.character.system.stats.sanity.mod;
  } else if (rollStat === `fear`) {
    statName = `Fear`
    msgHeader = rollStat + ` save`;
    statValue = game.user.character.system.stats.fear.value + game.user.character.system.stats.fear.mod;
  } else if (rollStat === `body`) {
    statName = `Body`
    msgHeader = rollStat + ` save`;
    statValue = game.user.character.system.stats.body.value + game.user.character.system.stats.body.mod;
  }
  //set addPoints to zero if null
  if(addPoints === undefined) {addPoints = 0}
  //set roll info
  let overUnder = `<i class="fas fa-angle-left"></i>`;
  let target = statValue + Number(addPoints);
  //prepare list of critical rolls
  let doubles = new Set([0, 11, 22, 33, 44, 55, 66, 77, 88, 99]);
  //define vars
  let critical = '';
  //check for crit
  if (doubles.has(finalRoll) === true) {
    critical = "CRITICAL ";
  } else {
    critical = "";
  }
  //define vars
  let outcome = '';
  let position = '';
  //set result variables
  if (finalRoll >= 90) {
    outcome = "FAILURE";
    position = 'higher';
  } else if (finalRoll < target) {
    outcome = "SUCCESS";
    position = 'lower';
  } else {
    outcome = "FAILURE";
    position = 'higher';
  }
  //define vars
  let stressMod = 0;
  //set stress mod
  if (outcome === "FAILURE") {
    stressMod = 1;
  } else {
    stressMod = 0;
  }
  //define vars
  let newStress = 0;
  let stressDiff = 0;
  let saveImpact = 0;
  //set new stress level
  if (curStress + stressMod > 20) {
    newStress = 20;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  } else if (curStress + stressMod < 2) {
    newStress = 2;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  } else {
    newStress = curStress + stressMod;
    stressDiff = newStress - curStress;
    saveImpact = stressMod - stressDiff;
  }
  //update characters stress level
  game.user.character.update({'system.other.stress.value': newStress});
  //define vars
  let msgFlavor = '';
  //create stress flavor text
  if (addPoints > 0) {
    msgFlavor = `
    <div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
      <strong>${critical}${outcome}!</strong>
    </div>
    You rolled ${position} than your <strong>${statName}</strong> plus <strong>${addSkill}</strong> skill bonus.<br>
    `;
  } else {
    msgFlavor = `
    <div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
      <strong>${critical}${outcome}!</strong>
    </div>
    You rolled ${position} than your <strong>${statName}</strong>.<br>
    `;
  }
  //define vars
  let msgOutcome = '';
  //create chat variables
  if (outcome === "SUCCESS") {
    msgOutcome = `You gain some confidence in your skills.`;    
  } else if (outcome === "FAILURE" && stressMod > 0 && newStress === 20 && stressDiff > 0) {
    msgOutcome = `You hit rock bottom. Stress increased from <strong>${curStress}</strong> to <strong>${newStress}</strong>. You must also <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else if (outcome === "FAILURE" && stressMod > 0 && newStress === 20 && stressDiff === 0) {
    msgOutcome = `You feel a part of yourself drift away. <strong>Reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else {
    msgOutcome = `Stress increased from <strong>${curStress}</strong> to <strong>${newStress}</strong>.`;
  }
  //define vars
  let results_critfail = '';
  //create message if crit fail
  if (critical === "CRITICAL " && outcome === "FAILURE") {
    results_critfail = `<br><br>@Macro[Panic Check]{Make a Panic Check}`;
  } else {
    results_critfail = ``;
  }
  //create chat message template
  let macroResult = `
  <div class="mosh">
    <div class="rollcontainer">
      <div class="flexrow" style="margin-bottom : 5px;">
        <div class="rollweaponh1">${msgHeader}</div>
        <div style="text-align: right"><img class="roll-image" src="modules/fvtt_mosh_1e_psg/icons/attributes/${rollStat}.png" /></div>
      </div>
      <div class="description" style="margin-bottom: 10px;">
      <div class="body">${msgFlavor}</div>
    </div>
    <div class="dice-roll" style="margin-bottom: 10px;">
      <div class="dice-result">
        <div class="dice-formula">${rollString} ${overUnder} ${target}</div>
        <h4 class="dice-total">${finalRoll}</h4>
      </div>
    </div>
    <div class="description" style="margin-bottom: 20px;">${msgOutcome}${results_critfail}</div>
    </div>
  </div>
  `;
  //make message ID
  let chatId = randomID();
  //make message
  let macroMsg = await macroRoll.toMessage({
    id: chatId,
    user: game.user._id,
    speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
    },
    content: macroResult
  },{keepId:true});
  //make dice
  await game.dice3d.waitFor3DAnimationByMessageID(chatId);
}

//create dialog
async function makeDialog(rollStat,rollString) {
  //get list of player skills
  const playerItems = game.user.character.items;
  //create header for skill list
  const skillHeader = `
  <style>
  .macro_window{
      background: rgb(230,230,230);
      border-radius: 9px;
  }
  .macro_img{
      display: flex;
      justify-content: center; //do I need this
  }
  .macro_desc{
      font-family: "Roboto", sans-serif;
      font-size: 10.5pt;
      font-weight: 400;
      padding-left: 8px;
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
      <div class="macro_desc"><h3>Add a Skill?</h3>If you have a Skill that is relevant to the task at hand, you can add the Skill’s bonus to your Stat or Save before making your roll <em>(giving you a higher number to roll under)</em>.</div>    
  </div>`;
  //create footer for skill list
  const skillFooter = `<h4>Select your roll type:</h4>`;
  //create template for skill row
  const skillRow = `
  <label for="[RADIO_ID]">
  <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
      <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
      <input type="radio" id="[RADIO_ID]" name="skill" value="[RADIO_VALUE]">
      <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="[RADIO_IMG]" style="border:none"/></div>
      <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
          [RADIO_DESC]
          </span>
      </div>    
      </div>
  </div>
  </label>`;
  //create skillList string
  let skillList = ``;
  //create skill counter
  let skillCount = 0;
  //create dialog pixel counter
  let dialogHeight = 192;
  //loop through and create skill rows
  for (let item of playerItems) {
      //check if this is a skill
      if (item.type === "skill") {
          //set temprow as template
          let tempRow = skillRow;
          //replace ID
          tempRow = tempRow.replaceAll("[RADIO_ID]",item.name);
          //replace value
          tempRow = tempRow.replace("[RADIO_VALUE]",item.system.bonus);
          //replace img
          tempRow = tempRow.replace("[RADIO_IMG]",item.img);
          //replace desc
          tempRow = tempRow.replace("[RADIO_DESC]",item.system.description.replace("<p>","<p><strong>"+item.name+":</strong> "));
          //add to skillList
          skillList = skillList + tempRow;
          //increment skill count
          skillCount++;
          //increment pixel counter
          dialogHeight = dialogHeight + 77;
      }
  } 
  //make content string
  const skillHtml = skillHeader + skillList + skillFooter;
  //make window setting
  dlgTitle = '';
  if (rollStat === 'sanity' || rollStat === 'fear' || rollStat === 'body') {
      dlgTitle = `Save`;
  } else {
      dlgTitle = `Stat Check`;
  }
  //Select the stat of the roll.
  new Dialog({
      title: dlgTitle,
      content: skillHtml,
      buttons: {
          button1: {
              label: `Next`,
              callback: (html) => rollCheck(html.find("input[name='skill']:checked").attr("id"),html.find("input[name='skill']:checked").attr("value"),rollStat,rollString),
              icon: `<i class="fas fa-chevron-circle-right"></i>`
          }
      }
  },{width: 600,height: dialogHeight}).render(true);
}