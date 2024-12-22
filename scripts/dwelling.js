// Dwelling Encounter Script
// Rolls for dwelling encounter types, quantities, and dwelling types with specific descriptions.

async function executeDwelling() {
    try {
        // Define Dwelling Encounter Types with quantity rolls
        const dwellingEncounters = [
            { name: "Bandits", quantity: "1d20 * 10" },
            { name: "Baboons", quantity: "1d4 * 10" },
            { name: "Ogre Magi", quantity: "1d6" },
            { name: "Gargoyles", quantity: "2d8" },
            { name: "Kobolds", quantity: "4d10" },
            { name: "Goblins", quantity: "4d10" },
            { name: "Bugbears", quantity: "6d6" },
            { name: "Gnolls", quantity: "2d10" },
            { name: "Hobgoblins", quantity: "4d10" },
            { name: "Orcs", quantity: "3d10" },
            { name: "Skeletons", quantity: "3d10" },
            { name: "Mummy", quantity: "2d8" },
            { name: "Zombies", quantity: "3d8" },
            { name: "Vampires", quantity: "1d4" },
            { name: "Ghouls", quantity: "2d12" },
            { name: "Medusa", quantity: "1d3" },
            { name: "Guardian Naga", quantity: "1d2" },
            { name: "Gyno-Sphinx", quantity: "1" },
            { name: "Rakshasa", quantity: "1d4" },
            { name: "Lamia", quantity: "1" }
        ];

        // Define Dwelling Types with special rules for dimensions
        const dwellingTypes = [
            { name: "Manor house", description: "2d10 rooms, 1d10x500 sq. ft. 40% probability of second floor covering 1d10x10% of area. Also 1d4-1 towers." },
            { name: "Hamlet", description: "1d10 houses" },
            { name: "Abandoned Citadel", description: "Estate with 5d4 buildings" },
            { name: "Ruins", description: "Roll on Ruins Sub-table" }
        ];

        // Roll for Dwelling Encounter Type
        const encounterRoll = await new Roll("1d20").evaluate();
        const encounter = dwellingEncounters[encounterRoll.total - 1];
        if (!encounter) {
            console.error("Invalid encounter roll result:", encounterRoll.total);
            return;
        }

        // Roll for the quantity of creatures in the encounter
        const encounterQuantityRoll = await new Roll(encounter.quantity).evaluate();
        const encounterDescription = `${encounterQuantityRoll.total} ${encounter.name}`;

        // Roll for Dwelling Type
        const dwellingTypeRoll = await new Roll("1d4").evaluate();
        const dwellingType = dwellingTypes[dwellingTypeRoll.total - 1];

        // Process specific dwelling type dimensions if necessary
        let typeDescription = dwellingType.description;
        if (dwellingType.name === "Manor house") {
            const roomsRoll = await new Roll("2d10").evaluate();
            const areaRoll = await new Roll("1d10 * 500").evaluate();
            const secondFloorChance = Math.random() < 0.4;
            const secondFloorArea = secondFloorChance ? await new Roll("1d10 * 10").evaluate() : null;
            const towersRoll = await new Roll("1d4 - 1").evaluate();

            typeDescription = `${roomsRoll.total} rooms, ${areaRoll.total} sq. ft.`;
            if (secondFloorChance) typeDescription += ` 40% chance of second floor covering ${secondFloorArea.total}% of area.`;
            typeDescription += ` Also ${towersRoll.total} towers.`;
        } else if (dwellingType.name === "Hamlet") {
            const housesRoll = await new Roll("1d10").evaluate();
            typeDescription = `${housesRoll.total} houses`;
        } else if (dwellingType.name === "Abandoned Citadel") {
            const buildingsRoll = await new Roll("5d4").evaluate();
            typeDescription = `Estate with ${buildingsRoll.total} buildings`;
        }

        // Construct the result string for display
        const result = `<strong>Dwelling Encounter:</strong> ${encounterDescription}<br>` +
                       `<strong>Dwelling Type:</strong> ${dwellingType.name}<br>` +
                       `<strong>Description:</strong> ${typeDescription}<br>`;

        // Store the result in game data to display in the main window
        game.recentEncounterResult = `Encounter: ${encounterDescription}; Dwelling: ${dwellingType.name}; ${typeDescription}`;

        // Output to Chat
        ChatMessage.create({
            content: result,
            speaker: { alias: "Dwelling Adventure" }
        });

    } catch (error) {
        console.error("Error in executeDwelling function:", error);
        ui.notifications.error("An error occurred while generating dwelling details.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeDwelling = executeDwelling;
