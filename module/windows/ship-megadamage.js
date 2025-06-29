import { fromIdUuid } from "../mosh.js";
export class DLShipMegaDamage extends foundry.appv1.FormApplication {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.id = 'sheet-modifiers';
        options.classes = ["mosh", "sheet", "actor", "ship"];
        options.template = 'systems/mosh/templates/dialogs/ship-megadamage-dialog.html';
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
        return `${this.object.name}: Megadamage Effects`;
    }
    /* -------------------------------------------- */
    /**
     * Construct and return the data object used to render the HTML template for this form application.
     * @return {Object}
     */
    getData() {
        const data = super.getData();
        const actor = this.object;
        

        this._prepareMegadamage(data);

        
        return {
            actor
        };
    }


    async _prepareMegadamage(sheetData){
        const actorData = sheetData.object;

        //A script to return the data from a table.
        let tableId = game.settings.get('mosh','table1eMegadamageEffects');
        //get table data
        let tableData = await fromIdUuid(tableId,{type:"RollTable"});

        let entries = Array.from(tableData.results.entries());

        // MEGADAMAGE SETTINGS MENU
        let megadamageSettingsHTML = "";
        let index = 0;
        for(const entry of entries){
            if(index != 0){
                if (actorData.system.megadamage.hits.includes(index)){
                    megadamageSettingsHTML += `<i class="fas fa-circle megadamage-button rollable" data-key="${index}"></i> &nbsp`;
                }
                else{
                    megadamageSettingsHTML += `<i class="far fa-circle megadamage-button rollable" data-key="${index}"></i> &nbsp`;
                }
                
                megadamageSettingsHTML += `<b>${index} |</b> ${entry[1].text} <br/> <br/>`;
            }
            index++;
        }

        actorData.system.megadamage.menu.html = megadamageSettingsHTML;

        // await this.object.update({
        //     "data.megadamage.menu.html": megadamageSettingsHTML
        // });
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        html.on('mousedown', '.megadamage-button', ev => {
            const data = this.object;
      
            const div = $(ev.currentTarget);
            const targetKey = div.data("key");

            if(data.system.megadamage.hits.includes(targetKey)){
                const index = data.system.megadamage.hits.indexOf(targetKey);
                data.system.megadamage.hits.splice(index, 1);
            } else {
                data.system.megadamage.hits.push(targetKey);
            }
            
            this.object.update({
                "data.megadamage.hits": data.system.megadamage.hits
            });

            this.render(true, {focus: true});
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

        // this.object.update({
        //     formData
        // });

        //await this.object.sheet.render(true, {focus: false});

        
    }
}
