export class DLShipSetup extends FormApplication {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.id = 'sheet-modifiers';
        options.classes = ["mosh", "sheet", "actor", "ship"];
        options.template = 'systems/mosh/templates/dialogs/ship-setup-dialog.html';
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
        return `${this.object.name}: Ship Setup`;
    }
    /* -------------------------------------------- */
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
        
        // Starting Conditions
        html.find('.conditions-button').click(ev => {
            //roll starting conditions
            this.object.rollTable('kqz8GsFVPfjvqO0N','1d5+1','low',true,false,null,null);
        });

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

        await this.object.update({
            "name": formData['actor.name']
        });


        this.object.update({
            formData
        });
        console.log(this);

        await this.object.sheet.render(true, {focus: false});

        
    }
}
