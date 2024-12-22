// encounter-hills-warm.js (edit)
export async function execute() {
    console.log("Executing warm hills encounter...");
  
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
        "Megalo-centipede (MM)", "Crypt thing (MM)", "Death knight (MM)", "Doppelganger (MM)",
        "Genie, Jann (MM); day", "Ghost (MM); night", "Gnome, Spriggan (MM)", "Gremlin/Fremlin/Galltrit (MM); night",
        "Hag, Annis (MM); night", "Hag, Green (MM); night", "Haunt (MM)", "Hell Hound (MM)",
        "Heucuva (MM)", "Homonculous (MM)", "Human, Adventurer (MM)", "Human, Knight (MM)",
        "Human, Priest (MM)", "Human, Wizard (MM)", "Imp (MM)", "Imp, Quasit (MM)",
        "Lycanthrope, Werefox (Foxwoman) (MM); night", "Medusa, Glyptar (MM)", "Naga Guardian (MM)",
        "Nymph (MM)", "Ogre, Half-Ogre (MM)", "Phantom (MM)", "Plant, Dangerous, Snapper-saw (MM)",
        "Skeleton, Animal (MM)", "Skeleton, Monster (MM)", "Skeleton, Warrior (MM)", "Zombie, Monster (MM); night",
        "Tempest (FR1)", "Apparition (FF)", "Dragon-kin (MCA)", "Medusa, Lesser (MCA)",
        "Greelox (MCA); night", "Spectral Wizard (MCA)", "Wolf, Stone (MCA)", "Wolf, Vampire (MCA); night",
        "Disenchanter (MCC)", "Grandfather Plaque (MCC)", "Manticore (MM)", "Snake, Amphisbanea (MM)",
        "Dragonne (MM)", "Sphinx, Hieracosphinx (MM); day", "Giant, Fire (MM)", "Copper Dragon (MM)",
        "Gold Dragon (MM)", "Render (MCC)"
      ],
      "rare": [
        "Bat, azmyth (MM)", "Bat, huge (mobat) (MCA); night", "Bat, sinister (MM)", "Behir (MM); day",
        "Ghoul, Ghast (MM); night", "Human, Barbarian/Nomad (MM)", "Human, Tribesman (MM)", "Lycanthrope, Wereboar (MM)",
        "Medusa (MM)", "Medusa, Greater (MM)", "Mongrelman (MM); night", "Ogre, Ogrillon (MM)",
        "Plant, Dangerous, Thorn-Slinger (MM)", "Skeleton (MM)", "Spider, Phase (MM)", "Troll, Giant (MM)",
        "Vampire (MM); night", "Zombie, Common (MM); night", "Claw, Crawling (FR2)", "Sull (FR1)",
        "Hellcat (FF)", "Penanggalan (FF); night", "BaneGuard (MCA)", "Ghoul-kin, SoulTaker (MCA); night",
        "Gnoll, Flint (MM); night", "BaneDead (MCC)", "Bat, Bonebat (MCC)", "Burbur (MCC)",
        "Metal Master (Sword Slug) (MCA)", "Griffon (MM)", "Pyrolisk (MM)", "Adderher (FF)",
        "Kobold, Urd (MM); night", "Hybsil (MCC); day"
      ],
      "uncommon": [
        "Basilisk, lesser (MM); day", "Bat, large (giant) (MCA); night", "Bat, night hunter (MM); night", "Bear, cave (MM); day",
        "Ghoul (MM); night", "Human, Pilgrim (MM)", "Human, Soldier (MM)", "Kenku (MM)",
        "Kobold (MM); night", "Lycanthrope, Wererat (MM); night", "Mountain lion (MM) (dawn or dusk)", "Gnoll (MM); night",
        "Hobgoblin (MM)", "Human, Police/Constabulary (MM)", "Leprechaun (MM)", "Scorpion, Giant (MM)",
        "Carnivorous Plant, Witherweed (FR1)", "Gryphon (MM); day", "Lizard, Giant (MM); day", "Rohch (FR1); night"
      ],
      "common": [
        "Bat, common (MCA); night", "Camel (MCA)", "Cattle (MCA)", "Sheep (MCA)",
        "Beetle, giant, boring (MM); night", "Beetle, giant, fire (MM); night", "Broken one, common (MM); night", "Centipede, giant (MM)",
        "Centipede, huge (MM)", "Wild dog (MM)", "Human, Peasant/Serf (MM)", "Human, Slaver (MM)",
        "Lycanthrope, Werewolf (MM); night", "Ogre (MM)", "Orc (MM)", "Rat, Giant (MM); night",
        "Dwarf, Hill (MM)", "Human, Bandit/Brigand (MM)", "Human, Farmer/Herder (MM)", "Human, Gentry (MM)",
        "Human, Merchant/Trader (MM)", "Human, Middle Class (MM)", "Spider, Hairy (MM)", "Spider, Large (MM)",
        "Spider, Huge (MM)", "Snake, Giant Cobra (MCA); day", "Herd Mammal, Llama (MCB)"
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
    const resultMessage = `<strong>Warm Hills Encounter:</strong> ${encounterResult}`;
    game.recentEncounterResult = resultMessage;
  
    ChatMessage.create({
      speaker: { alias: "Warm Hills Adventure" },
      content: `<h2>Warm Hills Encounter</h2><p>${resultMessage}</p>`
    });
  }
  