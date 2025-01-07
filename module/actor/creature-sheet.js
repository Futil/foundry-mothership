/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import { DLCreatureSettings } from "../settings/creature-settings.js";

export class MothershipCreatureSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        var options = {
            classes: ["mosh", "sheet", "actor", "creature"],
            template: "systems/mosh/templates/actor/creature-sheet.html",
            width: 700,
            height: 650,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "character" }]
        };

        return foundry.utils.mergeObject(super.defaultOptions, options);
    }

    /**
     * Extend and override the sheet header buttons
     * @override
     */
    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        const canConfigure = game.user.isGM || this.actor.isOwner;
        if (this.options.editable && canConfigure) {
            buttons = [{
                label: game.i18n.localize("Mosh.CreatureSettings"),
                class: 'configure-actor',
                icon: 'fas fa-tasks',
                onclick: (ev) => this._onConfigureCreature(ev),
            },].concat(buttons);
        }
        return buttons;
    }
    /* -------------------------------------------- */

    _onConfigureCreature(event) {
        event.preventDefault();
        new DLCreatureSettings(this.actor, {
            top: this.position.top + 40,
            left: this.position.left + (this.position.width - 400) / 2
        }).render(true);
    }

    async _updateObject(event, formData) {
        const actor = this.object;
        var updateData;
        if (game.release.generation >= 12) {
          updateData = foundry.utils.expandObject(formData);
        } else {
          updateData = expandObject(formData);
        }
    

        await actor.update(updateData, {
            diff: false
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const data = await super.getData();
        data.dtypes = ["String", "Number", "Boolean"];
        //   for (let attr of Object.values(data.data.attributes)) {
        //     attr.isCheckbox = attr.dtype === "Boolean";
        //   }

        // Prepare items.
        if (this.actor.type == 'creature') {
            this._prepareCreatureItems(data);
        }

        if (data.data.system.settings == null) {
            data.data.system.settings = {};
        }
        data.data.system.settings.useCalm = game.settings.get("mosh", "useCalm");
        data.data.system.settings.hideWeight = game.settings.get("mosh", "hideWeight");
        data.data.system.settings.firstEdition = game.settings.get("mosh", "firstEdition");
        data.data.system.settings.androidPanic = game.settings.get("mosh", "androidPanic");

        data.data.enriched = [];
        data.data.enriched.description = await TextEditor.enrichHTML(data.data.system.description, {async: true});
        data.data.enriched.biography = await TextEditor.enrichHTML(data.data.system.biography, {async: true});
        return data.data;
    }

    /**
     * Get the remaining wounds of the creature
     * @param {JQuery} html 
     * @returns {int} hits.max - hits.value
     */
    getWoundsLeft(html){
        return html.find(`input[name="system.hits.max"]`).prop('value') - html.find(`input[name="system.hits.value"]`).prop('value'); 
      }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareCreatureItems(sheetData) {
        const actorData = sheetData.data;

        // Initialize containers.
        const abilities = [];
        const weapons = [];

        // Iterate through items, allocating to containers
        // let totalWeight = 0;
        for (let i of sheetData.items) {
            let item = i.system;
            i.img = i.img || DEFAULT_TOKEN;

            if (i.type === 'ability') {
                abilities.push(i);
            } else if (i.type === 'weapon') {
                if (item.ranges.value == "" && item.ranges.medium > 0) {
                    item.ranges.value = item.ranges.short + "/" + item.ranges.medium + "/" + item.ranges.long;
                    item.ranges.medium = 0;
                }

                weapons.push(i);
            }
        }

        // Assign and return
        actorData.abilities = abilities;
        actorData.weapons = weapons;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
            li.slideUp(200, () => this.render(false));
        });

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getEmbeddedDocument("Item", li.data("itemId"));
            item.sheet.render(true);
        });

        // Rollable Attribute
        html.find('.stat-roll').click(ev => {
            const div = $(ev.currentTarget);
            const statName = div.data("key");
            this.actor.rollCheck(null, 'low', statName, null, null, null);
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

        // Rollable Weapon
        html.find('.weapon-roll').click(ev => {
            const li = ev.currentTarget.closest(".item");
            var item;
            if (game.release.generation >= 12) {
                item = foundry.utils.duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            } else {
                item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            }
            if (this.actor.system.swarm && this.actor.system.swarm.enabled){
                //replace the roll damage for swarm actors
                let new_dice_ammount = item.system.damage.match(/([0-9]+)d[0-9]+/i)[1]*this.getWoundsLeft(html);
                item.system.damage = item.system.damage.replace(/([0-9]+)(d[0-9]+)/i,`${new_dice_ammount}$2`);
            }
            this.actor.rollCheck(null, 'low', 'combat', null, null, item);
        });

        // Rollable Damage
        html.find('.dmg-roll').click(ev => {
            const li = ev.currentTarget.closest(".item");
            var item;
            if (game.release.generation >= 12) {
                item = foundry.utils.duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            } else {
                item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            }
            if (this.actor.system.swarm && this.actor.system.swarm.enabled){
                //replace the roll damage for swarm actors
                let new_dice_ammount = item.system.damage.match(/([0-9]+)d[0-9]+/i)[1]*this.getWoundsLeft(html);
                item.system.damage = item.system.damage.replace(/([0-9]+)(d[0-9]+)/i,`${new_dice_ammount}$2`);
            }
            this.actor.rollCheck(null, null, 'damage', null, null, item);
        });

        //increase ammo
        html.on('mousedown', '.weapon-ammo', ev => {
            //dupe item to work on
            const li = ev.currentTarget.closest(".item");
            var item;
            if (game.release.generation >= 12) {
                item = foundry.utils.duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            } else {
                item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            }
            let amount = item.system.ammo;
            //increase ammo
            if (event.button == 0) {
                if (amount >= 0) {
                    item.system.ammo = Number(amount) + 1;
                }
            } else if (event.button == 2) {
                if (amount > 0) {
                    item.system.ammo = Number(amount) - 1;
                }
            }
            //update ammo count
            this.actor.updateEmbeddedDocuments('Item', [item]);
        });

        //increase shots
        html.on('mousedown', '.weapon-shots', ev => {
            const li = ev.currentTarget.closest(".item");
            var item;
            if (game.release.generation >= 12) {
                item = foundry.utils.duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            } else {
                item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            }
            if (event.button == 0) {
                if (item.system.curShots >= 0 && item.system.curShots < item.system.shots && item.system.ammo > 0) {
                    item.system.curShots = Number(item.system.curShots) + 1;
                    item.system.ammo = Number(item.system.ammo) - 1;
                }
            } else if (event.button == 2) {
                if (item.system.curShots > 0) {
                    item.system.curShots = Number(item.system.curShots) - 1;
                    item.system.ammo = Number(item.system.ammo) + 1;
                }
            }
            this.actor.updateEmbeddedDocuments('Item', [item]);
        });

        //Reload Shots
        html.on('mousedown', '.weapon-reload', ev => {
            const li = ev.currentTarget.closest(".item");
            this.actor.reloadWeapon(li.dataset.itemId);
        });

        // Rollable Item/Anything with a description that we want to click on.
        html.find('.description-roll').click(ev => {
            const li = ev.currentTarget.closest(".item");
            this.actor.printDescription(li.dataset.itemId, {
                event: ev
            });
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

        // update swarm combat
        html.find(`input[name="system.swarm.combat.value"]`).change(ev => {
            let new_combat_value =  $(ev.currentTarget).prop('value') * this.getWoundsLeft(html);
            this.actor.update({"system.stats.combat.value":new_combat_value});
        });
        html.find(`input[name="system.hits.max"]`).change(ev => {
            //Max wounds changed -> calculate new combat stat
            if (this.actor.system.swarm &&  this.actor.system.swarm.enabled){
                let new_combat_value =  html.find(`input[name="system.swarm.combat.value"]`).prop('value') * this.getWoundsLeft(html);
                this.actor.update({"system.stats.combat.value":new_combat_value});
            }
        });
        html.find(`input[name="system.hits.value"]`).change(ev => {
            //Current wounds changed -> calculate new combat stat
            if (this.actor.system.swarm && this.actor.system.swarm.enabled){
                let new_combat_value =  html.find(`input[name="system.swarm.combat.value"]`).prop('value') * this.getWoundsLeft(html);
                this.actor.update({"system.stats.combat.value":new_combat_value});
            }
        });

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
        var data;
        if (game.release.generation >= 12) {
            data = foundry.utils.duplicate(header.dataset);
        } else {
            data = duplicate(header.dataset);
        }
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
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
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

        console.log(super.getData());

        if (dataset.roll) {
            let roll = new Roll(dataset.roll, this.actor.system);
            let label = dataset.label ? `Rolling ${dataset.label} to score under ${dataset.target}` : '';
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label
            });
        }
    }

}
