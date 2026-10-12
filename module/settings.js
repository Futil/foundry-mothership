import { rolltableConfig } from "./windows/settings-rolltables.js";

export const registerSettings = function () {
  
  game.settings.register('mosh', 'firstEdition', {
    name: "Mosh.Settings.FirstEdition.Name",
    hint: "Mosh.Settings.FirstEdition.Hint",
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
    name: "Mosh.Settings.MacroTarget.Name",
    hint: "Mosh.Settings.MacroTarget.Hint",
    default: "character",
    scope: 'world',
    type: String,
    choices: {
      "character": "Mosh.Settings.MacroTarget.Character",
      "token": "Mosh.Settings.MacroTarget.Token"
    },
    config: true,
    onChange: value => {
      //log the change
      console.log("Macro target set to " + value)
    }
  });

  game.settings.register('mosh', 'critDamage', {
    name: "Mosh.Settings.CritDamage.Name",
    hint: "Mosh.Settings.CritDamage.Hint",
    default: "advantage",
    scope: 'world',
    type: String,
    choices: {
      "advantage": "Mosh.Settings.CritDamage.Advantage",
      "doubleDamage": "Mosh.Settings.CritDamage.DoubleDamage",
      "doubleDice": "Mosh.Settings.CritDamage.DoubleDice",
      "maxDamage": "Mosh.Settings.CritDamage.MaxDamage",
      "weaponValue": "Mosh.Settings.CritDamage.WeaponValue",
      "none": "Mosh.Settings.CritDamage.None"
    },
    config: true,
    onChange: value => {
      //log the change
      console.log("Critical hits set to " + value)
    }
  });

  game.settings.register('mosh', 'damageDiceTheme', {
    name: "Mosh.Settings.DamageDiceTheme.Name",
    hint: "Mosh.Settings.DamageDiceTheme.Hint",
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
    name: "Mosh.Settings.PanicDieTheme.Name",
    hint: "Mosh.Settings.PanicDieTheme.Hint",
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
    name: "Mosh.Settings.HideWeight.Name",
    hint: "Mosh.Settings.HideWeight.Hint",
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
    name: "Mosh.Settings.UseCalm.Name",
    hint: "Mosh.Settings.UseCalm.Hint",
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
            //update max calm
              //set max calm to 85 if min stress is 2
              if (minStart === 2) {
                actor.update({'system.other.stress.max': 85});
                maxEnd = 85;
              //otherwise convert the min stress to max calm
              } else {
                actor.update({'system.other.stress.max': Math.round(85-(actor.system.other.stress.value*3))});
                maxEnd = Math.round(85-(actor.system.other.stress.value*3));
              }
            //set min stress to 0
            actor.update({'system.other.stress.min': 0});
            minEnd = 0;
            //update calm
              //set calm to 85 if stress is 2
              if (valueStart === 2) {
                actor.update({'system.other.stress.value': 85});
                valueEnd = 85;
              //otherwise convert stress to calm
              } else {
                actor.update({'system.other.stress.value': Math.round(85-(actor.system.other.stress.value*3))});
                valueEnd = Math.round(85-(actor.system.other.stress.value*3));
              }
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
                minEnd = 20;
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
    name: "Mosh.Settings.AndroidPanic.Name",
    hint: "Mosh.Settings.AndroidPanic.Hint",
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
    name: "Mosh.Settings.AutoStress.Name",
    hint: "Mosh.Settings.AutoStress.Hint",
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
    name: "Mosh.Settings.RolltableSelector.Name",
    label: "Mosh.Settings.RolltableSelector.Label",
    hint: "Mosh.Settings.RolltableSelector.Hint",
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