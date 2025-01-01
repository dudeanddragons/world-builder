/**
 * Registers a button in the settings menu for the World Builder module.
 */
Hooks.once("init", () => {
    game.settings.registerMenu("world-builder", "createFoldersAndCompendiumsButton", {
        name: "Create World Builder Folders and Compendiums",
        label: "Create Folders & Compendiums", // The button text
        hint: "Click to create folders and compendiums for the World Builder.",
        icon: "fas fa-folder", // Button icon
        type: CreateFoldersAndCompendiumsForm,
        restricted: true, // Only available to GMs
    });
});

/**
 * A FormApplication that uses wbSettings.hbs for the UI and handles folder and compendium creation.
 */
class CreateFoldersAndCompendiumsForm extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "create-folders-and-compendiums-form",
            title: "Create World Builder Folders and Compendiums",
            template: "modules/world-builder/templates/wbSettings.hbs", // Use the Handlebars template
            closeOnSubmit: true,
        });
    }

    /** @override */
    async _updateObject(event, formData) {
        console.log("World Builder | Button clicked. Creating folders and compendiums...");
        try {
            await createNestedFoldersAndCompendiums();
            ui.notifications.info("World Builder folders and compendiums successfully created.");
        } catch (error) {
            console.error("World Builder | Error creating folders and compendiums:", error);
            ui.notifications.error("An error occurred while creating folders and compendiums. Check the console.");
        }
    }
}

/**
 * The function to create folders and compendiums.
 */
export async function createNestedFoldersAndCompendiums() {
    const parentFolderName = "World Builder";
    const folderColor = "#0000FF"; // Blue color in hex

    // Subfolder names
    const subfolders = ["WB Actors", "WB Lairs", "WB Magic Items"];

    // Step 1: Create or find the parent folder
    const parentFolder = await getFolder(parentFolderName, "Compendium", null, false, folderColor);

    // Step 2: Create or find each subfolder inside the parent folder
    const folderMap = {};
    for (const subfolderName of subfolders) {
        const subfolder = await getFolder(subfolderName, "Compendium", parentFolder.id, false, folderColor);
        console.log(`Created or updated subfolder "${subfolder.name}" under "${parentFolder.name}".`);
        folderMap[subfolderName] = subfolder; // Save reference to each folder
    }

    // Step 3: Create compendiums in their respective folders
    const compendiumsToCreate = {
        "WB Actors": [
            { name: "wb-npc-clone", label: "WB NPC Clones", type: "Actor" },
            { name: "wb-equip-war-ftr", label: "WB Equip WAR FTR", type: "Actor" },
            { name: "wb-equip-war-pld", label: "WB Equip WAR PLD", type: "Actor" },
            { name: "wb-equip-war-rng", label: "WB Equip WAR RNG", type: "Actor" },
            { name: "wb-equip-pri-clr", label: "WB Equip PRI CLR", type: "Actor" },
            { name: "wb-equip-pri-dru", label: "WB Equip PRI DRU", type: "Actor" },
            { name: "wb-equip-rog-thf", label: "WB Equip ROG THF", type: "Actor" },
            { name: "wb-equip-rog-brd", label: "WB Equip ROG BRD", type: "Actor" },
            { name: "wb-equip-wiz-mag", label: "WB Equip WIZ MAG", type: "Actor" },
        ],
        "WB Lairs": [
            { name: "wb-lairs-dungeons", label: "WB Lairs Dungeons", type: "Actor" },
            { name: "wb-lairs-caves", label: "WB Lairs Caves", type: "Actor" },
            { name: "wb-lairs-camps", label: "WB Lairs Camps", type: "Actor" },
            { name: "wb-lairs-dwellings", label: "WB Lairs Dwellings", type: "Actor" },
            { name: "wb-lairs-shipwrecks", label: "WB Lairs Shipwrecks", type: "Actor" },
            { name: "wb-lairs-crevice", label: "WB Lairs Crevice", type: "Actor" },
            { name: "wb-lairs-ledges", label: "WB Lairs Ledges", type: "Actor" },
        ],
        "WB Magic Items": [
            { name: "wb-magic-item-gen", label: "WB Magic Item Gen", type: "Item" },
        ],
    };

    for (const [folderName, compendiums] of Object.entries(compendiumsToCreate)) {
        const folder = folderMap[folderName];
        if (folder) {
            for (const { name, label, type } of compendiums) {
                await createCompendium(name, label, type, folder.id);
            }
        } else {
            console.error(`Folder "${folderName}" not found. Compendiums not created.`);
        }
    }

    ui.notifications.info("Folders and compendiums successfully created.");
}

/**
 * Function to get or create a folder.
 */
async function getFolder(folderName, type, parentFolder = null, usePack = false, color = null) {
    const folders = game.folders;
    const found = folders.find(e => e.type === type && e.name === folderName && e.folder === parentFolder);
    if (found) {
        if (color && found.color !== color) {
            await found.update({ color });
        }
        return found;
    }

    return Folder.create({
        name: folderName,
        type,
        folder: parentFolder,
        sorting: "m",
        color,
    });
}

/**
 * Function to create a compendium.
 */
async function createCompendium(name, label, type, folderId) {
    const existingCompendium = Array.from(game.packs).find(
        pack => pack.metadata.name === name && pack.metadata.package === "world"
    );

    if (!existingCompendium) {
        const createdCompendium = await CompendiumCollection.createCompendium({
            label,
            name,
            type,
            package: "world",
        });

        const newCompendium = game.packs.get(`world.${createdCompendium.metadata.name}`);
        if (newCompendium) {
            await newCompendium.configure({ folder: folderId });
            console.log(`Compendium "${label}" created in folder ID "${folderId}".`);
        }
    } else {
        console.log(`Compendium "${label}" already exists.`);
    }
}
