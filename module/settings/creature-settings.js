export class DLCreatureSettings extends FormApplication {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.id = 'sheet-modifiers';
        options.classes = ["mothership", "sheet", "actor", "creature"];
        options.template = 'systems/mothership/templates/dialogs/creature-settings-dialog.html';
        options.width = 320;
        options.height = 150;
        return options;
    }
    /* -------------------------------------------- */
    /**
     * Add the Entity name into the window title
     * @type {String}
     */
    get title() {
        return `${this.object.name}: Creature Settings`;
    }
    /* -------------------------------------------- */

    /**
     * Construct and return the data object used to render the HTML template for this form application.
     * @return {Object}
     */
    getData() {
        const actor = this.object.data;

        return {
            actor
        };
    }
    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        html.find(`input[type=checkbox][id="data.stats.combat.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const combat = html.find(`input[type=checkbox][id="data.stats.combat.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "data.stats.combat.enabled": ev.currentTarget.checked
            });
        });
        html.find(`input[type=checkbox][id="data.stats.instinct.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const instinct = html.find(`input[type=checkbox][id="data.stats.instinct.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "data.stats.instinct.enabled": ev.currentTarget.checked
            });
        });
        html.find(`input[type=checkbox][id="data.stats.loyalty.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const loyalty = html.find(`input[type=checkbox][id="data.stats.loyalty.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "data.stats.loyalty.enabled": ev.currentTarget.checked
            });
        });
        html.find(`input[type=checkbox][id="data.stats.speed.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const speed = html.find(`input[type=checkbox][id="data.stats.speed.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "data.stats.speed.enabled": ev.currentTarget.checked
            });
        });
        html.find(`input[type=checkbox][id="data.stats.armor.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const armor = html.find(`input[type=checkbox][id="data.stats.armor.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "data.stats.armor.enabled": ev.currentTarget.checked
            });
        });
        html.find(`input[type=checkbox][id="data.stats.sanity.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const sanity = html.find(`input[type=checkbox][id="data.stats.sanity.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "data.stats.sanity.enabled": ev.currentTarget.checked
            });
        });
    }

    /**
     * This method is called upon form submission after form data is validated
     * @param event {Event}       The initial triggering submission event
     * @param formData {Object}   The object of validated form data with which to update the object
     * @private
     */
    async _updateObject(event, formData) {

        console.log("Updating Object");

        // Loyalty
        if (this.object.data.data.stats.loyalty.enabled) {
            await this.object.update({
                "data.stats.loyalty.enabled": true
            });
        }
        // Speed
        if (this.object.data.data.stats.speed.enabled) {
            await this.object.update({
                "data.stats.speed.enabled": true
            });
        }
        // Armor
        if (this.object.data.data.stats.armor.enabled) {
            await this.object.update({
                "data.stats.armor.enabled": true
            });
        }

        await this.object.updateEmbeddedEntity("OwnedItem", update);

        this.object.update({
            formData
        });
        this.object.sheet.render(true);
    }
}
