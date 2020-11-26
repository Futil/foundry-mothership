export const registerSettings = function () {
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
};
