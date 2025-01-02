export function handleDynamicLocationTab(builder, html) {
  // Initialize default location if not already set
  if (!builder.data.location) {
      builder.data.location = {
          type: "Settlement", // Default type
          // Settlement-Specific Fields
          wbTownComSize: "",
          wbTownOverview: "",
          wbTownPopulation: "",
          wbTownMap: "",
          wbTownDescription: "",
          wbTownNPC: "",
          wbTownProfile: "",
          wbTownStory: "",
          wbTownPoi: "",
          wbTownVal: "",
          wbTownIntRelation: "",
          wbTownOutRelation: "",
          wbTownBackground: "",
          wbTownAdditional: "",
          // Plane-Specific Fields
          wbPlaneRegion: "",
          wbPlaneOverview: "",
          wbPlaneDescription: "",
          wbPlaneNPC: "",
          wbPlaneProfile: "",
          wbPlaneStory: "",
          wbPlanePoi: "",
          wbPlaneResources: "",
          wbPlaneRelationship: "",
          wbPlaneBackground: "",
          wbPlaneAddDetails: "",
      };
  }

  // Handle dynamic location type selection
  html.on("change", ".location-type-select", (event) => {
      const selectedType = event.target.value;

      // Update the type in builder data
      builder.data.location.type = selectedType;

      // Reset fields for the selected type
      if (selectedType === "Settlement") {
          Object.assign(builder.data.location, {
              wbTownComSize: "",
              wbTownOverview: "",
              wbTownPopulation: "",
              wbTownMap: "",
              wbTownDescription: "",
              wbTownNPC: "",
              wbTownProfile: "",
              wbTownStory: "",
              wbTownPoi: "",
              wbTownVal: "",
              wbTownIntRelation: "",
              wbTownOutRelation: "",
              wbTownBackground: "",
              wbTownAdditional: "",
          });
      } else if (selectedType === "Plane") {
          Object.assign(builder.data.location, {
              wbPlaneRegion: "",
              wbPlaneOverview: "",
              wbPlaneDescription: "",
              wbPlaneNPC: "",
              wbPlaneProfile: "",
              wbPlaneStory: "",
              wbPlanePoi: "",
              wbPlaneResources: "",
              wbPlaneRelationship: "",
              wbPlaneBackground: "",
              wbPlaneAddDetails: "",
          });
      }

      // Re-render the form dynamically
      builder.render(false);
  });
}
