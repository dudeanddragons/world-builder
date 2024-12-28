let armorGenerator; // Declare globally for the armor generator
let weaponGenerator; // Declare globally for the weapon generator
let scrollGenerator; // Declare globally for the scroll generator
let potionGenerator; // Declare globally for the potion generator
let wandGenerator; // Declare globally for the wand generator

export async function handleMagicItemsTab(builder, html) {
  const magicItemOptions = [
    "Magic Armor",
    "Magic Weapons",
    "Potions",
    "Scrolls",
    "Wands",
    "Magic Misc"
  ];

  // Handle the Add Magic Item button click
  html.find(".add-magic-item").click(() => {
    builder.data.magicItems.push({
      type: null, // Initially no type is selected
      embeddedContent: "" // Placeholder for dynamically embedded content
    });
    console.log("Magic Item placeholder added:", builder.data.magicItems);
    builder.render(false);
  });

  // Update selected item type and dynamically render content
  html.on("change", ".magic-item-type-select", async function () {
    const index = $(this).data("index");
    const selectedType = $(this).val();
    builder.data.magicItems[index].type = selectedType;

    console.log(`Magic Item ${index} updated to type:`, selectedType);

    const targetContainer = html.find(`.magic-item-generator-content[data-index="${index}"]`);

    if (!targetContainer.length) {
      console.error(`Target container not found for Magic Item ${index}.`);
      return;
    }

    // Handle specific types
    switch (selectedType) {
      case "Magic Armor":
        if (!armorGenerator) {
          const { MagicArmorGenerator } = await import('./itemGeneration/wbMagicArmorGen.js');
          armorGenerator = new MagicArmorGenerator();
          await armorGenerator.loadItems();
        }

        console.log(`Rendering Armor Dialog for Magic Item ${index}...`);
        armorGenerator.renderArmorDialog(html, index);
        builder.data.magicItems[index].embeddedContent = "Magic Armor Generator Loaded";
        break;

      case "Magic Weapons":
        if (!weaponGenerator) {
          const { MagicWeaponGenerator } = await import('./itemGeneration/wbMagicWeaponGen.js');
          weaponGenerator = new MagicWeaponGenerator();
          await weaponGenerator.loadItems();
        }

        console.log(`Rendering Weapon Dialog for Magic Item ${index}...`);
        weaponGenerator.renderWeaponDialog(html, index);
        builder.data.magicItems[index].embeddedContent = "Magic Weapon Generator Loaded";
        break;

      case "Scrolls":
        if (!scrollGenerator) {
          const { MagicScrollGenerator } = await import('./itemGeneration/wbMagicScrollGen.js');
          scrollGenerator = new MagicScrollGenerator();
          await scrollGenerator.loadSpells();
        }

        console.log(`Rendering Scroll Dialog for Magic Item ${index}...`);
        scrollGenerator.renderScrollDialog(html, index);
        builder.data.magicItems[index].embeddedContent = "Magic Scroll Generator Loaded";
        break;

      case "Potions":
        if (!potionGenerator) {
          const { MagicPotionGenerator } = await import('./itemGeneration/wbMagicPotionGen.js');
          potionGenerator = new MagicPotionGenerator();
          await potionGenerator.loadSpells();
        }

        console.log(`Rendering Potion Dialog for Magic Item ${index}...`);
        potionGenerator.renderPotionDialog(html, index);
        builder.data.magicItems[index].embeddedContent = "Magic Potion Generator Loaded";
        break;

      case "Wands":
        if (!wandGenerator) {
          const { MagicWandGenerator } = await import('./itemGeneration/wbMagicWandGen.js');
          wandGenerator = new MagicWandGenerator();
          await wandGenerator.loadSpells();
        }

        console.log(`Rendering Wand Dialog for Magic Item ${index}...`);
        wandGenerator.renderWandDialog(html, index);
        builder.data.magicItems[index].embeddedContent = "Magic Wand Generator Loaded";
        break;

      case "Magic Misc":
        targetContainer.html("<p>Magic Misc generator not yet implemented.</p>");
        builder.data.magicItems[index].embeddedContent = "Magic Misc Generator Placeholder";
        break;

      default:
        targetContainer.html("<p>Invalid selection.</p>");
        builder.data.magicItems[index].embeddedContent = "Invalid Selection";
        break;
    }

    console.log(`Embedded content updated for Magic Item ${index}.`);
  });
}
