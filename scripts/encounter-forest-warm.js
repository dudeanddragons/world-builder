// encounter-forest-warm.js (edit)
export async function execute() {
    console.log("Executing warm forest encounter...");
  
    // Step 1: Roll for encounter rarity using 2d10
    const rarityRoll = await new Roll("2d10").evaluate(); // Use await for async evaluation
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
    const encounterRoll = await new Roll("1d100").evaluate(); // Use await for async evaluation
    let encounterResult = "";
  
    // Define encounter tables based on rarity
    const encounterTables = {
      "very rare": [
        "Banshee (MM); night", "Basilisk, greater (MM); day", "Dracolisk (MM); day",
        "Broken one, greater (MM); night", "Megalo-centipede (MM)", "Crypt thing (MM)",
        "Death knight (MM)", "Doppelganger (MM)", "Gold dragon (MM)", "Genie, Jann (MM); day",
        "Ghost (MM); night", "Gnome, Spriggan (MM)", "Gremlin (MM); night",
        "Gremlin, Fremlin (MM); day", "Gremlin, Galtrit (MM); night", "Hag, Annis (MM); night",
        "Hag, Green (MM); night", "Haunt (MM)", "Hell Hound (MM)", "Heucuva (MM)",
        "Homunculous (MM)", "Human, Adventurer (MM)", "Human, Barbarian/Nomad (MM)",
        "Human, Berserker/Dervish (MM)", "Human, Knight (MM)", "Human, Priest (MM)",
        "Human, Wizard (MM)", "Imp (MM)", "Imp, Quasit (MM)", "Lycanthrope, Werefox (Foxwoman) (MM); night",
        "Medusa, Glyptar (MM)", "Naga, Guardian (MM)", "Nymph (MM)", "Ogre, Half-Ogre (MM)",
        "Phantom (MM)", "Plant, Dangerous, Snapper-saw (MM)", "Revenant (MM); night",
        "Skeleton, Animal (MM)", "Skeleton, Monster (MM)", "Skeleton, Warrior (MM)",
        "Troll, Two-headed (MM)", "Zombie, Monster (MM); night", "Zombie, Ju-ju (MM); night",
        "Zombie, Lord (MM); night", "Basilisk, Dracoisk (MM); day", "Carnivorous Plant, Black Willow (FR1)",
        "Ring-worm (FR1)", "Tempest (FR1)", "Beholder-kin, Spectator (FR2); day",
        "Berbalang (FR2); full moon night", "Darkenbeast (FR2); night", "Apparition (FF)",
        "Bird, Talking (MCA)", "Blazing Bones (MCA)", "Winged Cat, Lesser (MCA)",
        "Dragon-kin (MCA)", "Elemental Kin, Earth, Crysmal (MCA); day",
        "Elemental Vermin, Air (Duster) (MCA)", "Elemental Vermin, Earth (Crawler) (MCA)",
        "Flameskull (MCA)", "Greelok (MCA); night", "Magebane (MCA)", "Nishruu (MCA)",
        "Spectral Wizard (MCA)", "Wolf, Stone (MCA)", "Wolf, Zombie (MCA); night",
        "Doppelganger, Greater (MCB)", "Ghost, Half-Dragon (MCB)", "Ghost, Casura (MCB)",
        "Ghost, Ker (MCB); night", "Alhoon (Illithich) (MCC)", "Coffer Corpse (MCC)",
        "Disenchanter (MCC)", "Gargoyle; Archer/Spouter/Stone Lion (Grandfather Plaque (MCC)",
        "Ibrandlin (MCC)", "Ore, Ondonti (MCC)", "Snake, Messenger (MCC)", "Nymph, Unseelie (MCD)",
        "Shadowlath, Lesser/Greater (MCD)", "Couatl (MM)", "Gorgimera (MM)", "Mist dragon (MM)",
        "Pegasus (MM)", "Plant, Forest Trapper (MM); day", "Unicorn (MM)", "Gorgon (MM)",
        "Wyvern (MM)", "Firetail, Tsihia (FR1); night", "Lamia, Dark (MM)"
      ],
      "rare": [
        "Bat, azmyth (MM)", "Bat, huge (mobat) (MCA); night", "Bat, sinister (MM)",
        "Behir (MM); day", "Ghoul, Ghast (MM); night", "Human, Barbarian/Nomad (MM)",
        "Human, Berserker/Dervish (MM)", "Human, Tribesman (MM)", "Lycanthrope, Wereboar (MM)",
        "Medusa (MM)", "Medusa, Greater (MM)", "Mongrelman (MM); night", "Ogre, Ogrellon (MM)",
        "Plant, Dangerous, Thorn-Slinger (MM)", "Skeleton (MM)", "Skeleton, Giant (MM)",
        "Spider, Phase (MM)", "Troll, Giant (MM)", "Vampire (MM); night", "Zombie, Common (MM); night",
        "Gloomwing, Flying Serpent (FR1)", "Claw, Crawling (FR2)", "Sull (FR1)", "Hellcat (FF)",
        "Penanggalan (FF); night", "Baneguard (MCA)", "Foulwing (MCA)", "Helmed Horror (MCA)",
        "Metalmaster (Sword Slug) (MCA)", "Ghul-kin, Soultaker (MCB); night", "Ghoul-kin, Witherer (MCB); night",
        "Wraith-Spider (MCB); night", "Baneadad (MCC)", "Bat, Bonebat (MCB)", "Burbur (MCC)",
        "Chosen One (MCC)", "Dread Warrior (MCC)", "Ankheg (MM)", "Chimera (MM)",
        "Pyrolisk (MM)", "Black dragon (MM)", "Etttercap (MM)", "Giant, Fire (MM)",
        "Gnoll, Fimd (MM); night", "Gripply (MM)", "Halfling, Tallfellow (MM); day", "Lamia, Lesser (MM); day",
        "Lurker, Forest Trapper (MM)", "Plant, Dangerous, Retch Plant (MM); day",
        "Rakshasa (MM); night", "Snake, Boalisk (MM)", "Snake, Spitting (MM)", "Sphinx, Gynosphinx (MM); day",
        "Sphinx, Androsphinx (MM); night", "Treeant (MM)", "Tsaloi (MM); night",
        "Wolf, Worg (MM)", "Dire Wolf (MM)", "Wolverine (MM)", "Wolf, Fiend (MM); night"
      ],
      "uncommon": [
        "Basilisk, lesser (MM); day", "Bat, large (giant) (MCA); night", "Bat, night hunter (MM); night",
        "Bear, cave (MM); day", "War dog (MM)", "Gargoyle (MM)", "Ghoul (MM); night",
        "Human, Pilgrim (MM)", "Human, Soldier (MM)", "Kenku (MM)", "Kobold (MM); night",
        "Manticore (MM)", "Orc, Orog (MM)", "Snake, Poison, Normal (MM)", "Snake, Poison, Giant (MM)",
        "Troll (MM); night", "Wight (MM); night", "Worm, Rot Grub (MM)", "Wraith (MM); night",
        "Ruve (FF)", "Aranea (MCC)", "Beetle, giant, rhinoceros (MM)", "Jaguar (MM)", "Leopard (MM)",
        "Mountain lion (MM) (dawn or dusk)", "Wild tiger (MM); night", "Cockatrice (MM)",
        "Elf (MM)", "Giant, Jungle (MM); day", "Gloomwing, Tenebrous Worm (MM)", "Gnoll (MM); night",
        "Goblin (MM); night", "Hobgoblin (MM)", "Horse, Wild (MM); day", "Human, Police/Constabulary (MM)",
        "Lizard, Giant (MM); day", "Lizard, Wild Baboon (MM)", "Mammal, Gorilla (MM)", 
        "Scorpion, Large (MM)", "Spider Giant (MM)", "Spider, Hairy (MM); night"
      ],
      "common": [
        "Bat, common (MCA); night", "Cattle (MCA)", "Sheep (MCA)", "Beetle, giant, boring (MM); night",
        "Beetle, giant, fire (MM); night", "Broken one, common (MM); night", "Centipede, giant (MM)",
        "Centipede, huge (MM)", "Wild dog (MM)", "Human, Peasant/Serf (MM)", "Human, Slave (MM)",
        "Lycanthrope, Werewolf (MM); night", "Ore (MM)", "Ogre (MM)", "Rat, Giant (MM); night",
        "Human, Bandit/Brigand (MM)", "Mammal, Carnivorous Ape (MM)", "Scorpion, Huge (MM)",
        "Spider, Hairy (MM)", "Spider Huge (MM)", "Giant Toad", "Snake, Giant Cobra (MCA); day",
        "Herd Mammal, Bull (Wild Ox) (MCB)"
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
    const resultMessage = `<strong>Warm Forest Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;
  
    ChatMessage.create({
      speaker: { alias: "Warm Forest Adventure" },
      content: `<h2>Warm Forest Encounter</h2><p>${resultMessage}</p>`
    });
  }
  