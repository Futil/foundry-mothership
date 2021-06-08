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

    const actorData = this.data;
    const data = actorData.data;
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
    const data = actorData.data;

    let armorBonus = 0;
    const armors = this.getEmbeddedCollection("Item").filter(e => "armor" === e.type);

    for (let armor of armors) {
      if (armor.data.equipped) {
        armorBonus += armor.data.bonus;
      }
    }
    data.stats.armor.mod = armorBonus;
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCreatureData(actorData) {
    const data = actorData.data;
  }

  _prepareShipData(actorData) {
    const data = actorData.data;
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
          callback: (html) => this.rollStat(this.data.data.stats[html.find('[id=\"stat\"]')[0].value])
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

  rollStat(attribute) {
    console.log(attribute);

    let attLabel = attribute.label?.charAt(0).toUpperCase() + attribute.label?.toLowerCase().slice(1);
    if (!attribute.label && isNaN(attLabel))
      attLabel = attribute.charAt(0)?.toUpperCase() + attribute.toLowerCase().slice(1);

    //this.rollAttribute(attribute, "none");

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

    if (item.data.useAmmo == true || item.data.shots > 0) {
      if (item.data.shots == 0) {
        if (item.data.ammo > 0) {
          item.data.ammo -= 1;
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
        if (item.data.curShots > 0) {
          let subAmount = Math.max(item.data.shotsPerFire, 1);
          item.data.curShots = Math.max(item.data.curShots - subAmount, 0);
          console.log("Unloading Shots");
          this.updateEmbeddedDocuments('Item', [item]);
        }
        else {
          if (item.data.ammo > 0 || !item.data.useAmmo) {
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
          //   content: item.data.ammo > 0 ? `I need to reload my ` + item.name + "!" : "I'm out of ammo!",
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
        </select> <br/>",
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Roll",
          callback: (html) => this.rollAttribute(this.data.data.stats["combat"], html.find('[id=\"advantage\"]')[0].value, item)
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
      if (!item.data.useAmmo) {
        item.data.curShots = item.data.shots;
      } else {
        item.data.ammo += item.data.curShots;
        let reloadAmount = Math.min(item.data.ammo, item.data.shots);
        item.data.curShots = reloadAmount;

        item.data.ammo -= reloadAmount;
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
          callback: (html) => this.rollAttribute(this.data.data.stats[html.find('[id=\"stat\"]')[0].value], html.find('[id=\"advantage\"]')[0].value, item)
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

  rollAttribute(attribute, advantage, item = "", rollOver = false) {
    let attributeName = attribute.label?.charAt(0).toUpperCase() + attribute.label?.toLowerCase().slice(1);
    if (!attribute.label && isNaN(attributeName))
      attributeName = attribute.charAt(0)?.toUpperCase() + attribute.toLowerCase().slice(1);

    let isStress = (attribute.label == "Stress" ? true : false);
    // Roll
    let diceformular = (isStress ? "2d10" : "1d100");
  

    console.log(attribute);

    // if (advantage != undefined && advantage != NaN && advantage != 0) {
    //     diceformular = diceformular + "+" + advantage + "d6kh";
    // }
    let r = new Roll(diceformular, {});
    r.roll();

    console.log(r);

    let rSplit = ("" + r._total).split("");

    //Advantage roll
    let a = new Roll(diceformular, {});
    a.roll();

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
      damageRoll = new Roll(item.data.damage);
      damageRoll.roll();
      console.log(damageRoll);
    }

    // Format Dice
    const diceData = this.formatDice(r);

    let mod = 0;
    if (attribute.mod > 0) mod = attribute.mod;

    let targetValue = attribute.value + mod + (item == "" ? 0 : item.data.bonus);

    let critical = false;

    if (r._total == 0 && !isStress || rSplit[0] == rSplit[1] && !isStress)
      critical = true;

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

    console.log(attribute.value + attribute.mod);

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
          value: this.data.type == "creature" ? true : false
        }
      },
      target: attribute.value,
      mod: mod,
      item: item,
      targetValue: targetValue,
      useSkill: item.type == "skill" ? true : false,
      isWeapon: item.type == "weapon" ? true : false,
      critical: critical,
      advantage: advantage == "advantage" ? true : false,
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
    
    if(item.data.roll){
      let r = new Roll(item.data.roll, {});
      r.roll();

      rollInsert = '\
        <div class="rollh2" style="text-transform: lowercase;">'+item.data.roll+'</div>\
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