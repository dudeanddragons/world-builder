// encounter-fresh-water-cold.js (edit)
export async function execute() {
    console.log("Executing cold sweet water encounter...");

    // Step 1: Roll for encounter rarity using 2d10
    const rarityRoll = await new Roll("2d10").evaluate();
    let rarity = "";

    if (rarityRoll.total === 2) {
        rarity = "very rare";
    } else if (rarityRoll.total === 3 || rarityRoll.total === 20) {
        rarity = "rare";
    } else if (rarityRoll.total >= 4 && rarityRoll.total <= 17) {
        rarity = "uncommon";
    } else if (rarityRoll.total === 18 || rarityRoll.total === 19) {
        rarity = "common";
    } else {
        console.error("Unexpected rarity roll result:", rarityRoll.total);
        return;
    }

    // Step 2: Roll on the respective encounter table (1d100)
    const encounterRoll = await new Roll("1d100").evaluate();
    let encounterResult = "";

    // Define encounter tables based on rarity
    const encounterTables = {
        "very rare": [
            "Elemental, Water Kin, Water weird (MM)", "Fish, Giant Catfish (MM)", "Fish, Giant Pike (MM)", "Frog, Killer (MM)",
            "Ghoul, Lacedon (MM); night", "Skuz (FR1)", "Undead Lake Monster (MCA)", "Fish, Verne (MCB)"
        ],
        "rare": [
            "Fish, Quipper (MM)", "Frog, Poisonous (MM)", "Hag, Sea (MM); night", "Hippocampus (MM)",
            "Giant Toad, Ice (MM); day", "Troll, Freshwater (MM); day", "Umber Hulk, Vodyanoi (MM)", "Elemental Vermin, Water (Spitter) (MCA)",
            "Lythlyx (MCA)", "Marl (MCB); day"
        ],
        "uncommon": [
            "Frog, Giant (MM)", "Naga, Water (MM)", "Ogre, Merrow (MM)", "Fish, Hetfish (MCB)"
        ],
        "common": [
            "Beetle, giant, water (MM)", "Human, Merchant Sailor/Fisherman (MM)", "Human, Sailor (MM)", "Roll on Table 24.2: Uncommon monsters in cold sweet waters"
        ]
    };

    // Choose the encounter from the respective rarity table
    if (rarity in encounterTables) {
        const encounterList = encounterTables[rarity];
        const index = (encounterRoll.total - 1) % encounterList.length; // Ensure the index is within the length
        encounterResult = encounterList[index];
    } else {
        console.error("Invalid rarity type:", rarity);
        return;
    }

    // Store the encounter result in the game data and output to chat
    const resultMessage = `<strong>Cold Sweet Water Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;

    ChatMessage.create({
        speaker: { alias: "Cold Sweet Water Adventure" },
        content: `<h2>Cold Sweet Water Encounter</h2><p>${resultMessage}</p>`
    });
}
