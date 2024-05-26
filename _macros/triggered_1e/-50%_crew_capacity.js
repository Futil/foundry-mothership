prepModifyActor();

//tell the actor to run the function
async function prepModifyActor(fieldAddress,modValue,modRollString,outputChatMsg) {
  //determine who to run the macro for
  if (game.settings.get('mosh','macroTarget') === 'character') {
    //is there a selected character? warn if no
    if (!game.user.character || !game.user.character.type === 'ship') {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //get the health for this token
      let curValue = game.user.character.system.supplies.crew.max;
      //calculate difference
      let lowerBy = Math.ceil(curValue/2)*-1;
      //run the function for the player's 'Selected Character'
      game.user.character.modifyActor('system.supplies.crew.max',lowerBy,null,true);
    }
  } else if (game.settings.get('mosh','macroTarget') === 'token') {
    //is there a selected character? warn if no
    if (!canvas.tokens.controlled.length) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        //get the health for this token
        let curValue = token.actor.system.supplies.crew.max;
        //calculate difference
        let lowerBy = Math.ceil(curValue/2)*-1;
        //run the function on this token
        token.actor.modifyActor('system.supplies.crew.max',lowerBy,null,true);
      });
    }
  }
}