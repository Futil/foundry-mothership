/**
 * Extend the basic MothershipItemSheet with class modification
 * @extends {MothershipItemSheet}
 */
import { MothershipItemSheet } from "./item-sheet.js";
export class MothershipClassSheet extends MothershipItemSheet {

  /** @override */
  static get defaultOptions() {
    var options = {
      classes: ["mosh", "sheet", "item"],
      width: 820,
      height: 820,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    };
    options.dragDrop = [{dragSelector: null, dropSelector: ".dropitem"}];

    if (game.release.generation >= 12) {
      return foundry.utils.mergeObject(super.defaultOptions, options);
    } else {
      return mergeObject(super.defaultOptions, options);
    }
  }


  /** @override */
  getData() {
    const data = super.getData();
    if (typeof data.system.base_adjustment.skills_granted == 'undefined'){
      data.system.base_adjustment.skills_granted=[];
    }
    if (typeof data.system.selected_adjustment.choose_stat.stats == 'undefined'){
      data.system.selected_adjustment.choose_stat.stats=[];
    }
    return data;
  }

  async _onDrop(event){
    await super._onDrop(event);
    const droppedUuid = TextEditor.getDragEventData(event);
    if (droppedUuid.type != "Item"){
       return;
    }           
    const droppedObject = await fromUuid(droppedUuid.uuid);
    if (droppedObject.type == "skill"){
      //this.object.system.base_adjustment.skills_granted.push(droppedObject);
      let skills = this.object.system.base_adjustment.skills_granted;
      skills.push(droppedObject);
      this.object.update({"system.base_adjustment.skills_granted":skills});
      return this.render(false);
    }
  }


  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Delete Inventory Item
    html.find('.skill-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      
      let skills = this.object.system.base_adjustment.skills_granted.filter(function( obj ) {
          return obj._id !== li.data("itemId");
      });
      this.object.update({"system.base_adjustment.skills_granted":skills});
      return this.render(false);
    });

    html.find('.stat-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      
      let stats = this.object.system.selected_adjustment.choose_stat.stats.filter(function( obj ) {
          return obj !== li.data("itemId");
      });
      this.object.update({"system.selected_adjustment.choose_stat.stats":stats});
      return this.render(false);
    });

    html.find('.stat-create').click(this._onStatCreate.bind(this));

  }


    /**
   * Handle creating a new stat for the class selected adjustment
   * @param {Event} event   The originating click event
   * @private
   */
    _onStatCreate(event) {
      event.preventDefault();
      let stats = this.object.system.selected_adjustment.choose_stat.stats;

      let DialogContent = `<h2>Stat</h2>\
                  <select style='margin-bottom:10px;'name='system.selected_adjustment.choose_stat.stats' id='system.selected_adjustment.choose_stat.stats'>`
      
      if ( ! stats.includes("strength")){
        DialogContent+=`<option value='strength'>${game.i18n.localize("Mosh.Strength")}</option>`
      }
      if ( ! stats.includes("speed")){
        DialogContent+=`<option value='speed'>${game.i18n.localize("Mosh.Speed")}</option>`
      }
      if ( ! stats.includes("intellect")){
        DialogContent+=`<option value='intellect'>${game.i18n.localize("Mosh.Intelect")}</option>`
      }
      if ( ! stats.includes("combat")){
        DialogContent+=`<option value='combat'>${game.i18n.localize("Mosh.Combat")}</option>`
      }
      if ( ! stats.includes("sanity")){
        DialogContent+=`<option value='sanity'>${game.i18n.localize("Mosh.Sanity")}</option>`
      }
      if ( ! stats.includes("fear")){
        DialogContent+=`<option value='fear'>${game.i18n.localize("Mosh.Fear")}</option>`
      }
      if ( ! stats.includes("body")){
        DialogContent+=`<option value='body'>${game.i18n.localize("Mosh.Body")}</option>`
      }        
      DialogContent+=`</select> <br/>`

      let d = new Dialog({
        title: "Select Stat",
        content: DialogContent,
        buttons: {
          roll: {
            icon: '<i class="fas fa-check"></i>',
            label: "Create",
            callback: (html) => {
  
            let statname = html.find('[id=\"system.selected_adjustment.choose_stat.stats\"]')[0].value

            stats.push(statname);
            this.object.update({"system.selected_adjustment.choose_stat.stats":stats});

            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => { }
          }
        },
        default: "roll",
        close: () => { }
      });
      d.render(true);
  
      // Finally, create the item!
      return;
    }
  /****
  async _updateObject(event, formData) {
    const item = this.object;

    var updateData;
    if (game.release.generation >= 12) {
      updateData = foundry.utils.expandObject(formData);
    } else {
      updateData = expandObject(formData);
    }

    await item.update(updateData, {
      diff: false
    });
  }*/
}

