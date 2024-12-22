// encounter-salt-water-warm.js
export async function execute() {
    console.log("Executing warm salt water encounter...");

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
            "Bronze dragon (MM)", "Mist dragon (MM)", "Dragon Turtle (MM)", "Elemental, Water Kin, Nereid (MM)",
            "Elemental, Water Kin, Water weird (MM)", "Fish, Pungi Ray (MM)", "Fish, Giant Seahorse (MM)", "Fish, Giant Shark (MM)",
            "Fish, Sting Ray (MM)", "Ghoul, Lacedon (MM); night", "Giant, Reef (MM); day", "Ixitxachitl (MM)",
            "Lycanthrope, Seawolf, Lesser (MM)", "Morgkoth (MM); night", "Plant, Intelligent, Kelpie (MM)", "Squid, Kraken (MM)",
            "Tako, Female (MM)", "Urchin, Silver (MM)", "Whale, Giant (MM)", "Whale, Leviathan (MM)",
            "Vrungs (FR2)", "Dragon, Neutral, Pearl (MM)", "Nautilus, Giant (MCA)", "Amph Rasol (MCA)",
            "Lycanthrope, Wershark (MCB)", "Fish, Deep Ocean, Death Minnow (MCD)", "Fish, Deep Ocean, Gulpel Eel (MCD)", "Amonite, Golden (MCD)"
        ],
        "rare": [
            "Crabman (MM)", "Giant crab (MM)", "Fish, Dragonfish (MM)", "Fish, Lamprey (MM);rare",
            "Fish, Manta Ray (MM)", "Fish, Shark (MM)", "Gargoyle, Margoyle (MM)", "Hag, Sea (MM); night",
            "Hippocampus (MM)", "Locathah (MM)", "Octopus, Giant (MM)", "Sprite, Sea (MM); day",
            "Squid, Giant (MM)", "Tako, Male (MM)", "Triton (MM)", "Urchin, Green (MM)",
            "Urchin, Red Urchin (MM)", "Whale, Narwhal (MM)", "Zombie, Sea (MM); night", "Ascallion, Adult Female (Mother) (FR2)",
            "Ascallion, Young (Biter) (FR2)", "Ascallion, Adult Male (Shadow) (FR2)", "Fladwerf (FF)", "Frog, Killer (MM)",
            "Lythlyx (MCA)", "Xantravar (Stinging Horror) (MCA)", "Dragon-kin, Sea Wyrm (MCA)", "Fish, Floating Eye (MCB)",
            "Eel, Giant Morsy (MCC)", "Anemone, Giant Sea (MCD)", "Clam, Giant (Oyster) (MCD)", "Octopus, Octo-Hide (MCD)"
        ],
        "uncommon": [
            "Dolphin (MM)", "Sea Lion (MM); day", "Troll, Saltwater (MM); night", "Urchin, Black (MM)",
            "Fish, Hetfish (MCB)", "Fish, Masher (MCB); night", "Jellyfish, Giant (MCB)", "Fish, Deep Ocean, Angler Fish (MCD)",
            "Fish, Deep Ocean, Gulpel (MCD)", "Fish, Deep Ocean, Viperfish (MCD)", "Fish, Tropical, Giant Grouper (MCD)", "Fish, Tropical, Morena (MCD)",
            "Fish, Tropical, Porcupine Fish (MCD)", "Fish, Tropical, Electric Ray (MCD)", "Octopus, Oto-Jelly (MCD)", "Roll on Table 25.3: Rare monsters in warm salt waters"
        ],
        "common": [
            "Fish, Barracuda (MM)", "Human, Merchant Sailor/Fisherman (MM)", "Human, Pirate/Buccaneer (MM)", "Human, Sailor (MM)",
            "Plant, Intelligent, Strangle-weed (MM)", "Whale, Common (MM)", "Whale, Killer (Orca) (MM)", "Roll on Table 25.2: Uncommon monsters in warm salt waters"
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
    const resultMessage = `<strong>Warm Salt Water Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;

    ChatMessage.create({
        speaker: { alias: "Warm Salt Water Adventure" },
        content: `<h2>Warm Salt Water Encounter</h2><p>${resultMessage}</p>`
    });
}
