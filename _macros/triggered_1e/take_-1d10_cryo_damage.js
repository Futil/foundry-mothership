prepCryoDamage();

//tell the actor to run the function
async function prepCryoDamage() {
  //determine who to run the macro for
  if (game.settings.get('mosh','macroTarget') === 'character') {
    //is there a selected character? warn if no
    if (!game.user.character) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for the player's 'Selected Character'
      game.user.character.takeCryoDamage('-1d10');
    }
  } else if (game.settings.get('mosh','macroTarget') === 'token') {
    //is there a selected character? warn if no
    if (!canvas.tokens.controlled.length) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.takeCryoDamage('-1d10');
      });
    }
  }
}