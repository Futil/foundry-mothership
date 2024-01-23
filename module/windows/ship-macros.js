import { DLShipDeckplan } from "../windows/ship-deckplan.js";


export class DLShipMacros extends BaseSheet {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.id = 'sheet-modifiers';
        options.classes = ["mosh", "sheet", "actor", "ship"];
        options.template = 'systems/mosh/templates/dialogs/ship-macro-dialog.html';
        options.width = 320;
        options.height = 'auto';
        options.resizeable = false;
        return options;
    }
    /* -------------------------------------------- */
    /**
     * Add the Entity name into the window title
     * @type {String}
     */
    get title() {
        return `${this.object.name}: Ship Macros`;
    }
    /* -------------------------------------------- */

    _onOpenDeckplan(event) {
        event.preventDefault();
        new DLShipDeckplan(this.object, {
            top: this.position.top + 40,
            left: this.position.left + (this.position.width - 400) / 2
        }).render(true);
    }

    /**
     * Construct and return the data object used to render the HTML template for this form application.
     * @return {Object}
     */
    getData() {
        const actor = this.object;
        console.log(this);

        return {
            actor
        };
    }
    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Stress - Panic Check
        html.find('.distress-button').click(ev => {
            //roll panic check
            this.object.rollTable('ship-distress',null,null,null,null,null,null);
            //this.object.rollTable('ship-distress',null,null,null,null,'system.stats.battle.value',null);
        });


        // Deckplan Button
        html.find('.deckplan-button').click(ev => this._onOpenDeckplan(ev));

        // Close Button
        html.find('.close-button').click(ev => this.close());
    }

    /**
     * This method is called upon form submission after form data is validated
     * @param event {Event}       The initial triggering submission event
     * @param formData {Object}   The object of validated form data with which to update the object
     * @private
     */
    async _updateObject(event, formData) {

        console.log("Updating Object");

        // await this.object.update({
        //     "data.stats.loyalty.enabled": true
        // });

        await this.object.update({
            "data.stats.bankruptcy.value": formData['actor.system.stats.bankruptcy.value']
        });

        // await this.object.updateEmbeddedEntity("OwnedItem", update);

        this.object.update({
            formData
        });
        console.log(this);

        await this.object.sheet.render(true, {focus: false});
        this.bringToTop();

        
    }
}
