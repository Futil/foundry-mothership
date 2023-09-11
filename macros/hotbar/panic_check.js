async function rollCheck(rollString) {
	//translate rollString into foundry roll string format
	if (rollString.includes("[") === true) {
	  //extract dice needed
	  rollDice = rollString.substr(0,rollString.indexOf("[")).concat(',',rollString.substr(0,rollString.indexOf("[")));
	  //make adv/dis template
	  rollAdv = '{[diceSet]}kh';
	  rollDis = '{[diceSet]}kl';
	  //make foundry roll string
	  if (rollString.includes("[+]") === true) {
		rollStringParsed = rollAdv.replace("[diceSet]",rollDice);
	  } else if (rollString.includes("[-]") === true) {
		rollStringParsed = rollDis.replace("[diceSet]",rollDice);
	  }
	} else {
	  rollStringParsed = rollString;
	}
	//roll dice
	let macroRoll = await new Roll(rollStringParsed).evaluate();
	//get table result
	tableResult = game.tables.getName("Panic Check").getResultsForRoll(macroRoll.total);
	//get attribute to compare against
	curStress = game.user.character.system.other.stress.value;
	//create chat message, depending on outcome
	if (macroRoll.total <= curStress) {
		//create message variables
		if (game.user.character.system.class.value === 'Android') {
			msg_outcome = `
			<div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
				<strong>FAILURE!</strong>
			</div>
			You lose motor control for a moment as your sensory inputs flicker.
			`;
			if(macroRoll.total === 19) {tableResult[0].text = tableResult[0].text.replace("HEART ATTACK / SHORT CIRCUIT (ANDROIDS).","SHORT CIRCUIT.")};
		} else {
			msg_outcome = `
			<div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
				<strong>FAILURE!</strong>
			</div>
			Your heartbeat races out of control and you start to feel dizzy.
			`;
			if(macroRoll.total === 19) {tableResult[0].text = tableResult[0].text.replace("HEART ATTACK / SHORT CIRCUIT (ANDROIDS).","HEART ATTACK.")};
		}
		overUnder = `<i class="fas fa-angle-right"></i>`;
		target = curStress;
		//create message from template
		macroResult = `
		<div class="mosh">
			<div class="rollcontainer">
				<div class="flexrow" style="margin-bottom : 5px;">
					<div class="rollweaponh1">${tableResult[0].parent.name}</div>
					<div style="text-align: right"><img class="roll-image" src="${tableResult[0].img}" title="${tableResult[0].parent.name}" /></div>
				</div>
				<div class="description" style="margin-bottom: 10px;">
					<div class="body">${msg_outcome}</div>
				</div>
				<div class="dice-roll" style="margin-bottom: 10px;">
					<div class="dice-result">
						<div class="dice-formula">${rollString} ${overUnder} ${target}</div>
						<h4 class="dice-total">${macroRoll.total}</h4>
					</div>
				</div>
				<div class="description" style="margin-bottom: 20px;">${tableResult[0].text}</div>
			</div>
		</div>
		`;
	} else {
		//create message variables
		msg_outcome = `
		<div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
			<strong>SUCCESS!</strong>
		</div>
		You take a deep breath and regain your composure.
		`;
		overUnder = `<i class="fas fa-angle-right"></i>`;
		target = curStress;
		//create message from template
		macroResult = `
		<div class="mosh">
			<div class="rollcontainer">
				<div class="flexrow" style="margin-bottom: 5px;">
					<div class="rollweaponh1">${tableResult[0].parent.name}</div>
					<div style="text-align: right"><img class="roll-image" src="${tableResult[0].img}" title="${tableResult[0].parent.name}" /></div>
				</div>
				<div class="description"" style="margin-bottom: 20px;">
					<div class="body">${msg_outcome}</div>
				</div>
			</div>
		</div>
		`;
	}
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
	title: `Panic Check`,
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
	  <div class="macro_img"><img src="modules/fvtt_mosh_1e_psg/icons/rolltables/panic_check.png" style="border:none"/></div>
	  <div class="macro_desc"><h3>Panic Check</h3>Stress, Damage, and emotional wear and tear will eventually bring you to your breaking point. When that happens, there’s a chance you’ll Panic. You determine this by making a <strong>Panic Check</strong>. Some results of the Panic Table are so severe that they leave a lasting impression on you. These are called <strong>Conditions</strong>, and they affect you until you are able to treat them.</div>    
	</div>
  </div>
  
  <h4>Select your roll type:</h4>
  `,
	buttons: {
	  button1: {
		label: `Advantage`,
		callback: () => rollCheck(`1d20 [+]`),
		icon: `<i class="fas fa-angle-double-up"></i>`
	  },
	  button2: {
		label: `Normal`,
		callback: () => rollCheck(`1d20`),
		icon: `<i class="fas fa-minus"></i>`
	  },
	  button3: {
		label: `Disadvantage`,
		callback: () => rollCheck(`1d20 [-]`),
		icon: `<i class="fas fa-angle-double-down"></i>`
	  }
	}
  },{width: 600,height: 265}).render(true);