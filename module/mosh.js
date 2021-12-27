// Import Modules
import { MothershipActor } from "./actor/actor.js";
import { MothershipActorSheet } from "./actor/actor-sheet.js";
import { MothershipCreatureSheet } from "./actor/creature-sheet.js";
import { MothershipShipSheet } from "./actor/ship-sheet.js";
import { MothershipItem } from "./item/item.js";
import { MothershipItemSheet } from "./item/item-sheet.js";
import {
  registerSettings
} from "./settings.js";

Hooks.once('init', async function () {

  game.mosh = {
    MothershipActor,
    MothershipItem,
    rollItemMacro,
    rollStatMacro
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
  CONFIG.Actor.documentClass  = MothershipActor;
  CONFIG.Item.documentClass  = MothershipItem;


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
  Actors.registerSheet("mosh", MothershipShipSheet, {
    types: ['ship'],
    makeDefault: false
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("mosh", MothershipItemSheet, { makeDefault: true });

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
});

Hooks.once("ready", async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createMothershipMacro(data, slot));
});

/**
 * Set default values for new actors' tokens
 */
Hooks.on("preCreateActor", (createData) => {
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


  if (createData.type == "character") {
    createData.token.vision = true;
    createData.token.actorLink = true;
  }
})


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
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  console.log(data);

  // Create the macro command
  let command = `game.mosh.rollItemMacro("${item.name}");`;


  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
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


/**
 * Roll Macro from a Weapon.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  console.log();

  if (item.type == "weapon") {
    return actor.rollWeapon(item.id);
  } else if (item.type == "item" || item.type == "armor" || item.type == "ability") {
    return actor.printDescription(item.id);
  } else if (item.type == "skill") {
    return actor.rollSkill(item.id);
  }

  console.error("No item type found: " + item);
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
  const stat = actor ? Object.entries(actor.data.data.stats) : null;


  // if (stat == null) {
  //   ui.notifications.info("Stat not found on token");
  //   return;
  // }

  console.log(stat);

  return actor.rollStatSelect(stat);
}