prepTableRoll(`egJ11m2mJM3HBd6d`,`1d10`,`high`,false,false,'system.other.stress.value','>');

//tell the actor to run the function
async function prepTableRoll(tableName,rollString,aimFor,zeroBased,checkCrit,rollAgainst,comparison) {
    //determine who to run the macro for
    if (game.settings.get('mosh','macroTarget') === 'character') {
      //run the function for the player's 'Selected Character'
      game.user.character.rollTable(tableName,rollString,aimFor,zeroBased,checkCrit,rollAgainst,comparison);
    } else if (game.settings.get('mosh','macroTarget') === 'token') {
      //run the function for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.rollTable(tableName,rollString,aimFor,zeroBased,checkCrit,rollAgainst,comparison);
      });
    }
  }