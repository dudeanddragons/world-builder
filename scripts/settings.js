/**
 * Registers a button in the settings menu for the World Builder module.
 */
Hooks.once("init", () => {
    game.settings.registerMenu("world-builder", "createFoldersAndCompendiumsButton", {
        name: "Create World Builder Folders and Compendiums",
        label: "Create Folders", // The button text
        hint: "Click to create folders for the World Builder.",
        icon: "fas fa-folder", // Button icon
        type: CreateFoldersAndCompendiumsForm,
        restricted: true, // Only available to GMs
    });
});

/**
 * A FormApplication that handles folder creation.
 */
class CreateFoldersAndCompendiumsForm extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "create-folders-and-compendiums-form",
            title: "Create World Builder Folders",
            template: "modules/world-builder/templates/wbSettings.hbs", // Use the Handlebars template
            closeOnSubmit: true,
        });
    }

    /** @override */
    async _updateObject(event, formData) {
        console.log("World Builder | Button clicked. Creating folders...");
        try {
            await createNestedFoldersAndCompendiums();
            ui.notifications.info("World Builder folders successfully created.");
        } catch (error) {
            console.error("World Builder | Error creating folders:", error);
            ui.notifications.error("An error occurred while creating folders. Check the console.");
        }
    }
}

/**
 * The function to create folders.
 */
export async function createNestedFoldersAndCompendiums() {
    const actorMainFolderName = "World Builder"; // Main actor folder
    const actorSubFolderNames = [
        "wb NPC Clones",
        "wb Lair Dungeon",
        "wb Lair Cave",
        "wb Lair Dwelling",
        "wb Lair Camp",
        "wb Lair Shipwreck",
        "wb Lair Crevice",
        "wb Lair Ledge",
    ]; // Actor subfolders

    const itemMainFolderName = "World Builder"; // Main item folder
    const itemSubFolderNames = [
        "wb Items Master",
        "wb Lair Treasure",
        "wb Equipment WAR FTR",
        "wb Equipment WAR PLD",
        "wb Equipment WAR RNG",
        "wb Equipment PRI CLR",
        "wb Equipment PRI DRU",
        "wb Equipment ROG THF",
        "wb Equipment ROG BRD",
        "wb Equipment WIZ MAG",
    ]; // Item subfolders

    const itemsMasterSubFolders = [
        "wb Armor",
        "wb Background",
        "wb Class",
        "wb Container",
        "wb Currency",
        "wb Item",
        "wb Race",
        "wb Spell",
        "wb Weapon",
    ];

    const lairTreasureSubFolders = [
        "wb Art",
        "wb Gem",
        "wb Magic Armor",
        "wb Magic Container",
        "wb Magic Item",
        "wb Magic Weapon",
        "wb Potion",
        "wb Scroll",
        "wb Wand",
    ];

    const actorMainColor = "#0000FF"; // Blue color for main actor folder
    const actorSubColor = "#2f5e6f"; // Light blue for actor subfolders
    const itemMainColor = "#0000FF"; // Blue color for main item folder
    const itemSubColor = "#2f5e6f"; // Light blue for item subfolders
    const nestedSubColor = "#5fa8d3"; // Lightest blue for nested subfolders

    try {
        // Create Actor Folders
        const actorMainFolder = await getFolder(actorMainFolderName, "Actor", null, false, actorMainColor);
        for (const subFolderName of actorSubFolderNames) {
            await getFolder(subFolderName, "Actor", actorMainFolder.id, false, actorSubColor);
        }

        // Create Item Folders
        const itemMainFolder = await getFolder(itemMainFolderName, "Item", null, false, itemMainColor);
        for (const subFolderName of itemSubFolderNames) {
            const subFolder = await getFolder(subFolderName, "Item", itemMainFolder.id, false, itemSubColor);

            // Add nested subfolders for wb Items Master
            if (subFolderName === "wb Items Master") {
                for (const nestedFolderName of itemsMasterSubFolders) {
                    await getFolder(nestedFolderName, "Item", subFolder.id, false, nestedSubColor);
                }
            }

            // Add nested subfolders for wb Lair Treasure
            if (subFolderName === "wb Lair Treasure") {
                for (const nestedFolderName of lairTreasureSubFolders) {
                    await getFolder(nestedFolderName, "Item", subFolder.id, false, nestedSubColor);
                }
            }
        }

        ui.notifications.info(`"World Builder" folders created successfully!`);
    } catch (error) {
        console.error("Error creating folders:", error);
        ui.notifications.error("Failed to create folders. See console for details.");
    }
}

/**
 * Function to get or create a folder.
 */
async function getFolder(folderName, type, parentFolder = null, usePack = false, color = null) {
    const folder = game.folders.find(f => f.name === folderName && f.type === type && f.folder === parentFolder);
    if (folder) {
        if (color && folder.color !== color) {
            await folder.update({ color });
        }
        return folder;
    }

    const newFolder = await Folder.create({
        name: folderName,
        type,
        folder: parentFolder,
        sorting: "a", // Alphabetical sorting
        color,
    });

    ui.notifications.info(`Created folder: ${folderName}`);
    return newFolder;
}
