let armorGenerator; // Declare globally within this file, but do not initialize.

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

    // Handle specific types
    switch (selectedType) {
      case "Magic Armor":
        if (!armorGenerator) {
          const { MagicArmorGenerator } = await import('./itemGeneration/wbMagicArmorGen.js');
          armorGenerator = new MagicArmorGenerator();
          await armorGenerator.loadItems();
        }
      
        const dropdown = $(this); // The dropdown that triggered the change event
        const index = dropdown.data("index"); // Fetch the data-index attribute
      
        if (typeof index === "undefined") {
          console.error("Magic item index is undefined. Ensure the dropdown has a valid data-index attribute.");
          return;
        }
      
        console.log(`Rendering Armor Dialog for Magic Item ${index}...`);
        armorGenerator.renderArmorDialog(html, index);
        builder.data.magicItems[index].embeddedContent = "Magic Armor Generator Loaded";
        break;
      
      

      case "Magic Weapons":
        targetContainer.html("<p>Magic Weapons generator not yet implemented.</p>");
        builder.data.magicItems[index].embeddedContent = "Magic Weapons Generator Placeholder";
        break;

      case "Potions":
        targetContainer.html("<p>Potions generator not yet implemented.</p>");
        builder.data.magicItems[index].embeddedContent = "Potions Generator Placeholder";
        break;

      case "Scrolls":
        targetContainer.html("<p>Scrolls generator not yet implemented.</p>");
        builder.data.magicItems[index].embeddedContent = "Scrolls Generator Placeholder";
        break;

      case "Wands":
        targetContainer.html("<p>Wands generator not yet implemented.</p>");
        builder.data.magicItems[index].embeddedContent = "Wands Generator Placeholder";
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
