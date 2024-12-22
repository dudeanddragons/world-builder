// Refuse Script
// Rolls on the "Refuse" sub-tables to generate specific types of refuse (Offal, Sewage, Parts, etc.)

async function executeRefuse() {
    try {
        const refuseTypes = {
            1: "Offal",
            2: "Sewage",
            3: "Parts",
            4: "Discards",
            5: "Food",
            6: "Fuel"
        };

        const offalSubTable = ["Viscera", "Bones", "Gore", "Grizzle", "Fat", "Talons"];
        const sewageSubTable = ["Soap", "Body Waste", "Oils", "Slop", "Chemicals", "Lint"];
        const partsSubTable = ["Buckle", "Lacing", "Crossbar", "Pommels", "Arrowhead", "Spike"];
        const discardsSubTable = ["Leather Scraps", "Papyrus Scraps", "Handle", "Shield Boss", "Pole", "Linen Scraps"];
        const foodSubTable = ["Fat", "Fruit", "Seeds", "Vegetables", "Minerals", "Meat"];
        const fuelSubTable = ["Wood", "Coal", "Peat", "Dried Dung", "Petroleum", "Wax"];
        const conditionOfDiscards = ["Unusable", "Unusable", "Disgusting but usable", "Unpleasant but usable", "Usable", "Good as new"];

        // Roll for the main Refuse Type
        const refuseRoll = await new Roll("1d6").evaluate();
        const selectedType = refuseTypes[refuseRoll.total];

        // Determine specific details based on the Refuse Type
        let details = "";
        switch (selectedType) {
            case "Offal": {
                const offalRoll = await new Roll("1d6").evaluate();
                details = offalSubTable[offalRoll.total - 1];
                break;
            }
            case "Sewage": {
                const sewageRoll = await new Roll("1d6").evaluate();
                details = sewageSubTable[sewageRoll.total - 1];
                break;
            }
            case "Parts": {
                const partsRoll = await new Roll("1d6").evaluate();
                details = partsSubTable[partsRoll.total - 1];
                break;
            }
            case "Discards": {
                const discardsRoll = await new Roll("1d6").evaluate();
                details = discardsSubTable[discardsRoll.total - 1];
                // Add a condition roll if the type is Discards
                const conditionRoll = await new Roll("1d6").evaluate();
                const condition = conditionOfDiscards[conditionRoll.total - 1];
                details += ` (Condition: ${condition})`;
                break;
            }
            case "Food": {
                const foodRoll = await new Roll("1d6").evaluate();
                details = foodSubTable[foodRoll.total - 1];
                break;
            }
            case "Fuel": {
                const fuelRoll = await new Roll("1d6").evaluate();
                details = fuelSubTable[fuelRoll.total - 1];
                break;
            }
            default:
                console.warn("Unknown refuse type rolled.");
                details = "Unknown refuse type";
                break;
        }

        // Store the result in the game data and output it to chat
        game.recentEncounterResult = `${selectedType}: ${details}`;
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Refuse - ${selectedType}</h2><p>${details}</p>`
        });

    } catch (error) {
        console.error("Error in executeRefuse function:", error);
        ui.notifications.error("An error occurred while generating refuse details.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeRefuse = executeRefuse;
