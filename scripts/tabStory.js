export function handleStoryTab(builder, html) {
    html.find(".add-story").click(() => {
      builder.data.story.push({
        description: "",
      });
      console.log("Story added:", builder.data.story);
      builder.render(false);
    });
  }
  