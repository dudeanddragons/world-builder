// Remains Script
// Rolls on the "Remains" sub-tables to generate specific types of remains (Utensils, Apparel, Harness, etc.)

async function executeRemains() {
    try {
        const remainsTypes = {
            1: "Utensils",
            2: "Apparel",
            3: "Harness",
            4: "Toys",
            5: "Optics",
            6: "Tomes"
        };

        // Sub-tables for each Remains type
        const utensilsSubTable = ["Eating", "Digging", "Writing", "Navigating", "Measuring", "Musical"];
        const apparelSubTable = ["Hauberk", "Boots", "Cloak", "Tunic", "Mask", "Breeches"];
        const harnessSubTable = ["Swimmer", "Flyer", "Giant-Animal", "Small-Animal", "Man-Sized", "Colossal"];
        const toysSubTable = ["Doll", "Vehicle", "Weapon", "Tool", "Game", "House"];
        const opticsSubTable = ["Monocle", "Spectacles", "Spyglass", "Mirror", "Colored Pane", "Periscope"];
        const tomesSubTable = ["Lexicon", "Scroll", "Manual", "Tablet", "Book", "Codex"];
        const tomeContentsSubTable = ["Treasure Map", "Ancient Legends", "Natural Guide & Recipes", "Romantic Poetry", "1d4 Cleric Prayers", "1d4 Arcane Spells"];

        // Roll for the main type of remains
        const remainsTypeRoll = await new Roll("1d6").evaluate();
        const selectedType = remainsTypes[remainsTypeRoll.total];

        // Determine specific details based on the type
        let details = "";
        switch (selectedType) {
            case "Utensils": {
                const utensilsRoll = await new Roll("1d6").evaluate();
                details = utensilsSubTable[utensilsRoll.total - 1];
                break;
            }
            case "Apparel": {
                const apparelRoll = await new Roll("1d6").evaluate();
                details = apparelSubTable[apparelRoll.total - 1];
                break;
            }
            case "Harness": {
                const harnessRoll = await new Roll("1d6").evaluate();
                details = harnessSubTable[harnessRoll.total - 1];
                break;
            }
            case "Toys": {
                const toysRoll = await new Roll("1d6").evaluate();
                details = toysSubTable[toysRoll.total - 1];
                break;
            }
            case "Optics": {
                const opticsRoll = await new Roll("1d6").evaluate();
                details = opticsSubTable[opticsRoll.total - 1];
                break;
            }
            case "Tomes": {
                const tomesRoll = await new Roll("1d6").evaluate();
                details = tomesSubTable[tomesRoll.total - 1];
                const tomeContentsRoll = await new Roll("1d6").evaluate();
                details += ` with content: ${tomeContentsSubTable[tomeContentsRoll.total - 1]}`;
                break;
            }
            default:
                console.warn("Unknown remains type rolled.");
                details = "Unknown remains type";
                break;
        }

        // Save result to `game.recentEncounterResult` and display in chat
        game.recentEncounterResult = `${selectedType}: ${details}`;
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Remains - ${selectedType}</h2><p>${details}</p>`
        });

    } catch (error) {
        console.error("Error in executeRemains function:", error);
        ui.notifications.error("An error occurred while generating remains details.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeRemains = executeRemains;
