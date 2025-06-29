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

    //Create placeholder for the skills object, to get the info of the skill
    data.system.base_adjustment.skills_granted_object = [];
    for (const skill of data.system.base_adjustment.skills_granted){ 
        data.system.base_adjustment.skills_granted_object.push(await fromUuid(skill));
    };

    console.log(data.system.selected_adjustment.choose_skill_or);
    let choose_skill_or = data.system.selected_adjustment.choose_skill_or;
    for (const [ig, group] of choose_skill_or.entries()){
      for (const [io, option] of group.entries()){
        let names = [];
        data.system.selected_adjustment.choose_skill_or[ig][io].from_list_names = [];
        for(const [is,  skill] of option.from_list.entries()){
          names.push((await fromUuid(skill)).name);
        }
        data.system.selected_adjustment.choose_skill_or[ig][io].from_list_names = names;
      }
      console.log(data.system.selected_adjustment.choose_skill_or);
    }

    data.system.common_skills_object = [];
    for (const skill of data.system.common_skills){ 
      data.system.common_skills_object.push(await fromUuid(skill));
    };

    /*
    if (typeof data.system.selected_adjustment.choose_stat.stats == 'undefined'){
      data.system.selected_adjustment.choose_stat.stats=[];
    }*/

    data.enriched=[];
    data.enriched.description = await foundry.applications.ux.TextEditor.implementation.enrichHTML(data.system.description, {async: true});

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
      console.log(event.currentTarget.id);
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
      else if(event.currentTarget.id =="choose_skill_or_li"){
        const li = $(event.currentTarget);
        let index = li.data("itemId");
        const parent = $(event.currentTarget).parents(".items-list");
        let parent_index = parent.data("itemId");

        let options = this.object.system.selected_adjustment.choose_skill_or;
        
        options[parent_index][index].from_list.push(droppedObject.uuid);

        this.object.update({"system.selected_adjustment.choose_skill_or":options});
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
          return obj !== li.data("itemId");
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

    html.find('.stat-option-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      
      let stats = this.object.system.selected_adjustment.choose_stat;
      stats.splice(li.data("itemId"),1);

      this.object.update({"system.selected_adjustment.choose_stat":stats});
      return this.render(false);
    });


    html.find('.stat-option-add').click(this._onStatCreate.bind(this));


    html.find('.skills-group-add').click(ev => {
      let skills = this.object.system.selected_adjustment.choose_skill_or;
      let new_group = []
      skills.push(new_group);
      this.object.update({"system.selected_adjustment.choose_skill_or":skills});
      return this.render(false);
    });
    html.find('.skills-group-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".items-list");
    
      let options = this.object.system.selected_adjustment.choose_skill_or;
      options.splice(li.data("itemId"),1);

      this.object.update({"system.selected_adjustment.choose_skill_or":options});
      return this.render(false);
    });

    html.find('.skills-group-option-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const liparent = li.parents(".items-list");
    
      let options = this.object.system.selected_adjustment.choose_skill_or;
      options[liparent.data("itemId")].splice(li.data("itemId"),1);

      this.object.update({"system.selected_adjustment.choose_skill_or":options});
      return this.render(false);
    });

    html.find('.skills-group-option-createnew').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const index = li[0].attributes["data-item-id"].value;
	  
      let new_data = {
        "name":li.find('input[name="choose_skill_or_name"]')[index].value,
        "trained": li.find('input[name="choose_skill_or_trained"]')[index].value,
        "expert": li.find('input[name="choose_skill_or_expert"]')[index].value,
        "expert_full_set": li.find('input[name="choose_skill_or_expert_full_set"]')[index].value,
        "master": li.find('input[name="choose_skill_or_master"]')[index].value,
        "master_full_set": li.find('input[name="choose_skill_or_master_full_set"]')[index].value,
        "from_list": [],
      }
      if(new_data.name ==""){
        new_data.name = `Option: ${(this.object.system.selected_adjustment.choose_skill_or[li.data("itemId")].length)+1}`
      }
      if(new_data.trained ==""){
        new_data.trained = 0;
      }
      if(new_data.expert ==""){
        new_data.expert = 0;
      }
      if(new_data.expert_full_set ==""){
        new_data.expert_full_set = 0;
      }
      if(new_data.master ==""){
        new_data.master = 0;
      }
      if(new_data.master_full_set ==""){
        new_data.master_full_set = 0;
      }
      //console.log(new_data);
      let options = this.object.system.selected_adjustment.choose_skill_or;
      options[li.data("itemId")].push(new_data);

      //save data
      this.object.update({"system.selected_adjustment.choose_skill_or":options});

      //clear form and hide it
      li.find('input[name="choose_skill_or_name"]')[index].value = "";
      li.find('input[name="choose_skill_or_trained"]')[index].value = "";
      li.find('input[name="choose_skill_or_expert"]')[index].value = "";
      li.find('input[name="choose_skill_or_expert_full_set"]')[index].value = "";
      li.find('input[name="choose_skill_or_master"]')[index].value = "";
      li.find('input[name="choose_skill_or_master_full_set"]')[index].value = "";

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
      let choose_stat = this.object.system.selected_adjustment.choose_stat;

      let DialogContent = `
        <h2>${game.i18n.localize("Mosh.CharacterGenerator.StatOption")}</h2>\
        <div> <input type="number" id='modification' placeholder="${game.i18n.localize("Mosh.Value")}" /></label></div>\
        <div> <input type="checkbox" id='strength' />${game.i18n.localize("Mosh.Strength")}</label></div>\
        <div> <input type="checkbox" id='speed' />${game.i18n.localize("Mosh.Speed")}</label></div>\
        <div> <input type="checkbox" id='intellect' />${game.i18n.localize("Mosh.Intellect")}</label></div>\
        <div> <input type="checkbox" id='combat' />${game.i18n.localize("Mosh.Combat")}</label></div>\
        <div> <input type="checkbox" id='sanity' />${game.i18n.localize("Mosh.Sanity")}</label></div>\
        <div> <input type="checkbox" id='fear' />${game.i18n.localize("Mosh.Fear")}</label></div>\
        <div> <input type="checkbox" id='body' />${game.i18n.localize("Mosh.Body")}</label></div>
      `

      let d = new foundry.applications.api.DialogV2({
		    window: {title: `Select Stat`},
        content: DialogContent,
        buttons: [
          {
            icon: '<i class="fas fa-check"></i>',
            action: "create",
            label: "Create",
            callback: (event, button, dialog) => {
              
            let new_stat_option = {
              modification: button.form.querySelector('[id=\"modification\"]').prop("value"),
              stats: [],
            }
            if (button.form.querySelector('[id=\"strength\"]')?.checked){
              new_stat_option.stats.push("strength");
            }
            if (button.form.querySelector('[id=\"speed\"]')?.checked){
              new_stat_option.stats.push("speed");
            }
            if (button.form.querySelector('[id=\"intellect\"]')?.checked){
              new_stat_option.stats.push("intellect");
            }
            if (button.form.querySelector('[id=\"combat\"]')?.checked){
              new_stat_option.stats.push("combat");
            }
            if (button.form.querySelector('[id=\"sanity\"]')?.checked){
              new_stat_option.stats.push("sanity");
            }
            if (button.form.querySelector('[id=\"fear\"]')?.checked){
              new_stat_option.stats.push("fear");
            }
            if (button.form.querySelector('[id=\"body\"]')?.checked){
              new_stat_option.stats.push("body");
            }
            if(new_stat_option.stats.length < 2){
              ui.notifications.error(game.i18n.localize("Mosh.classNewStatOptionEmptyError"));
              return;
            }

            choose_stat.push(new_stat_option);
            this.object.update({"system.selected_adjustment.choose_stat":choose_stat});

            }
          },
          {
            icon: '<i class="fas fa-times"></i>',
            action: "cancel",
            label: "Cancel",
            callback: () => { }
          }
        ],
        default: "create",
        close: () => { }
      });
      d.render({force: true});
  
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

