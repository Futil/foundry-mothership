/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class MothershipShipSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["mosh", "sheet", "actor", "ship"],
            template: "systems/mosh/templates/actor/ship-sheet.html",
            width: 700,
            height: 650,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "character" }]
        });
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const data = super.getData();

        data.dtypes = ["String", "Number", "Boolean"];

        // for (let attr of Object.values(data.data.system.attributes)) {
        //     attr.isCheckbox = attr.dtype === "Boolean";
        // }

        const superData = data.data.system;

        // Prepare items.
        if (this.actor.type == 'ship') {
            this._prepareShipItems(data);
        }

        if (superData.settings == null) {
            superData.settings = {};
        }

        superData.settings.useCalm = game.settings.get("mosh", "useCalm");
        superData.settings.hideWeight = game.settings.get("mosh", "hideWeight");
        superData.settings.firstEdition = game.settings.get("mosh", "firstEdition");
        superData.settings.androidPanic = game.settings.get("mosh", "androidPanic");

        let maxHull = superData.supplies.hull.max;

        superData.supplies.hull.percentage = " [ " + Math.round(maxHull * 0.25) + " | " + Math.round(maxHull * 0.5) + " | " + Math.round(maxHull * 0.75) + " ]";
        
        data.data.enriched = [];
        data.data.enriched.biography = await TextEditor.enrichHTML(data.data.system.biography, {async: true});
        
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
        for (let i of sheetData.items) {
            let item = i.system;
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
            this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
            li.slideUp(200, () => this.render(false));
        });

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getEmbeddedDocument("Item", li.data("itemId"));
            item.sheet.render(true);

            let amount = item.system.quantity;

            if (item.type == "module") {
                item.system.totalHull = amount * item.system.hull;
            }
        });

        //Quantity adjuster
        html.on('mousedown', '.item-quantity', ev => {
            const li = ev.currentTarget.closest(".item");
            var item;
            if (game.release.generation >= 12) {
                item = foundry.utils.duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            } else {
                item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            }
            let amount = item.system.quantity;

            if (event.button == 0) {
                item.system.quantity = Number(amount) + 1;
            } else if (event.button == 2) {
                item.system.quantity = Number(amount) - 1;
            }

            if (item.type == "module") {
                item.system.totalHull = item.system.quantity * item.system.hull;
            }

            this.actor.updateEmbeddedDocuments('Item', [item]);
        });

        // Rollable Attributes
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
            this.actor.rollCheck(null, 'low', 'combat', null, null, item);
        });

        html.on('mousedown', '.weapon-ammo', ev => {
            const li = ev.currentTarget.closest(".item");
            var item;
            if (game.release.generation >= 12) {
                item = foundry.utils.duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            } else {
                item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            }
            let amount = item.system.ammo;

            if (event.button == 0) {
                if (amount >= 0) {
                    item.system.ammo = Number(amount) + 1;
                }
            } else if (event.button == 2) {
                if (amount > 0) {
                    item.system.ammo = Number(amount) - 1;
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
            let roll = new Roll(dataset.roll, this.actor.data.data);
            let label = dataset.label ? `Rolling ${dataset.label} to score under ${dataset.target}` : '';
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label
            });
        }
    }

}
