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

  game.mothership = {
    MothershipActor,
    MothershipItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d100",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = MothershipActor;
  CONFIG.Item.entityClass = MothershipItem;

  registerSettings();

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);

  Actors.registerSheet("mothership", MothershipActorSheet, {
    types: ['character'],
    makeDefault: true
  });
  Actors.registerSheet("mothership", MothershipCreatureSheet, {
    types: ['creature'],
    makeDefault: false
  });
  Actors.registerSheet("mothership", MothershipShipSheet, {
    types: ['ship'],
    makeDefault: false
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("mothership", MothershipItemSheet, { makeDefault: true });

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
        "token.bar1": { "attribute": "data.health" },        // Default Bar 1 to Health 
        // "token.bar2": { "attribute": "data.insanity" },      // Default Bar 2 to Insanity
        "token.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,     // Default display name to be on owner hover
        "token.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,     // Default display bars to be on owner hover
        "token.disposition": disposition,                               // Default disposition to neutral
        "token.name": createData.name                                   // Set token name to actor name
      })

    // Default characters to HasVision = true and Link Data = true
    if (createData.type == "character") {
      createData.token.vision = true;
      createData.token.actorLink = true;
    }
  })

  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });
});