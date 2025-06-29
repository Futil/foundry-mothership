//init vars
let macroTarget = game.settings.get('mosh','macroTarget');
//warn user if character is not selected
if ((macroTarget === 'character' && !game.user.character) || (macroTarget === 'token' && !canvas.tokens.controlled.length)) {
  //warn player
  game.mosh.noCharSelected();
//else pop up the dialog
} else {
  new foundry.applications.api.DialogV2({
    window: {title: `Rest Save`},
    position: {width: 600,height: 237},
    content: `
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
    <div class="macro_img"><img src="systems/mosh/images/icons/ui/macros/rest_save.png" style="border:none"/></div>
    <div class="macro_desc"><h3>Rest Save</h3>You can relieve Stress by resting in a relatively safe place. If you succeed, reduce your Stress; <strong>if you fail, you gain 1 Stress instead.</strong> Players can gain Advantage on their Rest Save by participating in consensual sex, recreational drug use, a night of heavy drinking, prayer, or any other suitable leisure activity. Unsafe locations may incur Disadvantage.</div>
    </div>
    </div>
    `,
    buttons: [
     {
        label: `Next`,
        action: 'button_next',
        callback: () => game.mosh.initRollCheck(null,'low','restSave',null,null,null),
        icon: `<i class="fas fa-chevron-circle-right"></i>`
      }
    ]
  }).render({force: true});
}