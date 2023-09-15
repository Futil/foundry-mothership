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
        death: {
          save: {
            android: `tbd`,
            human: `You knock on death's door.`
          },
        },
        wound: {
          blunt: {
            android: `tbd`,
            human: `tbd`
          },
          bleeding: {
            android: `tbd`,
            human: `tbd`
          },
          gunshot: {
            android: `tbd`,
            human: `tbd`
          },
          fire: {
            android: `tbd`,
            human: `tbd`
          },
          gore: {
            android: `tbd`,
            human: `tbd`
          },
        },
        panic: {
          fail: {
            android: `You lose motor control for a moment as your sensory inputs flicker.`,
            human: `Your heartbeat races out of control and you start to feel dizzy.`
          },
          succeed: {
            android: `tbd`,
            human: `You take a deep breath and regain your composure.`
          }
        }
      },
      //condition flavor text
      item: {
        condition: {
          add: {
            android: `You now suffer from this condition.`,
            human: `You now suffer from this condition.`
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
          hitCeiling: {
            android: `tbd`,
            human: `You hit rock bottom.`
          },
          pastCeiling: {
            android: `tbd`,
            human: `You feel a part of yourself drift away.`
          },
          decrease: {
            android: `You soft-reset, purging unnecessary background processes.`,
            human: `You feel a sense of calm wash over you.`
          },
          hitFloor: {
            android: `tbd`,
            human: `You attain complete peace of mind.`
          },
          pastFloor: {
            android: `tbd`,
            human: `You are already as calm as possible.`
          }
        },
        //stat/save flavor text
        stat: {
          check: {
            android: `tbd`,
            human: `You gain some confidence in your skills.`
          },
          save: {
            android: `tbd`,
            human: `tbd`
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
        wounds: {
          increase: {
            android: `tbd`,
            human: `tbd`
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

  //central roll parsing function | TAKES dice: '1d10 [+]' | RETURNS '{1d10,1d10}kh'
  parseRollString(rollString,advantage) {
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
        if (advantage === 'low') {
          rollTemplate = '{[diceSet]}kh';
        } else {
          rollTemplate = '{[diceSet]}kl';
        }
      } else if (rollString.includes('[+]')) {
        //use appropriate keep setting
        if (advantage === 'low') {
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

  //central roll parsing function | TAKES rollResult: [Foundry roll object], zeroBased: true, checkCrit: true, rollTarget: 41 | RETURNS enriched Foundry roll object
  //IN PROGRESS, still translating from macro
  parseRollResult(rollString,rollResult,zeroBased,checkCrit,rollTarget,comparison) {
    //init vars
    let doubles = new Set([0, 11, 22, 33, 44, 55, 66, 77, 88, 99]);
    let enrichedRollResult = rollResult;
    let newTotal = 0;
    let diceFormula = ``;
    let compareIcon = ``;
    let outcome = ``;
    let outcomeHtml = ``;
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
                //add formula and result for this die
                diceBlock = diceBlock + `
                      <li class="roll die d${roll.faces.toString()}${critHighlight}">${die.result.toString()}</li>
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

  //central table rolling function | TAKES table name: 'Panic Check', table result: 3 | RETURNS chat message showing 3rd roll table result for Panic Check
  async rollTable(tableName,rollString,aimFor,zeroBased,checkCrit,rollAgainst,comparison) {
    //init vars
    let messageTemplate = ``;
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
      //get flavor text
      let flavorText = this.getFlavorText('table','death','save');
    //make any custom changes to table results
      //panic check #19 customiziation
      if(tableName === 'Panic Check' && parsedRollResult.total === 19) {
        if (this.system.class.value.toLowerCase() === 'android') {
          tableResult[0].text = tableResult[0].text.replace("HEART ATTACK / SHORT CIRCUIT (ANDROIDS).","SHORT CIRCUIT.");
        } else {
          tableResult[0].text = tableResult[0].text.replace("HEART ATTACK / SHORT CIRCUIT (ANDROIDS).","HEART ATTACK.");
        }
      }
    //prepare chat message
      //make the overall template
      messageTemplate = `
        <div class="mosh">
          <div class="rollcontainer">
            <div class="flexrow" style="margin-bottom : 5px;">
              <div class="rollweaponh1">${tableResult[0].parent.name}</div>
              <div style="text-align: right"><img class="roll-image" src="${tableResult[0].img}" title="${tableResult[0].parent.name}" /></div>
            </div>
            ${parsedRollResult.outcomeHtml}
            <div class="description" style="margin-bottom: 10px;">
              <div class="body">${flavorText}</div>
            </div>
            ${parsedRollResult.rollHtml}
            <div class="description" style="margin-bottom : 20px;">${tableResult[0].text}</div>
          </div>
        </div>
      `;
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



/*   rollStatSelect(statList) { //REMOVEME? candidate for removal

    let selectList = "";

    statList.forEach(stat => selectList += "<option value='"+stat[0]+"'>" + stat[1].label + "</option>")
    statList.forEach(stat => console.log(stat[0]));

    console.log(statList);

    let d = new Dialog({
      title: "Select Roll Type",
      content: "<h2> Stat </h2> <select style='margin-bottom:10px;'name='stat' id='stat'> " + selectList + "</select> <br/>",
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Roll",
          callback: (html) => this.rollStat(this.system.stats[html.find('[id=\"stat\"]')[0].value])
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => { }
        }
      },
      default: "roll",
      close: () => { }
    });
    d.render(true);
  } */

/*   rollStat(attribute, shifted = false) { //REMOVEME? candidate for removal
    console.log(attribute);

    let attLabel = attribute.label?.charAt(0).toUpperCase() + attribute.label?.toLowerCase().slice(1);
    if (!attribute.label && isNaN(attLabel))
      attLabel = attribute.charAt(0)?.toUpperCase() + attribute.toLowerCase().slice(1);

    //this.rollAttribute(attribute, "none");
    if(shifted){
    this.rollAttribute(attribute, 'None');
    }
    else {
      let d = new Dialog({
        title: "Select Roll Type",
        content: "<h2> Advantages/Disadvantage </h2> <select style='margin-bottom:10px;'name='advantage' id='advantage'> <option value='none'>None</option> <option value='advantage'>Advantage/Disadvantage</option></select> <br/>",
        buttons: {
          roll: {
            icon: '<i class="fas fa-check"></i>',
            label: "Roll",
            callback: (html) => this.rollAttribute(attribute, html.find('[id=\"advantage\"]')[0].value)
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => { }
          }
        },
        default: "roll",
        close: () => { }
      });
      d.render(true);
    }
  } */

/*   rollStress(attribute) { //REMOVEME? candidate for removal
    //this.rollAttribute(attribute, "none");
    let rollOver = true;
    if (attribute.label == "Calm")
      rollOver = false;

    let attLabel = attribute.label?.charAt(0).toUpperCase() + attribute.label?.toLowerCase().slice(1);
    if (!attribute.label && isNaN(attLabel))
      attLabel = attribute.charAt(0)?.toUpperCase() + attribute.toLowerCase().slice(1);

    let d = new Dialog({
      title: "Select Roll Type",
      content: "<h2> Advantages/Disadvantage </h2> <select style='margin-bottom:10px;'name='advantage' id='advantage'> <option value='none'>None</option> <option value='advantage'>Advantage/Disadvantage</option></select> <br/>",
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Roll",
          callback: (html) => this.rollAttribute(attribute, html.find('[id=\"advantage\"]')[0].value, '', rollOver)
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => { }
        }
      },
      default: "roll",
      close: () => { }
    });
    d.render(true);
  } */

/*   rollWeapon(itemId, options = { event: null }) { //REMOVEME? candidate for removal

    let item = duplicate(this.getEmbeddedDocument("Item",itemId));

    console.log(item);

    if (item.system.useAmmo == true || item.system.shots > 0) {
      if (item.system.shots == 0) {
        if (item.system.ammo > 0) {
          item.system.ammo -= 1;
          this.updateEmbeddedDocuments('Item', [item]);
        } else {

          //Select the stat of the roll.
          let t = new Dialog({
            title: "Reload",
            content: "<h2>Out of Ammo</h2><br/>",
            buttons: {
              cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel",
                callback: () => { }
              }
            },
            default: "roll",
            close: () => { }
          });
          t.render(true);
          return;
        }
      } else {
        if (item.system.curShots > 0) {
          let subAmount = Math.max(item.system.shotsPerFire, 1);
          item.system.curShots = Math.max(item.system.curShots - subAmount, 0);
          console.log("Unloading Shots");
          this.updateEmbeddedDocuments('Item', [item]);
        }
        else {
          if (item.system.ammo > 0 || !item.system.useAmmo) {
            //Select the stat of the roll.
            let t = new Dialog({
              title: "Reload",
              content: "<h2> Reload? </h2><br/>",
              buttons: {
                roll: {
                  icon: '<i class="fas fa-check"></i>',
                  label: "Reload",
                  callback: (html) => this.reloadWeapon(itemId)
                },
                cancel: {
                  icon: '<i class="fas fa-times"></i>',
                  label: "Cancel",
                  callback: () => { }
                }
              },
              default: "roll",
              close: () => { }
            });
            t.render(true);
          } else {
            //Select the stat of the roll.
            let t = new Dialog({
              title: "Reload",
              content: "<h2>Out of Ammo</h2><br/>",
              buttons: {
                cancel: {
                  icon: '<i class="fas fa-times"></i>',
                  label: "Cancel",
                  callback: () => { }
                }
              },
              default: "roll",
              close: () => { }
            });
            t.render(true);
          }

          // let actor = this;
          // let speaker = ChatMessage.getSpeaker({ actor });
          // ChatMessage.create({
          //   speaker,
          //   content: item.system.ammo > 0 ? `I need to reload my ` + item.name + "!" : "I'm out of ammo!",
          //   type: CHAT_MESSAGE_TYPES.EMOTE
          // },
          //   { chatBubble: true });
          return;
        }
      }
    }

    //Select the stat of the roll.
    let t = new Dialog({
      title: "Select Stat",
      content: "<h2> Advantage/Disadvantage </h2> <select style='margin-bottom:10px;'name='advantage' id='advantage'>\
        <option value='none'>None</option>\
        <option value='advantage'>Advantage/Disadvantage</option>\
        </select> <br/>\
        \
        <h2> Skill Bonus </h2> <input style='margin-bottom:10px;' name='bonus' id='bonus' value='"+item.system.bonus+"'></input><br/>",
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Roll",
          callback: (html) => this.rollAttribute(this.system.stats["combat"], html.find('[id=\"advantage\"]')[0].value, item, false, html.find('[id=\"bonus\"]')[0].value)
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => { }
        }
      },
      default: "roll",
      close: () => { }
    });
    t.render(true);
  } */

  reloadWeapon(itemId, options = { event: null }) {
    let item = duplicate(this.getEmbeddedDocument("Item",itemId));
    
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

    this.updateEmbeddedDocuments('Item', [item]);
  }


  printDescription(itemId, options = { event: null }) {
    let item = duplicate(this.getEmbeddedDocument("Item",itemId));
    this.chatDesc(item);
  }

/*   rollSkill(itemId, options = { event: null }) { //REMOVEME? candidate for removal
    let item = duplicate(this.getEmbeddedDocument("Item",itemId));

    // let attLabel = skill.label?.charAt(0).toUpperCase() + skill.label?.toLowerCase().slice(1);
    // if (!skill.label && isNaN(attLabel))
    //   attLabel = skill.charAt(0)?.toUpperCase() + item.name.toLowerCase().slice(1);

    //this.rollAttribute(attribute, "none");

    //Select the stat of the roll.
    let t = new Dialog({
      title: "Select Stat",
      content: "<h2> Stat </h2> <select style='margin-bottom:10px;'name='stat' id='stat'>\
        <option value='strength'>Strength</option>\
        <option value='speed'>Speed</option>\
        <option value='intellect'>Intellect</option>\
        <option value='combat'>Combat</option>\
        </select> <br/>\
        <h2> Advantage/Disadvantage </h2> <select style='margin-bottom:10px;'name='advantage' id='advantage'>\
        <option value='none'>None</option>\
        <option value='advantage'>Advantage/Disadvantage</option>\
        </select> <br/>",
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Roll",
          callback: (html) => this.rollAttribute(this.system.stats[html.find('[id=\"stat\"]')[0].value], html.find('[id=\"advantage\"]')[0].value, item)
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => { }
        }
      },
      default: "roll",
      close: () => { }
    });
    t.render(true);
  } */

/*   async rollAttribute(attribute, advantage, item = "", rollOver = false, bonus = 0) { //REMOVEME? candidate for removal
    let attributeName = attribute.label?.charAt(0).toUpperCase() + attribute.label?.toLowerCase().slice(1);
    if (!attribute.label && isNaN(attributeName))
      attributeName = attribute.charAt(0)?.toUpperCase() + attribute.toLowerCase().slice(1);

    let isStress = (attribute.label == "Stress" ? true : false);
    // Roll
    let firstEdition = game.settings.get("mosh", "firstEdition");

    let diceformular = (isStress ? (firstEdition ? "1d20" : "2d10") : "1d100");

    if(isNaN(bonus)){
      bonus = 0;
      item.system.bonus = 0;
    }
    // if (advantage != undefined && advantage != NaN && advantage != 0) {
    //     diceformular = diceformular + "+" + advantage + "d6kh";
    // }
    let r = new Roll(diceformular, {});
    r.evaluate({async: false});

    let rSplit = ("" + r._total).split("");

    //Advantage roll
    let a = new Roll(diceformular, {});
    a.evaluate({async: false});

    if (r._total == 100) {
      //r.results[0] = 0;
      r._total = 0;
    }


    if (a._total == 100) {
      //a.results[0] = 0;
      a._total = 0;
    }

    let range = "N/A";
    let damageRoll = 0;
    if (item.type == "weapon") {

      if(item.system.damage.includes("[+]")){
        var newRoll = item.system.damage.replace("[+]", "");
        newRoll = "{"+newRoll+", "+newRoll+"}kh";
        console.log(newRoll);
        damageRoll = new Roll(newRoll);
      } else if(item.system.damage.includes("[-]")){
        var newRoll = item.system.damage.replace("[-]", "");
        newRoll = "{"+newRoll+", "+newRoll+"}kl";
        console.log(newRoll);
        damageRoll = new Roll(newRoll);
      } 
      else {
        damageRoll = new Roll(item.system.damage);
      }

      damageRoll.evaluate({async: false});
      range = item.system.ranges.value;

    }

    // Format Dice
    const diceData = this.formatDice(r);

    let mod = 0;
    if(item.type == "skill"){
      mod += item.system.bonus;
    }

    
    if (attribute.mod != 0) mod += attribute.mod;

    if(isNaN(mod)) mod = 0;

    let targetValue = attribute.value + mod + (item == "" ? 0 : parseInt(bonus));

    let critical = false;

    if (r._total == 0 && !isStress || rSplit[0] == rSplit[1] && !isStress)
      critical = true;


    let panic = false;
    let panicText = '';
    if(isStress && r._total <= attribute.value && firstEdition){
      await(async () => {
        // const contents = await game.packs.get("Tables").getContent();
        // const table= contents.find(i => i.name === `Panic`);
        let tableLocation = game.settings.get("mosh", "panicTable");
        const documentIndex = game.packs.get(tableLocation).index.getName("Panic");
        const doc = await game.packs.get(tableLocation).getDocument(documentIndex._id);
        panic = true;
        panicText = doc.getResultsForRoll(r._total)[0].data.text;

        //then just put your normal table rolling command using `table`
        })()

    }

    //Here's where we handle the result text.
    let resultText = "";

    if (rollOver == true) {
      if (critical)
        resultText = (r._total > targetValue ? "Critical Success" : "Critical Failure");
      else
        resultText = (r._total > targetValue ? "Success" : "Failure");
    } else {
      if (critical)
        resultText = (r._total < targetValue ? "Critical Success" : "Critical Failure");
      else
        resultText = (r._total < targetValue ? "Success" : "Failure");
    }

    var templateData = {
      actor: this,
      stat: {
        name: attributeName.toUpperCase()
      },
      data: {
        diceTotal: {
          value: r._total,
          advantageValue: a._total,
          damageValue: damageRoll._total,
          damageRoll: damageRoll
        },
        resultText: {
          value: resultText
        },
        isCreature: {
          value: this.type == "creature" ? true : false
        },
        panic: panic,
        panicText : panicText
      },
      target: attribute.value,
      mod: mod,
      item: item,
      targetValue: targetValue,
      useSkill: item.type == "skill" ? true : false,
      isWeapon: item.type == "weapon" ? true : false,
      range: range,
      critical: critical,
      advantage: advantage == "advantage" ? true : false,
      bonus: bonus,
      diceData
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

    //comment this out:
            if (this.data.type == "creature") {
                chatData.whisper = game.user._id;
            }
    
    let template = 'systems/mosh/templates/chat/statroll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;
      if (game.dice3d) {
        if(!damageRoll)
          game.dice3d.showForRoll(r, game.user, true, chatData.whisper, chatData.blind).then(displayed => ChatMessage.create(chatData));
        else
          game.dice3d.showForRoll(damageRoll, game.user, true, chatData.whisper, chatData.blind).then(displayed => ChatMessage.create(chatData));
        
      } else {
        chatData.sound = CONFIG.sounds.dice;
        ChatMessage.create(chatData);
      }
    });
  } */

/*   formatDice(diceRoll) { //REMOVEME? candidate for removal
    let diceData = { dice: [] };

    if (diceRoll != null) {
      let pushDice = (diceData, total, faces, color) => {
        let img = null;
        if ([4, 6, 8, 10, 12, 20].indexOf(faces) > -1) {
          img = `../icons/svg/d${faces}-grey.svg`;
        }
        diceData.dice.push({
          img: img,
          result: total,
          dice: true,
          color: color
        });
      };

      for (let i = 0; i < diceRoll.terms.length; i++) {
        if (diceRoll.terms[i] instanceof Die) {
          let pool = diceRoll.terms[i].results;
          let faces = diceRoll.terms[i].faces;

          pool.forEach((pooldie) => {
            if (pooldie.discarded) {
              pushDice(diceData, pooldie.result, faces, "#777");
            } else {
              pushDice(diceData, pooldie.result, faces, "white");
            }

          });
        } else if (typeof diceRoll.terms[i] == 'string') {
          const parsed = parseInt(diceRoll.terms[i]);
          if (!isNaN(parsed)) {
            diceData.dice.push({
              img: null,
              result: parsed,
              dice: false,
              color: 'white'
            });
          } else {
            diceData.dice.push({
              img: null,
              result: diceRoll.terms[i],
              dice: false
            });
          }
        }
        else if (typeof diceRoll.terms[i] == 'number') {
          const parsed = parseInt(diceRoll.terms[i]);
          if (!isNaN(parsed)) {
            diceData.dice.push({
              img: null,
              result: parsed,
              dice: false,
              color: 'white'
            });
          } else {
            diceData.dice.push({
              img: null,
              result: diceRoll.terms[i],
              dice: false
            });
          }
        }
      }
    }

    return diceData;
  } */

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