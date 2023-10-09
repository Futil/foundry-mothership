prepModifyActor();

//tell the actor to run the function
async function prepModifyActor(fieldAddress,modValue,modRollString,outputChatMsg) {
  //determine who to run the macro for
  if (game.settings.get('mosh','macroTarget') === 'character') {
    //is there a selected character? warn if no
    if (!game.user.character) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //get the health for this character
      let curValue = game.user.character.system.other.stress.min;
      //calculate difference
      let raiseBy = 5 - curValue;
      //zero out if negative
      if (raiseBy < 0) {raiseBy = 0;}
      //run the function for the player's 'Selected Character'
      game.user.character.modifyActor('system.other.stress.min',raiseBy,null,true);
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
        let curValue = token.actor.system.other.stress.min;
        //calculate difference
        let raiseBy = 5 - curValue;
        //zero out if negative
        if (raiseBy < 0) {raiseBy = 0;}
        //run the function on this token
        token.actor.modifyActor('system.other.stress.min',raiseBy,null,true);
      });
    }
  }
}