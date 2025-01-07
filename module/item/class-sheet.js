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
  async getData() {
    const data = await super.getData();
    if (typeof data.system.base_adjustment.skills_granted == 'undefined'){
      data.system.base_adjustment.skills_granted=[];
    }
    data.system.base_adjustment.skills_granted_object = [];
    for (const skill of data.system.base_adjustment.skills_granted){ 
      if(Array.isArray(skill)){
        let option_skills = [];
        for (const option of skill){
          option_skills.push(await fromUuid(option));
        }
        data.system.base_adjustment.skills_granted_object.push(option_skills);
      }else{
        data.system.base_adjustment.skills_granted_object.push(await fromUuid(skill));
      }
    };

    
    data.system.common_skills_object = [];
    for (const skill of data.system.common_skills){ 
      data.system.common_skills_object.push(await fromUuid(skill));
    };

    if (typeof data.system.selected_adjustment.choose_stat.stats == 'undefined'){
      data.system.selected_adjustment.choose_stat.stats=[];
    }

    data.enriched=[];
    data.enriched.description = await TextEditor.enrichHTML(data.system.description, {async: true});

    return data;
  }

  async _onDrop(event){
    await super._onDrop(event);
    const droppedUuid = TextEditor.getDragEventData(event);
    if (droppedUuid.type != "Item"){
       return;
    }
    console.log(event);
    console.log(event.currentTarget);
    console.log(event.target);
    console.log(event.target.parentNode);
    const droppedObject = await fromUuid(droppedUuid.uuid);
    if (droppedObject.type == "skill"){
      //todo: add a check if the skill already exist in the list and dont add it, (by id or by name?)
      if(event.currentTarget.id == "skills.fixed"){
        let parent_fixed_or = event.target.closest('div[id="skills.fixed.or"]');

        if(parent_fixed_or){
          let array_index = parent_fixed_or.getAttribute("index");
          let skills = this.object.system.base_adjustment.skills_granted;
          skills[array_index].push(droppedObject.uuid);
          this.object.update({"system.base_adjustment.skills_granted":skills});
          return this.render(false);

        }else{
          let skills = this.object.system.base_adjustment.skills_granted;
          skills.push(droppedObject.uuid);
          this.object.update({"system.base_adjustment.skills_granted":skills});
          return this.render(false);
        }
      }
      else if(event.currentTarget.id =="skills.common"){
        let skills = this.object.system.common_skills;
        skills.push(droppedObject.uuid);
        this.object.update({"system.common_skills":skills});
        return this.render(false);
      }
    }
  }


  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Delete skills-granted
    html.find('.skills-granted-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      
      let skills = this.object.system.base_adjustment.skills_granted.filter(function( obj ) {
        
      if(Array.isArray(obj)){
        let found = false;
        for (const option of obj){
            if (option === li.data("itemId")){
                found = true;
            }
        }
          return !found;
      }else{
          return obj !== li.data("itemId");
      }
      });
      this.object.update({"system.base_adjustment.skills_granted":skills});
      return this.render(false);
    });
    
    // Delete skills-common
    html.find('.skills-common-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      
      let skills = this.object.system.common_skills.filter(function( obj ) {
          return obj !== li.data("itemId");
      });
      this.object.update({"system.common_skills":skills});
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
    html.find('div[id="skill-create-or-option"]').click(ev => {
        let skills = this.object.system.base_adjustment.skills_granted;
        //add new empty or option
        skills.push([]);
        this.object.update({"system.base_adjustment.skills_granted":skills});
        return this.render(false);
      });

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
        DialogContent+=`<option value='intellect'>${game.i18n.localize("Mosh.Intellect")}</option>`
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

