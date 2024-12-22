// encounter-desert-temperate.js (edit)
export async function execute() {
    console.log("Executing temperate desert encounter...");
  
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
        "Death knight (MM)", "Doppelganger (MM)", "Gold dragon (MM); day", "Genie, Jann (MM); day",
        "Ghost (MM); night", "Gnome, Spriggan (MM)", "Gremlin, Fremlin (MM); night",
        "Gremlin, Fremlin (MM); day", "Gremlin, Galltrit (MM); night", "Hag, Annis (MM); night",
        "Hag, Green (MM); night", "Haunt (MM)", "Hell Hound (MM)", "Heucuva (MM)",
        "Homonculous (MM)", "Human, Adventurer (MM)", "Human, Barbarian/Nomad (MM)",
        "Human, Berserker/Dervish (MM)", "Human, Knight (MM)", "Human, Priest (MM)",
        "Human, Wizard (MM)", "Imp (MM)", "Imp, Quasit (MM)", "Lycanthrope, Werefox (Foxwoman) (MM); night",
        "Medusa, Glyptar (MM)", "Naga, Guardian (MM)", "Nymph (MM)", "Ogre, Half-Ogre (MM)", "Phantom (MM)",
        "Plant, Dangerous, Snapper-saw (MM)", "Revenant (MM); night", "Skeleton, Animal (MM); night",
        "Skeleton, Monster (MM)", "Skeleton, Warrior (MM)", "Troll, Two-headed (MM)", 
        "Zombie, Ju-ju (MM); night", "Zombie Lord (MM); night", "Basilisk, Dreadisk (MM); day",
        "Dimensional Warper (FR1)", "Carnivorous Plant, Black Willow (FR1)", "Ring-worm (FR1)", 
        "Tempest (FR1)", "Beholder-kin, Spectator (FR2); day", "Berbalang (FR2); full moon night",
        "Darkenbeast (FR2); night", "Apparition (FF)", "Bird, Talking (MCA)", "Banshee Bones (MCA)",
        "Winged Cat, Lesser (MCA)", "Dragon-kin (MCA)", "Elemental Kin, Earth, Crysmal (MCA); day",
        "Elemental Vermin, Air (Duster) (MCA)", "Elemental Vermin, Earth (Crawler) (MCA)",
        "Flameskull (MCA)", "Greelox (MCA); night", "Magebane (MCA)", "Naga, Bone (MCA)",
        "Nishruu (MCA)", "Spectral Wizard (MCA)", "Wolf, Dread (MCA)", "Wolf, Stone (MCA)",
        "Wolf, Vampiric (MCA); night", "Wolf, Zombie (MCA)", "Doppleganger, Greater (MCB)",
        "Ghost, Casura (MCB); night", "Hakeashar (MCB)", "Alhoon (Illithich) (MCB); night",
        "Banelich (MCB)", "Coffer Corpse (MCC)", "Disenchanter (MCC)", "Lion, Grandfather Plaque (MCC)",
        "Ibrandlin (MCC)", "Ogre, Ondonti (MCC)", "Snake, Messenger (MCC)", "Nymph, Unseelie (MCC)",
        "Shadowlash, Lesser/Greater (MCC)", "Gorgimera (MM)", "Blue dragon (MM)", "Naga, Dark (MM)",
        "Snake, Amphisbanea (MM)", "Firetail, Tshala (FR1)", "Baelnorn (MCA)", 
        "Dragon, Fang (Draco Dentus Terriblus)"
      ],
      "rare": [
        "Bat, azmyth (MM)", "Bat, huge (mobat) (MCA); night", "Bat, sinister (MM)",
        "Behir (MM); day", "Ghoul, Ghast (MM); night", "Human, Barbarian/Nomad (MM)",
        "Human, Berserker/Dervish (MM)", "Human, Tribesman (MM)", "Lycanthrope, Wereboar (MM)",
        "Medusa (MM)", "Medusa, Greater (MM)", "Mongrelman (MM); night", "Mongrelman (MM); day",
        "Skeleton, Giant (MM)", "Spider, Phase (MM)", "Troll, Giant (MM)", "Vampire (MM); night",
        "Zombie, Common (MM); night", "Gloomwing, Flying Serpent (FR1)", "Claw, Crawling (FR2)",
        "Sull (FR1)", "Hellcat (FF)", "Penanggalan (FF); night", "Baneguard (MCA)", 
        "Foulwing (MCA)", "Helmed Horror (MCA)", "Metalmaster (Sword Slug) (MCA)", 
        "Ghoul-kin, Soultaker (MCB); night", "Ghoul-kin, Witherer (MCB); night", 
        "Wraith-Spider (MCB); night", "Banehead (MCC)", "Bat, Bonebat (MCC)", 
        "Chosen One (MCC)", "Dread Warrior (MCC)", "Chimera (MM)", "Pyrolisk (MM)",
        "Elemental, Earth Kin, Sandling (MM)", "Giant, Fire (MM)", "Gorgon (MM); day",
        "Jackalwere (MM)", "Leucrotta (MM)", "Beguiler (FR1); day", "Firetail, Lesser (FR2)",
        "Hendar (FR1); night", "Manni (FR1)", "Orpsu (FR1); night", "Thunder Child (FF); night",
        "Banelar (MCA)", "Dragon, Electrum (MCA)", "Lythlyx (MCA)", "Tree, Death's Head (MCA)",
        "Ghul, Great (MCB); night", "Laerti (MCB); night"
      ],
      "uncommon": [
        "Basilisk, lesser (MM); day", "Bat, large (giant) (MCA); night", "Bat, night hunter (MM); night",
        "Bear, cave (MM); day", "War dog (MM)", "Gargoyle (MM)", "Ghoul (MM); night", "Human, Pilgrim (MM)",
        "Human, Soldier (MM)", "Kenku (MM)", "Kobold (MM); night", "Lycanthrope, Wererat (MM); night",
        "Manticore (MM)", "Orc, Orog (MM)", "Snake, Poison, Normal (MM)", "Snake, Poison, Giant (MM)",
        "Troll (MM); night", "Wight (MM); night", "Worm, Rot Grub (MM)", "Wraith (MM); night",
        "Ruve (FF)", "Aranea (MCC)", "Cockatrice (MM)", "Goblin (MM); night", "Hobgoblin (MM)",
        "Horse, Wild (MM); day", "Thri-Kreen (MM)", "Morin (FR1)", "Sand Cat (FR2); night", 
        "Fire, Falcon (FF); day", "Dog, Saluqi (MCA); night", "Addazahr (MCB); day"
      ],
      "common": [
        "Bat, common (MCA); night", "Camel (MCA)", "Cattle (MM)", "Sheep (MCA)", 
        "Beetle, giant, boring (MM); night", "Beetle, giant, fire (MM); night", 
        "Broken one, common (MM); night", "Centipede, giant (MM)", "Centipede, huge (MM)",
        "Wild dog (MM)", "Human, Peasant/Serf (MM)", "Human, Slave (MM)", 
        "Lycanthrope, Werewolf (MM); night", "Ogre (MM)", "Rat, Giant (MM); night", 
        "Jarbo (MCA)"
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
    const resultMessage = `<strong>Temperate Desert Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;
  
    ChatMessage.create({
      speaker: { alias: "Temperate Desert Adventure" },
      content: `<h2>Temperate Desert Encounter</h2><p>${resultMessage}</p>`
    });
  }
  