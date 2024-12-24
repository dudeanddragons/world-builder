export function handleTrapsTab(builder, html) {
    html.find(".add-trap").click(() => {
      builder.data.traps.push({
        description: "",
      });
      console.log("Trap added:", builder.data.traps);
      builder.render(false);
    });
  
    html.find(".randomize-trap").click(() => {
      console.log("Randomizing trap...");
    });
  
    html.find(".trap-builder").click(() => {
      console.log("Opening Trap Builder...");
    });
  }
  