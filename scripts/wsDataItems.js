export function categorizeItems() {
    // Retrieve all items in the world
    const allItems = game.items.contents;

    if (!allItems || allItems.length === 0) {
        console.warn("No items available in the game.");
        return {};
    }

    console.log("All Items Retrieved:", allItems);

    // Initialize categories
    const categories = {
        items: [],
        armor: [],
        weapons: [],
        currency: [],
        potions: [],
        scrolls: [],
        magicItems: [],
        magicWeapons: [],
        gems: [],
        magicArmor: [],
        art: [],
        spells: [],
    };

    // Process each item
    for (const item of allItems) {
        const type = (item.type || "unknown").toLowerCase(); // Normalize type to lowercase
        const magic = item.system?.attributes?.magic || false; // Magic flag remains boolean
        const attributeType = (item.system?.attributes?.type || "none").toLowerCase(); // Normalize attribute type
        const spellType = (item.system?.type || "none").toLowerCase(); // For spells: arcane, divine, etc.

        // Debug each item being processed
        console.log(`Processing Item: ${item.name} (Type: ${type}, Magic: ${magic}, Attribute Type: ${attributeType})`);

        // Categorization logic
        const itemData = {
            id: item.id, // Include item ID
            name: item.name,
            type: type,
            magic: magic,
            system: item.system,
            attributeType: attributeType,
            spellType: spellType,
        };

        if ((type === "item" || type === "container") && !magic && !["gem", "art"].includes(attributeType)) {
            categories.items.push(itemData);
        }
        if (type === "armor" && !magic) {
            categories.armor.push(itemData);
        }
        if (type === "weapon" && !magic) {
            categories.weapons.push(itemData); // Non-magic weapons
        }
        if (type === "weapon" && magic) {
            categories.magicWeapons.push(itemData); // Magic weapons
        }
        if (type === "currency") {
            categories.currency.push(itemData);
        }
        if (type === "potion") {
            categories.potions.push(itemData);
        }
        if (type === "container" && attributeType === "scroll" && magic) {
            categories.scrolls.push(itemData); // Scrolls with `attributes.type === "scroll"` (case-insensitive)
        }
        if (["item", "container", "potion"].includes(type) && magic) {
            categories.magicItems.push(itemData);
        }
        if (type === "item" && attributeType === "gem") {
            categories.gems.push(itemData); // Gems with `attributes.type === "gem"` (case-insensitive)
        }
        if (type === "armor" && magic) {
            categories.magicArmor.push(itemData);
        }
        if (type === "item" && ["art", "jewelry", "ring"].includes(attributeType)) {
            categories.art.push(itemData); // Art with `attributes.type === "art", "jewelry", or "ring"` (case-insensitive)
        }
        if (type === "spell") {
            categories.spells.push(itemData); // Spells with type information
        }
    }

    console.log("Categorized Items:", categories);

    // Return categorized items
    return categories;
}
