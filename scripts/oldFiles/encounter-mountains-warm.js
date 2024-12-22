// encounter-mountains-warm.js (edit)
// Rolls for warm mountains encounter with rarity and detailed encounter tables.

async function executeWarmMountainsEncounter() {
  try {
      console.log("Executing warm mountains encounter...");

      // Step 1: Roll for encounter rarity using 2d10
      const rarityRoll = await new Roll("2d10").evaluate();
      let rarity = "";

      // Determine the rarity based on the roll result
      if (rarityRoll.total === 2) {
          rarity = "very rare";
      } else if (rarityRoll.total === 3 || rarityRoll.total === 20) {
          rarity = "rare";
      } else if (rarityRoll.total >= 4 && rarityRoll.total <= 17) {
          rarity = "uncommon";
      } else if (rarityRoll.total === 18 || rarityRoll.total === 19) {
          rarity = "rare";
      } else {
          console.error("Unexpected rarity roll result:", rarityRoll.total);
          ui.notifications.warn("Unexpected rarity roll. Please check the console for details.");
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
        "Gold dragon (MM)", "Genie, Jann (MM); day", "Ghost (MM); night", "Gnome, Spriggan (MM)",
        "Gremlin, Fremlin (MM); day", "Gremlin, Galltrit (MM); night", "Hag, Annis (MM); night", "Hag, Green (MM); night",
        "Haunt (MM)", "Hell Hound (MM)", "Hecuva (MM)", "Homunculous (MM)",
        "Human, Adventurer (MM)", "Human, Knight (MM)", "Human, Priest (MM)", "Human, Wizard (MM)",
        "Imp (MM)", "Imp, Quasit (MM)", "Lycanthrope, Werefox (Foxwoman) (MM); night",
        "Medusa, Glyptar (MM)", "Naga, Guardian (MM)", "Nymph (MM)", "Ogre, Half-Ogre (MM)",
        "Phantom (MM)", "Plant, Dangerous, Snapper-saw (MM)", "Revenant (MM); night", "Skeleton, Animal (MM)",
        "Skeleton, Monster (MM)", "Skeleton, Warrior (MM)", "Troll, Two-headed (MM)", "Zombie, Monster (MM); night",
        "Zombie, Ju-ju (MM); night", "Zombie, Lord (MM); night", "Basilisk, Dracolisk (MM); day", "Dimensional Warper (FR1)",
        "Carnivorous Plant, Black Willow (FR1)", "Ring-worm (FR1)", "Tempest (FR1)", "Beholder-kin, Spectator (FR2); day",
        "Berbalang (FR2); full moon night", "Darkenbeast (FR2); night", "Apparition (FF)", "Blazing Bones (MCA)",
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
        "Flumph, Monastic (CM2); night", "Owlbear, Arctic (MM)", "Unicorn, Black (MCB); night", "Roll on Table 10.5: Extremely rare monsters"
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
        "Banelich (MCC)", "Bat, Bonebat (MCB)", "Ghoul-kin, Soultaker (MCB)", "Burbur (MCC)",
        "Chosen One (MCC)", "Dread Warrior (MCC)", "Cat, small, elven (FR1)", "Centaurs (MM)",
        "Lamia, Lesser (MM); night", "Ogre, Ogre Mage (MM)", "Unicorn, Ferraile (FF); day", "Rakshasa (MM); night",
        "Roll on Table 10.4: Very rare monsters"
      ],
      "uncommon": [
        "Basilisk, lesser (MM); day", "Bat, large (giant) (MCA); night", "Bat, night hunter (MM); night", "Bear, cave (MM); day",
        "War dog (MM)", "Gargoyle (MM)", "Ghoul (MM); night", "Human, Pilgrim (MM)",
        "Human, Soldier (MM)", "Kenku (MM)", "Kobold (MM); night", "Lycanthrope, Wererat (MM); night",
        "Manticore (MM)", "Orc, Orog (MM)", "Snake, Poison, Normal (MM)", "Snake, Poison, Giant (MM)",
        "Troll (MM)", "Wight (MM); night", "Worm, Rot Grub (MM)", "Wraith (MM); night",
        "Ruve (FF)", "Aranea (MCC)", "Mountain lion (MM) (dawn or dusk)", "Cockatrice (MM)",
        "Elf (MM)", "Gibberling (MM); night", "Gloomwing, Tenebrous Worm (MM)", "Gnoll (MM); night",
        "Goblin (MM); night", "Hobgoblin (MM)", "Horse, Wild (MM); day", "Human, Police/Constabulary (MM)",
        "Mammal, Porcupine (MM)", "Bird, Condor (MM)", "Scorpion, Large (MM)", "Scorpion, Giant (MM)",
        "Snake, Constrictor, Normal (MM)", "Snake, Constrictor, Giant (MM)", "Spider, Giant (MM)", "Cat, Wild (FR1)",
        "Carnivorous Plant, Witherweed (FR1)", "Fire, Falcon (FR); day", "Nightshade (MCA); night", "Tuyewera (MCA)",
        "Whipsting (MCA)", "Addazahr (MCB); day", "Herd Mammal, Giant Ram (MCB)"
      ],
      "common": [
        "Bat, common (MCA); night", "Camel (MCA)", "Cattle (MCA)", "Sheep (MCA)",
        "Beetle, giant, boring (MM); night", "Beetle, giant, fire (MM); night", "Broken one, common (MM); night", "Centipede, giant (MM)",
        "Centipede, huge (MM)", "Wild dog (MM)", "Human, Peasant/Serf (MM)", "Human, Slaver (MM)",
        "Lycanthrope, Werewolf (MM); night", "Ogre (MM)", "Orc (MM)", "Rat, Giant (MM); night",
        "Dwarf, Mountain (MM)", "Human, Bandit/Brigand (MM)", "Human, Farmer/Herder (MM)", "Scorpion, Huge (MM)",
        "Spider, Hairy (MM)", "Spider, Large (MM)", "Spider, Huge (MM)", "Troglodyte (MM)",
        "Snake, Giant Cobra (MCA); day", "Herd Mammal, Llama (MCB)"
      ]
      };

      // Step 3: Choose the encounter from the respective rarity table
      if (encounterTables[rarity]) {
          const encounterList = encounterTables[rarity];
          const index = (encounterRoll.total - 1) % encounterList.length;
          encounterResult = encounterList[index];
      } else {
          console.error("Invalid rarity type:", rarity);
          ui.notifications.error("Invalid rarity type encountered. Check console for details.");
          return;
      }

      // Store the encounter result in the game data and output to chat
      const resultMessage = `<strong>Warm Mountains Encounter:</strong> ${encounterResult}`;
      game.recentEncounterResult = resultMessage;

      ChatMessage.create({
          speaker: { alias: "Warm Mountains Adventure" },
          content: `<h2>Warm Mountains Encounter</h2><p>${resultMessage}</p>`
      });

  } catch (error) {
      console.error("Error in executeWarmMountainsEncounter function:", error);
      ui.notifications.error("An error occurred while generating the warm mountains encounter. Check console for more information.");
  }
}

// Attach the function to the window object for dynamic execution
window.executeWarmMountainsEncounter = executeWarmMountainsEncounter;
