export class WorldBuilderWindow extends Application {
  static terrainCaveMap = {
    "Desert": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeDesert.json",
    "Forest": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeForest.json",
    "Hills": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeHills.json",
    "Marsh": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeMarsh.json",
    "Mountains": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeMountains.json",
    "Plains": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypePlains.json",
    "Water": "assets/terrain/terrainFeatures/lairs/lairsSub/lairsCaveTypes/caveSubTypeWater.json",
  };
  constructor(options = {}) {
    super(options);
  
    this.data = {
      populationDensity: "",
      populationDensityOptions: [],
      climateType: "",
      climateTypeOptions: [],
      terrainType: "",
      terrainTypeOptions: [],
      ruggedness: "",
      travelTime: "",
      encounterFrequency: "",
      featureType: "",
      featureTypeOptions: [],
      selectedFeatureType: "",
      subFeatureType: "",
      subFeatureTypeOptions: [],
      featureDetails: {
        title: "",
        description: "",
        results: []
      },
      isDungeon: false,
      isCave: false,
      dungeonFeatures: [],
      caveFeatures: [],
    };
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "World Builder",
      width: 800,
      height: "auto",
      resizable: true,
      template: "modules/world-builder/templates/wb.hbs",
      classes: ["worldbuilder", "sheet", "journal-sheet"],
    });
  }

  resetFormState() {
    this.data = {
      populationDensity: "",
      populationDensityOptions: [],
      climateType: "",
      climateTypeOptions: [],
      terrainType: "",
      terrainTypeOptions: [],
      ruggedness: "",
      travelTime: "",
      encounterFrequency: "",
      featureType: "",
      featureTypeOptions: [],
      subFeatureType: "",
      subFeatureTypeOptions: [],
      featureDetails: {
        title: "",
        description: "",
        results: []
      },
      isDungeon: false,
      isCave: false,
      dungeonFeatures: [],
      caveFeatures: []
    };
    console.log("Form state reset to defaults.");
  }
  
  

  // Fetch Population Density Options
  async loadPopulationDensity() {
    try {
      const response = await fetch("modules/world-builder/assets/terrain/terrainDensity.json");
      if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
      const data = await response.json();
      console.log("Population Density Data Loaded:", data.entries);
  
      this.data.populationDensityOptions = [
        { value: "", label: "Select a population density" }, // Default placeholder
        ...data.entries.map(entry => ({ value: entry.value, label: entry.value }))
      ];
    } catch (error) {
      console.error("Error loading terrainDensity.json:", error);
      this.data.populationDensityOptions = [{ value: "", label: "Select a population density" }]; // Default only
    }
  }

  // Fetch Climate Type Options
  async loadClimateType() {
    try {
      const response = await fetch("modules/world-builder/assets/terrain/terrainClimate.json");
      if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
      const data = await response.json();
      console.log("Climate Type Data Loaded:", data.entries);
  
      this.data.climateTypeOptions = [
        { value: "", label: "Select a climate type" }, // Default placeholder
        ...data.entries.map(entry => ({ value: entry.value, label: entry.value }))
      ];
    } catch (error) {
      console.error("Error loading terrainClimate.json:", error);
      this.data.climateTypeOptions = [{ value: "", label: "Select a climate type" }]; // Default only
    }
  }

  // Fetch Terrain Type Options Based on Selected Climate
  async loadTerrainType() {
    try {
      const indexPath = "modules/world-builder/index.json"; // Path to index file
      const response = await fetch(indexPath);
      if (!response.ok) throw new Error(`Failed to load index.json: ${response.statusText}`);
      const indexData = await response.json();
  
      // Find the terrain file based on the selected climate
      const selectedClimate = this.data.climateType;
      const climateEntry = indexData.climates.tblTerrainClimate.entries.find(
        entry => entry.value === selectedClimate
      );
  
      if (!climateEntry || !climateEntry.terrainFile) {
        console.warn("No terrain file found for selected climate:", selectedClimate);
        this.data.terrainTypeOptions = [{ value: "", label: "Select a terrain type" }]; // Default only
        return;
      }
  
      // Fetch terrain data for the selected climate
      const terrainResponse = await fetch(`modules/world-builder/${climateEntry.terrainFile}`);
      if (!terrainResponse.ok) throw new Error(`Failed to load terrain file: ${terrainResponse.statusText}`);
      const terrainData = await terrainResponse.json();
  
      // Extract terrain options for the dropdown
      this.data.terrainTypeOptions = [
        { value: "", label: "Select a terrain type" }, // Default placeholder
        ...terrainData.entries.map(entry => ({
          value: entry.type,
          label: `${entry.type} (Ruggedness: ${entry.ruggedness}, Travel Time: ${entry.time})`,
          id: entry.id,
          ruggedness: entry.ruggedness,
          time: entry.time,
          encounters: entry.encounters,
        }))
      ];
      console.log("Filtered Terrain Options by Climate:", this.data.terrainTypeOptions);
    } catch (error) {
      console.error("Error loading terrain types:", error);
      this.data.terrainTypeOptions = [{ value: "", label: "Select a terrain type" }]; // Ensure a default placeholder
    }
  }
  

  async loadFeatureType() {
    try {
      const densityMap = {
        "Borderlands": "assets/terrain/terrainFeaturesBorderlands.json",
        "Settled": "assets/terrain/terrainFeaturesSettled.json",
        "Wilderness": "assets/terrain/terrainFeaturesWilderness.json"
      };
  
      const selectedDensity = this.data.populationDensity;
      const featureFile = densityMap[selectedDensity];
  
      if (!featureFile) {
        console.warn("No feature file found for selected density:", selectedDensity);
        this.data.featureTypeOptions = [{ value: "", label: "Select a feature type" }]; // Default only
        return;
      }
  
      // Fetch feature data for the selected density
      const response = await fetch(`modules/world-builder/${featureFile}`);
      if (!response.ok) throw new Error(`Failed to load feature file: ${response.statusText}`);
      const featureData = await response.json();
  
      // Populate feature options with a default placeholder
      this.data.featureTypeOptions = [
        { value: "", label: "Select a feature type" }, // Default placeholder
        ...featureData.entries.map(entry => ({ value: entry.value, label: entry.value }))
      ];
      console.log("Feature Type Options Loaded:", this.data.featureTypeOptions);
    } catch (error) {
      console.error("Error loading feature types:", error);
      this.data.featureTypeOptions = [{ value: "", label: "Select a feature type" }]; // Ensure a default placeholder
    }
  }
  

  async loadSubFeatureType() {
    try {
      // Map specific feature types to sub-feature files
      const subFeatureMap = {
        "Ruins and Relics": "assets/terrain/terrainFeatures/terrainFeaturesRuinClass.json",
        "Lurid Lairs": "assets/terrain/terrainFeatures/terrainFeaturesLuridLairs.json",
        "Rivers and Roads/Islands": "assets/terrain/terrainFeatures/terrainFeaturesRoadRiver.json"
      };
  
      const selectedFeature = this.data.featureType;
      const subFeatureFile = subFeatureMap[selectedFeature];
  
      if (!subFeatureFile) {
        console.warn("No sub-feature file found for selected feature:", selectedFeature);
        this.data.subFeatureTypeOptions = [{ value: "", label: "Select a sub-feature" }]; // Default only
        return;
      }
  
      // Fetch sub-feature data for the selected feature
      const response = await fetch(`modules/world-builder/${subFeatureFile}`);
      if (!response.ok) throw new Error(`Failed to load sub-feature file: ${response.statusText}`);
      const subFeatureData = await response.json();
  
      // Populate sub-feature options with a default placeholder
      this.data.subFeatureTypeOptions = [
        { value: "", label: "Select a sub-feature" }, // Default placeholder
        ...subFeatureData.entries.map(entry => ({ value: entry.value, label: entry.value }))
      ];
      console.log("Sub-Feature Type Options Loaded:", this.data.subFeatureTypeOptions);
    } catch (error) {
      console.error("Error loading sub-feature types:", error);
      this.data.subFeatureTypeOptions = [{ value: "", label: "Select a sub-feature" }]; // Ensure a default placeholder
    }
  }
  
  
  // Populate Feature Details
  async loadFeatureDetails() {
    try {
      const selectedSubFeature = this.data.subFeatureType;
  
      if (!selectedSubFeature) {
        console.warn("No sub-feature selected.");
        this.data.featureDetails = { title: "", results: [] }; // Clear details
        return;
      }
  
      // Map sub-features to their respective JSON files
      const fileMap = {
        "Remnants": "assets/terrain/terrainFeatures/ruins/remnants.json",
        "Ruins": "assets/terrain/terrainFeatures/ruins/ruins.json",
        "Skeletons": "assets/terrain/terrainFeatures/ruins/skeletons.json",
        "Vestiges": "assets/terrain/terrainFeatures/ruins/vestiges.json",
        "Wrecks": "assets/terrain/terrainFeatures/ruins/wrecks.json",
        "Antiques": "assets/terrain/terrainFeatures/relics/antiques.json",
        "Artifacts": "assets/terrain/terrainFeatures/relics/artifacts.json",
        "Refuse": "assets/terrain/terrainFeatures/relics/refuse.json",
        "Relics": "assets/terrain/terrainFeatures/relics/relics.json",
        "Remains": "assets/terrain/terrainFeatures/relics/remains.json",
        "Burrows": "assets/terrain/terrainFeatures/lairs/burrows.json",
        "Camp": "assets/terrain/terrainFeatures/lairs/camps.json",
        "Crevice": "assets/terrain/terrainFeatures/lairs/crevice.json",
        "Dungeon": "assets/terrain/terrainFeatures/lairs/dungeons.json",
        "Dwelling": "assets/terrain/terrainFeatures/lairs/dwelling.json",
        "Ledge": "assets/terrain/terrainFeatures/lairs/ledge.json",
        "Shipwreck": "assets/terrain/terrainFeatures/lairs/shipwreckEncounters.json",
        "Lair Occupation Status": "assets/terrain/terrainFeatures/lairs/lairSubOccupationStatus.json"
      };

    // Determine the file path for cave types or standard sub-features
    const caveFilePath = WorldBuilderWindow.terrainCaveMap[this.data.terrainType];
    const filePath = selectedSubFeature === "Cave" && caveFilePath
      ? caveFilePath
      : fileMap[selectedSubFeature];

    if (!filePath) {
      console.warn("No file found for selected sub-feature:", selectedSubFeature);
      this.data.featureDetails = { title: selectedSubFeature, results: [] };
      return;
    }

    // Fetch the sub-feature details from the JSON file
    const response = await fetch(`modules/world-builder/${filePath}`);
    if (!response.ok) throw new Error(`Failed to load sub-feature file: ${response.statusText}`);
    const data = await response.json();

    // Select a random entry from the entries array
    const randomEntry = data.entries[Math.floor(Math.random() * data.entries.length)];

    // Handle different structures (name, dimensions, quantity, description)
    const detailFields = [];
    if (randomEntry.name) detailFields.push(`Name: ${randomEntry.name}`);
    if (randomEntry.dimensions) detailFields.push(`Dimensions: ${randomEntry.dimensions}`);
    if (randomEntry.quantity) detailFields.push(`Quantity: ${randomEntry.quantity}`);
    if (randomEntry.description) detailFields.push(`Description: ${randomEntry.description}`);
    if (randomEntry.value) detailFields.push(randomEntry.value); // For simpler entries

    // Update the feature details
    this.data.featureDetails = {
      title: selectedSubFeature,
      results: detailFields // Display all relevant fields for the selected entry
    };

    console.log("Feature Details Loaded:", this.data.featureDetails);
  } catch (error) {
    console.error("Error loading feature details:", error);
    this.data.featureDetails = { title: "", results: [] }; // Clear on error
  }
}
    

  // Provide data to the template
  async getData() {
    if (!this.data.populationDensityOptions.length) await this.loadPopulationDensity();
    if (!this.data.climateTypeOptions.length) await this.loadClimateType();
    if (!this.data.terrainTypeOptions.length) await this.loadTerrainType();
    if (!this.data.featureTypeOptions.length) await this.loadFeatureType();
    if (!this.data.subFeatureTypeOptions.length) await this.loadSubFeatureType();
  
    return { ...this.data };
  }
  
  
    activateListeners(html) {
      super.activateListeners(html);
  
        //Drop Down Listeners
      html.find(".population-density-select").change(this._onPopulationDensityChange.bind(this));
      html.find(".climate-select").change(this._onClimateTypeChange.bind(this));
      html.find(".terrain-select").change(this._onTerrainTypeChange.bind(this));
      html.find(".feature-type-select").change(this._onFeatureTypeChange.bind(this));
      html.find(".sub-feature-type-select").change(this._onSubFeatureTypeChange.bind(this));
  
        // Button Listeners
      html.find(".terrain-roll").click(() => this._rollTerrainType());
      html.find(".feature-type-roll").click(() => this._rollFeatureType());
      html.find(".encounter-roll").click(() => this._rollEncounter());
      html.find(".save-entry").click(this._onSave.bind(this));
      html.find(".create-journal").click(() => this.createJournalEntry());
    }
  
    async _onPopulationDensityChange(event) {
      const selectedValue = event.target.value;
      if (!selectedValue) return;
    
      this.data.populationDensity = selectedValue;
      console.log("Population Density changed to:", selectedValue);
    
      await this.loadFeatureType();
      await this.loadSubFeatureType();
      this.render(false);
    }
    
    
  
    async _onClimateTypeChange(event) {
      const selectedValue = event.target.value;
      if (!selectedValue) return;
    
      this.data.climateType = selectedValue;
      console.log("Climate Type changed to:", selectedValue);
    
      await this.loadTerrainType();
      this.render(false);
    }
  
    async _onTerrainTypeChange(event) {
      const selectedTerrain = event.target.value;
    
      // Ignore if the default placeholder is selected
      if (!selectedTerrain) {
        console.warn("No valid terrain selected.");
        this.data.terrainType = "";
        this.data.ruggedness = "";
        this.data.travelTime = "";
        this.data.encounterFrequency = "";
        this.data.subFeatureTypeOptions = [];
        this.render(false); // Clear UI and re-render
        return;
      }
    
      // Find the selected terrain's data
      const terrainData = this.data.terrainTypeOptions.find(option => option.value === selectedTerrain);
    
      if (!terrainData) {
        console.error("Terrain data not found for selected value:", selectedTerrain);
        return;
      }
    
      // Update the main fields
      this.data.terrainType = terrainData.value;
      this.data.ruggedness = terrainData.ruggedness;
      this.data.travelTime = terrainData.time;
      this.data.encounterFrequency = terrainData.encounters.join(", ");
      console.log("Selected Terrain Data:", terrainData);
    
      // Handle cave sub-feature loading
      const caveFilePath = WorldBuilderWindow.terrainCaveMap[this.data.terrainType];
      if (caveFilePath) {
        try {
          const response = await fetch(`modules/world-builder/${caveFilePath}`);
          if (!response.ok) throw new Error(`Failed to load cave file: ${response.statusText}`);
          const data = await response.json();
          this.data.subFeatureTypeOptions = [
            { value: "", label: "Select a sub-feature" }, // Default placeholder
            ...data.entries.map(entry => ({ value: entry.value, label: entry.value }))
          ];
          console.log("Cave Sub-Feature Options Loaded:", this.data.subFeatureTypeOptions);
        } catch (error) {
          console.error("Error loading cave sub-features:", error);
          this.data.subFeatureTypeOptions = [{ value: "", label: "Select a sub-feature" }]; // Default only
        }
      } else {
        console.warn("No cave sub-features available for the selected terrain.");
        this.data.subFeatureTypeOptions = [{ value: "", label: "Select a sub-feature" }]; // Default only
      }
    
      this.render(false); // Re-render to update the UI
    }
    
    
    
    
    
  
    async _onFeatureTypeChange(event) {
      const selectedFeatureType = event.target.value;
    
      // Ignore if the default placeholder is selected
      if (!selectedFeatureType) {
        console.warn("No valid feature type selected.");
        this.data.featureType = "";
        this.data.subFeatureTypeOptions = [{ value: "", label: "Select a sub-feature" }]; // Reset to default
        this.render(false); // Clear UI and re-render
        return;
      }
    
      // Update the selected feature type
      this.data.featureType = selectedFeatureType;
      console.log("Feature Type changed to:", this.data.featureType);
    
      // Reload sub-feature options based on the new feature type
      await this.loadSubFeatureType();
      this.render(false); // Re-render to update the UI
    }
    
    

    async _onSubFeatureTypeChange(event) {
      const selectedSubFeatureType = event.target.value;
    
      // Ignore if the default placeholder is selected
      if (!selectedSubFeatureType) {
        console.warn("No valid sub-feature type selected.");
        this.data.subFeatureType = "";
        this.data.featureDetails = { title: "", results: [] }; // Reset feature details
        this.render(false); // Clear UI and re-render
        return;
      }
    
      // Update the selected sub-feature type
      this.data.subFeatureType = selectedSubFeatureType;
      console.log("Sub-Feature Type changed to:", this.data.subFeatureType);
    
      // Load feature details based on the selected sub-feature
      await this.loadFeatureDetails();
      this.render(false); // Re-render to update the UI
    }
    
    

    async _rollTerrainType() {
      // Add rolling logic for terrain type
      console.log("Rolling for Terrain Type...");
    }
  
    async _rollFeatureType() {
      // Add rolling logic for feature type
      console.log("Rolling for Feature Type...");
    }
  
    async _rollEncounter() {
      // Add rolling logic for encounters
      console.log("Rolling for Encounter...");
    }
  
    async _onSave(event) {
      event.preventDefault();
      console.log("Saving World Builder Data:", this.data);
    }
  
    async createJournalEntry() {
      console.log("Creating Journal Entry...");
      // Add journal creation logic
    }
  }
  