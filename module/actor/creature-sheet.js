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
            classes: ["mothership", "sheet", "actor", "creature"],
            template: "systems/mothership/templates/actor/creature-sheet.html",
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
        const canConfigure = game.user.isGM || this.actor.owner;
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
        if (this.actor.data.type == 'creature') {
            this._prepareCreatureItems(data);
        }

        return data;
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareCreatureItems(sheetData) {
        const actorData = sheetData.actor;

        // Initialize containers.
        const abilities = [];
        const weapons = [];

        // Iterate through items, allocating to containers
        // let totalWeight = 0;
        for (let i of sheetData.items) {
            let item = i.data;
            i.img = i.img || DEFAULT_TOKEN;

            if (i.type === 'ability') {
                abilities.push(i);
            } else if (i.type === 'weapon') {
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
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
        });

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });


        // Rollable Attributes
        html.find('.stat-roll').click(ev => {
            const div = $(ev.currentTarget);
            const statName = div.data("key");
            const attribute = this.actor.data.data.stats[statName];
            this.actor.rollStat(attribute);
        });

        //Weapons
        // Add Inventory Item
        html.find('.weapon-create').click(this._onItemCreate.bind(this));



        // Update Inventory Item
        html.find('.weapon-edit').click(ev => {
            const liWeapon = $(ev.currentTarget).parents(".item");
            const weapon = this.actor.getOwnedItem(liWeapon.data("itemId"));
            weapon.sheet.render(true);
        });

        // Rollable Weapon
        html.find('.weapon-roll').click(ev => {
            const li = ev.currentTarget.closest(".item");
            this.actor.rollWeapon(li.dataset.itemId, {
                event: ev
            });
        });


        html.on('mousedown', '.weapon-ammo', ev => {
            const li = ev.currentTarget.closest(".item");
            const item = duplicate(this.actor.getEmbeddedEntity("OwnedItem", li.dataset.itemId))
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

            this.actor.updateEmbeddedEntity('OwnedItem', item);
        });

        //Reload Shots
        html.on('mousedown', '.weapon-reload', ev => {
            const li = ev.currentTarget.closest(".item");
            const item = duplicate(this.actor.getEmbeddedEntity("OwnedItem", li.dataset.itemId))

            if (event.button == 0) {
                if (!item.data.useAmmo) {
                    item.data.curShots = item.data.shots;
                } else {
                    item.data.ammo += item.data.curShots;
                    let reloadAmount = Math.min(item.data.ammo, item.data.shots);
                    item.data.curShots = reloadAmount;

                    item.data.ammo -= reloadAmount;
                }
            }

            this.actor.updateEmbeddedEntity('OwnedItem', item);
            // let actor = this.actor;
            // let speaker = ChatMessage.getSpeaker({ actor });
            // ChatMessage.create({
            //     speaker,
            //     content: `Reloading ` + item.name + "...",
            //     type: CHAT_MESSAGE_TYPES.EMOTE
            // },
            //     { chatBubble: true });
        });

        // Rollable Item/Anything with a description that we want to click on.
        html.find('.description-roll').click(ev => {
            const li = ev.currentTarget.closest(".item");
            this.actor.printDescription(li.dataset.itemId, {
                event: ev
            });
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
            let roll = new Roll(dataset.roll, this.actor.data.data);
            let label = dataset.label ? `Rolling ${dataset.label} to score under ${dataset.target}` : '';
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label
            });
        }
    }

}
