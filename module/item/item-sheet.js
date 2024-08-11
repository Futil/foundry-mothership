/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class MothershipItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    var options = {
      classes: ["mosh", "sheet", "item"],
      width: 600,
      height: 500,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    };

    if (game.release.generation >= 12) {
      return foundry.utils.mergeObject(super.defaultOptions, options);
    } else {
      return mergeObject(super.defaultOptions, options);
    }
  }

  /** @override */
  get template() {
    const path = "systems/mosh/templates/item";
    // Return a single sheet for all item types.
    return `${path}/item-${this.item.type}-sheet.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    // return `${path}/${this.item.system.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    const superData = data.system;

    if (data.type == "weapon") {
      if (superData.ranges.value == "" && superData.ranges.medium > 0) {
        superData.ranges.value = superData.ranges.short + "/" + superData.ranges.medium + "/" + superData.ranges.long;
        superData.ranges.medium = 0;
      }
    }

    if (data.data.system.settings == null) {
      data.data.system.settings = {};
    }
    data.data.system.settings.useCalm = game.settings.get("mosh", "useCalm");
    data.data.system.settings.hideWeight = game.settings.get("mosh", "hideWeight");
    data.data.system.settings.firstEdition = game.settings.get("mosh", "firstEdition");
    data.data.system.settings.androidPanic = game.settings.get("mosh", "androidPanic");

    return data.data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}
