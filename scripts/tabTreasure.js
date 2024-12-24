export function handleTreasureTab(builder, html) {
    html.find(".add-treasure").click(() => {
      builder.data.treasures.push({
        description: "",
      });
      console.log("Treasure added:", builder.data.treasures);
      builder.render(false);
    });
  
    html.find(".randomize-treasure").click(() => {
      console.log("Randomizing treasure...");
    });
  
    html.find(".treasure-builder").click(() => {
      console.log("Opening Treasure Builder...");
    });
  }
  