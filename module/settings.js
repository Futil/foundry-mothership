export const registerSettings = function () {
    game.settings.register('mosh', 'firstEdition', {
        name: "1e Rules",
        hint: "Use the 1st edition rules and character sheet.",
        default: true,
        scope: 'world',
        type: Boolean,
        config: true,
        onChange: value => { // A callback function which triggers when the setting is changed
            console.log("newArmorandCombat set to " + value)
          }
    });

    game.settings.register('mosh', 'rollTable', {
        name: "Roll Tables",
        hint: "Where are the rolltables located?",
        default: "mosh.rolltables",
        scope: 'world',
        type: String,
        config: true,
        onChange: value => { // A callback function which triggers when the setting is changed
            console.log("Rolltables set to " + value)
          }
    });

    game.settings.register('mosh', 'macroTarget', {
        name: "Macro Target",
        hint: "Who should be the target for macros?",
        default: "character",
        scope: 'world',
        type: String,
        choices: {
            "character": "Currently active character for the player",
            "token": "Currently selected token(s) on the scene"
          },
        config: true,
        onChange: value => { // A callback function which triggers when the setting is changed
            console.log("Macro target set to " + value)
          }
    });

    game.settings.register('mosh', 'critDamage', {
        name: "Critical Hit Damage",
        hint: "What should the damage be on a critical hit?",
        default: "doubleDice",
        scope: 'world',
        type: String,
        choices: {
            "doubleDamage": "Double the damage value",
            "doubleDice": "Roll the dice twice",
            "weaponValue": "Defer to the weapon's crit damage"
          },
        config: true,
        onChange: value => { // A callback function which triggers when the setting is changed
            console.log("Critical hits set to " + value)
          }
    });

    game.settings.register('mosh', 'damageDiceTheme', {
      name: "Damage Dice Theme",
      hint: "If DiceSoNice is installed, what theme should be applied to damage dice?",
      default: "red",
      scope: 'world',
      type: String,
      config: true,
      onChange: value => { // A callback function which triggers when the setting is changed
          console.log("Damage dice theme set to " + value)
        }
  });

  game.settings.register('mosh', 'hideWeight', {
      name: "Hide Weight",
      hint: "Hide weight in the items list for players and ships?",
      default: false,
      scope: 'world',
      type: Boolean,
      config: true,
      onChange: value => { // A callback function which triggers when the setting is changed
          console.log("hideWeight set to " + value)
        }
  });
  
  game.settings.register('mosh', 'useCalm', {
      name: "Use Calm?",
      hint: "Uses the traaa.sh Calm system instead of Stress.",
      default: false,
      scope: 'world',
      type: Boolean,
      config: true,
      onChange: value => { // A callback function which triggers when the setting is changed
          console.log("useCalm set to " + value)
        }
  });
};
