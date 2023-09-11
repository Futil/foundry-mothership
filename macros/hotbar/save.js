async function rollCheck(addSkill,addPoints,rollSave,rollString) {
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
  curStress = game.user.character.system.other.stress.value;
  //get the value for the chosen stat
  if (rollSave === `sanity`) {
    saveName = `Sanity`
    msgHeader = rollSave + ` save`;
    saveValue = game.user.character.system.stats.sanity.value + game.user.character.system.stats.sanity.mod;
  } else if (rollSave === `fear`) {
    saveName = `Fear Save`
    msgHeader = rollSave + ` save`;
    saveValue = game.user.character.system.stats.fear.value + game.user.character.system.stats.fear.mod;
  } else if (rollSave === `body`) {
    saveName = `Body`
    msgHeader = rollSave + ` save`;
    saveValue = game.user.character.system.stats.body.value + game.user.character.system.stats.body.mod;
  }
  //set addPoints to zero if null
  if(addPoints === undefined) {addPoints = 0}
  //set roll info
  overUnder = `<i class="fas fa-angle-left"></i>`;
  target = saveValue + Number(addPoints);
  //prepare list of critical rolls
  doubles = new Set([0, 11, 22, 33, 44, 55, 66, 77, 88, 99]);
  //check for crit
  if (doubles.has(finalRoll) === true) {
    critical = "CRITICAL ";
  } else {
    critical = "";
  }
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
  //set stress mod
  if (outcome === "FAILURE") {
    stressMod = 1;
  } else {
    stressMod = 0;
  }
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
  //create stress flavor text
  if (addPoints > 0) {
    msgFlavor = `
    <div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
      <strong>${critical}${outcome}!</strong>
    </div>
    You rolled ${position} than your <strong>${saveName}</strong> plus <strong>${addSkill}</strong> skill bonus.<br>
    `;
  } else {
    msgFlavor = `
    <div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
      <strong>${critical}${outcome}!</strong>
    </div>
    You rolled ${position} than your <strong>${saveName}</strong>.<br>
    `;
  }
  //create chat variables
  if (outcome === "SUCCESS") {
    msgOutcome = `You gain some confidence in your skills.`;    
  } else if (outcome === "FAILURE" && stressMod > 0 && curStress < 20 && newStress === 20 && saveImpact > 0) {
    msgOutcome = `You hit rock bottom. Stress increased from <strong>${curStress}</strong> to <strong>${newStress}</strong>. You must also <strong>reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else if (outcome === "FAILURE" && stressMod > 0 && curStress === 20 && newStress === 20 && saveImpact > 0) {
    msgOutcome = `You feel a part of yourself drift away. <strong>Reduce the most relevant Stat or Save by ${saveImpact}</strong>.`;
  } else {
    msgOutcome = `Stress increased from <strong>${curStress}</strong> to <strong>${newStress}</strong>.`;
  }
  //create message if crit fail
  if (critical === "CRITICAL " && outcome === "FAILURE") {
    results_critfail = `<br><br>@Macro[Panic Check]{Make a Panic Check}`;
  } else {
    results_critfail = ``;
  }
  //create chat message template
  macroResult = `
  <div class="mosh">
    <div class="rollcontainer">
      <div class="flexrow" style="margin-bottom : 5px;">
        <div class="rollweaponh1">${msgHeader}</div>
        <div style="text-align: right"><img class="roll-image" src="modules/fvtt_mosh_1e_psg/icons/attributes/${rollSave}.png" /></div>
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
  
function addSkill(rollSave) {
  //get list of player skills
  playerItems = game.user.character.items;
  //create header for skill list
  skillHeader = `
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
  skillFooter = `<h4>Select your roll type:</h4>`;
  //create template for skill row
  skillRow = `
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
  skillList = ``;
  //create skill counter
  skillCount = 0;
  //create dialog pixel counter
  dialogHeight = 192;
  //loop through and create skill rows
  for (item of playerItems) {
    //check if this is a skill
    if (item.type === "skill") {
      //set temprow as template
      tempRow = skillRow;
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
  skillHtml = skillHeader + skillList + skillFooter;
  //bring up new dialog asking about adding skills
  new Dialog({
    title: `Stat Check`,
    content: skillHtml,
    buttons: {
      button1: {
        label: `Advantage`,
        callback: (html) => rollCheck(html.find("input[name='skill']:checked").attr("id"),html.find("input[name='skill']:checked").attr("value"),rollSave,`1d100 [+]`),
        icon: `<i class="fas fa-angle-double-up"></i>`
      },
      button2: {
        label: `Normal`,
        callback: (html) => rollCheck(html.find("input[name='skill']:checked").attr("id"),html.find("input[name='skill']:checked").attr("value"),rollSave,`1d100`),
        icon: `<i class="fas fa-minus"></i>`
      },
      button3: {
        label: `Disadvantage`,
        callback: (html) => rollCheck(html.find("input[name='skill']:checked").attr("id"),html.find("input[name='skill']:checked").attr("value"),rollSave,`1d100 [-]`),
        icon: `<i class="fas fa-angle-double-down"></i>`
      }
    }
  },{width: 600,height: dialogHeight}).render(true);
}

new Dialog({
  title: `Save`,
  content: `
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
      <div class="macro_img"><img src="modules/fvtt_mosh_1e_psg/icons/macros/save.png" style="border:none"/></div>
      <div class="macro_desc"><h3>Save</h3>You have three Saves which represent your ability to withstand different kinds of trauma. In order to avoid certain dangers, you sometimes need to roll a Save. <strong>If you roll less than your Save you succeed. Otherwise you fail, and gain 1 Stress.</strong> A roll of 90-99 is always a failure. A Critical Failure means something bad happens, and furthermore you must make a Panic Check.</div>    
    </div>
  </div>
  <label for="san">
    <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
      <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="san" name="save" value="sanity" checked="checked">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/attributes/sanity.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Sanity:</strong> Rationalize logical inconsistencies in the universe, make sense out of chaos, detect illusions and mimicry, cope with Stress.
          </span>
        </div>    
      </div>
    </div>
  </label>
  <label for="fer">
    <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
      <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="fer" name="save" value="fear">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/attributes/fear.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Fear:</strong> Maintain a level head while struggling with fear, loneliness, depression, and other emotional surges.
          </span>
        </div>    
      </div>
    </div>
  </label>
  <label for="bod">
    <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
      <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="bod" name="save" value="body">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/attributes/body.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Body:</strong> Employ quick reflexes and resist hunger, disease, or organisms that might try and invade your insides.
          </span>
        </div>
      </div>
    </div>
  </label>
  `,
  buttons: {
    button1: {
      label: `Next`,
      callback: (html) => addSkill(html.find("input[name='save']:checked").val()),
      icon: `<i class="fas fa-chevron-circle-right"></i>`
    }
  }
},{width: 600,height: 470}).render(true);