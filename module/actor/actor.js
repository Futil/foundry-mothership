/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class MothershipActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
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
  /**
   * Prepare Character type specific data
   */
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
    data.stats.armor.total = armorPoints+data.stats.armor.value;
    data.stats.armor.damageReduction = damageReduction;
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCreatureData(actorData) {
    const data = actorData;
  }

  _prepareShipData(actorData) {
    const data = actorData;
  }

  //central flavor text library for all chat messages
  getFlavorText (type,context,action) {
    //create library
    let textLibrary = {
      //rolltable flavor text
      table: {
        death_save: {
          roll: {
            android: `You knock on death's door.`,
            human: `You knock on death's door.`
          }
        },
        blunt_force_wound: {
          roll: {
            android: `You brace for the worst.`,
            human: `You brace for the worst.`
          }
        },
        bleeding_wound: {
          roll: {
            android: `You brace for the worst.`,
            human: `You brace for the worst.`
          }
        },
        gunshot_wound: {
          roll: {
            android: `You brace for the worst.`,
            human: `You brace for the worst.`
          }
        },
        fire_explosive_wound: {
          roll: {
            android: `You brace for the worst.`,
            human: `You brace for the worst.`
          }
        },
        gore_massive_wound: {
          roll: {
            android: `You brace for the worst.`,
            human: `You brace for the worst.`
          }
        },
        panic_check: {
          roll: {
            android: `You lose motor control for a moment as your sensory inputs flicker.`,
            human: `Your heartbeat races out of control and you start to feel dizzy.`
          },
          success: {
            android: `System resources free up and you regain control.`,
            human: `You take a deep breath and regain your composure.`
          }
        }
      },
      //condition flavor text
      item: {
        condition: {
          add: {
            android: `You now suffer from this condition`,
            human: `You now suffer from this condition`
          },
          increase: {
            android: `Your condition worsens.`,
            human: `Your condition worsens.`
          },
          bleed: {
            android: `Your sensors detect significant nanofluid loss.`,
            human: `You feel dizzy as you bleed out.`
          }
        }
      },
      //attribute flavor text
      attribute: {
        //stress flavor text
        stress: {
          increase: {
            android: `Power surges through your chest and you start to overheat.`,
            human: `You feel tightness in your chest and start to sweat.`
          },
          increaseHeader: {
            android: `Stress Gained`,
            human: `Stress Gained`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/macros/gain_stress.png`,
            human: `systems/mosh/images/icons/ui/attributes/macros/gain_stress.png`
          },
          hitCeiling: {
            android: `System performance grinds to a halt. <strong>Reduce the most relevant Stat or Save by {{modifySurplus}}</strong>.`,
            human: `You hit rock bottom. <strong>Reduce the most relevant Stat or Save by {{modifySurplus}}</strong>.`
          },
          pastCeiling: {
            android: `You sense unrecoverable data loss. <strong>Reduce the most relevant Stat or Save by {{modifySurplus}}</strong>.`,
            human: `You feel a part of yourself drift away. <strong>Reduce the most relevant Stat or Save by {{modifySurplus}}</strong>.`
          },
          decrease: {
            android: `You soft-reset, purging unnecessary background processes.`,
            human: `You feel a sense of calm wash over you.`
          },
          decreaseHeader: {
            android: `Stress Relieved`,
            human: `Stress Relieved`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/macros/relieve_stress.png`,
            human: `systems/mosh/images/icons/ui/attributes/macros/relieve_stress.png`
          },
          hitFloor: {
            android: `You attain perfect focus and clarity. `,
            human: `You attain complete peace of mind.`
          },
          pastFloor: {
            android: `You are already as focused as possible.`,
            human: `You are already as calm as possible.`
          }
        },
        //stat/save flavor text
        stat: {
          check: {
            android: `You gain some confidence in your skills.`,
            human: `You gain some confidence in your skills.`
          },
          save: {
            android: `You gain some confidence in your abilities.`,
            human: `You gain some confidence in your abilities.`
          }
        },
        //health flavor text
        health: {
          increase: {
            android: `System resources free up and you feel energized.`,
            human: `You feel a burst of energy.`
          },



          decrease: {
            android: `Your pain receptors indicate core damage.`,
            human: `You wince from the pain.`
          }




        },
        //wounds flavor text
        hits: {
          increase: {
            android: `System resources free up and you feel energized.`,
            human: `You feel a burst of energy.`
          },



          decrease: {
            android: `Your pain receptors indicate permanent damage.`,
            human: `You scream out from immense pain.`
          }



        },
        //radiation flavor text
        radiation: {
          damage: {
            android: `Catastro▒ic d⟑ta ▓loss de|/~ ⋥t⋱d`,
            human: `You stare into blackness and feel completely unable to pull yourself out of it.`
          }
        }
      },
      //macro flavor text (embedding actions)
      macro: {
        wound: {
          bleeding: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.1DD8i6eCS6nx2Ip0]{Bleeding}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.1DD8i6eCS6nx2Ip0]{Bleeding}`
          },
          bleeding_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.tFcWNddtZvlv7tsg]{Bleeding [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.tFcWNddtZvlv7tsg]{Bleeding [-]}`
          },
          bleeding_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.xr2o2PU5vdrR6fxQ]{Bleeding [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.xr2o2PU5vdrR6fxQ]{Bleeding [+]}`
          },
          blunt_force: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.TAjlQjA5AAy3qYL3]{Blunt Force}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.TAjlQjA5AAy3qYL3]{Blunt Force}`
          },
          blunt_force_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.oL3GH0HoEPlP8vzG]{Blunt Force [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.oL3GH0HoEPlP8vzG]{Blunt Force [-]}`
          },
          blunt_force_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.k0zf8ZGivRguc0wb]{Blunt Force [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.k0zf8ZGivRguc0wb]{Blunt Force [+]}`
          },
          fire_explosives: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.bZi1qKmcKLFvnhZ2]{Fire & Explosives}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.bZi1qKmcKLFvnhZ2]{Fire & Explosives}`
          },
          fire_explosives_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.dJnQKDf0AlwK27QD]{Fire & Explosives [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.dJnQKDf0AlwK27QD]{Fire & Explosives [-]}`
          },
          fire_explosives_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.7rYhbDAaFeok1Daq]{Fire & Explosives [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.7rYhbDAaFeok1Daq]{Fire & Explosives [+]}`
          },
          gore_massive: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.S9nnHKWYGSQmjQdp]{Gore & Massive}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.S9nnHKWYGSQmjQdp]{Gore & Massive}`
          },
          gore_massive_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.DuVjNlE4lsnR7Emc]{Gore & Massive [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.DuVjNlE4lsnR7Emc]{Gore & Massive [-]}`
          },
          gore_massive_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.eQPuDgwv8evetFIk]{Gore & Massive [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.eQPuDgwv8evetFIk]{Gore & Massive [+]}`
          },
          gunshot: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.XgCOLv9UunBddUyW]{Gunshot}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.XgCOLv9UunBddUyW]{Gunshot}`
          },
          gunshot_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.fnVATRHYJEUlS3pR]{Gunshot [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.fnVATRHYJEUlS3pR]{Gunshot [-]}`
          },
          gunshot_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered.Macro.LTpa1ZYVZl4m9k6z]{Gunshot [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered.Macro.LTpa1ZYVZl4m9k6z]{Gunshot [+]}`
          }
        }
      }
    };
    //set full path to include class type
    if (this.system.class.value.toLowerCase() === 'android') {
      //return class appropriate text
      return textLibrary[type][context][action].android;
    } else {
      //return class appropriate text
      return textLibrary[type][context][action].human;
    }
  };

  //central roll parsing function | TAKES '1d10 [+]','low' | RETURNS '{1d10,1d10}kh'
  parseRollString(rollString,aimFor) {
    //init vars
    let rollDice = ``;
    let rollTemplate = ``;
    let rollStringParsed = ``;
    //translate rollString into foundry roll string format
    if (rollString.includes('[')) {
      //extract dice needed
      rollDice = rollString.substr(0,rollString.indexOf('[')).trim().concat(',',rollString.substr(0,rollString.indexOf('[')).trim());
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
      rollStringParsed = rollTemplate.replace('[diceSet]',rollDice);
    } else {
      rollStringParsed = rollString;
    }
    //return string in foundry format
    return rollStringParsed;
  }

  //central roll parsing function | TAKES '1d100',[Foundry roll object],true,true,41,'<' | RETURNS enriched Foundry roll object
  parseRollResult(rollString,rollResult,zeroBased,checkCrit,rollTarget,comparison) {
    //init vars
    let doubles = new Set([0, 11, 22, 33, 44, 55, 66, 77, 88, 99]);
    let enrichedRollResult = rollResult;
    let newTotal = 0;
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
        if (rollString.substr(0,rollString.indexOf("[")).trim() === '1d10') {
          //modify each die
          if (enrichedRollResult.dice[0].results[0].result === 10) {enrichedRollResult.dice[0].results[0].result = 0;}
          if (enrichedRollResult.dice[1].results[0].result === 10) {enrichedRollResult.dice[1].results[0].result = 0;}
        //1d100 changes
        } else if (rollString.substr(0,rollString.indexOf("[")).trim() === '1d100') {
          //modify each die
          if (enrichedRollResult.dice[0].results[0].result === 100) {enrichedRollResult.dice[0].results[0].result = 0;}
          if (enrichedRollResult.dice[1].results[0].result === 100) {enrichedRollResult.dice[1].results[0].result = 0;}
        }
        //pick a new winner if [-] or [+]
        if (rollString.includes("[")) {
          //if [-] pick a new lowest number
          if (rollResult.formula.includes("kl")) {
            //set result value
            newTotal = Math.min(enrichedRollResult.dice[0].results[0].result,enrichedRollResult.dice[1].results[0].result);
          //if [+] pick a new highest number
          } else if (rollResult.formula.includes("kh")) {
            //set result value
            newTotal = Math.max(enrichedRollResult.dice[0].results[0].result,enrichedRollResult.dice[1].results[0].result);
          }
        //use new value if a regular roll
        } else {
          //set result value
          newTotal = enrichedRollResult.dice[0].results[0].result;
        }
        //update final roll result
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
      if (rollTarget) {
        //check for auto failure
        if (enrichedRollResult.total >= 90) {
          //result >= 90 is a failure
          enrichedRollResult.success = false;
        } else {
          //compare values based on compararison setting
          if (comparison === '<') {
            //check against being under the target
            if (enrichedRollResult.total < rollTarget) {
              //result >= target is a failure
              enrichedRollResult.success = true;
            } else {
              //result < target is a success
              enrichedRollResult.success = false;
            }
          } else {
            //check against being over the target
            if (enrichedRollResult.total > rollTarget) {
              //result < target is a failure
              enrichedRollResult.success = true;
            } else {
              //result < target is a success
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
            compareIcon = '<i class="fas fa-angle-left"></i>';
          } else {
            compareIcon = '<i class="fas fa-angle-right"></i>';
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
            enrichedRollResult.dice.forEach(function(roll){ 
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
              `;
              //loop through dice
              roll.results.forEach(function(die) { 
                //set highlight if crit is asked for -------------------------------------REWRITE for die result, only do this if checkCrit is true, combine these two into one
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
                        //compare values based on compararison setting
                        if (comparison === '<') {
                          //check against being under the target
                          if (die.result < rollTarget) {
                            //result >= target is a failure
                            critHighlight = ' min';
                          } else {
                            //result < target is a success
                            critHighlight = ' max';
                          }
                        } else {
                          //check against being over the target
                          if (die.result > rollTarget) {
                            //result < target is a failure
                            critHighlight = ' min';
                          } else {
                            //result < target is a success
                            critHighlight = ' max';
                          }
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
                //add header for this die
                diceBlock = diceBlock + `
                    <ol class="dice-rolls">
                `;
                //prepare dice icon
                if (roll.faces === 100) {
                  diceIcon = `10`;
                } else {
                  diceIcon = roll.faces.toString();
                }
                //add formula and result for this die
                diceBlock = diceBlock + `
                      <li class="roll die d${diceIcon}${critHighlight}">${die.result.toString()}</li>
                `;
                //add footer for this die
                diceBlock = diceBlock + `
                    </ol>
                `;
              });
              //add footer for this roll
              diceBlock = diceBlock + `
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
    //return the enriched roll result object
    return enrichedRollResult;
  }

  //central table rolling function | TAKES 'Panic Check','1d10','low',true,true,41,'<' | RETURNS chat message showing roll table result
  async rollTable(tableName,rollString,aimFor,zeroBased,checkCrit,rollAgainst,comparison) {
    //init vars
    let messageTemplate = ``;
    let messageContent = ``;
    let flavorText = ``;
    let chatId = randomID();
    let rollTarget = null;
    let valueAddress = [];
    //pull stat to roll against, if needed
    if(rollAgainst){
      //turn string address into array
      valueAddress = rollAgainst.split('.');
      //set rollTarget
      rollTarget = valueAddress.reduce((a, v) => a[v], this);
    }
    //roll the dice
      //parse the roll string
      let parsedRollString = this.parseRollString(rollString,aimFor);
      //roll the dice
      let rollResult = await new Roll(parsedRollString).evaluate();
      //interpret the results
      let parsedRollResult = this.parseRollResult(rollString,rollResult,zeroBased,checkCrit,rollTarget,comparison);
    //fetch the table result
      //get rolltable location
      let tableLocation = game.settings.get('mosh','rollTable');
      //get table index
      let tableIndex = game.packs.get(tableLocation).index.getName(tableName);
      //get table data
      let tableData = await game.packs.get(tableLocation).getDocument(tableIndex._id);
      //get table result
      let tableResult = tableData.getResultsForRoll(parsedRollResult.total);
    //make any custom changes to chat message
      //panic check #19 customiziation
      if (tableName === 'Panic Check' && parsedRollResult.total === 19) {
        if (this.system.class.value.toLowerCase() === 'android') {
          tableResult[0].text = tableResult[0].text.replace("HEART ATTACK / SHORT CIRCUIT (ANDROIDS).","SHORT CIRCUIT.");
        } else {
          tableResult[0].text = tableResult[0].text.replace("HEART ATTACK / SHORT CIRCUIT (ANDROIDS).","HEART ATTACK.");
        }
      }
      //account for successfel rolls against target
      if(tableName === 'Panic Check' && parsedRollResult.success === true) {
        //assign flavor text
        flavorText = this.getFlavorText('table',tableName.replace('& ','').replace(' ','_').toLowerCase(),'success');
        //remove table result
        tableResult[0].text = ``;
      } else {
        //assign flavor text
        flavorText = this.getFlavorText('table',tableName.replace('& ','').replace(' ','_').toLowerCase(),'roll');
      }
	  //generate chat message
      //prepare data
      let messageData = {
        actor: this,
        tableResult: tableResult,
        parsedRollResult: parsedRollResult,
        flavorText
      };
      //prepare template
      messageTemplate = 'systems/mosh/templates/chat/rolltable.html';
      //render template
      messageContent = await renderTemplate(messageTemplate, messageData);
      //make message
      let macroMsg = await rollResult.toMessage({
        id: chatId,
        user: game.user.id,
        speaker: {actor: this.id, token: this.token, alias: this.name},
        content: messageTemplate
      },{keepId:true});
      //wait for dice
      await game.dice3d.waitFor3DAnimationByMessageID(chatId);
  }

  //central adding addribute function | TAKES '1d10','low' | RETURNS player selected attribute. If parameters are null, it asks the player.
  chooseAttribute(rollString,aimFor) {
    //init vars
    let buttonDesc = ``;
    let dialogDesc = `
      <style>
        .macro_window{
          background: rgb(230,230,230);
          border-radius: 9px;
        }
        .macro_img{
          display: flex;
          justify-content: center; //do I need this
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
      <div class ="macro_window" style="margin-bottom : 7px; padding-left: 8px;">
        <div class="macro_desc"><h3>Select a Stat</h3>Choose the Stat that best suits the nature of this Skill Check. You will add your skill bonus to the Stat value for this roll <em>(giving you a higher number to roll under)</em>.</div>
      </div>
      <label for="str">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="str" name="stat" value="strength" checked="checked">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/attributes/strength.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Strength:</strong> Holding airlocks closed, carrying fallen comrades, climbing, pushing, jumping.
          </span>
        </div>    
        </div>
      </div>
      </label>
      <label for="spd">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="spd" name="stat" value="speed">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/attributes/speed.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Speed:</strong> Getting out of the cargo bay before the blast doors close, acting before someone <em>(or something)</em> else, running away.
          </span>
        </div>    
        </div>
      </div>
      </label>
      <label for="int">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="int" name="stat" value="intellect">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/attributes/intellect.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Intellect:</strong> Recalling your training and experience under duress, thinking through difficult problems, inventing or fixing things.
          </span>
        </div>
        </div>
      </div>
      </label>
      <label for="com">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
        <input type="radio" id="com" name="stat" value="combat">
        <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/attributes/combat.png" style="border:none"/></div>
        <div class="macro_desc" style="display: table;">
          <span style="display: table-cell; vertical-align: middle;">
            <strong>Combat:</strong> Fighting for your life.
          </span>
        </div>    
        </div>
      </div>
      </label>
    `;
    //determine what buttons to show based on rollString, then show dialog
    if (rollString === undefined) {
      //set button description
      buttonDesc = `<h4>Select your roll type:</h4>`;
      //spawn dialog
      new Dialog({
        title: `Choose a Stat`,
        content: dialogDesc + buttonDesc,
        buttons: {
          button1: {
          label: `Advantage`,
          callback: (html) => {
            rollString = `1d100 [+]`;
            aimFor = `low`;
            attribute = html.find("input[name='stat']:checked").attr("value");
          },
          icon: `<i class="fas fa-angle-double-up"></i>`
          },
          button2: {
          label: `Normal`,
          callback: (html) => {
            rollString = `1d100`;
            aimFor = `low`;
            attribute = html.find("input[name='stat']:checked").attr("value");
          },
          icon: `<i class="fas fa-minus"></i>`
          },
          button3: {
          label: `Disadvantage`,
          callback: (html) => {
            rollString = `1d100 [-]`;
            aimFor = `low`;
            attribute = html.find("input[name='stat']:checked").attr("value");
          },
          icon: `<i class="fas fa-angle-double-down"></i>`
          }
        }
      },{width: 600,height: 500}).render(true);
    } else {
      //set button description
      buttonDesc = ``;
      //spawn dialog
      new Dialog({
        title: `Choose a Stat`,
        content: dialogDesc + buttonDesc,
        buttons: {
          button1: {
          label: `Next`,
          callback: (html) => {
            attribute = html.find("input[name='stat']:checked").attr("value");
          },
          icon: `<i class="fas fa-chevron-circle-right"></i>`
          }
        }
      },{width: 600,height: 475}).render(true);
    }
    //return values
    return [rollString,aimFor,attribute];
  }

  //central adding skill function | TAKES '1d10','low' | RETURNS player selected skill + value. If parameters are null, it asks the player.
  chooseSkill(rollString,aimFor) {
	  //get list of player skills
	  let playerItems = this.items;
	  //init vars
    let skill = ``;
    let skillValue = 0;
    let buttonDesc = ``;
	  let skillHeader = `
	  <style>
      .macro_window{
        background: rgb(230,230,230);
        border-radius: 9px;
      }
      .macro_img{
        display: flex;
        justify-content: center; //do I need this
      }
      .macro_desc{
        font-family: "Roboto", sans-serif;
        font-size: 10.5pt;
        font-weight: 400;
        padding-left: 8px;
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
		  <div class="macro_desc"><h3>Add a Skill?</h3>If you have a Skill that is relevant to the task at hand, you can add the Skill’s bonus to your Stat or Save before making your roll <em>(giving you a higher number to roll under)</em>.</div>    
	  </div>`;
	  //create template for skill row
	  let skillRow = `
	  <label for="[RADIO_ID]">
		<div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
		  <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
			<input type="radio" id="[RADIO_ID]" name="skill" value="[RADIO_VALUE]">
			<div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="[RADIO_IMG]" style="border:none"/></div>
			<div class="macro_desc" style="display: table;">
			  <span style="display: table-cell; vertical-align: middle;">
				[RADIO_NAME][RADIO_DESC]
			  </span>
			</div>    
		  </div>
		</div>
	  </label>`;
	  //create skillList string
	  let skillList = ``;
	  //create skill counter
	  let skillCount = 0;
	  //create dialog pixel counter
	  let dialogHeight = 192;
	  //loop through and create skill rows
	  for (let item of playerItems) {
      //check if this is a skill
      if (item.type === "skill") {
        //set temprow as template
        let tempRow = skillRow;
        //replace ID
        tempRow = tempRow.replaceAll("[RADIO_ID]",item.name);
        //replace value
        tempRow = tempRow.replace("[RADIO_VALUE]",item.system.bonus);
        //replace img
        tempRow = tempRow.replace("[RADIO_IMG]",item.img);
        //replace name
        tempRow = tempRow.replace("[RADIO_NAME]",item.name);
        //replace desc
        tempRow = tempRow.replace("[RADIO_DESC]",item.system.description.replace("<p>","<p><strong>:</strong> "));
        //add to skillList
        skillList = skillList + tempRow;
        //increment skill count
        skillCount++;
        //increment pixel counter
        dialogHeight = dialogHeight + 77;
      }
	  } 
	  //check if there are no skills, and adjust prompt accordingly
	  if (skillCount === 0) {
		  //set window height
		  dialogHeight = 105;
		  //make skill header blank
		  skillHeader = ``;
	  }
	  //make window setting
	  let dlgTitle = '';
	  if (attribute === 'sanity' || attribute === 'fear' || attribute === 'body') {
		  dlgTitle = `Save`;
    } else if (weapon) {
      dlgTitle = `Attack`;
	  } else {
		  dlgTitle = `Stat Check`;
	  }
    //determine what buttons to show based on rollString, then show dialog
    if (rollString === undefined) {
      //set button description
      buttonDesc = `<h4>Select your roll type:</h4>`;
      //spawn dialog
      new Dialog({
        title: dlgTitle,
        content: skillHeader + skillList + buttonDesc,
        buttons: {
          button1: {
          label: `Advantage`,
          callback: (html) => {
            rollString = `1d100 [+]`;
            aimFor = `low`;
            skill = html.find("input[name='skill']:checked").attr("id");
            skillValue = html.find("input[name='skill']:checked").attr("value");
          },
          icon: `<i class="fas fa-angle-double-up"></i>`
          },
          button2: {
          label: `Normal`,
          callback: (html) => {
            rollString = `1d100`;
            aimFor = `low`;
            skill = html.find("input[name='skill']:checked").attr("id");
            skillValue = html.find("input[name='skill']:checked").attr("value");
          },
          icon: `<i class="fas fa-minus"></i>`
          },
          button3: {
          label: `Disadvantage`,
          callback: (html) => {
            rollString = `1d100 [-]`;
            aimFor = `low`;
            skill = html.find("input[name='skill']:checked").attr("id");
            skillValue = html.find("input[name='skill']:checked").attr("value");
          },
          icon: `<i class="fas fa-angle-double-down"></i>`
          }
        }
      },{width: 600,height: 500}).render(true);
    } else {
      //set button description
      buttonDesc = ``;
      //spawn dialog
      new Dialog({
        title: `Choose a Stat`,
        content: skillHeader + skillList + buttonDesc,
        buttons: {
          button1: {
          label: `Next`,
          callback: (html) => {
            skill = html.find("input[name='skill']:checked").attr("id");
            skillValue = html.find("input[name='skill']:checked").attr("value");
          },
          icon: `<i class="fas fa-chevron-circle-right"></i>`
          }
        }
      },{width: 600,height: dialogHeight}).render(true);
    }
    //return values
    return [rollString,aimFor,skill,skillValue];
  }

  //central adding skill function | TAKES nothing | RETURNS player selected skill.
  chooseAdvantage() {
	  //create footer for skill list
	  let advHtml = `<h4>Select your roll type:</h4>`;
	  //make window setting
	  let dlgTitle = '';
	  if (attribute === 'sanity' || attribute === 'fear' || attribute === 'body') {
		  dlgTitle = `Save`;
    } else if (weapon) {
      dlgTitle = `Attack`;
	  } else {
		  dlgTitle = `Stat Check`;
	  }
    //Select the stat of the roll.
    new Dialog({
		title: dlgTitle,
		content: advHtml,
		buttons: {
		  button1: {
			label: `Advantage`,
			callback: (html) => this.rollCheck(`1d100 [+]`,aimFor,attribute,skill,weapon),
			icon: `<i class="fas fa-angle-double-up"></i>`
		  },
		  button2: {
			label: `Normal`,
			callback: (html) => this.rollCheck(`1d100`,aimFor,attribute,skill,weapon),
			icon: `<i class="fas fa-minus"></i>`
		  },
		  button3: {
			label: `Disadvantage`,
			callback: (html) => this.rollCheck(`1d100 [-]`,aimFor,attribute,skill,weapon),
			icon: `<i class="fas fa-angle-double-down"></i>`
		  }
		}
	  },{width: 600,height: 105}).render(true);
    //return values
    return [rollString,aimFor];
  }

  //central check rolling function | TAKES '1d10','low','combat','Geology',10,[weapon item] | RETURNS chat message showing check result
  async rollCheck(rollString,aimFor,attribute,skill,skillValue,weapon) {
    //init vars
    let parsedDamageString = null;
    let damageResult = null;
    let parsedDamageResult = null;
    let critFail = false;
    let outcomeVerb = ``;
    let flavorText = ``;
    let needsDesc = false;
    let woundEffect = ``;
    let msgHeader = ``;
    let msgImgPath = ``;
    let chatId = randomID();
    //first we need to bounce this request away if certain parameters are NULL
      //if attribute is blank, redirect player to choose an attribute
      if (attribute === undefined) {
        //run the choose attribute function
        let chosenAttributes = this.chooseAttribute(rollString,aimFor);
        //set variables
        rollString = chosenAttributes[0];
        aimFor = chosenAttributes[1];
        attribute = chosenAttributes[2];
      }
      //if skill is blank and actor is a character, redirect player to choose a skill
      if (skill === undefined && this.actor.type === 'character') {
        //run the choose attribute function
        let chosenSkills = this.chooseSkill(rollString,aimFor);
        //set variables
        rollString = chosenSkills[0];
        aimFor = chosenSkills[1];
        skill = chosenSkills[2];
        skillValue = chosenSkills[3];
      }
      //if rollString is STILL blank, redirect player to choose the roll
      if (rollString === undefined) {
        //run the choose attribute function
        let chosenRollType = this.chooseAdvantage();
        //set variables
        rollString = chosenRollType[0];
        aimFor = chosenRollType[1];
      }
    //make the rollTarget value
      //retrieve the attribute
      let rollTarget = this.actor.system.stats[attribute].value
      //add the mod value
      rollTarget = rollTarget + (this.actor.system.stats[attribute].mod || 0);
      //add the skill value
      rollTarget = rollTarget + skillValue;      
    //roll the dice
      //parse the roll string
      let parsedRollString = this.parseRollString(rollString,aimFor);
      //roll the dice
      let rollResult = await new Roll(parsedRollString).evaluate();
      //interpret the results
      let parsedRollResult = this.parseRollResult(rollString,rollResult,true,true,rollTarget,'<');
    //prep damage dice in case its needed
    if(weapon && parsedRollResult.success) {
      //parse the roll string
      parsedDamageString = this.parseRollString(rollString,aimFor);
    }
    //prep text based on success or failure
    if (parsedRollResult.success === false) {
      //increase stress by 1
      flavorText = this.modifyActor('system.other.stress.value',1,null,false)[1];
      //if critical failure, make sure to ask for panic check
      if (parsedRollResult.critical === true) {
        //set crit fail
        critFail = true;
      }
    } else {
      //set chat message text
        //message header
        msgHeader = this.actor.system.stats[attribute].rollLabel;
        //set header image
        msgImgPath = 'systems/mosh/images/icons/ui/attributes/' + attribute + '.png';
        //set roll result as greater than or less than
        if (skillValue > 0 && parsedRollResult.success) {
          outcomeVerb = `rolled`;
        } else {
          outcomeVerb = `did not roll`;
        }
        //prepare flavor text
        if (weapon) {
          //set damage dice color
          let dsnTheme = game.settings.get('mosh','damageDiceTheme');
          //flavor text = the attack roll result
          if (weapon.system.damage === "Str/10") {
            //determine the damage string
            flavorText = 'You strike your target for <strong>[[floor(' + this.actor.system.stats.strength.value + '/10)]] damage</strong>.';
          } else {
            flavorText = 'You inflict [[' + parsedDamageString +'[' + dsnTheme +']]] points of damage.';
          }
          //determine if this roll needs a description area
          if (weapon.description || weapon.woundEffect) {
            needsDesc = true;
          }
          //create wound effect string
          if (weapon.woundEffect) {
            //start with string as is
            woundEffect = weapon.woundEffect;
            //prepare array for looping
              //replace ' [-]' and ' [+]'
              woundEffect = woundEffect.replace(' [-]','_dis').replace(' [+]','_adv');
              //simplify wounds
              woundEffect = woundEffect.replace('Bleeding','bleeding');
              woundEffect = woundEffect.replace('Blunt Force','blunt_force');
              woundEffect = woundEffect.replace('Fire & Explosives','fire_explosives');
              woundEffect = woundEffect.replace('Gore & Massive','gore_massive');
              woundEffect = woundEffect.replace('Gunshot','bleeding');
              //split string
              let woundArray = woundEffect.split(' ');
            //loop through this string and replace each wound effect with macro UUID
            woundArray.forEach(function(wnd){ 
              //replace string with macro UUID
              wnd = (this.getFlavorText('macro','wound',wnd) || wnd);
            });
            //combine back into string
            woundEffect = woundArray.join(' ');
          }
        } else {
          //flavor text = generic roll success
          if (this.actor.system.stats[attribute].rollLabel.includes(" Save")) {
            //set final footer
            flavorText = this.getFlavorText('attribute','stat','save');
          } else {
            //set final footer
            flavorText = this.getFlavorText('attribute','stat','check');
          }
        }
    }
    //prepare text for the chat message
    messageTemplate = 'systems/mosh/templates/chat/rollcheck.html';
    //push chat message
      //make message
      let macroMsg = await rollResult.toMessage({
        id: chatId,
        user: game.user.id,
        speaker: {actor: this.id, token: this.token, alias: this.name},
        content: messageTemplate
      },{keepId:true});
      //make dice
      await game.dice3d.waitFor3DAnimationByMessageID(chatId);
  }

  //central function to modify actors | TAKES 'system.other.stress.value',-1,'-1d5',true | RETURNS change details, and optional chat message
  async modifyActor(fieldAddress,modValue,modRollString,outputChatMsg) {
    //init vars
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
    let chatId = randomID();
    //get information about this field from the actor
      //get min value for this field, if it exists
      modifyMinimum = (fieldAddress.pop().push('min').split('.').reduce((a, v) => a[v], this) || null);
      //get max value for this field, if it exists
      modifyMaximum = (fieldAddress.pop().push('max').split('.').reduce((a, v) => a[v], this) || null);
      //get current value for this field
      modifyCurrent = fieldAddress.split('.').reduce((a, v) => a[v], this);
    //calculate the change, whether from a value, roll, or both
      //calculate change from the modValue
      if (modValue) {
        //update modChange
        modifyChange = modValue;
      }
      //calculate change from the modRollString
      if (modRollString) {
        //roll the dice
          //parse the roll string
          let parsedRollString = this.parseRollString(rollString,'low');
          //roll the dice
          let rollResult = await new Roll(parsedRollString).evaluate();
          //interpret the results
          let parsedRollResult = this.parseRollResult(rollString,rollResult,zeroBased,checkCrit,rollTarget,comparison);
        //update modChange
        modifyChange = modifyChange + parsedRollResult.total;
      }
      //calculate impact to the actor
        //set the new value
        modifyNew = modifyCurrent + modifyChange;
        //restrict new value based on min/max
          //cap min
          if(modifyMinimum) {
            if(modifyNew < modifyMinimum) {
              modifyNew = modifyMinimum;
            }
          }
          //cap max
          if(modifyMaximum) {
            if(modifyNew > modifyMaximum) {
              modifyNew = modifyMaximum;
            }
          }
          //measure difference between old and new value
          modifyDifference = modifyNew - modifyCurrent;
          //measure any surplus if we exceeded min/max
          modifySurplus = modifyChange - modifyDifference;
    //update actor
    this.character.update({fieldAddress: modifyNew});
    //create modification text (for chat message or return values)
      //get flavor text
      if (modifyChange > 0) {
        msgFlavor = this.getFlavorText('attribute',fieldAddress[fieldAddress.length-1],'increase');
        msgChange = 'increased';
        msgHeader = this.getFlavorText('attribute',fieldAddress[fieldAddress.length-1],'increaseHeader');
        msgImgPath = this.getFlavorText('attribute',fieldAddress[fieldAddress.length-1],'increaseImg');
      } else if (modifyChange < 0) {
        msgFlavor = this.getFlavorText('attribute',fieldAddress[fieldAddress.length-1],'decrease');
        msgChange = 'decreased';
        msgHeader = this.getFlavorText('attribute',fieldAddress[fieldAddress.length-1],'decreaseHeader');
        msgImgPath = this.getFlavorText('attribute',fieldAddress[fieldAddress.length-1],'decreaseImg');
      }
      //get modification description
        //calculate change type
        if (modifySurplus < 0) {
          msgAction = 'pastFloor';
        } else if (modifySurplus > 0) {
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
        //set message outcome
        if (modifyDifference > 0 && modifySurplus === 0) {
          msgOutcome = fieldAddress.pop().push("label").split('.').reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
        } else if (modifyDifference === 0 && modifySurplus > 0) {
          msgOutcome = this.getFlavorText('attribute',fieldAddress[fieldAddress.length-1],msgAction);
        } else {
          msgOutcome = this.getFlavorText('attribute',fieldAddress[fieldAddress.length-1],msgAction) + ` ` + fieldAddress.pop().push('label').split('.').reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
        }
    //push message if asked
    if (outputChatMsg) {
      //prepare chat message
      messageTemplate = 'systems/mosh/templates/chat/modifyActor.html';
      //push chat message
        //make message
        let macroMsg = await rollResult.toMessage({
          id: chatId,
          user: game.user.id,
          speaker: {actor: this.id, token: this.token, alias: this.name},
          content: messageTemplate
        },{keepId:true});
        //make dice
        await game.dice3d.waitFor3DAnimationByMessageID(chatId);
    }
    //return modification values
    return [msgFlavor,msgOutcome,msgChange];
  }

  //central function to modify an actors items | TAKES 'system.other.stress.value',-1,'-1d5',true | RETURNS change details, and optional chat message
  async modifyItem(itemName,addAmount) {
    //init vars
    let newValue = 0;
    let msgFlavor = ``;
    let chatId = randomID();
    //add or increase the count of the item, depending on type
    if (this.character.items.getName(itemName) != undefined) {
      //if this is an item, increase the count
      if (this.character.items.getName(itemName).type === 'item') {
        //get current quantity
        oldValue = this.character.items.getName(itemName).system.quantity;
        newValue = newValue + addAmount;
        //increase severity of the condition
        this.character.items.getName(itemName).update({'system.quantity': newValue});
        //create message text
        msgFlavor = `Quantity has increased from <strong>` + oldValue + `</strong> to <strong>` + newValue + `</strong>.`;
      //if this is a condition, increase the severity
      } else if (this.character.items.getName(itemName).type === 'condition') {
        //get current severity
        oldValue = this.character.items.getName(itemName).system.severity;
        newValue = newValue + addAmount;
        //increase severity of the condition
        this.character.items.getName(itemName).update({'system.severity': newValue});
        //create message text
        msgFlavor = this.getFlavorText('item','condition','increase') + `Severity has increased from <strong>` + oldValue + `</strong> to <strong>` + newValue + `</strong>.`;
      //if this is a weapon or armor, add another one
      } else if (this.character.items.getName(itemName).type === 'weapon' || this.character.items.getName(itemName).type === 'armor') {
        //add item to the players inventory
        const itemData = game.items.getName(itemName).toObject();
        await this.character.createEmbeddedDocuments("Item", [itemData]);
        //create message text
        msgFlavor = `You add another one of these to your inventory.`;
      }
    } else {
      //if this is an item, add it
      if (this.character.items.getName(itemName).type === 'item') {
        //give the character the item
        const itemData = game.items.getName(itemName).toObject();
        await this.character.createEmbeddedDocuments("Item", [itemData]);
        //increase severity of the condition
        this.character.items.getName(itemName).update({'system.quantity': addAmount});
        //create message text
        msgFlavor = `You add <strong>` + addAmount + `</strong> of these to your inventory..`;
      //if this is a condition, add it
      } else if (this.character.items.getName(itemName).type === 'condition') {
        //give the character the item
        const itemData = game.items.getName(itemName).toObject();
        await this.character.createEmbeddedDocuments("Item", [itemData]);
        //increase severity of the condition
        this.character.items.getName(itemName).update({'system.severity': addAmount});
        //create message text
        msgFlavor = this.getFlavorText('item','condition','add') + `, with a severity of <strong>` + addAmount + `</strong>.`;
      //if this is a weapon or armor, add it
      } else if (this.character.items.getName(itemName).type === 'weapon' || this.character.items.getName(itemName).type === 'armor') {
        //add item to the players inventory
        const itemData = game.items.getName(itemName).toObject();
        await this.character.createEmbeddedDocuments("Item", [itemData]);
        //create message text
        msgFlavor = `You add this to your inventory.`;
      }
    }
    //get item name
    let msgHeader = this.character.items.getName(itemName).name;
    //get item image
    let msgImgPath = this.character.items.getName(itemName).img;
    //prepare chat message
    let messageTemplate = 'systems/mosh/templates/chat/modifyItem.html';
    //push chat message
    let macroMsg = await rollResult.toMessage({
      id: chatId,
      user: game.user.id,
      speaker: {actor: this.id, token: this.token, alias: this.name},
      content: messageTemplate
    },{keepId:true});
  }

  //reload weapon
  reloadWeapon(itemId, options = { event: null }) {
    //dupe item to work with
    let item = duplicate(this.getEmbeddedDocument("Item",itemId));
    //reload
    if (event.button == 0) {
      if (!item.system.useAmmo) {
        item.system.curShots = item.system.shots;
      } else {
        item.system.ammo += item.system.curShots;
        let reloadAmount = Math.min(item.system.ammo, item.system.shots);
        item.system.curShots = reloadAmount;
        item.system.ammo -= reloadAmount;
      }
    }
    //update the item
    this.updateEmbeddedDocuments('Item', [item]);
	  //define macroresult
	  let macroResult = '';
	  //create chat message template
	  if (item.name.length >= 22) {
		macroResult = `
		<div class="mosh">
			<div class="rollcontainer">
				<div class="flexrow" style="margin-bottom : 5px;">
					<div class="rollweaponh1" style="font-size: 0.75rem; padding-top: 7px;">${item.name}</div>
					<div style="text-align: right"><img class="roll-image" src="${item.img}" /></div>
				</div>
				<div class="description">
					<div class="body">Weapon reloaded.</div>
				</div>
				<div style="margin-bottom : 16px;"></div>
			</div>
		</div>
		`;
	  } else {
		macroResult = `
		<div class="mosh">
			<div class="rollcontainer">
				<div class="flexrow" style="margin-bottom : 5px;">
					<div class="rollweaponh1">${item.name}</div>
					<div style="text-align: right"><img class="roll-image" src="modules/fvtt_mosh_1e_psg/icons/macros/reload.png" /></div>
				</div>
				<div class="description">
					<div class="body">Weapon reloaded.</div>
				</div>
				<div style="margin-bottom : 16px;"></div>
			</div>
		</div>
		`;
	  }
	  //push message
	  ChatMessage.create({
		user: game.user._id,
		speaker: {
			actor: this.id,
			token: this.token,
			alias: this.name
		},
		content: macroResult
	  });
  }

  // print description
  printDescription(itemId, options = { event: null }) {
    let item = duplicate(this.getEmbeddedDocument("Item",itemId));
    this.chatDesc(item);
  }

  // Print the item description into the chat.
  chatDesc(item) {
    let itemName = item.name?.charAt(0).toUpperCase() + item.name?.toLowerCase().slice(1);
    if (!item.name && isNaN(itemName))
      itemName = item.charAt(0)?.toUpperCase() + item.toLowerCase().slice(1);

    
    var rollInsert = '';
    
    if(item.system.roll){
      let r = new Roll(item.system.roll, {});
      r.evaluate({async: false});

      rollInsert = '\
        <div class="rollh2" style="text-transform: lowercase;">'+item.system.roll+'</div>\
        <div class="roll-grid">\
          <div class="roll-result">'+r._total+'</div>\
        </div>';
    }

    var templateData = {
      actor: this,
      stat: {
        name: itemName.toUpperCase()
      },
      item: item,
      insert: rollInsert,
      onlyDesc: true,
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

    /*
            if (this.data.type == "creature") {
                chatData.whisper = game.user._id;
            }
    */
    let template = 'systems/mosh/templates/chat/itemroll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;
      ChatMessage.create(chatData);
    });
  }

}