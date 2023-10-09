//init vars
let macroTarget = game.settings.get('mosh','macroTarget');
//warn user if character is not selected
if ((macroTarget === 'character' && !game.user.character) || (macroTarget === 'token' && !canvas.tokens.controlled.length)) {
  //warn player
  game.mosh.noCharSelected();
//else pop up the dialog
} else {
  new Dialog({
    title: `Stat Check`,
    content: `
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
    
    <div class ="macro_window" style="margin-bottom : 7px;">
      <div class="grid grid-2col" style="grid-template-columns: 150px auto">
        <div class="macro_img"><img src="systems/mosh/images/icons/ui/macros/stat_check.png" style="border:none"/></div>
        <div class="macro_desc"><h3>Stat Check</h3>You have four Stats which represent your ability to act under extreme pressure. Whenever you want to do something and the price for failure is high, roll a stat check. <strong>If you roll less than your Stat you succeed. Otherwise, you fail and gain 1 Stress.</strong> A roll of 90-99 is always a failure. A Critical Failure means something bad happens, and furthermore you must make a Panic Check.</div>    
      </div>
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
    `,
    buttons: {
      button1: {
        label: `Next`,
        callback: (html) => game.mosh.initRollCheck(null,'low',html.find("input[name='stat']:checked").val(),null,null,null),
        icon: `<i class="fas fa-chevron-circle-right"></i>`
      }
    }
  },{width: 600,height: 545}).render(true);
}