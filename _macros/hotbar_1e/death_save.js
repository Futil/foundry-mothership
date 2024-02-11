//init vars
let macroTarget = game.settings.get('mosh','macroTarget');
//warn user if character is not selected
if ((macroTarget === 'character' && !game.user.character) || (macroTarget === 'token' && !canvas.tokens.controlled.length)) {
  //warn player
  game.mosh.noCharSelected();
//else pop up the dialog
} else {
  //pop up the death save dialog box
  new Dialog({
    title: `Death Save`,
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
          <div class="macro_desc"><h3>Death Save</h3>Your character is incapacitated when you receive a fatal wound, or once your Current Wounds equal your Maximum Wounds. As soon as someone spends a turn checking your vitals, make a <strong>Death Save</strong> to reveal your fate. If your death seems imminent, make your last moments count: save someone’s life, solve an important mystery, or give the others time to escape.</div>    
        </div>
      </div>
      <h4>Select your roll type:</h4>
    `,
    buttons: {
      button1: {
        label: `Advantage`,
        callback: () => game.mosh.initRollTable(game.settings.get('mosh','table1eDeath'),`1d10 [+]`,`low`,true,false,null,null),
        icon: `<i class="fas fa-angle-double-up"></i>`
      },
      button2: {
        label: `Normal`,
        callback: () => game.mosh.initRollTable(game.settings.get('mosh','table1eDeath'),`1d10`,`low`,true,false,null,null),
        icon: `<i class="fas fa-minus"></i>`
      },
      button3: {
        label: `Disadvantage`,
        callback: () => game.mosh.initRollTable(game.settings.get('mosh','table1eDeath'),`1d10 [-]`,`low`,true,false,null,null),
        icon: `<i class="fas fa-angle-double-down"></i>`
      }
    }
  },{width: 600,height: 265}).render(true);
}