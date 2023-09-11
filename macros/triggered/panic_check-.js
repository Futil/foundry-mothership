panicCheck('{1d20,1d20}kl');

async function panicCheck(rollString) {
	//roll dice
	let macroRoll = await new Roll(rollString).evaluate();
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
						<div class="dice-formula">1d20 [-] ${overUnder} ${target}</div>
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