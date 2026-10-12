// Import Modules
import { MothershipActor } from "./actor/actor.js";
import { MothershipActorSheet } from "./actor/actor-sheet.js";
import { MothershipCreatureSheet } from "./actor/creature-sheet.js";
import { MothershipShipSheet } from "./actor/ship-sheet.js";
import { MothershipShipSheetSBT } from "./actor/ship-sheet-sbt.js";

import { MothershipItem } from "./item/item.js";
import { MothershipItemSheet } from "./item/item-sheet.js";
import { MothershipClassSheet } from "./item/class-sheet.js";
import { MothershipSkillSheet } from "./item/skill-sheet.js";

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
  //index the robotic flag of compendium classes, read synchronously by MothershipActor#isAndroid()
  CONFIG.Item.compendiumIndexFields.push('system.robotic');


  // Register sheet application classes
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet("mosh", MothershipActorSheet, {types: ['character'], makeDefault: true});
  foundry.documents.collections.Actors.registerSheet("mosh", MothershipCreatureSheet, {types: ['creature'], makeDefault: false});
  foundry.documents.collections.Actors.registerSheet("mosh", MothershipShipSheetSBT, {types: ['ship'], makeDefault: true});
  foundry.documents.collections.Actors.registerSheet("mosh", MothershipShipSheet, {types: ['ship'], makeDefault: false});
  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet("mosh", MothershipClassSheet, {types: ['class'], makeDefault: true});
  foundry.documents.collections.Items.registerSheet("mosh", MothershipSkillSheet, {types: ['skill'], makeDefault: true});
  foundry.documents.collections.Items.registerSheet("mosh", MothershipItemSheet, {
    types: [
      "item",
      "weapon",
      "armor",
      "ability",
      "module",
      "condition",
      "crew",
      "repair"
    ], 
    makeDefault: true 
  });

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
     //convert uuid list to names for display.
     Handlebars.registerHelper('UUidListToNames',function(UuidList){
      var names = []
      for(let i=0;i<UuidList.length;i++){
        let object = fromUuidSync(UuidList[i]);
        names.push(object.name);
      }
      return names.join(", ");
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
  
  //load the index fields added in init (e.g. system.robotic) for Item compendiums
  for (const pack of game.packs.filter(p => p.documentName === 'Item')) {
    pack.getIndex();
  }
});

//add custom damage dice for MOSH
Hooks.once('diceSoNiceReady', (dice3d) => {
  dice3d.addColorset(
    {
      name: 'roll',
      description: game.i18n.localize("Mosh.RollDice"),
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
      description: game.i18n.localize("Mosh.DamageDice"),
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
      description: game.i18n.localize("Mosh.PanicDie"),
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

//set initial things when creating an actor
Hooks.on("preCreateActor", (document, createData, options, userId) => {
  console.log("preCreateActor fired for:", createData?.name, createData?.type);

  const disposition =
    createData.type === "creature"
      ? CONST.TOKEN_DISPOSITIONS.HOSTILE
      : CONST.TOKEN_DISPOSITIONS.NEUTRAL;

  // Apply prototype token defaults (v12+)
  document.updateSource({
    "prototypeToken.bar1.attribute": "system.health", // <-- use full system path
    "prototypeToken.bar2.attribute": "system.hits",   // adjust to your schema
    "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
    "prototypeToken.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
    "prototypeToken.disposition": disposition,
    "prototypeToken.name": createData.name
  });

  if (createData.type === "character") {
    document.updateSource({
      "prototypeToken.disposition": CONST.TOKEN_DISPOSITIONS.FRIENDLY,
      "prototypeToken.actorLink": true,
      "prototypeToken.vision": true
    });

    if (game.settings.get("mosh", "useCalm")) {
      document.updateSource({
        "system.other.stress.min": 0,
        "system.other.stress.value": 85,
        "system.other.stress.max": 85,
        "system.other.stress.label": "Calm"
      });
    }
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

    item = foundry.utils.duplicate(actor.getEmbeddedDocument('Item',itemUUID[3]));

  console.log(item);

  if (!item) return ui.notifications.warn(game.i18n.localize("Mosh.OnlyOwnedItemsMacro"));

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
        item = foundry.utils.duplicate(game.user.character.getEmbeddedDocument("Item", itemId));
        //warn if no item
        if (!item) return ui.notifications.warn(game.i18n.format("Mosh.NoItemNamed", {name: itemName}));
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
        item = foundry.utils.duplicate(token.actor.getEmbeddedDocument("Item", itemId));
        //warn if no item
        if (!item) return ui.notifications.warn(game.i18n.format("Mosh.NoItemNamed", {name: itemName}));
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
      errorMessage = game.i18n.localize("Mosh.NoCharacterSelectedCharacterTarget");
    } else if (game.settings.get('mosh','macroTarget') === 'token') {
      errorMessage = game.i18n.localize("Mosh.NoCharacterSelectedTokenTarget");
    }
    //create final dialog data
    const dialogData = {
      window: {title: game.i18n.localize("Mosh.MacroIssue")},
      classes: ["macro-popup-dialog"],
      content: errorMessage,
      buttons: [
        {
          label: game.i18n.localize("Mosh.OK"),
          action: 'action_ok',
          callback: () => { },
          icon: 'fas fa-check'
        }
      ]
    };
    //render dialog
    const dialog = new foundry.applications.api.DialogV2(dialogData).render({force: true});
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
      errorMessage = game.i18n.localize("Mosh.NoShipSelectedCharacterTarget");
    } else if (game.settings.get('mosh','macroTarget') === 'token') {
      errorMessage = game.i18n.localize("Mosh.NoShipSelectedTokenTarget");
    }
    //create final dialog data
    const dialogData = {
      window: {title: game.i18n.localize("Mosh.MacroIssue")},
      classes: ["macro-popup-dialog"],
      content: errorMessage,
      buttons: [
        {
          label: game.i18n.localize("Mosh.OK"),
          action: 'action_ok',
          callback: () => { },
          icon: 'fas fa-check'
        }
      ]
    };
    //render dialog
    const dialog = foundry.applications.api.DialogV2(dialogData).render({force: true});
    //log what was done
    console.log(`Told the user that no character was selected.`);
  });
}


/**
 * get element from world or compendiums by id or UUID, filtering by specific type.
 * @param {string} id_uuid                   The id or the full uuid of the element we want to retieve.
 * @param {object} options                   General search options for this function and for 'fromUuid'
 * @param {string} [options.type]            A string to filter the compendium type to search or the world element type. Valid values =["RollTable","Item","Macro","Actor","Adventure","Cards","JournalEntry","Playlist","Scene"]
 * @returns {Promise<Document|null>}         Returns the Document if it could be found, otherwise null.
 */
export async function fromIdUuid(id_uuid, options={}){
  let type = options.type;
  //first we try to find from UUID, asuming the parameter(id_uuid) is an UUID.
  let item = await fromUuid(id_uuid,options);
  if(item != null){
    //we found the item with the id_uuid, it probably was an uuid.
    return item;
  }

  //we need to manualy find the item
  let currentLocation = '';
  let objectLocation = '';
  //first loop through each compendium
  game.packs.forEach(function(pack){ 
    //is this a pack of rolltables?
    if (pack.metadata.type === type) {
      //log where we are
      currentLocation = pack.metadata.id;
      //loop through each pack to find the right table
      pack.index.forEach(function(pack_item) { 
        //is this our table?
        if (pack_item._id === id_uuid) {
          //grab the table location
          objectLocation = currentLocation;
        }
      });
    }
  });
  if (objectLocation){
    // Item found in a compendium -> get document data
    return await game.packs.get(objectLocation).getDocument(id_uuid);
  }else{
    //if we dont find it in a compendium, its probable a world item:
    //Lets filtery by type to search the relevant elements only.
    switch (type) {
      case "RollTable":
        return getTableFromId(id_uuid);
      case "Item":
        return getItemFromId(id_uuid);
      case "Macro":
        return getMacroFromId(id_uuid);
      case "Actor":
        return getActorFromId(id_uuid);
      case "Adventure":
        //adventures can only be defined in compendiums and not in the world (i think)
        return null;
      case "Cards":
        return getCardFromId(id_uuid);
      case "JournalEntry":
        return getJournalFromId(id_uuid);
      case "Playlist":
        return getPlaylistFromId(id_uuid);
      case "Scene":
        return getSceneFromId(id_uuid);

      default:
        //type is not defined, and we could not find it in a compendium,
        //now we search all world elements for the ID.
        //this could lead to conflicts since ID could not be unique.
        let tableData = getTableFromId(id_uuid);
        if (tableData){
          return tableData;
        }
        let itemData = getItemFromId(id_uuid);
        if (itemData){
          return itemData;
        }
        let macroData = getMacroFromId(id_uuid);
        if (macroData){
          return macroData;
        }
        let actorData = getActorFromId(id_uuid);
        if (actorData){
          return actorData;
        }
        let cardData = getCardFromId(id_uuid);
        if (cardData){
          return cardData;
        }
        let journalData = getJournalFromId(id_uuid);
        if (journalData){
          return journalData;
        }
        let scenneData = getSceneFromId(id_uuid);
        if (scenneData){
          return scenneData;
        }
        let playlistData = getPlaylistFromId(id_uuid);
        if (playlistData){
          return playlistData;
        }
      }
    //if we get here we have not found anything with that id.
    return null;
  }
  /**functions to get world defined elements by type and ID */ 
  function getSceneFromId(sceneId){
    return game.scenes.filter(i=> i.id == sceneId)[0];
  }
  function getPlaylistFromId(playlistId){
    return game.playlists.filter(i=> i.id == playlistId)[0];
  }
  function getJournalFromId(journalId){
    return game.journal.filter(i=> i.id == journalId)[0];
  }
  function getCardFromId(cardId){
    return game.cards.filter(i=> i.id == cardId)[0];
  }
  function getActorFromId(actorId){
    return game.actors.filter(i=> i.id == actorId)[0];
  }
  function getTableFromId(tableId){
    return game.tables.filter(i=> i.id == tableId)[0];
  }
  function getItemFromId(itemId){
    return game.items.filter(i=> i.id == itemId)[0];
  }
  function getMacroFromId(macroId){
    return game.macros.filter(i=> i.id == macroId)[0];
  }

}

/**
 * This function will format a number into a more readable string with appropriate suffixes.
 * For example, 1500 becomes "1.5K", 2000000 becomes "2M", etc.
 * It handles numbers in the trillions (t), billions (b), millions (m), and thousands (k).
 * It also handles negative numbers and zero.
 * At the end it appends 'cr' to denote credits.
 * @namespace formatCreditsNumber
 * @param {int} num Credits number to format.
 * @returns {string}  Credits , formatted string with appropriate suffix.
 */
export function formatCreditsNumber(num) {
  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'tcr';
  } else if (absNum >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'bcr';
  } else if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'mcr';
  } else if (absNum >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'kcr';
  } else {
    return num.toString() + 'cr';
  }
}