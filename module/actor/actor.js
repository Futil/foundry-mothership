/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class MothershipActor extends Actor {

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
    data.stats.armor.total = armorPoints+data.stats.armor.value;
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
  getFlavorText (type,context,action) {
    //create function to check the library for a value
    const checkNested = function(obj = {}){
        const args = Array.prototype.slice.call(arguments, 1);
        for (let i = 0; i < args.length; i++) {
          if (!obj || !obj.hasOwnProperty(args[i])) {
              return false;
          }
          obj = obj[args[i]];
        };
        return true;
    }
    let test = {
        level1:{
          level2:{
              level3:'level3'
          }
        }
    };
    //replace 'stress' with calm if the setting is active
    if (game.settings.get("mosh", "useCalm") && context === 'stress') {
      context = 'calm';
    }
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
        fire_explosives_wound: {
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
        },
        distress_signal: {
          roll: {
            human: `You put your ship on emergency power, seal yourselves in cryopods, send out a Distress Signal, and wait for help. It’s a long shot, but sometimes it’s the only shot you’ve got. Will you be found?`
          }
        },
        maintenance_issues: {
          roll: {
            human: `You perform a full inspection of the ship for wear and tear.`
          },
          success: {
            human: `You find nothing wrong with the ship.`
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
          },
          radiation: {
            android: `Catastro▒ic d⟑ta ▓loss de|/~ ⋥t⋱d`,
            human: `You stare into blackness and feel completely unable to pull yourself out of it.`
          },
          cryo: {
            android: `Your systems malfunction from the condensation damage.`,
            human: `You awaken cold and frigid, barely able to move.`
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
            android: `systems/mosh/images/icons/ui/macros/gain_stress.png`,
            human: `systems/mosh/images/icons/ui/macros/gain_stress.png`
          },
          hitCeiling: {
            android: `System performance grinds to a halt.`,
            human: `You hit rock bottom.`
          },
          pastCeiling: {
            android: `You sense unrecoverable data loss.`,
            human: `You feel a part of yourself drift away.`
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
            android: `systems/mosh/images/icons/ui/macros/relieve_stress.png`,
            human: `systems/mosh/images/icons/ui/macros/relieve_stress.png`
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
        //calm flavor text
        calm: {
          increase: {
            android: `You soft-reset, purging unnecessary background processes.`,
            human: `You feel a sense of calm wash over you.`
          },
          increaseHeader: {
            android: `Calm Gained`,
            human: `Calm Gained`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/macros/relieve_stress.png`,
            human: `systems/mosh/images/icons/ui/macros/relieve_stress.png`
          },
          hitCeiling: {
            android: `You attain perfect focus and clarity.`,
            human: `You attain complete peace of mind.`
          },
          pastCeiling: {
            android: `You are already as focused as possible.`,
            human: `You are already as calm as possible.`
          },
          decrease: {
            android: `Power surges through your chest and you start to overheat.`,
            human: `You feel tightness in your chest and start to sweat.`
          },
          decreaseHeader: {
            android: `Calm Lost`,
            human: `Calm Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/macros/gain_stress.png`,
            human: `systems/mosh/images/icons/ui/macros/gain_stress.png`
          },
          hitFloor: {
            android: `System performance grinds to a halt.`,
            human: `You hit rock bottom.`
          },
          pastFloor: {
            android: `You sense unrecoverable data loss.`,
            human: `You feel a part of yourself drift away.`
          }
        },
        //health flavor text
        health: {
          increase: {
            android: `System resources free up and you feel energized.`,
            human: `You feel a burst of energy.`
          },
          increaseHeader: {
            android: `Health Gained`,
            human: `Health Gained`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/health.png`,
            human: `systems/mosh/images/icons/ui/attributes/health.png`
          },
          hitCeiling: {
            android: `You are now at full health.`,
            human: `You are now at full health.`
          },
          pastCeiling: {
            android: `You are already at full health.`,
            human: `You are already at full health.`
          },
          decrease: {
            android: `Your pain receptors indicate core damage.`,
            human: `You wince from the pain.`
          },
          decreaseHeader: {
            android: `Health Lost`,
            human: `Health Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/health.png`,
            human: `systems/mosh/images/icons/ui/attributes/health.png`
          },
          hitFloor: {
            android: `Your pain receptors indicate core damage.`,
            human: `Your pain receptors indicate core damage.`
          },
          pastFloor: {
            android: `Your pain receptors indicate core damage.`,
            human: `Your pain receptors indicate core damage.`
          }
        },
        //hits flavor text
        hits: {
          increase: {
            android: `@UUID[Compendium.mosh.macros_hotbar_1e.ZzKgfEmRdvDfyBMS]{Make a Wound Check}`,
            human: `@UUID[Compendium.mosh.macros_hotbar_1e.ZzKgfEmRdvDfyBMS]{Make a Wound Check}`
          },
          increaseHeader: {
            android: `Damaged`,
            human: `Wounded`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/health.png`,
            human: `systems/mosh/images/icons/ui/attributes/health.png`
          },
          hitCeiling: {
            android: `You are about to to die, make your final moments count. Let your death meaningful with your final action.<br><br>@UUID[Compendium.mosh.macros_hotbar_1e.NsRHfRuuNGPfkYVf]{Make a Death Save}`,
            human: `You are about to to die, make your final moments count. Let your death meaningful with your final action.<br><br>@UUID[Compendium.mosh.macros_hotbar_1e.NsRHfRuuNGPfkYVf]{Make a Death Save}`
          },
          pastCeiling: {
            android: `You are about to to die, make your final moments count. Let your death meaningful with your final action.<br><br>@UUID[Compendium.mosh.macros_hotbar_1e.NsRHfRuuNGPfkYVf]{Make a Death Save}`,
            human: `You are about to to die, make your final moments count. Let your death meaningful with your final action.<br><br>@UUID[Compendium.mosh.macros_hotbar_1e.NsRHfRuuNGPfkYVf]{Make a Death Save}`
          },
          decrease: {
            android: `System resources free up and you feel energized.`,
            human: `You feel a burst of energy.`
          },
          decreaseHeader: {
            android: `Repaired`,
            human: `Mended`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/health.png`,
            human: `systems/mosh/images/icons/ui/attributes/health.png`
          },
          hitFloor: {
            android: `You are now at full health.`,
            human: `You are now at full health.`
          },
          pastFloor: {
            android: `You are already at full health.`,
            human: `You are already at full health.`
          }
        },
        //strength flavor text
        strength: {
          check: {
            android: `You gain some confidence in your skills.`,
            human: `You gain some confidence in your skills.`
          },
          increase: {
            android: `Data recovered. Central partition data restored.`,
            human: `You start to feel like yourself again.`
          },
          increaseHeader: {
            android: `Strength Enhanced`,
            human: `Strength Gained`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/strength.png`,
            human: `systems/mosh/images/icons/ui/attributes/strength.png`
          },
          hitCeiling: {
            android: `You are now at maximum strength.`,
            human: `You are now at maximum strength.`
          },
          pastCeiling: {
            android: `You are already at maximum strength.`,
            human: `You are already at maximum strength.`
          },
          decrease: {
            android: `Central partition damage detected. Unrecoverable sectors found.`,
            human: `You feel a part of yourself drift away.`
          },
          decreaseHeader: {
            android: `Strength Impaired`,
            human: `Strength Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/strength.png`,
            human: `systems/mosh/images/icons/ui/attributes/strength.png`
          },
          hitFloor: {
            android: `You have no strength left.`,
            human: `You have no strength left.`
          },
          pastFloor: {
            android: `Your strength cannot get any lower.`,
            human: `Your strength cannot get any lower.`
          }
        },
        //speed flavor text
        speed: {
          check: {
            android: `You gain some confidence in your skills.`,
            human: `You gain some confidence in your skills.`
          },
          increase: {
            android: `Data recovered. Central partition data restored.`,
            human: `You start to feel like yourself again.`
          },
          increaseHeader: {
            android: `Speed Enhanced`,
            human: `Speed Gained`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/speed.png`,
            human: `systems/mosh/images/icons/ui/attributes/speed.png`
          },
          hitCeiling: {
            android: `You are now at maximum speed.`,
            human: `You are now at maximum speed.`
          },
          pastCeiling: {
            android: `You are already at maximum speed.`,
            human: `You are already at maximum speed.`
          },
          decrease: {
            android: `Central partition damage detected. Unrecoverable sectors found.`,
            human: `You feel a part of yourself drift away.`
          },
          decreaseHeader: {
            android: `Speed Impaired`,
            human: `Speed Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/speed.png`,
            human: `systems/mosh/images/icons/ui/attributes/speed.png`
          },
          hitFloor: {
            android: `You feel completely lethargic.`,
            human: `You feel completely lethargic.`
          },
          pastFloor: {
            android: `Your speed cannot get any lower.`,
            human: `Your speed cannot get any lower.`
          }
        },
        //intellect flavor text
        intellect: {
          check: {
            android: `You gain some confidence in your skills.`,
            human: `You gain some confidence in your skills.`
          },
          increase: {
            android: `Data recovered. Central partition data restored.`,
            human: `You start to feel like yourself again.`
          },
          increaseHeader: {
            android: `Intellect Enhanced`,
            human: `Intellect Gained`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/intellect.png`,
            human: `systems/mosh/images/icons/ui/attributes/intellect.png`
          },
          hitCeiling: {
            android: `You are now at maximum intellect.`,
            human: `You are now at maximum intellect.`
          },
          pastCeiling: {
            android: `You are already at maximum intellect.`,
            human: `You are already at maximum intellect.`
          },
          decrease: {
            android: `Central partition damage detected. Unrecoverable sectors found.`,
            human: `You feel a part of yourself drift away.`
          },
          decreaseHeader: {
            android: `Intellect Impaired`,
            human: `Intellect Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/intellect.png`,
            human: `systems/mosh/images/icons/ui/attributes/intellect.png`
          },
          hitFloor: {
            android: `You feel utterly confused.`,
            human: `You feel utterly confused.`
          },
          pastFloor: {
            android: `Your intellect cannot get any lower.`,
            human: `Your intellect cannot get any lower.`
          }
        },
        //combat flavor text
        combat: {
          check: {
            android: `You gain some confidence in your skills.`,
            human: `You gain some confidence in your skills.`
          },
          increase: {
            android: `Data recovered. Central partition data restored.`,
            human: `You start to feel like yourself again.`
          },
          increaseHeader: {
            android: `Combat Enhanced`,
            human: `Combat Gained`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/combat.png`,
            human: `systems/mosh/images/icons/ui/attributes/combat.png`
          },
          hitCeiling: {
            android: `You are now at maximum combat.`,
            human: `You are now at maximum combat.`
          },
          pastCeiling: {
            android: `You are already at maximum combat.`,
            human: `You are already at maximum combat.`
          },
          decrease: {
            android: `Central partition damage detected. Unrecoverable sectors found.`,
            human: `You feel a part of yourself drift away.`
          },
          decreaseHeader: {
            android: `Combat Impaired`,
            human: `Combat Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/combat.png`,
            human: `systems/mosh/images/icons/ui/attributes/combat.png`
          },
          hitFloor: {
            android: `You can't imagine fighting anymore.`,
            human: `You can't imagine fighting anymore.`
          },
          pastFloor: {
            android: `Your combat cannot get any lower.`,
            human: `Your combat cannot get any lower.`
          }
        },
        //instinct flavor text
        instinct: {
          check: {
            android: `You gain some confidence in your skills.`,
            human: `You gain some confidence in your skills.`
          },
          increase: {
            android: `Data recovered. Central partition data restored.`,
            human: `You start to feel like yourself again.`
          },
          increaseHeader: {
            android: `Instinct Enhanced`,
            human: `Instinct Gained`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/instinct.png`,
            human: `systems/mosh/images/icons/ui/attributes/instinct.png`
          },
          hitCeiling: {
            android: `You are now at maximum instinct.`,
            human: `You are now at maximum instinct.`
          },
          pastCeiling: {
            android: `You are already at maximum instinct.`,
            human: `You are already at maximum instinct.`
          },
          decrease: {
            android: `Central partition damage detected. Unrecoverable sectors found.`,
            human: `You feel a part of yourself drift away.`
          },
          decreaseHeader: {
            android: `Instinct Impaired`,
            human: `Instinct Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/instinct.png`,
            human: `systems/mosh/images/icons/ui/attributes/instinct.png`
          },
          hitFloor: {
            android: `You've lost your instincts.`,
            human: `You've lost your instincts.`
          },
          pastFloor: {
            android: `Your instinct cannot get any lower.`,
            human: `Your instinct cannot get any lower.`
          }
        },
        //loyalty flavor text
        loyalty: {
          check: {
            android: `You gain some confidence in your skills.`,
            human: `You gain some confidence in your skills.`
          },
          increase: {
            android: `Data recovered. Central partition data restored.`,
            human: `You start to feel like yourself again.`
          },
          increaseHeader: {
            android: `Loyalty Enhanced`,
            human: `Loyalty Gained`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/loyalty.png`,
            human: `systems/mosh/images/icons/ui/attributes/loyalty.png`
          },
          hitCeiling: {
            android: `You are now at maximum loyalty.`,
            human: `You are now at maximum loyalty.`
          },
          pastCeiling: {
            android: `You are already at maximum loyalty.`,
            human: `You are already at maximum loyalty.`
          },
          decrease: {
            android: `Central partition damage detected. Unrecoverable sectors found.`,
            human: `You feel a part of yourself drift away.`
          },
          decreaseHeader: {
            android: `Loyalty Impaired`,
            human: `Loyalty Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/loyalty.png`,
            human: `systems/mosh/images/icons/ui/attributes/loyalty.png`
          },
          hitFloor: {
            android: `You only care about yourself.`,
            human: `You only care about yourself.`
          },
          pastFloor: {
            android: `Your loyalty cannot get any lower.`,
            human: `Your loyalty cannot get any lower.`
          }
        },
        //sanity flavor text
        sanity: {
          check: {
            android: `You gain some confidence in your abilities.`,
            human: `You gain some confidence in your abilities.`
          },
          increase: {
            android: `Data recovered. Central partition data restored.`,
            human: `You start to feel like yourself again.`
          },
          increaseHeader: {
            android: `Sanity Enhanced`,
            human: `Sanity Increased`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/sanity.png`,
            human: `systems/mosh/images/icons/ui/attributes/sanity.png`
          },
          hitCeiling: {
            android: `You are now at maximum sanity.`,
            human: `You are now at maximum sanity.`
          },
          pastCeiling: {
            android: `You are already at maximum sanity.`,
            human: `You are already at maximum sanity.`
          },
          decrease: {
            android: `Central partition damage detected. Unrecoverable sectors found.`,
            human: `You feel a part of yourself drift away.`
          },
          decreaseHeader: {
            android: `Sanity Impaired`,
            human: `Sanity Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/sanity.png`,
            human: `systems/mosh/images/icons/ui/attributes/sanity.png`
          },
          hitFloor: {
            android: `You've lost your mind.`,
            human: `You've lost your mind.`
          },
          pastFloor: {
            android: `Your sanity cannot get any lower.`,
            human: `Your sanity cannot get any lower.`
          }
        },
        //fear flavor text
        fear: {
          check: {
            android: `You gain some confidence in your abilities.`,
            human: `You gain some confidence in your abilities.`
          },
          increase: {
            android: `Data recovered. Central partition data restored.`,
            human: `You start to feel like yourself again.`
          },
          increaseHeader: {
            android: `Bravery Enhanced`,
            human: `Bravery Improved`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/fear.png`,
            human: `systems/mosh/images/icons/ui/attributes/fear.png`
          },
          hitCeiling: {
            android: `You are now at maximum fear.`,
            human: `You are now at maximum fear.`
          },
          pastCeiling: {
            android: `You are already at maximum fear.`,
            human: `You are already at maximum fear.`
          },
          decrease: {
            android: `Central partition damage detected. Unrecoverable sectors found.`,
            human: `You feel a part of yourself drift away.`
          },
          decreaseHeader: {
            android: `Bravery Impaired`,
            human: `Bravery Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/fear.png`,
            human: `systems/mosh/images/icons/ui/attributes/fear.png`
          },
          hitFloor: {
            android: `You are afraid of everything.`,
            human: `You are afraid of everything.`
          },
          pastFloor: {
            android: `Your fear cannot get any lower.`,
            human: `Your fear cannot get any lower.`
          }
        },
        //body flavor text
        body: {
          check: {
            android: `You gain some confidence in your abilities.`,
            human: `You gain some confidence in your abilities.`
          },
          increase: {
            android: `Data recovered. Central partition data restored.`,
            human: `You start to feel like yourself again.`
          },
          increaseHeader: {
            android: `Body Enhanced`,
            human: `Body Strengthened`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/body.png`,
            human: `systems/mosh/images/icons/ui/attributes/body.png`
          },
          hitCeiling: {
            android: `You are now at maximum body.`,
            human: `You are now at maximum body.`
          },
          pastCeiling: {
            android: `You are already at maximum body.`,
            human: `You are already at maximum body.`
          },
          decrease: {
            android: `Central partition damage detected. Unrecoverable sectors found.`,
            human: `You feel a part of yourself drift away.`
          },
          decreaseHeader: {
            android: `Body Impaired`,
            human: `Body Weakened`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/body.png`,
            human: `systems/mosh/images/icons/ui/attributes/body.png`
          },
          hitFloor: {
            android: `Your body feels weak and fragile.`,
            human: `Your body feels weak and frail.`
          },
          pastFloor: {
            android: `Your body cannot get any lower.`,
            human: `Your body cannot get any lower.`
          }
        },
        //armor flavor text
        armor: {
          check: {
            android: `You gain some confidence in your abilities.`,
            human: `You gain some confidence in your abilities.`
          },
          increase: {
            android: `Data recovered. Central partition data restored.`,
            human: `You start to feel like yourself again.`
          },
          increaseHeader: {
            android: `Armor Enhanced`,
            human: `Armor Gained`
          },
          increaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/armor.png`,
            human: `systems/mosh/images/icons/ui/attributes/armor.png`
          },
          hitCeiling: {
            android: `You are now at maximum armor.`,
            human: `You are now at maximum armor.`
          },
          pastCeiling: {
            android: `You are already at maximum armor.`,
            human: `You are already at maximum armor.`
          },
          decrease: {
            android: `Central partition damage detected. Unrecoverable sectors found.`,
            human: `You feel a part of yourself drift away.`
          },
          decreaseHeader: {
            android: `Armor Impaired`,
            human: `Armor Lost`
          },
          decreaseImg: {
            android: `systems/mosh/images/icons/ui/attributes/armor.png`,
            human: `systems/mosh/images/icons/ui/attributes/armor.png`
          },
          hitFloor: {
            android: `Nothing protects you now.`,
            human: `Nothing protects you now.`
          },
          pastFloor: {
            android: `Your armor cannot get any lower.`,
            human: `Your armor cannot get any lower.`
          }
        },
        //thrusters flavor text
        thrusters: {
          check: {
            human: `You successfully manuever the craft through danger.`
          },
          increase: {
            human: `Thrusters upgraded. Agility, acceleration, and top speed have improved.`
          },
          increaseHeader: {
            human: `Thrusters Enhanced`
          },
          increaseImg: {
            human: `systems/mosh/images/icons/ui/attributes/thrusters.png`
          },
          hitCeiling: {
            human: `Your thrusters are at maximum.`
          },
          pastCeiling: {
            human: `Your thrusters are already at maximum and cannot be improved further.`
          },
          decrease: {
            human: `Thrusters damaged. Agility, acceleration, and top speed are impaired.`
          },
          decreaseHeader: {
            human: `Thrusters Impaired`
          },
          decreaseImg: {
            human: `systems/mosh/images/icons/ui/attributes/thrusters.png`
          },
          hitFloor: {
            human: `You've lost your thrusters.`
          },
          pastFloor: {
            human: `Your thrusters are broken and cannot be damaged further.`
          }
        },
        //battle flavor text
        battle: {
          check: {
            human: `You land a successful hit on the target.`
          },
          increase: {
            human: `Targeting systems upgraded. Combat readiness has improved.`
          },
          increaseHeader: {
            human: `Battle Enhanced`
          },
          increaseImg: {
            human: `systems/mosh/images/icons/ui/attributes/battle.png`
          },
          hitCeiling: {
            human: `Your targeting systems are at maximum.`
          },
          pastCeiling: {
            human: `Your targeting systems are already at maximum and cannot be improved further.`
          },
          decrease: {
            human: `Targeting systems damaged. Combat readiness have been impaired.`
          },
          decreaseHeader: {
            human: `Battle Impaired`
          },
          decreaseImg: {
            human: `systems/mosh/images/icons/ui/attributes/battle.png`
          },
          hitFloor: {
            human: `You've lost your targeting systems.`
          },
          pastFloor: {
            human: `Your targeting systems are broken and cannot be damaged further.`
          }
        },
        //systems flavor text
        systems: {
          check: {
            human: `Your ship's systems are running smoothly.`
          },
          increase: {
            human: `Systems upgraded. Sensors, computers, and other systems have improved.`
          },
          increaseHeader: {
            human: `Systems Enhanced`
          },
          increaseImg: {
            human: `systems/mosh/images/icons/ui/attributes/battle.png`
          },
          hitCeiling: {
            human: `Your ship's systems are at maximum.`
          },
          pastCeiling: {
            human: `Your ship's systems are already at maximum and cannot be improved further.`
          },
          decrease: {
            human: `Systems damaged. Sensors, computers, and other systems have been impaired.`
          },
          decreaseHeader: {
            human: `Systems Impaired`
          },
          decreaseImg: {
            human: `systems/mosh/images/icons/ui/attributes/battle.png`
          },
          hitFloor: {
            human: `You've lost your ship's systems.`
          },
          pastFloor: {
            human: `Your ship's systems are broken and cannot be damaged further.`
          }
        }
      },
      //macro flavor text (embedding actions)
      macro: {
        wound: {
          bleeding: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.1DD8i6eCS6nx2Ip0]{Bleeding}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.1DD8i6eCS6nx2Ip0]{Bleeding}`
          },
          bleeding_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.xr2o2PU5vdrR6fxQ]{Bleeding [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.xr2o2PU5vdrR6fxQ]{Bleeding [-]}`
          },
          bleeding_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.tFcWNddtZvlv7tsg]{Bleeding [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.tFcWNddtZvlv7tsg]{Bleeding [+]}`
          },
          blunt_force: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.TAjlQjA5AAy3qYL3]{Blunt Force}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.TAjlQjA5AAy3qYL3]{Blunt Force}`
          },
          blunt_force_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.k0zf8ZGivRguc0wb]{Blunt Force [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.k0zf8ZGivRguc0wb]{Blunt Force [-]}`
          },
          blunt_force_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.oL3GH0HoEPlP8vzG]{Blunt Force [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.oL3GH0HoEPlP8vzG]{Blunt Force [+]}`
          },
          fire_explosives: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.bZi1qKmcKLFvnhZ2]{Fire & Explosives}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.bZi1qKmcKLFvnhZ2]{Fire & Explosives}`
          },
          fire_explosives_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.7rYhbDAaFeok1Daq]{Fire & Explosives [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.7rYhbDAaFeok1Daq]{Fire & Explosives [-]}`
          },
          fire_explosives_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.dJnQKDf0AlwK27QD]{Fire & Explosives [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.dJnQKDf0AlwK27QD]{Fire & Explosives [+]}`
          },
          gore_massive: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.S9nnHKWYGSQmjQdp]{Gore}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.S9nnHKWYGSQmjQdp]{Gore}`
          },
          gore_massive_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.eQPuDgwv8evetFIk]{Gore [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.eQPuDgwv8evetFIk]{Gore [-]}`
          },
          gore_massive_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.DuVjNlE4lsnR7Emc]{Gore [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.DuVjNlE4lsnR7Emc]{Gore [+]}`
          },
          gunshot: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.XgCOLv9UunBddUyW]{Gunshot}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.XgCOLv9UunBddUyW]{Gunshot}`
          },
          gunshot_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.LTpa1ZYVZl4m9k6z]{Gunshot [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.LTpa1ZYVZl4m9k6z]{Gunshot [-]}`
          },
          gunshot_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.fnVATRHYJEUlS3pR]{Gunshot [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.fnVATRHYJEUlS3pR]{Gunshot [+]}`
          }
        }
      }
    };
    //check to see if this address exists in the library, return the action parameter if not
    if (checkNested(textLibrary,type,context,action)) {
      //set full path to include class type
      if (this.type === 'character') {
        if(this.system.class.value.toLowerCase() === 'android') {
          //log what was done
          console.log(`Retrieved flavor text for ${type}:${context}:${action} for an android`);
          //return class appropriate text
          return textLibrary[type][context][action].android;
        } else {
          //log what was done
          console.log(`Retrieved flavor text for ${type}:${context}:${action} for a human`);
          //return class appropriate text
          return textLibrary[type][context][action].human;
        }
      } else {
        //log what was done
        console.log(`Retrieved flavor text for ${type}:${context}:${action} for a non-character entity`);
        //return class appropriate text
        return textLibrary[type][context][action].human;
      }
    } else {
      //log what was done
      console.log(`Retrieved flavor text for ${type}:${context}:${action}, which did not have an entry`);
      //return what we were asked
      return action;
    }
  }

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
    //log what was done
    console.log(`Parsed '${rollString}' aiming '${aimFor}' into '${rollStringParsed}'`);
    //return string in foundry format
    return rollStringParsed;
  }

  //central roll parsing function | TAKES '1d100',[Foundry roll object],true,true,41,'<' | RETURNS enriched Foundry roll object
  parseRollResult(rollString,rollResult,zeroBased,checkCrit,rollTarget,comparison,specialRoll) {
    //init vars
    let doubles = new Set([0, 11, 22, 33, 44, 55, 66, 77, 88, 99]);
    let enrichedRollResult = rollResult;
    let rollFormula = enrichedRollResult.formula;
    let rollAim = rollFormula.substr(rollFormula.indexOf("}")+1,2);
    let useCalm = game.settings.get('mosh','useCalm');
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
        if (rollString.substr(0,rollString.indexOf("[")).trim() === '1d10' || rollString === '1d10' || rollString.substr(0,rollString.indexOf("[")).trim() === '-1d10' || rollString === '-1d10') {
          //loop through dice
          enrichedRollResult.dice.forEach(function(roll){ 
            //loop through each result
            roll.results.forEach(function(die) { 
              //change any 10s to 0s
              if (die.result === 10 || die.result === -10) {die.result = 0;}
            });
          });
        //1d100 changes
        } else if (rollString.substr(0,rollString.indexOf("[")).trim() === '1d100' || rollString === '1d100' || rollString.substr(0,rollString.indexOf("[")).trim() === '-1d100' || rollString === '-1d100') {
          //loop through dice
          enrichedRollResult.dice.forEach(function(roll){ 
            //loop through each result
            roll.results.forEach(function(die) { 
              //change any 100s to 0s
              if (die.result === 100 || die.result === -100) {die.result = 0;}
            });
          });
        }
      }
      //update dice totals to negative for negative rolls
      if (rollString.substr(0,1) === '-') {
        //loop through dice
        enrichedRollResult.dice.forEach(function(roll){ 
          //loop through each result
          roll.results.forEach(function(die) { 
            //change any non-zero 
            die.result = die.result*-1;
          });
        });
      }
      //set roll A and B
      if(enrichedRollResult.dice[0]) {die0value = enrichedRollResult.dice[0].results[0].result;}
      if(enrichedRollResult.dice[1]) {die1value = enrichedRollResult.dice[1].results[0].result;}
      //do we need to pick a winner?
      if (rollString.includes("[")) {
        //set whether each die succeeded
          //die 0
          if(comparison === '<' && die0value < rollTarget && die0value < 90) {die0success = true;}
          if(comparison === '<=' && die0value <= rollTarget && die0value < 90) {die0success = true;}
          if(comparison === '>' && die0value > rollTarget && die0value < 90) {die0success = true;}
          if(comparison === '>=' && die0value >= rollTarget && die0value < 90) {die0success = true;}
          //die 1
          if(comparison === '<' && die1value < rollTarget && die1value < 90) {die1success = true;}
          if(comparison === '<=' && die1value <= rollTarget && die1value < 90) {die1success = true;}
          if(comparison === '>' && die1value > rollTarget && die1value < 90) {die1success = true;}
          if(comparison === '>=' && die1value >= rollTarget && die1value < 90) {die1success = true;}
        //set whether each die are a crit
          //die 0
          if(checkCrit && doubles.has(die0value)) {die0crit = true;}
          //die 1
          if(checkCrit && doubles.has(die1value)) {die1crit = true;}
        //if [-] pick a new worst number
        if (rollString.includes("[-]")) {
          //if we are trying to keep the highest
          if(rollAim === 'kh') {
            //set default result value to the highest value
            newTotal = Math.max(die0value,die1value);
            //if both are a success and only dice 0 is a crit: don't pick the crit
            if(die0success && die1success && die0crit && !die1crit) {newTotal = die1value;}
            //if both are a success and only dice 1 is a crit: don't pick the crit
            if(die0success && die1success && !die0crit && die1crit) {newTotal = die0value;}
            //if both are a failure and only dice 0 is a crit: pick the crit
            if(!die0success && !die1success && die0crit && !die1crit) {newTotal = die0value;}
            //if both are a failure and only dice 1 is a crit: pick the crit
            if(!die0success && !die1success && !die0crit && die1crit) {newTotal = die1value;}
            //if this is a panic check and both are a failure: pick the worst
            if(specialRoll === 'panicCheck' && !useCalm && !die0success && !die1success) {newTotal = Math.max(die0value,die1value);}
          }
          //if we are trying to keep the lowest
          if(rollAim === 'kl') {
            //set default result value to the lowest value
            newTotal = Math.min(die0value,die1value);
            //if both are a success and only dice 0 is a crit: don't pick the crit
            if(die0success && die1success && die0crit && !die1crit) {newTotal = die1value;}
            //if both are a success and only dice 1 is a crit: don't pick the crit
            if(die0success && die1success && !die0crit && die1crit) {newTotal = die0value;}
            //if both are a failure and only dice 0 is a crit: pick the crit
            if(!die0success && !die1success && die0crit && !die1crit) {newTotal = die0value;}
            //if both are a failure and only dice 1 is a crit: pick the crit
            if(!die0success && !die1success && !die0crit && die1crit) {newTotal = die1value;}
            //if this is a panic check and both are a failure: pick the worst
            if(specialRoll === 'panicCheck' && !useCalm && !die0success && !die1success) {newTotal = Math.max(die0value,die1value);}
          }
        }
        //if [+] pick a new best number
        if (rollString.includes("[+]")) {
          //if we are trying to keep the highest
          if(rollAim === 'kh') {
            //set default result value to the highest value
            newTotal = Math.max(die0value,die1value);
            //if both are a success and only dice 0 is a crit: pick the crit
            if(die0success && die1success && die0crit && !die1crit) {newTotal = die0value;}
            //if both are a success and only dice 1 is a crit: pick the crit
            if(die0success && die1success && !die0crit && die1crit) {newTotal = die1value;}
            //if both are a failure and only dice 0 is a crit: don't pick the crit
            if(!die0success && !die1success && die0crit && !die1crit) {newTotal = die1value;}
            //if both are a failure and only dice 1 is a crit: don't pick the crit
            if(!die0success && !die1success && !die0crit && die1crit) {newTotal = die0value;}
            //if this is a panic check and both are a failure: pick the best
            if(specialRoll === 'panicCheck' && !useCalm && !die0success && !die1success) {newTotal = Math.min(die0value,die1value);}
          }
          //if we are trying to keep the lowest
          if(rollAim === 'kl') {
            //set default result value to the lowest value
            newTotal = Math.min(die0value,die1value);
            //if both are a success and only dice 0 is a crit: pick the crit
            if(die0success && die1success && die0crit && !die1crit) {newTotal = die1value;}
            //if both are a success and only dice 1 is a crit: pick the crit
            if(die0success && die1success && !die0crit && die1crit) {newTotal = die0value;}
            //if both are a failure and only dice 0 is a crit: don't pick the crit
            if(!die0success && !die1success && die0crit && !die1crit) {newTotal = die0value;}
            //if both are a failure and only dice 1 is a crit: don't pick the crit
            if(!die0success && !die1success && !die0crit && die1crit) {newTotal = die1value;}
            //if this is a panic check and both are a failure: pick the best
            if(specialRoll === 'panicCheck' && !useCalm && !die0success && !die1success) {newTotal = Math.min(die0value,die1value);}
          }
        }
      //we don't need to pick a winner
      } else {
        //set result value to the only die
        newTotal = die0value;
      }
      //set final total value
      enrichedRollResult._total = newTotal;
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
                <ol class="dice-rolls">
              `;
              //loop through dice
              roll.results.forEach(function(die) { 
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
                        if(comparison === '<' && die.result < rollTarget) {critHighlight = ' max';} 
                        else if(comparison === '<=' && die.result <= rollTarget) {critHighlight = ' max';}
                        else if(comparison === '>' && die.result > rollTarget) {critHighlight = ' max';}
                        else if(comparison === '>=' && die.result >= rollTarget) {critHighlight = ' max';}
                        else {critHighlight = ' min';}
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
    let currentLocation = '';
    let tableLocation = '';
      //find where this table is located
    //get current compendium
    let compendium = game.packs;
    //loop through each compendium
    compendium.forEach(function(pack){ 
      //is this a pack of rolltables?
      if (pack.metadata.type === 'RollTable') {
        //log where we are
        currentLocation = pack.metadata.id;
        //loop through each pack to find the right table
        pack.index.forEach(function(table) { 
          //is this our table?
          if (table._id === tableId) {
            //grab the table location
            tableLocation = currentLocation;
          }
        });
      }
    });
    //get table data
    let tableData = await game.packs.get(tableLocation).getDocument(tableId);
    //get table name
    let tableName = tableData.name;
    //get table name
    let tableImg = tableData.img;
    //get table result
    let tableDie = tableData.formula.replace('-1','');

    return tableData;
  }

  //central table rolling function | TAKES 'W36WFIpCfMknKgHy','1d10','low',true,true,41,'<' | RETURNS chat message showing roll table result
  async rollTable(tableId,rollString,aimFor,zeroBased,checkCrit,rollAgainst,comparison) {
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
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID(): randomID())
    let rollTarget = null;
    let valueAddress = [];
    let specialRoll = null;
    let firstEdition = game.settings.get('mosh','firstEdition');
    let useCalm = game.settings.get('mosh','useCalm');
    let androidPanic = game.settings.get('mosh','androidPanic');
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
              tableId = game.settings.get('mosh','table1ePanicCalmAndroid');
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
              tableId = game.settings.get('mosh','table1ePanicStressAndroid');
              aimFor = 'high';
              zeroBased = false;
              checkCrit = false;
              rollAgainst = 'system.other.stress.value';
              comparison = '>';
            }
          } else {
            if (useCalm) { 
              tableId = game.settings.get('mosh','table1ePanicCalmNormal');
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
              tableId = game.settings.get('mosh','table1ePanicStressNormal');
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
              tableId = game.settings.get('mosh','table0ePanicCalmAndroid');
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
              tableId = game.settings.get('mosh','table0ePanicStressAndroid');
              aimFor = 'high';
              zeroBased = false;
              checkCrit = false;
              rollAgainst = 'system.other.stress.value';
              comparison = '>';
            }
          } else {
            if (useCalm) { 
              tableId = game.settings.get('mosh','table0ePanicCalmNormal');
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
              tableId = game.settings.get('mosh','table0ePanicStressNormal');
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
          if (firstEdition && !useCalm) {rollString = '1d20' + rollString;}
          //if 0e and no calm, then 2d10
          if (!firstEdition && !useCalm) {rollString = '2d10' + rollString;}
          //if calm, then 1d100
          if (useCalm) {rollString = '1d100' + rollString;}
        }
      }
      //maintenance check
      if (tableId === 'maintenanceCheck') {
        //set special roll value for use later
        specialRoll = tableId;
        //assign variables
        tableId = game.settings.get('mosh','table1eMaintenance');
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
          if (firstEdition) {rollDie = '1d20';}
          //if 0e and no calm, then 2d10
          if (!firstEdition) {rollDie = '2d10';}
          //if calm, then 1d100
          if (useCalm) {rollDie = '1d100';}
        //run the choose attribute function
        let chosenRollType = await this.chooseAdvantage('Panic Check',rollDie);
        //set variables
        rollString = chosenRollType[0];
      }
    //find where this table is located
      //get current compendium
      let compendium = game.packs;
      //loop through each compendium
      compendium.forEach(function(pack){ 
        //is this a pack of rolltables?
        if (pack.metadata.type === 'RollTable') {
          //log where we are
          currentLocation = pack.metadata.id;
          //loop through each pack to find the right table
          pack.index.forEach(function(table) { 
            //is this our table?
            if (table._id === tableId) {
              //grab the table location
              tableLocation = currentLocation;
            }
          });
        }
      });
      //get table data
      let tableData = await game.packs.get(tableLocation).getDocument(tableId);
      //get table name
      let tableName = tableData.name;
      //get table name
      let tableImg = tableData.img;
      //get table result
      let tableDie = tableData.formula.replace('-1','');
    //if rollString is STILL blank, redirect player to choose the roll
    if (!rollString) {
      //run the choose attribute function
      let chosenRollType = await this.chooseAdvantage(tableName,tableDie);
      //set variables
      rollString = chosenRollType[0];
    }
    //table specific customizations
      //if a table has details in parenthesis, lets remove them
      if (tableName.includes(' (')) {
        //extract dice needed
        tableName = tableName.substr(0,tableName.indexOf(' ('));
      }
      //if a wound table, add a wound to the player and prepare text for the final message
      if (tableName.slice(-5) === 'Wound') {
        let addWound = await this.modifyActor('system.hits.value',1,null,false);
        woundText = addWound[1];
      }
    //pull stat to roll against, if needed
    if(rollAgainst || rollAgainst === 0){
      //turn string address into array
      valueAddress = rollAgainst.split('.');
      //set rollTarget
      rollTarget = valueAddress.reduce((a, v) => a[v], this);
    }
    //roll the dice
      //parse the roll string
      let parsedRollString = this.parseRollString(rollString,aimFor);
      if(game.settings.get('mosh', 'panicDieTheme') != ""){ //We're going to check if the theme field is blank. Otherwise, don't use this.
        //set panic die color
        let dsnTheme = game.settings.get('mosh','panicDieTheme');
        //apply theme if this is a panic check
        if (tableName === 'Panic Check') {
          parsedRollString = parsedRollString + '[' + dsnTheme + ']';
        }
     }
      //roll the dice
      let rollResult = await new Roll(parsedRollString).evaluate();
      //interpret the results
      let parsedRollResult = this.parseRollResult(rollString,rollResult,zeroBased,checkCrit,rollTarget,comparison,specialRoll);
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
        parsedRollResult2 = this.parseRollResult(rollString2,rollResult2,false,false,null,null,specialRoll);
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
        parsedRollResult2 = this.parseRollResult(rollString2,rollResult2,true,false,null,null,specialRoll);
        //set marker for HTML
        secondRoll = true;
        //set table result number
        tableResultNumber = parsedRollResult2.total;
        //log second die
        console.log(`Rolled second die`);
      }
    //set table result number if null
    if(!tableResultNumber) {tableResultNumber = parsedRollResult.total;}
    //fetch the table result
    let tableResult = tableData.getResultsForRoll(tableResultNumber);
    //make any custom changes to chat message
      //panic check #19 customiziation
      if (tableName === 'Panic Check' && tableResultNumber === 19) {
        if (this.system.class.value.toLowerCase() === 'android') {
          tableResultEdited = tableResult[0].text.replace("HEART ATTACK / SHORT CIRCUIT (ANDROIDS).","SHORT CIRCUIT.");
        } else {
          tableResultEdited = tableResult[0].text.replace("HEART ATTACK / SHORT CIRCUIT (ANDROIDS).","HEART ATTACK.");
        }
      }
    //assign message description text
    msgDesc = this.getFlavorText('table',tableName.replaceAll('& ','').replaceAll(' ','_').toLowerCase(),'roll');
    //assign flavor text
      //get main flavor text
      flavorText = this.getFlavorText('table',tableName.replaceAll('& ','').replaceAll(' ','_').toLowerCase(),'success');
      //append 0e crit success effect
      if (!firstEdition && !useCalm && parsedRollResult.success && parsedRollResult.critical) {
        flavorText = flavorText + ` Relieve 1 Stress.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.qbq694JMbXeZrHjj]{-1 Stress}`;
      }
      //append Calm effects for Critical Panic Success
      if (useCalm && parsedRollResult.success && parsedRollResult.critical) {
        flavorText = flavorText + ` Gain 1d10 Calm.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.k2TtLFOG9mGaWVx3]{+1d10 Calm}`;
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
        speaker: {actor: this.id, token: this.token, alias: this.name},
        content: messageContent
      },{keepId:true});
      if(game.modules.get("dice-so-nice").active){
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
  async chooseAttribute(rollString,aimFor) {
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
        //create button header if needed
        if (!rollString) {
          buttonDesc = `<h4>Select your roll type:</h4>`;
        } else {
          buttonDesc = ``;
        }
      //create final dialog data
      const dialogData = {
        title: `Choose a Stat`,
        content: dialogDesc + buttonDesc,
        buttons: {}
      };
      //add adv/normal/dis buttons if we need a rollString
      if (!rollString) {
        //we need to generate a roll string
          //Advantage
          dialogData.buttons.button1 = {
            label: `Advantage`,
            callback: (html) => {
              rollString = `1d100 [+]`;
              aimFor = `low`;
              attribute = html.find("input[name='stat']:checked").attr("value");
              resolve([rollString, aimFor, attribute]);
              console.log(`User left the chooseAttribute dialog with: rollString:${rollString}, aimFor:${aimFor}, attribute:${attribute}`);
            },
            icon: `<i class="fas fa-angle-double-up"></i>`
          };
          //Normal
          dialogData.buttons.button2 = {
            label: `Normal`,
            callback: (html) => {
              rollString = `1d100`;
              aimFor = `low`;
              attribute = html.find("input[name='stat']:checked").attr("value");
              resolve([rollString, aimFor, attribute]);
              console.log(`User left the chooseAttribute dialog with: rollString:${rollString}, aimFor:${aimFor}, attribute:${attribute}`);
            },
            icon: `<i class="fas fa-minus"></i>`
          };
          //Disadvantage
          dialogData.buttons.button3 = {
            label: `Disadvantage`,
            callback: (html) => {
              rollString = `1d100 [-]`;
              aimFor = `low`;
              attribute = html.find("input[name='stat']:checked").attr("value");
              resolve([rollString, aimFor, attribute]);
              console.log(`User left the chooseAttribute dialog with: rollString:${rollString}, aimFor:${aimFor}, attribute:${attribute}`);
            },
            icon: `<i class="fas fa-angle-double-down"></i>`
          };
      //add a next button if we dont need a rollString
      } else {
        dialogData.buttons.button1 = {
          label: `Next`,
          callback: (html) => {
            aimFor = `low`;
            attribute = html.find("input[name='stat']:checked").attr("value");
            resolve([rollString, aimFor, attribute]);
            console.log(`User left the chooseAttribute dialog with: rollString:${rollString}, aimFor:${aimFor}, attribute:${attribute}`);
          },
          icon: `<i class="fas fa-chevron-circle-right"></i>`
        };
      }
      //render dialog
      const dialog = new Dialog(dialogData,{width: 600, height: 500}).render(true);
    });
  }

  //central adding skill function | TAKES '1d10','low' | RETURNS player selected skill + value. If parameters are null, it asks the player.
  async chooseSkill(dlgTitle,rollString) {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //init vars
      let playerItems = this.items;
      let skill = ``;
      let skillValue = 0;
      let buttonDesc = ``;
      //create HTML for this window
        //header
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
        </div>
        <label for="">
        <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
          <div class="grid grid-2col" style="grid-template-columns: 20px auto">
          <input type="radio" id="" name="skill" value=0 checked >
          <div class="macro_desc" style="display: table;">
            <span style="display: table-cell; vertical-align: middle;">
            <p>Do not add a skill to this roll.<p>
            </span>
          </div>    
          </div>
        </div>
        </label>
        `;
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
              tempRow = tempRow.replaceAll("[RADIO_ID]",item.name);
              //replace value
              tempRow = tempRow.replace("[RADIO_VALUE]",item.system.bonus);
              //replace img
              tempRow = tempRow.replace("[RADIO_IMG]",item.img);
              //replace name
              tempRow = tempRow.replace("[RADIO_BONUS]",item.system.bonus);
              //replace name
              tempRow = tempRow.replace("[RADIO_NAME]",item.name);
              //replace desc
              tempRow = tempRow.replace("[RADIO_DESC]",item.system.description.replace("<p>","<strong>:</strong> "));
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
          buttonDesc = `<h4>Select your roll type:</h4>`;
        } else {
          buttonDesc = ``;
        }
      //create final dialog data
      const dialogData = {
        title: dlgTitle,
        content: skillHeader + skillList + buttonDesc,
        buttons: {}
      };
      //add adv/normal/dis buttons if we need a rollString
      if (!rollString) {
        //we need to generate a roll string
          //Advantage
          dialogData.buttons.button1 = {
            label: `Advantage`,
            callback: (html) => {
              rollString = `1d100 [+]`;
              skill = html.find("input[name='skill']:checked").attr("id");
              skillValue = html.find("input[name='skill']:checked").attr("value");
              resolve([rollString, skill, skillValue]);
              console.log(`User left the chooseSkill dialog with: rollString:${rollString}, skill:${skill}, skillValue:${skillValue}`);
            },
            icon: `<i class="fas fa-angle-double-up"></i>`
          };
          //Normal
          dialogData.buttons.button2 = {
            label: `Normal`,
            callback: (html) => {
              rollString = `1d100`;
              skill = html.find("input[name='skill']:checked").attr("id");
              skillValue = html.find("input[name='skill']:checked").attr("value");
              resolve([rollString, skill, skillValue]);
              console.log(`User left the chooseSkill dialog with: rollString:${rollString}, skill:${skill}, skillValue:${skillValue}`);
            },
            icon: `<i class="fas fa-minus"></i>`
          };
          //Disadvantage
          dialogData.buttons.button3 = {
            label: `Disadvantage`,
            callback: (html) => {
              rollString = `1d100 [-]`;
              skill = html.find("input[name='skill']:checked").attr("id");
              skillValue = html.find("input[name='skill']:checked").attr("value");
              resolve([rollString, skill, skillValue]);
              console.log(`User left the chooseSkill dialog with: rollString:${rollString}, skill:${skill}, skillValue:${skillValue}`);
            },
            icon: `<i class="fas fa-angle-double-down"></i>`
          };
      //add a next button if we dont need a rollString
      } else {
        dialogData.buttons.button1 = {
          label: `Next`,
          callback: (html) => {
            skill = html.find("input[name='skill']:checked").attr("id");
            skillValue = html.find("input[name='skill']:checked").attr("value");
            resolve([rollString, skill, skillValue]);
            console.log(`User left the chooseSkill dialog with: rollString:${rollString}, skill:${skill}, skillValue:${skillValue}`);
          },
          icon: `<i class="fas fa-chevron-circle-right"></i>`
        };
      }
      //render dialog
      const dialog = new Dialog(dialogData,{width: 600, height: dialogHeight}).render(true);
    });
  }

  //central adding skill function | TAKES 'Body Save','1d10' | RETURNS player selected rollString.
  async chooseAdvantage(dlgTitle,die) {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //init vars
        let rollString = ``;
        //make diceRoll variants
        let dieAdv = die + ` [+]`;
        let dieDis = die + ` [-]`;
      //create final dialog data
      const dialogData = {
        title: dlgTitle,
        content: `<h4>Select your roll type:</h4>`,
        buttons: {}
      };
      //add buttons
        //Advantage
        dialogData.buttons.button1 = {
          label: `Advantage`,
          callback: (html) => {
            rollString = dieAdv;
            resolve([rollString]);
            console.log(`User left the chooseAdvantage dialog with: rollString:${rollString}`);
          },
          icon: `<i class="fas fa-angle-double-up"></i>`
        };
        //Normal
        dialogData.buttons.button2 = {
          label: `Normal`,
          callback: (html) => {
            rollString = die;
            resolve([rollString]);
            console.log(`User left the chooseAdvantage dialog with: rollString:${rollString}`);
          },
          icon: `<i class="fas fa-minus"></i>`
        };
        //Disadvantage
        dialogData.buttons.button3 = {
          label: `Disadvantage`,
          callback: (html) => { 
            rollString = dieDis;
            resolve([rollString]);
            console.log(`User left the chooseAdvantage dialog with: rollString:${rollString}`);
          },
          icon: `<i class="fas fa-angle-double-down"></i>`
        };
      //render dialog
      const dialog = new Dialog(dialogData,{width: 600, height: 105}).render(true);
    });
  }

  //central check rolling function | TAKES '1d10','low','combat','Geology',10,[weapon item] | RETURNS chat message showing check result
  async rollCheck(rollString,aimFor,attribute,skill,skillValue,weapon) {
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
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID(): randomID());
    let firstEdition = game.settings.get('mosh','firstEdition');
    let useCalm = game.settings.get('mosh','useCalm');
    //customize this roll if its a unique use-case
      //damage roll
      if (attribute === 'damage') {  
        //set special roll value for use later
        specialRoll = attribute;
        //parse the roll string
        parsedDamageString = this.parseRollString(weapon.system.damage,'high');
        //override message header
        msgHeader = weapon.name;
        //override  header image
        msgImgPath = weapon.img;
        let dsnTheme = 0;
        if(game.settings.get('mosh', 'damageDiceTheme') != ""){ //We're going to check if the theme field is blank. Otherwise, don't use this.
          //set damage dice color
          dsnTheme = game.settings.get('mosh','damageDiceTheme');
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
            woundEffect = woundEffect.replaceAll(' [-]','_dis').replaceAll(' [+]','_adv');
            //simplify wounds
            woundEffect = woundEffect.replace('Bleeding','bleeding');
            woundEffect = woundEffect.replace('Blunt Force','blunt_force');
            woundEffect = woundEffect.replace('Fire & Explosives','fire_explosives');
            woundEffect = woundEffect.replace('Gore & Massive','gore_massive');
            woundEffect = woundEffect.replace('Gunshot','gunshot');
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
            let minSave = Math.min(sanitySave,fearSave,bodySave);
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
        let chosenAttributes = await this.chooseAttribute(rollString,aimFor);
        //set variables
        rollString = chosenAttributes[0];
        aimFor = chosenAttributes[1];
        attribute = chosenAttributes[2];
        //if null, zero them out
      }
      //if skill is blank and actor is a character, redirect player to choose a skill
      if (!skill && this.type === 'character') {
      //run the choose attribute function
      let chosenSkills = await this.chooseSkill(this.system.stats[attribute].rollLabel,rollString);
        //set variables
        rollString = chosenSkills[0];
        skill = chosenSkills[1];
        skillValue = chosenSkills[2];
      }
      //if rollString is STILL blank, redirect player to choose the roll
      if (!rollString) {
        //run the choose attribute function
        let chosenRollType = await this.chooseAdvantage(this.system.stats[attribute].rollLabel,'1d100');
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
      let parsedRollString = this.parseRollString(rollString,aimFor);
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
      let parsedRollResult = this.parseRollResult(rollString,rollResult,zeroBased,checkCrit,rollTarget,comparison,specialRoll);
    //prep damage dice in case its needed
    if(weapon && parsedRollResult.success) {
      //parse the roll string
      parsedDamageString = this.parseRollString(weapon.system.damage,'high');
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
        if(game.settings.get('mosh', 'damageDiceTheme') != ""){ //We're going to check if the theme field is blank. Otherwise, don't use this.
          //set damage dice color
          dsnTheme = game.settings.get('mosh','damageDiceTheme');
        }
        //prepare attribute label
        attributeLabel = this.system.stats[attribute].label;
        //set crit damage effect
        if (parsedRollResult.success === true && parsedRollResult.critical === true) {
          if (game.settings.get('mosh','critDamage') === 'doubleDamage') {
            critMod = ` * 2`;
          } else if (game.settings.get('mosh','critDamage') === 'doubleDice') {
            critMod = ` + ` + parsedDamageString + '[' + dsnTheme + ']';
          } else if (game.settings.get('mosh','critDamage') === 'weaponValue') {
            critMod = ` + ` + weapon.system.critDmg + '[' + dsnTheme + ']';
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
              if(game.settings.get('mosh','autoStress')){ //If the automatic stress option is enabled
                //increase stress by 1 and retrieve the flavor text from the result
                let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
                flavorText = addStress[1];
              }
              //if critical failure, make sure to ask for panic check
              if (parsedRollResult.critical === true) {
                //set crit fail
                critFail = true;
              }
            } else {
              flavorText = 'You sense the weight of your setbacks.';
            }
          //if 0e
          } else {
            //if calm not enabled
            if (!useCalm) {
              //on Save failure
              if (attribute === 'sanity' || attribute === 'fear' || attribute === 'body' || attribute === 'armor') {
                if(game.settings.get('mosh','autoStress')){ //If the automatic stress option is enabled
                  //gain 1 stress
                  let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
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
              flavorText = 'You sense the weight of your setbacks.';
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
            woundEffect = woundEffect.replaceAll(' [-]','_dis').replaceAll(' [+]','_adv');
            //simplify wounds
            woundEffect = woundEffect.replace('Bleeding','bleeding');
            woundEffect = woundEffect.replace('Blunt Force','blunt_force');
            woundEffect = woundEffect.replace('Fire & Explosives','fire_explosives');
            woundEffect = woundEffect.replace('Gore & Massive','gore_massive');
            woundEffect = woundEffect.replace('Gunshot','gunshot');
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
          msgHeader = `Rest Save`;
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
                flavorText = 'You sense the weight of your setbacks.';
              } else if (parsedRollResult.success === true && this.type === 'character') {
                //calculate stress reduction
                let onesValue = Number(String(parsedRollResult.total).charAt(String(parsedRollResult.total).length-1));
                //decrease stress by ones place of roll value and retrieve the flavor text from the result
                let removeStress = await this.modifyActor('system.other.stress.value',onesValue,null,false);
                flavorText = removeStress[1];
              }
            //no calm outcome
            } else {
              //prep text based on success or failure
              if (parsedRollResult.success === false && this.type === 'character') {
                if(game.settings.get('mosh','autoStress')){ //If the automatic stress option is enabled
                  //increase stress by 1 and retrieve the flavor text from the result
                  let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
                  flavorText = addStress[1];
                }
                //if critical failure, make sure to ask for panic check
                if (parsedRollResult.critical === true) {
                  //set crit fail
                  critFail = true;
                }
              } else if (parsedRollResult.success === true && this.type === 'character') {
                //calculate stress reduction
                let onesValue = -1 * Number(String(parsedRollResult.total).charAt(String(parsedRollResult.total).length-1));
                //decrease stress by ones place of roll value and retrieve the flavor text from the result
                let removeStress = await this.modifyActor('system.other.stress.value',onesValue,null,false);
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
                flavorText = 'You sense the weight of your setbacks.';
              } else if (parsedRollResult.success === true && this.type === 'character') {
                //calculate stress reduction
                let succeedBy = Math.floor((rollTarget-parsedRollResult.total)/10);
                //double it if critical
                if (parsedRollResult.critical) {succeedBy = succeedBy * 2;}
                //decrease stress by ones place of roll value and retrieve the flavor text from the result
                let removeStress = await this.modifyActor('system.other.stress.value',succeedBy,null,false);
                flavorText = removeStress[1];
              }
            //no calm outcome
            } else {
              //prep text based on success or failure
              if (parsedRollResult.success === false && this.type === 'character') {
                if(game.settings.get('mosh','autoStress')){ //If the automatic stress option is enabled
                  //increase stress by 1 and retrieve the flavor text from the result
                  let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
                  flavorText = addStress[1];
                }
                //if critical failure, make sure to ask for panic check
                if (parsedRollResult.critical === true) {
                  //set crit fail
                  critFail = true;
                }
              } else if (parsedRollResult.success === true && this.type === 'character') {
                //calculate stress reduction
                let succeedBy = -1 * Math.floor((rollTarget-parsedRollResult.total)/10);
                //double it if critical
                if (parsedRollResult.critical) {succeedBy = succeedBy * 2;}
                //decrease stress by ones place of roll value and retrieve the flavor text from the result
                let removeStress = await this.modifyActor('system.other.stress.value',succeedBy,null,false);
                flavorText = removeStress[1];
              }
            }
          }
        }
        //bankruptcy save
        if (specialRoll === 'bankruptcySave') {
          //message header
          msgHeader = 'Bankruptcy Save';
          //set header image
          msgImgPath = 'systems/mosh/images/icons/ui/rolltables/bankruptcy_save.png';
          //prepare attribute label
          attributeLabel = 'Bankruptcy';
          //get the bankruptcy table
            //get current compendium
            let compendium = game.packs;
            let currentLocation = ``;
            let tableLocation = ``;
            let tableId = game.settings.get('mosh','table1eBankruptcy');
            //loop through each compendium
            compendium.forEach(function(pack){ 
              //is this a pack of rolltables?
              if (pack.metadata.type === 'RollTable') {
                //log where we are
                currentLocation = pack.metadata.id;
                //loop through each pack to find the right table
                pack.index.forEach(function(table) { 
                  //is this our table?
                  if (table._id === tableId) {
                    //grab the table location
                    tableLocation = currentLocation;
                  }
                });
              }
            });
            //get table data
            let tableData = await game.packs.get(tableLocation).getDocument(tableId);
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
          msgHeader = 'Morale Check';
          //set header image
          msgImgPath = 'systems/mosh/images/icons/ui/macros/morale_check.png';
          //prepare attribute label
          attributeLabel = 'Megadamage';
          //prep text based on success or failure
          if (!parsedRollResult.success) {
            //flavor text
            flavorText = `The crew, once focused on their tasks, now exchange anxious glances as the reality of the situation set in. Struggling to maintain composure in the chaos, the crew decides to send a hail and hope for mercy.`;
          } else {
            //flavor text
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
              if(game.settings.get('mosh','autoStress')){ //If the automatic stress option is enabled
                //increase stress by 1 and retrieve the flavor text from the result
                let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
                flavorText = addStress[1];
              }
              //if critical failure, make sure to ask for panic check
              if (parsedRollResult.critical === true) {
                //set crit fail
                critFail = true;
              }
            } else {
              flavorText = 'You sense the weight of your setbacks.';
            }
          //if 0e
          } else {
            //if calm not enabled
            if (!useCalm) {
              //on Save failure
              if (attribute === 'sanity' || attribute === 'fear' || attribute === 'body' || attribute === 'armor') {
                if(game.settings.get('mosh','autoStress')){ //If the automatic stress option is enabled
                  //gain 1 stress
                  let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
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
              flavorText = 'You sense the weight of your setbacks.';
            }
          }
        } else if (parsedRollResult.success === true && this.type === 'character') {
          //flavor text = generic roll success
          flavorText = this.getFlavorText('attribute',attribute,'check');
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
        firstEdition: game.settings.get('mosh','firstEdition'),
        useCalm: game.settings.get('mosh','useCalm'),
        androidPanic: game.settings.get('mosh','androidPanic')
      };
      //prepare template
      messageTemplate = 'systems/mosh/templates/chat/rollCheck.html';
      //render template
      messageContent = await renderTemplate(messageTemplate, messageData);
      //make message
      let macroMsg = await rollResult.toMessage({
        id: chatId,
        user: game.user.id,
        speaker: {actor: this.id, token: this.token, alias: this.name},
        content: messageContent
      },{keepId:true});
      //is DSN active?
      if(game.modules.get("dice-so-nice").active){
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
  async modifyActor(fieldAddress,modValue,modRollString,outputChatMsg) {
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
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID(): randomID())
    let halfDamage = false;
    let firstEdition = game.settings.get('mosh','firstEdition');
    let useCalm = game.settings.get('mosh','useCalm');
    let androidPanic = game.settings.get('mosh','androidPanic');
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
        let fieldId = fieldValue[fieldValue.length-2];
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
            if(modifyMinimum || modifyMinimum === 0) {
              if(modifyNew < modifyMinimum) {
                modifyNew = modifyMinimum;
              }
            }
            //cap max
            if(modifyMaximum || modifyMaximum === 0) {
              if(modifyNew > modifyMaximum) {
                modifyNew = modifyMaximum;
              }
            }
            //measure difference between old and new value
            modifyDifference = modifyNew - modifyCurrent;
            //measure any surplus if we exceeded min/max
            modifySurplus = modifyChange - modifyDifference;
          //if health hits zero, reset to next hp bar
          if (firstEdition && fieldId === 'health' && modifyNew === 0) {
            //set marker for later
            getWound = true;
            //reset hp
            modifyNew = modifyMaximum + modifySurplus;
          }
        //update actor
            //prepare update JSON
            let updateData = JSON.parse(`{"` + fieldAddress + `": ` + modifyNew + `}`);
            //update field
            this.update(updateData);
        //create modification text (for chat message or return values)
          //get flavor text
          if (modifyChange > 0) {
            msgFlavor = this.getFlavorText('attribute',fieldId,'increase');
            msgChange = 'increased';
            msgHeader = fieldPrefix + this.getFlavorText('attribute',fieldId,'increaseHeader');
            msgImgPath = this.getFlavorText('attribute',fieldId,'increaseImg');
          } else if (modifyChange < 0) {
            msgFlavor = this.getFlavorText('attribute',fieldId,'decrease');
            msgChange = 'decreased';
            msgHeader = fieldPrefix + this.getFlavorText('attribute',fieldId,'decreaseHeader');
            msgImgPath = this.getFlavorText('attribute',fieldId,'decreaseImg');
          }
          //detect if half damage has been taken
          if (!firstEdition && (-1 * modifyChange) > (modifyMaximum/2)) {
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
            //set default message outcome
            if (msgAction === 'increase' || msgAction === 'decrease') {
              msgOutcome = fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
            //set message outcome for past ceiling or floor
            } else if (msgAction === 'pastFloor' || msgAction === 'pastCeiling') {
              msgOutcome = this.getFlavorText('attribute',fieldId,msgAction);
              //set message outcome for stress going from < 20 to > 20
            } else if (fieldId === 'stress' && modifyCurrent < modifyMaximum && modifySurplus > 0) {
              msgOutcome = this.getFlavorText('attribute',fieldId,msgAction) + ` ` + fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>. <strong>Reduce the most relevant Stat or Save by ${modifySurplus}</strong>.`;
            //set message outcome for stress going from 20 to > 20
            } else if (fieldId === 'stress' && modifyCurrent === modifyMaximum && modifySurplus > 0) {
              msgOutcome = this.getFlavorText('attribute',fieldId,msgAction) + ` <strong>Reduce the most relevant Stat or Save by ${modifySurplus}</strong>.`;
            //set message outcome for health reaches zero or goes past it, and you have wounds remaining
            } else if (getWound) {
              //can this player take a wound and not die?
              if (this.system.hits.value + 1 === this.system.hits.max) {
                //you are dead!
                msgOutcome = this.getFlavorText('attribute','hits','hitCeiling');
              } else {
                //you are wounded!
                msgOutcome = `Your health has hit zero and you must take a wound. Your health has been reset to <strong>${modifyNew}</strong>.<br><br>` + this.getFlavorText('attribute','hits','increase');
              }
            } else {
              msgOutcome = this.getFlavorText('attribute',fieldId,msgAction) + ` ` + fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
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
              speaker: {actor: this.id, token: this.token, alias: this.name},
              content: messageContent
            },{keepId:true});
        }
        //log what was done
        console.log(`Modified actor: ${this.name}, with: fieldAddress:${fieldAddress}, modValue:${modValue}, modRollString:${modRollString}, outputChatMsg:${outputChatMsg}`);      
        //return modification values
        return [msgFlavor,msgOutcome,msgChange];
      //calculate change from the modRollString
      } else {
        //roll the dice
          //parse the roll string
          let parsedRollString = this.parseRollString(modRollString,'low');
          //roll the dice
          let rollResult = await new Roll(parsedRollString).evaluate();
          //interpret the results
          let parsedRollResult = this.parseRollResult(modRollString,rollResult,false,false,null,null,null);
        //update modChange
        modifyChange = modifyChange + parsedRollResult.total;
        //calculate impact to the actor
          //set the new value
          modifyNew = modifyCurrent + modifyChange;
          //restrict new value based on min/max
            //cap min
            if(modifyMinimum || modifyMinimum === 0) {
              if(modifyNew < modifyMinimum) {
                modifyNew = modifyMinimum;
              }
            }
            //cap max
            if(modifyMaximum || modifyMaximum === 0) {
              if(modifyNew > modifyMaximum) {
                modifyNew = modifyMaximum;
              }
            }
            //measure difference between old and new value
            modifyDifference = modifyNew - modifyCurrent;
            //measure any surplus if we exceeded min/max
            modifySurplus = modifyChange - modifyDifference;
            //if health hits zero, reset to next hp bar
            if (firstEdition && fieldId === 'health' && modifyNew === 0) {
              //set marker for later
              getWound = true;
              //reset hp
              modifyNew = modifyMaximum + modifySurplus;
              //increase wounds by 1
              this.update({'system.stats.hits.value': this.system.hits.value + 1});
            }
            //update actor
              //prepare update JSON
              let updateData = JSON.parse(`{"` + fieldAddress + `": ` + modifyNew + `}`);
              //update field
              this.update(updateData);
            //create modification text (for chat message or return values)
              //get flavor text
              if (modifyChange > 0) {
                msgFlavor = this.getFlavorText('attribute',fieldId,'increase');
                msgChange = 'increased';
                msgHeader = fieldPrefix + this.getFlavorText('attribute',fieldId,'increaseHeader');
                msgImgPath = this.getFlavorText('attribute',fieldId,'increaseImg');
              } else if (modifyChange < 0) {
                msgFlavor = this.getFlavorText('attribute',fieldId,'decrease');
                msgChange = 'decreased';
                msgHeader = fieldPrefix + this.getFlavorText('attribute',fieldId,'decreaseHeader');
                msgImgPath = this.getFlavorText('attribute',fieldId,'decreaseImg');
              }
              //detect if half damage has been taken
              if (!firstEdition && (-1 * modifyChange) > (modifyMaximum/2)) {
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
                //set default message outcome
                if (msgAction === 'increase' || msgAction === 'decrease') {
                  msgOutcome = fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
                //set message outcome for past ceiling or floor
                } else if (msgAction === 'pastFloor' || msgAction === 'pastCeiling') {
                  msgOutcome = this.getFlavorText('attribute',fieldId,msgAction);
                //set message outcome for stress going from < 20 to > 20
                } else if (fieldId === 'stress' && modifyCurrent < modifyMaximum && modifySurplus > 0) {
                  msgOutcome = this.getFlavorText('attribute',fieldId,msgAction) + ` ` + fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>. <strong>Reduce the most relevant Stat or Save by ${modifySurplus}</strong>.`;
                //set message outcome for stress going from 20 to > 20
                } else if (fieldId === 'stress' && modifyCurrent === modifyMaximum && modifySurplus > 0) {
                  msgOutcome = this.getFlavorText('attribute',fieldId,msgAction) + ` <strong>Reduce the most relevant Stat or Save by ${modifySurplus}</strong>.`;
                //set message outcome for health reaches zero or goes past it, and you have wounds remaining
                } else if (getWound) {
                  //can this player take a wound and not die?
                  if (this.system.hits.value + 1 === this.system.hits.max) {
                    //you are dead!
                    msgOutcome = this.getFlavorText('attribute','hits','hitCeiling');
                  } else {
                    //you are wounded!
                    msgOutcome = `Your health has hit zero and you must take a wound. Your health has been reset to <strong>${modifyNew}</strong>.<br><br>` + this.getFlavorText('attribute','hits','increase');
                  }
                } else {
                  msgOutcome = this.getFlavorText('attribute',fieldId,msgAction) + ` ` + fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
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
                  speaker: {actor: this.id, token: this.token, alias: this.name},
                  content: messageContent
                },{keepId:true});
                if(game.modules.get("dice-so-nice").active){
                  //log what was done
                  console.log(`Modified actor: ${this.name}, with: fieldAddress:${fieldAddress}, modValue:${modValue}, modRollString:${modRollString}, outputChatMsg:${outputChatMsg}`);     
                  //return modification values
                  return [msgFlavor,msgOutcome,msgChange];
                  //wait for dice
                  await game.dice3d.waitFor3DAnimationByMessageID(chatId);
                }
            }
            //log what was done
            console.log(`Modified actor: ${this.name}, with: fieldAddress:${fieldAddress}, modValue:${modValue}, modRollString:${modRollString}, outputChatMsg:${outputChatMsg}`);     
            //return modification values
            return [msgFlavor,msgOutcome,msgChange];
      }
  }

  //central function to modify an actors items | TAKES 'olC4JytslvUrQN8g',1 | RETURNS change details, and optional chat message
  async modifyItem(itemId,addAmount) {
    //init vars
    let currentLocation = '';
    let itemLocation = '';
    let messageTemplate = ``;
    let messageContent = ``;
    let oldValue = 0;
    let newValue = 0;
    let flavorText = ``;
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID(): randomID())
    //find where this item is located
      //get current compendium
      let compendium = game.packs;
      //loop through each compendium
      compendium.forEach(function(pack){ 
        //is this a pack of items?
        if (pack.metadata.type === 'Item') {
          //log where we are
          currentLocation = pack.metadata.id;
          //loop through each pack to find the right table
          pack.index.forEach(function(item) { 
            //is this our table?
            if (item._id === itemId) {
              //grab the table location
              itemLocation = currentLocation;
            }
          });
        }
      });
    //get table data
    let itemData = await game.packs.get(itemLocation).getDocument(itemId);
    //add or increase the count of the item, depending on type, if the actor has it
    if (this.items.getName(itemData.name)) {
      //if this is an item, increase the count
      if (itemData.type === 'item') {
        //get current quantity
        oldValue = this.items.getName(itemData.name).system.quantity;
        newValue = oldValue + addAmount;
        //increase severity of the condition
        this.items.getName(itemData.name).update({'system.quantity': newValue});
        //create message text
        flavorText = `Quantity has increased from <strong>` + oldValue + `</strong> to <strong>` + newValue + `</strong>.`;
      //if this is a condition, increase the severity
      } else if (itemData.type === 'condition') {
        //get current severity
        oldValue = this.items.getName(itemData.name).system.severity;
        newValue = oldValue + addAmount;
        //increase severity of the condition
        this.items.getName(itemData.name).update({'system.severity': newValue});
        //create message text
        flavorText = this.getFlavorText('item','condition','increase') + `Severity has increased from <strong>` + oldValue + `</strong> to <strong>` + newValue + `</strong>.`;
      //if this is a weapon or armor, add another one
      } else if (itemData.type === 'weapon' || itemData.type === 'armor') {
        //add item to the players inventory
        await this.createEmbeddedDocuments('Item', [itemData]);
        //create message text
        flavorText = `You add another one of these to your inventory.`;
      }
    } else {
      //if this is an item, add it
      if (itemData.type === 'item') {
        //give the character the item
        await this.createEmbeddedDocuments('Item', [itemData]);
        //increase severity of the condition
        this.items.getName(itemData.name).update({'system.quantity': addAmount});
        //create message text
        flavorText = `You add <strong>` + addAmount + `</strong> of these to your inventory.`;
      //if this is a condition, add it
      } else if (itemData.type === 'condition') {
        //give the character the item
        await this.createEmbeddedDocuments('Item', [itemData]);
        //increase severity of the condition
        this.items.getName(itemData.name).update({'system.severity': addAmount});
        //create message text
        flavorText = this.getFlavorText('item','condition','add') + `, with a severity of <strong>` + addAmount + `</strong>.`;
      //if this is a weapon or armor, add it
      } else if (itemData.type === 'weapon' || itemData.type === 'armor') {
        //add item to the players inventory
        await this.createEmbeddedDocuments('Item', [itemData]);
        //create message text
        flavorText = `You add this to your inventory.`;
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
        speaker: {actor: this.id, token: this.token, alias: this.name},
        content: messageContent
      },{keepId:true});
    //log what was done
    console.log(`Modified item: ${itemData.name} belonging to actor: ${this.name}, by: addAmount:${addAmount}`);
  }

  //ask the player if we want to reload
  async askReload(itemId) {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create final dialog data
      const dialogData = {
        title: `Weapon Issue`,
        content: `<h4>Out of ammo, you need to reload.</h4><br/>`,
        buttons: {}
      };
      //add buttons
        //reload
        dialogData.buttons.roll = {
          label: `Reload`,
          callback: () => this.reloadWeapon(itemId),
          icon: `<i class="fas fa-check"></i>`
        };
        //cancel
        dialogData.buttons.cancel = {
          label: `Cancel`,
          callback: () => { },
          icon: `<i class="fas fa-times"></i>`
        };
      //render dialog
      const dialog = new Dialog(dialogData).render(true);
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
        title: `Weapon Issue`,
        content: `<h4>Out of ammo.</h4><br/>`,
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
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID(): randomID())
    //dupe item to work with
    var item;
    if (game.release.generation >= 12) {
      item = foundry.utils.duplicate(this.getEmbeddedDocument('Item',itemId));
    } else {
      item = duplicate(this.getEmbeddedDocument('Item',itemId));
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
        msgBody = `Weapon reloaded.`;
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
        speaker: {actor: this.id, token: this.token, alias: this.name},
        content: messageContent
      },{keepId:true});
    //log what was done
    console.log(`Reloaded weapon.`);
  }

  //make the player take bleeding damage
  async takeBleedingDamage() {
    //init vars
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID(): randomID())
    //determine bleeding amount
    let healthLost = this.items.getName("Bleeding").system.severity*-1;
    //run the function for the player's 'Selected Character'
    let modification = await this.modifyActor('system.health.value',healthLost,null,false);
    //get flavor text
    let msgFlavor = this.getFlavorText('item','condition','bleed');
    let msgOutcome = modification[1];
    //create chat message text
    let messageContent = `
    <div class="mosh">
      <div class="rollcontainer">
          <div class="flexrow" style="margin-bottom: 5px;">
          <div class="rollweaponh1">Health Lost</div>
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
      speaker: {actor: this.id, token: this.token, alias: this.name},
      content: messageContent
    },{keepId:true});
    //log what was done
    console.log(`Took bleeding damage.`);
  }

  //make the player take radiation damage
  async takeRadiationDamage() {
    //init vars
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID(): randomID())
    //reduce all stats and saves by 1
    this.modifyActor('system.stats.strength.value',-1,null,false);
    this.modifyActor('system.stats.speed.value',-1,null,false);
    this.modifyActor('system.stats.intellect.value',-1,null,false);
    this.modifyActor('system.stats.combat.value',-1,null,false);
    this.modifyActor('system.stats.sanity.value',-1,null,false);
    this.modifyActor('system.stats.fear.value',-1,null,false);
    this.modifyActor('system.stats.body.value',-1,null,false);
    //get flavor text
    let msgFlavor = this.getFlavorText('item','condition','radiation');
    let msgOutcome = `All stats and saves decreased by <strong>1</strong>.`;
    //create chat message text
    let messageContent = `
    <div class="mosh">
      <div class="rollcontainer">
          <div class="flexrow" style="margin-bottom: 5px;">
          <div class="rollweaponh1">Radiation Damage</div>
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
      speaker: {actor: this.id, token: this.token, alias: this.name},
      content: messageContent
    },{keepId:true});
    //log what was done
    console.log(`Took radiation damage.`);
  }

  //make the player take radiation damage
  async takeCryoDamage(rollString) {
    //init vars
    let chatId = (game.release.generation >= 12 ? foundry.utils.randomID(): randomID())
    //roll the dice
      //parse the roll string
      let parsedRollString = this.parseRollString(rollString,'low');
      //roll the dice
      let rollResult = await new Roll(parsedRollString).evaluate();
      //interpret the results
      let parsedRollResult = this.parseRollResult(rollString,rollResult,false,false,null,null,null);
    //reduce all stats and saves by roll result
    this.modifyActor('system.stats.strength.value',parsedRollResult.total,null,false);
    this.modifyActor('system.stats.speed.value',parsedRollResult.total,null,false);
    this.modifyActor('system.stats.intellect.value',parsedRollResult.total,null,false);
    this.modifyActor('system.stats.combat.value',parsedRollResult.total,null,false);
    this.modifyActor('system.stats.sanity.value',parsedRollResult.total,null,false);
    this.modifyActor('system.stats.fear.value',parsedRollResult.total,null,false);
    this.modifyActor('system.stats.body.value',parsedRollResult.total,null,false);
    //get flavor text
    let msgFlavor = this.getFlavorText('item','condition','cryo');
    let msgOutcome = `All stats and saves decreased by <strong>` + Math.abs(parsedRollResult.total).toString() + `</strong>.`;
    //create chat message text
    let messageContent = `
    <div class="mosh">
      <div class="rollcontainer">
          <div class="flexrow" style="margin-bottom: 5px;">
          <div class="rollweaponh1">Cryofreeze Damage</div>
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
      speaker: {actor: this.id, token: this.token, alias: this.name},
      content: messageContent
    },{keepId:true});
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
      <!-- HEADER -->
      <div class ="macro_window" style="margin-bottom : 7px;">
      <div class="grid grid-2col" style="grid-template-columns: 150px auto">
        <div class="macro_img"><img src="systems/mosh/images/icons/ui/attributes/armor.png" style="border:none"/></div>
        <div class="macro_desc"><h3>Cover</h3>The environment can provide protection called <strong>Cover</strong>. It can be destroyed, just like armor, whenever it is dealt Damage greater than or equal to its AP. Cover typically only protects against ranged attacks, but in some situations may help block a hand-to-hand attack. <strong>If you shoot while in Cover, you are considered out of Cover until your next turn.</strong> Your Cover values are displayed in <strong><span style="color: orangered">orange</span></strong>.</div>
      </div>
      </div>
      <h4>Select your current cover situation:</h4>
      <!-- NO COVER -->
      <label for="none">
        <div class ="macro_window" style="margin-top: 7px; margin-bottom: 7px; vertical-align: middle; padding-left: 3px;">
          <div class="grid grid-3col" style="grid-template-columns: 20px auto 250px">
            <input type="radio" id="none" name="cover" value="none" ${none_checked}>
            <div class="macro_desc" style="display: table; padding-left: 5px;">
              <span style="display: table-cell; vertical-align: middle;">
                <strong>No Cover</strong><br>Unprotected, out in the open, etc.
              </span>
            </div>
            <div class="macro_desc mosh health resource healthspread minmaxtopstat">
              <div class="minmaxwrapper" style="width: 100%; background: black; border-radius: 0.3em;">
                <div class="maxhealth-input whiteText" type="text" data-dtype="Number">${curAP}</div>
                <div class="slant" style="border-right: 2px solid #ffffff; transform: skewX(0deg);"></div>
                <div class="maxhealth-input whiteText" type="text" data-dtype="Number">${curDR}</div>
              </div>
              <div class="grid">
                <div class="healthmaxtext mosh health resource">Armor Points</div>
                <div class="healthmaxtext mosh health resource">DMG Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </label>
      <!-- INSIGNIFICANT COVER -->
      <label for="insignificant">
        <div class ="macro_window" style="margin-top: 7px; margin-bottom: 7px; vertical-align: middle; padding-left: 3px;">
          <div class="grid grid-3col" style="grid-template-columns: 20px auto 250px">
            <input type="radio" id="insignificant" name="cover" value="insignificant" ${insignificant_checked}>
            <div class="macro_desc" style="display: table; padding-left: 5px;">
              <span style="display: table-cell; vertical-align: middle;">
                <strong>Insignificant Cover</strong><br>Wood furniture/doors, body shields, etc.
              </span>
            </div>
            <div class="macro_desc mosh health resource healthspread minmaxtopstat">
              <div class="minmaxwrapper" style="width: 100%; background: black; border-radius: 0.3em;">
                <div class="maxhealth-input" style="display: flex;">
                  <div class="maxhealth-input whiteText" type="text" data-dtype="Number">${curAP}</div>
                  <div class="highlightText" type="text" data-dtype="Number" style="font-size: 0.8rem;">&nbsp;5</div>
                </div>
                <div class="slant" style="border-right: 2px solid #ffffff; transform: skewX(0deg);"></div>
                <div class="maxhealth-input whiteText" type="text" data-dtype="Number">${curDR}</div>
              </div>
              <div class="grid">
                <div class="healthmaxtext mosh health resource">Armor Points</div>
                <div class="healthmaxtext mosh health resource">DMG Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </label>
      <!-- LIGHT COVER -->
      <label for="light">
        <div class ="macro_window" style="margin-top: 7px; margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
          <div class="grid grid-3col" style="grid-template-columns: 20px auto 250px">
            <input type="radio" id="light" name="cover" value="light" ${light_checked}>
            <div class="macro_desc" style="display: table; padding-left: 5px;">
              <span style="display: table-cell; vertical-align: middle;">
                <strong>Light Cover</strong><br>Trees, bulkhead walls, metal furniture, etc.
              </span>
            </div>
            <div class="macro_desc mosh health resource healthspread minmaxtopstat">
              <div class="minmaxwrapper" style="width: 100%; background: black; border-radius: 0.3em;">
                <div class="maxhealth-input" style="display: flex;">
                  <div class="maxhealth-input whiteText" type="text" data-dtype="Number">${curAP}</div>
                  <div class="highlightText" type="text" data-dtype="Number" style="font-size: 0.8rem;">&nbsp;10</div>
                </div>
                <div class="slant" style="border-right: 2px solid #ffffff; transform: skewX(0deg);"></div>
                <div class="maxhealth-input whiteText" type="text" data-dtype="Number">${curDR}</div>
              </div>
              <div class="grid">
                <div class="healthmaxtext mosh health resource">Armor Points</div>
                <div class="healthmaxtext mosh health resource">DMG Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </label>
      <!-- HEAVY COVER -->
      <label for="heavy">
        <div class ="macro_window" style="margin-top: 7px; margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
          <div class="grid grid-3col" style="grid-template-columns: 20px auto 250px">
            <input type="radio" id="heavy" name="cover" value="heavy" ${heavy_checked}>
            <div class="macro_desc" style="display: table; padding-left: 5px;">
              <span style="display: table-cell; vertical-align: middle;">
                <strong>Heavy Cover</strong><br>Airlock doors, cement beams, ships, etc.
              </span>
            </div>
            <div class="macro_desc mosh health resource healthspread minmaxtopstat">
              <div class="minmaxwrapper" style="width: 100%; background: black; border-radius: 0.3em;">
                <div class="maxhealth-input" style="display: flex;">
                  <div class="maxhealth-input whiteText" type="text" data-dtype="Number">${curAP}</div>
                  <div class="highlightText" type="text" data-dtype="Number" style="font-size: 0.8rem;">&nbsp;20</div>
                </div>
                <div class="slant" style="border-right: 2px solid #ffffff; transform: skewX(0deg);"></div>
                <div class="maxhealth-input" style="display: flex;">
                  <div class="maxhealth-input whiteText" type="text" data-dtype="Number">${curDR}</div>
                  <div class="highlightText" type="text" data-dtype="Number" style="font-size: 0.8rem;">&nbsp;5</div>
                </div>
              </div>
              <div class="grid">
                <div class="healthmaxtext mosh health resource">Armor Points</div>
                <div class="healthmaxtext mosh health resource">DMG Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </label>
      `;
      //create final dialog data
      const dialogData = {
        title: `Cover`,
        content: msgContent,
        buttons: {}
      };
      //add buttons
        //Ok
        dialogData.buttons.cancel = {
          label: `Ok`,
          callback: (html) => {
            this.update({'system.stats.armor.cover': html.find("input[name='cover']:checked").attr("value")});
            console.log(`User's cover is now:${html.find("input[name='cover']:checked").attr("value")}`);
          },
          icon: '<i class="fas fa-check"></i>'
        };
      //render dialog
      const dialog = new Dialog(dialogData,{width: 600,height: 580}).render(true);
      });
    
  }

  //activate ship's distress signal
  async distressSignal() {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create pop-up HTML
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
          <div class="macro_img"><img src="systems/mosh/images/icons/ui/rolltables/distress_signal.png" style="border:none"/></div>
          <div class="macro_desc"><h3>Distress Signal</h3>Occasionally you may need to put your ship on emergency power, seal yourselves in cryopods, send out a Distress Signal, and wait for help. It’s a long shot, but sometimes it’s the only shot you’ve got. When this happens, roll on this table.</div>    
        </div>
      </div>
      <h4>Select your roll type:</h4>
      `;
      //create final dialog data
      const dialogData = {
        title: `Distress Signal`,
        content: msgContent,
        buttons: {
          button1: {
            label: `Advantage`,
            callback: () => this.rollTable(game.settings.get('mosh','table1eDistressSignal'),`1d10 [+]`,`low`,true,false,null,null),
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          button2: {
            label: `Normal`,
            callback: () => this.rollTable(game.settings.get('mosh','table1eDistressSignal'),`1d10`,`low`,true,false,null,null),
            icon: `<i class="fas fa-minus"></i>`
          },
          button3: {
            label: `Disadvantage`,
            callback: () => this.rollTable(game.settings.get('mosh','table1eDistressSignal'),`1d10 [-]`,`low`,true,false,null,null),
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        }
      };
      //render dialog
      const dialog = new Dialog(dialogData,{width: 600,height: 265}).render(true);
      });
    
  }

  //activate ship's distress signal
  async maintenanceCheck() {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create pop-up HTML
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
          <div class="macro_img"><img src="systems/mosh/images/icons/ui/rolltables/maintenance_issues.png" style="border:none"/></div>
          <div class="macro_desc"><h3>Maintenance Check</h3>Eventually, your ship needs a tune-up, or sometimes a complete overhaul. When this happens, you’ll need to get it repaired. <strong>Minor Repairs</strong> cover cosmetic damage, cleanup, and other handyman type work that can be handled in flight, usually within 2d10 days. <strong>Major Repairs</strong> cover large scale structural or system damage, including repairing Megadamage and Hull, and can only be fixed in port.</div>    
        </div>
      </div>
      <h4>Select your roll type:</h4>
      `;
      //create final dialog data
      const dialogData = {
        title: `Maintenance Check`,
        content: msgContent,
        buttons: {
          button1: {
            label: `Advantage`,
            callback: () => this.rollTable(`maintenanceCheck`,`1d100 [+]`,`low`,null,null,null,null),
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          button2: {
            label: `Normal`,
            callback: () => this.rollTable(`maintenanceCheck`,`1d100`,`low`,null,null,null,null),
            icon: `<i class="fas fa-minus"></i>`
          },
          button3: {
            label: `Disadvantage`,
            callback: () => this.rollTable(`maintenanceCheck`,`1d100 [-]`,`low`,null,null,null,null),
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        }
      };
      //render dialog
      const dialog = new Dialog(dialogData,{width: 600,height: 265}).render(true);
      });
    
  }

  //activate ship's distress signal
  async bankruptcySave() {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create pop-up HTML
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
          <div class="macro_img"><img src="systems/mosh/images/icons/ui/rolltables/bankruptcy_save.png" style="border:none"/></div>
          <div class="macro_desc"><h3>Bankruptcy Save</h3>A slim minority of ships are owned by small banking firms who share ownership with the operators, fronting all costs of the vessel and taking most of the profits. In exchange, you get a ship and a relatively free hand in conducting your business on the Rim. Each year <em>(or quarter, as determined by your Warden)</em>, make a <strong>Bankruptcy Save</strong> to determine the financial health of the company.</div>    
        </div>
      </div>
      <h4>Select your roll type:</h4>
      `;
      //create final dialog data
      const dialogData = {
        title: `Bankruptcy Save`,
        content: msgContent,
        buttons: {
          button1: {
            label: `Advantage`,
            callback: () => this.rollCheck(`1d100 [+]`,`low`,`bankruptcySave`,null,null,null),
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          button2: {
            label: `Normal`,
            callback: () => this.rollCheck(`1d100`,`low`,`bankruptcySave`,null,null,null),
            icon: `<i class="fas fa-minus"></i>`
          },
          button3: {
            label: `Disadvantage`,
            callback: () => this.rollCheck(`1d100 [-]`,`low`,`bankruptcySave`,null,null,null),
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        }
      };
      //render dialog
      const dialog = new Dialog(dialogData,{width: 600,height: 265}).render(true);
      });
    
  }

  //activate ship's distress signal
  async moraleCheck() {
    //wrap the whole thing in a promise, so that it waits for the form to be interacted with
    return new Promise(async (resolve) => {
      //create pop-up HTML
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
          <div class="macro_img"><img src="systems/mosh/images/icons/ui/macros/morale_check.png" style="border:none"/></div>
          <div class="macro_desc"><h3>Morale Check</h3>After any Ship Round where an enemy takes MDMG, they must make a Morale Check. To make a Morale Check, roll 1d10. If they roll under their current MDMG, they may send a hail offering a ceasefire and to resume negotiations.</div>
        </div>
      </div>
      <h4>Select your roll type:</h4>
      `;
      //create final dialog data
      const dialogData = {
        title: `Morale Check`,
        content: msgContent,
        buttons: {
          button1: {
            label: `Advantage`,
            callback: () => this.rollCheck(`1d10 [+]`,`high-equal`,`moraleCheck`,null,null,null),
            icon: `<i class="fas fa-angle-double-up"></i>`
          },
          button2: {
            label: `Normal`,
            callback: () => this.rollCheck(`1d10`,`high-equal`,`moraleCheck`,null,null,null),
            icon: `<i class="fas fa-minus"></i>`
          },
          button3: {
            label: `Disadvantage`,
            callback: () => this.rollCheck(`1d10 [-]`,`high-equal`,`moraleCheck`,null,null,null),
            icon: `<i class="fas fa-angle-double-down"></i>`
          }
        }
      };
      //render dialog
      const dialog = new Dialog(dialogData,{width: 600,height: 265}).render(true);
      });
    
  }

  // print description
  printDescription(itemId, options = { event: null }) {
    var item;
    if (game.release.generation >= 12) {
      item = foundry.utils.duplicate(this.getEmbeddedDocument('Item',itemId));
    } else {
      item = duplicate(this.getEmbeddedDocument('Item',itemId));
    }
    this.chatDesc(item);
  }

  // Print the item description into the chat.
  chatDesc(item) {
    let swapNameDesc = false;
    let swapName = '';
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

    //add flag to swap name and description, if desc contains trinket or patch
    if(item.system.description === '<p>Patch</p>' || item.system.description === '<p>Trinket</p>' || item.system.description === '<p>Maintenance Issue</p>') {
      swapNameDesc = true;
      swapName = item.system.description.replaceAll('<p>','').replaceAll('</p>','');
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

    /*
            if (this.data.type == "creature") {
                chatData.whisper = game.user._id;
            }
    */
    let template = 'systems/mosh/templates/chat/itemRoll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;
      ChatMessage.create(chatData);
    });
    //log what was done
    console.log(`Created chat message with details on ${item.name}`);
  }

}