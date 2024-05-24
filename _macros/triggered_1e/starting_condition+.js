prepMaintenanceCheck();

//tell the actor to run the function
async function prepMaintenanceCheck() {
  //determine who to run the macro for
  if (game.settings.get('mosh','macroTarget') === 'character') {
    //is there a selected character? warn if no
    if (!game.user.character || !game.user.character.type === 'ship') {
      //warn player
      game.mosh.noShipSelected();
    } else {
      //run the function for the player's 'Selected Character'
      game.user.character.rollTable(`maintenanceCheck`,`1d100 [+]`,`low`,null,null,null,null);
    }
  } else if (game.settings.get('mosh','macroTarget') === 'token') {
    //is there a selected character? warn if no
    if (!canvas.tokens.controlled.length) {
      //warn player
      game.mosh.noShipSelected();
    } else {
      //run the function for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.rollTable(`maintenanceCheck`,`1d100 [+]`,`low`,null,null,null,null);
      });
    }
  }
}