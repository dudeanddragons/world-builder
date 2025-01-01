export function handleLairsTab(builder, html) {
  builder.data.featureOptions = builder.data.lairFeatures || []; // Ensure featureOptions is always available

  html.find(".add-room").click(() => {
    // Add a new room with default values
    builder.data.lairRooms.push({
      lairRoomDescription: "",
      lairRoomNotes: "",
      features: ["Room"],
      encounters: [],
      traps: [],
      treasure: [],
      lairRoomSecrets: "",
      collapsed: false, // Default collapsed state
    });

    console.log("Room added:", builder.data.lairRooms);

    builder.render(false); // Re-render and rebind
  });

  // Dropdown change listener
  html.on("change", ".features-select", (event) => {
    const index = $(event.currentTarget).data("index"); // Use data-index for precise identification
    const selectedFeature = $(event.currentTarget).val();
    if (index !== undefined) {
      builder.data.lairRooms[index].features = [selectedFeature];
      console.log(`Updated Room ${index} features:`, builder.data.lairRooms[index].features);
    }
  });
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
