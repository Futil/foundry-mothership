prepModifyItem('YIF9QkUlexxauSCE',1);

//tell the actor to run the function
async function prepModifyItem(itemName,addAmount) {
    //determine who to run the macro for
    if (game.settings.get('mosh','macroTarget') === 'character') {
      //run the function for the player's 'Selected Character'
      game.user.character.modifyItem(itemName,addAmount);
    } else if (game.settings.get('mosh','macroTarget') === 'token') {
      //run the function for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.modifyItem(itemName,addAmount);
      });
    }
}