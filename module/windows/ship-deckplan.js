export class DLShipDeckplan extends ActorSheet {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.id = 'sheet-modifiers';
        options.classes = ["mosh", "sheet", "actor", "ship"];
        options.template = 'systems/mosh/templates/dialogs/ship-deckplan-dialog.html';
        options.width = 800;
        options.height = 'auto';
        options.resizeable = true;
        return options;
    }
    /* -------------------------------------------- */
    /**
     * Add the Entity name into the window title
     * @type {String}
     */
    get title() {
        return `${this.object.name}: Deckplan`;
    }
    /* -------------------------------------------- */

    /**
     * Construct and return the data object used to render the HTML template for this form application.
     * @return {Object}
     */
    getData() {
        const actor = this.object;
        console.log(this.object);

        return {
            actor
        };
    }

    
    /* -------------------------------------------- */




    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
    }

    /**
     * This method is called upon form submission after form data is validated
     * @param event {Event}       The initial triggering submission event
     * @param formData {Object}   The object of validated form data with which to update the object
     * @private
     */
    async _updateObject(event, formData) {
        // console.log(this.object.system);
        // console.log(formData);
        // console.log(formData['actor.system.images.layout']);

        // Loyalty
        // await this.object.update({
        //     "system.images.layout": formData['actor.system.images.layout']
        // });

        // await this.object.updateEmbeddedEntity("OwnedItem", update);

        this.object.update({
            formData
        });
        this.object.sheet.render(true);
    }
}
