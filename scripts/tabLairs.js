export function handleLairsTab(builder, html) {
    html.find(".add-room").click(() => {
      builder.data.lairRooms.push({
        description: "",
        notes: "",
        features: [],
        encounters: [],
        traps: [],
        treasure: [],
        secrets: [],
      });
      console.log("Room added:", builder.data.lairRooms);
      builder.render(false);
    });
  
    html.find(".randomize-feature").click(() => {
      console.log("Randomizing feature...");
    });
  
    html.find(".encounter-builder").click(() => {
      console.log("Opening Encounter Builder...");
    });
  }
  