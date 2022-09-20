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

    let armorBonus = 0;
    const armors = this.getEmbeddedCollection("Item").filter(e => "armor" === e.type);
    
    for (let armor of armors) {
      if (armor.system.equipped) {
        armorBonus += armor.system.bonus;
      }
    }
    data.stats.armor.mod = armorBonus;
    data.stats.armor.total = armorBonus+data.stats.armor.value;

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

  rollStatSelect(statList) {

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
  }

  rollStat(attribute, shifted = false) {
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
  }

  rollStress(attribute) {
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
  }

  rollWeapon(itemId, options = { event: null }) {

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
  }

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

  rollSkill(itemId, options = { event: null }) {
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
  }

  async rollAttribute(attribute, advantage, item = "", rollOver = false, bonus = 0) {
    let attributeName = attribute.label?.charAt(0).toUpperCase() + attribute.label?.toLowerCase().slice(1);
    if (!attribute.label && isNaN(attributeName))
      attributeName = attribute.charAt(0)?.toUpperCase() + attribute.toLowerCase().slice(1);

    let isStress = (attribute.label == "Stress" ? true : false);
    // Roll
    let firstEdition = game.settings.get("mosh", "firstEdition");

    let diceformular = (isStress ? (firstEdition ? "1d20" : "2d10") : "1d100");


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
      r.results[0] = 0;
      r._total = 0;
    }

    if (a._total == 100) {
      a.results[0] = 0;
      a._total = 0;
    }

    let damageRoll = 0;
    if (item.type == "weapon") {
      damageRoll = new Roll(item.system.damage);
      damageRoll.evaluate({async: false});
      console.log(damageRoll);
    }

    // Format Dice
    const diceData = this.formatDice(r);

    let mod = 0;
    if(item.type == "skill"){
      mod += item.system.bonus;
    }

    
    if (attribute.mod > 0) mod += attribute.mod;
    console.log("Bonus: " + mod);
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

    /*
            if (this.data.type == "creature") {
                chatData.whisper = game.user._id;
            }
    */
    let template = 'systems/mosh/templates/chat/statroll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;
      if (game.dice3d) {
        game.dice3d.showForRoll(r, game.user, true, chatData.whisper, chatData.blind).then(displayed => ChatMessage.create(chatData));

      } else {
        chatData.sound = CONFIG.sounds.dice;
        ChatMessage.create(chatData);
      }
    });
  }

  formatDice(diceRoll) {
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
    let template = 'systems/mosh/templates/chat/statroll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;

      ChatMessage.create(chatData);
    });
  }

}