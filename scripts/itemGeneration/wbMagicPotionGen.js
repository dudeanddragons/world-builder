export class MagicPotionGenerator {
    constructor() {
        this.spellList = [];
    }

    // Load spells from the "wb-items-master" compendium
    async loadSpells() {
        try {
            const compendium = game.packs.get("world.wb-items-master");
            if (!compendium) {
                console.error("Compendium 'wb-items-master' not found.");
                ui.notifications.error("Compendium 'wb-items-master' not found.");
                return;
            }

            // Fetch all documents from the compendium
            const allItems = await compendium.getDocuments();

            // Filter for spells
            this.spellList = allItems.filter(item => item.type === "spell");
            this.spellList.sort((a, b) => a.name.localeCompare(b.name));

            if (this.spellList.length === 0) {
                console.warn("No spells found in the 'wb-items-master' compendium.");
                ui.notifications.warn("No spells found in the compendium.");
            }

            console.log("Loaded Spells for Potions:", this.spellList);
        } catch (error) {
            console.error("Error loading spells from compendium:", error);
            ui.notifications.error("Failed to load spells from compendium. Check the console for details.");
        }
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

        const spellTypes = ["Arcane", "Divine"];
        const spellLevels = Array.from({ length: 10 }, (_, i) => i);

        const dialogContent = `
            <div class="potion-generator">
                <form>
                    <div class="form-group">
                        <label for="type-selector">Select Spell Type:</label>
                        <select id="type-selector">
                            <option value="">All</option>
                            ${spellTypes.map(type => `<option value="${type}">${type}</option>`).join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="level-selector">Select Spell Level:</label>
                        <select id="level-selector">
                            <option value="">All</option>
                            ${spellLevels.map(level => `<option value="${level}">${level}</option>`).join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="spell-selector">Select a Spell:</label>
                        <select id="spell-selector">
                            <option value="">Select a spell</option>
                        </select>
                    </div>
                    <button type="button" id="apply-filters">Apply Filters</button>
                    <button type="button" id="create-potion">Create Potion</button>
                </form>
            </div>
        `;

        targetContainer.html(dialogContent);

        // Event listeners
        targetContainer.find("#apply-filters").click(() => this.applyFilters(targetContainer));
        targetContainer.find("#create-potion").click(() => this.createPotion(targetContainer));
    }

    // Apply filters to the spell list
    applyFilters(targetContainer) {
        const selectedType = targetContainer.find("#type-selector").val();
        const selectedLevel = targetContainer.find("#level-selector").val();

        const filteredSpells = this.spellList.filter(spell => {
            const matchesType = !selectedType || spell.system.type === selectedType;
            const matchesLevel = selectedLevel === "" || spell.system.level?.toString() === selectedLevel;
            return matchesType && matchesLevel;
        });

        const spellOptions = filteredSpells
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(spell => `<option value="${spell.id}">${spell.name}</option>`)
            .join("");

        targetContainer.find("#spell-selector").html(spellOptions);
    }

    // Create a magical potion
    async createPotion(targetContainer) {
        const spellId = targetContainer.find("#spell-selector").val();
        const selectedSpell = this.spellList.find(spell => spell.id === spellId);

        if (!selectedSpell) {
            ui.notifications.error("Please select a valid spell.");
            return;
        }

        const spellType = selectedSpell.system.type || "Unknown";
        const spellName = selectedSpell.name;
        const spellLevel = selectedSpell.system.level || 0;
        const casterLevel = this.getCasterLevel(spellType, spellLevel);
        const potionCost = this.calculatePotionCost(spellLevel, casterLevel);
        const xpValue = spellLevel * 100; // XP value calculation: spell level × 100

        // Determine potion icon based on spell type
        const potionIcon = spellType === "Arcane"
            ? "icons/consumables/potions/bottle-round-label-cork-red.webp"
            : "icons/consumables/potions/bottle-round-label-cork-blue.webp";

        const potionData = {
            name: `Potion of ${spellName}`,
            type: "potion",
            img: potionIcon,
            system: {
                alias: "Potion",
                attributes: {
                    magic: true,
                    rarity: "common",
                    identified: false,
                },
                description: `<p><strong>${spellName}:</strong> ${selectedSpell.system.description || "No description available."}</p>`,
                cost: {
                    value: potionCost,
                    currency: "gp",
                },
                xp: xpValue, // Add XP value to the potion
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
        ui.notifications.info(`Created unidentified potion: Potion of ${spellName}`);
    }

    // Get caster level based on spell type and level
    getCasterLevel(type, level) {
        const arcaneCasterLevels = {
            1: 9, 2: 9, 3: 9, 4: 9, 5: 9,
            6: 12, 7: 14, 8: 16, 9: 18,
        };
        const divineCasterLevels = {
            1: 9, 2: 9, 3: 9, 4: 9, 5: 9,
            6: 11, 7: 14, 8: 16, 9: 18,
        };
        return type === "Arcane" ? arcaneCasterLevels[level] : divineCasterLevels[level];
    }

    // Calculate potion cost
    calculatePotionCost(level, casterLevel) {
        return level * casterLevel * 50; // Pathfinder 1e formula for potion cost
    }
}
