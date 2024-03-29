//init vars
let macroTarget = game.settings.get('mosh','macroTarget');
//warn user if character is not selected
if ((macroTarget === 'character' && !game.user.character) || (macroTarget === 'token' && !canvas.tokens.controlled.length)) {
  //warn player
  game.mosh.noCharSelected();
//else pop up the dialog
} else {
  new Dialog({
      title: `Gain Stress`,
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
        <div class="macro_img"><img src="systems/mosh/images/icons/ui/macros/relieve_stress.png" style="border:none"/></div>
        <div class="macro_desc"><h3>Relieve Stress</h3>Occasionally, certain moments, places, or events can automatically <strong>relieve your stress.</strong> Escaping perilous situations, finding a serene location, or experiencing a touching moment with a loved one can have meaningful impacts on your mood and outlook on life. If your stress is getting close to 20, you should consider making a <strong>Rest Save</strong> - as the effects of a failed <strong>Panic Check</strong> can be devastating.</div>    
      </div>
      </div>
      
      <h4>Select your modification:</h4>
      `,
      buttons: {
        button1: {
        label: `Relieve 1 Stress`,
        callback: () => game.mosh.initModifyActor('system.other.stress.value',-1,null,true),
        icon: `<i class="fas fa-angle-down"></i>`
        },
        button2: {
        label: `Relieve 2 Stress`,
        callback: () => game.mosh.initModifyActor('system.other.stress.value',-2,null,true),
        icon: `<i class="fas fa-angle-double-down"></i>`
        },
        button3: {
        label: `Relieve 1d5 Stress`,
        callback: () => game.mosh.initModifyActor('system.other.stress.value',null,`-1d5`,true),
        icon: `<i class="fas fa-arrow-circle-down"></i>`
        }
      }
  },{width: 600,height: 265}).render(true);
}