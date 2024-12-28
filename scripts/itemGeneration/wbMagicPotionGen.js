export class MagicPotionGenerator {
    constructor() {
        this.spellList = [];
    }

    // Load spells from the world
    async loadSpells() {
        const allItems = game.items.contents;

        // Filter for spells
        this.spellList = allItems.filter(item => item.type === "spell");
        this.spellList.sort((a, b) => a.name.localeCompare(b.name));

        if (this.spellList.length === 0) {
            console.warn("No spells found in the world.");
            ui.notifications.warn("No spells found.");
        }

        console.log("Loaded Spells for Potions:", this.spellList);
    }

    // Render the Potion Creation UI
    renderPotionDialog(html, index) {
        const targetContainer = html.find(`.magic-item-generator-content[data-index="${index}"]`);

        if (!targetContainer.length) {
            console.error(`Target container for Potion Builder not found for Magic Item ${index}.`);
            return;
        }

        if (!this.spellList.length) {
            targetContainer.html("<p>No spells available to create potions.</p>");
            return;
        }

        const spellOptions = this.spellList
            .map(spell => `<option value="${spell.id}">${spell.name} (Level ${spell.system.level || "N/A"})</option>`)
            .join("");

        const dialogContent = `
            <div class="potion-generator">
                <form>
                    <div class="form-group">
                        <label for="spell-selector">Select a Spell:</label>
                        <select id="spell-selector">${spellOptions}</select>
                    </div>
                    <div class="form-group">
                        <label for="caster-level">Caster Level:</label>
                        <input type="number" id="caster-level" min="1" value="1" />
                    </div>
                    <button type="button" id="create-potion">Create Potion</button>
                </form>
            </div>
        `;

        targetContainer.html(dialogContent);

        // Event listeners
        targetContainer.find("#create-potion").click(() => this.createPotion(targetContainer));
    }

    // Create magical potion
    async createPotion(targetContainer) {
        const spellId = targetContainer.find("#spell-selector").val();
        const casterLevel = parseInt(targetContainer.find("#caster-level").val(), 10);
        const selectedSpell = game.items.get(spellId);

        if (!selectedSpell) {
            ui.notifications.error("Please select a valid spell.");
            return;
        }

        const spellName = selectedSpell.name;
        const spellLevel = Math.max(1, selectedSpell.system.level || 1); // Ensure minimum level is 1
        const potionCost = spellLevel * casterLevel * 50; // Potion cost formula: level × caster level × 50 gp
        const xpValue = spellLevel * 50; // XP value as per schema: spell level × 50

        // Determine potion icon based on spell type
        const spellType = selectedSpell.system.type || "Unknown";
        const potionIcon = spellType === "Arcane"
            ? "icons/consumables/potions/bottle-round-label-cork-red.webp"
            : "icons/consumables/potions/bottle-round-label-cork-blue.webp";

        const potionData = {
            name: `Potion of ${spellName}`,
            type: "item", // Item type remains "item"
            img: potionIcon, // Use the determined icon
            system: {
                alias: "Potion",
                attributes: {
                    magic: true,
                    rarity: "common",
                    identified: true, // Potions are identified by default
                    type: "Potion", // Explicitly setting the potion type
                    material: "potions", // Material type set to "potions"
                },
                description: `<p><strong>${spellName}:</strong> ${selectedSpell.system.description || "No description available."}</p>`,
                cost: {
                    value: potionCost,
                    currency: "gp",
                },
                xp: xpValue, // Add xp value to the potion data
                actionGroups: [
                    {
                        id: foundry.utils.randomID(),
                        name: spellName,
                        description: selectedSpell.system.description || "No description available.",
                        actions: (selectedSpell.system.actionGroups?.flatMap(group => group.actions) || []).map(action => {
                            const newAction = foundry.utils.duplicate(action);
                            newAction.id = foundry.utils.randomID();
                            return newAction;
                        }),
                    },
                ],
            },
        };

        await Item.create(potionData);
        ui.notifications.info(`Created potion: Potion of ${spellName}`);
    }
}
