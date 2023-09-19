prepModifyItem('Suspicious',1);

//tell the actor to roll on the table
async function prepModifyItem(itemName,addAmount) {
    //determine who to run the macro for
    if (game.settings.get('mosh','macroTarget') === 'character') {
      //roll the table for the player's 'Selected Character'
      game.user.character.modifyItem(itemName,addAmount);
    } else if (game.settings.get('mosh','macroTarget') === 'token') {
      //roll the table for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.modifyItem(itemName,addAmount);
      });
    }
}