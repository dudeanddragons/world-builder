export class WorldBuilderWindow extends Application {
  constructor(options = {}) {
    super(options);
  
    this.data = {
      populationDensity: "Wilderness",
      populationDensityOptions: [],
      climateType: "Temperate",
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

  // Fetch Population Density Options
  async loadPopulationDensity() {
    try {
      const response = await fetch("modules/world-builder/assets/terrain/terrainDensity.json");
      if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
      const data = await response.json();
      console.log("Population Density Data Loaded:", data.entries);
      this.data.populationDensityOptions = data.entries.map((entry) => entry.value); // Extract "value"
    } catch (error) {
      console.error("Error loading terrainDensity.json:", error);
    }
  }

  // Fetch Climate Type Options
  async loadClimateType() {
    try {
      const response = await fetch("modules/world-builder/assets/terrain/terrainClimate.json");
      if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
      const data = await response.json();
      console.log("Climate Type Data Loaded:", data.entries);
      this.data.climateTypeOptions = data.entries.map((entry) => entry.value); // Extract "value"
    } catch (error) {
      console.error("Error loading terrainClimate.json:", error);
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
        this.data.terrainTypeOptions = []; // Clear options if no data is found
        return;
      }
  
      // Fetch terrain data for the selected climate
      const terrainResponse = await fetch(`modules/world-builder/${climateEntry.terrainFile}`);
      if (!terrainResponse.ok) throw new Error(`Failed to load terrain file: ${terrainResponse.statusText}`);
      const terrainData = await terrainResponse.json();
  
      // Extract terrain options for the dropdown
      this.data.terrainTypeOptions = terrainData.entries.map(entry => ({
        id: entry.id,
        type: entry.type,
        ruggedness: entry.ruggedness,
        time: entry.time,
        encounters: entry.encounters,
      }));
      console.log("Filtered Terrain Options by Climate:", this.data.terrainTypeOptions);
    } catch (error) {
      console.error("Error loading terrain types:", error);
      this.data.terrainTypeOptions = []; // Ensure options are cleared
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
        this.data.featureTypeOptions = []; // Clear options if no data
        return;
      }
  
      // Fetch feature data for the selected density
      const response = await fetch(`modules/world-builder/${featureFile}`);
      if (!response.ok) throw new Error(`Failed to load feature file: ${response.statusText}`);
      const featureData = await response.json();
  
      // Populate feature options
      this.data.featureTypeOptions = featureData.entries.map(entry => entry.value);
      console.log("Feature Type Options Loaded:", this.data.featureTypeOptions);
    } catch (error) {
      console.error("Error loading feature types:", error);
      this.data.featureTypeOptions = []; // Ensure options are cleared
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
        this.data.subFeatureTypeOptions = []; // Clear options if no data
        return;
      }
  
      // Fetch sub-feature data for the selected feature
      const response = await fetch(`modules/world-builder/${subFeatureFile}`);
      if (!response.ok) throw new Error(`Failed to load sub-feature file: ${response.statusText}`);
      const subFeatureData = await response.json();
  
      // Populate sub-feature options
      this.data.subFeatureTypeOptions = subFeatureData.entries.map(entry => entry.value);
      console.log("Sub-Feature Type Options Loaded:", this.data.subFeatureTypeOptions);
    } catch (error) {
      console.error("Error loading sub-feature types:", error);
      this.data.subFeatureTypeOptions = []; // Ensure options are cleared
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
  
      const filePath = fileMap[selectedSubFeature];

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
  
      html.find(".population-density-select").change(this._onPopulationDensityChange.bind(this));
      html.find(".climate-select").change(this._onClimateTypeChange.bind(this));
      html.find(".terrain-select").change(this._onTerrainTypeChange.bind(this));
      html.find(".feature-type-select").change(this._onFeatureTypeChange.bind(this));
      html.find(".sub-feature-type-select").change(this._onSubFeatureTypeChange.bind(this));
  
      html.find(".terrain-roll").click(() => this._rollTerrainType());
      html.find(".feature-type-roll").click(() => this._rollFeatureType());
      html.find(".encounter-roll").click(() => this._rollEncounter());
      html.find(".save-entry").click(this._onSave.bind(this));
      html.find(".create-journal").click(() => this.createJournalEntry());
    }
  
    async _onPopulationDensityChange(event) {
      this.data.populationDensity = event.target.value;
      console.log("Population Density changed to:", this.data.populationDensity);
    
      // Reload feature options based on the new population density
      await this.loadFeatureType();
    
      // Reset sub-feature options for now
      await this.loadSubFeatureType();
    
      this.render(false); // Re-render to update the UI
    }
    
    
  
    async _onClimateTypeChange(event) {
      this.data.climateType = event.target.value;
      console.log("Climate Type changed to:", this.data.climateType);
    
      // Reload terrain options based on the new climate
      await this.loadTerrainType();
      this.render(false); // Re-render to update the UI
    }
    
  
    async _onTerrainTypeChange(event) {
      const selectedTerrain = event.target.value;
      const terrainData = this.data.terrainTypeOptions.find(option => option.type === selectedTerrain);
    
      if (terrainData) {
        this.data.terrainType = terrainData.type;
        this.data.ruggedness = terrainData.ruggedness;
        this.data.travelTime = terrainData.time;
        this.data.encounterFrequency = terrainData.encounters.join(", "); // Combine for display
      }
    
      console.log("Selected Terrain Data:", terrainData);
      this.render(false); // Re-render to update UI
    }
    
  
    async _onFeatureTypeChange(event) {
      this.data.featureType = event.target.value;
      console.log("Feature Type changed to:", this.data.featureType);
    
      // Reload sub-feature options based on the new feature type
      await this.loadSubFeatureType();
      this.render(false); // Re-render to update the UI
    }
    

    async _onSubFeatureTypeChange(event) {
      this.data.subFeatureType = event.target.value;
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
  