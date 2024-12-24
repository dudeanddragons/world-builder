import { handleActorsTab } from './tabActors.js';
import { handleLairsTab } from './tabLairs.js';
import { handleMagicItemsTab } from './tabMagicItems.js';
import { handleTownTab } from './tabTown.js';
import { handleTrapsTab } from './tabTraps.js';
import { handleTreasureTab } from './tabTreasure.js';

export class WorldBuilderWindow extends Application {

  // Map these specifically to handle Cave/Terrain Type Logic
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
      selectedFeatureType: "",
      selectedSubFeature: "",
      featureDetails: "",
      encounterResult: "",
      isDungeon: false,
      isCave: false,
      dungeonFeatures: [],
      caveFeatures: [],
      lairRooms: [],
      towns: [],
      treasures: [],
      magicItems: [],
      traps: [],
      actors: [],
      
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


  /**
   * 
   * Set default state for Form 
   * Renders when the world builder button is clicked
   * 
   */
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
      caveFeatures: [],
      lairRooms: [],
      towns: [],
      treasures: [],
      magicItems: [],
      traps: [],
      actors: [],
    };
    console.log("Form state reset to defaults.");
  }
  
  
  /**
   * 
   * Load data for Form Drop Downs
   *
   */
  async loadPopulationDensity() {
    try {
      const response = await fetch("modules/world-builder/assets/terrain/terrainDensity.json");
      if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
      const data = await response.json();
      console.log("Population Density Data Loaded:", data.entries);
  
      this.data.populationDensityOptions = [
        { value: "", label: "Select a population density" },
        ...data.entries.map(entry => ({ value: entry.value, label: entry.value }))
      ];
    } catch (error) {
      console.error("Error loading terrainDensity.json:", error);
      this.data.populationDensityOptions = [{ value: "", label: "Select a population density" }];
    }
  }

  async loadClimateType() {
    try {
      const response = await fetch("modules/world-builder/assets/terrain/terrainClimate.json");
      if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
      const data = await response.json();
      console.log("Climate Type Data Loaded:", data.entries);
  
      this.data.climateTypeOptions = [
        { value: "", label: "Select a climate type" },
        ...data.entries.map(entry => ({ value: entry.value, label: entry.value }))
      ];
    } catch (error) {
      console.error("Error loading terrainClimate.json:", error);
      this.data.climateTypeOptions = [{ value: "", label: "Select a climate type" }];
    }
  }

  async loadTerrainType() {
    try {
      const indexPath = "modules/world-builder/index.json";
      const response = await fetch(indexPath);
      if (!response.ok) throw new Error(`Failed to load index.json: ${response.statusText}`);
      const indexData = await response.json();
  
      const selectedClimate = this.data.climateType;
      const climateEntry = indexData.climates.tblTerrainClimate.entries.find(
        entry => entry.value === selectedClimate
      );
  
      if (!climateEntry || !climateEntry.terrainFile) {
        console.warn("No terrain file found for selected climate:", selectedClimate);
        this.data.terrainTypeOptions = [{ value: "", label: "Select a terrain type" }];
        return;
      }
  
      const terrainResponse = await fetch(`modules/world-builder/${climateEntry.terrainFile}`);
      if (!terrainResponse.ok) throw new Error(`Failed to load terrain file: ${terrainResponse.statusText}`);
      const terrainData = await terrainResponse.json();
  
      this.data.terrainTypeOptions = [
        { value: "", label: "Select a terrain type" },
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
      this.data.terrainTypeOptions = [{ value: "", label: "Select a terrain type" }];
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
        this.data.featureTypeOptions = [{ value: "", label: "Select a feature type" }];
        return;
      }
  
      const response = await fetch(`modules/world-builder/${featureFile}`);
      if (!response.ok) throw new Error(`Failed to load feature file: ${response.statusText}`);
      const featureData = await response.json();
  
      this.data.featureTypeOptions = [
        { value: "", label: "Select a feature type" },
        ...featureData.entries.map(entry => ({ value: entry.value, label: entry.value }))
      ];
      console.log("Feature Type Options Loaded:", this.data.featureTypeOptions);
    } catch (error) {
      console.error("Error loading feature types:", error);
      this.data.featureTypeOptions = [{ value: "", label: "Select a feature type" }];
    }
  }

  async loadSubFeatureType() {
    try {
      const subFeatureMap = {
        "Ruins and Relics": "assets/terrain/terrainFeatures/terrainFeaturesRuinClass.json",
        "Lurid Lairs": "assets/terrain/terrainFeatures/terrainFeaturesLuridLairs.json",
        "Rivers and Roads/Islands": "assets/terrain/terrainFeatures/terrainFeaturesRoadRiver.json"
      };
  
      const selectedFeature = this.data.featureType;
      const subFeatureFile = subFeatureMap[selectedFeature];
  
      if (!subFeatureFile) {
        console.warn("No sub-feature file found for selected feature:", selectedFeature);
        this.data.subFeatureTypeOptions = [{ value: "", label: "Select a sub-feature" }];
        return;
      }

      const response = await fetch(`modules/world-builder/${subFeatureFile}`);
      if (!response.ok) throw new Error(`Failed to load sub-feature file: ${response.statusText}`);
      const subFeatureData = await response.json();
  
      this.data.subFeatureTypeOptions = [
        { value: "", label: "Select a sub-feature" },
        ...subFeatureData.entries.map(entry => ({ value: entry.value, label: entry.value }))
      ];
      console.log("Sub-Feature Type Options Loaded:", this.data.subFeatureTypeOptions);
    } catch (error) {
      console.error("Error loading sub-feature types:", error);
      this.data.subFeatureTypeOptions = [{ value: "", label: "Select a sub-feature" }];
    }
  }
  
  async loadFeatureDetails() {
    try {
      const selectedSubFeature = this.data.subFeatureType;
  
      if (!selectedSubFeature) {
        console.warn("No sub-feature selected.");
        this.data.featureDetails = { title: "", results: [] };
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

    const response = await fetch(`modules/world-builder/${filePath}`);
    if (!response.ok) throw new Error(`Failed to load sub-feature file: ${response.statusText}`);
    const data = await response.json();

    const randomEntry = data.entries[Math.floor(Math.random() * data.entries.length)];

    const detailFields = [];
    if (randomEntry.name) detailFields.push(`Name: ${randomEntry.name}`);
    if (randomEntry.dimensions) detailFields.push(`Dimensions: ${randomEntry.dimensions}`);
    if (randomEntry.quantity) detailFields.push(`Quantity: ${randomEntry.quantity}`);
    if (randomEntry.description) detailFields.push(`Description: ${randomEntry.description}`);
    if (randomEntry.value) detailFields.push(randomEntry.value);

    this.data.featureDetails = {
      title: selectedSubFeature,
      results: detailFields
    };

    console.log("Feature Details Loaded:", this.data.featureDetails);
  } catch (error) {
    console.error("Error loading feature details:", error);
    this.data.featureDetails = { title: "", results: [] };
  }
}
    

/**
 * 
 * Get Data
 * 
 * 
 */
  async getData() {
    if (!this.data.populationDensityOptions.length) await this.loadPopulationDensity();
    if (!this.data.climateTypeOptions.length) await this.loadClimateType();
    if (!this.data.terrainTypeOptions.length) await this.loadTerrainType();
    if (!this.data.featureTypeOptions.length) await this.loadFeatureType();
    if (!this.data.subFeatureTypeOptions.length) await this.loadSubFeatureType();
  
    return { ...this.data };
  }
  
/**
 * 
 * Listeners
 *
 */
    activateListeners(html) {
      super.activateListeners(html);

        //Tabs
        html.find(".tabs .item").click((event) => {
          const tab = event.currentTarget.dataset.tab;
          html.find(".tabs .item").removeClass("active");
          html.find(`.tab-content`).hide();
          html.find(`[data-tab="${tab}"]`).show(); 
          $(event.currentTarget).addClass("active");
        });

        // Attach handlers for individual tabs
        handleActorsTab(this, html);
        handleLairsTab(this, html);
        handleMagicItemsTab(this, html);
        handleTownTab(this, html);
        handleTrapsTab(this, html);
        handleTreasureTab(this, html);

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

        // Add Features Buttons
      html.find(".add-room").click(() => this.addRoom());
      html.find(".add-town").click(() => console.log("Add Town placeholder."));
      html.find(".add-treasure").click(() => console.log("Add Treasure placeholder."));
      html.find(".add-magic-item").click(() => console.log("Add Magic Item placeholder."));
      html.find(".add-trap").click(() => console.log("Add Trap placeholder."));
      html.find(".add-actor").click(() => console.log("Add Actor placeholder."));
    }
  

/**
 * 
 * Events
 *
 */
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
    
      if (!selectedTerrain) {
        console.warn("No valid terrain selected.");
        this.data.terrainType = "";
        this.data.ruggedness = "";
        this.data.travelTime = "";
        this.data.encounterFrequency = "";
        this.data.subFeatureTypeOptions = [];
        this.render(false);
        return;
      }

      const terrainData = this.data.terrainTypeOptions.find(option => option.value === selectedTerrain);
    
      if (!terrainData) {
        console.error("Terrain data not found for selected value:", selectedTerrain);
        return;
      }
    
      this.data.terrainType = terrainData.value;
      this.data.ruggedness = terrainData.ruggedness;
      this.data.travelTime = terrainData.time;
      this.data.encounterFrequency = terrainData.encounters.join(", ");
      console.log("Selected Terrain Data:", terrainData);

      const caveFilePath = WorldBuilderWindow.terrainCaveMap[this.data.terrainType];
      if (caveFilePath) {
        try {
          const response = await fetch(`modules/world-builder/${caveFilePath}`);
          if (!response.ok) throw new Error(`Failed to load cave file: ${response.statusText}`);
          const data = await response.json();
          this.data.subFeatureTypeOptions = [
            { value: "", label: "Select a sub-feature" },
            ...data.entries.map(entry => ({ value: entry.value, label: entry.value }))
          ];
          console.log("Cave Sub-Feature Options Loaded:", this.data.subFeatureTypeOptions);
        } catch (error) {
          console.error("Error loading cave sub-features:", error);
          this.data.subFeatureTypeOptions = [{ value: "", label: "Select a sub-feature" }];
        }
      } else {
        console.warn("No cave sub-features available for the selected terrain.");
        this.data.subFeatureTypeOptions = [{ value: "", label: "Select a sub-feature" }];
      }
    
      this.render(false);
    }
    
    async _onFeatureTypeChange(event) {
      const selectedFeatureType = event.target.value;
    
      if (!selectedFeatureType) {
        console.warn("No valid feature type selected.");
        this.data.featureType = "";
        this.data.subFeatureTypeOptions = [{ value: "", label: "Select a sub-feature" }];
        this.render(false);
        return;
      }
    
      this.data.featureType = selectedFeatureType;
      console.log("Feature Type changed to:", this.data.featureType);
    
      await this.loadSubFeatureType();
      this.render(false);
    }
    
async _onSubFeatureTypeChange(event) {
  const selectedSubFeatureType = event.target.value;

  if (!selectedSubFeatureType) {
    console.warn("No valid sub-feature type selected.");
    this.data.subFeatureType = "";
    this.data.featureDetails = { title: "", results: [] };
    this.data.isCave = false;
    this.data.isDungeon = false;
    this.render(false);
    return;
  }

  this.data.subFeatureType = selectedSubFeatureType;

  // Toggle isCave and isDungeon based on selection
  if (selectedSubFeatureType === "Cave") {
    this.data.isCave = true;
    this.data.isDungeon = false;
  } else if (selectedSubFeatureType === "Dungeon") {
    this.data.isDungeon = true;
    this.data.isCave = false;
  } else {
    this.data.isCave = false;
    this.data.isDungeon = false;
  }

  console.log("Sub-Feature Type changed to:", this.data.subFeatureType);
  console.log("isCave:", this.data.isCave, "isDungeon:", this.data.isDungeon);

  await this.loadFeatureDetails();
  this.render(false);
}

    async _rollTerrainType() {
      console.log("Rolling for Terrain Type...");
    }
  
    async _rollFeatureType() {
      console.log("Rolling for Feature Type...");
    }
  
    async _rollEncounter() {
      console.log("Rolling for Encounter...");
    }
  
    async _onSave(event) {
      event.preventDefault();
      console.log("Saving World Builder Data:", this.data);
    }
  
    async createJournalEntry() {
      console.log("Creating Journal Entry...");
    }
  }
  