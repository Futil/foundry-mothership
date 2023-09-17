/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import {
    DLCreatureSettings
} from "../settings/creature-settings.js";

export class MothershipCreatureSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["mosh", "sheet", "actor", "creature"],
            template: "systems/mosh/templates/actor/creature-sheet.html",
            width: 700,
            height: 650,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "character" }]
        });
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
                label: 'Creature Settings',
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
        const updateData = expandObject(formData);

        await actor.update(updateData, {
            diff: false
        });
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData();
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
      
        return data.data;
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
                if(item.ranges.value == "" && item.ranges.medium > 0){
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
            this.actor.deleteEmbeddedDocuments("Item",[li.data("itemId")]);
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
            this.actor.rollCheck(null,'low',statName,null,null);
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
            this.actor.rollWeapon(li.dataset.itemId, {
                event: ev
            });
        });

        //increase ammo
        html.on('mousedown', '.weapon-ammo', ev => {
            //dupe item to work on
            const li = ev.currentTarget.closest(".item");
            const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))
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
