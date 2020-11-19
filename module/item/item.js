/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class MothershipItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
  }

  static chatListeners(html) {
    html.on('click', '.use-skill', this._onChatUseSkill.bind(this));
  }

  static async _onChatUseSkill(event) {
    const token = event.currentTarget.closest(".mothership");
    const actor = this._getChatCardActor(token);
    if (!actor) return;

    const div = event.currentTarget.children[0];
    const skillId = div.dataset.itemId;
    actor.rollSkill(skillId);
  }

}
