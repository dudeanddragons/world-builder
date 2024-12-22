// Wrecks Script
// Rolls on the "Wrecks" tables to determine the type of wreck and its details.

async function executeWrecks() {
    try {
        const wreckTypes = {
            1: { name: "Sea Vehicle", subTable: ["Pig Bladder", "Canoe", "Longboat", "Merchant Ship", "Man o’ War", "Unusual"] },
            2: { name: "Land Vehicle", subTable: ["Sledge", "Wagon", "Litter", "Carriage", "Chariot", "Unusual"] },
            3: { name: "Air Vehicle", subTable: ["Balloon", "Wings", "Hang-glider", "Flying Ship", "Roc Carriage", "Unusual"] },
            4: { name: "War Engine", subTable: ["Onager", "Scorpion", "Spear", "Ram", "Springal", "Trebuchet"] },
            5: { name: "Submarine", subTable: ["Dolphin Sled", "Sea-Horse Carriage", "Giant Turtle House", "Diving Bell", "Pocket", "Nuclear"] },
            6: { name: "Subterranean Vehicle", subTable: ["Mole Sled", "Rock Borer", "Mine Cart", "Earth Borer", "Worm Saddle", "Rat Chariot"] }
        };

        const wreckConditions = [
            "Nothing but debris & remnants",
            "Broken hull, partially looted",
            "Overturned",
            "Half sunk/buried",
            "Abandoned (stuck or out of fuel)",
            "Perfect condition, may still have crew"
        ];

        const unusualSeaVehicles = ["Imperial Barge", "Chinese Junk", "Enchanted Clipper", "Speed Boat", "Tramp Steamer", "Battleship"];
        const unusualLandVehicles = ["Clockwork Horse", "Animated Bathtub", "Motorcycle", "Motorcar", "Double-decker Bus", "APC"];
        const unusualAirVehicles = ["Propeller Driven", "Jet", "Re-entry Capsule", "Space Craft", "Floating Castle", "Anti-Gravity Disc"];

        // Roll to determine the Wreck Type
        const typeRoll = await new Roll("1d6").evaluate();
        const wreckType = wreckTypes[typeRoll.total];

        if (!wreckType) {
            console.error("Invalid wreck type roll:", typeRoll.total);
            ui.notifications.warn("Invalid roll for wreck type. Check console for details.");
            return;
        }

        // Roll on the sub-table specific to the wreck type
        const subTableRoll = await new Roll("1d6").evaluate();
        let subType = wreckType.subTable[subTableRoll.total - 1];

        // Handle "Unusual" options by rolling on corresponding unusual vehicle tables
        if (subType === "Unusual") {
            switch (wreckType.name) {
                case "Sea Vehicle":
                    const unusualSeaRoll = await new Roll("1d6").evaluate();
                    subType = unusualSeaVehicles[unusualSeaRoll.total - 1];
                    break;
                case "Land Vehicle":
                    const unusualLandRoll = await new Roll("1d6").evaluate();
                    subType = unusualLandVehicles[unusualLandRoll.total - 1];
                    break;
                case "Air Vehicle":
                    const unusualAirRoll = await new Roll("1d6").evaluate();
                    subType = unusualAirVehicles[unusualAirRoll.total - 1];
                    break;
                default:
                    console.warn("No unusual vehicle table found for:", wreckType.name);
                    subType = "Unknown Unusual Type";
                    break;
            }
        }

        // Roll for Condition of the Wreck
        const conditionRoll = await new Roll("2d6").evaluate();
        const conditionIndex = Math.max(0, Math.min(conditionRoll.total - 2, wreckConditions.length - 1));
        const condition = wreckConditions[conditionIndex];

        // Store the result in game data and output it to chat
        game.recentEncounterResult = `Wreck Type: ${wreckType.name} (${subType}), Condition: ${condition}`;
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Wreck Encounter</h2><p>Wreck Type: <strong>${wreckType.name} (${subType})</strong></p><p>Condition: ${condition}</p>`
        });

    } catch (error) {
        console.error("Error in executeWrecks function:", error);
        ui.notifications.error("An error occurred while generating wreck details. Check console for more information.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeWrecks = executeWrecks;
