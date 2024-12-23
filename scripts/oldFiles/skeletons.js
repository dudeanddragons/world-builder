// Skeletons Script
// Rolls on Skeleton sub-tables to determine the type, size, and any special features of the skeleton.

async function executeSkeletons() {
    try {
        const skeletonTypes = ["Small", "Man-Sized", "Giant", "Unusual", "Skulls", "Colossal"];
        const smallSkeletons = ["Miniscule", "Fairy", "Dwarven", "Pixie", "Gnome", "Kobold"];
        const manSizedSkeletons = ["Man", "Elven", "Orc", "Troll", "Lizard Man", "Snake"];
        const giantSkeletons = ["Ogre", "Hobgoblin", "True Giant", "Dinosaur", "Sea Monster", "Whale"];
        const unusualSkeletons = ["Cubie", "Crystalline", "Multi-Limbed", "Multi-Headed", "Winged", "Armor-Plated"];
        const skullTypes = ["Small", "Man-Sized", "Giant", "Colossal"];
        const colossalTypes = ["Humanoid", "Avian", "Reptilian", "Ursinoid", "Amphibian", "Crustacean"];
        const notableFeatures = [
            "Skeleton fused into single piece",
            "Skeleton has treasure with it",
            "Skeleton has magic item with it",
            "2d12 skeletons of this type are here",
            "Bones are engraved with mystic runes",
            "Spirit is bound to bones & can talk"
        ];

        // Roll for Skeleton Type
        const typeRoll = await new Roll("1d6").evaluate();
        const skeletonType = skeletonTypes[typeRoll.total - 1];
        let details = "";

        // Roll on the appropriate sub-table based on skeleton type
        switch (skeletonType) {
            case "Small":
                const smallRoll = await new Roll("1d6").evaluate();
                details = smallSkeletons[smallRoll.total - 1];
                break;

            case "Man-Sized":
                const manSizedRoll = await new Roll("1d6").evaluate();
                details = manSizedSkeletons[manSizedRoll.total - 1];
                break;

            case "Giant":
                const giantRoll = await new Roll("1d6").evaluate();
                details = giantSkeletons[giantRoll.total - 1];
                break;

            case "Unusual":
                const unusualRoll = await new Roll("1d6").evaluate();
                details = unusualSkeletons[unusualRoll.total - 1];
                break;

            case "Skulls":
                const skullRoll = await new Roll("1d6").evaluate();
                details = skullTypes[skullRoll.total - 1];
                break;

            case "Colossal":
                const colossalRoll = await new Roll("1d6").evaluate();
                details = colossalTypes[colossalRoll.total - 1];
                break;

            default:
                details = "Unknown type";
                break;
        }

        // Roll for Notable Feature
        const notableFeatureRoll = await new Roll("1d6").evaluate();
        const notableFeature = notableFeatures[notableFeatureRoll.total - 1];

        // Construct the final result message
        const skeletonDescription = `${skeletonType} Skeleton - ${details}. Notable Feature: ${notableFeature}`;
        game.recentEncounterResult = skeletonDescription;

        // Display the result in chat
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker(),
            content: `<h2>Skeleton Encounter</h2><p>${skeletonDescription}</p>`
        });

    } catch (error) {
        console.error("Error in executeSkeletons function:", error);
        ui.notifications.error("An error occurred while generating skeleton details.");
    }
}

// Attach the function to the window object for dynamic execution
window.executeSkeletons = executeSkeletons;
