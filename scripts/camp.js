// Camp Script
// Rolls to determine the type of camp, population, and occupant details.

async function executeCamp() {
    const campTypes = [
        { name: "Bandits", quantity: "1d20 * 10" },
        { name: "Buccaneers", quantity: "5d6 * 10" },
        { name: "Berserkers", quantity: "4d6 * 10" },
        { name: "Merchants", quantity: "5d6 * 10" },
        { name: "Nomads", quantity: "4d10 * 10" },
        { name: "Pilgrims", quantity: "3d10 * 10" },
        { name: "Tribesmen", quantity: "2d6 * 10" },
        { name: "Elves", quantity: "3d10 * 10" },
        { name: "Dwarves", quantity: "4d10 * 10" },
        { name: "Halflings", quantity: "3d10 * 10" },
        { name: "Gnomes", quantity: "4d10 * 10" },
        { name: "Kobolds", quantity: "4d10 * 10" },
        { name: "Goblins", quantity: "4d10 * 10" },
        { name: "Gnolls", quantity: "3d10 * 10" },
        { name: "Hobgoblins", quantity: "4d10 * 10" },
        { name: "Orcs", quantity: "3d10 * 10" },
        { name: "Lizardmen", quantity: "1d8 * 10" },
        { name: "Centaur", quantity: "4d6" },
        { name: "Ogres", quantity: "2d10" }
    ];

    const fightingForceTable = [
        "20% Warriors", "40% Warriors", "60% Warriors", "70% Warriors", "80% Warriors", "90% Warriors"
    ];
    const leaderTypes = ["Warrior", "Priest", "Magic User", "Elder", "Mystic", "Noble"];
    const currentStatusTable = ["Lax guards", "Alert sentries", "Roaming lookouts", "Guard dogs", "Regular patrols", "Frequent mounted patrols"];
    const defencesTable = ["Log palisade", "Earthworks", "Abandoned citadel", "Watch tower", "No defences", "No defences"];

    try {
        // Roll for Camp Type
        const campTypeRoll = await new Roll("1d20").evaluate();
        const campType = campTypes[campTypeRoll.total - 1];
        if (!campType) {
            throw new Error(`Invalid camp type roll result: ${campTypeRoll.total}`);
        }

        // Roll for Camp Quantity (Population Size)
        const campQuantityRoll = await new Roll(campType.quantity).evaluate();
        const campPopulation = campQuantityRoll.total;

        // Roll for Occupant Details
        const fightingForceRoll = await new Roll("1d6").evaluate();
        const leaderTypeRoll = await new Roll("1d6").evaluate();
        const currentStatusRoll = await new Roll("1d6").evaluate();
        const defencesRoll = await new Roll("1d6").evaluate();

        const fightingForce = fightingForceTable[fightingForceRoll.total - 1];
        const leaderType = leaderTypes[leaderTypeRoll.total - 1];
        const currentStatus = currentStatusTable[currentStatusRoll.total - 1];
        const defences = defencesTable[defencesRoll.total - 1];

        // Format Results
        const result = `
            <strong>Camp Type:</strong> ${campType.name}<br>
            <strong>Population:</strong> ${campPopulation}<br>
            <strong>Fighting Force:</strong> ${fightingForce}<br>
            <strong>Leader Type:</strong> ${leaderType}<br>
            <strong>Current Status:</strong> ${currentStatus}<br>
            <strong>Defences:</strong> ${defences}<br>
        `;

        // Store result and output to chat
        game.recentEncounterResult = `Camp Type: ${campType.name} - Population: ${campPopulation}`;
        ChatMessage.create({
            speaker: { alias: "Camp Adventure" },
            content: result
        });
    } catch (error) {
        console.error(`Failed to execute camp script:`, error);
        ui.notifications.error(`Error executing camp roll. Check console for details.`);
    }
}

// Attach the function to the window object for dynamic execution
window.executeCamp = executeCamp;
