export function handleStoryTab(builder, html) {
  // Handle the global story title
  html.on("input", ".story-global-title", (event) => {
    builder.data.storyTitle = event.currentTarget.value;
    console.log("Global Story Title Updated:", builder.data.storyTitle);
  });

  // Open the FilePicker for the global story image
  html.find(".select-story-image").click(async () => {
    const picker = new FilePicker({
      type: "image",
      current: builder.data.storyImage || "",
      callback: (path) => {
        builder.data.storyImage = path;
        console.log("Selected Story Image:", path);
        builder.render(false);
      },
    });
    picker.render(true);
  });

  // Add a new story
  html.find(".add-story").click(() => {
    builder.data.story.push({
      title: "",
      description: "",
      additionalText: [], // Initialize the additionalText array for this story
    });
    console.log("Story added:", builder.data.story);
    builder.render(false);
  });

  // Add a new additional text box within a specific story
  html.on("click", ".add-text", (event) => {
    const index = $(event.currentTarget).data("index");
    builder.data.story[index].additionalText.push(""); // Add an empty text entry
    console.log(`Added additional text box to story ${index}:`, builder.data.story[index].additionalText);
    builder.render(false);
  });

  // Handle input for story titles
  html.on("input", ".story-title", (event) => {
    const index = html.find(".story-title").index(event.currentTarget);
    builder.data.story[index].title = event.currentTarget.value;
    console.log(`Updated title for story ${index}:`, builder.data.story[index].title);
  });

  // Handle input for story descriptions
  html.on("input", ".story-description", (event) => {
    const index = html.find(".story-description").index(event.currentTarget);
    builder.data.story[index].description = event.currentTarget.value;
    console.log(`Updated description for story ${index}:`, builder.data.story[index].description);
  });

  // Handle input for additional text boxes
  html.on("input", ".additional-text", (event) => {
    const storyIndex = html.find(".story-entry").index($(event.currentTarget).closest(".story-entry"));
    const textIndex = html.find(".additional-text").index(event.currentTarget) - storyIndex * builder.data.story[storyIndex].additionalText.length;
    builder.data.story[storyIndex].additionalText[textIndex] = event.currentTarget.value;
    console.log(`Updated additional text for story ${storyIndex}, text ${textIndex}:`, builder.data.story[storyIndex].additionalText);
  });
}
