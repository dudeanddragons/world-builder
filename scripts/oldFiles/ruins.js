// Ruins Script
// Rolls on the "Ruins" sub-tables to generate specific types of ruins (Manor, Village, City, etc.).

async function executeRuins() {
    try {
        const ruinTypes = {
            1: "Manor",
            2: "Village",
            3: "City",
            4: "Citadel",
            5: "Castle",
            6: "Temple"
        };

        const manorSubTable = ["Hut", "Hovel", "Hall", "Villa", "Cottage", "Palace"];
        const villageSubTable = ["2d6 Huts", "4d6 Hovels", "6d6 Cottages", "6d6 Cottages w/ Ditch", "6d6 Cottages w/ Palisade", "6d6 Cottages w/ Palisade & Moat"];
        const citySubTable = ["7d6 Houses & Citadel", "8d6 Houses", "9d6 Houses & Wall", "9d6 Houses & Wall with 1d4 Citadels", "2d6 Houses", "2d6 Houses & 1d4 Temples"];
        const citadelSubTable = ["Tower", "Tower & Outer Wall", "Great Keep", "Keep & 4 Towers", "Keep, 4 Towers, & Outer wall", "Keep, 4 Towers, Outer wall, & Moat"];
        const castleSubTable = ["Keep & Palisade", "Keep, Palisade, & Moat", "Keep, Palisade, Moat, & Walls", "Keep, Palisade, Moat, Walls, & Manor", "Keep, Palisade, Moat, Walls, Manor, & 4 Towers", "Keep, Palisade, Moat, Walls, Manor, 4 Towers, & Outer Walls"];
        const templeSubTable = ["Altar", "Shrine", "Sanctuary", "Oracle", "Pantheon", "Monastery"];

        // Roll for the type of ruin
        const rollType = await new Roll("1d6").evaluate();
        const selectedType = ruinTypes[rollType.total];

        // Determine specific details based on the type
        let details = "";
        switch (selectedType) {
            case "Manor":
                details = manorSubTable[(await new Roll("1d6").evaluate()).total - 1];
                break;
            case "Village":
                details = villageSubTable[(await new Roll("1d6").evaluate()).total - 1];
                break;
            case "City":
                details = citySubTable[(await new Roll("1d6").evaluate()).total - 1];
                break;
            case "Citadel":
                details = citadelSubTable[(await new Roll("1d6").evaluate()).total - 1];
                break;
            case "Castle":
                details = castleSubTable[(await new Roll("1d6").evaluate()).total - 1];
                break;
            case "Temple":
                details = templeSubTable[(await new Roll("1d6").evaluate()).total - 1];
                break;
            default:
                console.warn("Unknown ruin type rolled.");
                details = "Unknown ruin type";
        }

        // Handle inline dice rolls (e.g., "1d4 Citadels")
        const additionalStructures = {};
        if (/\d+d\d+/.test(details)) {
            const rollMatches = details.match(/(\d+d\d+)/g);
            for (const rollText of rollMatches) {
                const rollResult = await new Roll(rollText).evaluate();
                details = details.replace(rollText, rollResult.total);

                if (details.includes("1d4 Citadels") && rollText === "1d4") {
                    additionalStructures.Citadels = rollResult.total;
                } else if (details.includes("1d4 Temples") && rollText === "1d4") {
                    additionalStructures.Temples = rollResult.total;
                }
            }
        }

        // Roll for additional Citadels or Temples if present
        if (additionalStructures.Citadels) {
            let citadelDetails = [];
            for (let i = 0; i < additionalStructures.Citadels; i++) {
                citadelDetails.push(citadelSubTable[(await new Roll("1d6").evaluate()).total - 1]);
            }
            details += `<br><strong>Additional Citadels:</strong> ${citadelDetails.join(", ")}`;
        }

        if (additionalStructures.Temples) {
            let templeDetails = [];
            for (let i = 0; i < additionalStructures.Temples; i++) {
                templeDetails.push(templeSubTable[(await new Roll("1d6").evaluate()).total - 1]);
            }
            details += `<br><strong>Additional Temples:</strong> ${templeDetails.join(", ")}`;
        }

        // Roll for Manor type if "Castle" includes a "Manor"
        if (selectedType === "Castle" && details.includes("Manor")) {
            const manorDetail = manorSubTable[(await new Roll("1d6").evaluate()).total - 1];
            details += `<br><strong>Manor Type:</strong> ${manorDetail}`;
        }

        // Store the full result in game data and display in chat
        game.recentEncounterResult = `${selectedType}: ${details}`;
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Ruins - ${selectedType}</h2><p>${details}</p>`
        });

    } catch (error) {
        console.error("Error in executeRuins function:", error);
        ui.notifications.error("An error occurred while generating ruins details.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeRuins = executeRuins;
