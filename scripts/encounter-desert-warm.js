// encounter-desert-warm.js
// Rolls for warm desert encounter with rarity and detailed encounter tables.

async function executeWarmDesertEncounter() {
  try {
      console.log("Executing warm desert encounter...");

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
              "Chimera (MM)", "Gorgimera (MM)", "Death Dog (MM): night", "Blue Dragon (MM)",
              "Brown Dragon", "Wyvern (MM)", "Dragonne", "Pteranodon (MM)", "Beetle, Giant Queen",
              "Elemental, Composite, Siltkat (MM)", "Giant, Desert (MM)", "Hart, Greater (MM)",
              "Mehst (FR)", "Lamia (MM)", "Lamia Noble", "Lizard, Fire, Horn (MM)",
              "Naga, Bone", "Sphinx, Androsphinx (MM): day", "Firetail, Bright (FR): day",
              "Banshee (MM): night", "Iron Cobra (FF)", "Basilisk, Greater (MM): day",
              "Dracolisk (MM): day", "Brobdin (MM)", "Ape, Moonlight (MM)", "Cryosphinx",
              "Crypt thing (MM)", "Death Knight (MM)", "Gold Dragon (MM)", "Genie, Jann (MM)",
              "Ghost (MM): night", "Gnome, Spriggan (MM)", "Gremlin, Galltrit (MM): night",
              "Gremlin, Ferum (MM): day", "Gremlin, Mite (MM)", "Hag, Green (MM): night",
              "Hell Hound (MM)", "Hellcat (FF)", "Rhaumbusun (FR2): day", "Lamia", "Ogre Magi (MM)",
              "Yuan-ti", "Naga, Water", "Spectral Wizard (MCA)", "Apparition (FF)"
          ],
          "rare": [
              "Chimera (MM)", "Phoenix", "Dragon, Brown", "Elemental, Fire (MM)", "Giant, Fire (MM)",
              "Hobgoblin (MM)", "Lamia (MM)", "Manticore", "Nagpa (MCA)", "Troll, Ice", "Wight", "Yeti",
              "Beetle, Fire (MM)", "Boalisk (MCA)", "Naga, Spirit", "Mummy", "Gibbering Mouther (MM)",
              "Beetle, Flame (MCA)", "Salamander, Flame (MM)", "Dragon, Bronze", "Basilisk, Sand",
              "Dragon, Silver", "Lamia Noble", "Warg (MM)", "Sphinx, Androsphinx (MM)"
          ],
          "uncommon": [
              "Cockatrice (MM)", "Goblin (MM)", "Hobgoblin (MM)", "Human, Nomad (MM)", "Lizard, Elemental (MM)",
              "Thri-Kreen (MM)", "Snake, Sand (FR)", "Sand Cat (FR)", "Adherer (MCA)", "Baazrag (MCG): day",
              "Beetle, Boring (MM)", "Snake, Poison, Normal (MM)", "Lamia Lesser (MM)", "Ghoul (MM)",
              "Lizard, Thorny (MM)", "Orc (MM)", "Rat, Giant (MM)", "Skeleton, Giant",
              "Manticore (MM)", "Giant Scorpion (MM)", "Troll, Cave (MM)", "Hyena, Spotted (MM)"
          ],
          "common": [
              "Camel (MCA)", "Beetle, giant, boring (MM): night", "Beetle, giant, fire (MM): night",
              "Beetle, giant (MM): night", "Centipede, giant (MM)", "Gnoll (MM)", "Human, Peasant/Serf (MM)",
              "Human, Slave (MM)", "Hyena, Spotted (MM)", "Lizard, Thorny (MM)", "Ogre (MM)",
              "Orc (MM)", "Rat, Giant (MM)", "Jarro (MCA)"
          ]
      };

      // Choose the encounter from the respective rarity table
      if (rarity in encounterTables) {
          const encounterList = encounterTables[rarity];
          const index = (encounterRoll.total - 1) % encounterList.length;
          encounterResult = encounterList[index];
      } else {
          console.error("Invalid rarity type:", rarity);
          ui.notifications.error("Invalid rarity type encountered. Check console for details.");
          return;
      }

      // Store the encounter result in the game data and output to chat
      const resultMessage = `<strong>Warm Desert Encounter:</strong> ${encounterResult}`;
      game.recentEncounterResult = resultMessage;

      ChatMessage.create({
          speaker: { alias: "Warm Desert Adventure" },
          content: `<h2>Warm Desert Encounter</h2><p>${resultMessage}</p>`
      });

  } catch (error) {
      console.error("Error in executeWarmDesertEncounter function:", error);
      ui.notifications.error("An error occurred while generating the warm desert encounter. Check console for details.");
  }
}

// Attach the function to the window object for dynamic execution
window.executeWarmDesertEncounter = executeWarmDesertEncounter;
