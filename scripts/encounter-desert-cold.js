// encounter-desert-cold.js (edit)
export async function execute() {
    console.log("Executing cold desert encounter...");
  
    // Step 1: Roll for encounter rarity using 2d10
    const rarityRoll = await new Roll("2d10").evaluate();  // Use await for async evaluation
    let rarity = "";
  
    if (rarityRoll.total === 2) {
      rarity = "very rare";
    } else if (rarityRoll.total === 3 || rarityRoll.total === 20) {
      rarity = "rare";
    } else if (rarityRoll.total >= 4 && rarityRoll.total <= 17) {
      rarity = "uncommon";
    } else if (rarityRoll.total === 18 || rarityRoll.total === 19) {
      rarity = "uncommon";
    } else {
      console.error("Unexpected rarity roll result:", rarityRoll.total);
      return;
    }
  
    // Step 2: Roll on the respective encounter table (1d100)
    const encounterRoll = await new Roll("1d100").evaluate();  // Use await for async evaluation
    let encounterResult = "";
  
    // Define encounter tables based on rarity
    const encounterTables = {
      "very rare": [
        "Banshee (MM); night", "Crypt thing (MM)", "Death knight (MM)", "Ghost (MM); night",
        "Hag, Annis (MM); night", "Hag, Green (MM); night", "Haunt (MM)", "Heucuva (MM)",
        "Human, Adventurer (MM)", "Phantom (MM)", "Revenant (MM); night", "Skeleton, Animal (MM)",
        "Skeleton, Monster (MM)", "Skeleton, Warrior (MM)", "Zombie, Monster (MM); night",
        "Zombie, Ju-ju (MM); night", "Zombie, Lord (MM); night", "Dimensional Warper (FR1)",
        "Naga, Bone (MCA)", "Spectral Wizard (MCA)", "Wolf, Zombie (MM); night", 
        "Ghost, Casura (MCB)", "Ghost, Ker (MCB); night", "Banelich (MCB)", "Coffer Corpse (MCC)",
        "Shadowwraith, Lesser/Greater (MCD)", "Giant, Frost (MM)", "Hydra, Cryohydra (MM)",
        "Mephit, Ice (MM)", "Remorhaz (MM)", "Wolf, Winter (MM)", "Haun (FR1); night",
        "Ice Lizard (FF); day", "Scathe, Larvae (FF); night"
      ],
      "rare": [
        "Gargoyle (MM)", "Ghoul (MM); night", "Human, Barbarian/Nomad (MM)",
        "Human, Berserker/Dervish (MM)", "Wight (MM); night", "Wraith (MM); night",
        "Ghoul, Ghast (MM); night", "Skeleton (MM)", "Skeleton, Giant (MM)", "Zombie, Common (MM); night",
        "Helmed Horror (MCA)", "Ghoul-kin, Soultaker (MCB); night", "Ghoul-kin, Witherer (MCB); night",
        "Wraith-Spider (MCB); night", "Bane dead (MCC)", "Bat, Bonebat (MCB)", "Dread Warrior (MCC)",
        "Deadly Pudding, White (MM)", "Troll, Ice (MM)", "Haundar (FR1); day", 
        "Mara (“Great Walker”) (FR1); night", "Sha’ae (FR1); day", "Sealtie (FF); night", 
        "Troll, Snow (MCB); night", "Dwarf, Arctic - Inugaakalikurit (MCC)"
      ],
      "uncommon": ["No Encounter"], // No uncommon monsters
      "common": ["No Encounter"] // No common monsters
    };
  
    // Choose the encounter from the respective rarity table
    if (rarity in encounterTables) {
      if (encounterTables[rarity].length === 0) {
        console.log(`No ${rarity} monsters in cold desert. Ignoring result.`);
        return;
      }
      const encounterList = encounterTables[rarity];
      const index = (encounterRoll.total - 1) % encounterList.length; // Ensure the index is within the length
      encounterResult = encounterList[index];
    } else {
      console.error("Invalid rarity type:", rarity);
      return;
    }
  
    // Store the encounter result in the game data and output to chat
    const resultMessage = `<strong>Cold Desert Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;
  
    ChatMessage.create({
      speaker: { alias: "Cold Desert Adventure" },
      content: `<h2>Cold Desert Encounter</h2><p>${resultMessage}</p>`
    });
  }
  