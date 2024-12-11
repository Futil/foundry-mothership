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
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      
      let skills = this.object.system.base_adjustment.skills_granted.filter(function( obj ) {
          return obj._id !== li.data("itemId");
      });
      this.object.update({"system.base_adjustment.skills_granted":skills});
      return this.render(false);
    });


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

