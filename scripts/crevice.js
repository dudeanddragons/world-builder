// crevice.js - Final Comprehensive Update

async function executeCrevice() {
    console.log("Executing Crevice Encounter...");

    const encounters = [
        { name: "Giant Ants", quantity: "1d100" },
        { name: "Fire Beetles", quantity: "3d6" },
        { name: "Giant Centipedes", quantity: "2d12" },
        { name: "Giant Leeches", quantity: "2d8" },
        { name: "Giant Beetles", quantity: "3d4" },
        { name: "Giant Scorpions", quantity: "1d6" },
        { name: "Poisonous Snakes", quantity: "1d6" },
        { name: "Giant Slugs", quantity: "1d6" }
    ];

    const contents = [
        { result: "Nothing" },
        { result: "1d4 Refuse Items Plus 1 Skeleton Item", refuseRolls: "1d4", additional: "Skeleton" },
        { result: "1d4 Refuse Items Plus 1 Relic Item", refuseRolls: "1d4", additional: "Relic" },
        { result: "1d4 Refuse Items Plus 1 Remains Item", refuseRolls: "1d4", additional: "Remains" },
        { result: "1d6 Refuse Items Plus 1 Artifact Item", refuseRolls: "1d6", additional: "Artifact" }
    ];

    // Comprehensive mapping for all sub-features
    const moduleNameMap = {
        "Refuse": "refuse.js",
        "Relic": "relics.js",
        "Remains": "remains.js",
        "Skeleton": "skeletons.js",
        "Artifact": "artifacts.js",
        "Antique": "antiques.js",
        "Vestige": "vestiges.js",
        "Remnant": "remnants.js",
        "Crevice": "crevice.js"
    };

    try {
        const encounterRoll = await new Roll("1d8").evaluate();
        const encounter = encounters[encounterRoll.total - 1];
        const quantityRoll = await new Roll(encounter.quantity).evaluate();
        const encounterDescription = `${quantityRoll.total} ${encounter.name}`;

        const contentRoll = await new Roll("1d5").evaluate();
        const content = contents[contentRoll.total - 1];

        let contentDescription = content.result;
        let refuseResults = [];

        // Improved function for loading and executing modules with robust checks
        async function loadAndExecute(moduleName) {
            const fileName = moduleNameMap[moduleName] || `${moduleName.toLowerCase()}.js`;
            try {
                // Attempt dynamic import using the mapped file name
                const module = await import(`/modules/world-builder/scripts/${fileName}`);
                if (module && typeof module.execute === "function") {
                    await module.execute();
                    return game.recentEncounterResult;
                }
            } catch (error) {
                console.warn(`Dynamic import failed for ${moduleName}: ${error.message}`);
            }

            // Fallback to global function with plural/singular checks
            const executeFunction = `execute${moduleName}`;
            const executeFunctionPlural = `execute${moduleName}s`;
            if (typeof window[executeFunction] === "function") {
                await window[executeFunction]();
                return game.recentEncounterResult;
            } else if (typeof window[executeFunctionPlural] === "function") {
                await window[executeFunctionPlural]();
                return game.recentEncounterResult;
            }

            console.warn(`No valid execute function found for ${moduleName}`);
            return null;
        }

        // Handle Refuse Items
        if (content.refuseRolls) {
            const refuseRoll = await new Roll(content.refuseRolls).evaluate();
            for (let i = 0; i < refuseRoll.total; i++) {
                const refuseResult = await loadAndExecute("Refuse");
                if (refuseResult) refuseResults.push(refuseResult);
            }
            contentDescription += `<br><strong>Refuse Items Found:</strong> ${refuseResults.join(", ")}`;
        }

        // Handle Additional Items (e.g., Skeleton, Relic, Artifact)
        if (content.additional) {
            const additionalResult = await loadAndExecute(content.additional);
            if (additionalResult) {
                contentDescription += `<br><strong>${content.additional} Item Found:</strong> ${additionalResult}`;
            }
        }

        const resultMessage = `<strong>Encounter:</strong> ${encounterDescription}<br><strong>Contents:</strong> ${contentDescription}`;
        game.recentEncounterResult = resultMessage;
        ChatMessage.create({ content: resultMessage, speaker: { alias: "Crevice Encounter" } });

    } catch (error) {
        console.error("Error in executeCrevice function:", error);
        ui.notifications.error("An error occurred while generating crevice details. Check the console for more information.");
    }
}

window.executeCrevice = executeCrevice;
