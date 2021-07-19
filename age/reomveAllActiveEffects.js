// Remove all active effects on the selected token

let tactor = null;
if (speaker.token) tactor = game.actors.tokens[speaker.token];
if (!tactor ) tactor = game.actors.get(speaker.actor);
if (tactor ) {
    
    // Get all the active effects
    const deletions = tactor.data.effects.map(i => i.id);
    // Delete them all
    const deleted = await actor.deleteEmbeddedDocuments("ActiveEffect", deletions);
}