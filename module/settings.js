export const registerSettings = function () {
  
  game.settings.register('mosh', 'firstEdition', {
    name: "1e Rules",
    hint: "Use the 1st edition rules and character sheet.",
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
    onChange: value => {
      //log the change
      console.log("newArmorandCombat set to " + value)
      //if setting is now true
      if (value) {
        //loop through all actors and update their maximum stress
          //get list of actors
          let actorList = game.actors;
          //loop through each actor
          actorList.forEach(function(actor){ 
            //loop through each result
            if (actor.type === 'character') {
              //set max stress to 20
              actor.system.other.stress.max = 20
            }
          });
      //if value is now false
      } else {
        //loop through all actors and update their maximum stress
          //get list of actors
          let actorList = game.actors;
          //loop through each actor
          actorList.forEach(function(actor){ 
            //loop through each result
            if (actor.type === 'character') {
              //set max stress to 999
              actor.system.other.stress.max = 999
            }
          });
      }
    }
  });

  game.settings.register('mosh', 'macroTarget', {
    name: "Macro Target",
    hint: "Who should be the target for macros?",
    default: "character",
    scope: 'world',
    type: String,
    choices: {
      "character": "Currently active character for the player",
      "token": "Currently selected token(s) on the scene"
    },
    config: true,
    onChange: value => {
      //log the change
      console.log("Macro target set to " + value)
    }
  });

  game.settings.register('mosh', 'critDamage', {
    name: "Critical Hit Damage",
    hint: "What should the damage be on a critical hit?",
    default: "doubleDice",
    scope: 'world',
    type: String,
    choices: {
      "doubleDamage": "Double the damage value",
      "doubleDice": "Roll the dice twice",
      "weaponValue": "Defer to the weapon's crit damage"
    },
    config: true,
    onChange: value => {
      //log the change
      console.log("Critical hits set to " + value)
    }
  });

  game.settings.register('mosh', 'damageDiceTheme', {
    name: "Damage Dice Theme",
    hint: "If DiceSoNice is installed, what theme should be applied to damage dice?",
    default: "damage",
    scope: 'world',
    type: String,
    config: true,
    onChange: value => {
      //log the change
      console.log("Damage dice theme set to " + value)
    }
  });

  game.settings.register('mosh', 'panicDieTheme', {
    name: "Panic Die Theme",
    hint: "If DiceSoNice is installed, what theme should be applied to the panic die?",
    default: "panic",
    scope: 'world',
    type: String,
    config: true,
    onChange: value => {
      //log the change
      console.log("Panic die theme set to " + value)
    }
  });

  game.settings.register('mosh', 'hideWeight', {
    name: "Hide Weight",
    hint: "Hide weight in the items list for players and ships?",
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
    onChange: value => {
      //log the change
      console.log("hideWeight set to " + value)
    }
  });
  
  game.settings.register('mosh', 'useCalm', {
    name: "Use Calm?",
    hint: "Uses the traaa.sh Calm system instead of Stress.",
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
    onChange: value => {
      //log the change
      console.log("useCalm set to " + value);
      //if setting is now true
      if (value) {
        //loop through all actors and update their stress values
          //get list of actors
          let actorList = game.actors;
          //loop through each actor
          actorList.forEach(function(actor){ 
            //loop through each result
            if (actor.type === 'character') {
              //set min stress to 0
              actor.system.other.stress.min = 0;
              //convert min stress to max calm
              actor.system.other.stress.max = Math.round(85-(actor.system.other.stress.min*3));
              //convert stress to calm
              actor.system.other.stress.value = Math.round(85-(actor.system.other.stress.value*3));
              //set stress label to Calm
              actor.system.other.stress.label = 'Calm';
            }
          });
      //if value is now false
      } else {
        //loop through all actors and update their stress values
          //get list of actors
          let actorList = game.actors;
          //loop through each actor
          actorList.forEach(function(actor){ 
            //loop through each result
            if (actor.type === 'character') {
              //convert maximum calm to min stress
              actor.system.other.stress.min = Math.round((85-actor.system.other.stress.max)/3);
              //set max stress based on current system setting
              if (game.settings.get('mosh','firstEdition')) {
                //set max stress to 20
                actor.system.other.stress.max = 20;
                //set min stress to 20 if > 20
                if (actor.system.other.stress.min > 20) {actor.system.other.stress.min = 20;}
                //set min stress to 2 if < 2
                if (actor.system.other.stress.min < 2) {actor.system.other.stress.min = 2;}
              } else {
                //set max stress to 999
                actor.system.other.stress.max = 999;
                //set min stress to 2 if < 2
                if (actor.system.other.stress.min < 2) {actor.system.other.stress.min = 2;}
              }
              //convert calm to stress
              actor.system.other.stress.value = Math.round((85-actor.system.other.stress.value)/3);
              //set stress label to Stress
              actor.system.other.stress.label = 'Stress';
            }
          });
      }
    }
  });

  game.settings.register('mosh', 'androidPanic', {
    name: "Use Android Panic Tables?",
    hint: "Adds android-specific tables for Panic and Calm checks.",
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
    onChange: value => {
      //log the change
      console.log("androidPanic set to " + value)
    }
  });

};
