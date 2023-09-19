prepModifyActor('system.other.stress.value',-1,null,true);

//tell the actor to roll on the table
async function prepModifyActor(fieldAddress,modValue,modRollString,outputChatMsg) {
    //determine who to run the macro for
    if (game.settings.get('mosh','macroTarget') === 'character') {
      //roll the table for the player's 'Selected Character'
      game.user.character.modifyActor(fieldAddress,modValue,modRollString,outputChatMsg);
    } else if (game.settings.get('mosh','macroTarget') === 'token') {
      //roll the table for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.modifyActor(fieldAddress,modValue,modRollString,outputChatMsg);
      });
    }
}