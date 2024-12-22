// encounter-salt-water-cold.js (edit)
export async function execute() {
    console.log("Executing cold salt water encounter...");

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
            "Topaz dragon (MM)", "Elemental, Water Kin, Water weird (MM)", "Fish, Shark (MM)", "Fish, Giant Shark (MM)",
            "Ghoul, Lacedon (MM); night", "Lycanthrope, Seawolf, Lesser (MM)", "Lycanthrope, Seawolf, Greater (MM)", "Morkoth (MM); night",
            "Selkie (MM)", "Squid, Kraken (MM)", "Whale, Giant (MM)", "Whale, Leviathan (MM)",
            "Vrungs (FR2)", "Nautilus, Giant (MCA)", "Amiq Rasol (MCB)", "Dragon, Brine (MCB)",
            "Lycanthrope, Wershark (MCB)"
        ],
        "rare": [
            "Giant crab (MM)", "Gargoyle, Margoyle (MM)", "Hag, Sea (MM); night", "Hippocampus (MM)",
            "Octopus, Giant (MM)", "Squid, Giant (MM)", "Triton (MM); day", "Whale, Narwhal (MM)",
            "Zombie, Sea (MM); night", "Ascallion, Adult Female (Mother) (FR2)", "Ascallion, Young (Biter) (FR2)", "Ascallion, Adult Male (Shadow) (FR2)",
            "Elemental Vermin, Water (Spitter) (MCA)", "Lythlyx (MCA)", "Xantravar (Stinging Horror) (MCA)", "Fish, Floating Eye (MCB)"
        ],
        "uncommon": [
            "Dolphin (MM)", "Troll, Saltwater (MM); night", "Fish, Hetfish (MCB)",
            "Roll on Table 27.3: Rare monsters in cold salt waters"
        ],
        "common": [
            "Human, Merchant Sailor/Fisherman (MM)", "Human, Sailor (MM)", "Whale, Common (MM)", "Whale, Killer (Orca) (MM)",
            "Roll on Table 27.2: Uncommon monsters in cold salt waters"
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
    const resultMessage = `<strong>Cold Salt Water Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;

    ChatMessage.create({
        speaker: { alias: "Cold Salt Water Adventure" },
        content: `<h2>Cold Salt Water Encounter</h2><p>${resultMessage}</p>`
    });
}
