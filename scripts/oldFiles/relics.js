// Relics Script
async function executeRelics() {
    const relicTypes = {
        1: { name: "Tools", table: ["Ladder", "Plow", "Pick", "Clock", "Hoe", "Axe"] },
        2: { name: "Machines", table: ["Loom", "Grinding Wheel", "Clock", "Balance", "Potter's Wheel", "Printing Press"] },
        3: { name: "Tombs", table: ["Grave", "Sepulcher", "Mausoleum", "Catacombs", "Vault", "Crypt"] },
        4: { name: "Armor", table: ["Breastplate", "Greaves", "Gauntlets", "Helm", "Chainmail", "Shield"] },
        5: { name: "Weapons", table: ["Dagger", "Scimitar", "Hand Axe", "Spear", "Trident", "Battle Axe"] },
        6: { name: "Containers", table: ["Barrels", "Urns", "Trunks", "Jars", "Bottles", "Boxes"] }
    };

    const conditions = ["Partially covered", "Fully covered", "Above ground", "Rocky slope", "Inside cavern", "In crevice", "Beneath overhang", "Large crater", "Partially sunken", "Charred & Burnt"];
    const coverings = ["Sand", "Ashes", "Cinders", "Earth", "Thicket", "Mold", "Vines", "Rocks", "Web & dust", "Moss"];
    const states = ["Crumpled & decayed", "Disfigured & defaced", "Worm-eaten", "Crystallized & petrified", "Corroded & eroded", "Collapsed & tumbled", "Moldy & contaminated", "Dangerous operational", "Partially operational", "Fully operational"];
    const keepers = ["Mechanical", "Giant types", "Dragon types", "Undead types", "Lycanthropes", "True giants", "Animals", "Insects", "Trap", "None"];

    const conditionRoll = await new Roll("1d10").evaluate();
    const coveringRoll = await new Roll("1d10").evaluate();
    const stateRoll = await new Roll("1d10").evaluate();
    const keeperRoll = await new Roll("1d10").evaluate();

    const condition = conditions[conditionRoll.total - 1];
    const covering = coverings[coveringRoll.total - 1];
    const state = states[stateRoll.total - 1];
    const keeper = keepers[keeperRoll.total - 1];

    const relicTypeRoll = await new Roll("1d6").evaluate();
    const relicType = relicTypes[relicTypeRoll.total];

    const subTableRoll = await new Roll("1d6").evaluate();
    const detail = relicType.table[subTableRoll.total - 1];

    game.recentEncounterResult = `${relicType.name}: ${detail} - Condition: ${condition}, Covering: ${covering}, State: ${state}, Keeper: ${keeper}`;

    ChatMessage.create({
        speaker: ChatMessage.getSpeaker(),
        content: `<h2>Relics Encounter</h2>
                  <p>Relic Type: <strong>${relicType.name}</strong></p>
                  <p>Detail: ${detail}</p>
                  <p>Condition: ${condition}<br>Covering: ${covering}<br>State: ${state}<br>Keeper: ${keeper}</p>`
    });
}

// Register the function globally using a unique identifier
window.executeRelics = executeRelics;
