export const registerSettings = function () {
    game.settings.register('mosh', 'newArmor', {
        name: "1e Armor System",
        hint: "[COMING SOON] Use the 1st edition Armor system.",
        default: true,
        scope: 'world',
        type: Boolean,
        config: true,
        onChange: value => { // A callback function which triggers when the setting is changed
            console.log("newArmorandCombat set to " + value)
          }
    });
    game.settings.register('mosh', 'newStress', {
        name: "1e Stress System",
        hint: "[COMING SOON] Use the 1st edition stress system with the roll under d20 and stress table.",
        default: true,
        scope: 'world',
        type: Boolean,
        config: true,
        onChange: value => { // A callback function which triggers when the setting is changed
            console.log("newStress set to " + value)
          }
    });
    game.settings.register('mosh', 'newWounds', {
        name: "1e Wound System",
        hint: "[COMING SOON] Instead of the 0e health system, use the 1e wounds and health system.",
        default: true,
        scope: 'world',
        type: Boolean,
        config: true,
        onChange: value => { // A callback function which triggers when the setting is changed
            console.log("newWounds set to " + value)
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
