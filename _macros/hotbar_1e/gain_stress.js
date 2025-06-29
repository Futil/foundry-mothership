//init vars
let macroTarget = game.settings.get('mosh','macroTarget');
//warn user if character is not selected
if ((macroTarget === 'character' && !game.user.character) || (macroTarget === 'token' && !canvas.tokens.controlled.length)) {
  //warn player
  game.mosh.noCharSelected();
//else pop up the dialog
} else {
  new foundry.applications.api.DialogV2({
    window: {title: `Gain Stress`},
    position: {width: 600,height: 265},
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
      <div class="macro_img"><img src="systems/mosh/images/icons/ui/macros/gain_stress.png" style="border:none"/></div>
      <div class="macro_desc"><h3>Gain Stress</h3><strong>You gain 1 Stress every time you fail a Stat Check or Save.</strong> Occasionally, certain locations or entities can automatically give you Stress from interacting with or witnessing them. Your <strong>Minimum Stress</strong> starts at 2, and the <strong>Maximum Stress you can have is 20.</strong> Any Stress you take over 20 instead reduces the most relevant Stat or Save by that amount.</div>    
    </div>
    </div>
    
    <h4>Select your modification:</h4>
    `,
    buttons: [
      {
      label: `Gain 1 Stress`,
      action: 'button_1',
      callback: () => game.mosh.initModifyActor('system.other.stress.value',1,null,true),
      icon: `<i class="fas fa-angle-up"></i>`
      },
      {
      label: `Gain 2 Stress`,
      action: 'button_2',
      callback: () => game.mosh.initModifyActor('system.other.stress.value',2,null,true),
      icon: `<i class="fas fa-angle-double-up"></i>`
      },
      {
      label: `Gain 1d5 Stress`,
      action: 'button_3',
      callback: () => game.mosh.initModifyActor('system.other.stress.value',null,`1d5`,true),
      icon: `<i class="fas fa-arrow-circle-up"></i>`
      }
    ]
  }).render({force: true});
}