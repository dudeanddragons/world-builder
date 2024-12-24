export function handleMagicItemsTab(builder, html) {
    html.find(".add-magic-item").click(() => {
      builder.data.magicItems.push({
        description: "",
      });
      console.log("Magic Item added:", builder.data.magicItems);
      builder.render(false);
    });
  
    html.find(".randomize-magic-item").click(() => {
      console.log("Randomizing magic item...");
    });
  
    html.find(".magic-item-builder").click(() => {
      console.log("Opening Magic Item Builder...");
    });
  }
  