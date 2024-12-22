// encounter-salt-water-temperate.js (edit)
export async function execute() {
    console.log("Executing temperate salt water encounter...");

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
            "Topaz dragon (MM)", "Dragon Turtle (MM)", "Elemental, Water Kin, Nereid (MM)", "Elemental, Water Kin, Water weird (MM)",
            "Elf, Aquatic (FR1)", "Fish, Giant Eel (MM)", "Fish, Marine Eel (MM)", "Fish, Giant Seahorse (MM)",
            "Fish, Giant Shark (MM)", "Ghoul, Lacedon (MM); night", "Giant, Storm (MM)", "Lycanthrope, Seawolf, Lesser (MM)",
            "Lycanthrope, Seawolf, Greater (MM)", "Morkoth (MM); night", "Plant, Intelligent, Kelpie (MM)", "Squid, Kraken (MM)",
            "Tako, Female (MM)", "Whale, Giant (MM)", "Whale, Leviathan (MM)", "Vrungs (FR2)",
            "Dragon, Neutral, Pearl (MCA)", "Nautilus, Giant (MCA)", "Amiq Rasol (MCB)", "Dragon, Brine (MCB)",
            "Lycanthrope, Wershark (MCB)", "Fish, Deep Ocean, Death Minnow (MCD)", "Fish, Vurgens (Giant Gulpel Eel) (MCD)", "Amonite, Golden (MCD)"
        ],
        "rare": [
            "Crabman (MM)", "Giant crab (MM)", "Fish, Shark (MM)", "Gargoyle, Margoyle (MM)",
            "Hag, Sea (MM); night", "Hippocampus (MM)", "Octopus, Giant (MM)", "Sprite, Sea (MM); day",
            "Squid, Giant (MM)", "Tako, Male (MM)", "Triton (MM)", "Urchin, Green (MM)",
            "Urchin, Red (MM)", "Whale, Narwhal (MM)", "Zombie, Sea (MM); night", "Ascallion, Adult Female (Mother) (FR2)",
            "Ascallion, Young (Biter) (FR2)", "Ascallion, Adult Male (Shadow) (FR2)", "Fladwerf (FF)", "Frog, Killer (MM)",
            "Lythlyx (MCA)", "Xantravar (Stinging Horror) (MCA)", "Dragon-kin, Sea Wyrm (MCA)", "Fish, Floating Eye (MCB)",
            "Eel, Giant Morsy (MCC)", "Roll on Table 26.2: Uncommon monsters in temperate salt waters"
        ],
        "uncommon": [
            "Dolphin (MM)", "Merman (MM)", "Sahuagin (MM); night", "Troll, Saltwater (MM); night",
            "Fish, Hetfish (MCB)", "Fish, Deep Ocean, Angler Fish (MCD)", "Fish, Deep Ocean, Gulper (MCD)", "Fish, Deep Ocean, Viperfish (MCD)",
            "Roll on Table 26.3: Rare monsters in temperate salt waters"
        ],
        "common": [
            "Human, Merchant Sailor/Fisherman (MM)", "Human, Pirate/Buccaneer (MM)", "Human, Sailor (MM)", "Whale, Common (MM)",
            "Whale, Killer (Orca) (MM)", "Roll on Table 26.2: Uncommon monsters in temperate salt waters"
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
    const resultMessage = `<strong>Temperate Salt Water Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;

    ChatMessage.create({
        speaker: { alias: "Temperate Salt Water Adventure" },
        content: `<h2>Temperate Salt Water Encounter</h2><p>${resultMessage}</p>`
    });
}
