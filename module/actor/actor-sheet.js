/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class MothershipActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mosh", "sheet", "actor", "character"],
      template: "systems/mosh/templates/actor/actor-sheet.html",
      width: 700,
      height: 800,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "character" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    data.dtypes = ["String", "Number", "Boolean"];

    const superData = data.data.data;

    for (let attr of Object.values(data.data.data.attributes)) {
      attr.isCheckbox = attr.dtype === "Boolean";
    }

    // Prepare items.
    if (this.actor.data.type == 'character') {
      this._prepareCharacterItems(data);
    }


    if (data.data.data.settings == null) {
      data.data.data.settings = {};
    }
    data.data.data.settings.useCalm = game.settings.get("mosh", "useCalm");
    data.data.data.settings.hideWeight = game.settings.get("mosh", "hideWeight");
    data.data.data.settings.firstEdition = game.settings.get("mosh", "firstEdition");


    //SKILL XP BUTTONS
    superData.xp.html = '';
    if(superData.xp.html == ''){
      for(let i = 1; i <= 15; i ++){
        if(i > superData.xp.value){
          if(i % 5){
            superData.xp.html += '<div class="circle"></div>';
          }
          else { //If a special one
            let trainLevel = 'Trained';
            if(i == 10) trainLevel = 'Expert';
            else if(i == 15) trainLevel = 'Master';
            superData.xp.html += '<div class="circle" style="background:rgb(200,200,200);"><div class="skill_training_text" style="position: relative; top: 17px; text-align: center; left: -60px;">'+trainLevel+'</div></div>';
          }
        }
        else{
        if(i % 5){
          superData.xp.html += '<div class="circle-f"></div>';
        }
        else { //If a special one
          let trainLevel = 'Trained';
          if(i == 10) trainLevel = 'Expert';
          else if(i == 15) trainLevel = 'Master';
          superData.xp.html += '<div class="circle-f" style="background:black;"><div class="skill_training_text" style="position: relative; top: 17px; text-align: center; left: -60px; color:black;">'+trainLevel+'</div></div>';
        }

        }
      }
    }
    //END SKILL XP

    return data.data;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.data;
    // Initialize containers.
    const gear = [];
    const skills = [];
    const weapons = [];
    const armors = [];
    const conditions = [];

    let curWeight = 0;
    // Iterate through items, allocating to containers
    // let totalWeight = 0;
    for (let i of sheetData.data.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;

      if (i.type === 'item') {
        gear.push(i);
        curWeight+=item.weight;
      } else if (i.type === 'skill') {
        skills.push(i);
      } else if (i.type === 'armor') {
        armors.push(i);
      } else if (i.type === 'weapon') {
        weapons.push(i);
      } else if (i.type === 'condition') {
        // We'll handle the pip html here.
        if (item.treatment == null) {
          item.treatment = {
            "value": 0,
            "html": ""
          };
        }
        let pipHtml = "";
        for (let i = 0; i < 3; i++) {
          if (i < item.treatment.value){
            pipHtml += '<i class="fas fa-circle"></i>';
          }
          else{
            pipHtml += '<i class="far fa-circle"></i>';
          }
        }

        item.treatment.html = pipHtml;

        conditions.push(i);
      }
    }

    if(actorData.data.weight == undefined){
      actorData.data.weight = {
        "current" : 0,
        "capacity" : 0
      };
    }
    if(actorData.data.credits == undefined){
      actorData.data.credits = {
        "value" : 0,
      };
    }

    actorData.data.weight.capacity = Math.ceil((actorData.data.stats.strength.value/10) + 3);
    actorData.data.weight.current = curWeight;
    //console.log("Current Weight: " + curWeight + " Capacity: " + actorData.data.weight.capacity);

    // Assign and return
    actorData.gear = gear;
    actorData.skills = skills;
    actorData.armors = armors;
    actorData.weapons = weapons;
    actorData.conditions = conditions;

  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html.on('mousedown', '.char-pip-button', ev => {
      const data = super.getData();

      const div = $(ev.currentTarget);
      const targetName = div.data("key");
      const attribute = data.data.data[targetName];

      let amount = attribute.value;
      let max = div.data("max");
      let min = div.data("min");

      if (event.button == 0) {
        if (amount < max) {
          attribute.value = Number(amount) + 1;
        }
      } else if (event.button == 2) {
        if (amount > min) {
          attribute.value = Number(amount) - 1;
        }
      }

      let updated = {
        html: '',
        value: attribute.value
      }

      const updateString = "data."+targetName;

      this.actor.update({[updateString] : updated});
    });

    html.on('mousedown', '.treatment-button', ev => {
      const li = ev.currentTarget.closest(".item");
      const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))

      let amount = item.data.treatment.value;

      if (event.button == 0) {
        if (amount < 3) {
          item.data.treatment.value = Number(amount) + 1;
        }
      } else if (event.button == 2) {
        if (amount > 0) {
          item.data.treatment.value = Number(amount) - 1;
        }
      }

      this.actor.updateEmbeddedDocuments('Item', [item]);
    });


    // Update Inventory Item
    html.find('.item-equip').click(ev => {
      const li = ev.currentTarget.closest(".item");
      const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))

      item.data.equipped = !item.data.equipped;
      this.actor.updateEmbeddedDocuments('Item', [item]);
    });

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getEmbeddedDocument("Item", li.data("itemId"));
      item.sheet.render(true);
    });

    //Quantity adjuster
    html.on('mousedown', '.item-quantity', ev => {
      const li = ev.currentTarget.closest(".item");
      const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))
      let amount = item.data.quantity;

      if (event.button == 0) {
        item.data.quantity = Number(amount) + 1;
      } else if (event.button == 2) {
        item.data.quantity = Number(amount) - 1;
      }

      this.actor.updateEmbeddedDocuments('Item', [item]);
    });


    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteEmbeddedDocuments("Item",[li.data("itemId")]);
      li.slideUp(200, () => this.render(false));
    });

    //SKILLS
    // Add Inventory Item
    html.find('.skill-create').click(this._onSkillCreate.bind(this));

    // Update Inventory Item
    html.find('.skill-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const skill = this.actor.getEmbeddedDocument("Item", li.data("itemId"));
      skill.sheet.render(true);
    });

    //Weapons
    // Add Inventory Item
    html.find('.weapon-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.weapon-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const weapon = this.actor.getEmbeddedDocument("Item", li.data("itemId"));
      weapon.sheet.render(true);
    });


    html.find('.stat-roll').click(ev => {
      const div = $(ev.currentTarget);
      const statName = div.data("key");
      const attribute = this.actor.data.data.stats[statName];
      var shifted = false;
      if (ev.shiftKey) shifted = true;
      this.actor.rollStat(attribute, shifted);
    });

    // Rollable Skill
    html.find('.skill-roll').click(ev => {
      const li = event.currentTarget.closest(".item");
      this.actor.rollSkill(li.dataset.itemId, {
        event: event
      });
    });

    // Rollable Weapon
    html.find('.weapon-roll').click(ev => {
      const li = ev.currentTarget.closest(".item");

      this.actor.rollWeapon(li.dataset.itemId, {
        event: ev
      });
    });

    // Rollable Item/Anything with a description that we want to click on.
    html.find('.description-roll').click(ev => {
      const li = ev.currentTarget.closest(".item");
      this.actor.printDescription(li.dataset.itemId, {
        event: ev
      });
    });

    html.on('mousedown', '.weapon-ammo', ev => {
      const li = ev.currentTarget.closest(".item");
      const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))
      let amount = item.data.ammo;

      if (event.button == 0) {
        if (amount >= 0) {
          item.data.ammo = Number(amount) + 1;
        }
      } else if (event.button == 2) {
        if (amount > 0) {
          item.data.ammo = Number(amount) - 1;
        }
      }

      this.actor.updateEmbeddedDocuments('Item', [item]);
    });

    //Reload Shots
    html.on('mousedown', '.weapon-reload', ev => {
      const li = ev.currentTarget.closest(".item");
      const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))

      if (!item.data.useAmmo) {
        item.data.curShots = item.data.shots;
      } else {
        item.data.ammo += item.data.curShots;
        let reloadAmount = Math.min(item.data.ammo, item.data.shots);
        item.data.curShots = reloadAmount;

        item.data.ammo -= reloadAmount;
      }

      this.actor.updateEmbeddedDocuments('Item', [item]);

      let actor = this.actor;
      let speaker = ChatMessage.getSpeaker({ actor });
      ChatMessage.create({
        speaker,
        content: `Reloading ` + item.name + "..."
      },
        { chatBubble: true });

    });

    // Rollable Item/Anything with a description that we want to click on.
    html.find('.calm-roll').click(ev => {
      const attribute = this.actor.data.data.other.stress;
      attribute.label = "Calm";
      this.actor.rollStress(attribute);
    });
    // Rollable Item/Anything with a description that we want to click on.
    html.find('.stress-roll').click(ev => {
      const attribute = this.actor.data.data.other.stress;
      attribute.label = "Stress";
      this.actor.rollStress(attribute);
    });

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);

      html.find('li.dropitem').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }

  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {

    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];


    // Finally, create the item!
    return this.actor.createEmbeddedDocuments("Item",[itemData]);
  }

  /**
   * Handle creating a new Owned skill for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onSkillCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New Skill`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    let d = new Dialog({
      title: "New Skill",
      content: "<h2> Name </h2>\
                <input type='text' id='name' name='name' value='New Skill'>\
                <h2> Rank </h2> <select style='margin-bottom:10px;'name='rank' id='rank'>\
                <option value='Trained'>Trained</option>\
                <option value='Expert'>Expert</option>\
                <option value='Master'>Master</option></select> <br/>",
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Create",
          callback: (html) => {
            var rank = html.find('[id=\"rank\"]')[0].value;
            if(rank == "Trained")
              itemData.data.bonus = 10;
            if(rank == "Expert")
              itemData.data.bonus = 15;
            if(rank == "Master")
              itemData.data.bonus = 20;

            itemData.data.rank = rank;
            itemData.name = html.find('[id=\"name\"]')[0].value
            this.actor.createEmbeddedDocuments("Item",[itemData]);
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
    return ;
  }


  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `Rolling ${dataset.label} to score under ${dataset.target}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }

  async _updateObject(event, formData) {
    const actor = this.object;
    const updateData = expandObject(formData);

    await actor.update(updateData, {
      diff: false
    });
  }



}
