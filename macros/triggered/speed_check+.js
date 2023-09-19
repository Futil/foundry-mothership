prepRollCheck('1d100 [+]','low','speed',null,null,null);

//tell the actor to roll on the table
async function prepRollCheck(rollString,aimFor,attribute,skill,skillValue,weapon) {
    //determine who to run the macro for
    if (game.settings.get('mosh','macroTarget') === 'character') {
      //roll the table for the player's 'Selected Character'
      game.user.character.rollCheck(rollString,aimFor,attribute,skill,skillValue,weapon);
    } else if (game.settings.get('mosh','macroTarget') === 'token') {
      //roll the table for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.rollCheck(rollString,aimFor,attribute,skill,skillValue,weapon);
      });
    }
}