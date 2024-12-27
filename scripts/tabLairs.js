export function handleLairsTab(builder, html) {
  builder.data.featureOptions = builder.data.lairFeatures || []; // Ensure featureOptions is always available

  html.find(".add-room").click(() => {
    builder.data.lairRooms.push({
      description: "",
      notes: "",
      features: ["Room"], // Default to "Room"
      encounters: [],
      traps: [],
      treasure: [],
      secrets: [],
    });

    console.log("Room added:", builder.data.lairRooms);

    // Re-render and re-bind dropdown options
    builder.render(false);
  });

  // Listener for dropdown selection
  html.on("change", ".features-select", (event) => {
    const roomIndex = $(event.currentTarget).closest(".room-entry").index(); // Get the room's index
    const selectedFeature = $(event.currentTarget).val(); // Get the selected feature

    // Update the corresponding room's features
    builder.data.lairRooms[roomIndex].features = [selectedFeature];
    console.log(`Feature updated for Room ${roomIndex}:`, builder.data.lairRooms[roomIndex].features);
  });

  console.log("Feature Options in Lairs Tab:", builder.data.featureOptions);
}




// Helper function to fetch lair features
export async function loadLairFeatures() {
  const path = "modules/world-builder/assets/terrain/terrainFeatures/lairs/lairsSub/dungeonSubExtendedPassageWays.json";
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to fetch features: ${response.statusText}`);
    const data = await response.json();
    console.log("Loaded Lair Features:", data.entries.map(entry => entry.description)); // Debug log
    return data.entries.map(entry => entry.description);
  } catch (error) {
    console.error("Error loading lair features:", error);
    return [];
  }
}



