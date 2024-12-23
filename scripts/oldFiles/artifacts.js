// Artifacts Script
// Rolls on the "Artifacts" tables to determine the type of artifact and its specific details.

async function executeArtifacts() {
    const artifactTypes = {
        1: { name: "Weapon", subTable: ["Sword", "Hammer", "Axe", "Club", "Battle Axe", "Javelin"] },
        2: { name: "Entertainment Device", subTable: ["Animated", "Musical", "Dancing", "Serving", "Intensifying", "Dreaming"] },
        3: { name: "Protective Device", subTable: ["Machine", "Staff", "Vial", "Garment", "Talisman", "Armor"] },
        4: { name: "Offensive Device", subTable: ["Hand", "Vase", "Eye", "Box", "Horn", "Vat"] },
        5: { name: "Informative Device", subTable: ["Stone", "Flask", "Orb", "Diadem", "Crystal Ball", "Necklace"] },
        6: { name: "Leadership Device", subTable: ["Ring", "Gem", "Throne", "Rod", "Sword", "Scepter"] }
    };

    try {
        // Roll to determine the Artifact Type
        const typeRoll = await new Roll("1d6").evaluate();
        const artifactType = artifactTypes[typeRoll.total];

        // Check if the artifact type and sub-table are valid
        if (!artifactType || !artifactType.subTable) {
            throw new Error(`Invalid artifact type roll result: ${typeRoll.total}`);
        }

        // Roll on the sub-table specific to the artifact type
        const subTableRoll = await new Roll("1d6").evaluate();
        const specificArtifact = artifactType.subTable[subTableRoll.total - 1];

        // Output the result for display
        game.recentEncounterResult = `${artifactType.name}: ${specificArtifact}`;
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Artifact Encounter</h2>
                      <p>Artifact Type: <strong>${artifactType.name}</strong></p>
                      <p>Item: ${specificArtifact}</p>`
        });
    } catch (error) {
        console.error(`Failed to execute artifacts script:`, error);
        ui.notifications.error(`Error executing artifacts roll. Check console for details.`);
    }
}

// Attach the function to the window object for dynamic execution
window.executeArtifacts = executeArtifacts;
