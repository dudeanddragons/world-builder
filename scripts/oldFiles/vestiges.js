// Vestiges Script
// Rolls on the "Vestiges" sub-tables to generate specific types of vestiges.

async function executeVestiges() {
    try {
        const vestigeTypes = {
            1: "Pyramid",
            2: "Mound",
            3: "Totem",
            4: "Fountain",
            5: "Sewers",
            6: "Monolith"
        };

        // Define sub-tables for each vestige type
        const pyramidSubTable = ["Burial Tomb", "Temple", "Observatory", "Palace", "Menagerie", "Alien Base"];
        const moundSubTable = ["Sacrificial", "Burial", "Treasure", "Lair", "Sacred", "Polymorphed"];
        const totemSubTable = ["Mammal", "Human", "God", "Monster", "Bird", "Snake"];
        const fountainSubTable = ["Giant", "Statue", "Miniature", "Geometric", "Wishing", "Spray"];
        const fountainEffectSubTable = [
            "Poison",
            "Healing",
            "Refreshing",
            "Hallucinations for 1d6 hours",
            "Shrink by 5d20 percent for 1d6 days",
            "Polymorph into random animal"
        ];
        const sewersSubTable = ["1' deep ditch", "2' deep trench", "1' high pipe", "2' high culvert", "4' high tunnels", "8' high passages"];
        const monolithSubTable = ["Column", "Hewn Statue", "Minaret", "Obelisk", "Effigy", "Monument"];

        // Roll to determine the primary vestige type
        const rollType = await new Roll("1d6").evaluate();
        const selectedType = vestigeTypes[rollType.total];

        if (!selectedType) {
            console.error("Invalid roll result for vestige type:", rollType.total);
            ui.notifications.warn("Invalid roll for vestige type. Check console for details.");
            return;
        }

        // Determine specific details based on the vestige type
        let details = "";
        switch (selectedType) {
            case "Pyramid":
                const pyramidRoll = await new Roll("1d6").evaluate();
                details = `Pyramid Type: ${pyramidSubTable[pyramidRoll.total - 1]}`;
                break;

            case "Mound":
                const moundRoll = await new Roll("1d6").evaluate();
                details = `Mound Type: ${moundSubTable[moundRoll.total - 1]}`;
                break;

            case "Totem":
                const totemRoll = await new Roll("1d6").evaluate();
                details = `Totem Type: ${totemSubTable[totemRoll.total - 1]}`;
                break;

            case "Fountain":
                const fountainRoll = await new Roll("1d6").evaluate();
                const fountainEffectRoll = await new Roll("1d6").evaluate();
                details = `Fountain Type: ${fountainSubTable[fountainRoll.total - 1]}, Effect: ${fountainEffectSubTable[fountainEffectRoll.total - 1]}`;
                break;

            case "Sewers":
                const sewersRoll = await new Roll("1d6").evaluate();
                details = `Sewer Type: ${sewersSubTable[sewersRoll.total - 1]}`;
                break;

            case "Monolith":
                const monolithRoll = await new Roll("1d6").evaluate();
                details = `Monolith Type: ${monolithSubTable[monolithRoll.total - 1]}`;
                break;

            default:
                console.error("Unexpected vestige type:", selectedType);
                ui.notifications.warn("Unexpected vestige type encountered.");
                return;
        }

        // Store the result in game data and output to chat
        game.recentEncounterResult = `${selectedType}: ${details}`;
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Vestiges - ${selectedType}</h2><p>${details}</p>`
        });

    } catch (error) {
        console.error("Error in executeVestiges function:", error);
        ui.notifications.error("An error occurred while generating vestiges details. Check console for more information.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeVestiges = executeVestiges;
