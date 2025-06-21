/**
 * Extend the basic MothershipItemSheet with skill related modifications
 * @extends {MothershipItemSheet}
 */
import { MothershipItemSheet } from "./item-sheet.js";
export class MothershipSkillSheet extends MothershipItemSheet {

  /** @override */
  static get defaultOptions() {
    var options = {
    };
    options.dragDrop = [{dragSelector: null, dropSelector: ".dropitem"}];

    if (game.release.generation >= 12) {
      return foundry.utils.mergeObject(super.defaultOptions, options);
    } else {
      return mergeObject(super.defaultOptions, options);
    }
  }

  /** @override */
  async getData() {
    const data = await super.getData();
    if (typeof data.system.prerequisite_ids == 'undefined'){
      data.system.prerequisite_ids=[];
    }
    data.system.prerequisite_object = [];
    for (const skill of data.system.prerequisite_ids){ 
      data.system.prerequisite_object.push(await fromUuid(skill));
    };


    return data;
  }

  async _onDrop(event){
    await super._onDrop(event);
    const droppedUuid = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    if (droppedUuid.type != "Item"){
       return;
    }
    
    const droppedObject = await fromUuid(droppedUuid.uuid);
    if (droppedObject.type == "skill"){
      //todo: add a check if the skill already exist in the list and dont add it, (by id or by name?)
      if(event.target.id == "skills.prerequisite"){
        let skills = this.object.system.prerequisite_ids;
        skills.push(droppedObject.uuid);
        this.object.update({"system.prerequisite_ids":skills});
        return this.render(false);
      }
    }
  }


  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Delete skills-granted
    html.find('.skills-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      
      let skills = this.object.system.prerequisite_ids.filter(function( obj ) {
        return obj !== li.data("itemId");
      });
      this.object.update({"system.prerequisite_ids":skills});
      return this.render(false);
    });

  }


}

