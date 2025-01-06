import { fromIdUuid } from "../mosh.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import { DLShipDeckplan } from "../windows/ship-deckplan.js";
import { DLShipMacros } from "../windows/ship-macros.js";
import { DLShipMegaDamage } from "../windows/ship-megadamage.js";
import { DLShipSetup } from "../windows/ship-setup.js";

export class MothershipShipSheetSBT extends ActorSheet {

    /** @override */
    static get defaultOptions() {

        var options = {
            classes: ["mosh", "sheet", "actor", "ship"],
            template: "systems/mosh/templates/actor/ship-sheet-sbt.html",
            width: 700,
            height: 840,
            tabs: [{ navSelector: "#sheet-tabs", contentSelector: "#sheet-body", initial: "character" },
            { navSelector: "#side-tabs", contentSelector: "#side-body", initial: "close" }],
            //    { navSelector: "#side-tabs", contentSelector: "#side-body", initial: "crew" }],
            scrollY: [".sheet-body", "scroll-lock"]
        }

        return foundry.utils.mergeObject(super.defaultOptions, options);


    }

    _onOpenDeckplan(event) {
        event.preventDefault();
        new DLShipDeckplan(this.actor, {
            top: this.position.top + 40,
            left: this.position.left + (this.position.width - 400) / 2
        }).render(true);
    }

    _onOpenMacros(event) {
        event.preventDefault();
        new DLShipMacros(this.actor, {
            top: this.position.top + 40,
            left: this.position.left + (this.position.width - 400) / 2
        }).render(true);
    }

    _onOpenSetup(event) {
        event.preventDefault();
        new DLShipSetup(this.actor, {
            top: this.position.top + 40,
            left: this.position.left + (this.position.width - 400) / 2
        }).render(true);
    }

    _onOpenMegadamage(event) {
        event.preventDefault();
        new DLShipMegaDamage(this.actor, {
            top: this.position.top + 40,
            left: this.position.left + (this.position.width - 400) / 2
        }).render(true);
    }

    /* -------------------------------------------- */

    /** @override */
    async getData() {
        const data = super.getData();

        data.dtypes = ["String", "Number", "Boolean"];

        // console.log(this.actor.getRollTableData('AqGWwoWXzijFs427'));

        // for (let attr of Object.values(data.data.system.attributes)) {
        //     attr.isCheckbox = attr.dtype === "Boolean";
        // }

        const superData = data.data.system;

        superData.page = {}; //Prep the page object, for any html specific stuff we want to do.
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
        

        //Run Setup
        // if(data.data.system.runSetup){
        //     this.render(true, {focus:false});
        //     var setupMenu = new DLShipSetup(this.actor, {popOut: true, minimizable : false});
        //     setupMenu.render(true, {focus: true});
        //     console.log(setupMenu);
        //     this.close();

        //     data.data.system.runSetup = false;
        // }

        this._prepareMegadamage(superData);

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
        const crew = [];
        const weapons = [];
        const cargo = [];
        const modules = [];

        const minorRepairs = []; //We are seperating these to make sure they are always ordered by severity.
        const majorRepairs = [];


        // Iterate through items, allocating to containers
        // let totalWeight = 0;
        for (let i of sheetData.items) {
            let item = i.system;
            i.img = i.img || DEFAULT_TOKEN;

            if (i.type === 'crew') {
                crew.push(i);
            } else if (i.type === 'weapon') {
                weapons.push(i);
            } else if (i.type === 'item') {
                cargo.push(i);
            } else if (i.type === 'module') {
                modules.push(i);
            } else if (i.type == 'repair') {
                i.name = i.name.split('.')[0];

                if (i.system.major) {
                    majorRepairs.push(i);
                }
                else {
                    minorRepairs.push(i);
                }
            }
        }

        // Assign and return
        actorData.crew = crew;
        actorData.weapons = weapons;
        actorData.cargo = cargo;
        actorData.modules = modules;
        actorData.minorRepairs = minorRepairs;
        actorData.majorRepairs = majorRepairs;

    }

    async _prepareMegadamage(sheetData) {
        const actorData = sheetData;
        //A script to return the data from a table.
        let tableId = game.settings.get('mosh', 'table1eMegadamageEffects');
        //get table data
        let tableData = await fromIdUuid(tableId,{type:"RollTable"});

        let megadamageHTML = "";

        let entries = Array.from(tableData.results.entries());
        //Prep Megadamage List
        // if(actorData.system.megadamage.hits.length > 0){
        let index = 0;
        for (const entry of entries) {

            // Megadamage - Only Active
            if (index != 0 && actorData.megadamage.hits.includes(index)) {
                // megadamageHTML += `<i class="fa-solid fa-wrench megadamage-button rollable" data-key="${index}"></i> &nbsp`;
                megadamageHTML += `<i class="fas fa-circle megadamage-button rollable" data-key="${index}"></i> &nbsp`;
                megadamageHTML += `<b>${index} |</b> ${entry[1].text} <br/> <br/>`;
            } else if (index != 0) {
                // megadamageHTML += `<i class="fa-solid fa-wrench megadamage-button rollable" data-key="${index}"></i> &nbsp`;
                megadamageHTML += `<div class="grey"><i class="far fa-circle megadamage-button rollable grey" data-key="${index}"></i> &nbsp`;
                megadamageHTML += `<b>${index} |</b> ${entry[1].text} <br/> <br/></div>`;
            }
            index++;
        }
        // } else {

        // megadamageHTML += entries[0][1].text + "<br/> <br/>";
        // }

        await this.object.update({
            "system.megadamage.html": megadamageHTML
        });

        if (actorData.page == undefined) {
            actorData.page = {};
        }

        actorData.page.megadamageMenuClass = "";

        // if(actorData.system.megadamage.open){
        //     actorData.system.page.megadamageMenuClass = "sbt-megadamage-open"
        // } else {
        //     actorData.system.page.megadamageMenuClass = "sbt-megadamage-closed"
        // }


        // await this.object.update({
        //     "data.megadamage.hits": []
        // });
    }


    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;


        html.on('mousedown', '.megadamage-button', ev => {
            const data = this.object;

            const div = $(ev.currentTarget);
            const targetKey = div.data("key");

            if (data.system.megadamage.hits.includes(targetKey)) {
                const index = data.system.megadamage.hits.indexOf(targetKey);
                data.system.megadamage.hits.splice(index, 1);
            } else {
                data.system.megadamage.hits.push(targetKey);
            }

            this.object.update({
                "system.megadamage.hits": data.system.megadamage.hits
            });

            this._prepareMegadamage(data.system);
        });

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
            //const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))
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

        // Rollable Weapon - not needed since individual ship weapons are not fired
        html.find('.weapon-roll').click(ev => {
            // const li = ev.currentTarget.closest(".item");
            // const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            // this.actor.rollCheck(null,'low','combat',null,null,item);

            const li = ev.currentTarget.closest(".item");
            this.actor.printDescription(li.dataset.itemId, {
                event: ev
            });
        });

        // Distress Signal
        html.find('.distress-button').click(ev => {
            //roll distress signal
            this.actor.distressSignal();
        });

        // Maintenance Check
        html.find('.maintenance-button').click(ev => {
            //roll maintenance check
            this.actor.maintenanceCheck();
        });

        // Bankruptcy Save
        html.find('.bankruptcy-button').click(ev => {
            //roll bankruptcy save
            this.actor.bankruptcySave();
        });

        // Morale Check
        html.find('.morale-button').click(ev => {
            //roll morale check
            this.actor.moraleCheck();
        });

        // Deckplan Button
        html.find('.deckplan-button').click(ev => this._onOpenDeckplan(ev));

        //Macro Menu Button
        html.find('.macro-menu-button').click(ev => this._onOpenMacros(ev));

        //Testing Setup Menu Button
        html.find('.setup-menu-button').click(ev => this._onOpenSetup(ev));

        //Megadamage Menu Button
        html.find('.megadamage-menu-button').click(ev => this._onOpenMegadamage(ev));

        //Megadamage Menu Button
        // html.find('.megadamage-sidebar-button').click(ev => {
        //     const data = this.object;

        //     let sidebarClasses = ""

        //     if(data.system.megadamage.open){
        //         sidebarClasses = "sbt-megadamage-open"
        //     } else {
        //         sidebarClasses = "sbt-megadamage-closed"
        //     }

        //     this.object.update({
        //         "data.megadamage.open": !data.system.megadamage.open,
        //         "data.sidebar.megadamageClasses" : sidebarClasses
        //     });
        // });


        html.on('mousedown', '.weapon-ammo', ev => {
            const li = ev.currentTarget.closest(".item");
            var item;
            if (game.release.generation >= 12) {
                item = foundry.utils.duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            } else {
                item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId));
            }
            //const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))
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

        const subtype = header.dataset.subtype;


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
            data: data,
            system: {}
        };

        if (type == "repair") {
            itemData.system.major = (header.dataset.subtype == "major");
        }

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

        if (dataset.roll) {
            let roll = new Roll(dataset.roll, this.actor.data.system);
            let label = dataset.label ? `Rolling ${dataset.label} to score under ${dataset.target}` : '';
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label
            });
        }
    }

}
