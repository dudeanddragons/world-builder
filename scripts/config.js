import { WorldBuilderWindow } from './worldBuilder.js'; // Ensure this path is correct!

// Register the WorldBuilderWindow class
Hooks.once("init", () => {
  console.log("World Builder | Initializing...");
  CONFIG.WorldBuilder = WorldBuilderWindow; // Makes the class globally available.
});

// Add the button to the Journal sidebar
Hooks.on("renderJournalDirectory", (app, html) => {
  console.log("Adding World Builder button.");
  const button = $(`<button class="worldbuilder-generator"><i class="fas fa-globe"></i> World Builder</button>`);
  html.find(".directory-header").prepend(button);

  // Button click event to open the World Builder window
  button.on("click", () => {
    console.log("World Builder button clicked.");
    if (!window.worldBuilder) {
      window.worldBuilder = new CONFIG.WorldBuilder(); // Use the registered class
    }
    window.worldBuilder.render(true);
  });
});
