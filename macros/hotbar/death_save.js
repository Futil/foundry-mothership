async function rollCheck(rollString) {
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
      if(rollA1 > rollB1) { 
        finalRoll = rollA1;
      } else {
        finalRoll = rollB1;
      }
    } else if (rollString.includes("[-]") === true) {
      if(rollA1 < rollB1) { 
        finalRoll = rollA1;
      } else {
        finalRoll = rollB1;
      }
    }
  } else {
    finalRoll = rollA1;
  }
  //get table result
  tableResult = game.tables.getName("Death Save").getResultsForRoll(finalRoll);
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
  title: `Death Save`,
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
    <div class="macro_img"><img src="modules/fvtt_mosh_1e_psg/icons/rolltables/death_save.png" style="border:none"/></div>
    <div class="macro_desc"><h3>Death Save</h3>Whenever you would die, the Warden makes a <strong>Death Save</strong> for you. As soon as someone spends a turn checking your vitals, the result is revealed. If your character’s death is imminent, make your last moments count: save someone’s life, solve an important mystery, or give the others time to escape. Enjoy the carnage, then jump back in for more!</div>    
  </div>
</div>

<h4>Select your roll type:</h4>
`,
  buttons: {
    button1: {
      label: `Advantage`,
      callback: () => rollCheck(`1d10 [+]`),
      icon: `<i class="fas fa-angle-double-up"></i>`
    },
    button2: {
      label: `Normal`,
      callback: () => rollCheck(`1d10`),
      icon: `<i class="fas fa-minus"></i>`
    },
    button3: {
      label: `Disadvantage`,
      callback: () => rollCheck(`1d10 [-]`),
      icon: `<i class="fas fa-angle-double-down"></i>`
    }
  }
},{width: 600,height: 265}).render(true);