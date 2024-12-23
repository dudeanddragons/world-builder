// Ledge Encounter Script
// Rolls to determine the type and quantity of creatures in a ledge encounter.

async function executeLedge() {
    try {
        // Define Ledge Encounters with specific dice rolls for creature quantities
        const ledgeEncounters = [
            { name: "Giant Eagles", quantity: "1d20" },
            { name: "Giant Rams", quantity: "2d4" },
            { name: "Giant Owls", quantity: "1d12" },
            { name: "Giant Ravens", quantity: "3d8" },
            { name: "Pteranodon", quantity: "3d6" },
            { name: "Couatl", quantity: "1d4" },
            { name: "Pegasi", quantity: "1d10" },
            { name: "Harpy", quantity: "2d6" },
            { name: "Griffons", quantity: "2d6" },
            { name: "Manticore", quantity: "1d4" },
            { name: "Peryton", quantity: "2d4" },
            { name: "Roc", quantity: "1d2" }
        ];

        // Roll to determine Ledge Encounter Type
        const encounterRoll = await new Roll("1d12").evaluate();
        const encounter = ledgeEncounters[encounterRoll.total - 1];

        if (!encounter) {
            console.error("Invalid ledge encounter roll result:", encounterRoll.total);
            ui.notifications.error("An error occurred while generating ledge encounter details.");
            return;
        }

        // Roll for the number of creatures in the encounter
        const encounterQuantityRoll = await new Roll(encounter.quantity).evaluate();
        const encounterDescription = `${encounterQuantityRoll.total} ${encounter.name}`;

        // Store the result in the game data for module display
        game.recentEncounterResult = encounterDescription;

        // Output result to chat
        ChatMessage.create({
            speaker: { alias: "Ledge Adventure" },
            content: `<strong>Ledge Encounter:</strong> ${encounterDescription}`
        });

    } catch (error) {
        console.error("Error in executeLedge function:", error);
        ui.notifications.error("An error occurred while generating ledge encounter details.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeLedge = executeLedge;
