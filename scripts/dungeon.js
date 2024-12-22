// Dungeon Script
// Rolls to determine the type of dungeon, encounter, passage size, and first feature.

async function executeDungeon() {
    try {
        // Roll for Dungeon Encounter
        const encounterRoll = await new Roll("1d20").evaluate();
        let encounterResult;
        switch (encounterRoll.total) {
            case 1: encounterResult = `${(await new Roll("3d10").evaluate()).total} Kobolds`; break;
            case 2: encounterResult = `${(await new Roll("2d12").evaluate()).total} Ghouls`; break;
            case 3: encounterResult = `${(await new Roll("5d8").evaluate()).total} Goblins`; break;
            case 4: encounterResult = `${(await new Roll("1d6+1").evaluate()).total} Carrion Crawlers`; break;
            case 5: encounterResult = `${(await new Roll("1d4+1").evaluate()).total} Displacer Beasts`; break;
            case 6: encounterResult = `${(await new Roll("1d3").evaluate()).total} Ochre Jellies`; break;
            case 7: encounterResult = "1 Xorn"; break;
            case 8: encounterResult = `${(await new Roll("2d8").evaluate()).total} Troglodytes`; break;
            case 9: encounterResult = `${(await new Roll("1d10+4").evaluate()).total} Orcs`; break;
            case 10: encounterResult = "1 Otyugh"; break;
            case 11: encounterResult = `${(await new Roll("1d4+1").evaluate()).total} Displacer Beasts`; break;
            case 12: encounterResult = `${(await new Roll("1d4").evaluate()).total} Beholders`; break;
            default: encounterResult = "No specific encounter"; break;
        }

        // Roll for Dungeon Type and Dimensions
        const typeRoll = await new Roll("1d6").evaluate();
        let dungeonType;
        let passageDimensions = { height: 0, width: 0, length: 0 };
        switch (typeRoll.total) {
            case 1:
                dungeonType = "Giant Size";
                passageDimensions = {
                    height: (await new Roll("1d10+20").evaluate()).total,
                    width: (await new Roll("1d10+10").evaluate()).total,
                    length: (await new Roll("1d20+50").evaluate()).total
                };
                break;
            case 2:
                dungeonType = "Dwarven";
                passageDimensions = {
                    height: (await new Roll("5d4").evaluate()).total,
                    width: (await new Roll("5d4").evaluate()).total,
                    length: 60
                };
                break;
            case 3:
                dungeonType = "Orcish";
                passageDimensions = {
                    height: (await new Roll("1d6+6").evaluate()).total,
                    width: (await new Roll("1d6+6").evaluate()).total,
                    length: 30
                };
                break;
            case 4:
                dungeonType = "Gnomish";
                passageDimensions = {
                    height: (await new Roll("1d6+7").evaluate()).total,
                    width: (await new Roll("1d6+7").evaluate()).total,
                    length: 20
                };
                break;
            case 5:
                dungeonType = "Catacombs";
                passageDimensions = {
                    height: (await new Roll("1d6+6").evaluate()).total,
                    width: (await new Roll("1d6+6").evaluate()).total,
                    length: 30
                };
                break;
            case 6:
                dungeonType = "Mine";
                passageDimensions = {
                    height: (await new Roll("1d4").evaluate()).total,
                    width: (await new Roll("1d4").evaluate()).total,
                    length: "Variable"
                };
                break;
            default:
                dungeonType = "Unspecified";
                passageDimensions = { height: "Unknown", width: "Unknown", length: "Unknown" };
                break;
        }
        const passageSize = `${passageDimensions.height} ft. high, ${passageDimensions.width} ft. wide, ${passageDimensions.length} ft. long`;

        // Roll for Dungeon Feature
        const featureRoll = await new Roll("1d12").evaluate();
        let dungeonFeature;
        switch (featureRoll.total) {
            case 1:
                dungeonFeature = `Room (${3 * passageDimensions.height} ft. high, ${3 * passageDimensions.width} ft. wide, ${3 * passageDimensions.length} ft. long)`;
                break;
            case 2: dungeonFeature = "Stairs Down"; break;
            case 3: dungeonFeature = `Continuing Passage (${passageDimensions.length} ft. long)`; break;
            case 4: dungeonFeature = "Four-way Intersection with another passage"; break;
            case 5: dungeonFeature = "Passage ends (Check for secret passage)"; break;
            case 6:
                dungeonFeature = `Room (${4 * passageDimensions.height} ft. high, ${4 * passageDimensions.width} ft. wide, ${4 * passageDimensions.length} ft. long)`;
                break;
            case 7:
                dungeonFeature = `Branch Passage (${(await new Roll("1d6").evaluate()).total <= 3 ? "left" : "right"})`;
                break;
            case 8:
                dungeonFeature = `Passage turns corner (${(await new Roll("1d6").evaluate()).total <= 3 ? "left" : "right"})`;
                break;
            case 9:
                dungeonFeature = `Chamber (${5 * passageDimensions.height} ft. high, ${5 * passageDimensions.width} ft. wide, ${5 * passageDimensions.length} ft. long)`;
                break;
            case 10: dungeonFeature = "Continuing Passage with traps"; break;
            case 11: dungeonFeature = "Continuing Passage leading to a chasm"; break;
            case 12: dungeonFeature = "Secret Passage to another level"; break;
            default: dungeonFeature = "No specific feature"; break;
        }

        // Set `game.recentEncounterResult` to pass dungeon data back to `worldbuilder.js`
        game.recentEncounterResult = `
            <strong>Type:</strong> ${dungeonType}<br>
            <strong>Encounter:</strong> ${encounterResult}<br>
            <strong>Passage Size:</strong> ${passageSize}<br>
            <strong>Feature:</strong> ${dungeonFeature}
        `;

        // Output to chat for convenience
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Dungeon Encounter</h2>
                      <p><strong>Type:</strong> ${dungeonType}</p>
                      <p><strong>Encounter:</strong> ${encounterResult}</p>
                      <p><strong>Passage Size:</strong> ${passageSize}</p>
                      <p><strong>Feature:</strong> ${dungeonFeature}</p>`
        });

    } catch (error) {
        console.error("Error in executeDungeon function:", error);
        ui.notifications.error("An error occurred while generating dungeon details.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeDungeon = executeDungeon;
