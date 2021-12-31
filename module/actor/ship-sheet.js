/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class MothershipShipSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["mosh", "sheet", "actor", "ship"],
            template: "systems/mosh/templates/actor/ship-sheet.html",
            width: 700,
            height: 650,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "character" }]
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
        console.log(data);
        // Prepare items.
        if (this.actor.data.type == 'ship') {
            this._prepareShipItems(data);
        }

        if (data.data.settings == null) {
            data.data.settings = {};
        }

        data.data.settings.useCalm = game.settings.get("mosh", "useCalm");
        data.data.settings.hideWeight = game.settings.get("mosh", "hideWeight");

        let maxHull = data.data.data.supplies.hull.max;

        data.data.data.supplies.hull.percentage = " [ "+Math.round(maxHull * 0.25)+" | "+Math.round(maxHull * 0.5)+" | "+Math.round(maxHull * 0.75)+" ]";

        return data.data;
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareShipItems(sheetData) {
        const actorData = sheetData.data;

        // Initialize containers.
        const abilities = [];
        const weapons = [];
        const cargo = [];
        const modules = [];

        // Iterate through items, allocating to containers
        // let totalWeight = 0;
        for (let i of sheetData.data.items) {
            let item = i.data;
            i.img = i.img || DEFAULT_TOKEN;

            if (i.type === 'ability') {
                abilities.push(i);
            } else if (i.type === 'weapon') {
                weapons.push(i);
            } else if (i.type === 'item') {
                cargo.push(i);
            } else if (i.type === 'module') {
                modules.push(i);
            }
        }

        // Assign and return
        actorData.abilities = abilities;
        actorData.weapons = weapons;
        actorData.cargo = cargo;
        actorData.modules = modules;

    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Create inventory item.
        html.find('.item-create').click(this._onItemCreate.bind(this));
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

            let amount = item.data.quantity;

            if (item.type == "module") {
                item.data.totalHull = amount * item.data.hull;
            }
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

            if (item.type == "module") {
                item.data.totalHull = item.data.quantity * item.data.hull;
            }

            this.actor.updateEmbeddedDocuments('Item', [item]);
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

            this.actor.updateEmbeddedDocuments('Item', [item]);
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
            let roll = new Roll(dataset.roll, this.actor.data.data);
            let label = dataset.label ? `Rolling ${dataset.label} to score under ${dataset.target}` : '';
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label
            });
        }
    }

}
