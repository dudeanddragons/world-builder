// Burrows Script
// Rolls to determine the type of burrow, its dimensions, and a random encounter.

async function executeBurrows() {
    // Define Burrow Types with dimensions and notes
    const burrowTypes = [
        { name: "Giant Anthill", dimensions: "20' Diameter, rough passages. 20% chance of rooms every 20' (50' sq.)" },
        { name: "Giant Hive", dimensions: "Numerous cells, 20' Diameter." },
        { name: "Tunnel Hive", dimensions: "" },
        { name: "Worm Tunnels", dimensions: "Rough passages, large caverns every 120'." },
        { name: "Glow Worm Cave", dimensions: "50' Wide, 20' High, contains luminous worms." },
        { name: "Large Burrow", dimensions: "" },
        { name: "Very Large Burrow", dimensions: "" },
        { name: "Civilized Burrow", dimensions: "Well-appointed hobbit hole, multiple passages, 10'x10' rooms, 5' high." }
    ];

    // Define Burrow Encounters with dice notation for creature quantities
    const burrowEncounters = {
        "Giant Anthill": ["3d20 Giant Ants", "1d100 Giant Ants", "3d6 Giant Beetles", "3d4 Fire Beetles", "2d12 Giant Centipedes", "1d4 Giant Scorpions"],
        "Giant Hive": ["2d20 Giant Bees", "2d20 Giant Wasps", "6d6 Giant Bees", "2d8 Giant Beetles", "3d6 Giant Wasps", "2d10 Large Spiders"],
        "Tunnel Hive": ["1d8 Giant Spiders", "2d8 Giant Spiders", "2d6 Giant Centipedes", "2d8 Giant Beetles", "1d8 Giant Centipedes", "1d4 Giant Scorpions"],
        "Worm Tunnels": ["1d8 Giant Snakes", "2d4 Giant Slugs", "1d4 Giant Centipedes", "2d4 Giant Leeches", "1d6 Beetles", "1d6 Ants"],
        "Glow Worm Cave": ["2d8 Giant Frogs", "1d4 Giant Spiders", "1d4 Owl Bears", "2d12 Giant Toads", "2d12 Giant Rats", "1d2 Rust Monsters"],
        "Large Burrow": ["1d8 Giant Weasels", "1d8 Giant Boars", "1d4 Giant Otters", "2d12 Giant Rats", "2d12 Giant Rats", "2d12 Giant Rats"],
        "Very Large Burrow": ["1d6 Giant Badgers", "1d6 Giant Porcupines", "1d4 Giant Skunks", "1d4 Giant Ticks", "1d4 Giant Wolverines", "1d4 Green Dragons"],
        "Civilized Burrow": ["2d10 Ratlings", "2d10 Gnomes", "2d20 Kobolds", "2d20 Goblins", "1d20 Leprechauns", "1d4 Brownies"]
    };

    try {
        // Roll for Burrow Type
        const burrowTypeRoll = await new Roll("1d8").evaluate();
        const burrowType = burrowTypes[burrowTypeRoll.total - 1];

        if (!burrowType) {
            throw new Error(`Invalid burrow type roll result: ${burrowTypeRoll.total}`);
        }

        // Determine Burrow Dimensions with specific rolls for certain types
        let dimensionDescription = burrowType.dimensions;
        if (burrowType.name === "Tunnel Hive") {
            const diameterRoll = await new Roll("1d6 * 2").evaluate();
            const depthRoll = await new Roll("1d6 * 4").evaluate();
            const lengthRoll = await new Roll("1d10 * 10").evaluate();
            dimensionDescription = `${diameterRoll.total}' Diameter, ${depthRoll.total}' Deep, ${lengthRoll.total}' Long`;
        } else if (burrowType.name === "Large Burrow" || burrowType.name === "Very Large Burrow") {
            const tunnelSize = await new Roll("1d4 * 10").evaluate();
            const roomSize = await new Roll("1d10 * 10").evaluate();
            dimensionDescription = `${tunnelSize.total}' Tunnels, ${roomSize.total}' Long rooms`;
        }

        // Roll for Burrow Encounter based on Burrow Type
        const encounterTable = burrowEncounters[burrowType.name];
        const encounterRoll = await new Roll(`1d${encounterTable.length}`).evaluate();
        const encounterExpression = encounterTable[encounterRoll.total - 1];

        // Extract quantity and creature type from the encounter expression
        const match = encounterExpression.match(/^(\d+d?\d*)\s+(.+)$/);
        if (!match) {
            throw new Error(`Invalid encounter expression format: ${encounterExpression}`);
        }

        const [_, creatureCountRoll, creatureType] = match;
        const creatureCount = await new Roll(creatureCountRoll).evaluate();

        // Construct encounter description
        const encounterDescription = `${creatureCount.total} ${creatureType}`;

        // Construct the full result description for display
        const resultDescription = `<strong>Burrow Type:</strong> ${burrowType.name}<br>` +
                                  `<strong>Dimensions:</strong> ${dimensionDescription}<br>` +
                                  `<strong>Encounter:</strong> ${encounterDescription}`;

        // Store the result in game data and display in chat
        game.recentEncounterResult = `${burrowType.name}: ${dimensionDescription} - Encounter: ${encounterDescription}`;
        ChatMessage.create({
            content: resultDescription,
            speaker: { alias: "Burrow Adventure" }
        });
    } catch (error) {
        console.error(`Failed to execute burrows script:`, error);
        ui.notifications.error(`Error executing burrows roll. Check console for details.`);
    }
}

// Attach the function to the window object for dynamic execution
window.executeBurrows = executeBurrows;
