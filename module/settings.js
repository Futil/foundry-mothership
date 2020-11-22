export const registerSettings = function () {
    game.settings.register('mothership', 'useCalm', {
        name: "Use Calm?",
        hint: "Uses the traaa.sh Calm system instead of Stress.",
        default: false,
        scope: 'world',
        type: Boolean,
        config: true
    });
    game.settings.register('mothership', 'hideWeight', {
        name: "Hide Weight",
        hint: "Hide weight in the items list for players and ships?",
        default: false,
        scope: 'world',
        type: Boolean,
        config: true
    });
};
