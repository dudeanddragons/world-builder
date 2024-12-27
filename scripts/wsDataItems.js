/**
 * wsDataItems.js
 * A helper module to retrieve and categorize items in the world into specified groups.
 */

/**
 * Categorizes all items in the world into predefined categories.
 * @returns {Object} An object containing categorized arrays of items.
 */
export function categorizeItems() {
    // Retrieve all items in the world
    const allItems = game.items.contents;

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

        // Categorization logic
        if ((type === "item" || type === "container") && !magic && !["gem", "art"].includes(attributeType)) {
            categories.items.push(item);
        }
        if (type === "armor" && !magic) {
            categories.armor.push(item);
        }
        if (type === "weapon" && !magic) {
            categories.weapons.push(item); // Non-magic weapons
        }
        if (type === "weapon" && magic) {
            categories.magicWeapons.push(item); // Magic weapons
        }
        if (type === "currency") {
            categories.currency.push(item);
        }
        if (type === "potion") {
            categories.potions.push(item);
        }
        if (type === "container" && attributeType === "scroll" && magic) {
            categories.scrolls.push(item); // Scrolls with `attributes.type === "scroll"` (case-insensitive)
        }
        if (["item", "container", "potion"].includes(type) && magic) {
            categories.magicItems.push(item);
        }
        if (type === "item" && attributeType === "gem") {
            categories.gems.push(item); // Gems with `attributes.type === "gem"` (case-insensitive)
        }
        if (type === "armor" && magic) {
            categories.magicArmor.push(item);
        }
        if (type === "item" && ["art", "jewelry", "ring"].includes(attributeType)) {
            categories.art.push(item); // Art with `attributes.type === "art", "jewelry", or "ring"` (case-insensitive)
        }
        if (type === "spell") {
            categories.spells.push({ ...item, spellType }); // Spells with type information
        }
    }

    // Return categorized items
    return categories;
}
