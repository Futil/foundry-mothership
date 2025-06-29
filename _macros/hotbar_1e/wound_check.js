//init vars
let macroTarget = game.settings.get('mosh','macroTarget');
//warn user if character is not selected
if ((macroTarget === 'character' && !game.user.character) || (macroTarget === 'token' && !canvas.tokens.controlled.length)) {
  //warn player
  game.mosh.noCharSelected();
//else pop up the dialog
} else {
  //pop up the wound roll dialog box
  new foundry.applications.api.DialogV2({
    window: {title: `Wound Roll`},
    position: {width: 600,height: 650},
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
          <div class="macro_img"><img src="systems/mosh/images/icons/ui/macros/wound_roll.png" style="border:none"/></div>
          <div class="macro_desc"><h3>Wound Roll</h3>Make a <strong>Wound Roll</strong> according to the type of Damage received. <strong>Flesh Wounds</strong> are small inconveniences. <strong>Minor/Major Injuries</strong> cause lasting issues which require medical treatment. <strong>Lethal Injuries</strong> can kill you if not dealt with immediately. <strong>Fatal Injuries</strong> can kill outright. <strong>Bleeding</strong> wounds, if not treated can quickly overwhelm you.</div>    
        </div>
      </div>
      <label for="bf">
        <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
          <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
            <input type="radio" id="bf" name="wound_table" value="31YibfjueXuZdNLb" checked="checked">
            <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/rolltables/wounds_blunt_force.png" style="border:none"/></div>
            <div class="macro_desc" style="display: table;">
              <span style="display: table-cell; vertical-align: middle;">
                <strong>Blunt Force:</strong> Getting punched, hit with a crowbar or a thrown object, falling, etc.
              </span>
            </div>
          </div>
        </div>
      </label>
      <label for="b">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
          <input type="radio" id="b" name="wound_table" value="ata3fRz3uoPfNCLh">
          <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/rolltables/wounds_bleeding.png" style="border:none"/></div>
          <div class="macro_desc" style="display: table;">
            <span style="display: table-cell; vertical-align: middle;">
              <strong>Bleeding:</strong> Getting stabbed or cut.
            </span>
          </div>
        </div>
      </div>
      </label>
      <label for="g">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
          <input type="radio" id="g" name="wound_table" value="XjDU2xFOWEasaZK0">
          <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/rolltables/wounds_gunshot.png" style="border:none"/></div>
          <div class="macro_desc" style="display: table;">
            <span style="display: table-cell; vertical-align: middle;">
              <strong>Gunshot:</strong> Getting shot by a firearm.
            </span>
          </div>
        </div>
      </div>
      </label>
      <label for="fe">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
          <input type="radio" id="fe" name="wound_table" value="lqiaWwh5cGcJhvnu">
          <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/rolltables/wounds_fire_&_explosives.png" style="border:none"/></div>
          <div class="macro_desc" style="display: table;">
            <span style="display: table-cell; vertical-align: middle;">
              <strong>Fire & Explosives:</strong> Grenades, flamethrowers, doused in fuel and lit on fire, etc.
            </span>
          </div>
        </div>
      </div>
      </label>
      <label for="gm">
      <div class ="macro_window" style="margin-bottom : 7px; vertical-align: middle; padding-left: 3px;">
        <div class="grid grid-3col" style="grid-template-columns: 20px 60px auto">
          <input type="radio" id="gm" name="wound_table" value="uVfC1CqYdojaJ7yR">
          <div class="macro_img" style="padding-top: 5px; padding-left: 0px; padding-right: 0px; padding-bottom: 5px;"><img src="systems/mosh/images/icons/ui/rolltables/wounds_gore_&_massive.png" style="border:none"/></div>
          <div class="macro_desc" style="display: table;">
            <span style="display: table-cell; vertical-align: middle;">
              <strong>Gore & Massive:</strong> Giant or gruesome attacks.
            </span>
          </div>
        </div>
      </div>
      </label>
      <h4>Select your roll type:</h4>
    `,
    buttons: [
      {
        label: `Advantage`,
        action: 'action_advantage',
        callback: (event, button, dialog) => game.mosh.initRollTable(button.form.querySelector("input[name='wound_table']:checked").value,`1d10 [+]`,`low`,true,false,null,null),
        icon: `<i class="fas fa-angle-double-up"></i>`
      },
      {
        label: `Normal`,
        action: 'action_normal',
        callback: (event, button, dialog) => game.mosh.initRollTable(button.form.querySelector("input[name='wound_table']:checked").value,`1d10`,`low`,true,false,null,null),
        icon: `<i class="fas fa-minus"></i>`
      },
      {
        label: `Disadvantage`,
        action: 'action_disadvantage',
        callback: (event, button, dialog) => game.mosh.initRollTable(button.form.querySelector("input[name='wound_table']:checked").value,`1d10 [-]`,`low`,true,false,null,null),
        icon: `<i class="fas fa-angle-double-down"></i>`
      }
    ]
  }).render({force: true});
}