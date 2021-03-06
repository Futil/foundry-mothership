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
      width: 742,
      height: 800,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "character" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    data.dtypes = ["String", "Number", "Boolean"];
    
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

  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

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

    // Rollable Attributes
    html.find('.stat-roll').click(ev => {
      const div = $(ev.currentTarget);
      const statName = div.data("key");
      const attribute = this.actor.data.data.stats[statName];
      this.actor.rollStat(attribute);
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
    return this.actor.createOwnedItem(itemData);
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

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
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
