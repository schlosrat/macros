/* This macro is specific to the AGE System (unoffical) game system.
 *
 * In AGE system games such as Modern AGE, The Expanse, etc., a
 * character can improve their defense score by "taking cover",
 * which can either happen if the character uses their move to
 * do so, or applies the "Take Cover" stunt.
 * 
 * This macro makes it a one-button click to remove the cover
 * active effect from all selected tokens.
 * 
 * This macro requires that the game system be "age-system"
 * since the effect applied is specific to that system.
 * 
 * Author: schlosrat
 */

// define removeNamedEffect function
async function removeNamedEffect(ageSystemActor, effectData) {
    // Look to see if there's an effect with this label
    const item = ageSystemActor.data.effects.find(i =>i.data.label === effectData.label);
    if (item != undefined) {
        // Delete it if there is one
        const deleted = await ageSystemActor.deleteEmbeddedDocuments("ActiveEffect", [item.id]); // Deletes one EmbeddedEntity
    }
}

/**
 * Remove a condition (AGE System dependent)
 * 
 * @param {actor} thisActor
 * @param {string} condId
 */
const removeCondition = async (thisActor, condId) => {
    /* THIS IS THE EXAMPLE TO REMOVE A CONDITION - async function */
    // This removes condition Active Effects - AGE System code will take care of checked/unchecked boxes and token statuses
    let remove = [];
    // this loop will capture all Active Effects causing the condId condition and delete all of them.
    thisActor.effects.map(e => {
        const isCondition = (e.data.flags?.["age-system"]?.type === "conditions") ? true : false;
        const isId = (e.data.flags?.["age-system"]?.name === condId) ? true : false;
        if (isCondition && isId) remove.push(e.data._id);
    });
    await thisActor.deleteEmbeddedDocuments("ActiveEffect", remove);
}

async function clearCover () {
    if (game.system.id === 'age-system') {
        const effectData = {
            label : "Cover",
            icon : "icons/svg/shield.svg",
            duration: {rounds: 1},
            changes: [{
                "key": "data.defense.total",
                "mode": 2, // Mode 2 is for ADD.
                "value": 0,
                "priority": 0
            },{
                "key": "data.defense.mod",
                "mode": 2, // Mode 2 is for ADD.
                "value": 0,
                "priority": 0
            }]
        };
        const selected = canvas.tokens.controlled;
        // console.log(selected)
        selected.forEach(async (token) => {
            await removeNamedEffect(token.actor, effectData);
            await removeCondition(token.actor, "Cover");
        })
    }
}

clearCover();