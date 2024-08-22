import { rolltableConfig } from "./windows/settings-rolltables.js";

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
      console.log("firstEdition set to " + value)
      //get list of actors
      let actorList = game.actors;
      let actorName = '';
      let maxStart = null;
      let maxEnd = null;
      //only make changes if calm is false
      if (game.settings.get('mosh','useCalm') === false) {
        //if setting is now true
        if (value) {
          //loop through all actors and update their maximum stress
            //get list of actors
            let actorList = game.actors;
            //loop through each actor
            actorList.forEach(function(actor){ 
              //loop through each result
              if (actor.type === 'character') {
                //set character name
                actorName = actor.name;
                //set current values
                maxStart = actor.system.other.stress.max;
                //set max stress to 20
                actor.update({'system.other.stress.max': 20});
                //set final values
                actorList = game.actors;
                maxEnd = 20;
                //log change
                console.log(actorName + " stress.max changed from " + maxStart + " to " + maxEnd);
                //rerender this sheet
                actor.render();
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
                //set character name
                actorName = actor.name;
                //set current values
                maxStart = actor.system.other.stress.max;
                //set max stress to 999
                actor.update({'system.other.stress.max': 999});
                //set final values
                actorList = game.actors;
                maxEnd = 999;
                //log change
                console.log(actorName + " stress.max changed from " + maxStart + " to " + maxEnd);
                //rerender this sheet
                actor.render();
              }
            });
        }
      } else {
        //get list of actors
        let actorList = game.actors;
        //loop through each actor
        actorList.forEach(function(actor){ 
          //loop through each result
          if (actor.type === 'character') {
            //log change
            console.log("First Edition switched to " + value);
            //rerender this sheet
            actor.render();
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
    default: "advantage",
    scope: 'world',
    type: String,
    choices: {
      "advantage": "Roll with advantage",
      "doubleDamage": "Double the damage result",
      "doubleDice": "Double the damage dice",
      "maxDamage": "Maximum possible damage result",
      "weaponValue": "Defer to each weapon's critical damage",
      "none": "No critical damage"
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
    name: "Hide 0e Weight",
    hint: "Hide the 0e weight mechanic in the items list for players and ships?",
    default: true,
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
      //get list of actors
      let actorList = game.actors;
      let actorName = '';
      let minStart = null;
      let valueStart = null;
      let maxStart = null;
      let labelStart = '';
      let minEnd = null;
      let valueEnd = null;
      let maxEnd = null;
      let labelEnd = '';
      //if setting is now true
      if (value) {
        //loop through all actors and update their stress values
        actorList.forEach(function(actor){ 
          //loop through each result
          if (actor.type === 'character') {
            //set character name
            actorName = actor.name;
            //set current values
            minStart = actor.system.other.stress.min;
            valueStart = actor.system.other.stress.value;
            maxStart = actor.system.other.stress.max;
            labelStart = actor.system.other.stress.label;
            //convert min stress to max calm
            actor.update({'system.other.stress.max': Math.round(85-(actor.system.other.stress.min*3))});
            maxEnd = Math.round(85-(actor.system.other.stress.min*3));
            //set min stress to 0
            actor.update({'system.other.stress.min': 0});
            minEnd = 0;
            //convert stress to calm
            actor.update({'system.other.stress.value': Math.round(85-(actor.system.other.stress.value*3))});
            valueEnd = Math.round(85-(actor.system.other.stress.value*3));
            //set stress label to Calm
            actor.update({'system.other.stress.label': 'Calm'});
            labelEnd = 'Calm';
            //log change
            console.log(actorName + " stress.min changed from " + minStart + " to " + minEnd);
            console.log(actorName + " stress.value changed from " + valueStart + " to " + valueEnd);
            console.log(actorName + " stress.max changed from " + maxStart + " to " + maxEnd);
            console.log(actorName + " stress.label changed from " + labelStart + " to " + labelEnd);
            //rerender this sheet
            actor.render();
          }
        });
      //if value is now false
      } else {
        //loop through all actors and update their stress values
        actorList.forEach(function(actor){ 
          //loop through each result
          if (actor.type === 'character') {
            //set character name
            actorName = actor.name;
            //set current values
            minStart = actor.system.other.stress.min;
            valueStart = actor.system.other.stress.value;
            maxStart = actor.system.other.stress.max;
            labelStart = actor.system.other.stress.label;
            //convert maximum calm to min stress
              //set min stress to 20 if > 20
              if (Math.round((85-actor.system.other.stress.max)/3) > 20) {
                actor.update({'system.other.stress.min': 20});
                minEnd = 2;
              //set min stress to 2 if < 2
              } else if (Math.round((85-actor.system.other.stress.max)/3) < 2) {
                actor.update({'system.other.stress.min': 2});
                minEnd = 2;
              //regular value
              } else {
                actor.update({'system.other.stress.min': Math.round((85-actor.system.other.stress.max)/3)});
                minEnd = Math.round((85-actor.system.other.stress.max)/3);
              }
            //set max stress based on current system setting
            if (game.settings.get('mosh','firstEdition')) {
              //set max stress to 20
              actor.update({'system.other.stress.max': 20});
              maxEnd = 20;
            } else {
              //set max stress to 999
              actor.update({'system.other.stress.max': 999});
              maxEnd = 999;
            }
            //convert calm to stress
            actor.update({'system.other.stress.value': Math.round((85-actor.system.other.stress.value)/3)});
            valueEnd = Math.round((85-actor.system.other.stress.value)/3);
            //set stress label to Stress
            actor.update({'system.other.stress.label': 'Stress'});
            labelEnd = 'Stress'
            //log change
            console.log(actorName + " stress.min changed from " + minStart + " to " + minEnd);
            console.log(actorName + " stress.value changed from " + valueStart + " to " + valueEnd);
            console.log(actorName + " stress.max changed from " + maxStart + " to " + maxEnd);
            console.log(actorName + " stress.label changed from " + labelStart + " to " + labelEnd);
            //rerender this sheet
            actor.render();
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

  game.settings.register('mosh', 'autoStress', {
    name: "Auto Stress Gain on Failures?",
    hint: "Automatically handles stress gain on a failed roll.",
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
    onChange: value => {
      //log the change
      console.log("autoStress set to " + value)
    }
  });

  game.settings.registerMenu('mosh', 'rolltableSelector', {
    name: "Rolltable Configuration",
    label: "Choose Tables",
    hint: "Customize which rolltables are used.",
    icon: "fa-solid fa-list",
    type: rolltableConfig
  });

  game.settings.register('mosh', 'table0ePanicStressNormal', {
    scope: 'world',
    config: false,
    type: String,
    default: "1vCm4ElRPotQXgNB"
  });

  game.settings.register('mosh', 'table0ePanicStressAndroid', {
    scope: 'world',
    config: false,
    type: String,
    default: "egJ11m2mJM3HBd6d"
  });

  game.settings.register('mosh', 'table0ePanicCalmNormal', {
    scope: 'world',
    config: false,
    type: String,
    default: "kqKpQAXyLTEEyz6Z"
  });

  game.settings.register('mosh', 'table0ePanicCalmAndroid', {
    scope: 'world',
    config: false,
    type: String,
    default: "VW6HQ29T7zClNIZ6"
  });

  game.settings.register('mosh', 'table1ePanicStressNormal', {
    scope: 'world',
    config: false,
    type: String,
    default: "ypcoikqHLhnc9tNs"
  });

  game.settings.register('mosh', 'table1ePanicStressAndroid', {
    scope: 'world',
    config: false,
    type: String,
    default: "aBnY19jlhPXzibCt"
  });

  game.settings.register('mosh', 'table1ePanicCalmNormal', {
    scope: 'world',
    config: false,
    type: String,
    default: "MOYI6Ntj5OVFYk06"
  });

  game.settings.register('mosh', 'table1ePanicCalmAndroid', {
    scope: 'world',
    config: false,
    type: String,
    default: "GCtYeCCQVQJ5M6SE"
  });

  game.settings.register('mosh', 'table1eWoundBluntForce', {
    scope: 'world',
    config: false,
    type: String,
    default: "31YibfjueXuZdNLb"
  });

  game.settings.register('mosh', 'table1eWoundBleeding', {
    scope: 'world',
    config: false,
    type: String,
    default: "ata3fRz3uoPfNCLh"
  });

  game.settings.register('mosh', 'table1eWoundGunshot', {
    scope: 'world',
    config: false,
    type: String,
    default: "XjDU2xFOWEasaZK0"
  });

  game.settings.register('mosh', 'table1eWoundFireExplosives', {
    scope: 'world',
    config: false,
    type: String,
    default: "lqiaWwh5cGcJhvnu"
  });

  game.settings.register('mosh', 'table1eWoundGoreMassive', {
    scope: 'world',
    config: false,
    type: String,
    default: "uVfC1CqYdojaJ7yR"
  });

  game.settings.register('mosh', 'table0eDeath', {
    scope: 'world',
    config: false,
    type: String,
    default: "cZOHlhEJcYGZsQBM"
  });

  game.settings.register('mosh', 'table1eDeath', {
    scope: 'world',
    config: false,
    type: String,
    default: "W36WFIpCfMknKgHy"
  });

  game.settings.register('mosh', 'table1eDistressSignal', {
    scope: 'world',
    config: false,
    type: String,
    default: "UxAjAqUTjYTcCbS8"
  });

  game.settings.register('mosh', 'table1eMegadamageEffects', {
    scope: 'world',
    config: false,
    type: String,
    default: "AqGWwoWXzijFs427"
  });

  game.settings.register('mosh', 'table1eMaintenance', {
    scope: 'world',
    config: false,
    type: String,
    default: "kqz8GsFVPfjvqO0N"
  });

  game.settings.register('mosh', 'table1eBankruptcy', {
    scope: 'world',
    config: false,
    type: String,
    default: "BsfdIl7CJNs1PViS"
  });

};