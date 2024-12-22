// encounter-plains-warm.js (edit)
export async function execute() {
    console.log("Executing warm plains encounter...");
  
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
        "Winged Cat, Lesser (MCA)", "Dragon-kin (MCA)", "Elemental Kin, Earth, Crysmal (MCA); day", "Elemental Vermin, Air (Duster) (MCA)",
        "Elemental Vermin, Earth (Crawler) (MCA)", "Flameskull (MCA)", "Greelox (MCA); night", "Magebane (MCA)",
        "Naga, Bone (MCA)", "Nishruu (MCA)", "Spectral Wizard (MCA)", "Wolf, Dread (MCA)",
        "Wolf, Stone (MCA)", "Wolf, Vampire (MCA); night", "Wolf, Zombie (MCA)", "Doppleganger, Greater (MCB)",
        "Dragon, Half-Dragon (MCB)", "Ghost, Casura (MCB)", "Ghost, Ker (MCB); night", "Hakeshaar (MCB)",
        "Alhoon (Illithilich) (MCC)", "Banelich (MCC)", "Coffer Corpse (MCC)", "Disenchanter (MCC)",
        "Gargoyle, Archer/Spouter\Stone Lion\Grandfather Plaque (MCC)", "Ibrandlin (MCC)", "Ore, Ondonti (MCC)", "Snake, Messenger (MCC)",
        "Nymph, Unseelie (MCD)", "Shadowkawn, Lesser/Greater (MCD)", "Giant, Frost (MM)", "Hydra, Cryohydra (MM)",
        "Meffit, Ice (MM)", "Bird, Giant Owl (MM)", "Troll, Spectral (MM); night", "Wolf, Winter (MM)",
        "Silver Dog (FR1); night", "Ice Lizard (FF); day", "Feystag (MCA)", "Elemental, Nature (MCB)",
        "Flumph, Monastic (CM2); night", "Owlbear, Arctic (MM)", "Unicorn, Black (MCB); night", "Roll on Table 13.5: Extremely rare monsters"
      ],
      "rare": [
        "Bat, azmyth (MM)", "Bat, huge (mobat) (MCA); night", "Bat, sinister (MM)", "Behir (MM); day",
        "Ghoul, Ghast (MM); night", "Human, Barbarian/Nomad (MM)", "Human, Berserker/Dervish (MM)", "Human, Tribesman (MM)",
        "Lycanthrope, Wereboar (MM)", "Medusa (MM)", "Medusa, Greater (MM)", "Mongrelman (MM); night",
        "Ogre, Ogrellon (MM)", "Plant, Dangerous, Thorn-Slinger (MM)", "Skeleton (MM)", "Skeleton, Giant (MM)",
        "Spider, Phase (MM)", "Troll, Giant (MM)", "Vampire (MM); night", "Zombie, Common (MM); night",
        "Gloomwing, Flying Serpent (FR1)", "Claw, Crawling (FR2)", "Sull (FR1)", "Hellcat (FF)",
        "Penanggalan (FF); night", "Baneguard (MCA)", "Foulwing (MCA)", "Helmed Horror (MCA)",
        "Metalmaster (Sword Slug) (MCA)", "Ghul-kin, Soultaker (MCB)", "Ghul-kin, Witherer (MCB); night", "Wraith-Spider (MCB); night",
        "Burbur (MCC)", "Chosen One (MCC)", "Dread Warrior (MCC)", "Spotted lion (MM); day",
        "Chimera (MM)", "Pyrkolisk (MM)", "Gnoll, Flind (MM); night", "Human, Mercenary (MM)",
        "Jackalwere (MM)", "Roll on Table 13.4: Very rare monsters"
      ],
      "uncommon": [
        "Basilisk, lesser (MM); day", "Bat, large (giant) (MCA); night", "Bat, night hunter (MM); night", "Bear, cave (MM); day",
        "War dog (MM)", "Gargoyle (MM)", "Ghoul (MM); night", "Human, Pilgrim (MM)",
        "Human, Soldier (MM)", "Kenku (MM)", "Kobold (MM); night", "Lycanthrope, Wererat (MM); night",
        "Manticore (MM)", "Orc, Orog (MM)", "Snake, Poison, Normal (MM)", "Snake, Poison, Giant (MM)",
        "Troll (MM)", "Wight (MM); night", "Worm, Rot Grub (MM)", "Wraith (MM); night",
        "Ruve (FF)", "Aranea (MCC)", "Buffalo (MCA)", "Cheetah (MM); day",
        "Common lion (MM); day", "Mountain lion (MM) (dawn or dusk)", "Cockatrice (MM)", "Gnoll (MM); night",
        "Goblin (MM); night", "Hobgoblin (MM)", "Horse, Wild (MM); day", "Human, Police/Constabulary (MM)",
        "Mammal, Warthog (MM)", "Bird, Flightless (MM)", "Bird, Vulture (MM)", "Scorpion, Large (MM)",
        "Scorpion, Giant (MM)", "Snake, Constrictor, Normal (MM)", "Snake, Constrictor, Giant (MM)", "Spider, Giant (MM)",
        "Cat, Wild (FR1)", "Carnivorous Plant, Witherweed (FR1)", "Fire, Falcon (FF); day", "Nightshade (MCA); night",
        "Tuyewera (MCA)", "Addazahr (MCB); day", "Herd Mammal, 1-Horn/2-Horn Rhino (MCB)"
      ],
      "common": [
        "Bat, common (MCA); night", "Camel (MCA)", "Cattle (MCA)", "Sheep (MCA)",
        "Beetle, giant, boring (MM); night", "Beetle, giant, fire (MM); night", "Broken one, common (MM); night", "Centipede, giant (MM)",
        "Centipede, huge (MM)", "Ore (MM)", "Wild dog (MM)", "Human, Peasant/Serf (MM)",
        "Human, Slaver (MM)", "Lycanthrope, Werewolf (MM); night", "Ogre (MM)", "Rat, Giant (MM); night",
        "Antelope (MCA)", "Elephant (MM)", "Human, Farmer/Herder (MM)", "Human, Gentry (MM)",
        "Human, Merchant/Trader (MM)", "Human, Middle Class (MM)", "Human, Thief/Thug (MM)", "Human, Tradesman/Craftsman (MM)",
        "Mammal, Goat (MM)", "Mammal, Hyena (MM)", "Mammal, Jackal (MM)", "Scorpion, Huge (MM)",
        "Spider, Hairy (MM)", "Spider, Large (MM)", "Spider, Huge (MM)", "Giant Toad (MM)"
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
    const resultMessage = `<strong>Warm Plains Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;
  
    ChatMessage.create({
      speaker: { alias: "Warm Plains Adventure" },
      content: `<h2>Warm Plains Encounter</h2><p>${resultMessage}</p>`
    });
  }
  