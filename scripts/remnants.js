// Remnants Script
// Rolls on the "Remnants" sub-tables to generate specific types of remnants (Road, Tombstone, etc.)
// Includes details for Condition, Covering, State, and Keeper.

async function executeRemnants() {
    try {
        const remnantTypes = {
            1: "Road",
            2: "Tombstone",
            3: "Signpost",
            4: "Channel",
            5: "Masonry",
            6: "Bridge",
            7: "Wall",
            8: "Edifice",
            9: "Works",
            10: "Structure"
        };

        // Sub-tables for each type
        const roadSubTable = ["Track", "Trail", "Gravel", "Paved", "Asphalt", "Concrete"];
        const tombstoneSubTable = ["Plaque", "Cairn", "Staff", "Beacon", "Pyre", "Stone Pile"];
        const signpostSubTable = ["Guide", "Omen", "Trade", "Warning", "Emblem", "Boundary Stone"];
        const channelSubTable = ["Tunnel", "Pipe", "Well", "Passage", "Canal", "Aqueduct"];
        const masonrySubTable = ["Mud Bricks", "Stone Bricks", "Marble Blocks", "Plaster", "Wattle", "Stone Blocks"];
        const bridgeSubTable = ["Rope", "Wood", "Stone", "Earth", "Natural", "Brick"];
        const wallSubTable = ["Stockade", "Barricade", "Fence", "Rampart", "Dike", "Partition"];
        const edificeSubTable = ["Carved Cliff", "Sculptured Mound", "Colossal Statue", "Palace", "Mill", "Calendar Stone"];
        const worksSubTable = ["Arsenal", "Granary", "Paved Plaza", "Viaduct", "Reservoir", "Cistern"];
        const structureSubTable = ["Stairway", "Ramp", "Shaft", "Spire", "Roof", "Tunnel"];

        // Characteristics tables
        const conditions = ["Partially covered", "Fully covered", "Above ground", "Rocky slope", "Inside cavern", "In crevice", "Beneath overhang", "Large crater", "Partially sunken", "Charred & Burnt"];
        const coverings = ["Sand", "Ashes", "Cinders", "Earth", "Thicket", "Mold", "Vines", "Rocks", "Web & dust", "Moss"];
        const states = ["Crumpled & decayed", "Disfigured & defaced", "Worm-eaten", "Crystallized & petrified", "Corroded & eroded", "Collapsed & tumbled", "Moldy & contaminated", "Dangerous operational", "Partially operational", "Fully operational"];
        const keepers = ["Mechanical", "Giant types", "Dragon types", "Undead types", "Lycanthropes", "True giants", "Animals", "Insects", "Trap", "None"];

        // Roll for Condition, Covering, State, and Keeper
        const conditionRoll = await new Roll("1d10").evaluate();
        const coveringRoll = await new Roll("1d10").evaluate();
        const stateRoll = await new Roll("1d10").evaluate();
        const keeperRoll = await new Roll("1d10").evaluate();

        const condition = conditions[conditionRoll.total - 1];
        const covering = coverings[coveringRoll.total - 1];
        const state = states[stateRoll.total - 1];
        const keeper = keepers[keeperRoll.total - 1];

        // Roll for Remnant Type
        const rollType = await new Roll("1d10").evaluate();
        const selectedType = remnantTypes[rollType.total];

        // Determine specific details based on the Remnant Type
        let details = "";
        switch (selectedType) {
            case "Road":
                const roadRoll = await new Roll("1d6").evaluate();
                details = roadSubTable[roadRoll.total - 1];
                break;
            case "Tombstone":
                const tombstoneRoll = await new Roll("1d6").evaluate();
                details = tombstoneSubTable[tombstoneRoll.total - 1];
                break;
            case "Signpost":
                const signpostRoll = await new Roll("1d6").evaluate();
                details = signpostSubTable[signpostRoll.total - 1];
                break;
            case "Channel":
                const channelRoll = await new Roll("1d6").evaluate();
                details = channelSubTable[channelRoll.total - 1];
                break;
            case "Masonry":
                const masonryRoll = await new Roll("1d6").evaluate();
                details = masonrySubTable[masonryRoll.total - 1];
                break;
            case "Bridge":
                const bridgeRoll = await new Roll("1d6").evaluate();
                details = bridgeSubTable[bridgeRoll.total - 1];
                break;
            case "Wall":
                const wallRoll = await new Roll("1d6").evaluate();
                details = wallSubTable[wallRoll.total - 1];
                break;
            case "Edifice":
                const edificeRoll = await new Roll("1d6").evaluate();
                details = edificeSubTable[edificeRoll.total - 1];
                break;
            case "Works":
                const worksRoll = await new Roll("1d6").evaluate();
                details = worksSubTable[worksRoll.total - 1];
                break;
            case "Structure":
                const structureRoll = await new Roll("1d6").evaluate();
                details = structureSubTable[structureRoll.total - 1];
                break;
            default:
                console.warn("Unknown remnant type rolled.");
                details = "Unknown remnant type";
                break;
        }

        // Set the result for `game.recentEncounterResult` and output to chat
        game.recentEncounterResult = `${selectedType}: ${details}, Condition: ${condition}, Covering: ${covering}, State: ${state}, Keeper: ${keeper}`;
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Remnants - ${selectedType}</h2><p>${details}</p><p>Condition: ${condition}<br>Covering: ${covering}<br>State: ${state}<br>Keeper: ${keeper}</p>`
        });

    } catch (error) {
        console.error("Error in executeRemnants function:", error);
        ui.notifications.error("An error occurred while generating remnants details.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeRemnants = executeRemnants;
