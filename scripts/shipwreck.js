// Shipwreck Encounter Script
// Rolls for shipwreck encounters, contents, and cargo with detailed descriptions.

async function executeShipwreck() {
    try {
        const shipwreckEncounters = [
            { name: "Buccaneers", quantity: "3d10" },
            { name: "Giant Crabs", quantity: "2d4" },
            { name: "Trolls", quantity: "1d12" },
            { name: "Giant Beavers", quantity: "1d8" },
            { name: "Apes", quantity: "2d6" },
            { name: "Skeletons", quantity: "3d10" }
        ];

        const shipwreckContents = [
            { result: "Nothing" },
            { result: "Roll once for a relic", relicRolls: 1 },
            { result: "Roll twice for relics", relicRolls: 2 },
            { result: "Roll three times for relics", relicRolls: 3 },
            { result: "Roll for Cargo" },
            { result: "Roll for Cargo" }
        ];

        const shipwreckCargo = [
            { name: "Ore", baseValue: "1d10 * 100", conditionModifier: "100" },
            { name: "Cloth", baseValue: "1d8 * 1000", conditionModifier: "2d20 + 60" },
            { name: "Ceramics", baseValue: "1d6 * 1000", conditionModifier: "1d100" },
            { name: "Grain", baseValue: "1d20 * 100", conditionModifier: "3d20 + 40" },
            { name: "Decorative Stone / Brick", baseValue: "1d10 * 1000", conditionModifier: "2d20 + 80" },
            { name: "Wine", baseValue: "2d6 * 100", conditionModifier: "3d20 + 40" },
            { name: "Spices", baseValue: "2d8 * 500", conditionModifier: "3d20 + 40" },
            { name: "Furniture", baseValue: "1d12 * 1000", conditionModifier: "3d20 + 40" },
            { name: "Artwork", baseValue: "2d10 * 1000", conditionModifier: "2d20 + 20" },
            { name: "Treasure", baseValue: "1d20 * 1000", conditionModifier: "2d20 + 60" }
        ];

        // Roll for Shipwreck Encounter Type and Quantity
        const encounterRoll = await new Roll("1d6").evaluate();
        const encounter = shipwreckEncounters[encounterRoll.total - 1];
        const encounterQuantityRoll = await new Roll(encounter.quantity).evaluate();
        const encounterDescription = `${encounterQuantityRoll.total} ${encounter.name}`;

        // Roll for Shipwreck Contents
        const contentsRoll = await new Roll("1d6").evaluate();
        const content = shipwreckContents[contentsRoll.total - 1];
        let contentDescription = content.result;
        let relicResults = [];

        // Handle relic rolls if specified in contents
        if (content.relicRolls) {
            for (let i = 0; i < content.relicRolls; i++) {
                try {
                    await window.executeRelics();
                    relicResults.push(game.recentEncounterResult);
                } catch (error) {
                    console.error("Error executing relic roll:", error);
                    ui.notifications.warn("Error generating relic item.");
                }
            }
            contentDescription += `<br><strong>Relics Found:</strong> ${relicResults.join(", ")}`;
        }

        // If the content includes cargo, roll for cargo type
        if (content.result.includes("Cargo")) {
            const cargoRoll = await new Roll("1d10").evaluate();
            const cargo = shipwreckCargo[cargoRoll.total - 1];

            // Calculate base value for cargo
            const baseValueRoll = await new Roll(cargo.baseValue).evaluate();
            const baseValue = baseValueRoll.total;

            // Calculate condition modifier
            const conditionModifierRoll = await new Roll(cargo.conditionModifier).evaluate();
            const conditionModifier = conditionModifierRoll.total;

            // Calculate final cargo value
            const cargoValue = Math.round(baseValue * (conditionModifier / 100));
            contentDescription = `${cargo.name} - Base Value: ${baseValue} GP, Condition Modifier: ${conditionModifier}%, Final Value: ${cargoValue} GP`;
        }

        // Store the result in the game data for display
        const result = `<strong>Shipwreck Encounter:</strong> ${encounterDescription}<br><strong>Shipwreck Contents:</strong> ${contentDescription}`;
        game.recentEncounterResult = result;

        // Send to Chat
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Shipwreck Encounter</h2><p>${result}</p>`
        });

    } catch (error) {
        console.error("Error in executeShipwreck function:", error);
        ui.notifications.error("An error occurred while generating shipwreck details.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeShipwreck = executeShipwreck;
