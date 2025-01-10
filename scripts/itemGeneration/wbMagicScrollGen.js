export class MagicScrollGenerator {
    constructor() {
        this.spellList = [];
    }

    // Load spells into the generator from the compendium
    async loadSpells() {
        try {
          // Step 1: Find all folders named "wb Spell"
          const spellFolders = game.folders.filter(f => f.name === "wb Spell" && f.type === "Item");
          if (spellFolders.length === 0) {
            console.error("No folders named 'wb Spell' found.");
            ui.notifications.error("Spell folders not found.");
            return;
          }
      
          console.log("Found Spell Folders:", spellFolders.map(f => f.name));
      
          // Step 2: Gather all items from "wb Spell" folders
          const allItems = spellFolders.flatMap(folder => {
            console.log(`Fetching contents of folder: ${folder.name}`);
            return folder.contents;
          });
      
          console.log("All spell items retrieved:", allItems.map(item => item.name));
      
          // Step 3: Filter for spells
          this.spellList = allItems.filter(item => item.type === "spell");
      
          // Step 4: Log results and notify if no spells are found
          if (this.spellList.length === 0) {
            console.warn("No spells found in the 'wb Spell' folders.");
            ui.notifications.warn("No spells found in the spell folders.");
          } else {
            console.log("Loaded Spells:", this.spellList.map(spell => spell.name));
          }
        } catch (error) {
          console.error("Error loading spells from folders:", error);
          ui.notifications.error("Failed to load spells from the folders. Check the console for details.");
        }
      }
      

    // Render the Scroll Creation UI
    renderScrollDialog(html, index) {
        const targetContainer = html.find(`.magic-item-generator-content[data-index="${index}"]`);

        if (!targetContainer.length) {
            console.error(`Target container for Scroll Builder not found for Magic Item ${index}.`);
            return;
        }

        if (!this.spellList.length) {
            targetContainer.html("<p>No spells available to create scrolls.</p>");
            return;
        }

        const spellTypes = ["Arcane", "Divine"];
        const spellLevels = Array.from({ length: 10 }, (_, i) => i); // Levels 0 to 9

        const dialogContent = `
            <div class="scroll-generator">
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
                    <button type="button" id="create-scroll">Create Scroll</button>
                </form>
            </div>
        `;

        targetContainer.html(dialogContent);

        // Event listeners
        targetContainer.find("#apply-filters").click(() => this.applyFilters(targetContainer));
        targetContainer.find("#create-scroll").click(() => this.createScroll(targetContainer));
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

    // Create the scroll item
    async createScroll(targetContainer) {
        const selectedSpellId = targetContainer.find("#spell-selector").val();
        const selectedSpell = this.spellList.find(spell => spell.id === selectedSpellId);

        if (!selectedSpell) {
            ui.notifications.error("Please select a valid spell.");
            return;
        }

        const spellType = selectedSpell.system.type || "Unknown";
        const spellName = selectedSpell.name;
        const spellLevel = Math.max(1, selectedSpell.system.level || 0);
        const casterLevel = this.getCasterLevel(spellType, spellLevel);
        const scrollCost = this.calculateScrollCost(spellLevel, casterLevel);
        const xpValue = spellLevel * 100;

        const scrollData = {
            name: `Scroll (${spellType}): ${spellName}`,
            type: "item",
            img: spellType === "Arcane"
                ? "icons/sundries/scrolls/scroll-bound-ruby-red.webp"
                : "icons/sundries/scrolls/scroll-bound-sealed-blue.webp",
            system: {
                alias: "Scroll",
                attributes: {
                    magic: true,
                    rarity: "common",
                    identified: false,
                    type: "Scroll",
                    material: "paper",
                },
                description: `<p><strong>${spellName}:</strong> ${selectedSpell.system.description || "No description available."}</p>`,
                cost: {
                    value: scrollCost,
                    currency: "gp",
                },
                xp: xpValue,
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

        await Item.create(scrollData);
        ui.notifications.info(`Created unidentified scroll: Scroll (${spellType}): ${spellName}`);
    }

    // Get caster level based on spell type and level
    getCasterLevel(type, level) {
        const arcaneCasterLevels = { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 12, 7: 14, 8: 16, 9: 18 };
        const divineCasterLevels = { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 11, 7: 14, 8: 16, 9: 18 };
        return type === "Arcane" ? arcaneCasterLevels[level] : divineCasterLevels[level];
    }

    // Calculate the scroll cost
    calculateScrollCost(level, casterLevel) {
        return Math.max(1, level) * casterLevel * 25;
    }
}
