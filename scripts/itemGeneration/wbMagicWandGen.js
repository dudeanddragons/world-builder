export class MagicWandGenerator {
    constructor() {
        this.spellList = [];
    }

    // Load spells from the wb-items-master compendium
    async loadSpells() {
        const compendium = game.packs.get("world.wb-items-master");
        if (!compendium) {
            console.error("Compendium 'wb-items-master' not found.");
            ui.notifications.error("Compendium 'wb-items-master' not found.");
            return;
        }

        try {
            // Fetch all items from the compendium
            const allItems = await compendium.getDocuments();

            // Filter for spells
            this.spellList = allItems.filter(item => item.type === "spell");
            this.spellList.sort((a, b) => a.name.localeCompare(b.name));

            if (this.spellList.length === 0) {
                console.warn("No spells found in the wb-items-master compendium.");
                ui.notifications.warn("No spells found in the compendium.");
            }

            console.log("Loaded Spells for Wands:", this.spellList);
        } catch (error) {
            console.error("Error loading spells from compendium:", error);
            ui.notifications.error("Failed to load spells. Check the console for details.");
        }
    }

    // Render the Wand Creation UI
    renderWandDialog(html, index) {
        const targetContainer = html.find(`.magic-item-generator-content[data-index="${index}"]`);

        if (!targetContainer.length) {
            console.error(`Target container for Wand Builder not found for Magic Item ${index}.`);
            return;
        }

        if (!this.spellList.length) {
            targetContainer.html("<p>No spells available to create wands.</p>");
            return;
        }

        const spellTypes = ["All", "Arcane", "Divine"];
        const spellOptions = this.spellList
            .map(spell => `<option value="${spell.id}">${spell.name} (Level ${spell.system.level || "N/A"})</option>`)
            .join("");

        const dialogContent = `
            <div class="wand-generator">
                <form>
                    <div class="form-group">
                        <label for="type-selector">Select Spell Type:</label>
                        <select id="type-selector">
                            ${spellTypes.map(type => `<option value="${type}">${type}</option>`).join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="spell-selector">Select a Spell:</label>
                        <select id="spell-selector">${spellOptions}</select>
                    </div>
                    <div class="form-group">
                        <label for="caster-level">Caster Level:</label>
                        <input type="number" id="caster-level" min="1" value="1" />
                    </div>
                    <button type="button" id="apply-filters">Apply Filters</button>
                    <button type="button" id="create-wand">Create Wand</button>
                </form>
            </div>
        `;

        targetContainer.html(dialogContent);

        // Event listeners
        targetContainer.find("#apply-filters").click(() => this.applyFilters(targetContainer));
        targetContainer.find("#create-wand").click(() => this.createWand(targetContainer));
    }

    // Apply spell filters
    applyFilters(targetContainer) {
        const selectedType = targetContainer.find("#type-selector").val();

        const filteredSpells = this.spellList.filter(spell => {
            const system = spell.system || {};
            const matchesType = selectedType === "All" || system.type === selectedType;
            return matchesType;
        });

        const spellOptions = filteredSpells
            .map(spell => `<option value="${spell.id}">${spell.name} (Level ${spell.system.level || "N/A"})</option>`)
            .join("");

        targetContainer.find("#spell-selector").html(spellOptions);
    }

    // Create magical wand
    async createWand(targetContainer) {
        const spellId = targetContainer.find("#spell-selector").val();
        const casterLevel = parseInt(targetContainer.find("#caster-level").val(), 10);
        const selectedSpell = this.spellList.find(spell => spell.id === spellId);

        if (!selectedSpell) {
            ui.notifications.error("Please select a valid spell.");
            return;
        }

        const spellName = selectedSpell.name;
        const spellLevel = Math.max(1, selectedSpell.system.level || 1); // Ensure minimum level is 1
        const casterLevelDerived = this.getCasterLevel(selectedSpell.system.type || "Unknown", spellLevel);
        const wandCost = this.calculateWandCost(spellLevel, casterLevelDerived);
        const xpValue = spellLevel * 100; // XP value as per schema: spell level × 100

        // Determine wand icon based on spell type
        const spellType = selectedSpell.system.type || "Unknown";
        const wandIcon = spellType === "Arcane"
            ? "icons/weapons/wands/wand-gem-red.webp"
            : "icons/weapons/wands/wand-gem-violet.webp";

        const wandData = {
            name: `Wand (${spellType}): ${spellName}`,
            type: "item", // Item type remains "item"
            img: wandIcon, // Use the determined icon
            system: {
                alias: "Wand",
                attributes: {
                    magic: true,
                    rarity: "uncommon",
                    identified: false, // Wand starts as NOT identified
                    type: "Wand", // Explicitly setting the wand type
                    material: "wood_thick", // Set material type to "wood_thick"
                },
                description: `<p><strong>${spellName}:</strong> ${selectedSpell.system.description || "No description available."}</p>`,
                cost: {
                    value: wandCost,
                    currency: "gp",
                },
                xp: xpValue, // Add xp value to the wand data
                charges: {
                    value: 50, // Default maximum charges for a wand
                    max: 50,
                    min: 0,
                    reuse: "none", // No special reuse rules by default
                },
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

        await Item.create(wandData);
        ui.notifications.info(`Created unidentified wand: Wand (${spellType}): ${spellName}`);
    }

    // Get caster level based on spell type and level
    getCasterLevel(type, level) {
        const arcaneCasterLevels = { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 12, 7: 14, 8: 16, 9: 18 };
        const divineCasterLevels = { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 11, 7: 14, 8: 16, 9: 18 };
        return type === "Arcane" ? arcaneCasterLevels[level] : divineCasterLevels[level];
    }

    // Calculate wand cost
    calculateWandCost(level, casterLevel) {
        return level * casterLevel * 750; // Wand cost calculation: Spell Level × Caster Level × 750 gp
    }
}
