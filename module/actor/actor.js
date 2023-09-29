/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class MothershipActor extends Actor {

  //Augment the basic actor data with additional dynamic data.
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
    if (game.settings.get("mosh", "useCalm") && action === 'stress') {
      action = 'calm';
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
            android: `@UUID[Compendium.mosh.macros_hotbar_1e.Macro.ZzKgfEmRdvDfyBMS]{Make a Wound Check}`,
            human: `@UUID[Compendium.mosh.macros_hotbar_1e.Macro.ZzKgfEmRdvDfyBMS]{Make a Wound Check}`
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
            android: `@UUID[Compendium.mosh.macros_hotbar_1e.Macro.NsRHfRuuNGPfkYVf]{Make a Death Save}`,
            human: `@UUID[Compendium.mosh.macros_hotbar_1e.Macro.NsRHfRuuNGPfkYVf]{Make a Death Save}`
          },
          pastCeiling: {
            android: `@UUID[Compendium.mosh.macros_hotbar_1e.Macro.NsRHfRuuNGPfkYVf]{Make a Death Save}`,
            human: `@UUID[Compendium.mosh.macros_hotbar_1e.Macro.NsRHfRuuNGPfkYVf]{Make a Death Save}`
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
        }
      },
      //macro flavor text (embedding actions)
      macro: {
        wound: {
          bleeding: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.1DD8i6eCS6nx2Ip0]{Bleeding}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.1DD8i6eCS6nx2Ip0]{Bleeding}`
          },
          bleeding_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.xr2o2PU5vdrR6fxQ]{Bleeding [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.xr2o2PU5vdrR6fxQ]{Bleeding [-]}`
          },
          bleeding_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.tFcWNddtZvlv7tsg]{Bleeding [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.tFcWNddtZvlv7tsg]{Bleeding [+]}`
          },
          blunt_force: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.TAjlQjA5AAy3qYL3]{Blunt Force}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.TAjlQjA5AAy3qYL3]{Blunt Force}`
          },
          blunt_force_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.k0zf8ZGivRguc0wb]{Blunt Force [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.k0zf8ZGivRguc0wb]{Blunt Force [-]}`
          },
          blunt_force_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.oL3GH0HoEPlP8vzG]{Blunt Force [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.oL3GH0HoEPlP8vzG]{Blunt Force [+]}`
          },
          fire_explosives: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.bZi1qKmcKLFvnhZ2]{Fire & Explosives}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.bZi1qKmcKLFvnhZ2]{Fire & Explosives}`
          },
          fire_explosives_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.7rYhbDAaFeok1Daq]{Fire & Explosives [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.7rYhbDAaFeok1Daq]{Fire & Explosives [-]}`
          },
          fire_explosives_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.dJnQKDf0AlwK27QD]{Fire & Explosives [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.dJnQKDf0AlwK27QD]{Fire & Explosives [+]}`
          },
          gore_massive: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.S9nnHKWYGSQmjQdp]{Gore}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.S9nnHKWYGSQmjQdp]{Gore}`
          },
          gore_massive_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.eQPuDgwv8evetFIk]{Gore [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.eQPuDgwv8evetFIk]{Gore [-]}`
          },
          gore_massive_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.DuVjNlE4lsnR7Emc]{Gore [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.DuVjNlE4lsnR7Emc]{Gore [+]}`
          },
          gunshot: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.XgCOLv9UunBddUyW]{Gunshot}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.XgCOLv9UunBddUyW]{Gunshot}`
          },
          gunshot_dis: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.LTpa1ZYVZl4m9k6z]{Gunshot [-]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.LTpa1ZYVZl4m9k6z]{Gunshot [-]}`
          },
          gunshot_adv: {
            android: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.fnVATRHYJEUlS3pR]{Gunshot [+]}`,
            human: `@UUID[Compendium.mosh.macros_triggered_1e.Macro.fnVATRHYJEUlS3pR]{Gunshot [+]}`
          }
        }
      }
    };
    //check to see if this address exists in the library, return the action parameter if not
    if (checkNested(textLibrary,type,context,action)) {
      //set full path to include class type
      if (this.type === 'character') {
        if(this.system.class.value.toLowerCase() === 'android') {
          //return class appropriate text
          return textLibrary[type][context][action].android;
        } else {
          //return class appropriate text
          return textLibrary[type][context][action].human;
        }
      } else {
        //return class appropriate text
        return textLibrary[type][context][action].human;
      }
    } else {
      return action;
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
        if (rollString.substr(0,rollString.indexOf("[")).trim() === '1d10' || rollString === '1d10') {
          //loop through dice
          enrichedRollResult.dice.forEach(function(roll){ 
            //loop through each result
            roll.results.forEach(function(die) { 
              //change any 10s to 0s
              if (die.result === 10) {die.result = 0;}
            });
          });
        //1d100 changes
        } else if (rollString.substr(0,rollString.indexOf("[")).trim() === '1d100' || rollString === '1d100') {
          //loop through dice
          enrichedRollResult.dice.forEach(function(roll){ 
            //loop through each result
            roll.results.forEach(function(die) { 
              //change any 100s to 0s
              if (die.result === 100) {die.result = 0;}
            });
          });
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
                        //compare values based on compararison setting
                        if (comparison === '<') {
                          //check against being under the target
                          if (die.result < rollTarget) {
                            //result >= target is a failure
                            critHighlight = ' max';
                          } else {
                            //result < target is a success
                            critHighlight = ' min';
                          }
                        } else {
                          //check against being over the target
                          if (die.result > rollTarget) {
                            //result < target is a failure
                            critHighlight = ' max';
                          } else {
                            //result < target is a success
                            critHighlight = ' min';
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
    //return the enriched roll result object
    return enrichedRollResult;
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
    let chatId = randomID();
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
              tableId = 'GCtYeCCQVQJ5M6SE';
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
              tableId = 'aBnY19jlhPXzibCt';
              aimFor = 'high';
              zeroBased = false;
              checkCrit = false;
              rollAgainst = 'system.other.stress.value';
              comparison = '>';
            }
          } else {
            if (useCalm) { 
              tableId = 'MOYI6Ntj5OVFYk06';
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
              tableId = 'ypcoikqHLhnc9tNs';
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
              tableId = 'VW6HQ29T7zClNIZ6';
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
              tableId = 'egJ11m2mJM3HBd6d';
              aimFor = 'high';
              zeroBased = false;
              checkCrit = false;
              rollAgainst = 'system.other.stress.value';
              comparison = '>';
            }
          } else {
            if (useCalm) { 
              tableId = 'kqKpQAXyLTEEyz6Z';
              aimFor = 'low';
              zeroBased = true;
              checkCrit = true;
              rollAgainst = 'system.other.stress.value';
              comparison = '<';
            } else {
              tableId = '1vCm4ElRPotQXgNB';
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
      //set panic die color
      let dsnTheme = game.settings.get('mosh','panicDieTheme');
      //apply theme if this is a panic check
      if (tableName === 'Panic Check') {
        parsedRollString = parsedRollString + '[' + dsnTheme + ']';
      }
      //roll the dice
      let rollResult = await new Roll(parsedRollString).evaluate();
      //interpret the results
      let parsedRollResult = this.parseRollResult(rollString,rollResult,zeroBased,checkCrit,rollTarget,comparison);
    //if this is a panic check, we may need to roll again OR add modifiers to our result total
      //roll a second die if needed
      if (!parsedRollResult.success && specialRoll === 'panicCheck' && !firstEdition && !useCalm) {
        //determine the rollString
        let rollString2 = '2d10';
        //add modifiers if needed
          //0e modifier: + Stress - Resolve
          if (specialRoll === 'panicCheck' && !firstEdition && !useCalm) {
            rollString2 = rollString2 + ' + ' + this.system.other.stress.value + ' - ' + this.system.other.resolve.value
          }
          //Calm modifier: + Stress - Resolve
          if (specialRoll === 'panicCheck' && useCalm) {
            rollString2 = rollString2 + ' + ' + this.system.other.resolve.value
          }
        //roll second dice
        rollResult2 = await new Roll(rollString2).evaluate();
        //roll second set of dice
        parsedRollResult2 = this.parseRollResult(rollString2,rollResult2,false,false,null,null);
        //set marker for HTML
        secondRoll = true;
        //set table result number
        tableResultNumber = parsedRollResult2.total
      }
      //set table result number if null
      if(!tableResultNumber) {tableResultNumber = parsedRollResult.total;}
    //fetch the table result
      //get table result
      let tableResult = tableData.getResultsForRoll(tableResultNumber);
    //make any custom changes to chat message
      //panic check #19 customiziation
      if (tableName === 'Panic Check' && tableResultNumber === 19) {
        if (this.system.class.value.toLowerCase() === 'android') {
          tableResult[0].text = tableResult[0].text.replace("HEART ATTACK / SHORT CIRCUIT (ANDROIDS).","SHORT CIRCUIT.");
        } else {
          tableResult[0].text = tableResult[0].text.replace("HEART ATTACK / SHORT CIRCUIT (ANDROIDS).","HEART ATTACK.");
        }
      }
    //assign message description text
    msgDesc = this.getFlavorText('table',tableName.replaceAll('& ','').replaceAll(' ','_').toLowerCase(),'roll');
    //assign flavor text
      //get main flavor text
      flavorText = this.getFlavorText('table',tableName.replaceAll('& ','').replaceAll(' ','_').toLowerCase(),'success');
      //append 0e crit success effect
      if (!firstEdition && !useCalm && parsedRollResult.success && parsedRollResult.critical) {
        flavorText = flavorText + ` Relieve 1 Stress.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.Macro.qbq694JMbXeZrHjj]{-1 Stress}`;
      }
      //append Calm effects for Critical Panic Success
      if (useCalm && parsedRollResult.success && parsedRollResult.critical) {
        flavorText = flavorText + ` Gain 1d10 Calm.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.Macro.k2TtLFOG9mGaWVx3]{+1d10 Calm}`;
      }
      //append Calm effects for Critical Panic Failure
      if (useCalm && !parsedRollResult.success && parsedRollResult.critical) {
        tableResult[0].text = tableResult[0].text + `<br><br>You lose 1d10 Calm because you critically failed.<br><br>@UUID[Compendium.mosh.macros_triggered_1e.Macro.jHyqXb2yDFTNWxpy]{-1d10 Calm}`;
      }
	  //generate chat message
      //prepare data
      let messageData = {
        actor: this,
        tableResult: tableResult,
        parsedRollResult: parsedRollResult,
        tableName: tableName,
        tableImg: tableImg,
        msgDesc: msgDesc,
        flavorText: flavorText,
        woundText: woundText,
        secondRoll: secondRoll,
        parsedRollResult2: parsedRollResult2
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
      //wait for dice
      await game.dice3d.waitFor3DAnimationByMessageID(chatId);
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
          <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
          <input type="radio" id="[RADIO_ID]" name="skill" value="[RADIO_VALUE]">
          <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="[RADIO_IMG]" style="border:none"/></div>
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
          },
          icon: `<i class="fas fa-angle-double-up"></i>`
        };
        //Normal
        dialogData.buttons.button2 = {
          label: `Normal`,
          callback: (html) => {
            rollString = die;
            resolve([rollString]);
          },
          icon: `<i class="fas fa-minus"></i>`
        };
        //Disadvantage
        dialogData.buttons.button3 = {
          label: `Disadvantage`,
          callback: (html) => { 
            rollString = dieDis;
            resolve([rollString]);
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
    let messageTemplate = ``;
    let messageContent = ``;
    let parsedDamageString = null;
    let damageResult = null;
    let parsedDamageResult = null;
    let critFail = false;
    let critMod = ``;
    let outcomeVerb = ``;
    let flavorText = ``;
    let needsDesc = false;
    let woundEffect = ``;
    let msgHeader = ``;
    let msgImgPath = ``;
    let chatId = randomID();
    let firstEdition = game.settings.get('mosh','firstEdition');
    let useCalm = game.settings.get('mosh','useCalm');
    let androidPanic = game.settings.get('mosh','androidPanic');
    //customize this roll if its a unique use-case
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
    //make the rollTarget value
      //retrieve the attribute
      let rollTarget = this.system.stats[attribute].value
      //add the mod value
      rollTarget = Number(rollTarget) + (Number(this.system.stats[attribute].mod) || 0);
      //add the skill value
      rollTarget = Number(rollTarget) + Number(skillValue || 0);   
    //roll the dice
      //parse the roll string
      let parsedRollString = this.parseRollString(rollString,aimFor);
      //roll the dice
      let rollResult = await new Roll(parsedRollString).evaluate();
      //interpret the results
      let parsedRollResult = this.parseRollResult(rollString,rollResult,checkCrit,zeroBased,rollTarget,'<');
    //prep damage dice in case its needed
    if(weapon && parsedRollResult.success) {
      //parse the roll string
      parsedDamageString = this.parseRollString(weapon.system.damage,'high');
    }
    //set chat message text
      //message header
      msgHeader = this.system.stats[attribute].rollLabel;
      //set header image
      msgImgPath = 'systems/mosh/images/icons/ui/attributes/' + attribute + '.png';
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
        //set damage dice color
        let dsnTheme = game.settings.get('mosh','damageDiceTheme');
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
              //increase stress by 1 and retrieve the flavor text from the result
              let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
              flavorText = addStress[1];
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
                //gain 1 stress
                let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
                flavorText = addStress[1];
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
          //1e rest save
          if (firstEdition) {
            //calm outcome
            if (useCalm) {
              //override message header
              msgHeader = `Rest Save`;
              //override  header image
              msgImgPath = `systems/mosh/images/icons/ui/macros/rest_save.png`;
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
              //override message header
              msgHeader = `Rest Save`;
              //override  header image
              msgImgPath = `systems/mosh/images/icons/ui/macros/rest_save.png`;
              //prep text based on success or failure
              if (parsedRollResult.success === false && this.type === 'character') {
                //increase stress by 1 and retrieve the flavor text from the result
                let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
                flavorText = addStress[1];
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
              //override message header
              msgHeader = `Rest Save`;
              //override  header image
              msgImgPath = `systems/mosh/images/icons/ui/macros/rest_save.png`;
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
              //override message header
              msgHeader = `Rest Save`;
              //override  header image
              msgImgPath = `systems/mosh/images/icons/ui/macros/rest_save.png`;
              //prep text based on success or failure
              if (parsedRollResult.success === false && this.type === 'character') {
                //increase stress by 1 and retrieve the flavor text from the result
                let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
                flavorText = addStress[1];
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
      //prepare flavor text for regular checks
      } else {
        //prep text based on success or failure
        if (parsedRollResult.success === false && this.type === 'character') {
          //if first edition
          if (firstEdition) {
            //if calm not enabled
            if (!useCalm) {
              //increase stress by 1 and retrieve the flavor text from the result
              let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
              flavorText = addStress[1];
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
                //gain 1 stress
                let addStress = await this.modifyActor('system.other.stress.value',1,null,false);
                flavorText = addStress[1];
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
        attribute: this.system.stats[attribute].label,
        flavorText: flavorText,
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
      //wait for dice
      await game.dice3d.waitFor3DAnimationByMessageID(chatId);
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
    let chatId = randomID();
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
            //set default message outcome
            if (msgAction === 'increase' || msgAction === 'decrease') {
              msgOutcome = fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
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
          let parsedRollResult = this.parseRollResult(modRollString,rollResult,false,false,null,null);
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
                //set default message outcome
                if (msgAction === 'increase' || msgAction === 'decrease') {
                  msgOutcome = fieldPrefix + fieldLabel.reduce((a, v) => a[v], this) + ` ` + msgChange + ` from <strong>${modifyCurrent}</strong> to <strong>${modifyNew}</strong>.`;
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
                //wait for dice
                await game.dice3d.waitFor3DAnimationByMessageID(chatId);
            }
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
    let chatId = randomID();
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
        flavorText = `You add <strong>` + addAmount + `</strong> of these to your inventory..`;
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
  }

  //central adding skill function | TAKES 'Body Save','1d10' | RETURNS player selected rollString.
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
        //Advantage
        dialogData.buttons.roll = {
          label: `Reload`,
          callback: () => this.reloadWeapon(itemId),
          icon: `<i class="fas fa-check"></i>`
        };
        //Normal
        dialogData.buttons.cancel = {
          label: `Cancel`,
          callback: () => { },
          icon: `<i class="fas fa-times"></i>`
        };
      //render dialog
      const dialog = new Dialog(dialogData).render(true);
    });
  }

  //central adding skill function | TAKES 'Body Save','1d10' | RETURNS player selected rollString.
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
  }

  //reload weapon
  async reloadWeapon(itemId) {
    //init vars
    let messageTemplate = ``;
    let messageContent = ``;
    let msgBody = ``;
    let chatId = randomID();
    //dupe item to work with
    let item = duplicate(this.getEmbeddedDocument('Item',itemId));
    //reload
    if (!item.system.useAmmo) {
      //exit function (it should not be possible to get here)
      return;
    } else {
      //do we need to reload?
      if (item.system.curShots === item.system.shots) {
        //exit function (it should not be possible to get here)
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
  }

  //take bleeding damage
  async takeBleedingDamage() {
    //init vars
    let chatId = randomID();  
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
  }

  //take radiation damage
  async takeRadiationDamage() {
    //init vars
    let chatId = randomID();  
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
  }

  // print description
  printDescription(itemId, options = { event: null }) {
    let item = duplicate(this.getEmbeddedDocument('Item',itemId));
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
    let template = 'systems/mosh/templates/chat/itemRoll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;
      ChatMessage.create(chatData);
    });
  }

}