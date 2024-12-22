// encounter-forest-temperate.js (edit  )
export async function execute() {
    console.log("Executing temperate forest encounter...");
  
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
        "Banshee (MM); night", "Basilisk, greater (MM); day", "Dracolisk (MM); day",
        "Broken one, greater (MM); night", "Megalo-centipede (MM)", "Crypt thing (MM)",
        "Death knight (MM)", "Doppelganger (MM)", "Gold dragon (MM)", "Genie, Jann (MM); day",
        "Ghost (MM); night", "Gnome, Spriggan (MM)", "Gremlin (MM); night",
        "Gremlin, Fremlin (MM); day", "Gremlin, Galltrit (MM); night",
        "Hag, Annis (MM); night", "Hag, Green (MM); night", "Haunt (MM)",
        "Hell Hound (MM)", "Heucuva (MM)", "Homunculous (MM)", "Human, Adventurer (MM)",
        "Human, Barbarian/Nomad (MM)", "Human, Berserker/Dervish (MM)",
        "Human, Knight (MM)", "Human, Priest (MM)", "Human, Wizard (MM)",
        "Imp (MM)", "Imp, Quasit (MM)", "Lycanthrope, Werefox (Foxwoman) (MM); night",
        "Medusa, Glyptar (MM)", "Naga, Guardian (MM)", "Nymph (MM)",
        "Ogre, Half-Ogre (MM)", "Phantom (MM)", "Plant, Dangerous, Snapper-saw (MM)",
        "Revenant (MM); night", "Skeleton, Animal (MM)", "Skeleton, Monster (MM)",
        "Troll, Two-headed (MM)", "Zombie, Monster (MM); night", "Zombie, Ju-ju (MM); night",
        "Basilisk, Dracolisk (MM); day", "Carnivorous Plant, Black Willow (FR1)",
        "Dimensional Warper (FR1)", "Ring-worm (FR1)", "Beholder-kin, Spectator (FR2); day",
        "Berbalang (FR2); full moon night", "Darkenbeast (FR2); night", "Blazing Bones (MCA)",
        "Winged Cat, Lesser (MCA)", "Dragon-kin (MCA)", "Flameskull (MCA)", "Naga, Bone (MCA)",
        "Spectral Wizard (MCA)", "Wolf, Dread (MCA)", "Doppelganger, Greater (MCB)",
        "Ghost, Gasura (MCB)", "Hakeshaar (MCB)", "Banelich (MCB)", "Coffer Corpse (MCC)",
        "Gargoyle, Archer/Spouter/Stone Lion (MCC)", "Ibrandlin (MCC)", "Ore, Ondonti (MCC)",
        "Nyra, Dark (MM)", "Firetail, Bright (FR1)", "Tree, Death's Head (MCA)", "Unicorn, Black (MCC); night",
        "Thunder Child (FF); night", "Thunder Elemental (MCA)", "Firetail, Black (FR2); day"
      ],
      "rare": [
        "Bat, azmyth (MM)", "Bat, huge (mobat) (MCA); night", "Bat, sinister (MM)",
        "Behir (MM); day", "Ghoul, Ghast (MM); night", "Human, Barbarian/Nomad (MM)",
        "Human, Berserker/Dervish (MM)", "Human, Tribesman (MM)", "Lycanthrope, Wereboar (MM)",
        "Medusa (MM)", "Medusa, Greater (MM)", "Mongrelman (MM); night", "Ogre, Ogrillon (MM)",
        "Skeleton, Giant (MM)", "Spider, Phase (MM)", "Troll, Giant (MM)", "Vampire (MM); night",
        "Zombie, Common (MM); night", "Gloomwing, Flying Serpent (FR1)", "Claw, Crawling (FR2)",
        "Penanggalan (FF); night", "Ghoul-kin, Soulstalker (MCB); night", "Ghoul-kin, Witherer (MCB); night",
        "Ghoul-kin, Lychguard (MCB)", "Banelich (MCB)", "Foulwing (MCA)", "Bat, Bonebat (MCB)",
        "Burbur (MCC)", "Dread Warrior (MCC)", "Chosen One (MCC)", "Plant, Dark Creeper (FR2); day",
        "Hellcat (FF)", "Evil Grimalkin (MM)", "Black dragon", "White dragon", "Dark Pegasus (MM)"
      ],
      "uncommon": [
        "Basilisk, lesser (MM); day", "Bat, large (giant) (MCA); night", "Bat, night hunter (MM); night",
        "Bear, cave (MM); day", "War dog (MM)", "Gargoyle (MM)", "Ghoul (MM); night",
        "Human, Pilgrim (MM)", "Human, Soldier (MM)", "Kenku (MM)", "Kobold (MM); night",
        "Lycanthrope, Wererat (MM); night", "Manticore (MM)", "Orc, Orog (MM)",
        "Snake, Poison, Normal (MM)", "Snake, Poison, Giant (MM)", "Troll (MM); night",
        "Wight (MM); night", "Wraith (MM); night", "Ruve (FF)", "Aranea (MCC)", "Mountain lion (MM) (dawn or dusk)",
        "Wild tiger (MM); night", "Cockatrice (MM)", "Elf (MM)", "Gibberling (MM); night",
        "Gloomwing Tenebrous Worm (MM)", "Gnoll (MM); night", "Goblin (MM); night",
        "Hobgoblin (MM)", "Human, Police/Constabulary (MM)", "Lizard, Giant (MM); day",
        "Mammal, Badger (MM)", "Mammal, Skunk (MM)", "Mammal, Goat (MM)"
      ],
      "common": [
        "Bat, common (MCA); night", "Cattle (MM)", "Sheep (MCA)", "Beetle, giant, boring (MM); night",
        "Beetle, giant, fire (MM); night", "Centipede, giant (MM)", "Centipede, huge (MM)",
        "Wild dog (MM)", "Human, Peasant/Serf (MM)", "Human, Slave (MM)", "Lycanthrope, Werewolf (MM); night",
        "Ogre (MM)", "Rat, Giant (MM); night", "Bear, black (MM); day", "Human, Bandit/Brigand (MM)",
        "Human, Soldier (MM)", "Wolf, Dire (MM)", "Spider, Large (MM)", "Giant Toad (MM)"
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
    const resultMessage = `<strong>Temperate Forest Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;
  
    ChatMessage.create({
      speaker: { alias: "Temperate Forest Adventure" },
      content: `<h2>Temperate Forest Encounter</h2><p>${resultMessage}</p>`
    });
  }
  