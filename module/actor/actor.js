import { fromIdUuid } from "../mosh.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class MothershipActor extends foundry.appv1.Actor {

  //Augment the basic actor data with additional dynamic data.
  prepareData() {
    //console.log(game.release.generation);
    super.prepareData();

    const actorData = this;
    const data = actorData.system;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
    else if (actorData.type === 'creature') this._prepareCreatureData(actorData);
    else if (actorData.type === 'ship') this._prepareShipData(actorData);

  }

  //Prepare Character type specific data
  _prepareCharacterData(actorData) {
    const data = actorData.system;

    let armorPoints = 0;
    let damageReduction = 0;
    const armors = this.getEmbeddedCollection("Item").filter(e => "armor" === e.type);
    
    for (let armor of armors) {
      if (armor.system.equipped) {
        armorPoints += armor.system.armorPoints;
        damageReduction += armor.system.damageReduction;
      }
    }

    data.stats.armor.mod = armorPoints;
    data.stats.armor.total = armorPoints + data.stats.armor.value;
    data.stats.armor.damageReduction = damageReduction;
  }

  //Prepare Creature type specific data
  _prepareCreatureData(actorData) {
    const data = actorData;
  }

  //Prepare Ship type specific data
  _prepareShipData(actorData) {
    const data = actorData;
  }

  //central flavor text library for all chat messages
  getFlavorText(type, context, action) {
    
    //replace 'stress' with calm if the setting is active
    if (game.settings.get("mosh", "useCalm") && context === 'stress') {
      context = 'calm';
    }
    let systemclass = "human";
    if (this.type === 'character' && this.system.class && this.system.class.value.toLowerCase() === "android") {
      systemclass = "android";
      //todo: get the class item for the character to check the "is robotic" flag
    }
    let locString = `Mosh.${type}.${context}.${action}.${systemclass}`;
    //check to see if this address exists in the library, return the action parameter if not
    if(game.i18n.has(locString, true)){ // You can pass false as the second argument to ignore english-language fallback.
        //log what was done
        console.log(`Retrieved flavor text for ${locString}`);
        //return class appropriate text
        return game.i18n.localize(locString);
    } else {
      //log what was done
      console.log(`Using language: ${game.i18n.language}`);
      console.log(`Retrieved flavor text for ${locString}, which did not have an entry`);
      console.log(`Using language: ${game.i18n.lang}`);
      //return what we were asked
      return action;
    }
  }

  //central roll parsing function | TAKES '1d10 [+]','low' | RETURNS '{1d10,1d10}kh'
  parseRollString(rollString, aimFor) {
    //init vars
    let rollDice = ``;
    let rollTemplate = ``;
    let rollStringParsed = ``;
    //translate rollString into foundry roll string format
    if (rollString.includes('[')) {
      //extract dice needed
      rollDice = rollString.substr(0, rollString.indexOf('[')).trim().concat(',', rollString.substr(0, rollString.indexOf('[')).trim());
      //set template based on adv or dis
      if (rollString.includes('[-]')) {
        //use appropriate keep setting
        if (aimFor === 'low') {
          rollTemplate = '{[diceSet]}kh';
        } else {
          rollTemplate = '{[diceSet]}kl';
        }
      } else if (rollString.includes('[+]')) {
        //use appropriate keep setting
        if (aimFor === 'low') {
          rollTemplate = '{[diceSet]}kl';
        } else {
          rollTemplate = '{[diceSet]}kh';
        }
      }
      //make foundry roll string
      rollStringParsed = rollTemplate.replace('[diceSet]', rollDice);
    } else {
      rollStringParsed = rollString;
    }
    //log what was done
    console.log(`Parsed '${rollString}' aiming '${aimFor}' into '${rollStringParsed}'`);
    //return string in foundry format
    return rollStringParsed;
  }

  //central roll parsing function | TAKES '1d100',[Foundry roll object],true,true,41,'<' | RETURNS enriched Foundry roll object
  parseRollResult(rollString, rollResult, zeroBased, checkCrit, rollTarget, comparison, specialRoll) {
    //init vars
    let doubles = new Set([0, 11, 22, 33, 44, 55, 66, 77, 88, 99]);
    let enrichedRollResult = rollResult;
    let rollFormula = enrichedRollResult.formula;
    let rollAim = rollFormula.substr(rollFormula.indexOf("}") + 1, 2);
    let useCalm = game.settings.get('mosh', 'useCalm');
    let die0value = 999;
    let die1value = 999;
    let die0success = false;
    let die1success = false;
    let die0crit = false;
    let die1crit = false;
    let newTotal = 999;
    let diceFormula = ``;
    let compareIcon = ``;
    let outcome = ``;
    let outcomeHtml = ``;
    let diceIcon = ``;
    let diceBlock = ``;
    let critHighlight = ``;
    let rollHtml = ``;
    //init new fields in enriched roll result
    enrichedRollResult.critical = false;
    enrichedRollResult.success = false;
    enrichedRollResult.outcomeHtml = ``;
    enrichedRollResult.rollHtml = ``;
    //alter roll result object
      //change data point: change each 100 or 10 result to zero
      if (zeroBased) {
        //1d10 changes
      if (rollString.substr(0, rollString.indexOf("[")).trim() === '1d10' || rollString === '1d10' || rollString.substr(0, rollString.indexOf("[")).trim() === '-1d10' || rollString === '-1d10') {
          //loop through dice
        enrichedRollResult.dice.forEach(function (roll) {
            //loop through each result
          roll.results.forEach(function (die) {
              //change any 10s to 0s
            if (die.result === 10 || die.result === -10) {
              die.result = 0;
            }
            });
          });
        //1d100 changes
      } else if (rollString.substr(0, rollString.indexOf("[")).trim() === '1d100' || rollString === '1d100' || rollString.substr(0, rollString.indexOf("[")).trim() === '-1d100' || rollString === '-1d100') {
          //loop through dice
        enrichedRollResult.dice.forEach(function (roll) {
            //loop through each result
          roll.results.forEach(function (die) {
              //change any 100s to 0s
            if (die.result === 100 || die.result === -100) {
              die.result = 0;
            }
            });
          });
        }
      }
      //set roll A and B
    if (enrichedRollResult.dice[0]) {
      die0value = enrichedRollResult.dice[0].results[0].result;
    }
    if (enrichedRollResult.dice[1]) {
      die1value = enrichedRollResult.dice[1].results[0].result;
    }
      //do we need to pick a winner?
      if (rollString.includes("[")) {
        //set whether each die succeeded
          //die 0
      if (comparison === '<' && die0value < rollTarget && die0value < 90) {
        die0success = true;
      }
      if (comparison === '<=' && die0value <= rollTarget && die0value < 90) {
        die0success = true;
      }
      if (comparison === '>' && die0value > rollTarget && die0value < 90) {
        die0success = true;
      }
      if (comparison === '>=' && die0value >= rollTarget && die0value < 90) {
        die0success = true;
      }
          //die 1
      if (comparison === '<' && die1value < rollTarget && die1value < 90) {
        die1success = true;
      }
      if (comparison === '<=' && die1value <= rollTarget && die1value < 90) {
        die1success = true;
      }
      if (comparison === '>' && die1value > rollTarget && die1value < 90) {
        die1success = true;
      }
      if (comparison === '>=' && die1value >= rollTarget && die1value < 90) {
        die1success = true;
      }
        //set whether each die are a crit
          //die 0
      if (checkCrit && doubles.has(die0value)) {
        die0crit = true;
      }
          //die 1
      if (checkCrit && doubles.has(die1value)) {
        die1crit = true;
      }
        //if [-] pick a new worst number
        if (rollString.includes("[-]")) {
          //if we are trying to keep the highest
        if (rollAim === 'kh') {
            //set default result value to the highest value
          newTotal = Math.max(die0value, die1value);
            //if both are a success and only dice 0 is a crit: don't pick the crit
          if (die0success && die1success && die0crit && !die1crit) {
            newTotal = die1value;
          }
            //if both are a success and only dice 1 is a crit: don't pick the crit
          if (die0success && die1success && !die0crit && die1crit) {
            newTotal = die0value;
          }
            //if both are a failure and only dice 0 is a crit: pick the crit
          if (!die0success && !die1success && die0crit && !die1crit) {
            newTotal = die0value;
          }
            //if both are a failure and only dice 1 is a crit: pick the crit
          if (!die0success && !die1success && !die0crit && die1crit) {
            newTotal = die1value;
          }
            //if this is a panic check and both are a failure: pick the worst
          if (specialRoll === 'panicCheck' && !useCalm && !die0success && !die1success) {
            newTotal = Math.max(die0value, die1value);
          }
          }
          //if we are trying to keep the lowest
        if (rollAim === 'kl') {
            //set default result value to the lowest value
          newTotal = Math.min(die0value, die1value);
            //if both are a success and only dice 0 is a crit: don't pick the crit
          if (die0success && die1success && die0crit && !die1crit) {
            newTotal = die1value;
          }
            //if both are a success and only dice 1 is a crit: don't pick the crit
          if (die0success && die1success && !die0crit && die1crit) {
            newTotal = die0value;
          }
            //if both are a failure and only dice 0 is a crit: pick the crit
          if (!die0success && !die1success && die0crit && !die1crit) {
            newTotal = die0value;
          }
            //if both are a failure and only dice 1 is a crit: pick the crit
          if (!die0success && !die1success && !die0crit && die1crit) {
            newTotal = die1value;
          }
            //if this is a panic check and both are a failure: pick the worst
          if (specialRoll === 'panicCheck' && !useCalm && !die0success && !die1success) {
            newTotal = Math.max(die0value, die1value);
          }
          }
        }
        //if [+] pick a new best number
        if (rollString.includes("[+]")) {
          //if we are trying to keep the highest
        if (rollAim === 'kh') {
            //set default result value to the highest value
          newTotal = Math.max(die0value, die1value);
            //if both are a success and only dice 0 is a crit: pick the crit
          if (die0success && die1success && die0crit && !die1crit) {
            newTotal = die0value;
          }
            //if both are a success and only dice 1 is a crit: pick the crit
          if (die0success && die1success && !die0crit && die1crit) {
            newTotal = die1value;
          }
            //if both are a failure and only dice 0 is a crit: don't pick the crit
          if (!die0success && !die1success && die0crit && !die1crit) {
            newTotal = die1value;
          }
            //if both are a failure and only dice 1 is a crit: don't pick the crit
          if (!die0success && !die1success && !die0crit && die1crit) {
            newTotal = die0value;
          }
            //if this is a panic check and both are a failure: pick the best
          if (specialRoll === 'panicCheck' && !useCalm && !die0success && !die1success) {
            newTotal = Math.min(die0value, die1value);
          }
          }
          //if we are trying to keep the lowest
        if (rollAim === 'kl') {
            //set default result value to the lowest value
          newTotal = Math.min(die0value, die1value);
            //if both are a success and only dice 0 is a crit: pick the crit
          if (die0success && die1success && die0crit && !die1crit) {
            newTotal = die0value;
          }
            //if both are a success and only dice 1 is a crit: pick the crit
          if (die0success && die1success && !die0crit && die1crit) {
            newTotal = die1value;
          }
            //if both are a failure and only dice 0 is a crit: don't pick the crit
          if (!die0success && !die1success && die0crit && !die1crit) {
            newTotal = die1value;
          }
            //if both are a failure and only dice 1 is a crit: don't pick the crit
          if (!die0success && !die1success && !die0crit && die1crit) {
            newTotal = die0value;
          }
            //if this is a panic check and both are a failure: pick the best
          if (specialRoll === 'panicCheck' && !useCalm && !die0success && !die1success) {
            newTotal = Math.min(die0value, die1value);
          }
          }
        }
      //we don't need to pick a winner
      } else {
        //set result value to the only die
        newTotal = die0value;
      }
      //set final total value - apply negative for negative rolls
    if (rollString.substr(0, 1) === '-') {
        enrichedRollResult._total = newTotal * -1;
      } else {
        enrichedRollResult._total = newTotal;
      }
    //enrich roll result object
      //add data point: detect critical 
      if (checkCrit) {
        //check for crit
        if (doubles.has(enrichedRollResult.total)) {
          enrichedRollResult.critical = true;
        } else {
          enrichedRollResult.critical = false;
        }
      }
      //add data point: detect success/failure
      if (rollTarget || rollTarget === 0) {
        //check for auto failure
        if (enrichedRollResult.total >= 90) {
          //result >= 90 is a failure
          enrichedRollResult.success = false;
        } else {
          //compare values based on compararison setting
          if (comparison === '<') {
            //check against being under the target
            if (enrichedRollResult.total < rollTarget) {
              enrichedRollResult.success = true;
            } else {
              enrichedRollResult.success = false;
            }
          } else if (comparison === '<=') {
            //check against being under or equal to the target
            if (enrichedRollResult.total <= rollTarget) {
              enrichedRollResult.success = true;
            } else {
              enrichedRollResult.success = false;
            }
          } else if (comparison === '>') {
            //check against being over the target
            if (enrichedRollResult.total > rollTarget) {
              enrichedRollResult.success = true;
            } else {
              enrichedRollResult.success = false;
            }
          } else if (comparison === '>=') {
            //check against being over or equal to the target
            if (enrichedRollResult.total >= rollTarget) {
              enrichedRollResult.success = true;
            } else {
              enrichedRollResult.success = false;
            }
          }
        }
        //add data point: outcome HTML
          //prepare outcome
            //success
            if (enrichedRollResult.success) {
              outcome = `SUCCESS!`;
            } else {
              outcome = `FAILURE!`;
            }
            //crit
            if (enrichedRollResult.critical) {
              outcome = `CRITICAL ` + outcome;
            }
          //make HTML
          outcomeHtml = `
            <div style="font-size: 1.1rem; margin-top : -10px; margin-bottom : 5px;">
              <strong>${outcome}</strong>
            </div>
          `;
          //update final roll html string
          enrichedRollResult.outcomeHtml = outcomeHtml;
      }
      //add data point: interactive roll HTML
        //prepare variables
          //make comparison icon
          if (comparison === '<') {
            compareIcon = '<i class="fas fa-less-than"></i>';
          } else if (comparison === '<=') {
            compareIcon = '<i class="fas fa-less-than-equal"></i>';
          } else if (comparison === '>') {
            compareIcon = '<i class="fas fa-greater-than"></i>';
          } else if (comparison === '>=') {
            compareIcon = '<i class="fas fa-greater-than-equal"></i>';
          }
          //prepare formula
          if (rollTarget) {
            //show dice against target
            diceFormula = rollString + ' ' + compareIcon + ' ' + rollTarget;
          } else {
            //just show the dice
            diceFormula = rollString;
          }
          //prepare dice block
            //loop through rolls
    enrichedRollResult.dice.forEach(function (roll) {
              //add header for this roll
              diceBlock = diceBlock + `
                <section class="tooltip-part">
                  <div class="dice">
              `;
              //add formula and result for this roll
              diceBlock = diceBlock + `
                <header class="part-header flexrow">
                  <span class="part-formula">${roll.formula}</span>
                  <span class="part-total">${roll.total.toString()}</span>
                </header>
                <ol class="dice-rolls">
              `;
              //loop through dice
      roll.results.forEach(function (die) {
                //set highlight if crit is asked for
                if (checkCrit) {
                  //check for crit
                  if (doubles.has(die.result)) {
                    //check for success
                    if (rollTarget) {
                      //check for auto failure
                      if (die.result >= 90) {
                        //result >= 90 is a failure, no highlight needed
                        critHighlight = ' min';
                      } else {
                        //check against beating the target
                if (comparison === '<' && die.result < rollTarget) {
                  critHighlight = ' max';
                } else if (comparison === '<=' && die.result <= rollTarget) {
                  critHighlight = ' max';
                } else if (comparison === '>' && die.result > rollTarget) {
                  critHighlight = ' max';
                } else if (comparison === '>=' && die.result >= rollTarget) {
                  critHighlight = ' max';
                } else {
                  critHighlight = ' min';
                }
                      }
                    }
                  } else {
                    //no highlight needed
                    critHighlight = '';
                  }
                } else {
                  //no highlight needed
                  critHighlight = '';
                }
                //prepare dice icon
                if (roll.faces === 100 || roll.faces === 5) {
                  diceIcon = `10`;
                } else {
                  diceIcon = roll.faces.toString();
                }
                //add formula and result for this die
                diceBlock = diceBlock + `
                      <li class="roll die d${diceIcon}${critHighlight}">${die.result.toString()}</li>
                `;
              });
              //add footer for this roll
              diceBlock = diceBlock + `
                    </ol>
                  </div>
                </section>
              `;
            });
        //set final roll variables in to template
        rollHtml = `
          <div class="dice-roll" style="margin-bottom: 10px;">
            <div class="dice-result">
              <div class="dice-formula">${diceFormula}</div>
              <div class="dice-tooltip" style="display: none;">
                ${diceBlock}
              </div>
              <h4 class="dice-total">${enrichedRollResult.total}</h4>
            </div>
          </div>
        `;
        //update final roll html string
        enrichedRollResult.rollHtml = rollHtml;
    //log what was done
    console.log(`Enriched the standard roll result. rollString: ${rollString},rollResult: ${rollResult},zeroBased: ${zeroBased},checkCrit: ${checkCrit},rollTarget: ${rollTarget},comparison: ${comparison},specialRoll: ${specialRoll}`);
    console.log(enrichedRollResult);
    //return the enriched roll result object
    return enrichedRollResult;
  }

  //A script to return the data from a table.
  async getRollTableData(tableId){

    let tableData = await fromIdUuid(tableId,{type:"RollTable"});
    //get table name
    let tableName = tableData.name;
    //get table name
    let tableImg = tableData.img;
    //get table result
    let tableDie = tableData.formula.replace('-1', '');

    return tableData;
  }

  //central table rolling function | TAKES 'W36WFIpCfMknKgHy','1d10','low',true,true,41,'<' | RETURNS chat message showing roll table result
  async rollTable(tableId, rollString, aimFor, zeroBased, checkCrit, rollAgainst, comparison) {
    //init vars
    let currentLocation = '';
    let tableLocation = '';
    let messageTemplate = ``;
    let messageContent = ``;
    let msgDesc = ``;
    let flavorText = ``;
    let woundText = ``;
    let tableResultType = ``;
    let tableResultEdited = ``;
    let tableResultFooter = ``;
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID() : randomID())
    let rollTarget = null;
    let valueAddress = [];
    let specialRoll = null;
    let firstEdition = game.settings.get('mosh', 'firstEdition');
    let useCalm = game.settings.get('mosh', 'useCalm');
    let androidPanic = game.settings.get('mosh', 'androidPanic');
    let tableResultNumber = null;
    let secondRoll = false;
    let rollResult2 = null;
    let parsedRollResult2 = null;
    //customize this roll if its a unique use-case
      //panic check
      if (tableId === 'panicCheck') {
        //set special roll value for use later
        specialRoll = tableId;
        //assign variables depending on settings
        if (firstEdition) { 
          if (androidPanic && this.system.class.value.toLowerCase() === 'android') { 
            if (useCalm) {
            tableId = game.settings.get('mosh', 'table1ePanicCalmAndroid');
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
            tableId = game.settings.get('mosh', 'table1ePanicStressAndroid');
              aimFor = 'high';
              zeroBased = false;
              checkCrit = false;
              rollAgainst = 'system.other.stress.value';
              comparison = '>';
            }
          } else {
            if (useCalm) { 
            tableId = game.settings.get('mosh', 'table1ePanicCalmNormal');
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
            tableId = game.settings.get('mosh', 'table1ePanicStressNormal');
              aimFor = 'high';
              zeroBased = false;
              checkCrit = false;
              rollAgainst = 'system.other.stress.value';
              comparison = '>';
            }
          }
        } else {
          if (androidPanic && this.system.class.value.toLowerCase() === 'android') { 
            if (useCalm) { 
            tableId = game.settings.get('mosh', 'table0ePanicCalmAndroid');
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
            tableId = game.settings.get('mosh', 'table0ePanicStressAndroid');
              aimFor = 'high';
              zeroBased = false;
              checkCrit = false;
              rollAgainst = 'system.other.stress.value';
              comparison = '>';
            }
          } else {
            if (useCalm) { 
            tableId = game.settings.get('mosh', 'table0ePanicCalmNormal');
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
            tableId = game.settings.get('mosh', 'table0ePanicStressNormal');
              aimFor = 'high';
              zeroBased = false;
              checkCrit = false;
              rollAgainst = 'system.other.stress.value';
              comparison = '>';
            }
          }
        }
        //assign rollString if its a partial
        if (rollString === '[-]' || rollString === '' || rollString === '[+]') {
          //if 1e and no calm, then 1d20
        if (firstEdition && !useCalm) {
          rollString = '1d20' + rollString;
        }
          //if 0e and no calm, then 2d10
        if (!firstEdition && !useCalm) {
          rollString = '2d10' + rollString;
        }
          //if calm, then 1d100
        if (useCalm) {
          rollString = '1d100' + rollString;
        }
        }
      }
      //maintenance check
      if (tableId === 'maintenanceCheck') {
        //set special roll value for use later
        specialRoll = tableId;
        //assign variables
      tableId = game.settings.get('mosh', 'table1eMaintenance');
        zeroBased = true;
        checkCrit = true;
        rollAgainst = 'system.stats.systems.value';
        comparison = '<';
      }
    //bounce this request away if certain parameters are NULL
      //if rollString is STILL blank, redirect player to choose the roll
      if (!rollString) {
        //init vars
        let rollDie = '';
        //set rollDie
          //if 1e and no calm, then 1d20
      if (firstEdition) {
        rollDie = '1d20';
      }
          //if 0e and no calm, then 2d10
      if (!firstEdition) {
        rollDie = '2d10';
      }
          //if calm, then 1d100
      if (useCalm) {
        rollDie = '1d100';
      }
        //run the choose attribute function
      let chosenRollType = await this.chooseAdvantage( game.i18n.localize("Mosh.PanicCheck"), rollDie);
        //set variables
        rollString = chosenRollType[0];
      }

      let tableData = await fromIdUuid(tableId,{type:"RollTable"});
      //get current compendium
      //get table name
      let tableName = tableData.name;
      //get table name
      let tableImg = tableData.img;
      //get table result
    let tableDie = tableData.formula.replace('-1', '');
    //if rollString is STILL blank, redirect player to choose the roll
    if (!rollString) {
      //run the choose attribute function
      let chosenRollType = await this.chooseAdvantage(tableName, tableDie);
      //set variables
      rollString = chosenRollType[0];
    }
    //table specific customizations
      //if a table has details in parenthesis, lets remove them
      if (tableName.includes(' (')) {
        //extract dice needed
      tableName = tableName.substr(0, tableName.indexOf(' ('));
      }
      //if a wound table, add a wound to the player and prepare text for the final message
      if (tableName.slice(-5) === 'Wound') {
      let addWound = await this.modifyActor('system.hits.value', 1, null, false);
        woundText = addWound[1];
      }
    //pull stat to roll against, if needed
    if (rollAgainst || rollAgainst === 0) {
      //turn string address into array
      valueAddress = rollAgainst.split('.');
      //set rollTarget
      rollTarget = valueAddress.reduce((a, v) => a[v], this);
    }
    //roll the dice
      //parse the roll string
    let parsedRollString = this.parseRollString(rollString, aimFor);
    if (game.settings.get('mosh', 'panicDieTheme') != "") { //We're going to check if the theme field is blank. Otherwise, don't use this.
        //set panic die color
      let dsnTheme = game.settings.get('mosh', 'panicDieTheme');
        //apply theme if this is a panic check
        if (tableName === 'Panic Check') {
          parsedRollString = parsedRollString + '[' + dsnTheme + ']';
        }
     }
      //roll the dice
      let rollResult = await new Roll(parsedRollString).evaluate();
      //interpret the results
    let parsedRollResult = this.parseRollResult(rollString, rollResult, zeroBased, checkCrit, rollTarget, comparison, specialRoll);
    //if this is a panic check, we may need to roll again OR add modifiers to our result total
      //roll a second die if needed
      if (!parsedRollResult.success && specialRoll === 'maintenanceCheck' && !firstEdition && !useCalm) {
        //determine the rollString
        let rollString2 = '2d10';
        //add modifiers if needed
          //0e modifier: + Stress - Resolve
          if (specialRoll === 'maintenanceCheck' && !firstEdition && !useCalm) {
            rollString2 = rollString2 + ' + ' + this.system.other.stress.value + ' - ' + this.system.other.resolve.value
          }
          //Calm modifier: + Stress - Resolve
          if (specialRoll === 'panicCheck' && useCalm) {
            rollString2 = rollString2 + ' + ' + this.system.other.resolve.value
          }
        //roll second dice
        rollResult2 = await new Roll(rollString2).evaluate();
        //roll second set of dice
      parsedRollResult2 = this.parseRollResult(rollString2, rollResult2, false, false, null, null, specialRoll);
        //set marker for HTML
        secondRoll = true;
        //set table result number
        tableResultNumber = parsedRollResult2.total
      }
    //if this is a maintenance check, we need to roll again if a failure
      //roll a second die if needed
      if (!parsedRollResult.success && specialRoll === 'maintenanceCheck' && firstEdition) {
        //determine the rollString
        let rollString2 = '1d100';
        //roll second dice
        rollResult2 = await new Roll(rollString2).evaluate();
        //roll second set of dice
      parsedRollResult2 = this.parseRollResult(rollString2, rollResult2, true, false, null, null, specialRoll);
        //set marker for HTML
        secondRoll = true;
        //set table result number
        tableResultNumber = parsedRollResult2.total;
        //log second die
        console.log(`Rolled second die`);
      }
    //set table result number if null
    if (!tableResultNumber) {
      tableResultNumber = parsedRollResult.total;
    }
    //fetch the table result
    let tableResult = tableData.getResultsForRoll(tableResultNumber);
    //make any custom changes to chat message
      //panic check #19 customiziation
      if (tableName === 'Panic Check' && tableResultNumber === 19) {
        if (this.system.class.value.toLowerCase() === 'android') {
        tableResultEdited = tableResult[0].text.replace(game.i18n.localize("Mosh.HEARTATTACKSHORTCIRCUITANDROIDS"), game.i18n.localize("Mosh.SHORTCIRCUIT"));
        } else {
        tableResultEdited = tableResult[0].text.replace(game.i18n.localize("Mosh.HEARTATTACKSHORTCIRCUITANDROIDS"), game.i18n.localize("Mosh.HEARTATTACK"));
        }
      }
    //assign message description text
    msgDesc = this.getFlavorText('table', tableName.replaceAll('& ', '').replaceAll(' ', '_').toLowerCase(), 'roll');
    //assign flavor text
      //get main flavor text
    flavorText = this.getFlavorText('table', tableName.replaceAll('& ', '').replaceAll(' ', '_').toLowerCase(), 'success');
      //append 0e crit success effect
      if (!firstEdition && !useCalm && parsedRollResult.success && parsedRollResult.critical) {
      flavorText = flavorText + game.i18n.localize("Mosh.Relieve1Stressqbq694JMbXeZrHj");
      }
      //append Calm effects for Critical Panic Success
      if (useCalm && parsedRollResult.success && parsedRollResult.critical) {
      flavorText = flavorText + game.i18n.localize("Mosh.Gain1d10Calmk2TtLFOG9mGaWVx31d10Calm");
      }
      //append Calm effects for Critical Panic Failure
      if (useCalm && !parsedRollResult.success && parsedRollResult.critical) {
        tableResultFooter = `<br><br>You lose 1d10 Calm because you critically failed.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.jHyqXb2yDFTNWxpy]{-1d10 Calm}`;
      }
      //append effects for Stress + Maintenance Check Failure
      if (specialRoll === 'maintenanceCheck' && !useCalm && !parsedRollResult.success && !parsedRollResult.critical) {
        tableResultFooter = `<br><br>Everyone on board the ship takes 1 Stress.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.dvJR9DYXI2kV0BbR]{+1 Stress}`;
      }
      //append effects for Stress + Critical Maintenance Check Failure
      if (specialRoll === 'maintenanceCheck' && !useCalm && !parsedRollResult.success && parsedRollResult.critical) {
        tableResultFooter = `<br><br>Everyone on board the ship takes 1 Stress. You must roll for another maintenance issue because you critically failed.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.dvJR9DYXI2kV0BbR]{+1 Stress}<br><br>@UUID[Compendium.mosh.macros_triggered_1e.hRapiXGVW8WZQH12]{Roll for Maintenance Issue}`;
      }
      //append effects for Calm + Maintenance Check Failure
      if (specialRoll === 'maintenanceCheck' && useCalm && !parsedRollResult.success && !parsedRollResult.critical) {
        tableResultFooter = `<br><br>Everyone on board the ship loses 1d10 Calm.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.jHyqXb2yDFTNWxpy]{-1d10 Calm}`;
      }
      //append effects for Calm + Critical Maintenance Check Failure
      if (specialRoll === 'maintenanceCheck' && useCalm && !parsedRollResult.success && parsedRollResult.critical) {
        tableResultFooter = `<br><br>Everyone on board the ship loses 1d10 Calm. You must roll for another maintenance issue because you critically failed.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.jHyqXb2yDFTNWxpy]{-1d10 Calm}<br><br>@UUID[Compendium.mosh.macros_triggered_1e.hRapiXGVW8WZQH12]{Roll for Maintenance Issue}`;
      }
      //append effects for Calm + Critical Maintenance Check Success
      if (specialRoll === 'maintenanceCheck' && useCalm && parsedRollResult.success && parsedRollResult.critical) {
        flavorText = flavorText + ` Gain 1d10 Calm.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.k2TtLFOG9mGaWVx3]{+1d10 Calm}`;
      }
    //set table result type (using first value)
    if (tableResult[0].type === 0 || tableResult[0].type === 'text') {
      tableResultType = `text`;
    } else if (tableResult[0].type === 1 || tableResult[0].type === 'document') {
      tableResultType = `document`;
    } else {
      tableResultType = `unknown`;
    }
	  //generate chat message
      //prepare data
      let messageData = {
        actor: this,
        tableResult: tableResult,
        tableResultType: tableResultType,
        tableResultEdited: tableResultEdited,
        tableResultFooter: tableResultFooter,
        parsedRollResult: parsedRollResult,
        tableName: tableName,
        tableImg: tableImg,
        msgDesc: msgDesc,
        flavorText: flavorText,
        woundText: woundText,
        secondRoll: secondRoll,
        parsedRollResult2: parsedRollResult2,
        specialRoll: specialRoll
      };
      //prepare template
      messageTemplate = 'systems/mosh/templates/chat/rollTable.html';
      //render template
      messageContent = await renderTemplate(messageTemplate, messageData);
      //make message
      let macroMsg = await rollResult.toMessage({
        id: chatId,
        user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      },
        content: messageContent
    }, {
      keepId: true
    });
    if (game.modules.get("dice-so-nice").active) {
        //log what was done
        console.log(`Rolled on table ID: ${tableId}, with: rollString:${rollString}, aimFor:${aimFor}, zeroBased:${zeroBased}, checkCrit:${checkCrit}, rollAgainst:${rollAgainst}, comparison:${comparison}`);
        //return messageData
        return [messageData];
        //wait for dice
        await game.dice3d.waitFor3DAnimationByMessageID(chatId);
      }
    //will come back later to do optional chat message  
      ////log what was done
      //console.log(`Rolled on table ID: ${tableId}, with: rollString:${rollString}, aimFor:${aimFor}, zeroBased:${zeroBased}, checkCrit:${checkCrit}, rollAgainst:${rollAgainst}, comparison:${comparison}`);
      ////return messageData
      //return [messageData];
  }

  //central adding addribute function | TAKES '1d10','low' | RETURNS player selected attribute. If parameters are null, it asks the player.
  async chooseAttribute(rollString, aimFor) {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //init vars
      let playerItems = this.items;
      let attribute = ``;
      let skill = ``;
      let skillValue = 0;
      let buttonDesc = ``;
      //create HTML for this window
        //header
      let dialogDesc = await renderTemplate('systems/mosh/templates/dialogs/skill-check-stat-selection-dialog.html');
        //create button header if needed
        if (!rollString) {
        buttonDesc = `<h4>` + game.i18n.localize("Mosh.SelectYourRollType") + `:</h4>`;
        } else {
          buttonDesc = ``;
        }
      //create final dialog data
      const dialogData = {
        window: {title: game.i18n.localize("Mosh.ChooseAStat")},
        position: {width: 600,height: 500},
        content: dialogDesc + buttonDesc,
        buttons: []
      };
      //add adv/normal/dis buttons if we need a rollString
      if (!rollString) {
        //we need to generate a roll string
        dialogData.buttons = [
          {
            label: game.i18n.localize("Mosh.Advantage"),
            action: `action_advantage`,
            callback: (event, button, dialog) => {
              rollString = `1d100 [+]`;
              aimFor = `low`;
              attribute = button.form.querySelector("input[name='stat']:checked")?.getAttribute("value");
              resolve([rollString, aimFor, attribute]);
              console.log(`User left the chooseAttribute dialog with: rollString:${rollString}, aimFor:${aimFor}, attribute:${attribute}`);
            },
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Normal"),
			      action: `action_normal`,
            callback: (event, button, dialog) => {
              rollString = `1d100`;
              aimFor = `low`;
              attribute = button.form.querySelector("input[name='stat']:checked")?.getAttribute("value");
              resolve([rollString, aimFor, attribute]);
              console.log(`User left the chooseAttribute dialog with: rollString:${rollString}, aimFor:${aimFor}, attribute:${attribute}`);
            },
            icon: `<i class="fas fa-minus"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Disadvantage"),
			      action: `action_disadvantage`,
            callback: (event, button, dialog) => {
              rollString = `1d100 [-]`;
              aimFor = `low`;
              attribute = button.form.querySelector("input[name='stat']:checked")?.getAttribute("value");
              resolve([rollString, aimFor, attribute]);
              console.log(`User left the chooseAttribute dialog with: rollString:${rollString}, aimFor:${aimFor}, attribute:${attribute}`);
            },
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        ]
      //add a next button if we dont need a rollString
      } else {
        dialogData.buttons = [
          {
            label: game.i18n.localize("Mosh.Next"),
			      action: `action_next`,
            callback: (event, button, dialog) => {
              aimFor = `low`;
              attribute = button.form.querySelector("input[name='stat']:checked")?.getAttribute("value");
              resolve([rollString, aimFor, attribute]);
              console.log(`User left the chooseAttribute dialog with: rollString:${rollString}, aimFor:${aimFor}, attribute:${attribute}`);
            },
            icon: `<i class="fas fa-chevron-circle-right"></i>`
          }
        ]
      }
      //render dialog
      const dialog = new foundry.applications.api.DialogV2(dialogData).render({force: true});
    });
  }

  //central adding skill function | TAKES '1d10','low' | RETURNS player selected skill + value. If parameters are null, it asks the player.
  async chooseSkill(dlgTitle, rollString) {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //init vars
      let playerItems = this.items;
      let skill = ``;
      let skillValue = 0;
      let buttonDesc = ``;
      //create HTML for this window
        //header
        let skillHeader = await renderTemplate('systems/mosh/templates/dialogs/choose-skill-dialog-header.html');
        //skill template
        let skillRow = `
        <label for="[RADIO_ID]">
        <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
          <div class="grid grid-4col" style="grid-template-columns: 20px 60px 45px auto">
            <input type="radio" id="[RADIO_ID]" name="skill" value="[RADIO_VALUE]">
            <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="[RADIO_IMG]" style="border:none"/></div>
            <div class="macro_desc" style="display: table;">
              <span style="display: table-cell; vertical-align: middle; color: #888; font-weight:500; font-size: 14pt">
                +[RADIO_BONUS]
              </span>
            </div> 
            <div class="macro_desc" style="display: table;">
              <span style="display: table-cell; vertical-align: middle;">
                <p><strong>[RADIO_NAME]</strong>[RADIO_DESC]
              </span>
            </div>    
          </div>
        </div>
        </label>`;
        //make list of skill using template
          //create skillList string
          let skillList = ``;
          //create skill counter
          let skillCount = 0;
          //create dialog pixel counter
          let dialogHeight = 232;
          //loop through and create skill rows
          for (let item of playerItems) {
            //check if this is a skill
            if (item.type === "skill") {
              //set temprow as template
              let tempRow = skillRow;
              //replace ID
              tempRow = tempRow.replaceAll("[RADIO_ID]", item.name);
              //replace value
              tempRow = tempRow.replace("[RADIO_VALUE]", item.system.bonus);
              //replace img
              tempRow = tempRow.replace("[RADIO_IMG]", item.img);
              //replace name
              tempRow = tempRow.replace("[RADIO_BONUS]", item.system.bonus);
              //replace name
              tempRow = tempRow.replace("[RADIO_NAME]", item.name);
              //replace desc
              tempRow = tempRow.replace("[RADIO_DESC]", item.system.description.replace("<p>", "<strong>:</strong> "));
              //add to skillList
              skillList = skillList + tempRow;
              //increment skill count
              skillCount++;
              //increment pixel counter
              dialogHeight = dialogHeight + 77;
            }
          }
          //check if there are no skills, and adjust prompt height accordingly
          if (skillCount === 0) {
            //set window height
            dialogHeight = 125;
            //make skill header blank
            skillHeader = ``;
          }
        //create button header if needed
        if (!rollString) {
          buttonDesc = `<h4>` + game.i18n.localize("Mosh.SelectYourRollType") + `:</h4>`;
        } else {
          buttonDesc = ``;
        }
      //create final dialog data
      const dialogData = {
        window: {title: dlgTitle},
        position: {width: 600,height: dialogHeight},
        content: skillHeader + skillList + buttonDesc,
        buttons: []
      };
      //add adv/normal/dis buttons if we need a rollString
      if (!rollString) {
        //we need to generate a roll string
        dialogData.buttons = [
          {
            label: game.i18n.localize("Mosh.Advantage"),
            action: `action_advantage`,
            callback: (event, button, dialog) => {
              rollString = `1d100 [+]`;
              skill = button.form.querySelector("input[name='skill']:checked")?.getAttribute("id");
              skillValue = button.form.querySelector("input[name='skill']:checked")?.getAttribute("value");
              resolve([rollString, skill, skillValue]);
              console.log(`User left the chooseSkill dialog with: rollString:${rollString}, skill:${skill}, skillValue:${skillValue}`);
            },
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Normal"),
            action: `action_normal`,
            callback: (event, button, dialog) => {
              rollString = `1d100`;
              skill = button.form.querySelector("input[name='skill']:checked")?.getAttribute("id");
              skillValue = button.form.querySelector("input[name='skill']:checked")?.getAttribute("value");
              resolve([rollString, skill, skillValue]);
              console.log(`User left the chooseSkill dialog with: rollString:${rollString}, skill:${skill}, skillValue:${skillValue}`);
            },
            icon: `<i class="fas fa-minus"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Disadvantage"),
            action: `action_disadvantage`,
            callback: (event, button, dialog) => {
              rollString = `1d100 [-]`;
              skill = button.form.querySelector("input[name='skill']:checked")?.getAttribute("id");
              skillValue = button.form.querySelector("input[name='skill']:checked")?.getAttribute("value");
              resolve([rollString, skill, skillValue]);
              console.log(`User left the chooseSkill dialog with: rollString:${rollString}, skill:${skill}, skillValue:${skillValue}`);
            },
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        ]
      //add a next button if we dont need a rollString
      } else {
        dialogData.buttons = [
          {
            label: game.i18n.localize("Mosh.Next"),
			      action: `action_next`,
            callback: (event, button, dialog) => {
              skill = button.form.querySelector("input[name='skill']:checked")?.getAttribute("id");
              skillValue = button.form.querySelector("input[name='skill']:checked")?.getAttribute("value");
              resolve([rollString, skill, skillValue]);
              console.log(`User left the chooseSkill dialog with: rollString:${rollString}, skill:${skill}, skillValue:${skillValue}`);
            },
            icon: `<i class="fas fa-chevron-circle-right"></i>`
          }
        ]
      }
      //render dialog
      const dialog = new foundry.applications.api.DialogV2(dialogData).render({force: true});
    });
  }

  //central adding skill function | TAKES 'Body Save','1d10' | RETURNS player selected rollString.
  async chooseAdvantage(dlgTitle, die) {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //init vars
        let rollString = ``;
        //make diceRoll variants
        let dieAdv = die + ` [+]`;
        let dieDis = die + ` [-]`;
      //create final dialog data
      const dialogData = {
        window: {title: dlgTitle},
        position: {width: 600,height: 105},
        content: `<h4>` + game.i18n.localize("Mosh.SelectYourRollType") + `:</h4>`,
        buttons: [
          {
            label: game.i18n.localize("Mosh.Advantage"),
			      action: `action_advantage`,
            callback: (event, button, dialog) => {
              rollString = dieAdv;
              resolve([rollString]);
              console.log(`User left the chooseAdvantage dialog with: rollString:${rollString}`);
            },
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Normal"),
			      action: `action_normal`,
            callback: (event, button, dialog) => {
              rollString = die;
              resolve([rollString]);
              console.log(`User left the chooseAdvantage dialog with: rollString:${rollString}`);
            },
            icon: `<i class="fas fa-minus"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Disadvantage"),
			      action: `action_disadvantage`,
            callback: (event, button, dialog) => { 
              rollString = dieDis;
              resolve([rollString]);
              console.log(`User left the chooseAdvantage dialog with: rollString:${rollString}`);
            },
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        ]
      };
      //render dialog
      const dialog = new foundry.applications.api.DialogV2(dialogData).render({force: true});
    });
  }

  //central check rolling function | TAKES '1d10','low','combat','Geology',10,[weapon item] | RETURNS chat message showing check result
  async rollCheck(rollString, aimFor, attribute, skill, skillValue, weapon,overrideDamagaRollString=null) {
    //init vars
    let specialRoll = ``;
    let checkCrit = true;
    let zeroBased = true;
    let rollTarget = null;
    let rollTargetOverride = null;
    let messageTemplate = ``;
    let messageContent = ``;
    let attributeLabel = ``;
    let parsedDamageString = rollTarget;
    let comparison = ``;
    let damageResult = null;
    let parsedDamageResult = null;
    let critFail = false;
    let critMod = ``;
    let outcomeVerb = ``;
    let flavorText = ``;
    let comparisonText = ``;
    let needsDesc = false;
    let woundEffect = ``;
    let msgHeader = ``;
    let msgImgPath = ``;
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID() : randomID());
    let firstEdition = game.settings.get('mosh', 'firstEdition');
    let useCalm = game.settings.get('mosh', 'useCalm');
    //customize this roll if its a unique use-case
      //damage roll
      if (attribute === 'damage') {  
        //set special roll value for use later
        specialRoll = attribute;
        //disable criticals for this roll
        checkCrit = false;
        //set attribute
        attribute = 'combat';
        //set skill + value
        skill = 'none';
        skillValue = 0;
        //set rollstring
        if(overrideDamagaRollString){
          rollString=overrideDamagaRollString;
        }else{
          rollString = weapon.system.damage;
        }
      }
      //rest save
      if (attribute === 'restSave') {
        //1e rest save
        if (firstEdition) {
          //set special roll value for use later
          specialRoll = attribute;
          //disable criticals for this roll
          checkCrit = false;
          //lets figure out the actors worst save and update this roll accordingly
            //get current save values
            let sanitySave = Number(this.system.stats.sanity.value) + Number(this.system.stats.sanity.mod || 0);
            let fearSave = Number(this.system.stats.fear.value) + Number(this.system.stats.fear.mod || 0);
            let bodySave = Number(this.system.stats.body.value) + Number(this.system.stats.body.mod || 0);
            //get the lowest value
        let minSave = Math.min(sanitySave, fearSave, bodySave);
            //set attribute to the first one matching the lowest (since actor may have 2 with the lowest)
            if (sanitySave === minSave) {
              //set attribute
              attribute = 'sanity';
            } else if (fearSave === minSave) {
              //set attribute
              attribute = 'fear';
            } else {
              //set attribute
              attribute = 'body';
            }
        //0e Rest save
        } else {
          //set special roll value for use later
          specialRoll = attribute;
          //disable criticals for this roll
          checkCrit = false;
          //set attribute
          attribute = 'fear';
        }
      }
      //bankruptcy save
      if (attribute === 'bankruptcySave') {  
        //set special roll value for use later
        specialRoll = attribute;
        //set attribute value
        attribute = 'bankruptcy';
      }
      //morale check
      if (attribute === 'moraleCheck') {  
        //set special roll value for use later
        specialRoll = attribute;
        //disable criticals for this roll
        checkCrit = false;
        //set attribute value
        attribute = 'megadamage';
        //lets get the max megadamage value
        rollTargetOverride = Math.max.apply(null, this.system.megadamage.hits);
      }
    //bounce this request away if certain parameters are NULL
      //if attribute is blank, redirect player to choose an attribute
      if (!attribute && !specialRoll) {
        //run the choose attribute function
      let chosenAttributes = await this.chooseAttribute(rollString, aimFor);
        //set variables
        rollString = chosenAttributes[0];
        aimFor = chosenAttributes[1];
        attribute = chosenAttributes[2];
        //if null, zero them out
      }
      //if skill is blank and actor is a character, redirect player to choose a skill
      if (!skill && this.type === 'character') {
      //run the choose attribute function
      let chosenSkills = await this.chooseSkill(this.system.stats[attribute].rollLabel, rollString);
        //set variables
        rollString = chosenSkills[0];
        skill = chosenSkills[1];
        skillValue = chosenSkills[2];
      }
      //if rollString is STILL blank, redirect player to choose the roll
      if (!rollString) {
        //run the choose attribute function
      let chosenRollType = await this.chooseAdvantage(this.system.stats[attribute].rollLabel, '1d100');
        //set variables
        rollString = chosenRollType[0];
      }
    //if this is a weapon roll
    if (weapon) {
      //check to see if this weapon uses ammo
      if (weapon.system.useAmmo === true) {
        //if the weapon has enough shots remaining to shoot
        if (weapon.system.curShots >= weapon.system.shotsPerFire) {
          //reduce shots by shotsPerFire
          weapon.system.curShots -= weapon.system.shotsPerFire;
          //update players weapon
          this.updateEmbeddedDocuments('Item', [weapon]);
        //if the weapon doesn't have enough shots remaining to shoot
        } else {
          //if the weapon has enough ammo remaining to shoot
          if (weapon.system.ammo + weapon.system.curShots >= weapon.system.shotsPerFire) {
            //tell player we need to reload and ask what to do
            let t = await this.askReload(weapon._id);
            //exit function
            return;
          //if the weapon doesn't have enough ammo remaining to shoot
          } else {
            //tell player we are out of ammo
            let t = await this.outOfAmmo();
            //exit function
            return;
          }
        }
      }
    }
    //if this is a damage roll
    if (specialRoll === 'damage') {  
      //parse the roll string
      let damageRollString = weapon.system.damage
      if(overrideDamagaRollString){
        damageRollString = overrideDamagaRollString;
      }
      parsedDamageString = this.parseRollString(damageRollString, 'high');
      //override message header
      msgHeader = weapon.name;
      //override  header image
      msgImgPath = weapon.img;
      let dsnTheme = 0;
      if (game.settings.get('mosh', 'damageDiceTheme') != "") { //We're going to check if the theme field is blank. Otherwise, don't use this.
        //set damage dice color
        dsnTheme = game.settings.get('mosh', 'damageDiceTheme');
      }
      //prepare flavortext
      if (weapon.system.damage === "Str/10" && this.type === 'character') {
        //determine the damage string
        flavorText = 'You strike your target for <strong>[[floor(' + this.system.stats.strength.value + '/10)]] damage</strong>.';
      } else {
        flavorText = 'You inflict [[' + parsedDamageString + '[' + dsnTheme + ']' + critMod + ']] points of damage.';
      }
      //determine if this roll needs a description area
      if (weapon.system.description || weapon.system.woundEffect) {
        needsDesc = true;
      }
      //create wound effect string
      if (weapon.system.woundEffect) {
        //start with string as is
        woundEffect = weapon.system.woundEffect;
        //prepare array for looping
          //replace ' [-]' and ' [+]'
        woundEffect = woundEffect.replaceAll(' [-]', '_dis').replaceAll(' [+]', '_adv');
          //simplify wounds
        woundEffect = woundEffect.replace('Bleeding', 'bleeding');
        woundEffect = woundEffect.replace('Blunt Force', 'blunt_force');
        woundEffect = woundEffect.replace('Fire & Explosives', 'fire_explosives');
        woundEffect = woundEffect.replace('Gore & Massive', 'gore_massive');
        woundEffect = woundEffect.replace('Gunshot', 'gunshot');
          //split string
          let woundArray = woundEffect.split(' ');
        //loop through this string and replace each wound effect with macro UUID
        woundArray.forEach((element, index, array) => {
          array[index] = this.getFlavorText('macro', 'wound', element);
        });
        //combine back into string
        woundEffect = woundArray.join(' ');
      }
      //generate chat message
        //prepare data
        let messageData = {
          actor: this,
          weapon: weapon,
          msgHeader: msgHeader,
          msgImgPath: msgImgPath,
          flavorText: flavorText,
          needsDesc: needsDesc,
          woundEffect: woundEffect,
          specialRoll: specialRoll
        };
        let chatData = {
          user: game.user.id,
          speaker: {
            actor: this.id,
            token: this.token,
            alias: this.name
          }
        };
        let template = 'systems/mosh/templates/chat/rollCheck.html';
        renderTemplate(template, messageData).then(content => {
          chatData.content = content;
          ChatMessage.create(chatData);
        });
      //log what was done
      console.log(`Rolled damage on:${weapon.name}`);
      //return messageData
      return [messageData];
    }
    //make the rollTarget value
    if (!rollTargetOverride) {
      //retrieve the attribute
      rollTarget = this.system.stats[attribute].value
      //add the mod value
      rollTarget = Number(rollTarget) + (Number(this.system.stats[attribute].mod) || 0);
      //add the skill value
      rollTarget = Number(rollTarget) + Number(skillValue || 0);
    } else {
      rollTarget = rollTargetOverride;
    }
    //roll the dice
      //parse the roll string
    let parsedRollString = this.parseRollString(rollString, aimFor);
      //roll the dice
      let rollResult = await new Roll(parsedRollString).evaluate();
      //set comparison based on aimFor
      if (aimFor === 'low') {
        comparison = '<';
        comparisonText = 'less than';
      } else if (aimFor === 'low-equal') {
        comparison = '<=';
        comparisonText = 'less than or equal to';
      } else if (aimFor === 'high') {
        comparison = '>';
        comparisonText = 'greater than';
      } else if (aimFor === 'high-equal') {
        comparison = '>=';
        comparisonText = 'greater than or equal to';
      }
      //interpret the results
    let parsedRollResult = this.parseRollResult(rollString, rollResult, zeroBased, checkCrit, rollTarget, comparison, specialRoll);
    //prep damage dice in case its needed
    if (weapon && parsedRollResult.success) {
      //parse the roll string
      let damageRollString = weapon.system.damage
      if(overrideDamagaRollString){
        damageRollString = overrideDamagaRollString;
      }
      parsedDamageString = this.parseRollString(damageRollString, 'high');
    }
    //set chat message text
      //set roll result as greater than or less than
      if (parsedRollResult.success) {
        outcomeVerb = `rolled`;
      } else {
        outcomeVerb = `did not roll`;
      }
      //prepare flavor text for attacks
      if (weapon) {
        //override message header
        msgHeader = weapon.name;
        //override  header image
        msgImgPath = weapon.img;
        let dsnTheme = 0;
      if (game.settings.get('mosh', 'damageDiceTheme') != "") { //We're going to check if the theme field is blank. Otherwise, don't use this.
          //set damage dice color
        dsnTheme = game.settings.get('mosh', 'damageDiceTheme');
        }
        //prepare attribute label
        attributeLabel = this.system.stats[attribute].label;
        //set crit damage effect
        if (parsedRollResult.success === true && parsedRollResult.critical === true) {
        if (game.settings.get('mosh', 'critDamage') === 'advantage') {
            parsedDamageString = '{' + parsedDamageString + ',' + parsedDamageString + '}kh';
        } else if (game.settings.get('mosh', 'critDamage') === 'doubleDamage') {
            critMod = ' * 2';
        } else if (game.settings.get('mosh', 'critDamage') === 'doubleDice') {
            critMod = ' + ' + parsedDamageString + '[' + dsnTheme + ']';
        } else if (game.settings.get('mosh', 'critDamage') === 'maxDamage') {
          parsedDamageString = parsedDamageString.replaceAll('d', ' * ');
        } else if (game.settings.get('mosh', 'critDamage') === 'weaponValue') {
            critMod = ' + ' + weapon.system.critDmg + '[' + dsnTheme + ']';
        } else if (game.settings.get('mosh', 'critDamage') === 'none') {
            //do nothing
          }
        }
        //flavor text = the attack roll result
        if (parsedRollResult.success === true) {
          //if success
          if (weapon.system.damage === "Str/10" && this.type === 'character') {
            //determine the damage string
            flavorText = 'You strike your target for <strong>[[floor(' + this.system.stats.strength.value + '/10)]] damage</strong>.';
          } else {
            flavorText = 'You inflict [[' + parsedDamageString + '[' + dsnTheme + ']' + critMod + ']] points of damage.';
          }
        } else if (parsedRollResult.success === false && this.type === 'character') {
          //if first edition
          if (firstEdition) {
            //if calm not enabled
            if (!useCalm) {
            if (game.settings.get('mosh', 'autoStress')) { //If the automatic stress option is enabled
                //increase stress by 1 and retrieve the flavor text from the result
              let addStress = await this.modifyActor('system.other.stress.value', 1, null, false);
                flavorText = addStress[1];
              }
              //if critical failure, make sure to ask for panic check
              if (parsedRollResult.critical === true) {
                //set crit fail
                critFail = true;
              }
            } else {
              flavorText = game.i18n.localize("Mosh.YouSenseTheWeightOfYourSetbacks");
            }
          //if 0e
          } else {
            //if calm not enabled
            if (!useCalm) {
              //on Save failure
              if (attribute === 'sanity' || attribute === 'fear' || attribute === 'body' || attribute === 'armor') {
              if (game.settings.get('mosh', 'autoStress')) { //If the automatic stress option is enabled
                  //gain 1 stress
                let addStress = await this.modifyActor('system.other.stress.value', 1, null, false);
                  flavorText = addStress[1];
                }
                //if critical failure, make sure to ask for panic check
                if (parsedRollResult.critical === true) {
                  //set crit fail
                  critFail = true;
                }
              }
            } else {
              //output standard failure
              flavorText = game.i18n.localize("Mosh.YouSenseTheWeightOfYourSetbacks");
            }
          }
        }
        //determine if this roll needs a description area
        if (weapon.system.description || weapon.system.woundEffect) {
          needsDesc = true;
        }
        //create wound effect string
        if (weapon.system.woundEffect) {
          //start with string as is
          woundEffect = weapon.system.woundEffect;
          //prepare array for looping
            //replace ' [-]' and ' [+]'
        woundEffect = woundEffect.replaceAll(' [-]', '_dis').replaceAll(' [+]', '_adv');
            //simplify wounds
        woundEffect = woundEffect.replace('Bleeding', 'bleeding');
        woundEffect = woundEffect.replace('Blunt Force', 'blunt_force');
        woundEffect = woundEffect.replace('Fire & Explosives', 'fire_explosives');
        woundEffect = woundEffect.replace('Gore & Massive', 'gore_massive');
        woundEffect = woundEffect.replace('Gunshot', 'gunshot');
            //split string
            let woundArray = woundEffect.split(' ');
          //loop through this string and replace each wound effect with macro UUID
          woundArray.forEach((element, index, array) => {
            array[index] = this.getFlavorText('macro', 'wound', element);
          });
          //combine back into string
          woundEffect = woundArray.join(' ');
        }
      //prepare flavor text for special rolls
      } else if (specialRoll) {
        //rest save
        if (specialRoll === 'restSave') {
          //override message header
          msgHeader = game.i18n.localize("Mosh.RestSave");
          //override  header image
          msgImgPath = `systems/mosh/images/icons/ui/macros/rest_save.png`;
          //prepare attribute label
          attributeLabel = this.system.stats[attribute].label;
          //1e rest save
          if (firstEdition) {
            //calm outcome
            if (useCalm) {
              //prep text based on success or failure
              if (parsedRollResult.success === false && this.type === 'character') {
                //set fail text
                flavorText = game.i18n.localize("Mosh.YouSenseTheWeightOfYourSetbacks");
              } else if (parsedRollResult.success === true && this.type === 'character') {
                //calculate stress reduction
              let onesValue = Number(String(parsedRollResult.total).charAt(String(parsedRollResult.total).length - 1));
                //decrease stress by ones place of roll value and retrieve the flavor text from the result
              let removeStress = await this.modifyActor('system.other.stress.value', onesValue, null, false);
                flavorText = removeStress[1];
              }
            //no calm outcome
            } else {
              //prep text based on success or failure
              if (parsedRollResult.success === false && this.type === 'character') {
              if (game.settings.get('mosh', 'autoStress')) { //If the automatic stress option is enabled
                  //increase stress by 1 and retrieve the flavor text from the result
                let addStress = await this.modifyActor('system.other.stress.value', 1, null, false);
                  flavorText = addStress[1];
                }
                //if critical failure, make sure to ask for panic check
                if (parsedRollResult.critical === true) {
                  //set crit fail
                  critFail = true;
                }
              } else if (parsedRollResult.success === true && this.type === 'character') {
                //calculate stress reduction
              let onesValue = -1 * Number(String(parsedRollResult.total).charAt(String(parsedRollResult.total).length - 1));
                //decrease stress by ones place of roll value and retrieve the flavor text from the result
              let removeStress = await this.modifyActor('system.other.stress.value', onesValue, null, false);
                flavorText = removeStress[1];
              }
            }
          //0e rest save
          } else {
            //calm outcome
            if (useCalm) {
              //prep text based on success or failure
              if (parsedRollResult.success === false && this.type === 'character') {
                //set fail text
                flavorText = game.i18n.localize("Mosh.YouSenseTheWeightOfYourSetbacks");
              } else if (parsedRollResult.success === true && this.type === 'character') {
                //calculate stress reduction
              let succeedBy = Math.floor((rollTarget - parsedRollResult.total) / 10);
                //double it if critical
              if (parsedRollResult.critical) {
                succeedBy = succeedBy * 2;
              }
                //decrease stress by ones place of roll value and retrieve the flavor text from the result
              let removeStress = await this.modifyActor('system.other.stress.value', succeedBy, null, false);
                flavorText = removeStress[1];
              }
            //no calm outcome
            } else {
              //prep text based on success or failure
              if (parsedRollResult.success === false && this.type === 'character') {
              if (game.settings.get('mosh', 'autoStress')) { //If the automatic stress option is enabled
                  //increase stress by 1 and retrieve the flavor text from the result
                let addStress = await this.modifyActor('system.other.stress.value', 1, null, false);
                  flavorText = addStress[1];
                }
                //if critical failure, make sure to ask for panic check
                if (parsedRollResult.critical === true) {
                  //set crit fail
                  critFail = true;
                }
              } else if (parsedRollResult.success === true && this.type === 'character') {
                //calculate stress reduction
              let succeedBy = -1 * Math.floor((rollTarget - parsedRollResult.total) / 10);
                //double it if critical
              if (parsedRollResult.critical) {
                succeedBy = succeedBy * 2;
              }
                //decrease stress by ones place of roll value and retrieve the flavor text from the result
              let removeStress = await this.modifyActor('system.other.stress.value', succeedBy, null, false);
                flavorText = removeStress[1];
              }
            }
          }
        }
        //bankruptcy save
        if (specialRoll === 'bankruptcySave') {
          //message header
          msgHeader = game.i18n.localize("Mosh.BankrupcySave");
          //set header image
          msgImgPath = 'systems/mosh/images/icons/ui/rolltables/bankruptcy_save.png';
          //prepare attribute label
          attributeLabel = game.i18n.localize("Mosh.Bankrupcy");
          //get the bankruptcy table
          let tableId = game.settings.get('mosh','table1eBankruptcy');
          //get Table Data
          let tableData = await fromIdUuid(tableId,{type:"RollTable"});
          //prep text for success
          if (parsedRollResult.success && parsedRollResult.critical) {
            //flavor text
            flavorText = tableData.getResultsForRoll(0)[0].text;
          //prep text for critical success
          } else if (parsedRollResult.success && !parsedRollResult.critical) {
            //flavor text
            flavorText = tableData.getResultsForRoll(1)[0].text;
          //prep text for failure
          } else if (!parsedRollResult.success && !parsedRollResult.critical) {
            //flavor text
            flavorText = tableData.getResultsForRoll(2)[0].text;
          //prep text for critical failure
          } else if (!parsedRollResult.success && parsedRollResult.critical) {
            //flavor text
            flavorText = tableData.getResultsForRoll(3)[0].text;
          }
        }
        //morale check
        if (specialRoll === 'moraleCheck') {
          //message header
          msgHeader = game.i18n.localize("Mosh.MoraleCheck") 
          //set header image
          msgImgPath = 'systems/mosh/images/icons/ui/macros/morale_check.png';
          //prepare attribute label
          attributeLabel = 'Megadamage';
          //prep text based on success or failure
          if (!parsedRollResult.success) {
            //flavor text
            flavorText = `The crew, once focused on their tasks, now exchange anxious glances as the reality of the situation set in. Struggling to maintain composure in the chaos, the crew decides to send a hail and hope for mercy.`;
          } else {
          //flavor texattributes/
            flavorText = `As the ship shudders under the impact of enemy fire, a sense of urgency fills the control room. Alarms blare, emergency lights bath the crew in a stark glow, but there is no panic. The crew, seasoned and unyielding, maintain their focus on the task at hand.`;
          }
        }
      //prepare flavor text for regular checks
      } else {
        //prepare attribute label
        attributeLabel = this.system.stats[attribute].label;
        //message header
        msgHeader = this.system.stats[attribute].rollLabel;
        //set header image
        msgImgPath = 'systems/mosh/images/icons/ui/attributes/' + attribute + '.png';
        //prep text based on success or failure
        if (parsedRollResult.success === false && this.type === 'character') {
          //if first edition
          if (firstEdition) {
            //if calm not enabled
            if (!useCalm) {
            if (game.settings.get('mosh', 'autoStress')) { //If the automatic stress option is enabled
                //increase stress by 1 and retrieve the flavor text from the result
              let addStress = await this.modifyActor('system.other.stress.value', 1, null, false);
                flavorText = addStress[1];
              }
              //if critical failure, make sure to ask for panic check
              if (parsedRollResult.critical === true) {
                //set crit fail
                critFail = true;
              }
            } else {
              flavorText = game.i18n.localize("Mosh.YouSenseTheWeightOfYourSetbacks");
            }
          //if 0e
          } else {
            //if calm not enabled
            if (!useCalm) {
              //on Save failure
              if (attribute === 'sanity' || attribute === 'fear' || attribute === 'body' || attribute === 'armor') {
              if (game.settings.get('mosh', 'autoStress')) { //If the automatic stress option is enabled
                  //gain 1 stress
                let addStress = await this.modifyActor('system.other.stress.value', 1, null, false);
                  flavorText = addStress[1];
                }
                //if critical failure, make sure to ask for panic check
                if (parsedRollResult.critical === true) {
                  //set crit fail
                  critFail = true;
                }
              }
            } else {
              //output standard failure
              flavorText = game.i18n.localize("Mosh.YouSenseTheWeightOfYourSetbacks");
            }
          }
        } else if (parsedRollResult.success === true && this.type === 'character') {
          //flavor text = generic roll success
        flavorText = this.getFlavorText('attribute', attribute, 'check');
        }
      }
	  //generate chat message
      //prepare data
      let messageData = {
        actor: this,
        parsedRollResult: parsedRollResult,
        skill: skill,
        skillValue: skillValue,
        weapon: weapon,
        msgHeader: msgHeader,
        msgImgPath: msgImgPath,
        outcomeVerb: outcomeVerb,
        attribute: attributeLabel,
        flavorText: flavorText,
        comparisonText: comparisonText,
        needsDesc: needsDesc,
        woundEffect: woundEffect,
        critFail: critFail,
      firstEdition: game.settings.get('mosh', 'firstEdition'),
      useCalm: game.settings.get('mosh', 'useCalm'),
      androidPanic: game.settings.get('mosh', 'androidPanic')
      };
      //prepare template
      messageTemplate = 'systems/mosh/templates/chat/rollCheck.html';
      //render template
      messageContent = await renderTemplate(messageTemplate, messageData);
      //make message
      let macroMsg = await rollResult.toMessage({
        id: chatId,
        user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      },
        content: messageContent
    }, {
      keepId: true
    });
      //is DSN active?
    if (game.modules.get("dice-so-nice").active) {
        //log what was done
        console.log(`Rolled a check on: ${attribute}, with: rollString:${rollString}, aimFor:${aimFor}, skill:${skill}, skillValue:${skillValue}.`);
        //return messageData
        return [messageData];
        //wait for dice
        await game.dice3d.waitFor3DAnimationByMessageID(chatId);
      }
    //will come back here and turn on optional chat message
      ////log what was done
      //console.log(`Rolled a check on: ${attribute}, with: rollString:${rollString}, aimFor:${aimFor}, skill:${skill}, skillValue:${skillValue}.`);
      ////return messageData
      //return [messageData];
  }

  //central function to modify actors | TAKES 'system.other.stress.value',-1,'-1d5',true | RETURNS change details, and optional chat message
  async modifyActor(fieldAddress, modValue, modRollString, outputChatMsg) {
    //init vars
    let messageTemplate = ``;
    let messageContent = ``;
    let fieldPrefix = ``;
    let getWound = false;
    let msgHeader = ``;
    let msgImgPath = ``;
    let modifyMinimum = null;
    let modifyMaximum = null;
    let modifyCurrent = null;
    let modifyChange = 0;
    let modifyNew = null;
    let modifyDifference = null;
    let modifySurplus = null;
    let msgAction = ``;
    let msgFlavor = ``;
    let msgOutcome = ``;
    let msgChange = ``;
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID() : randomID())
    let halfDamage = false;
    let firstEdition = game.settings.get('mosh', 'firstEdition');
    let useCalm = game.settings.get('mosh', 'useCalm');
    let androidPanic = game.settings.get('mosh', 'androidPanic');
    //get information about this field from the actor
      //set path for important fields
        //field value
        let fieldValue = fieldAddress.split('.');
        //fieldMin
        let fieldMin = fieldAddress.split('.');
        fieldMin.pop();
        fieldMin.push("min");
        //fieldMax
        let fieldMax = fieldAddress.split('.');
        fieldMax.pop();
        fieldMax.push("max");
        //fieldLabel
        let fieldLabel = fieldAddress.split('.');
        fieldLabel.pop();
        fieldLabel.push("label");
        //fieldId
    let fieldId = fieldValue[fieldValue.length - 2];
      //get min value for this field, if it exists
      modifyMinimum = fieldMin.reduce((a, v) => a[v], this);
      //get max value for this field, if it exists
      modifyMaximum = fieldMax.reduce((a, v) => a[v], this);
      //get current value for this field
      modifyCurrent = fieldValue.reduce((a, v) => a[v], this);
    //check to see if this is a min/max part of a main field
    if (fieldAddress.slice(-3) === `min`) {
      fieldPrefix = `Minimum `;
    } else if (fieldAddress.slice(-3) === `max`) {
      fieldPrefix = `Maximum `;
    }
    //calculate the change, whether from a value, roll (can only be one, it will check modValue first)
      //apply the modValue directly with no roll
      if (modValue) {
        //update modChange
        modifyChange = modValue;
        //calculate impact to the actor
          //set the new value
          modifyNew = modifyCurrent + modifyChange;
          //restrict new value based on min/max
            //cap min
      if (modifyMinimum || modifyMinimum === 0) {
        if (modifyNew < modifyMinimum) {
                modifyNew = modifyMinimum;
              }
            }
            //cap max
      if (modifyMaximum || modifyMaximum === 0) {
        if (modifyNew > modifyMaximum) {
                modifyNew = modifyMaximum;
              }
            }
            //measure difference between old and new value
            modifyDifference = modifyNew - modifyCurrent;
            //measure any surplus if we exceeded min/max
            modifySurplus = modifyChange - modifyDifference;
          //if health hits zero, reset to next hp bar
          if (firstEdition && fieldId === 'health' && modifyNew === 0 && this.system.hits.value < this.system.hits.max) {
            //set marker for later
            getWound = true;
            //reset hp
        if (this.system.hits.value + 1 < this.system.hits.max) {
          modifyNew = modifyMaximum + modifySurplus;
        }
          }
        //update actor
            //prepare update JSON
            let updateData = JSON.parse(`{"` + fieldAddress + `": ` + modifyNew + `}`);
            //update field
            this.update(updateData);
        //create modification text (for chat message or return values)
          //get flavor text
          if (modifyChange > 0) {
        msgFlavor = this.getFlavorText('attribute', fieldId, 'increase');
            msgChange = 'increased';
        msgHeader = fieldPrefix + this.getFlavorText('attribute', fieldId, 'increaseHeader');
        msgImgPath = this.getFlavorText('attribute', fieldId, 'increaseImg');
          } else if (modifyChange < 0) {
        msgFlavor = this.getFlavorText('attribute', fieldId, 'decrease');
            msgChange = 'decreased';
        msgHeader = fieldPrefix + this.getFlavorText('attribute', fieldId, 'decreaseHeader');
        msgImgPath = this.getFlavorText('attribute', fieldId, 'decreaseImg');
          }
          //detect if half damage has been taken
      if (!firstEdition && (-1 * modifyChange) > (modifyMaximum / 2)) {
            halfDamage = true;
          }
          //get modification description
            //calculate change type
            if (modifySurplus < 0 && modifyDifference === 0) {
              msgAction = 'pastFloor';
            } else if (modifySurplus > 0 && modifyDifference === 0) {
              msgAction = 'pastCeiling';
            } else if (modifySurplus === 0 && modifyNew === modifyMinimum && modifyChange != 0) {
              msgAction = 'hitFloor';
            } else if (modifySurplus === 0 && modifyNew === modifyMaximum && modifyChange != 0) {
              msgAction = 'hitCeiling';
            } else if (modifyChange > 0) {
              msgAction = 'increase';
            } else if (modifyChange < 0) {
              msgAction = 'decrease';
            }
        //prepare flavor text
          //set message outcome for health reaches zero or goes past it, and you have wounds remaining
          if (getWound) {
            //can this player take a wound and not die?
            if (this.system.hits.value === this.system.hits.max) {
              //you are dead!
          msgOutcome = this.getFlavorText('attribute', 'hits', 'hitCeiling');
            } else if (this.system.hits.value + 1 === this.system.hits.max) {
              //you are wounded!
          msgOutcome = game.i18n.localize("Mosh.HealthZeroMessage") + `<br><br>` + this.getFlavorText('attribute', 'hits', 'increase');
            } else {
              //you are wounded!
          msgOutcome = game.i18n.localize("Mosh.HealthZeroMessage") + ` <strong>${modifyNew}</strong>.<br><br>` + this.getFlavorText('attribute', 'hits', 'increase');
            }
          //set message outcome for past ceiling or floor
          } else if (msgAction === 'pastFloor' || msgAction === 'pastCeiling') {
        msgOutcome = this.getFlavorText('attribute', fieldId, msgAction);
          //set message outcome for stress going from < 20 to > 20
          } else if (fieldId === 'stress' && modifyCurrent < modifyMaximum && modifySurplus > 0) {
        msgOutcome = this.getFlavorText('attribute', fieldId, msgAction) + ` ` + fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>. <strong>Reduce the most relevant Stat or Save by ${modifySurplus}</strong>.`;
          //set message outcome for stress going from 20 to > 20
          } else if (fieldId === 'stress' && modifyCurrent === modifyMaximum && modifySurplus > 0) {
        msgOutcome = this.getFlavorText('attribute', fieldId, msgAction) + ` <strong>Reduce the most relevant Stat or Save by ${modifySurplus}</strong>.`;
          //set default message outcome
          } else if (msgAction === 'increase' || msgAction === 'decrease') {
            msgOutcome = fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
          } else {
        msgOutcome = this.getFlavorText('attribute', fieldId, msgAction) + ` ` + fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
          }
        //push message if asked
        if (outputChatMsg) {
          //generate chat message
            //prepare data
            let messageData = {
              actor: this,
              msgHeader: msgHeader,
              msgImgPath: msgImgPath,
              msgFlavor: msgFlavor,
              msgOutcome: msgOutcome,
              halfDamage: halfDamage
            };
            //prepare template
            messageTemplate = 'systems/mosh/templates/chat/modifyActor.html';
            //render template
            messageContent = await renderTemplate(messageTemplate, messageData);
            //push message
            ChatMessage.create({
              id: chatId,
              user: game.user.id,
          speaker: {
            actor: this.id,
            token: this.token,
            alias: this.name
          },
              content: messageContent
        }, {
          keepId: true
        });
        }
        //log what was done
        console.log(`Modified actor: ${this.name}, with: fieldAddress:${fieldAddress}, modValue:${modValue}, modRollString:${modRollString}, outputChatMsg:${outputChatMsg}`);      
        //return modification values
      return [msgFlavor, msgOutcome, msgChange];
      //calculate change from the modRollString
      } else {
        //roll the dice
          //parse the roll string
      let parsedRollString = this.parseRollString(modRollString, 'low');
          //roll the dice
          let rollResult = await new Roll(parsedRollString).evaluate();
          //interpret the results
      let parsedRollResult = this.parseRollResult(modRollString, rollResult, false, false, null, null, null);
        //update modChange
        modifyChange = modifyChange + parsedRollResult.total;
        //calculate impact to the actor
          //set the new value
          modifyNew = modifyCurrent + modifyChange;
          //restrict new value based on min/max
            //cap min
      if (modifyMinimum || modifyMinimum === 0) {
        if (modifyNew < modifyMinimum) {
                modifyNew = modifyMinimum;
              }
            }
            //cap max
      if (modifyMaximum || modifyMaximum === 0) {
        if (modifyNew > modifyMaximum) {
                modifyNew = modifyMaximum;
              }
            }
            //measure difference between old and new value
            modifyDifference = modifyNew - modifyCurrent;
            //measure any surplus if we exceeded min/max
            modifySurplus = modifyChange - modifyDifference;
            //if health hits zero, reset to next hp bar
            if (firstEdition && fieldId === 'health' && modifyNew === 0 && this.system.hits.value < this.system.hits.max) {
              //set marker for later
              getWound = true;
              //reset hp
        if (this.system.hits.value + 1 < this.system.hits.max) {
          modifyNew = modifyMaximum + modifySurplus;
        }
            }
            //update actor
              //prepare update JSON
              let updateData = JSON.parse(`{"` + fieldAddress + `": ` + modifyNew + `}`);
              //update field
              this.update(updateData);
            //create modification text (for chat message or return values)
              //get flavor text
              if (modifyChange > 0) {
        msgFlavor = this.getFlavorText('attribute', fieldId, 'increase');
                msgChange = 'increased';
        msgHeader = fieldPrefix + this.getFlavorText('attribute', fieldId, 'increaseHeader');
        msgImgPath = this.getFlavorText('attribute', fieldId, 'increaseImg');
              } else if (modifyChange < 0) {
        msgFlavor = this.getFlavorText('attribute', fieldId, 'decrease');
                msgChange = 'decreased';
        msgHeader = fieldPrefix + this.getFlavorText('attribute', fieldId, 'decreaseHeader');
        msgImgPath = this.getFlavorText('attribute', fieldId, 'decreaseImg');
              }
              //detect if half damage has been taken
      if (!firstEdition && (-1 * modifyChange) > (modifyMaximum / 2)) {
                halfDamage = true;
              }
              //get modification description
                //calculate change type
                if (modifySurplus < 0 && modifyDifference === 0) {
                  msgAction = 'pastFloor';
                } else if (modifySurplus > 0 && modifyDifference === 0) {
                  msgAction = 'pastCeiling';
                } else if (modifySurplus === 0 && modifyNew === modifyMinimum && modifyChange != 0) {
                  msgAction = 'hitFloor';
                } else if (modifySurplus === 0 && modifyNew === modifyMaximum && modifyChange != 0) {
                  msgAction = 'hitCeiling';
                } else if (modifyChange > 0) {
                  msgAction = 'increase';
                } else if (modifyChange < 0) {
                  msgAction = 'decrease';
                }
                //set message outcome for health reaches zero or goes past it, and you have wounds remaining
                if (getWound) {
                  //can this player take a wound and not die?
                  if (this.system.hits.value === this.system.hits.max) {
                    //you are dead!
          msgOutcome = this.getFlavorText('attribute', 'hits', 'hitCeiling');
                  } else if (this.system.hits.value + 1 === this.system.hits.max) {
                    //you are wounded!
          msgOutcome = game.i18n.localize("Mosh.HealthZeroMessage") + `<br><br>` + this.getFlavorText('attribute', 'hits', 'increase');
                  } else {
                    //you are wounded!
          msgOutcome = game.i18n.localize("Mosh.HealthZeroMessage2") +` <strong>${modifyNew}</strong>.<br><br>` + this.getFlavorText('attribute', 'hits', 'increase');
                  }
                //set message outcome for past ceiling or floor
                } else if (msgAction === 'pastFloor' || msgAction === 'pastCeiling') {
        msgOutcome = this.getFlavorText('attribute', fieldId, msgAction);
                //set message outcome for stress going from < 20 to > 20
                } else if (fieldId === 'stress' && modifyCurrent < modifyMaximum && modifySurplus > 0) {
        msgOutcome = this.getFlavorText('attribute', fieldId, msgAction) + ` ` + fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>. <strong>Reduce the most relevant Stat or Save by ${modifySurplus}</strong>.`;
                //set message outcome for stress going from 20 to > 20
                } else if (fieldId === 'stress' && modifyCurrent === modifyMaximum && modifySurplus > 0) {
        msgOutcome = this.getFlavorText('attribute', fieldId, msgAction) + ` <strong>Reduce the most relevant Stat or Save by ${modifySurplus}</strong>.`;
                //set default message outcome
                } else if (msgAction === 'increase' || msgAction === 'decrease') {
                  msgOutcome = fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
                } else {
        msgOutcome = this.getFlavorText('attribute', fieldId, msgAction) + ` ` + fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
                }
            //push message if asked
            if (outputChatMsg) {
              //generate chat message
                //prepare data
                let messageData = {
                  actor: this,
                  parsedRollResult: parsedRollResult,
                  msgHeader: msgHeader,
                  msgImgPath: msgImgPath,
                  msgFlavor: msgFlavor,
                  modRollString: modRollString,
                  msgOutcome: msgOutcome,
                  halfDamage: halfDamage
                };
                //prepare template
                messageTemplate = 'systems/mosh/templates/chat/modifyActor.html';
                //render template
                messageContent = await renderTemplate(messageTemplate, messageData);
                //make message
                let macroMsg = await rollResult.toMessage({
                  id: chatId,
                  user: game.user.id,
          speaker: {
            actor: this.id,
            token: this.token,
            alias: this.name
          },
                  content: messageContent
        }, {
          keepId: true
        });
        if (game.modules.get("dice-so-nice").active) {
                  //log what was done
                  console.log(`Modified actor: ${this.name}, with: fieldAddress:${fieldAddress}, modValue:${modValue}, modRollString:${modRollString}, outputChatMsg:${outputChatMsg}`);     
                  //return modification values
          return [msgFlavor, msgOutcome, msgChange];
                  //wait for dice
                  await game.dice3d.waitFor3DAnimationByMessageID(chatId);
                }
            }
            //log what was done
            console.log(`Modified actor: ${this.name}, with: fieldAddress:${fieldAddress}, modValue:${modValue}, modRollString:${modRollString}, outputChatMsg:${outputChatMsg}`);     
            //return modification values
      return [msgFlavor, msgOutcome, msgChange];
      }
  }

  //central function to modify an actors items | TAKES 'olC4JytslvUrQN8g',1 | RETURNS change details, and optional chat message
  async modifyItem(itemId, addAmount) {
    //init vars
    let currentLocation = '';
    let itemLocation = '';
    let messageTemplate = ``;
    let messageContent = ``;
    let oldValue = 0;
    let newValue = 0;
    let flavorText = ``;
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID(): randomID())
    //get item data
    let itemData = await fromIdUuid(itemId,{type:"Item"});
    //add or increase the count of the item, depending on type, if the actor has it
    if (this.items.getName(itemData.name)) {
      //if this is an item, increase the count
      if (itemData.type === 'item') {
        //get current quantity
        oldValue = this.items.getName(itemData.name).system.quantity;
        newValue = oldValue + addAmount;
        //increase severity of the condition
        this.items.getName(itemData.name).update({
          'system.quantity': newValue
        });
        //create message text
        flavorText = `Quantity has increased from <strong>` + oldValue + `</strong> to <strong>` + newValue + `</strong>.`;
      //if this is a condition, increase the severity
      } else if (itemData.type === 'condition') {
        //get current severity
        oldValue = this.items.getName(itemData.name).system.severity;
        newValue = oldValue + addAmount;
        //increase severity of the condition
        this.items.getName(itemData.name).update({
          'system.severity': newValue
        });
        //create message text
        flavorText = this.getFlavorText('item', 'condition', 'increase') + `Severity has increased from <strong>` + oldValue + `</strong> to <strong>` + newValue + `</strong>.`;
      //if this is a weapon or armor, add another one
      } else if (itemData.type === 'weapon' || itemData.type === 'armor') {
        //add item to the players inventory
        await this.createEmbeddedDocuments('Item', [itemData]);
        //create message text
        flavorText = game.i18n.localize("Mosh.YouAddAnotherOfThisToYourInventory");
      }
    } else {
      //if this is an item, add it
      if (itemData.type === 'item') {
        //give the character the item
        await this.createEmbeddedDocuments('Item', [itemData]);
        //increase severity of the condition
        this.items.getName(itemData.name).update({
          'system.quantity': addAmount
        });
        //create message text
        flavorText = `You add <strong>` + addAmount + `</strong> of these to your inventory.`;
      //if this is a condition, add it
      } else if (itemData.type === 'condition') {
        //give the character the item
        await this.createEmbeddedDocuments('Item', [itemData]);
        //increase severity of the condition
        this.items.getName(itemData.name).update({
          'system.severity': addAmount
        });
        //create message text
        flavorText = this.getFlavorText('item', 'condition', 'add') + `, with a severity of <strong>` + addAmount + `</strong>.`;
      //if this is a weapon or armor, add it
      } else if (itemData.type === 'weapon' || itemData.type === 'armor') {
        //add item to the players inventory
        await this.createEmbeddedDocuments('Item', [itemData]);
        //create message text
        flavorText = game.i18n.localize("Mosh.YouAddThisToYourInventory");
      } else if (itemData.type === 'skill' ) {
        //add item to the players inventory
        await this.createEmbeddedDocuments('Item', [itemData]);
        //create message text
        flavorText = game.i18n.localize("Mosh.YouLearnThisSkill");
      }
    }
    //generate chat message
      //get item name
      let msgHeader = itemData.name;
      //get item image
      let msgImgPath = itemData.img;
      //prepare data
      let messageData = {
        actor: this,
        item: itemData,
        msgHeader: msgHeader,
        msgImgPath: msgImgPath,
        flavorText: flavorText
      };
      //prepare template
      messageTemplate = 'systems/mosh/templates/chat/modifyItem.html';
      //render template
      messageContent = await renderTemplate(messageTemplate, messageData);
      //make message
      ChatMessage.create({
        id: chatId,
        user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      },
        content: messageContent
    }, {
      keepId: true
    });
    //log what was done
    console.log(`Modified item: ${itemData.name} belonging to actor: ${this.name}, by: addAmount:${addAmount}`);
  }

  //ask the player if we want to reload
  async askReload(itemId) {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create final dialog data
      const dialogData = {
        title: game.i18n.localize("Mosh.WeaponIssue"),
        content: `<h4>` + game.i18n.localize("Mosh.OutOfAmmoNeedReload") + `</h4><br/>`,
        buttons: [
          {
            label: game.i18n.localize("Mosh.Reload"),
			      action: `action_reload`,
            callback: () => this.reloadWeapon(itemId),
            icon: `<i class="fas fa-check"></i>`
          },
          {
            label: `Cancel`,
			      action: `action_cancel`,
            callback: () => {},
            icon: `<i class="fas fa-times"></i>`
          }
        ]
      };
      //render dialog
      const dialog = new foundry.applications.api.DialogV2(dialogData).render({force: true});
    });
    //log what was done
    console.log(`Asked for reload.`);
  }

  //tell the player we are out of ammo
  async outOfAmmo() {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create final dialog data
      const dialogData = {
        title: game.i18n.localize("Mosh.WeaponIssue"),
        content: `<h4>` + game.i18n.localize("Mosh.OutOfAmmo") + `</h4><br/>`,
        buttons: [
          {
            label: game.i18n.localize("Mosh.OK"),
			      action: `action_okay`,
            callback: () => {},
            icon: '<i class="fas fa-check"></i>'
          }
        ]
      };
      //render dialog
      const dialog = new foundry.applications.api.DialogV2(dialogData).render({force: true});
    });
    //log what was done
    console.log(`Told user they are out of ammo.`);
  }

  //reload the players weapon
  async reloadWeapon(itemId) {
    //init vars
    let messageTemplate = ``;
    let messageContent = ``;
    let msgBody = ``;
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID() : randomID())
    //dupe item to work with
    var item;
    if (game.release.generation >= 12) {
      item = foundry.utils.duplicate(this.getEmbeddedDocument('Item', itemId));
    } else {
      item = duplicate(this.getEmbeddedDocument('Item', itemId));
    }

    //reload
    if (!item.system.useAmmo) {
      //exit function (it should not be possible to get here)
      return;
    } else {
      //are we at full shots already?
      if (item.system.curShots === item.system.shots) {
        //log what was done
        console.log(`Can't reload, already at full shots.`);
        //exit function (it should not be possible to get here)
        return;
      //are we out of ammo?
      } else if (!item.system.ammo) {
        //tell player we are out of ammo
        let t = await this.outOfAmmo();
        //log what was done
        console.log(`Can't reload, no ammo left.`);
        //exit function
        return;
      } else {
        //put curShots back into the ammo pool
        item.system.ammo += item.system.curShots;
        //figure out how much we can reload (full shots, or less if we don't have enough ammo)
        let reloadAmount = Math.min(item.system.ammo, item.system.shots);
        //reload the weapon
          //set curShots to reload amount
          item.system.curShots = reloadAmount;
          //remove reload amount from ammo
          item.system.ammo -= reloadAmount;
        //update the item


        this.updateEmbeddedDocuments('Item', [item]);

        
        //set message body text
        msgBody = game.i18n.localize("Mosh.WeaponReloaded");
      }
    }
    //generate chat message
      //prepare data
      let messageData = {
        actor: this,
        item: item,
        msgBody: msgBody
      };
      //prepare template
      messageTemplate = 'systems/mosh/templates/chat/reload.html';
      //render template
      messageContent = await renderTemplate(messageTemplate, messageData);
      //push message
      ChatMessage.create({
        id: chatId,
        user: game.user.id,
        speaker: {
          actor: this.id,
          token: this.token,
          alias: this.name
        },
        content: messageContent
    }, {
      keepId: true
    });
    //log what was done
    console.log(`Reloaded weapon.`);
  }

  //make the player take bleeding damage
  async takeBleedingDamage() {
    //init vars
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID() : randomID())
    //determine bleeding amount
    let healthLost = this.items.getName("Bleeding").system.severity * -1;
    //run the function for the player's 'Selected Character'
    let modification = await this.modifyActor('system.health.value', healthLost, null, false);
    //get flavor text
    let msgFlavor = this.getFlavorText('item', 'condition', 'bleed');
    let msgOutcome = modification[1];
    let healthLostText = game.i18n.localize("Mosh.attribute.health.decreaseHeader.human")
    //create chat message text
    let messageContent = `
    <div class="mosh">
      <div class="rollcontainer">
          <div class="flexrow" style="margin-bottom: 5px;">
          <div class="rollweaponh1">${healthLostText}</div>
          <div style="text-align: right"><img class="roll-image" src="systems/foundry-mothership/images/icons/ui/attributes/health.png" /></div>
          </div>
          <div class="description"" style="margin-bottom: 20px;">
          <div class="body">
          ${msgFlavor}
          <br><br>
          ${msgOutcome}
          </div>
          </div>
      </div>
    </div>
    `;
    //push message
    ChatMessage.create({
      id: chatId,
      user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      },
      content: messageContent
    }, {
      keepId: true
    });
    //log what was done
    console.log(`Took bleeding damage.`);
  }

  //make the player take radiation damage
  async takeRadiationDamage() {
    //init vars
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID() : randomID())
    //reduce all stats and saves by 1
    this.modifyActor('system.stats.strength.value', -1, null, false);
    this.modifyActor('system.stats.speed.value', -1, null, false);
    this.modifyActor('system.stats.intellect.value', -1, null, false);
    this.modifyActor('system.stats.combat.value', -1, null, false);
    this.modifyActor('system.stats.sanity.value', -1, null, false);
    this.modifyActor('system.stats.fear.value', -1, null, false);
    this.modifyActor('system.stats.body.value', -1, null, false);
    //get flavor text
    let msgFlavor = this.getFlavorText('item', 'condition', 'radiation');
    let msgOutcome = game.i18n.localize('Mosh.AllStatsAndSavesDecreasedBy');
    msgOutcome += ` <strong>1</strong>.`;
    let radiationDamage = game.i18n.localize('Mosh.RadiationDamage');

    //create chat message text
    let messageContent = `
    <div class="mosh">
      <div class="rollcontainer">
          <div class="flexrow" style="margin-bottom: 5px;">
          <div class="rollweaponh1">${radiationDamage}</div>
          <div style="text-align: right"><img class="roll-image" src="icon_file_attribute_health.png" /></div>
          </div>
          <div class="description"" style="margin-bottom: 20px;">
          <div class="body">
          ${msgFlavor}
          <br><br>
          ${msgOutcome}
          </div>
          </div>
      </div>
    </div>
    `;
    //push message
    ChatMessage.create({
      id: chatId,
      user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      },
      content: messageContent
    }, {
      keepId: true
    });
    //log what was done
    console.log(`Took radiation damage.`);
  }

  //make the player take radiation damage
  async takeCryoDamage(rollString) {
    //init vars
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID() : randomID())
    //roll the dice
      //parse the roll string
    let parsedRollString = this.parseRollString(rollString, 'low');
      //roll the dice
      let rollResult = await new Roll(parsedRollString).evaluate();
      //interpret the results
    let parsedRollResult = this.parseRollResult(rollString, rollResult, false, false, null, null, null);
    //reduce all stats and saves by roll result
    this.modifyActor('system.stats.strength.value', parsedRollResult.total, null, false);
    this.modifyActor('system.stats.speed.value', parsedRollResult.total, null, false);
    this.modifyActor('system.stats.intellect.value', parsedRollResult.total, null, false);
    this.modifyActor('system.stats.combat.value', parsedRollResult.total, null, false);
    this.modifyActor('system.stats.sanity.value', parsedRollResult.total, null, false);
    this.modifyActor('system.stats.fear.value', parsedRollResult.total, null, false);
    this.modifyActor('system.stats.body.value', parsedRollResult.total, null, false);
    //get flavor text
    let msgFlavor = this.getFlavorText('item', 'condition', 'cryo');
    let msgOutcome = game.i18n.localize('Mosh.AllStatsAndSavesDecreasedBy');
    msgOutcome += ` <strong>` + Math.abs(parsedRollResult.total).toString() + `</strong>.`;
    let cryoDamage = game.i18n.localize("Mosh.CryofreezeDamage")
    //create chat message text
    let messageContent = `
    <div class="mosh">
      <div class="rollcontainer">
          <div class="flexrow" style="margin-bottom: 5px;">
          <div class="rollweaponh1">${cryoDamage}</div>
          <div style="text-align: right"><img class="roll-image" src="systems/mosh/images/icons/ui/attributes/health.png" /></div>
          </div>
          <div class="description"" style="margin-bottom: 20px;">
          <div class="body">
          ${msgFlavor}
          <br><br>
          ${msgOutcome}
          </div>
          </div>
      </div>
    </div>
    `;
    //push message
    ChatMessage.create({
      id: chatId,
      user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      },
      content: messageContent
    }, {
      keepId: true
    });
    //log what was done
    console.log(`Took cryofreeze damage.`);
  }

  //ask the player to choose cover
  async chooseCover() {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //init vars
      let none_checked = ``;
      let insignificant_checked = ``;
      let light_checked = ``;
      let heavy_checked = ``;
      //fetch character AP/DR/cover
      let curAP = this.system.stats.armor.mod;
      let curDR = this.system.stats.armor.damageReduction;
      let curCover = this.system.stats.armor.cover;
      //set checkbox to current cover + adjust curAP/DR
      if (curCover === 'none') {
        none_checked = `checked`;
      }
      if (curCover === 'insignificant') {
        insignificant_checked = `checked`;
      }
      if (curCover === 'light') {
        light_checked = `checked`;
      }
      if (curCover === 'heavy') {
        heavy_checked = `checked`;
      }  

      //create pop-up HTML
      let msgContent = await renderTemplate('systems/mosh/templates/dialogs/choose-cover-dialog.html', {
          curDR:curDR, 
          curAP:curAP, 
          none_checked: none_checked,
          insignificant_checked:insignificant_checked,
          light_checked:light_checked,
          heavy_checked:heavy_checked,
          curCover:curCover
        });
      
      //create final dialog data
      const dialogData = {
        window: {title: game.i18n.localize("Mosh.Cover")},
        position: {width: 600,height: 580},
        content: msgContent,
        buttons: [
          {
            label: game.i18n.localize("Mosh.OK"),
			      action: `action_okay`,
            callback: (event, button, dialog) => {
              this.update({
                'system.stats.armor.cover': button.form.querySelector("input[name='cover']:checked")?.getAttribute("value")
              });
              console.log(`User's cover is now:${button.form.querySelector("input[name='cover']:checked")?.getAttribute("value")}`);
            },
            icon: '<i class="fas fa-check"></i>'
          }
        ]
      };
      //render dialog
      const dialog = new foundry.applications.api.DialogV2(dialogData).render({force: true});
    
    });
    
  }

  //activate ship's distress signal
  async distressSignal() {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create pop-up HTML
      let msgContent = await renderTemplate('systems/mosh/templates/dialogs/distres-signal-dialog.html');
      
      //create final dialog data
      const dialogData = {
        window: {title: game.i18n.localize("Mosh.DistressSignal")},
        position: {width: 600,height: 265},
        content: msgContent,
        buttons: [
          {
            label: game.i18n.localize("Mosh.Advantage"),
			      action: `action_advantage`,
            callback: () => this.rollTable(game.settings.get('mosh', 'table1eDistressSignal'), `1d10 [+]`, `low`, true, false, null, null),
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Normal"),
			      action: `action_normal`,
            callback: () => this.rollTable(game.settings.get('mosh', 'table1eDistressSignal'), `1d10`, `low`, true, false, null, null),
            icon: `<i class="fas fa-minus"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Disadvantage"),
			      action: `action_disadvantage`,
            callback: () => this.rollTable(game.settings.get('mosh', 'table1eDistressSignal'), `1d10 [-]`, `low`, true, false, null, null),
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        ]
      };
      //render dialog
      const dialog = new foundry.applications.api.DialogV2(dialogData).render({force: true});
    
    });
    
  }

  //activate ship's distress signal
  async maintenanceCheck() {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create pop-up HTML
      let msgContent = `

      `;
      //create final dialog data
      const dialogData = {
        window: {title: game.i18n.localize("Mosh.MaintenanceCheck")},
        position: {width: 600,height: 265},
        content: msgContent,
        buttons: [
          {
            label: game.i18n.localize("Mosh.Advantage"),
			      action: `action_advantage`,
            callback: () => this.rollTable(`maintenanceCheck`, `1d100 [+]`, `low`, null, null, null, null),
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Normal"),
			      action: `action_normal`,
            callback: () => this.rollTable(`maintenanceCheck`, `1d100`, `low`, null, null, null, null),
            icon: `<i class="fas fa-minus"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Disadvantage"),
			      action: `action_disadvantage`,
            callback: () => this.rollTable(`maintenanceCheck`, `1d100 [-]`, `low`, null, null, null, null),
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        ]
      };
      //render dialog
      const dialog = new foundry.applications.api.DialogV2(dialogData).render({force: true});
    
    });
    
  }

  //activate ship's distress signal
  async bankruptcySave() {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create pop-up HTML
      let msgContent = `
      
      `;
      //create final dialog data
      const dialogData = {
        window: {title: game.i18n.localize("Mosh.BankrupcySave")},
        position: {width: 600,height: 265},
        content: msgContent,
        buttons: [
          {
            label: game.i18n.localize("Mosh.Advantage"),
			      action: `action_advantage`,
            callback: () => this.rollCheck(`1d100 [+]`, `low`, `bankruptcySave`, null, null, null),
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Normal"),
			      action: `action_normal`,
            callback: () => this.rollCheck(`1d100`, `low`, `bankruptcySave`, null, null, null),
            icon: `<i class="fas fa-minus"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Disadvantage"),
			      action: `action_disadvantage`,
            callback: () => this.rollCheck(`1d100 [-]`, `low`, `bankruptcySave`, null, null, null),
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        ]
      };
      //render dialog
      new foundry.applications.api.DialogV2(dialogData).render({force: true});

    });
    
  }

  //activate ship's distress signal
  async moraleCheck() {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create pop-up HTML

      let moraleCheck = game.i18n.localize("Mosh.MoraleCheck")
      let moraleCheckDescription = game.i18n.localize("Mosh.MoraleCheckDescription")

      let msgContent = `
      <style>
        .macro_window{
          background: rgb(230,230,230);
          border-radius: 9px;
        }
        .macro_img{
          display: flex;
          justify-content: center;
        }
        .macro_desc{
          font-family: "Roboto", sans-serif;
          font-size: 10.5pt;
          font-weight: 400;
          padding-top: 8px;
          padding-right: 8px;
          padding-bottom: 8px;
        }
        .grid-2col {
          display: grid;
          grid-column: span 2 / span 2;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 2px;
          padding: 0;
        }
      </style>
      <div class ="macro_window" style="margin-bottom : 7px;">
        <div class="grid grid-2col" style="grid-template-columns: 150px auto">
          <div class="macro_img"><img src="icon_file_macro_momnsrale_check.png" style="border:none"/></div>
          <div class="macro_desc"><h3>${moraleCheck}</h3>${moraleCheckDescription}</div>
        </div>
      </div>
      <h4>Select your roll type:</h4>
      `;
      //create final dialog data
      const dialogData = {
        window: {title: `Morale Check`},
        position: {width: 600,height: 265},
        content: msgContent,
        buttons: [
          {
            label: game.i18n.localize("Mosh.Advantage"),
			      action: `action_advantage`,
            callback: () => this.rollCheck(`1d10 [+]`, `high-equal`, `moraleCheck`, null, null, null),
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Normal"),
			      action: `action_normal`,
            callback: () => this.rollCheck(`1d10`, `high-equal`, `moraleCheck`, null, null, null),
            icon: `<i class="fas fa-minus"></i>`
          },
          {
            label: game.i18n.localize("Mosh.Disadvantage"),
			      action: `action_disadvantage`,
            callback: () => this.rollCheck(`1d10 [-]`, `high-equal`, `moraleCheck`, null, null, null),
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        ]
      };
      //render dialog
      const dialog = new foundry.applications.api.DialogV2(dialogData).render({force: true});

    });
    
  }

  // print description
  printDescription(itemId, options = {
    event: null
  }) {
    var item;
    if (game.release.generation >= 12) {
      item = foundry.utils.duplicate(this.getEmbeddedDocument('Item', itemId));
    } else {
      item = duplicate(this.getEmbeddedDocument('Item', itemId));
    }
    this.chatDesc(item);
  }

  // Print the item description into the chat.
  chatDesc(item) {
    let swapNameDesc = false;
    let swapName = '';
    let itemName = item.name?.charAt(0).toUpperCase() + item.name?.toLowerCase().slice(1);
    if (!item.name && isNaN(itemName)) {
      itemName = item.charAt(0)?.toUpperCase() + item.toLowerCase().slice(1);
    }
    var rollInsert = '';
    if (item.system.roll) {
      let r = new Roll(item.system.roll, {});
      r.evaluate({
        async: false
      });
      rollInsert = '\
        <div class="rollh2" style="text-transform: lowercase;">' + item.system.roll + '</div>\
        <div class="roll-grid">\
          <div class="roll-result">' + r._total + '</div>\
        </div>';
    }

    //add flag to swap name and description, if desc contains trinket or patch
    if (item.system.description === '<p>Patch</p>' || item.system.description === '<p>Trinket</p>' || item.system.description === '<p>Maintenance Issue</p>') {
      swapNameDesc = true;
      swapName = item.system.description.replaceAll('<p>', '').replaceAll('</p>', '');
    }

    var templateData = {
      actor: this,
      stat: {
        name: itemName.toUpperCase()
      },
      item: item,
      insert: rollInsert,
      onlyDesc: true,
      swapNameDesc: swapNameDesc,
      swapName: swapName
    };

    let chatData = {
      user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      }
    };

    let rollMode = game.settings.get("core", "rollMode");
    if (["gmroll", "blindroll"].includes(rollMode)) chatData["whisper"] = ChatMessage.getWhisperRecipients("GM");

    let template = 'systems/mosh/templates/chat/itemRoll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;
      ChatMessage.create(chatData);
    });
    //log what was done
    console.log(`Created chat message with details on ${item.name}`);
  }

}