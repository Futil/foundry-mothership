export class DLCreatureSettings extends FormApplication {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.id = 'sheet-modifiers';
        options.classes = ["mosh", "sheet", "actor", "creature"];
        options.template = 'systems/mosh/templates/dialogs/creature-settings-dialog.html';
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

        html.find(`input[type=checkbox][id="system.stats.combat.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const combat = html.find(`input[type=checkbox][id="system.stats.combat.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "system.stats.combat.enabled": ev.currentTarget.checked
            });
        });
        html.find(`input[type=checkbox][id="system.stats.instinct.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const instinct = html.find(`input[type=checkbox][id="system.stats.instinct.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "system.stats.instinct.enabled": ev.currentTarget.checked
            });
        });
        html.find(`input[type=checkbox][id="system.stats.loyalty.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const loyalty = html.find(`input[type=checkbox][id="system.stats.loyalty.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "system.stats.loyalty.enabled": ev.currentTarget.checked
            });
        });
        html.find(`input[type=checkbox][id="system.stats.speed.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const speed = html.find(`input[type=checkbox][id="system.stats.speed.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "system.stats.speed.enabled": ev.currentTarget.checked
            });
        });
        html.find(`input[type=checkbox][id="system.stats.armor.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const armor = html.find(`input[type=checkbox][id="system.stats.armor.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "system.stats.armor.enabled": ev.currentTarget.checked
            });
        });
        html.find(`input[type=checkbox][id="system.stats.sanity.enabled"]`).click(ev => {
            if (ev.currentTarget.checked) {
                const sanity = html.find(`input[type=checkbox][id="system.stats.sanity.enabled"]`).prop('checked', true);
            }

            this.object.update({
                "system.stats.sanity.enabled": ev.currentTarget.checked
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
        if (this.object.system.stats.loyalty.enabled) {
            await this.object.update({
                "data.stats.loyalty.enabled": true
            });
        }
        // Speed
        if (this.object.system.stats.stats.speed.enabled) {
            await this.object.update({
                "data.stats.speed.enabled": true
            });
        }
        // Armor
        if (this.object.system.stats.stats.armor.enabled) {
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
