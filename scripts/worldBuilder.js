export class WorldBuilderWindow extends Application {
  constructor(options = {}) {
    super(options);
  
    // Default data for the World Builder
    this.data = {
      populationDensity: "Wilderness",
      populationDensityOptions: [], // Options for Population Density
      climateType: "Temperate",
      climateTypeOptions: [], // Options for Climate Type
      terrainType: "",
      terrainTypeOptions: [], // Options for Terrain Type
      ruggedness: "",
      travelTime: "",
      encounterFrequency: "",
      featureType: "",
      selectedFeatureType: "",
      selectedSubFeature: "",
      featureDetails: "",
      encounterResult: "",
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
  
  


  // Provide data to the template
  async getData() {
    if (!this.data.populationDensityOptions.length) await this.loadPopulationDensity();
    if (!this.data.climateTypeOptions.length) await this.loadClimateType();
    if (!this.data.terrainTypeOptions.length) await this.loadTerrainType();
  
    return { ...this.data };
  }
  
  
    activateListeners(html) {
      super.activateListeners(html);
  
      html.find(".population-density-select").change(this._onPopulationDensityChange.bind(this));
      html.find(".climate-select").change(this._onClimateTypeChange.bind(this));
      html.find(".terrain-select").change(this._onTerrainTypeChange.bind(this));
      html.find(".feature-type-select").change(this._onFeatureTypeChange.bind(this));
      html.find(".sub-feature-select").change(this._onSubFeatureChange.bind(this));
  
      html.find(".terrain-roll").click(() => this._rollTerrainType());
      html.find(".feature-type-roll").click(() => this._rollFeatureType());
      html.find(".encounter-roll").click(() => this._rollEncounter());
      html.find(".save-entry").click(this._onSave.bind(this));
      html.find(".create-journal").click(() => this.createJournalEntry());
    }
  
    _onPopulationDensityChange(event) {
      this.data.populationDensity = event.target.value;
      this.render(false);
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
    
  
    _onFeatureTypeChange(event) {
      this.data.selectedFeatureType = event.target.value;
      this.render(false);
    }
  
    _onSubFeatureChange(event) {
      this.data.selectedSubFeature = event.target.value;
      this.render(false);
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
  