//init vars
let macroTarget = game.settings.get('mosh','macroTarget');
//warn user if character is not selected
if ((macroTarget === 'character' && !game.user.character) || (macroTarget === 'token' && !canvas.tokens.controlled.length)) {
  //warn player
  game.mosh.noCharSelected();
//else pop up the dialog
} else {
  //pop up the death save dialog box
  new new foundry.applications.api.DialogV2({
    window: {title: `Death Save`},
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
          <div class="macro_img"><img src="systems/mosh/images/icons/ui/rolltables/death_save.png" style="border:none"/></div>
          <div class="macro_desc"><h3>Death Save</h3><strong>Whenever you reach 0 Health, make a Body Save: Failure means you die.</strong> Success means you fall unconscious, make a <strong>Death Save</strong> to find out when you regain consciousness. Crew members with a medscanner, relevant skills like First Aid or Biology, or scientists and androids who pass an <strong>Intellect Check</strong> can determine your condition.</div>    
        </div>
      </div>
      <h4>Select your roll type:</h4>
    `,
    buttons: [
      {
        label: `Advantage`,
        action: `action_advantage`,
        callback: () => game.mosh.initRollTable(game.settings.get('mosh','table0eDeath'),`1d10 [+]`,`high`,false,false,null,null),
        icon: `<i class="fas fa-angle-double-up"></i>`
      },
      {
        label: `Normal`,
        action: `action_normal`,
        callback: () => game.mosh.initRollTable(game.settings.get('mosh','table0eDeath'),`1d10`,`high`,false,false,null,null),
        icon: `<i class="fas fa-minus"></i>`
      },
      {
        label: `Disadvantage`,
        action: `action_disadvantage`,
        callback: () => game.mosh.initRollTable(game.settings.get('mosh','table0eDeath'),`1d10 [-]`,`high`,false,false,null,null),
        icon: `<i class="fas fa-angle-double-down"></i>`
      }
    ]
  }).render({force: true});
}