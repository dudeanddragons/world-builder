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
          // Celestial-Specific Fields
          wbCelestialRegion: "",
          wbCelestialOverview: "",
          wbCelestialMap: null,
          wbCelestialDescription: "",
          wbCelestialNPC: "",
          wbCelestialProfile: "",
          wbCelestialStory: "",
          wbCelestialPoi: "",
          wbCelestialResources: "",
          wbCelestialRelationships: "",
          wbCelestialBackground: "",
          wbCelestialAdditional: "",
          // Planet-Specific Fields
          wbPlanetGravity: "",
          wbPlanetAtmosphere: "",
          wbPlanetOrbit: "",
          wbPlanetOverview: "",
          wbPlanetType: "",
          wbPlanetClimate: "",
          wbPlanetTerrainType: "",
          wbPlentDescription: "",
          wbPlanetNPC: "",
          wbPlanetProfile: "",
          wbPlanetStory: "",
          wbPlanetPoi: "",
          wbPlanetValuables: "",
          wbPlanetChallenges: "",
          wbPlanetObstacles: "",
          wbPlanetIntRelation: "",
          wbPlanetOutRelation: "",
          wbPlanetAdditional: "",
        // Geographical Specific Fields
          wbGeoRegion: "",
          wbGeoOverview: "",
          wbGeoTerrain: "",
          wbGeoClimate: "",
          wbGeoMap: null,
          wbGeoDescription: "",
          wbGeoNPC: "",
          wbGeoProfile: "",
          wbGeoStory: "",
          wbGeoPoi: "",
          wbGeoResources: "",
          wbGeoRelation: "",
          wbGeoBackground: "",
          wbGeoAdditional: "",
        // Point of Interest Specific Fields
          wbPoiType: "",
          wbPoiOverview: "",
          wbPoiPicture: null,
          wbPoiDescription: "",
          wbPoiPrices: "",
          wbPoiQuality: "",
          wbPoiGoodsServices: "",
          wbPoiProfile: "",
          wbPoiStory: "",
          wbPoiNPC: "",
          wbPoiValuables: "",
          wbPoiChallenges: "",
          wbPoiObstacles: "",
          wbPoiRelationships: "",
          wbPoiBackground: "",
          wbPoiAdditional: "",
      };
  }

  // Handle dynamic location type selection
  html.on("change", ".location-type-select", (event) => {
      const selectedType = event.target.value;

      // Update the type in builder data
      builder.data.location.type = selectedType;

      // Reset fields for the selected type
      switch (selectedType) {
          case "Settlement":
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
              break;

          case "Plane":
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
              break;

          case "Celestial":
              Object.assign(builder.data.location, {
                  wbCelestialRegion: "",
                  wbCelestialOverview: "",
                  wbCelestialMap: null,
                  wbCelestialDescription: "",
                  wbCelestialNPC: "",
                  wbCelestialProfile: "",
                  wbCelestialStory: "",
                  wbCelestialPoi: "",
                  wbCelestialResources: "",
                  wbCelestialRelationships: "",
                  wbCelestialBackground: "",
                  wbCelestialAdditional: "",
              });
              break;

          case "Planet":
              Object.assign(builder.data.location, {
                  wbPlanetGravity: "",
                  wbPlanetAtmosphere: "",
                  wbPlanetOrbit: "",
                  wbPlanetOverview: "",
                  wbPlanetType: "",
                  wbPlanetClimate: "",
                  wbPlanetTerrainType: "",
                  wbPlentDescription: "",
                  wbPlanetNPC: "",
                  wbPlanetProfile: "",
                  wbPlanetStory: "",
                  wbPlanetPoi: "",
                  wbPlanetValuables: "",
                  wbPlanetChallenges: "",
                  wbPlanetObstacles: "",
                  wbPlanetIntRelation: "",
                  wbPlanetOutRelation: "",
                  wbPlanetAdditional: "",
              });
              break;

              case "Geographical":
                Object.assign(builder.data.location, {
                    wbGeoRegion: "",
                    wbGeoOverview: "",
                    wbGeoTerrain: "",
                    wbGeoClimate: "",
                    wbGeoMap: null,
                    wbGeoDescription: "",
                    wbGeoNPC: "",
                    wbGeoProfile: "",
                    wbGeoStory: "",
                    wbGeoPoi: "",
                    wbGeoResources: "",
                    wbGeoRelation: "",
                    wbGeoBackground: "",
                    wbGeoAdditional: "",
                });
                break;

                case "Point of Interest":
                    Object.assign(builder.data.location, {
                        wbPoiType: "",
                        wbPoiOverview: "",
                        wbPoiPicture: null,
                        wbPoiDescription: "",
                        wbPoiPrices: "",
                        wbPoiQuality: "",
                        wbPoiGoodsServices: "",
                        wbPoiProfile: "",
                        wbPoiStory: "",
                        wbPoiNPC: "",
                        wbPoiValuables: "",
                        wbPoiChallenges: "",
                        wbPoiObstacles: "",
                        wbPoiRelationships: "",
                        wbPoiBackground: "",
                        wbPoiAdditional: "",
                    });
                    break;
      }

      // Re-render the form dynamically
      builder.render(false);
  });
}
