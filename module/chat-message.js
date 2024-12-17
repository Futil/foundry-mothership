export default class ChatMessageMosh extends ChatMessage {
    
   /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async getHTML() {
    const html = await super.getHTML();
    console.log(html);
    this._enrichChatCard(html[0]);
    return html;
  }
   /* -------------------------------------------- */

  /* -------------------------------------------- */


  /* -------------------------------------------- */

  /**
   * Augment the chat card markup for additional styling.
   * @param {HTMLElement} html  The chat card markup.
   * @protected
   */
  _enrichChatCard(html) {
    // Header matter
    const actor = this.getAssociatedActor();

   
  }
/* -------------------------------------------- */



  /* -------------------------------------------- */
  /*  Helpers                                     */
  /* -------------------------------------------- */

  /**
   * Get the Actor which is the author of a chat card.
   * @returns {Actor|void}
   */
  getAssociatedActor() {
    if ( this.speaker.scene && this.speaker.token ) {
      const scene = game.scenes.get(this.speaker.scene);
      const token = scene?.tokens.get(this.speaker.token);
      if ( token ) return token.actor;
    }
    return game.actors.get(this.speaker.actor);
  }

    /**
   * Get the item associated with this chat card.
   * @returns {MothershipItem|void}
   */
    getAssociatedItem() {
        const item = fromUuidSync(this.getFlag("mosh", "item.uuid"));
        if ( item ) return item;
        const actor = this.getAssociatedActor();
        if ( !actor ) return;
        const storedData = this.getFlag("mosh", "item.data") ?? this.getOriginatingMessage().getFlag("mosh", "item.data");
        if ( storedData ) return new Item.implementation(storedData, { parent: actor });
      }

}


/** things: 
 
to create a chat message: 

on actor.js
from_ https://github.com/foundryvtt/dnd5e/blob/899639bd852b95e715374716f256099f266ad58f/module/documents/actor/actor.mjs#L2666
message = `LongRestResultHitDice`;
let chatData = {
      user: game.user.id,
      speaker: {actor: this, alias: this.name},
      flavor: game.i18n.localize(restFlavor),
      rolls: result.rolls,
      content: game.i18n.format(message, {
        name: this.name,
        dice: longRest ? dhd : -dhd,
        health: dhp
      }),
      "flags.dnd5e.rest": { type: longRest ? "long" : "short" }
    };
    //https://foundryvtt.com/api/classes/client.ChatMessage.html#applyRollMode-2
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    //https://foundryvtt.com/api/classes/client.ChatMessage.html#create
    return ChatMessage.create(chatData);

on en.json:
"LongRestResultHitDice": "{name} takes a long rest and recovers {dice} Hit Dice.",




*/