export class MagicWeaponGenerator {
    constructor() {
      this.weaponList = [];
      this.spellList = [];
    }
  
    // XP Values for Base Enhancement Bonuses
    static baseXpValues = {
      1: 400,
      2: 800,
      3: 1400,
      4: 2000,
      5: 3000,
    };
  
    // XP Values for Spell Levels
    static xpValues = {
      1: 250,
      2: 750,
      3: 1500,
      4: 2500,
      5: 4000,
      6: 5500,
      7: 7500,
      8: 8500,
      9: 10000,
    };
  
    // Cost Values for Spell Levels
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
  
// Load weapons and spells
async loadItems() {
  try {
    // Step 1: Find all folders named "wb Weapon" and "wb Spell"
    const weaponFolders = game.folders.filter(f => f.name === "wb Weapon" && f.type === "Item");
    const spellFolders = game.folders.filter(f => f.name === "wb Spell" && f.type === "Item");

    if (weaponFolders.length === 0) {
      console.warn("No folders named 'wb Weapon' found.");
    }
    if (spellFolders.length === 0) {
      console.warn("No folders named 'wb Spell' found.");
    }

    console.log("Found Weapon Folders:", weaponFolders.map(f => f.name));
    console.log("Found Spell Folders:", spellFolders.map(f => f.name));

    // Step 2: Gather all items from the "wb Weapon" folders
    const weaponItems = weaponFolders.flatMap(folder => {
      console.log(`Fetching contents of folder: ${folder.name}`);
      return folder.contents;
    });

    // Step 3: Gather all items from the "wb Spell" folders
    const spellItems = spellFolders.flatMap(folder => {
      console.log(`Fetching contents of folder: ${folder.name}`);
      return folder.contents;
    });

    console.log("All weapon items retrieved:", weaponItems.map(item => item.name));
    console.log("All spell items retrieved:", spellItems.map(item => item.name));

    // Step 4: Filter weapons without magic
    this.weaponList = weaponItems
      .filter(item => item.type === "weapon" && item.system.attributes?.magic === false)
      .sort((a, b) => a.name.localeCompare(b.name));

    // Step 5: Filter spells and sort by level, then alphabetically
    this.spellList = spellItems
      .filter(item => item.type === "spell")
      .sort((a, b) => {
        const levelA = a.system.level || 0;
        const levelB = b.system.level || 0;
        if (levelA !== levelB) return levelA - levelB; // Sort by level
        return a.name.localeCompare(b.name); // Sort alphabetically within the same level
      });

    // Step 6: Log results
    console.log("Loaded Weapons:", this.weaponList);
    console.log("Loaded Spells:", this.spellList);
  } catch (error) {
    console.error("Error loading items:", error);
  }
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

  
    // Render the Weapon Creation UI
    renderWeaponDialog(html, index) {
      const targetContainer = html.find(`.magic-item-generator-content[data-index="${index}"]`);
  
      if (!targetContainer.length) {
        console.error(`Target container for Weapon Builder not found for Magic Item ${index}.`);
        return;
      }
  
      if (!this.weaponList.length) {
        targetContainer.html("<p>No weapons available to generate magic items.</p>");
        return;
      }
  
      const weaponOptions = this.weaponList
        .map(weapon => `<option value="${weapon.id}">${weapon.name}</option>`)
        .join("");
  
      const bonusOptions = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">+${i + 1}</option>`).join("");
  
      const dialogContent = `
        <div class="weapon-generator">
          <form>
            <div class="form-group">
              <label for="weapon-selector">Select Weapon:</label>
              <select id="weapon-selector">${weaponOptions}</select>
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
              <label for="spell-selector">Select a Spell:</label>
              <select id="spell-selector"></select>
            </div>
            <button type="button" id="apply-filters">Apply Filters</button>
            <button type="button" id="add-spell">Add Spell</button>
            <hr/>
            <div id="spell-list">
              <label>Selected Spells:</label>
              <table>
                <tbody id="selected-spells"></tbody>
              </table>
            </div>
            <button type="button" id="create-weapon">Create Weapon</button>
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
      targetContainer.find("#create-weapon").click(() => this.createWeapon(targetContainer));
    }
  
    // Add spell to the list
    addSpell(targetContainer) {
      const spellId = targetContainer.find("#spell-selector").val();
      const spell = game.items.get(spellId);
  
      if (!spell) {
        ui.notifications.warn("Please select a valid spell.");
        return;
      }
  
      const spellList = targetContainer.find("#selected-spells");
      if (spellList.find(`[data-id="${spell.id}"]`).length > 0) {
        ui.notifications.warn("This spell is already added.");
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
  
    // Create magical weapon
    async createWeapon(targetContainer) {
      const weaponId = targetContainer.find("#weapon-selector").val();
      const bonus = parseInt(targetContainer.find("#bonus-selector").val(), 10);
      const weapon = game.items.get(weaponId);
  
      if (!weapon) {
        ui.notifications.error("Failed to find the selected weapon.");
        return;
      }
  
      const clonedWeapon = foundry.utils.duplicate(weapon);
      clonedWeapon.name = `${weapon.name} +${bonus}`;
      clonedWeapon.system.alias = weapon.name;
      clonedWeapon.system.attributes.magic = true;
      clonedWeapon.system.attributes.identified = false;
      clonedWeapon.folder = null;
  
      const enhancementBonusCost = bonus ** 2 * 2000;
      const masterworkCost = 300;
  
      let specialAbilityCost = 0;
      let xpValue = MagicWeaponGenerator.baseXpValues[bonus] || 0;
  
      let combinedDescription = clonedWeapon.system.description || "";
      const spellNames = [];
      const spellIds = targetContainer.find("#selected-spells tr").map((_, tr) => $(tr).data("id")).get();
  
      clonedWeapon.system.actionGroups = [];
      for (const spellId of spellIds) {
        const spell = game.items.get(spellId);
        if (!spell) continue;
  
        const spellLevel = Math.max(spell.system.level || 1, 1);
        specialAbilityCost += MagicWeaponGenerator.costValues[spellLevel];
        xpValue += MagicWeaponGenerator.xpValues[spellLevel];
  
        combinedDescription += `<p><strong>${spell.name}:</strong> ${spell.system.description || "No description available."}</p>`;
        spellNames.push(spell.name);
  
        clonedWeapon.system.actionGroups.push({
          id: foundry.utils.randomID(),
          name: spell.name,
          description: spell.system.description || "No description available.",
          actions: spell.system.actions || [],
        });
      }
  
      if (spellNames.length > 0) {
        clonedWeapon.name += ` (${spellNames.join(", ")})`;
      }
  
      clonedWeapon.system.description = combinedDescription;
  
      const totalCost = enhancementBonusCost + masterworkCost + specialAbilityCost;
      clonedWeapon.system.cost = {
        value: totalCost,
        currency: "gp",
      };
      clonedWeapon.system.xp = xpValue;
  
      clonedWeapon.system.attack.magicBonus = bonus;
      clonedWeapon.system.damage.magicBonus = bonus;
      clonedWeapon.system.attack.magicPotency = bonus;
  
      await Item.create(clonedWeapon);
      ui.notifications.info(`Created magical weapon: ${clonedWeapon.name} with ${xpValue} XP.`);
    }
  }
  