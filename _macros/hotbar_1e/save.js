//init vars
let macroTarget = game.settings.get('mosh','macroTarget');
//warn user if character is not selected
if ((macroTarget === 'character' && !game.user.character) || (macroTarget === 'token' && !canvas.tokens.controlled.length)) {
  //warn player
  game.mosh.noCharSelected();
//else pop up the dialog
} else {
  new Dialog({
    title: `Save`,
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
        <div class="macro_img"><img src="systems/mosh/images/icons/ui/macros/save.png" style="border:none"/></div>
        <div class="macro_desc"><h3>Save</h3>You have three Saves which represent your ability to withstand different kinds of trauma. In order to avoid certain dangers, you sometimes need to roll a Save. <strong>If you roll less than your Save you succeed. Otherwise you fail, and gain 1 Stress.</strong> A roll of 90-99 is always a failure. A Critical Failure means something bad happens, and furthermore you must make a Panic Check.</div>    
      </div>
    </div>
    <label for="san">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
          <input type="radio" id="san" name="save" value="sanity" checked="checked">
          <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/attributes/sanity.png" style="border:none"/></div>
          <div class="macro_desc" style="display: table;">
            <span style="display: table-cell; vertical-align: middle;">
              <strong>Sanity:</strong> Rationalize logical inconsistencies in the universe, make sense out of chaos, detect illusions and mimicry, cope with <strong>Stress</strong>.
            </span>
          </div>    
        </div>
      </div>
    </label>
    <label for="fer">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
          <input type="radio" id="fer" name="save" value="fear">
          <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/attributes/fear.png" style="border:none"/></div>
          <div class="macro_desc" style="display: table;">
            <span style="display: table-cell; vertical-align: middle;">
              <strong>Fear:</strong> Maintain a level head while struggling with fear, loneliness, depression, and other emotional surges.
            </span>
          </div>    
        </div>
      </div>
    </label>
    <label for="bod">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
          <input type="radio" id="bod" name="save" value="body">
          <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/attributes/body.png" style="border:none"/></div>
          <div class="macro_desc" style="display: table;">
            <span style="display: table-cell; vertical-align: middle;">
              <strong>Body:</strong> Employ quick reflexes and resist hunger, disease, or organisms that might try and invade your insides.
            </span>
          </div>
        </div>
      </div>
    </label>
    `,
    buttons: {
      button1: {
        label: `Next`,
        callback: (html) => game.mosh.initRollCheck(null,'low',html.find("input[name='save']:checked").val(),null,null,null),
        icon: `<i class="fas fa-chevron-circle-right"></i>`
      }
    }
  },{width: 600,height: 470}).render(true);
}