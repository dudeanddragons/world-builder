export function handleActorsTab(builder, html) {
    html.find(".add-actor").click(() => {
      builder.data.actors.push({
        description: "",
      });
      console.log("Actor added:", builder.data.actors);
      builder.render(false);
    });
  
    html.find(".randomize-actor").click(() => {
      console.log("Randomizing actor...");
    });
  
    html.find(".actor-builder").click(() => {
      console.log("Opening Actor Builder...");
    });
  }
  