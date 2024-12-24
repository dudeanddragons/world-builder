export function handleTownTab(builder, html) {
    html.find(".add-town").click(() => {
      builder.data.towns.push({
        description: "",
        notes: "",
      });
      console.log("Town added:", builder.data.towns);
      builder.render(false);
    });
  
    html.find(".randomize-town-feature").click(() => {
      console.log("Randomizing town feature...");
    });
  }
  