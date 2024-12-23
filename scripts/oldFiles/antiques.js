// Antiques Script
// Rolls to determine the type of antique and generates details based on sub-tables.

async function executeAntiques() {
    const antiqueTypes = {
        1: "Statues",
        2: "Furniture",
        3: "Engravings",
        4: "Idols",
        5: "Fittings",
        6: "Handicrafts"
    };

    const statuesSubTable = ["Miniature", "Half-sized", "Life-sized", "Giant-sized", "Abstract", "Magic Statue"];
    const furnitureSubTable = ["Throne", "Chest", "Giant-Sized Chair", "Miniature Chair", "Stone Seat", "Stone Table"];
    const engravingsSubTable = ["Battle Scene", "Coronation", "Punishment", "Religious", "Romantic", "Curse"];
    const idolsSubTable = ["Stone", "Plaster", "Metal", "Wooden", "Crystal", "Bone"];
    const fittingsSubTable = ["Faucet", "Lamp", "Bell", "Fresco", "Hinges", "Knocker"];
    const handicraftsSubTable = ["Basket", "Vase", "Miniature Painting", "Abacus", "Ship's Figurehead", "Bust"];

    // Roll to determine the type of antique
    const rollType = await new Roll("1d6").evaluate();
    const selectedType = antiqueTypes[rollType.total];

    // Roll on the appropriate sub-table based on the selected antique type
    let details = "";
    switch (selectedType) {
        case "Statues":
            const statueRoll = await new Roll("1d6").evaluate();
            details = statuesSubTable[statueRoll.total - 1];
            break;
        case "Furniture":
            const furnitureRoll = await new Roll("1d6").evaluate();
            details = furnitureSubTable[furnitureRoll.total - 1];
            break;
        case "Engravings":
            const engravingsRoll = await new Roll("1d6").evaluate();
            details = engravingsSubTable[engravingsRoll.total - 1];
            break;
        case "Idols":
            const idolsRoll = await new Roll("1d6").evaluate();
            details = idolsSubTable[idolsRoll.total - 1];
            break;
        case "Fittings":
            const fittingsRoll = await new Roll("1d6").evaluate();
            details = fittingsSubTable[fittingsRoll.total - 1];
            break;
        case "Handicrafts":
            const handicraftsRoll = await new Roll("1d6").evaluate();
            details = handicraftsSubTable[handicraftsRoll.total - 1];
            break;
    }

    // Update game.recentEncounterResult to include both type and details
    game.recentEncounterResult = `${selectedType}: ${details}`;
    ChatMessage.create({
        speaker: ChatMessage.getSpeaker(),
        content: `<h2>Antiques - ${selectedType}</h2><p>${details}</p>`
    });
}

// Attach the function to the window object for dynamic execution
window.executeAntiques = executeAntiques;
