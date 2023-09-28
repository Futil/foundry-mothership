//tell the actor to run the function
async function prepTableRoll(tableName,rollString,aimFor,zeroBased,checkCrit,rollAgainst,comparison) {
  //determine who to run the macro for
  if (game.settings.get('mosh','macroTarget') === 'character') {
    //roll panic check
    game.user.character.rollTable('panicCheck',rollString,null,null,null,'system.other.stress.value',null);
  } else if (game.settings.get('mosh','macroTarget') === 'token') {
    //run the function for all selected tokens
    canvas.tokens.controlled.foreach(function(token){
      token.actor.rollTable('panicCheck',rollString,null,null,null,'system.other.stress.value',null);
    });
  }
}

//pop up the panic check dialog box
new Dialog({
  title: `Panic Check`,
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
        <div class="macro_img"><img src="systems/mosh/images/icons/ui/rolltables/panic_check.png" style="border:none"/></div>
        <div class="macro_desc"><h3>Panic Check</h3>Stress, Damage, and emotional wear and tear eventually bring characters to their breaking point. When that happens, there’s a chance they Panic. You determine this by making a <strong>Panic Check</strong>. Some results of the Panic Table are so severe that they leave a lasting impression on you. These are called <strong>Conditions</strong>, and they affect you until you are able to treat them.
        </div>    
      </div>
    </div>
    <h4>Select your roll type:</h4>
  `,
  buttons: {
    button1: {
      label: `Advantage`,
      callback: () => prepTableRoll(null,`[+]`,null,false,false,null,null),
      icon: `<i class="fas fa-angle-double-up"></i>`
    },
    button2: {
      label: `Normal`,
      callback: () => prepTableRoll(null,`[]`,null,false,false,null,null),
      icon: `<i class="fas fa-minus"></i>`
    },
    button3: {
      label: `Disadvantage`,
      callback: () => prepTableRoll(null,`[-]`,null,false,false,null,null),
      icon: `<i class="fas fa-angle-double-down"></i>`
    }
  }
},{width: 600,height: 265}).render(true);