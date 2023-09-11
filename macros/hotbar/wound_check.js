async function rollCheck(rollTable,rollString) {
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
  //assign to vars + replace 10s with 0s
  if (rollAdvDis === true) {
    //get values
    rollA1 = macroRoll.dice[0].results[0].result;
    rollB1 = macroRoll.dice[1].results[0].result;
    //replace 10s
    if (rollA1 === 10) {rollA1 = 0;}
    if (rollB1 === 10) {rollB1 = 0;}
  } else {
    //get values
    rollA1 = macroRoll.dice[0].results[0].result;
    //replace 10s
    if (rollA1 === 10) {rollA1= 0;}
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
  //get table result
  tableResult = game.tables.getName(rollTable).getResultsForRoll(finalRoll);
  //create chat message template
  macroResult = `
  <div class="mosh">
    <div class="rollcontainer">
      <div class="flexrow" style="margin-bottom : 5px;">
        <div class="rollweaponh1">${tableResult[0].parent.name}</div>
        <div style="text-align: right"><img class="roll-image" src="${tableResult[0].img}" title="${tableResult[0].parent.name}" /></div>
      </div>
      <div class="description" style="margin-bottom : 20px;">${tableResult[0].text}</div>
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
  title: `Wound Check`,
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
    <div class="macro_img"><img src="modules/fvtt_mosh_1e_psg/icons/macros/wound_check.png" style="border:none"/></div>
    <div class="macro_desc"><h3>Wound Check</h3>Make a <strong>Wound Check</strong> according to the type of Damage received. Flesh Wounds are small inconveniences. Both Minor and Major Injuries cause lasting Damage that requires treatment. Lethal Injuries can kill you if not dealt with immediately. And Fatal Injuries can potentially kill you outright. Additionally, some Wounds cause Bleeding, which if not stopped can quickly overwhelm you.</div>    
  </div>
</div>
<label for="bf">
  <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
    <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
      <input type="radio" id="bf" name="wound_table" value="Blunt Force Wound" checked="checked">
      <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/rolltables/wounds_blunt_force.png" style="border:none"/></div>
      <div class="macro_desc" style="display: table;">
        <span style="display: table-cell; vertical-align: middle;">
          <strong>Blunt Force:</strong> Getting punched, hit with a crowbar or a thrown object, falling, etc.
        </span>
      </div>
    </div>
  </div>
</label>
<label for="b">
<div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
  <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
    <input type="radio" id="b" name="wound_table" value="Bleeding Wound">
    <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/rolltables/wounds_bleeding.png" style="border:none"/></div>
    <div class="macro_desc" style="display: table;">
      <span style="display: table-cell; vertical-align: middle;">
        <strong>Bleeding:</strong> Getting stabbed or cut.
      </span>
    </div>
  </div>
</div>
</label>
<label for="g">
<div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
  <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
    <input type="radio" id="g" name="wound_table" value="Gunshot Wound">
    <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/rolltables/wounds_gunshot.png" style="border:none"/></div>
    <div class="macro_desc" style="display: table;">
      <span style="display: table-cell; vertical-align: middle;">
        <strong>Gunshot:</strong> Getting shot by a firearm.
      </span>
    </div>
  </div>
</div>
</label>
<label for="fe">
<div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
  <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
    <input type="radio" id="fe" name="wound_table" value="Fire & Explosives Wound">
    <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/rolltables/wounds_fire_&_explosives.png" style="border:none"/></div>
    <div class="macro_desc" style="display: table;">
      <span style="display: table-cell; vertical-align: middle;">
        <strong>Fire & Explosives:</strong> Grenades, flamethrowers, doused in fuel and lit on fire, etc.
      </span>
    </div>
  </div>
</div>
</label>
<label for="gm">
<div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
  <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
    <input type="radio" id="gm" name="wound_table" value="Gore & Massive Wound">
    <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="modules/fvtt_mosh_1e_psg/icons/rolltables/wounds_gore_&_massive.png" style="border:none"/></div>
    <div class="macro_desc" style="display: table;">
      <span style="display: table-cell; vertical-align: middle;">
        <strong>Gore & Massive:</strong> Damage from giant creatures or particularly gruesome foes.
      </span>
    </div>
  </div>
</div>
</label>

<h4>Select your roll type:</h4>
`,
  buttons: {
    button1: {
      label: `Advantage`,
      callback: (html) => rollCheck(html.find("input[name='wound_table']:checked").val(),`1d10 [+]`),
      icon: `<i class="fas fa-angle-double-up"></i>`
    },
    button2: {
      label: `Normal`,
      callback: (html) => rollCheck(html.find("input[name='wound_table']:checked").val(),`1d10`),
      icon: `<i class="fas fa-minus"></i>`
    },
    button3: {
      label: `Disadvantage`,
      callback: (html) => rollCheck(html.find("input[name='wound_table']:checked").val(),`1d10 [-]`),
      icon: `<i class="fas fa-angle-double-down"></i>`
    }
  }
},{width: 600,height: 650}).render(true);