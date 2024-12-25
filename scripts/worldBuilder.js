import { handleActorsTab } from './tabActors.js';
import { handleLairsTab } from './tabLairs.js';
import { handleMagicItemsTab } from './tabMagicItems.js';
import { handleTownTab } from './tabTown.js';
import { handleTrapsTab } from './tabTraps.js';
import { handleTreasureTab } from './tabTreasure.js';
import 
{ densityFeatureMap, 
  terrainCaveMap, 
  subFeatureMap,
  subFeatureWildernessMap, 
  remnantSubMap ,
  ruinsSubMap,
  skeletonsSubMap,
  vestigesSubMap,
  wrecksSubMap ,
  antiquesSubMap,
  artifactsSubMap,
  refuseSubMap,
  relicsSubMap,
  remainsSubMap
} from './mapping.js';

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
      selectedFeatureType: "",
      selectedSubFeature: "",
      featureDetails: {},
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
 * !!!!----------------------------------------------!!!!
 * !!!!-----------------LOAD DEFAULT-----------------!!!!
 * !!!!----------------------------------------------!!!!
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
      featureDetails: {},
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
 * !!!!----------------------------------------------!!!!
 * !!!!--------------LOAD DROP DOWNS-----------------!!!!
 * !!!!----------------------------------------------!!!!
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
      const selectedDensity = this.data.populationDensity;
      const featureFile = densityFeatureMap[selectedDensity];
  
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
      const selectedFeature = this.data.featureType;
      const subFeatureFile = subFeatureWildernessMap[selectedFeature];
  
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
        return null; // Return null if no sub-feature is selected
      }
  
      // Determine the file path for the selected sub-feature
      const caveFilePath = terrainCaveMap[this.data.terrainType];
      const filePath = selectedSubFeature === "Cave" && caveFilePath
        ? caveFilePath
        : subFeatureMap[selectedSubFeature];
  
      if (!filePath) {
        console.warn("No file found for selected sub-feature:", selectedSubFeature);
        return null; // Return null if no file is found
      }
  
      // Fetch the sub-feature data
      const response = await fetch(`modules/world-builder/${filePath}`);
      if (!response.ok) throw new Error(`Failed to load sub-feature file: ${response.statusText}`);
      const data = await response.json();
  
      console.log("Sub-Feature Data Loaded:", data);
      return data.entries; // Return the entries from the file
    } catch (error) {
      console.error("Error loading feature details:", error);
      return null; // Return null in case of an error
    }
  }
  
  
  
  
  

async loadConditionData() {
  try {
    const response = await fetch("modules/world-builder/assets/terrain/terrainFeatures/ruins/ruinsSub/condition.json");
    if (!response.ok) throw new Error(`Failed to load condition.json: ${response.statusText}`);
    const conditionData = await response.json();

    console.log("Condition Data Loaded:", conditionData.entries);
    return conditionData.entries;
  } catch (error) {
    console.error("Error loading condition data:", error);
    return null;
  }
}


randomizeConditionData(entries) {
  const randomize = (array) => array[Math.floor(Math.random() * array.length)].value;

  return {
    condition: randomize(entries.condition),
    coveredBy: randomize(entries.coveredBy),
    state: randomize(entries.state),
    keeper: randomize(entries.keeper),
  };
}


/**
 * !!!!----------------------------------------------!!!!
 * !!!!------------Update Feature Details------------!!!!
 * !!!!----------------------------------------------!!!!
 */
async updateFeatureDetails() {
  const conditionEntries = await this.loadConditionData();
  if (!conditionEntries) {
    console.error("Condition data could not be loaded.");
    return;
  }

  const subFeatureData = await this.loadFeatureDetails();
  if (!subFeatureData) {
    console.warn("No sub-feature data loaded.");
    this.data.featureDetails = { title: "", results: [] };
    this.render(false);
    return;
  }

  const randomSubFeatureEntry = subFeatureData[Math.floor(Math.random() * subFeatureData.length)];
  const subFeature = randomSubFeatureEntry?.value || "Feature";

  const results = [];
  console.log(`Sub-Feature Selected: ${subFeature}`);

        // Update Features from Mapping.js
  if (this.data.subFeatureType === "Remnants" && remnantSubMap[subFeature]) {
    const remnantFile = remnantSubMap[subFeature];
    try {
      const response = await fetch(`modules/world-builder/${remnantFile}`);
      if (!response.ok) throw new Error(`Failed to load remnant file: ${response.statusText}`);
      const remnantData = await response.json();

      const randomRemnantEntry = remnantData.entries[Math.floor(Math.random() * remnantData.entries.length)];
      const remnantDescription = randomRemnantEntry?.value || "No data available";

      results.push(`Sub-Feature: ${subFeature} - ${remnantDescription}`);
      console.log("Appended Remnants Data:", remnantDescription);
    } catch (error) {
      console.error("Error loading remnant-specific data:", error);
      results.push(`Sub-Feature: ${subFeature} - No data available`);
    }
  }

  else if (this.data.subFeatureType === "Ruins" && ruinsSubMap[subFeature]) {
    const ruinsFile = ruinsSubMap[subFeature];
    try {
      const response = await fetch(`modules/world-builder/${ruinsFile}`);
      if (!response.ok) throw new Error(`Failed to load ruins file: ${response.statusText}`);
      const ruinsData = await response.json();

      const randomRuinsEntry = ruinsData.entries[Math.floor(Math.random() * ruinsData.entries.length)];
      const ruinsDescription = randomRuinsEntry?.value || "No data available";

      results.push(`Sub-Feature: ${subFeature} - ${ruinsDescription}`);
      console.log("Appended Ruins Data:", ruinsDescription);
    } catch (error) {
      console.error("Error loading ruins-specific data:", error);
      results.push(`Sub-Feature: ${subFeature} - No data available`);
    }
  }

  else if (this.data.subFeatureType === "Skeletons" && skeletonsSubMap[subFeature]) {
    const skeletonsFile = skeletonsSubMap[subFeature];
    try {
      const response = await fetch(`modules/world-builder/${skeletonsFile}`);
      if (!response.ok) throw new Error(`Failed to load skeletons file: ${response.statusText}`);
      const skeletonsData = await response.json();

      const randomSkeletonsEntry = skeletonsData.entries[Math.floor(Math.random() * skeletonsData.entries.length)];
      const skeletonsDescription = randomSkeletonsEntry?.value || "No data available";

      results.push(`Sub-Feature: ${subFeature} - ${skeletonsDescription}`);
      console.log("Appended Skeletons Data:", skeletonsDescription);
    } catch (error) {
      console.error("Error loading skeletons-specific data:", error);
      results.push(`Sub-Feature: ${subFeature} - No data available`);
    }
  }

  else if (this.data.subFeatureType === "Vestiges" && vestigesSubMap[subFeature]) {
    const vestigesFile = vestigesSubMap[subFeature];
    try {
      const response = await fetch(`modules/world-builder/${vestigesFile}`);
      if (!response.ok) throw new Error(`Failed to load vestiges file: ${response.statusText}`);
      const vestigesData = await response.json();
  
      const randomVestigesEntry = vestigesData.entries[Math.floor(Math.random() * vestigesData.entries.length)];
      const vestigesDescription = randomVestigesEntry?.value || "No data available";
  
      results.push(`Sub-Feature: ${subFeature} - ${vestigesDescription}`);
      console.log("Appended Vestiges Data:", vestigesDescription);
    } catch (error) {
      console.error("Error loading vestiges-specific data:", error);
      results.push(`Sub-Feature: ${subFeature} - No data available`);
    }
  }

  else if (this.data.subFeatureType === "Wrecks" && wrecksSubMap[subFeature]) {
  const wrecksFile = wrecksSubMap[subFeature];
  try {
    const response = await fetch(`modules/world-builder/${wrecksFile}`);
    if (!response.ok) throw new Error(`Failed to load wrecks file: ${response.statusText}`);
    const wrecksData = await response.json();

    const randomWrecksEntry = wrecksData.entries[Math.floor(Math.random() * wrecksData.entries.length)];
    const wrecksDescription = randomWrecksEntry?.value || "No data available";

    results.push(`Sub-Feature: ${subFeature} - ${wrecksDescription}`);
    console.log("Appended Wrecks Data:", wrecksDescription);
  } catch (error) {
    console.error("Error loading wrecks-specific data:", error);
    results.push(`Sub-Feature: ${subFeature} - No data available`);
  }
}

else if (this.data.subFeatureType === "Antiques" && antiquesSubMap[subFeature]) {
  const antiquesFile = antiquesSubMap[subFeature];
  try {
    const response = await fetch(`modules/world-builder/${antiquesFile}`);
    if (!response.ok) throw new Error(`Failed to load antiques file: ${response.statusText}`);
    const antiquesData = await response.json();

    const randomAntiquesEntry = antiquesData.entries[Math.floor(Math.random() * antiquesData.entries.length)];
    const antiquesDescription = randomAntiquesEntry?.value || "No data available";

    results.push(`Sub-Feature: ${subFeature} - ${antiquesDescription}`);
    console.log("Appended Antiques Data:", antiquesDescription);
  } catch (error) {
    console.error("Error loading antiques-specific data:", error);
    results.push(`Sub-Feature: ${subFeature} - No data available`);
  }
}

else if (this.data.subFeatureType === "Artifacts" && artifactsSubMap[subFeature]) {
  const artifactsFile = artifactsSubMap[subFeature];
  try {
    const response = await fetch(`modules/world-builder/${artifactsFile}`);
    if (!response.ok) throw new Error(`Failed to load artifacts file: ${response.statusText}`);
    const artifactsData = await response.json();

    const randomArtifactsEntry = artifactsData.entries[Math.floor(Math.random() * artifactsData.entries.length)];
    const artifactsDescription = randomArtifactsEntry?.value || "No data available";

    results.push(`Sub-Feature: ${subFeature} - ${artifactsDescription}`);
    console.log("Appended Artifacts Data:", artifactsDescription);
  } catch (error) {
    console.error("Error loading artifacts-specific data:", error);
    results.push(`Sub-Feature: ${subFeature} - No data available`);
  }
}

else if (this.data.subFeatureType === "Refuse" && refuseSubMap[subFeature]) {
  const refuseFile = refuseSubMap[subFeature];
  try {
    const response = await fetch(`modules/world-builder/${refuseFile}`);
    if (!response.ok) throw new Error(`Failed to load refuse file: ${response.statusText}`);
    const refuseData = await response.json();

    const randomRefuseEntry = refuseData.entries[Math.floor(Math.random() * refuseData.entries.length)];
    const refuseDescription = randomRefuseEntry?.value || "No data available";

    results.push(`Sub-Feature: ${subFeature} - ${refuseDescription}`);
    console.log("Appended Refuse Data:", refuseDescription);
  } catch (error) {
    console.error("Error loading refuse-specific data:", error);
    results.push(`Sub-Feature: ${subFeature} - No data available`);
  }
}

else if (this.data.subFeatureType === "Relics" && relicsSubMap[subFeature]) {
  const relicsFile = relicsSubMap[subFeature];
  try {
    const response = await fetch(`modules/world-builder/${relicsFile}`);
    if (!response.ok) throw new Error(`Failed to load relics file: ${response.statusText}`);
    const relicsData = await response.json();

    const randomRelicsEntry = relicsData.entries[Math.floor(Math.random() * relicsData.entries.length)];
    const relicsDescription = randomRelicsEntry?.value || "No data available";

    results.push(`Sub-Feature: ${subFeature} - ${relicsDescription}`);
    console.log("Appended Relics Data:", relicsDescription);
  } catch (error) {
    console.error("Error loading relics-specific data:", error);
    results.push(`Sub-Feature: ${subFeature} - No data available`);
  }
}

else if (this.data.subFeatureType === "Remains" && remainsSubMap[subFeature]) {
  const remainsFile = remainsSubMap[subFeature];
  try {
    const response = await fetch(`modules/world-builder/${remainsFile}`);
    if (!response.ok) throw new Error(`Failed to load remains file: ${response.statusText}`);
    const remainsData = await response.json();

    const randomRemainsEntry = remainsData.entries[Math.floor(Math.random() * remainsData.entries.length)];
    const remainsDescription = randomRemainsEntry?.value || "No data available";

    results.push(`Sub-Feature: ${subFeature} - ${remainsDescription}`);
    console.log("Appended Remains Data:", remainsDescription);
  } catch (error) {
    console.error("Error loading remains-specific data:", error);
    results.push(`Sub-Feature: ${subFeature} - No data available`);
  }
}

      //end Mapping.js Data

  const randomConditions = this.randomizeConditionData(conditionEntries);
  results.push(
    `Condition: ${randomConditions.condition}`,
    `Covered By: ${randomConditions.coveredBy}`,
    `State: ${randomConditions.state}`,
    `Keeper: ${randomConditions.keeper}`
  );

  this.data.featureDetails = {
    title: `${this.data.subFeatureType}:`,
    results: results,
  };

  console.log("Final Updated Feature Details:", this.data.featureDetails);

  this.render(false);
}











    

/**
 * !!!!----------------------------------------------!!!!
 * !!!!------------------GET DATA--------------------!!!!
 * !!!!----------------------------------------------!!!!
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
 * !!!!----------------------------------------------!!!!
 * !!!!-----------------LISTENERS--------------------!!!!
 * !!!!----------------------------------------------!!!!
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
      html.find(".sub-feature-type-select").change(async () => {
        await this.updateFeatureDetails();
      });

        //Random Generator Listeners
        html.find(".randomize-feature-details").click(async () => {
          await this.updateFeatureDetails();
        });
  
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
 * !!!!----------------------------------------------!!!!
 * !!!!------------------EVENTS----------------------!!!!
 * !!!!----------------------------------------------!!!!
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
    

      const caveFilePath = terrainCaveMap[selectedTerrain];
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
  