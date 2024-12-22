// Cave Script
// Rolls to determine the type of cave, encounter, entrance, and first feature.

async function executeCave() {
    try {
        // Define Cave Encounter Table
        const caveEncounterTable = [
            "1-2 Cave Bears (2d12 HP each)", "1-2 Giant Spiders (3d8 HP each)", "3d6 Black Puddings", "3d6 Piercers",
            "1d4 Owl Bears", "1-3 Ropers", "1d8 Minotaur", "1d4 Huge Hulks",
            "1d4 Gorgon", "1d10 Hill Giants", "1 Ettin", "1-4 Red Dragons"
        ];

        // Define Cave Types and corresponding entrance options
        const caveTypeTable = ["Limestone Cave", "Talus Cave", "Sea Cave", "Lava Tube", "Geothermal", "Stream Cut", "Pold Cave", "Ice Cave", "Abandoned Mine"];
        const entranceTypes = {
            "Limestone Cave": ["Sinkhole", "Arch", "Pit"],
            "Talus Cave": ["Sinkhole", "Arch", "Pit"],
            "Sea Cave": ["Sinkhole", "Arch", "Pit"],
            "Lava Tube": ["Sinkhole", "Arch", "Pit"],
            "Geothermal": ["Sinkhole", "Arch", "Pit"],
            "Stream Cut": ["Sinkhole", "Arch", "Pit"],
            "Pold Cave": ["Sinkhole", "Arch", "Pit"],
            "Ice Cave": ["Sinkhole", "Arch", "Pit"],
            "Abandoned Mine": ["Shaft", "Entrance Room", "Broken Shaft"]
        };

        // Define Cave Features Table
        const caveFeatures = [
            "Continuing Tunnel", "Cavern", "Vault", "Pit", "Underground Stream",
            "Underground River", "Underground Lake", "Cross Another Tunnel", "Tunnel Ends"
        ];

        // Roll for Cave Encounter
        const encounterRoll = await new Roll("1d12").evaluate();
        const encounter = caveEncounterTable[encounterRoll.total - 1];

        // Roll for Cave Type
        const caveTypeRoll = await new Roll("1d9").evaluate();
        const caveType = caveTypeTable[caveTypeRoll.total - 1];

        // Roll for Cave Entrance
        const entranceRoll = await new Roll("1d3").evaluate();
        const entranceType = entranceTypes[caveType][entranceRoll.total - 1];

        // Roll for First Cave Feature
        const featureRoll = await new Roll("1d8").evaluate();
        const firstFeature = caveFeatures[featureRoll.total - 1];

        // Construct the cave details as a formatted string
        game.recentEncounterResult = `
            <strong>Type:</strong> ${caveType}<br>
            <strong>Encounter:</strong> ${encounter}<br>
            <strong>Entrance:</strong> ${entranceType}<br>
            <strong>Feature:</strong> ${firstFeature}
        `;

        // Output to chat for convenience
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Cave Encounter</h2>
                      <p><strong>Type:</strong> ${caveType}</p>
                      <p><strong>Encounter:</strong> ${encounter}</p>
                      <p><strong>Entrance:</strong> ${entranceType}</p>
                      <p><strong>Feature:</strong> ${firstFeature}</p>`
        });

    } catch (error) {
        console.error("Error in executeCave function:", error);
        ui.notifications.error("An error occurred while generating cave details. Check the console for more information.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeCave = executeCave;
