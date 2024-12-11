// Import Modules
import { MothershipActor } from "./actor/actor.js";
import { MothershipActorSheet } from "./actor/actor-sheet.js";
import { MothershipCreatureSheet } from "./actor/creature-sheet.js";
import { MothershipShipSheet } from "./actor/ship-sheet.js";
import { MothershipShipSheetSBT } from "./actor/ship-sheet-sbt.js";

import { MothershipItem } from "./item/item.js";
import { MothershipItemSheet } from "./item/item-sheet.js";
import { MothershipClassSheet } from "./item/class-sheet.js";

import {
  registerSettings
} from "./settings.js";

Hooks.once('init', async function () {

  game.mosh = {
    MothershipActor,
    MothershipItem,
    rollItemMacro,
    rollStatMacro,
    initRollTable,
    initRollCheck,
    initModifyActor,
    initModifyItem,
    noCharSelected
  };

  registerSettings();


  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d100",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = MothershipActor;
  CONFIG.Item.documentClass = MothershipItem;


  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);

  Actors.registerSheet("mosh", MothershipActorSheet, {
    types: ['character'],
    makeDefault: true
  });
  Actors.registerSheet("mosh", MothershipCreatureSheet, {
    types: ['creature'],
    makeDefault: false
  });

  Actors.registerSheet("mosh", MothershipShipSheetSBT, {
    types: ['ship'],
    makeDefault: true
  });

  Actors.registerSheet("mosh", MothershipShipSheet, {
    types: ['ship'],
    makeDefault: false
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("mosh", MothershipClassSheet, {types: ['class'], makeDefault: true });
  Items.registerSheet("mosh", MothershipItemSheet, {
    types: ["item",
      "skill",
      "weapon",
      "armor",
      "ability",
      "module",
      "condition",
      "crew",
      "repair",], 
      makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function () {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('compare', function (varType, varOne, comparator, varTwo) {
    if (varType === 'str') {
     if (eval('"' + varOne + '"' + comparator + '"' + varTwo+ '"')) {
       return true
     } else {
       return false
     }
    } else if (varType === 'int') {
     if (eval(varOne + comparator + varTwo)) {
       return true
     } else {
       return false
     }
    }
     });

});


Hooks.once("ready", async function () {
  
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    if (data.type === "Item") {
      createMothershipMacro(data, slot);
      return false;
    }
  });
  
    //Calm & 1e/0e character updates
    // if the user has calm enabled at the start, 
    if (game.settings.get('mosh','useCalm')) {
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
          //if the label does not say Calm
          if (actor.system.other.stress.label != 'Calm') {
            //change it to calm
            actor.update({'system.other.stress.label': 'Calm'});
            //log
            labelEnd = 'Calm';
          }
          //if the MIN value is not 0, this is an old character
          if (actor.system.other.stress.min != 0) {
            //put this value as the maximum
              //change it to calm
              actor.update({'system.other.stress.max': actor.system.other.stress.min});
              //log
              maxEnd = actor.system.other.stress.min;
            //set the minimum to zero
              //change it to calm
              actor.update({'system.other.stress.min': 0});
              //log
              minEnd = 0;
          }
          //log change
          console.log(actorName + " stress.min changed from " + minStart + " to " + minEnd);
          console.log(actorName + " stress.max changed from " + maxStart + " to " + maxEnd);
          console.log(actorName + " stress.label changed from " + labelStart + " to " + labelEnd);
          //rerender this sheet
          actor.render();
        }
      });
    //user does not have calm enabled
    } else {
      //if the user has Zero edition enabled
      if (!game.settings.get('mosh','firstEdition')) {
        //loop through all actors and update their stress values
        actorList.forEach(function(actor){ 
          //loop through each result
          if (actor.type === 'character') {
            //set character name
            actorName = actor.name;
            //set current values
            maxStart = actor.system.other.stress.max;
            //if the max value, this is an old character
            if (actor.system.other.stress.max != 999) {
              //put this value as the maximum
                //change it to calm
                actor.update({'system.other.stress.max': 999});
                //log
                maxEnd = 999;
            }
            //log change
            console.log(actorName + " stress.max changed from " + maxStart + " to " + maxEnd);
            //rerender this sheet
            actor.render();
          }
        });
      }
    }
});

//add custom damage dice for MOSH
Hooks.once('diceSoNiceReady', (dice3d) => {
  dice3d.addColorset(
    {
      name: 'roll',
      description: 'Roll Dice',
      category: 'Mothership',
      foreground: '#FFFFFF',
      background: '#262626',
      outline: 'none',
      texture: 'none',
      material: 'none',
      font: 'Arial'
    }
  )
})

//add custom damage dice for MOSH
Hooks.once('diceSoNiceReady', (dice3d) => {
  dice3d.addColorset(
    {
      name: 'damage',
      description: 'Damage Dice',
      category: 'Mothership',
      foreground: '#FFFFFF',
      background: '#cc2828',
      outline: 'none',
      texture: 'none',
      material: 'none',
      font: 'Arial'
    }
  )
})

//add custom panic dice for MOSH
Hooks.once('diceSoNiceReady', (dice3d) => {
  dice3d.addColorset(
    {
      name: 'panic',
      description: 'Panic Die',
      category: 'Mothership',
      foreground: '#000000',
      background: '#FFF200',
      outline: 'none',
      texture: 'none',
      material: 'metal',
      font: 'Arial'
    }
  )
})

//Hooks.on("preCreateActor", (createData) => {
/**
 * Set default values for new actors' tokens
 */
Hooks.on("preCreateActor", (document, createData, options, userId) => {
  let disposition = CONST.TOKEN_DISPOSITIONS.NEUTRAL;

  if (createData.type == "creature") {
    disposition = CONST.TOKEN_DISPOSITIONS.HOSTILE
  }

  // Set wounds, advantage, and display name visibility
  mergeObject(createData,
    {
      "token.bar1": { "attribute": "health" },        // Default Bar 1 to Health 
      "token.bar2": { "attribute": "hits" },      // Default Bar 2 to Insanity
      "token.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,     // Default display name to be on owner hover
      "token.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,     // Default display bars to be on owner hover
      "token.disposition": disposition,                               // Default disposition to neutral
      "token.name": createData.name                                   // Set token name to actor name
    })

    console.log(createData);
    console.log("Created!");

  if (createData.type == "character") {
    console.log("Got here");
    const prototypeToken = { disposition: 1, actorLink: true, vision: true}; // Set disposition to "Friendly"
    document.updateSource({ prototypeToken });
    
  }
})

Hooks.on('renderSidebarTab', async (app, html) => {
  console.log(app);
  console.log(app.options.id);
  if (app.options.id == "actors" || app.title == "Actors Directory") {
    console.log("testing~");
    let button = $(`<button class="import-json"><i class="fas fa-file-import"></i> Import JSON</button>`);
    button.click(function () {
      d.render(true);
    });
    html.find(".directory-footer").append(button);
  }
});



/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createMothershipMacro(data, slot) {

  if (data.type !== "Item") return;

  var itemUUID = data.uuid.split("."); 
  console.log(itemUUID);

  var actor = game.actors.get(itemUUID[1]);
  var item;

  if (game.release.generation >= 12) {
    item = foundry.utils.duplicate(actor.getEmbeddedDocument('Item',itemUUID[3]));
  } else {
    item = duplicate(actor.getEmbeddedDocument('Item',itemUUID[3]));
  }
  console.log(item);

  if (!item) return ui.notifications.warn("You can only create macro buttons for owned Items");

  // Create the macro command
  let command = `game.mosh.rollItemMacro("${item.name}");`;
console.log(command);
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: {
        "mosh.itemMacro": true
      }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/* -------------------------------------------- */
/*  Actor from JSON                             */
/* -------------------------------------------- */
// If there's a better place for these, please do move them
let skillValues = {
  "archeology": { "value": 10, "rank": "Trained" },
  "archaelogy": { "value": 10, "rank": "Trained" }, //The mobile app has a typo so needs this.
  "archaeology": { "value": 10, "rank": "Trained" },
  "art": { "value": 10, "rank": "Trained" },
  "athletics": { "value": 10, "rank": "Trained" },
  "botany": { "value": 10, "rank": "Trained" },
  "chemistry": { "value": 10, "rank": "Trained" },
  "computers": { "value": 10, "rank": "Trained" },
  "geology": { "value": 10, "rank": "Trained" },
  "industrialequipment": { "value": 10, "rank": "Trained" },
  "juryrigging": { "value": 10, "rank": "Trained" },
  "linguistics": { "value": 10, "rank": "Trained" },
  "mathematics": { "value": 10, "rank": "Trained" },
  "militarytraining": { "value": 10, "rank": "Trained" },
  "rimwise": { "value": 10, "rank": "Trained" },
  "theology": { "value": 10, "rank": "Trained" },
  "zerog": { "value": 10, "rank": "Trained" },
  "zoology": { "value": 10, "rank": "Trained" },
  "asteroidmining": { "value": 15, "rank": "Expert" },
  "ecology": { "value": 15, "rank": "Expert" },
  "explosives": { "value": 15, "rank": "Expert" },
  "fieldmedicine": { "value": 15, "rank": "Expert" },
  "firearms": { "value": 15, "rank": "Expert" },
  "hacking": { "value": 15, "rank": "Expert" },
  "handtohandcombat": { "value": 15, "rank": "Expert" },
  "mechanicalrepair": { "value": 15, "rank": "Expert" },
  "mysticism": { "value": 15, "rank": "Expert" },
  "pathology": { "value": 15, "rank": "Expert" },
  "pharmacology": { "value": 15, "rank": "Expert" },
  "physics": { "value": 15, "rank": "Expert" },
  "piloting": { "value": 15, "rank": "Expert" },
  "psychology": { "value": 15, "rank": "Expert" },
  "tactics": { "value": 15, "rank": "Expert" },
  "wildernesssurvival": { "value": 15, "rank": "Expert" },
  "artificialintenligence": { "value": 20, "rank": "Master" },
  "command": { "value": 20, "rank": "Master" },
  "cybernetics": { "value": 20, "rank": "Master" },
  "engineering": { "value": 20, "rank": "Master" },
  "exobiology": { "value": 20, "rank": "Master" },
  "hyperspace": { "value": 20, "rank": "Master" },
  "planetology": { "value": 20, "rank": "Master" },
  "robotics": { "value": 20, "rank": "Master" },
  "sophontology": { "value": 20, "rank": "Master" },
  "surgery": { "value": 20, "rank": "Master" },
  "xenoesoterism": { "value": 20, "rank": "Master" },
}

let conditions = {
  "adrenalinerush": "[+] on all rolls for the next 2d10 minutes. Reduce your Stress by 1d5.",
  "anxious": "Gain 1 Stress.",
  "jumpy": "Gain 1 Stress. All Close crewmembers gain 2 Stress.",
  "overwhelmed": "All actions at [-] for 1d10 minutes. Permanently raise your Minimum Stress by 1.",
  "coward": "Gain a new Condition: You must make a Fear Save to engage in violence or flee.",
  "frightened": "Gain a new Condition: Phobia: When encountering your Phobia make a Fear Save [-] or gain 1d5 Stress.",
  "nightmares": "Gain a new Condition: Sleep is difficult, gain [-] on all Rest Saves.",
  "lossofconfidence": "Gain a new Condition: Choose one of your Skills and lose that Skill's bonus.",
  "deflated": "Gain a new Condition: Whenever a Close crewmember fails a Save, gain 1 Stress.",
  "doomed": "Gain a new Condition: You feel cursed and unlucky. All Critical Successes are instead Critical Failures.",
  "paranoid": "For the next week, whenever someone joins your group (even if they only left for a short period of time), make a Fear Save or gain 1 Stress.",
  "haunted": "Gain a new Condition: Something starts visiting you at night. In your dreams. Out of the corner of your eye. And soon it will start making demands.",
  "deathwish": "For the next 24 hours, whenever you encounter a stranger or known enemy, you must make a Sanity Save or immediately attack them.",
  "propheticvision": "You immediately experience an intense hallucination or vision of an impending terror or horrific event. Gain 1 Stress.",
  "catatonic": "Become unresponsive and unmoving for 2d10 minutes. Reduce Stress by 1d10.",
  "rage": "Immediately attack the closest crewmember until you inflict at least 2d10 DMG. If there is no crewmember Close, you attack your surrounding environment.",
  "spiraling": "Gain a new Condition: You make Panic Checks with Disadvantage.",
  "compoundingproblems": "Roll twice on this table. Permanently raise your Minimum Stress by 1.",
  "heartattack": "Permanently lose 1 Wound. Gain [-] on all rolls for 1d10 hours. Permanently raise your Minimum Stress by 1.",
  "collapse": "You no longer control this character. Hand your sheet to the Warden and roll up a new character to play."
}

async function createActorFromJson(jsonData) {
  let actorData;
  let newActor;
  try {
    actorData = JSON.parse(jsonData);
    newActor = {
      "name": actorData.name,
      "type": "character",
      "img": "icons/svg/mystery-man.svg",
      "system": {
        "health": {
          "value": actorData.health,
          "max": actorData.maxHealth,
          "min": 0
        },
        "hits": {
          "value": actorData.wounds,
          "max": actorData.maxWounds
        },
        "biography": "",
        "notes": "",
        "weight": { "current": 0, "capacity": 0 },
        "settings": { "useCalm": false },
        "class": {
          "value": actorData.characterClass.charAt(0).toUpperCase() + actorData.characterClass.slice(1)
        },
        "rank": { "value": "" },
        "pronouns": { "value": actorData.pronouns },
        "credits": { "value": actorData.credits },
        "stressdesc": { "value": actorData.traumaResponse },
        "xp": { "value": 0, "html": 0, "selectedSkill": "" },
        "stressdesc": { "value": actorData.traumaResponse },
        "attributes": { "level": { "value": actorData.highScore } },
        "stats": {
          "strength": {
            "value": actorData.strength, "label": "Strength", "mod": 0
          },
          "speed": {
            "value": actorData.speed, "label": "Speed", "mod": 0
          },
          "intellect": {
            "value": actorData.intellect, "label": "Intellect", "mod": 0
          },
          "combat": {
            "value": actorData.combat, "label": "Combat", "mod": 0
          },
          "sanity": {
            "value": actorData.sanity, "label": "Sanity", "mod": 0
          },
          "fear": {
            "value": actorData.fear, "label": "Fear", "mod": 0
          },
          "body": {
            "value": actorData.body, "label": "Body", "mod": 0
          }
        },
        "other": {
          "stress": {
            "value": actorData.stress, "min": actorData.minStress, "label": "Stress"
          },
          "resolve": 0
        }
      }
    };
    var items = [];
    if (actorData.trinket) {
      items.push({
        "name": "Trinket: " + actorData.trinket, "type": "item"
      })
    }
    if (actorData.patch) {
      items.push({
        "name": "Patch: " + actorData.patch, "type": "item"
      })
    }
    // Equipment
    for (let i = 0; i < actorData.equipment.length; i++) {
      items.push({
        "name": actorData.equipment[i].name,
        "type": "item",
        "system": {
          "description": actorData.equipment[i].description,
          "cost": actorData.equipment[i].cost,
          "quantity": actorData.equipment[i].quantity
        },
        "img": "icons/svg/item-bag.svg",
      })
    }
    // Items
    for (let i = 0; i < actorData.items.length; i++) {
      items.push({
        "name": actorData.items[i].title,
        "type": "item",
        "system": {
          "description": actorData.items[i].description,
          "cost": actorData.items[i].cost,
          "quantity": actorData.items[i].quantity
        },
        "img": "icons/svg/item-bag.svg",
      })
    }
    // Armor
    for (let i = 0; i < actorData.armor.length; i++) {
      items.push({
        "name": actorData.armor[i].name,
        "type": "armor",
        "system": {
          "description": actorData.armor[i].notes,
          "cost": actorData.armor[i].cost,
          "bonus": actorData.armor[i].armorPoints,
          "equipped": actorData.armor[i].equipped
        },
        "img": "icons/svg/item-bag.svg",
      })
    }
    // Weapons
    for (let i = 0; i < actorData.weapons.length; i++) {
      console.log(actorData.weapons[i]);
      items.push({
        "name": actorData.weapons[i].name,
        "type": "weapon",
        "system": {
          "description": actorData.weapons[i].special,
          "cost": actorData.weapons[i].cost,
          "ranges": {
            "short": 0,
            "medium": 0,
            "long": 0,
            "value": actorData.weapons[i].weaponRange
          },
          "equipped": actorData.weapons[i].equipped,
          "critEffect": actorData.weapons[i].critical,
          "shots": actorData.weapons[i].shots,
          "curShots": actorData.weapons[i].shots,
          "ammo": actorData.weapons[i].magazines,
          "shotsPerFire": "1",
          "useAmmo": false,
          "ammoType": "",
          "critDmg": actorData.weapons[i].critical,
          "critEffect": "",
          "damage": actorData.weapons[i].damageString.replace("DMG", "")
        },
        "img": "icons/svg/item-bag.svg",
      })
    }
    // Skills
    for (let i = 0; i < actorData.skills.length; i++) {

      if(actorData.skills[i] == undefined) continue;
      console.log(actorData.skills[i]);
      console.log(skillValues[actorData.skills[i].toLowerCase()]);

      // Really betting for the app to only export base skills, if in the future
      // they add custom skills, they'll need to be checked if they even exist
      let words = actorData.skills[i].split(/(?=[A-Z])/);
      let skillName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      items.push({
        "name": skillName,
        "type": "skill",
        "system": {
          "description": "",
          "bonus": skillValues[actorData.skills[i].toLowerCase()].value,
          "rank": skillValues[actorData.skills[i].toLowerCase()].rank
        },
        "img": "icons/svg/item-bag.svg",
      })
    }
    // Conditions
    for (let i = 0; i < actorData.conditions.length; i++) {
      // Same thing as skills
      let conName = actorData.conditions[i].conditionType;
      let words = conName.split(/(?=[A-Z])/);
      let name = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      //-Minor consideration since the app eports heartAttack for both
      if (actorData.characterClass == "android" && conName.toLowerCase() == "heartattack") {
        name = "Short Circuit"
      }
      items.push({
        "name": name,
        "type": "condition",
        "system": {
          "description": conditions[conName.toLowerCase()],
          "treatment": { "value": 0, "html": "" }
        },
        "img": "icons/svg/item-bag.svg",
      })
    }
    newActor.items = items
  } catch (err) {
    console.error(err);
    ui.notifications.error("Invalid JSON, make sure you exported it from the Mothership Companion App");
    return;
  }

  // Ensure the type of the actor (e.g., 'character') is correctly set according to your system
  newActor.type = 'character';
  // Here we assume the actorData structure is correctly formed according to your system needs

  // You might need additional checks/transformations depending on the JSON data structure

  try {
    await Actor.create(newActor);
    ui.notifications.info("Character imported successfully!");
  } catch (err) {
    console.error(err);
    ui.notifications.error("Failed to import character, check console for more details.");
  }
}

let d = new Dialog({
  title: "Mothership Companion JSON Import",
  content: `
  <form>
    <div class="form-group">
      <label>JSON File:</label>
      <input type="file" id="json-upload" accept=".json">
    </div>
  </form>
  `,
  buttons: {
      upload: {
          label: "Upload",
          callback: (html) => {
              let fileInput = html.find('#json-upload')[0];
              let file = fileInput.files[0];
              let reader = new FileReader();

              reader.onload = (event) => {
                  let contents = event.target.result;
                  createActorFromJson(contents);
              };

              reader.onerror = (event) => {
                  console.error(`File could not be read: ${event.target.error}`);
              };

              reader.readAsText(file);
          }
      }
  },
  default: "upload"
})
d.render(true);


/**
 * Roll Macro from a Weapon.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  //init vars
  let item;
  let itemId;
  //determine who to run the macro for
  if (game.settings.get('mosh','macroTarget') === 'character') {
    //is there a selected character? warn if no
    if (!game.user.character) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for the player's 'Selected Character'
        //get item id
        itemId = game.user.character.items.getName(itemName)._id;
        //get item
        if (game.release.generation >= 12) {
          item = foundry.utils.duplicate(game.user.character.getEmbeddedDocument("Item", itemId));
        } else {
          item = duplicate(game.user.character.getEmbeddedDocument("Item", itemId));
        }
        //warn if no item
        if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);
        //roll action
        if (item.type == "weapon") {
          return game.user.character.rollCheck(null, 'low', 'combat', null, null, item);
        } else if (item.type == "item" || item.type == "armor" || item.type == "ability" || item.type == "condition" || item.type == "repair") {
          return game.user.character.printDescription(item.id);
        } else if (item.type == "skill") {
          return game.user.character.rollCheck(null, null, null, item.name, item.system.bonus, null);
        }
    }
  } else if (game.settings.get('mosh','macroTarget') === 'token') {
    //is there a selected character? warn if no
    if (!canvas.tokens.controlled.length) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        //get item id
        itemId = token.actor.items.getName(itemName)._id;
        //get item
        if (game.release.generation >= 12) {
          item = foundry.utils.duplicate(token.actor.getEmbeddedDocument("Item", itemId));
        } else {
          item = duplicate(token.actor.getEmbeddedDocument("Item", itemId));
        }
        //warn if no item
        if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);
        //roll action
        if (item.type == "weapon") {
          return token.actor.rollCheck(null, 'low', 'combat', null, null, item);
        } else if (item.type == "item" || item.type == "armor" || item.type == "ability" || item.type == "condition" || item.type == "repair") {
          return token.actor.printDescription(item.id);
        } else if (item.type == "skill") {
          return token.actor.rollCheck(null, null, null, item.name, item.system.bonus, null);
        }
      });
    }
  }
}


/**
 * Roll Stat.
 * @param {string} statName
 * @return {Promise}
 */
function rollStatMacro() {
  var selected = canvas.tokens.controlled;
  const speaker = ChatMessage.getSpeaker();

  if (selected.length == 0) {
    selected = game.actors.tokens[speaker.token];
  }

  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const stat = actor ? Object.entries(actor.system.stats) : null;


  // if (stat == null) {
  //   ui.notifications.info("Stat not found on token");
  //   return;
  // }

  console.log(stat);

  return actor.rollStatSelect(stat);
}

//find and tell the actor to run the tableRoll function
async function initRollTable(tableId,rollString,aimFor,zeroBased,checkCrit,rollAgainst,comparison) {
  //determine who to run the macro for
  if (game.settings.get('mosh','macroTarget') === 'character') {
    //is there a selected character? warn if no
    if (!game.user.character) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for the player's 'Selected Character'
      game.user.character.rollTable(tableId,rollString,aimFor,zeroBased,checkCrit,rollAgainst,comparison);
    }
  } else if (game.settings.get('mosh','macroTarget') === 'token') {
    //is there a selected character? warn if no
    if (!canvas.tokens.controlled.length) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.rollTable(tableId,rollString,aimFor,zeroBased,checkCrit,rollAgainst,comparison);
      });
    }
  }
  //log what was done
  console.log(`Initiated rollTable function with: tableId: ${tableId}, rollString: ${rollString}, aimFor: ${aimFor}, zeroBased: ${zeroBased}, checkCrit: ${checkCrit}, rollAgainst: ${rollAgainst}, comparison: ${comparison}`);
}

//find and tell the actor to run the rollCheck function
async function initRollCheck(rollString,aimFor,attribute,skill,skillValue,weapon) {
  //determine who to run the macro for
  if (game.settings.get('mosh','macroTarget') === 'character') {
    //is there a selected character? warn if no
    if (!game.user.character) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for the player's 'Selected Character'
      game.user.character.rollCheck(rollString,aimFor,attribute,skill,skillValue,weapon);
    }
  } else if (game.settings.get('mosh','macroTarget') === 'token') {
    //is there a selected character? warn if no
    if (!canvas.tokens.controlled.length) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.rollCheck(rollString,aimFor,attribute,skill,skillValue,weapon);
      });
    }
  }
  //log what was done
  console.log(`Initiated rollCheck function with: rollString: ${rollString}, aimFor: ${aimFor}, attribute: ${attribute}, skill: ${skill}, skillValue: ${skillValue}, weapon: ${weapon}`);
}

//find and tell the actor to run the modifyActor function
async function initModifyActor(fieldAddress,modValue,modRollString,outputChatMsg) {
  //determine who to run the macro for
  if (game.settings.get('mosh','macroTarget') === 'character') {
    //is there a selected character? warn if no
    if (!game.user.character) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for the player's 'Selected Character'
      game.user.character.modifyActor(fieldAddress,modValue,modRollString,outputChatMsg);
    }
  } else if (game.settings.get('mosh','macroTarget') === 'token') {
    //is there a selected character? warn if no
    if (!canvas.tokens.controlled.length) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.modifyActor(fieldAddress,modValue,modRollString,outputChatMsg);
      });
    }
  }
  //log what was done
  console.log(`Initiated modifyActor function with: fieldAddress: ${fieldAddress}, modValue: ${modValue}, modRollString: ${modRollString}, outputChatMsg: ${outputChatMsg}`);
}

//tell the actor to run the function
async function initModifyItem(itemId,addAmount) {
  //determine who to run the macro for
  if (game.settings.get('mosh','macroTarget') === 'character') {
    //is there a selected character? warn if no
    if (!game.user.character) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for the player's 'Selected Character'
      game.user.character.modifyItem(itemId,addAmount);
    }
  } else if (game.settings.get('mosh','macroTarget') === 'token') {
    //is there a selected character? warn if no
    if (!canvas.tokens.controlled.length) {
      //warn player
      game.mosh.noCharSelected();
    } else {
      //run the function for all selected tokens
      canvas.tokens.controlled.forEach(function(token){
        token.actor.modifyItem(itemId,addAmount);
      });
    }
  }
  //log what was done
  console.log(`Initiated modifyItem function with: itemId: ${itemId}, addAmount: ${addAmount}`);
}

//tell user no character is selected
async function noCharSelected() {
  //wrap the whole thing in a promise, so that it waits for the form to be interacted with
  return new Promise(async (resolve) => {
    //init vars
    let errorMessage = ``;
    //create error text based on current settings
    if (game.settings.get('mosh','macroTarget') === 'character') {
      errorMessage = `<h3>No Character Selected</h3>Macro Target is set to the currently selected character. To select a character, modify your User Configuration in the Players menu located in the lower-left of the interface.<br><br>If you prefer Macros to be run on the currently selected token(s) in the scene, you should change your settings accordingly.<br><br>`;
    } else if (game.settings.get('mosh','macroTarget') === 'token') {
      errorMessage = `<h3>No Character Selected</h3>Macro Target is set to the currently selected token(s) in the scene. To select token(s), click or draw a box around token(s) in the current scene.<br><br>If you prefer Macros to be run on the currently selected character for your user, you should change your settings accordingly.<br><br>`;
    }
    //create final dialog data
    const dialogData = {
      title: `Macro Issue`,
      content: errorMessage,
      buttons: {}
    };
    //add buttons
      //Ok
      dialogData.buttons.cancel = {
        label: `Ok`,
        callback: () => { },
        icon: '<i class="fas fa-check"></i>'
      };
    //render dialog
    const dialog = new Dialog(dialogData).render(true);
    //log what was done
    console.log(`Told the user that no character was selected.`);
  });
}

//tell user no ship is selected
async function noShipSelected() {
  //wrap the whole thing in a promise, so that it waits for the form to be interacted with
  return new Promise(async (resolve) => {
    //init vars
    let errorMessage = ``;
    //create error text based on current settings
    if (game.settings.get('mosh','macroTarget') === 'character') {
      errorMessage = `<h3>No Ship Selected</h3>Macro Target is set to the currently selected character. To select a ship, modify your User Configuration in the Players menu located in the lower-left of the interface.<br><br>If you prefer Macros to be run on the currently selected token(s) in the scene, you should change your settings accordingly.<br><br>`;
    } else if (game.settings.get('mosh','macroTarget') === 'token') {
      errorMessage = `<h3>No Ship Selected</h3>Macro Target is set to the currently selected token(s) in the scene. To select token(s), click or draw a box around token(s) in the current scene.<br><br>If you prefer Macros to be run on the currently selected character for your user, you should change your settings accordingly.<br><br>`;
    }
    //create final dialog data
    const dialogData = {
      title: `Macro Issue`,
      content: errorMessage,
      buttons: {}
    };
    //add buttons
      //Ok
      dialogData.buttons.cancel = {
        label: `Ok`,
        callback: () => { },
        icon: '<i class="fas fa-check"></i>'
      };
    //render dialog
    const dialog = new Dialog(dialogData).render(true);
    //log what was done
    console.log(`Told the user that no character was selected.`);
  });
}