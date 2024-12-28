export class MagicArmorGenerator {
    constructor() {
      this.armorList = [];
      this.spellList = [];
    }
  
    // XP Values for Base Bonus
    static baseXpValues = {
      1: 500,
      2: 1000,
      3: 1500,
      4: 2000,
      5: 3000,
    };
  
    // XP Values for Special Abilities
    static xpValues = {
      1: 400,
      2: 1600,
      3: 2800,
      4: 4000,
      5: 5200,
      6: 6400,
      7: 7600,
      8: 8800,
      9: 10000,
    };
  
    // Cost Values for Special Abilities
    static costValues = {
      1: 1000,
      2: 4000,
      3: 9000,
      4: 16000,
      5: 25000,
      6: 36000,
      7: 49000,
      8: 64000,
      9: 81000,
    };
  
    // Load items and initialize the generator
    async loadItems() {
      const allItems = game.items.contents;
  
      // Filter armors without magic
      this.armorList = allItems
        .filter(item => item.type === "armor" && item.system.attributes?.magic === false)
        .sort((a, b) => a.name.localeCompare(b.name));
  
      // Filter spells
      this.spellList = allItems
        .filter(item => item.type === "spell" || item.system.type === "Armor")
        .sort((a, b) => a.name.localeCompare(b.name));
  
      console.log("Loaded Armors:", this.armorList);
      console.log("Loaded Spells:", this.spellList);
    }
  
    // Fetch spells based on filters
    async fetchFilteredSpells(spellType = "", spellLevel = "") {
      return this.spellList.filter(spell => {
        const system = spell.system || {};
        const matchesType = !spellType || system.type === spellType;
        const matchesLevel = !spellLevel || system.level === parseInt(spellLevel, 10);
        return matchesType && matchesLevel;
      }).sort((a, b) => a.name.localeCompare(b.name));
    }
  
    // Render the Armor Creation UI
    renderArmorDialog(html, index) {
      const targetContainer = html.find(`.magic-item-generator-content[data-index="${index}"]`);
  
      if (!targetContainer.length) {
        console.error(`Target container for Armor Builder not found for Magic Item ${index}.`);
        return;
      }
  
      if (!this.armorList.length) {
        targetContainer.html("<p>No armors available to generate magic items.</p>");
        return;
      }
  
      const armorOptions = this.armorList
        .map(armor => `<option value="${armor.id}">${armor.name}</option>`)
        .join("");
  
      const bonusOptions = Array.from({ length: 5 }, (_, i) => `<option value="${i + 1}">+${i + 1}</option>`).join("");
  
      const dialogContent = `
        <div class="armor-generator">
          <form>
            <div class="form-group">
              <label for="armor-selector">Select Armor:</label>
              <select id="armor-selector">${armorOptions}</select>
            </div>
            <div class="form-group">
              <label for="bonus-selector">Magical Bonus:</label>
              <select id="bonus-selector">${bonusOptions}</select>
            </div>
            <div class="form-group">
              <label for="type-selector">Spell Type:</label>
              <select id="type-selector">
                <option value="">All</option>
                <option value="Arcane">Arcane</option>
                <option value="Divine">Divine</option>
                <option value="Armor">Armor</option>
              </select>
            </div>
            <div class="form-group">
              <label for="level-selector">Spell Level:</label>
              <select id="level-selector">
                <option value="">All</option>
                ${Array.from({ length: 10 }, (_, i) => `<option value="${i}">${i}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label for="spell-selector">Select a Spell/Ability:</label>
              <select id="spell-selector"></select>
            </div>
            <button type="button" id="apply-filters">Apply Filters</button>
            <button type="button" id="add-spell">Add Ability</button>
            <hr/>
            <div id="spell-list">
              <label>Selected Abilities:</label>
              <table>
                <tbody id="selected-spells"></tbody>
              </table>
            </div>
            <button type="button" id="create-armor">Create Armor</button>
          </form>
        </div>
      `;
  
      targetContainer.html(dialogContent);
  
      // Event listeners
      targetContainer.find("#apply-filters").click(async () => {
        const spellType = targetContainer.find("#type-selector").val();
        const spellLevel = targetContainer.find("#level-selector").val();
        const spells = await this.fetchFilteredSpells(spellType, spellLevel);
        const spellOptions = spells
          .map(spell => `<option value="${spell.id}">${spell.name} (Level ${spell.system.level || "N/A"})</option>`)
          .join("");
        targetContainer.find("#spell-selector").html(spellOptions);
      });
  
      targetContainer.find("#add-spell").click(() => this.addSpell(targetContainer));
      targetContainer.find("#create-armor").click(() => this.createArmor(targetContainer));
    }
  
    // Add spell to the list
    addSpell(targetContainer) {
      const spellId = targetContainer.find("#spell-selector").val();
      const spell = game.items.get(spellId);
  
      if (!spell) {
        ui.notifications.warn("Please select a valid spell or ability.");
        return;
      }
  
      const spellList = targetContainer.find("#selected-spells");
      if (spellList.find(`[data-id="${spell.id}"]`).length > 0) {
        ui.notifications.warn("This ability is already added.");
        return;
      }
  
      const row = `
        <tr data-id="${spell.id}">
          <td>${spell.name} (Level ${spell.system.level || "N/A"})</td>
          <td><button type="button" class="remove-spell">Remove</button></td>
        </tr>
      `;
  
      spellList.append(row);
      spellList.find(".remove-spell").click(function () {
        $(this).closest("tr").remove();
      });
    }
  
    // Create magical armor
    async createArmor(targetContainer) {
      const armorId = targetContainer.find("#armor-selector").val();
      const bonus = parseInt(targetContainer.find("#bonus-selector").val(), 10);
      const armor = game.items.get(armorId);
  
      if (!armor) {
        ui.notifications.error("Failed to find the selected armor.");
        return;
      }
  
      const clonedArmor = foundry.utils.duplicate(armor);
      clonedArmor.name = `${armor.name} +${bonus}`;
      clonedArmor.system.alias = armor.name;
      clonedArmor.system.attributes.magic = true;
      clonedArmor.system.attributes.identified = false;
      clonedArmor.system.protection.modifier = bonus;
  
      // Adjust armor protection points based on the bonus
      const baseMaxPoints = armor.system.protection?.points?.max || 1;
      const baseValuePoints = armor.system.protection?.points?.value || 1;
      clonedArmor.system.protection.points = {
        max: baseMaxPoints * (bonus + 1),
        value: baseValuePoints * (bonus + 1),
      };
  
      // Calculate cost and XP
      const baseArmorCost = armor.system.cost?.value || 0;
      const masterworkCost = 300;
      const enhancementBonusCost = bonus ** 2 * 1000;
  
      let specialAbilityCost = 0;
      let xpValue = MagicArmorGenerator.baseXpValues[bonus] || 0;
      const abilityNames = [];
      const spellIds = targetContainer.find("#selected-spells tr").map((_, tr) => $(tr).data("id")).get();
  
      clonedArmor.system.actionGroups = [];
      for (const spellId of spellIds) {
        const spell = game.items.get(spellId);
        if (!spell) continue;
  
        const spellLevel = Math.max(spell.system.level || 1, 1);
        const spellCost = MagicArmorGenerator.costValues[spellLevel];
        const spellXP = MagicArmorGenerator.xpValues[spellLevel];
  
        clonedArmor.system.description += `<p><strong>${spell.name}:</strong> ${spell.system.description || "No description available."}</p>`;
        clonedArmor.system.actionGroups.push({
          id: foundry.utils.randomID(),
          name: spell.name,
          description: spell.system.description || "No description available.",
          actions: spell.system.actions || [],
        });
  
        abilityNames.push(spell.name);
        specialAbilityCost += spellCost;
        xpValue += spellXP;
      }
  
      if (abilityNames.length) {
        clonedArmor.name += ` (${abilityNames.join(", ")})`;
      }
  
      clonedArmor.system.cost = {
        value: baseArmorCost + masterworkCost + enhancementBonusCost + specialAbilityCost,
        currency: "gp",
      };
      clonedArmor.system.xp = xpValue;
  
      // Ensure the item is not placed in a folder
      clonedArmor.folder = null;
  
      // Create the item
      await Item.create(clonedArmor);
      ui.notifications.info(`Created magical armor: ${clonedArmor.name} with ${xpValue} XP.`);
    }
  }
  