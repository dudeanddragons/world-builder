// encounter-hills-cold.js
export async function execute() {
    console.log("Executing cold hills encounter...");
  
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
      rarity = "uncommon";
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
        "Banshee (MM); night", "Basilisk, greater (MM); day", "Dracolisk (MM); day", "Broken one, greater (MM); night",
        "Crypt thing (MM)", "Death knight (MM)", "Doppelganger (MM)", "Gold dragon (MM)",
        "Genie, Jann (MM); day", "Ghost (MM); night", "Gnome, Spriggan (MM)", "Gremlin, Fremlin (MM); day",
        "Gremlin, Galltrit (MM); night", "Hag, Annis (MM); night", "Hag, Green (MM); night", "Haunt (MM)",
        "Hell Hound (MM)", "Hecuva (MM)", "Homunculous (MM)", "Human, Adventurer (MM)",
        "Human, Knight (MM)", "Human, Priest (MM)", "Human, Wizard (MM)", "Imp (MM)",
        "Imp, Quasit (MM)", "Lycanthrope, Werefox (Foxwoman) (MM); night", "Medusa, Glyptar (MM)", "Naga, Guardian (MM)",
        "Nymph (MM)", "Ogre, Half-Ogre (MM)", "Phantom (MM)", "Plant, Dangerous, Snapper-saw (MM)",
        "Revenant (MM); night", "Skeleton, Animal (MM)", "Skeleton, Monster (MM)", "Skeleton, Warrior (MM)",
        "Troll, Two-headed (MM)", "Zombie, Monster (MM); night", "Zombie, Ju-ju (MM); night", "Zombie, Lord (MM); night",
        "Basilisk, Dracolisk (MM); day", "Dimensional Warper (FR1)", "Carnivorous Plant, Black Willow (FR1)", "Ring-worm (FR1)",
        "Tempest (FR1)", "Beholder-kin, Spectator (FR2); day", "Berbalang (FR2); full moon night", "Darkenbeast (FR2); night",
        "Apparition (FF)", "Blazing Bones (MCA)", "Winged Cat, Lesser (MCA)", "Dragon-kin (MCA)",
        "Elemental Kin, Earth, Crysmal (MCA); day", "Elemental Vermin, Air (Duster) (MCA)", "Elemental Vermin, Earth (Crawler) (MCA)", "Flameskull (MCA)",
        "Greelox (MCA); night", "Magebane (MCA)", "Naga, Bone (MCA)", "Nishruu (MCA)",
        "Spectral Wizard (MCA)", "Wolf, Dread (MCA)", "Wolf, Stone (MCA)", "Wolf, Vampire (MCA); night",
        "Wolf, Zombie (MCA)", "Doppleganger, Greater (MCB)", "Dragon, Half-Dragon (MCB)", "Ghost, Casura (MCB)",
        "Ghost, Ker (MCB); night", "Hakeshaar (MCB)", "Alhoon (Illithilich) (MCC)", "Banelich (MCC)",
        "Coffer Corpse (MCC)", "Disenchanter (MCC)", "Gargoyle, Archer/Spouter\Stone Lion\Grandfather Plaque (MCC)", "Ibrandlin (MCC)",
        "Ore, Ondonti (MCC)", "Snake, Messenger (MCC)", "Nymph, Unseelie (MCD)", "Shadowkawn, Lesser/Greater (MCD)",
        "Giant, Frost (MM)", "Hydra, Cryohydra (MM)", "Meffit, Ice (MM)", "Bird, Giant Owl (MM)",
        "Troll, Spectral (MM); night", "Wolf, Winter (MM)", "Silver Dog (FR1); night", "Ice Lizard (FF); day",
        "Feystag (MCA)", "Elemental, Nature (MCB)", "Flumph, Monastic (CM2); night", "Owlbear, Arctic (MM)",
        "Unicorn, Black (MCB); night", "Roll on Table 9.5: Extremely rare monsters"
      ],
      "rare": [
        "Behir (MM); day", "Ghoul, Ghast (MM); night", "Human, Barbarian/Nomad (MM)", "Human, Berserker/Dervish (MM)",
        "Human, Tribesman (MM)", "Lycanthrope, Wereboar (MM)", "Medusa (MM)", "Medusa, Greater (MM)",
        "Mongrelman (MM); night", "Ogre, Ogrellon (MM)", "Skeleton (MM)", "Skeleton, Giant (MM)",
        "Spider, Phase (MM)", "Troll, Giant (MM)", "Vampire (MM); night", "Zombie, Common (MM); night",
        "Gloomwing, Flying Serpent (FR1)", "Claw, Crawling (FR2)", "Sull (FR1)", "Hellcat (FF)",
        "Penanggalan (FF); night", "Baneguard (MCA)", "Foulwing (MCA)", "Helmed Horror (MCA)",
        "Metalmaster (Sword Slug) (MCA)", "Ghul-kin, Soultaker (MCB)", "Ghul-kin, Witherer (MCB); night", "Wraith-Spider (MCB); night",
        "Banelich (MCC)", "Bat, Bonebat (MCB)", "Ghoul-kin, Soultaker (MCB)", "Burbur (MCC)",
        "Chosen One (MCC)", "Dread Warrior (MCC)", "Cat, small, elven (FR1)", "Centaurs (MM)",
        "Lamia, Lesser (MM); night", "Ogre, Ogre Mage (MM)", "Unicorn, Ferraile (FF); day", "Rakshasa (MM); night",
        "Roll on Table 9.4: Very rare monsters"
      ],
      "uncommon": [
        "Basilisk, lesser (MM); day", "Bear, cave (MM); day", "War dog (MM)", "Gargoyle (MM)",
        "Ghoul (MM); night", "Human, Pilgrim (MM)", "Human, Soldier (MM)", "Kenku (MM)",
        "Kobold (MM); night", "Lycanthrope, Wererat (MM); night", "Manticore (MM)", "Orc, Orog (MM)",
        "Snake, Poison, Normal (MM)", "Snake, Poison, Giant (MM)", "Troll (MM)", "Wight (MM); night",
        "Worm, Rot Grub (MM)", "Wraith (MM); night", "Ruve (FF)", "Aranea (MCC)",
        "Giant, Verbeeg (MM)", "Horse, Wild (MM); day", "Human, Police/Constabulary (MM)", "Wolf (MM)",
        "Xvart (FF)", "Gnasher (MCA); day", "Whipsting (MCA)", "Herd Mammal, Giant Goat (MCB)"
      ],
      "common": [
        "Camel (MCA)", "Cattle (MCA)", "Sheep (MCA)", "Beetle, giant, boring (MM); night",
        "Beetle, giant, fire (MM); night", "Broken one, common (MM); night", "Wild dog (MM)", "Human, Peasant/Serf (MM)",
        "Human, Slaver (MM)", "Lycanthrope, Werewolf (MM); night", "Ogre (MM)", "Orc (MM)",
        "Rat, Giant (MM); night", "Dwarf, Hill (MM)", "Human, Bandit/Brigand (MM)", "Human, Farmer/Herder (MM)",
        "Human, Gentry (MM)", "Human, Merchant/Trader (MM)", "Human, Middle Class (MM)", "Human, Thief/Thug (MM)",
        "Human, Tradesman/Craftsman (MM)", "Mammal, Rothe (MM)", "Herd Mammal, Caribou (MCB)"
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
    const resultMessage = `<strong>Cold Hills Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;
  
    ChatMessage.create({
      speaker: { alias: "Cold Hills Adventure" },
      content: `<h2>Cold Hills Encounter</h2><p>${resultMessage}</p>`
    });
  }
  