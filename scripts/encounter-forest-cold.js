// encounter-forest-cold.js
export async function execute() {
    console.log("Executing cold forest encounter...");
  
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
        "Banshee (MM); night", "Basilisk, greater (MM); day", "Dracolisk (MM); day", "Broken one, greater (MM); night",
        "Crypt thing (MM)", "Death knight (MM)", "Doppelganger (MM)", "Gold dragon (MM)", "Genie, Jann (MM); day",
        "Ghost (MM); night", "Gnome, Spriggan (MM)", "Gremlin (MM); night", "Gremlin, Fremlin (MM); day",
        "Gremlin, Galltrit (MM); night", "Hag, Annis (MM); night", "Hag, Green (MM); night", "Haunt (MM)",
        "Hell Hound (MM)", "Heucuva (MM)", "Homonculous (MM)", "Human, Adventurer (MM)", "Human, Knight (MM)",
        "Human, Priest (MM)", "Human, Wizard (MM)", "Imp (MM)", "Imp, Quasit (MM)", 
        "Lycanthrope, Werefox (Foxwoman) (MM); night", "Medusa, Glyptar (MM)", "Naga Guardian (MM)", "Nymph (MM)",
        "Ogre, Half-Ogre (MM)", "Phantom (MM)", "Revenant (MM); night", "Skeleton, Animal (MM)", 
        "Skeleton, Monster (MM)", "Troll, Two-headed (MM)", "Zombie, Monster (MM); night", 
        "Zombie, Ju-ju (MM); night", "Zombie, Lord (MM); night", "Basilisk, Dracolisk (MM); day",
        "Ring-worm (FR1)", "Carnivorous Plant, Black Willow (FR1)", "Tempest (FR1)", 
        "Beholder-kin, Spectator (FR2); day", "Berbalang (FR2); full moon night", "Darkenbeast (FR2); night",
        "Apparition (FF)", "Blazing Bones (MCA)", "Winged Cat, Lesser (MCA)", "Dragon-kin (MCA)", 
        "Elemental Kin, Earth, Crysmal (MCA); day", "Elemental Vermin, Air (Duster) (MCA)", 
        "Elemental Vermin, Earth (Crawler) (MCA)", "Flameskull (MCA)", "Greelox (MCA); night", "Magebane (MCA)",
        "Naga, Bone (MCA)", "Nishruu (MCA)", "Spectral Wizard (MCA)", "Wolf, Dread (MCA)", "Wolf, Stone (MCA)",
        "Wolf, Zombie (MCA)", "Doppleganger, Greater (MCB)", "Dragon, Half-Dragon (MCB)", "Ghost, Casura (MCB)",
        "Ghost, Kerr (MCB); night", "Hakeshaar (MCB)", "Alhoon (Illithlich) (MCC)", "Banelich (MCC)", 
        "Coffer Corpse (MCC)", "Disenchanter (MCC)", "Gargoyle, Archer/Spouter/Stone Lion/Grandfather Plaque (MCC)",
        "Ibrandlin (MCC)", "Ore, Ondonti (MCC)", "Snake, Messenger (MCC)", "Nymph, Unseelie (MCD)", 
        "Shadowkawn, Lesser/Greater (MCD)", "Giant, Frost (MM)", "Bind, Giant Owl (MM)", "Troll, Snow (MM); night",
        "Wolf, Winter (MM)", "Linnanan Shee (FR1); night", "Silver Dog (FR1); night", 
        "Ice Lizard (FF); day", "Feystag (MCA)", "Elemental, Nature (MCB)", "Flumph, Monastic (CM2); night", 
        "Owlbear, Arctic (MCC)", "Unicorn, Black (MCB); night"
      ],
      "rare": [
        "Behir (MM); day", "Ghoul, Ghast (MM); night", "Human, Barbarian/Nomad (MM)", "Human, Berserker/Dervish (MM)",
        "Human, Tribesman (MM)", "Lycanthrope, Wereboar (MM)", "Medusa (MM)", "Medusa, Greater (MM)", 
        "Mongrelman (MM); night", "Ogre, Ogrellon (MM)", "Plant, Dangerous, Thorn-Slinger (MM)", "Skeleton (MM)",
        "Skeleton, Giant (MM)", "Spider, Phase (MM)", "Troll, Giant (MM)", "Vampire (MM); night", 
        "Zombie, Common (MM); night", "Gloomwing, Flying Serpent (FR1)", "Claw, Crawling (FR2)", "Sull (FR1)", 
        "Hellcat (FF)", "Penanggalan (FF); night", "Baneguard (MCA)", "Foulwing (MCA)", "Helmed Horror (MCA)", 
        "Ghoul-kin, Soultaker (MCB); night", "Ghoul-kin, Witherer (MCB); night", "Wraith-Spider (MCB); night",
        "Banedead (MCC)", "Bat, Bonebat (MCB)", "Burbur (MCC)", "Chosen One (MCC)", "Dread Warrior (MCC)", 
        "Treant (MM)", "Bat, Bonebat (MCB)", "Wolf, Worg (MM)", "Wolf, Dire (MM)", "Ghoul-kin, Witherer (MCB)",
        "Frost (FF)", "Thylacine (FR2)", "Gnome Forest (MM); day", "Hydra, Cryohydra (MM)"
      ],
      "uncommon": [
        "Basilisk, lesser (MM); day", "Bat, large (giant) (MCA); night", "Bear, cave (MM); day", "War dog (MM)", 
        "Gargoyle (MM)", "Ghoul (MM); night", "Human, Pilgrim (MM)", "Kenku (MM)", "Kobold (MM); night", 
        "Lycanthrope, Wererat (MM); night", "Manticore (MM)", "Orc, Orog (MM)", "Snake, Poison, Normal (MM)",
        "Troll (MM); night", "Wight (MM); night", "Wraith (MM); night", "Gibberling (MM); night", "Satyr (MM)",
        "Spider, Giant (MM)", "Wolf (MM)", "Cat, Wild (FR1)", "Carnivorous Plant, Whipweed (FR1)", "Rohch, Killer (FR1)",
        "Zygraat (FF)", "Rohch, Wood (FR1)", "Hobgoblin (MM)"
      ],
      "common": [
        "Cattle (MCA)", "Sheep (MCA)", "Beetle, giant, boring (MM); night", "Beetle, giant, fire (MM); night",
        "Broken one, common (MM); night", "Wild dog (MM)", "Human, Peasant/Serf (MM)", "Lycanthrope, Werewolf (MM); night",
        "Ogre (MM)", "Ore (MM)", "Rat, Giant (MM); night", "Beetle, giant, bombardier (MM); day", 
        "Beetle, giant, stag (MM)", "Mammal, Wild Boar (MM)"
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
    const resultMessage = `<strong>Cold Forest Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;
  
    ChatMessage.create({
      speaker: { alias: "Cold Forest Adventure" },
      content: `<h2>Cold Forest Encounter</h2><p>${resultMessage}</p>`
    });
  }
  