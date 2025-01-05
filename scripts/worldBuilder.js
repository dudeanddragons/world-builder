import { viewState } from './wbViewState.js';
import { getLairActors } from "./wsLairActors.js";
import { categorizeItems } from './wsDataItems.js';
import { handleActorsTab } from './tabActors.js';
import { handleLairsTab, loadLairFeatures  } from './tabLairs.js';
import { handleMagicItemsTab } from './tabMagicItems.js';
import { handleDynamicLocationTab } from './tabTown.js';
import { handleStoryTab } from './tabStory.js';
import { handleTreasureTab } from './tabTreasure.js';
import { parseDiceExpression } from './helperDice.js';
import { 
  densityFeatureMap, 
  terrainCaveMap,
  subFeatureMap,
  subFeatureWildernessMap, 
  remnantSubMap,
  ruinsSubMap,
  skeletonsSubMap,
  vestigesSubMap,
  wrecksSubMap,
  antiquesSubMap,
  artifactsSubMap,
  refuseSubMap,
  relicsSubMap,
  remainsSubMap,
  dungeonsSubMap,
  caveSubEntranceMap,
  burrowSubMap,
  campSubFightingForceMap,
  campSubLeaderTypesMap,
  campSubCurrentStatusMap,
  campSubDefencesMap,
  dwellingEncountersMap,
  shipwreckSubContentsMap,
  shipwreckSubCargoMap,
  creviceSubMap
} from './mapping.js';

// Register the Handlebars helper
Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

export class WorldBuilderWindow extends Application {
  constructor(options = {}) {
    super(options);

    this.data = {
      // Existing properties...
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
      lairFeatures: [],
      encounterOptions: [],
      lairTreasureOptions: {
        armor: [],
        weapons: [],
        potions: [],
        scrolls: [],
        magicItems: [],
        magicWeapons: [],
        gems: [],
        magicArmor: [],
        art: [],
        spells: [],
      },
      lairRooms: [
        {
          lairRoomDescription: "",
          lairRoomNotes: "",
          lairRoomSecrets: "",
          features: ["Room"],
          encounters: [],
          npc: [],
          treasure: [],
          collapsed: true,
        },
      ],
      caveFeatures: [],
      locations: [],
      treasures: [],
      magicItems: [],
      story: [],
      actors: [],
    };
    

    // Preload features during initialization
    this.preloadFeatures();
    
  }
  

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "World Builder",
      width: 800,
      height: "auto",
      resizable: true,
      template: "modules/world-builder/templates/wb.hbs",
      classes: ["worldbuilder-form", "sheet", "journal-sheet"],
    });
  }

  render(force = false, options = {}) {
    super.render(force, options);

    const html = this.element;

    // Apply collapsible listeners
    this.initializeCollapsibleListeners(html);
    this.applyCollapsibleState(html);
  }

    /**
   * Initialize collapsible listeners for all collapsible headers
   */
    initializeCollapsibleListeners(html) {
      html.on("click", ".wb-header.wb-collapsible", (event) => {
        const header = $(event.currentTarget);
        const index = header.data("index"); // Use a `data-index` attribute for mapping
    
        if (index === undefined) {
          console.warn("Collapsible header clicked without a valid index.");
          return;
        }
    
        // Toggle the collapsed state in the data model
        const roomData = this.data.lairRooms[index];
        roomData.collapsed = !roomData.collapsed;
    
        console.log(`Toggled collapse state for room ${index}:`, roomData.collapsed);
    
        // Re-render the UI to reflect the change
        this.render(false);
      });
    }
    
  
    /**
     * Apply the current collapsible state to the DOM
     */
    applyCollapsibleState(html) {
      html.find(".wb-collapsible-section").each((index, section) => {
        const roomData = this.data.lairRooms[index];
        const header = $(section).find(".wb-header.wb-collapsible");
        const content = $(section).find(".wb-collapsible-content");
    
        // Synchronize DOM with data
        if (roomData.collapsed) {
          header.addClass("wb-collapsed");
          content.removeClass("wb-visible").css({ maxHeight: "0" });
        } else {
          header.removeClass("wb-collapsed");
          content.addClass("wb-visible").css({ maxHeight: content.prop("scrollHeight") + "px" });
        }
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
    lairFeatures: [],
    encounterOptions: [],
    lairTreasureOptions: {
      armor: [],
      weapons: [],
      potions: [],
      scrolls: [],
      magicItems: [],
      magicWeapons: [],
      gems: [],
      magicArmor: [],
      art: [],
      spells: [],
    },
    lairRooms: [
      {
        lairRoomDescription: "",
        lairRoomNotes: "",
        lairRoomSecrets: "",
        features: ["Room"],
        encounters: [],
        npc: [],
        treasure: [],
        collapsed: true,
      },
    ],
    caveFeatures: [],
    lairRooms: [],
    locations: [],
    treasures: [],
    magicItems: [],
    story: [],
    actors: [],
  };

  // Load default treasure options
  this.loadTreasureOptions();

  // Load default lair encounter options
  this.loadDefaultEncounterOptions();
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
  
  
// Preload features for the Lairs tab
async preloadFeatures() {
  try {
    this.data.lairFeatures = await loadLairFeatures(); // Load features from JSON
    this.data.featureOptions = [...this.data.lairFeatures]; // Copy features into featureOptions
    console.log("Preloaded Lair Features:", this.data.featureOptions); // Confirm it's set
  } catch (error) {
    console.error("Failed to preload lair features:", error);
    this.data.lairFeatures = [];
    this.data.featureOptions = [];
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
 * !!!!--------------Load Lair Options---------------!!!!
 * !!!!----------------------------------------------!!!!
 */

async loadDefaultEncounterOptions() {
  try {
    console.log("Loading default lair encounter options from dungeon compendium...");

    // Default compendium to dungeon
    const compendiumNames = ["world.wb-lairs-dungeons"];

    // Fetch data from the compendium
    const actorData = await getLairActors(compendiumNames);
    if (!actorData || actorData.length === 0) {
      console.warn("No actors found in the dungeon compendium.");
      this.data.encounterOptions = [];
      this.data.encounterData = [];
      return;
    }

    // Populate default encounter options and data
    this.data.encounterOptions = actorData.map((actor) => actor.name).sort((a, b) => a.localeCompare(b));
    this.data.encounterData = actorData;

    console.log("Default Lair Encounter Options:", this.data.encounterOptions);
    console.log("Default Lair Encounter Data:", this.data.encounterData);
  } catch (error) {
    console.error("Error loading default lair encounter options:", error);
    this.data.encounterOptions = [];
    this.data.encounterData = [];
  }
}

async loadEncounterOptions() {
  try {
    // Determine the compendium name. Default to dungeons if no explicit flag is set.
    const compendiumNames = this.data.isCave
      ? ["world.wb-lairs-caves"]
      : ["world.wb-lairs-dungeons"];

    // Fetch detailed actor data from the compendiums
    const actorData = await getLairActors(compendiumNames);

    if (!actorData || actorData.length === 0) {
      console.warn("No actors found in the specified compendiums.");
      this.data.encounterOptions = [];
      this.data.encounterData = [];
      return;
    }

    // Populate encounter options with actor names
    this.data.encounterOptions = actorData.map((actor) => actor.name).sort((a, b) => a.localeCompare(b));
    this.data.encounterData = actorData; // Use the detailed actor data fetched from `getLairActors`

    console.log("Encounter Options:", this.data.encounterOptions);
    console.log("Encounter Data (from Compendiums):", this.data.encounterData);
  } catch (error) {
    console.error("Error loading encounter options:", error);
    this.data.encounterOptions = [];
    this.data.encounterData = [];
  }
}










async loadTreasureOptions() {
  try {
    console.log("Loading treasure options...");
    
    // Fetch categorized items
    const categories = categorizeItems();
    if (!categories || Object.keys(categories).length === 0) {
      console.warn("No treasure categories or items found.");
      this.data.lairTreasureOptions = {
        armor: [],
        weapons: [],
        potions: [],
        scrolls: [],
        magicItems: [],
        magicWeapons: [],
        gems: [],
        magicArmor: [],
        art: [],
        spells: [],
      };
      return;
    }

    // Populate lairTreasureOptions with categorized items
    this.data.lairTreasureOptions = categories;

    console.log("Lair Treasure Options Loaded:", this.data.lairTreasureOptions);
  } catch (error) {
    console.error("Error loading treasure options:", error);

    // Reset to empty structure in case of error
    this.data.lairTreasureOptions = {
      armor: [],
      weapons: [],
      potions: [],
      scrolls: [],
      magicItems: [],
      magicWeapons: [],
      gems: [],
      magicArmor: [],
      art: [],
      spells: [],
    };
  }
}













/**
 * !!!!----------------------------------------------!!!!
 * !!!!------------Update Feature Details------------!!!!
 * !!!!----------------------------------------------!!!!
 */
async updateFeatureDetails() {
  // Check if the feature type is "Ruins" or "Relics" before loading conditions
  let conditionEntries = null;
  if (this.data.featureType === "Ruins and Relics") {
      conditionEntries = await this.loadConditionData();
      if (!conditionEntries) {
          console.error("Condition data could not be loaded.");
          return;
      }
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

// Handle Dungeon-specific data
else if (this.data.subFeatureType === "Dungeon" && dungeonsSubMap["Passage Size"]) {
  const dungeonFile = dungeonsSubMap["Passage Size"];
  try {
    // Fetch the dungeon data file
    const response = await fetch(`modules/world-builder/${dungeonFile}`);
    if (!response.ok) throw new Error(`Failed to load dungeon file: ${response.statusText}`);
    const dungeonData = await response.json();

    // Select a single random entry
    const randomDungeonEntry = dungeonData.entries[Math.floor(Math.random() * dungeonData.entries.length)];
    const passageType = randomDungeonEntry?.type || "No Type Available";
    const passageDimensions = randomDungeonEntry?.passageDimensions || {};

    // Add the sub-feature type
    results.push(`Sub-Feature: ${passageType}`);

    // Process dimensions using parseDiceExpression
    if (passageDimensions.height) {
      const height = typeof passageDimensions.height === "string" ? parseDiceExpression(passageDimensions.height) : "Unknown";
      results.push(`Height: ${height}`);
    }
    if (passageDimensions.width) {
      const width = typeof passageDimensions.width === "string" ? parseDiceExpression(passageDimensions.width) : "Unknown";
      results.push(`Width: ${width}`);
    }
    if (passageDimensions.length) {
      const length = typeof passageDimensions.length === "string" ? parseDiceExpression(passageDimensions.length) : "Unknown";
      results.push(`Length: ${length}`);
    }

    console.log("Appended Dungeon Data:", passageType, passageDimensions);
  } catch (error) {
    console.error("Error loading dungeon-specific data:", error);
    results.push(`Sub-Feature: ${subFeature} - No data available`);
  }
}


  else if (this.data.subFeatureType === "Cave") {
    const caveFile = caveSubEntranceMap;
    try {
      const response = await fetch(`modules/world-builder/${caveFile}`);
      if (!response.ok) throw new Error(`Failed to load cave file: ${response.statusText}`);
      const caveData = await response.json();
  
      // Select a random cave type entry
      const randomCaveEntry = caveData.entries[Math.floor(Math.random() * caveData.entries.length)];
      const caveType = randomCaveEntry?.caveType || "Unknown Cave Type";
      const entrances = randomCaveEntry?.entrances || ["No entrance data available"];
  
      // Select a random entrance from the list of entrances
      const randomEntrance = entrances[Math.floor(Math.random() * entrances.length)];
  
      results.push(`Cave Type: ${caveType}`);
      results.push(`Entrance: ${randomEntrance}`);
  
      console.log("Appended Cave Data:", caveType, randomEntrance);
    } catch (error) {
      console.error("Error loading cave-specific data:", error);
      results.push(`Sub-Feature: ${subFeature} - No data available`);
    }
  }
  
  else if (this.data.subFeatureType === "Burrows" && subFeatureMap["Burrows"]) {
    const burrowsFile = subFeatureMap["Burrows"]; // Base table for burrows
    try {
      // Step 1: Fetch the base Burrows data
      const response = await fetch(`modules/world-builder/${burrowsFile}`);
      if (!response.ok) throw new Error(`Failed to load burrow base file: ${response.statusText}`);
      const burrowBaseData = await response.json();
  
      console.log("Base Burrow Data Loaded:", burrowBaseData);
  
      // Step 2: Select a random base burrow entry
      const randomBaseBurrow = burrowBaseData.entries[Math.floor(Math.random() * burrowBaseData.entries.length)];
      const burrowId = randomBaseBurrow?.id;
      const burrowName = randomBaseBurrow?.name || "Unknown Burrow";
      const burrowDimensions = randomBaseBurrow?.dimensions || "No dimensions available";
  
      results.push(`Burrow: ${burrowName}`);
      results.push(`Dimensions: ${burrowDimensions}`);
  
      // Step 3: Find the corresponding sub-feature file using the `key` field
      let burrowSubFile = null;
  
      for (const filePath of Object.values(burrowSubMap)) {
        const subResponse = await fetch(`modules/world-builder/${filePath}`);
        if (!subResponse.ok) continue;
  
        const subData = await subResponse.json();
        if (subData.key?.includes(burrowId)) {
          burrowSubFile = filePath;
          break;
        }
      }
  
      if (!burrowSubFile) {
        console.warn(`No sub-feature file mapped for Burrow ID: ${burrowId}`);
        results.push("No additional details available for this burrow type.");
        console.log("Results so far:", results);
        return;
      }
  
      // Step 4: Fetch the burrow sub-feature data
      const subResponse = await fetch(`modules/world-builder/${burrowSubFile}`);
      if (!subResponse.ok) throw new Error(`Failed to load burrow sub-feature file: ${subResponse.statusText}`);
      const burrowSubData = await subResponse.json();
  
      console.log("Burrow Sub-Feature Data Loaded:", burrowSubData);
  
      // Step 5: Select a random sub-feature entry
      const randomSubFeatureEntry = burrowSubData.entries[Math.floor(Math.random() * burrowSubData.entries.length)];
      const encounterValue = randomSubFeatureEntry?.value || "No encounter data available";
      const diceRoll = randomSubFeatureEntry?.dice
        ? parseDiceExpression(randomSubFeatureEntry.dice)
        : "Unknown";
  
      results.push(`Encounter: ${encounterValue}`);
      results.push(`No. Appearing: ${diceRoll}`);
      console.log("Appended Burrow Data:", burrowName, burrowDimensions, encounterValue, diceRoll);
    } catch (error) {
      console.error("Error loading burrow-specific data:", error);
      results.push("No data available for Burrows.");
    }
  }
  
  else if (this.data.subFeatureType === "Camp" && subFeatureMap["Camp"]) {
    const campFile = subFeatureMap["Camp"];
    try {
        const response = await fetch(`modules/world-builder/${campFile}`);
        if (!response.ok) throw new Error(`Failed to load camp file: ${response.statusText}`);
        const campData = await response.json();

        // Select a random base camp entry
        const randomCampEntry = campData.entries[Math.floor(Math.random() * campData.entries.length)];
        const campType = randomCampEntry?.value || "Unknown Camp Type";

        results.push(`Camp Type: ${campType}`);

        // Define the maps and their corresponding labels
        const maps = [
            { file: campSubFightingForceMap["Fighting Force"], label: "Fighting Force" },
            { file: campSubLeaderTypesMap["Leader Types"], label: "Leader" },
            { file: campSubCurrentStatusMap["Current Status"], label: "Patrols" },
            { file: campSubDefencesMap["Defences"], label: "Defenses" }
        ];

        // Fetch and append results from the related maps
        for (const { file, label } of maps) {
            const subResponse = await fetch(`modules/world-builder/${file}`);
            if (!subResponse.ok) throw new Error(`Failed to load camp sub-file: ${subResponse.statusText}`);
            const subData = await subResponse.json();

            // Select a random entry from the sub-data
            const randomSubEntry = subData.entries[Math.floor(Math.random() * subData.entries.length)];
            const subValue = randomSubEntry?.value || "No data available";

            results.push(`${label}: ${subValue}`);
        }

        console.log("Appended Camp Data:", results);
    } catch (error) {
        console.error("Error loading camp-specific data:", error);
        results.push(`Sub-Feature: ${subFeature} - No data available`);
    }
}

else if (this.data.subFeatureType === "Dwelling" && dwellingEncountersMap["Dwelling Encounters"]) {
  const dwellingFile = dwellingEncountersMap["Dwelling Encounters"];
  try {
      const response = await fetch(`modules/world-builder/${dwellingFile}`);
      if (!response.ok) throw new Error(`Failed to load dwelling file: ${response.statusText}`);
      const dwellingData = await response.json();

      // Select a random dwelling encounter
      const randomDwellingEntry = dwellingData.entries[Math.floor(Math.random() * dwellingData.entries.length)];
      const dwellingName = randomDwellingEntry?.name || "Unknown Dwelling Encounter";
      const dwellingDice = randomDwellingEntry?.dice || "1";
      const noAppearing = parseDiceExpression(dwellingDice);

      results.push(`Dwelling Encounter: ${dwellingName}`);
      results.push(`No. Appearing: ${noAppearing}`);

      // Handle Dwelling Type
      const dwellingTypeRoll = Math.floor(Math.random() * 4) + 1;
      switch (dwellingTypeRoll) {
          case 1: {
              const rooms = parseDiceExpression("2d10");
              const area = parseDiceExpression("1d10*500");
              const secondFloorProbability = Math.random() < 0.4; // 40% chance
              const secondFloorArea = secondFloorProbability
                  ? `${parseDiceExpression("1d10*10")}% of main floor area`
                  : "None";
              const towers = parseDiceExpression("1d4-1");

              results.push("Dwelling Type: Manor House");
              results.push(`Rooms: ${rooms}`);
              results.push(`Area: ${area} sq. ft.`);
              results.push(`Second Floor Area: ${secondFloorArea}`);
              results.push(`Towers: ${towers}`);
              break;
          }
          case 2: {
              const houses = parseDiceExpression("1d4*10");
              results.push("Dwelling Type: Hamlet");
              results.push(`Houses: ${houses}`);
              break;
          }
          case 3: {
              const buildings = parseDiceExpression("5d4");
              results.push("Dwelling Type: Abandoned Citadel");
              results.push(`Buildings: ${buildings}`);
              break;
          }
          case 4: {
              const ruinsFile = subFeatureMap["Ruins"];
              try {
                  const ruinsResponse = await fetch(`modules/world-builder/${ruinsFile}`);
                  if (!ruinsResponse.ok) throw new Error(`Failed to load ruins file: ${ruinsResponse.statusText}`);
                  const ruinsData = await ruinsResponse.json();

                  const randomRuinsEntry = ruinsData.entries[Math.floor(Math.random() * ruinsData.entries.length)];
                  const ruinsDescription = randomRuinsEntry?.value || "No data available";

                  results.push("Dwelling Type: Roll on Ruins Table");
                  results.push(`Ruins: ${ruinsDescription}`);
              } catch (error) {
                  console.error("Error loading ruins-specific data for dwelling type:", error);
                  results.push("Ruins: No data available");
              }
              break;
          }
      }

      console.log("Appended Dwelling Data:", results);
  } catch (error) {
      console.error("Error loading dwelling-specific data:", error);
      results.push(`Sub-Feature: ${subFeature} - No data available`);
  }
}
  
else if (this.data.subFeatureType === "Shipwreck") {
  const shipwreckFile = subFeatureMap["Shipwreck"];
  try {
      const response = await fetch(`modules/world-builder/${shipwreckFile}`);
      if (!response.ok) throw new Error(`Failed to load shipwreck file: ${response.statusText}`);
      const shipwreckData = await response.json();

      const randomShipwreckEntry = shipwreckData.entries[Math.floor(Math.random() * shipwreckData.entries.length)];
      const shipwreckType = randomShipwreckEntry?.name || "Unknown Shipwreck Type";

      results.push(`Shipwreck Type: ${shipwreckType}`);

      // Handle Shipwreck Contents
      const contentsFile = shipwreckSubContentsMap["Shipwreck Contents"];
      const contentsResponse = await fetch(`modules/world-builder/${contentsFile}`);
      if (!contentsResponse.ok) throw new Error(`Failed to load shipwreck contents file: ${contentsResponse.statusText}`);
      const contentsData = await contentsResponse.json();

      const randomContentsEntry = contentsData.entries[Math.floor(Math.random() * contentsData.entries.length)];
      const rolls = randomContentsEntry?.rolls || 0;
      const tblMap = randomContentsEntry?.reference?.tblMap;

      if (rolls > 0 && tblMap) {
          const mapFile = tblMap === "tblRelics" 
              ? subFeatureMap["Relics"] 
              : shipwreckSubCargoMap["Shipwreck Cargo"];

          const mapResponse = await fetch(`modules/world-builder/${mapFile}`);
          if (!mapResponse.ok) throw new Error(`Failed to load mapped file: ${mapResponse.statusText}`);
          const mapData = await mapResponse.json();

          for (let i = 0; i < rolls; i++) {
              const randomMappedEntry = mapData.entries[Math.floor(Math.random() * mapData.entries.length)];

              if (tblMap === "tblRelics") {
                  // Execute full relic logic as if dropdown was selected
                  const relicSubFeature = randomMappedEntry?.value || "Unknown";
                  const relicFile = relicsSubMap[relicSubFeature];
                  if (relicFile) {
                      try {
                          const relicResponse = await fetch(`modules/world-builder/${relicFile}`);
                          if (!relicResponse.ok) throw new Error(`Failed to load relic file: ${relicResponse.statusText}`);
                          const relicData = await relicResponse.json();

                          const randomRelicEntry = relicData.entries[Math.floor(Math.random() * relicData.entries.length)];
                          const relicDetails = randomRelicEntry?.value || "No details available";

                          results.push(`Relic: ${relicSubFeature} - ${relicDetails}`);
                      } catch (error) {
                          console.error("Error loading relic-specific data:", error);
                          results.push(`Relic: ${relicSubFeature} - No data available`);
                      }
                  } else {
                      results.push(`Relic: ${relicSubFeature} - No data available`);
                  }
              } else if (tblMap === "shipwreckSubCargoMap") {
                  const name = randomMappedEntry?.name || "Unknown Cargo";
                  const baseValue = randomMappedEntry?.baseValue ? parseDiceExpression(randomMappedEntry.baseValue) : "Unknown Value";
                  results.push(`Cargo: ${name} (Value: ${baseValue})`);
              }
          }
      }

      console.log("Appended Shipwreck Data:", results);
  } catch (error) {
      console.error("Error loading shipwreck-specific data:", error);
      results.push(`Sub-Feature: ${subFeature} - No data available`);
  }
}

else if (this.data.subFeatureType === "Ledge") {
  const ledgeFile = subFeatureMap["Ledge"];
  try {

      const response = await fetch(`modules/world-builder/${ledgeFile}`);
      if (!response.ok) throw new Error(`Failed to load ledge file: ${response.statusText}`);
      const ledgeData = await response.json();

      const randomLedgeEntry = ledgeData.entries[Math.floor(Math.random() * ledgeData.entries.length)];
      const encounterType = randomLedgeEntry?.value || "No encounter available";
      const encounterCount = randomLedgeEntry?.dice ? parseDiceExpression(randomLedgeEntry.dice) : "Unknown";

      results.push("Sub-Feature: Ledge");
      results.push(`Encounter: ${encounterType}`);
      results.push(`No. Appearing: ${encounterCount}`);
      console.log("Appended Ledge Data:", encounterType, encounterCount);
  } catch (error) {
      console.error("Error loading ledge-specific data:", error);
      results.push(`Sub-Feature: ${subFeature} - No data available`);
  }
}

else if (this.data.subFeatureType === "Crevice") {
  const creviceFile = subFeatureMap["Crevice"];
  try {
      // Step 1: Roll on the main Crevice table
      const response = await fetch(`modules/world-builder/${creviceFile}`);
      if (!response.ok) throw new Error(`Failed to load Crevice file: ${response.statusText}`);
      const creviceData = await response.json();

      const randomCreviceEntry = creviceData.entries[Math.floor(Math.random() * creviceData.entries.length)];
      const encounterType = randomCreviceEntry?.value || "Unknown Encounter";
      const encounterCount = randomCreviceEntry?.dice ? parseDiceExpression(randomCreviceEntry.dice) : "Unknown";

      results.push(`Encounter: ${encounterType}`);
      results.push(`No. Appearing: ${encounterCount}`);

      // Step 2: Roll on the Crevice Sub-Table
      const creviceSubFile = creviceSubMap["Crevice"];
      const subResponse = await fetch(`modules/world-builder/${creviceSubFile}`);
      if (!subResponse.ok) throw new Error(`Failed to load Crevice Sub-Table file: ${creviceSubFile}`);
      const creviceSubData = await subResponse.json();

      const randomSubEntry = creviceSubData.entries[Math.floor(Math.random() * creviceSubData.entries.length)];
      const subRolls = randomSubEntry?.rolls || [];

      for (const roll of subRolls) {
          const tblMap = roll.reference?.tblMap; // Get the map to use
          const dice = roll.dice || "1"; // Get the dice roll count

          // Resolve the table mapping dynamically
          const mapping = eval(tblMap); // Access the appropriate map (e.g., refuseSubMap)
          if (!mapping) {
              console.warn(`Mapping not found for tableName: ${tblMap}`);
              results.push(`No data available for: ${tblMap}`);
              continue;
          }

          // Select a random sub-feature from the map
          const subFeatureKey = Object.keys(mapping)[Math.floor(Math.random() * Object.keys(mapping).length)];
          const subFeatureFile = mapping[subFeatureKey];
          if (!subFeatureFile) {
              console.warn(`File not found in mapping for: ${tblMap}`);
              results.push(`No data available for: ${tblMap}`);
              continue;
          }

          // Fetch and roll on the selected sub-feature file
          const subFeatureResponse = await fetch(`modules/world-builder/${subFeatureFile}`);
          if (!subFeatureResponse.ok) throw new Error(`Failed to load sub-feature file: ${subFeatureFile}`);
          const subFeatureData = await subFeatureResponse.json();

          for (let i = 0; i < parseDiceExpression(dice); i++) {
            const randomSubFeatureEntry = subFeatureData.entries[Math.floor(Math.random() * subFeatureData.entries.length)];
            const subFeatureValue = randomSubFeatureEntry?.value || "No details available";

              // Append the sub-feature category and value
              results.push(`${subFeatureKey}: ${subFeatureValue}`);
          }
      }

      console.log("Appended Crevice Data:", results);
  } catch (error) {
      console.error("Error loading Crevice-specific data:", error);
      results.push("No data available for Crevice.");
  }
}
      //end Mapping.js Data

  // Add condition-based data
  if (conditionEntries) {
    const randomConditions = this.randomizeConditionData(conditionEntries);
    results.push(
        `Condition: ${randomConditions.condition}`,
        `Covered By: ${randomConditions.coveredBy}`,
        `State: ${randomConditions.state}`,
        `Keeper: ${randomConditions.keeper}`
    );
}

// Finalize feature details
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

  // Preload Lair Features
  if (!this.data.lairFeatures.length) {
    this.data.lairFeatures = await loadLairFeatures();
    this.data.featureOptions = [...this.data.lairFeatures];
  }

  // Load Treasure Options from categorizeItems
  if (!Object.keys(this.data.lairTreasureOptions).length) {
    const treasureData = categorizeItems();
    if (treasureData) {
      this.data.lairTreasureOptions = treasureData;
    } else {
      console.warn("No items available for treasure options.");
      this.data.lairTreasureOptions = {
        armor: [],
        weapons: [],
        potions: [],
        scrolls: [],
        magicItems: [],
        magicWeapons: [],
        gems: [],
        magicArmor: [],
        art: [],
        spells: [],
      };
    }
  }

  console.log("Final Data Sent to HBS:", this.data);
  return { ...this.data }; // Pass ALL data to the HBS template
}




  
/**
 * !!!!----------------------------------------------!!!!
 * !!!!-----------------LISTENERS--------------------!!!!
 * !!!!----------------------------------------------!!!!
 */
activateListeners(html) {
  super.activateListeners(html);


  // Restore the active tab from ViewState
  const activeTab = viewState.getActiveTab();

  // Initialize tab navigation
  html.find(".tabs .item").removeClass("active"); // Ensure all tabs are inactive
  html.find(`.tabs .item[data-tab="${activeTab}"]`).addClass("active"); // Activate the saved tab

  // Initialize tab content visibility
  html.find(".tab-content").hide(); // Hide all tab contents
  html.find(`.tab-content[data-tab="${activeTab}"]`).show(); // Show the saved tab's content

  // Tabs - Add click listener for switching tabs
  html.find(".tabs .item").click((event) => {
    const tab = event.currentTarget.dataset.tab;

    if (!tab) {
      console.error("Tab data attribute is missing on clicked element:", event.currentTarget);
      return; // Stop execution if no valid tab is found
    }

    // Update the ViewState with the selected tab
    viewState.setActiveTab(tab);

    // Update UI to show only the active tab's content
    html.find(".tabs .item").removeClass("active"); // Deactivate all tabs
    $(event.currentTarget).addClass("active"); // Activate the clicked tab

    html.find(".tab-content").hide(); // Hide all tab contents
    html.find(`[data-tab="${tab}"]`).show(); // Show the content of the active tab
  });

  // Attach handlers for individual tabs
  handleActorsTab(this, html);
  handleLairsTab(this, html);
  handleMagicItemsTab(this, html);
  handleDynamicLocationTab(this, html);
  handleStoryTab(this, html);
  handleTreasureTab(this, html);

  // Main Drop Down Listeners
  html.find(".population-density-select").change(this._onPopulationDensityChange.bind(this));
  html.find(".climate-select").change(this._onClimateTypeChange.bind(this));
  html.find(".terrain-select").change(this._onTerrainTypeChange.bind(this));
  html.find(".feature-type-select").change(this._onFeatureTypeChange.bind(this));
  html.find(".sub-feature-type-select").change(this._onSubFeatureTypeChange.bind(this));
  html.find(".sub-feature-type-select").change(async () => {
    await this.updateFeatureDetails();
  });
  

  // Lair Drop Down Listeners
  html.find(".features-select").each((index, dropdown) => {
    const dropdownElement = $(dropdown);
    const room = this.data.lairRooms[index]; // Get the corresponding room
    const selectedFeature = room.features[0]; // Get the saved feature for the room
  
    dropdownElement.empty(); // Clear existing options
    this.data.featureOptions.forEach((feature) => {
      const option = new Option(feature, feature);
      if (feature === selectedFeature) {
        option.selected = true; // Mark the saved feature as selected
      }
      dropdownElement.append(option); // Add the option
    });
  
    console.log(`Dropdown ${index} updated with selected feature:`, selectedFeature);
  });

// Synchronize text fields for each room
html.find(".room-entry").each((index, room) => {
  const roomData = this.data.lairRooms[index];

  // Description Field
  const descriptionField = $(room).find(".lair-room-description");
  descriptionField.val(roomData.lairRoomDescription); // Set the value
  descriptionField.off("input").on("input", (event) => {
    roomData.lairRoomDescription = event.target.value;
    console.log(`Updated Room ${index} Description:`, roomData.lairRoomDescription);
  });

  // Notes Field
  const notesField = $(room).find(".lair-room-notes");
  notesField.val(roomData.lairRoomNotes); // Set the value
  notesField.off("input").on("input", (event) => {
    roomData.lairRoomNotes = event.target.value;
    console.log(`Updated Room ${index} Notes:`, roomData.lairRoomNotes);
  });

  // Secrets Field
  const secretsField = $(room).find(".lair-room-secrets");
  secretsField.val(roomData.lairRoomSecrets); // Set the value
  secretsField.off("input").on("input", (event) => {
    roomData.lairRoomSecrets = event.target.value;
    console.log(`Updated Room ${index} Secrets:`, roomData.lairRoomSecrets);
  });
});

  

  // Random Generator Listeners
  html.find(".randomize-feature-details").click(async () => {
    await this.updateFeatureDetails();
  });

  // Button Listeners
  html.find(".terrain-roll").click(() => this._rollTerrainType());
  html.find(".feature-type-roll").click(() => this._rollFeatureType());
  html.find(".encounter-roll").click(() => this._rollEncounter());
  html.find(".save-entry").click(this._onSave.bind(this));
  html.find(".create-journal").click(() => this.createJournalEntry());

  // Remove .add-room listener here
  html.find(".add-treasure").click(() => console.log("Add Treasure placeholder."));
  html.find(".add-magic-item").click(() => console.log("Add Magic Item placeholder."));
  html.find(".add-story").click(() => console.log("Add Story placeholder."));
  html.find(".add-actor").click(() => console.log("Add Actor placeholder."));

  html.find(".room-entry").each((roomIndex, room) => {
    const roomData = this.data.lairRooms[roomIndex];
  
  
  
  

   // --------------------------------- \\
  // ---------- Lair Encounter --------- \\
 // ------------------------------------- \\
// Add Encounter Button
$(room).find(".add-encounter").off("click").on("click", () => {
  // Add a new, empty encounter with default placeholder
  roomData.encounters.push({ result: "", appearing: "" });

  // Re-render the UI to update the dropdown
  this.render(false);
});

// Update Encounter Dropdowns
$(room).find(".encounters-select").each((encounterIndex, dropdown) => {
  const encounterData = roomData.encounters[encounterIndex];
  const selectedValue = encounterData.result || ""; // Current selected value or default empty string

  // Populate dropdown options dynamically
  $(dropdown).empty(); // Clear existing options
  $(dropdown).append(new Option("Select an NPC", "", !selectedValue, !selectedValue)); // Add default option

  this.data.encounterOptions.forEach((option) => {
    const isSelected = option === selectedValue;
    const optionElement = new Option(option, option, isSelected, isSelected);
    $(dropdown).append(optionElement);
  });

  // Handle dropdown selection
  $(dropdown).off("change").on("change", (event) => {
    const selectedResult = $(event.target).val(); // Get the selected actor name
    const actorData = this.data.encounterData.find(actor => actor.name === selectedResult); // Find the actor

    if (actorData) {
      encounterData.result = actorData.name; // Update result
      encounterData.appearing = parseDiceExpression(actorData.numberAppearing || "1"); // Parse "No. Appearing"

      // Generate the stat block
      encounterData.statblock = `
        ${encounterData.appearing} x ${actorData.name};
        (STR ${actorData.str}, DEX ${actorData.dex}, CON ${actorData.con}, INT ${actorData.int}, WIS ${actorData.wis}, CHA ${actorData.cha});
        HD ${actorData.hitdice}; THAC0 ${actorData.thac0}; #ATT ${actorData.numAttacks}; DMG ${actorData.damage};
        SA ${actorData.specialAttacks}; SD ${actorData.specialDefenses}; MR ${actorData.magicResist}; 
        MV ${actorData.movement}; SZ ${actorData.size}; AL ${actorData.alignment}; 
        xps ${actorData.xp}; Treasure ${actorData.treasureType}
      `.replace(/\s+/g, " "); // Clean up whitespace

      console.log(`Room ${roomIndex} Encounter ${encounterIndex} Updated Statblock:`, encounterData.statblock);
      this.render(false); // Update UI
    } else {
      console.error(`Actor not found for: ${selectedResult}`);
    }
  });
});



// Randomize Encounter
$(room).find(".randomize-encounter").off("click").on("click", (event) => {
  const dropdown = $(event.currentTarget).closest("tr").find(".encounters-select");
  const randomActor = this.data.encounterOptions[Math.floor(Math.random() * this.data.encounterOptions.length)];

  if (randomActor) {
    dropdown.val(randomActor).trigger("change"); // Update dropdown and trigger change event
    console.log(`Randomized Actor: ${randomActor}`);
  } else {
    console.error("No actors available to randomize.");
  }
});


// Remove Encounter
$(room).find(".remove-encounter").off("click").on("click", (event) => {
  const encounterIndex = $(event.currentTarget).closest("tr").index();
  roomData.encounters.splice(encounterIndex, 1);
  this.render(false);
});
  });
  

   // --------------------------------- \\
  // ---------- Lair Treasure ---------- \\
 // ------------------------------------- \\
 html.find(".room-entry").each((roomIndex, room) => {
  const roomData = this.data.lairRooms[roomIndex];

  // Ensure roomData.treasure is initialized
  if (!Array.isArray(roomData.treasure)) {
    roomData.treasure = [];
  }

  // Add Treasure
  $(room).find(".add-treasure").off("click").on("click", () => {
    roomData.treasure.push({ selectedCategory: "", result: "", quantity: 1, cost: 0, currencyType: "gp", xpValue: 0 });
    this.render(false);
  });

  // Update Treasure Category
  $(room).find(".treasure-category-select").each((treasureIndex, categoryDropdown) => {
    const treasureData = roomData.treasure[treasureIndex];
    const selectedCategory = treasureData.selectedCategory || "";

    $(categoryDropdown)
      .empty()
      .append(`<option value="" disabled ${!selectedCategory ? "selected" : ""}>Make selection</option>`);

    Object.keys(this.data.lairTreasureOptions)
      .filter((category) => category !== "spells") // Exclude the "spells" category
      .forEach((category) => {
        const isSelected = category === selectedCategory;
        const optionElement = new Option(category, category, isSelected, isSelected);
        $(categoryDropdown).append(optionElement);
      });

    // Handle category selection
    $(categoryDropdown).off("change").on("change", (event) => {
      const selectedCategory = $(event.target).val();
      treasureData.selectedCategory = selectedCategory;
      treasureData.result = "";
      treasureData.quantity = 1;
      treasureData.cost = 0;
      treasureData.currencyType = "gp";
      treasureData.xpValue = 0;
      this.render(false);
    });
  });

  // Update Treasure Item
  $(room).find(".treasure-item-select").each((treasureIndex, itemDropdown) => {
    const treasureData = roomData.treasure[treasureIndex];
    const selectedItem = treasureData.result || "";
    const selectedCategory = treasureData.selectedCategory;

    $(itemDropdown)
      .empty()
      .append(`<option value="" disabled ${!selectedItem ? "selected" : ""}>Make selection</option>`);

    if (selectedCategory && this.data.lairTreasureOptions[selectedCategory]) {
      this.data.lairTreasureOptions[selectedCategory].forEach((item) => {
        const isSelected = item.id === selectedItem;
        const optionElement = new Option(item.name, item.id, isSelected, isSelected);
        $(itemDropdown).append(optionElement);
      });
    }

    // Handle item selection
    $(itemDropdown).off("change").on("change", (event) => {
      const selectedId = $(event.target).val();
      const itemData = this.data.lairTreasureOptions[selectedCategory]?.find(item => item.id === selectedId);

      if (itemData) {
        treasureData.result = itemData.id;
        treasureData.quantity = itemData.quantity || 1;
        treasureData.cost = itemData.cost || 0;
        treasureData.currencyType = itemData.currencyType || "gp";
        treasureData.xpValue = itemData.xpValue || 0;

        // Update the treasure details in the UI
        const treasureDetailsContainer = $(room).find(`.treasure-details[data-treasure-index="${treasureIndex}"]`);
        treasureDetailsContainer.html(`
          ${treasureData.quantity} x ${itemData.name}; ${treasureData.cost} ${treasureData.currencyType}; ${treasureData.xpValue} xps
        `);
      }
    });

    // If there's already a selected item, update its details on load
    if (selectedItem) {
      const itemData = this.data.lairTreasureOptions[selectedCategory]?.find(item => item.id === selectedItem);
      if (itemData) {
        const treasureDetailsContainer = $(room).find(`.treasure-details[data-treasure-index="${treasureIndex}"]`);
        treasureDetailsContainer.html(`
          ${treasureData.quantity} x ${itemData.name}; ${treasureData.cost} ${treasureData.currencyType}; ${treasureData.xpValue} xps
        `);
      }
    }
  });

  // Randomize Treasure
  $(room).find(".randomize-treasure").off("click").on("click", (event) => {
    const treasureIndex = $(event.currentTarget).closest("tr").index();
    const treasureData = roomData.treasure[treasureIndex];

    // Step 1: Randomly select a category (excluding "spells")
    const categories = Object.keys(this.data.lairTreasureOptions).filter(
      (category) => category !== "spells" && this.data.lairTreasureOptions[category]?.length > 0
    );
    if (categories.length === 0) {
      console.warn("No valid treasure categories available for randomization.");
      return;
    }

    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    treasureData.selectedCategory = randomCategory;

    // Step 2: Randomly select an item from the chosen category
    const items = this.data.lairTreasureOptions[randomCategory];
    const randomItem = items[Math.floor(Math.random() * items.length)];

    if (!randomItem) {
      console.warn(`No items available in category: ${randomCategory}`);
      return;
    }

    treasureData.result = randomItem.id;
    treasureData.quantity = randomItem.quantity || 1;
    treasureData.cost = randomItem.cost || 0;
    treasureData.currencyType = randomItem.currencyType || "gp";
    treasureData.xpValue = randomItem.xpValue || 0;

    // Step 3: Update the category dropdown
    const categoryDropdown = $(room).find(`.treasure-category-select[data-treasure-index="${treasureIndex}"]`);
    categoryDropdown.val(randomCategory);

    // Step 4: Update the item dropdown
    const itemDropdown = $(room).find(`.treasure-item-select[data-treasure-index="${treasureIndex}"]`);
    itemDropdown.empty(); // Clear existing options
    items.forEach((item) => {
      const optionElement = new Option(item.name, item.id, item.id === treasureData.result, item.id === treasureData.result);
      itemDropdown.append(optionElement);
    });
    itemDropdown.val(treasureData.result); // Set to the randomly selected item

    // Step 5: Render the treasure details
    const treasureDetailsContainer = $(room).find(`.treasure-details[data-treasure-index="${treasureIndex}"]`);
    treasureDetailsContainer.html(`
      ${treasureData.quantity} x ${randomItem.name}; ${treasureData.cost} ${treasureData.currencyType}; ${treasureData.xpValue} xps
    `);

    console.log(`Randomized Treasure:`, treasureData);
    this.render(false); // Rerender to ensure UI consistency
  });

  // Remove Treasure
  $(room).find(".remove-treasure").off("click").on("click", (event) => {
    const treasureIndex = $(event.currentTarget).closest("tr").index();
    roomData.treasure.splice(treasureIndex, 1);
    this.render(false);
  });
});










  


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

  // Ensure a climate type is selected
  const selectedClimate = this.data.climateType;
  if (!selectedClimate) {
    ui.notifications.warn("Please select a climate type before rolling for terrain.");
    return;
  }

  // Ensure terrain type options are available
  if (!this.data.terrainTypeOptions.length) {
    ui.notifications.warn("No terrain types available for the selected climate.");
    return;
  }

  // Filter valid terrain options (exclude empty selection placeholders)
  const validTerrains = this.data.terrainTypeOptions.filter(option => option.value);

  if (!validTerrains.length) {
    ui.notifications.warn("No valid terrain options available to roll.");
    return;
  }

  // Select a random terrain
  const randomTerrain = validTerrains[Math.floor(Math.random() * validTerrains.length)];
  console.log("Randomly Selected Terrain:", randomTerrain);

  // Update form data with selected terrain
  this.data.terrainType = randomTerrain.value;
  this.data.ruggedness = randomTerrain.ruggedness;
  this.data.travelTime = randomTerrain.time;
  this.data.encounterFrequency = randomTerrain.encounters?.join(", ") || "";

  // Log the updated terrain data for debugging
  console.log("Updated Terrain Data:", {
    terrainType: this.data.terrainType,
    ruggedness: this.data.ruggedness,
    travelTime: this.data.travelTime,
    encounterFrequency: this.data.encounterFrequency,
  });

  // Re-render the form to update the UI
  this.render(false);
}

  
async _rollFeatureType() {
  console.log("Rolling for Feature Type...");

  const { populationDensity } = this.data;

  // Ensure Population Density is selected
  if (!populationDensity) {
    ui.notifications.warn("Please select Population Density before rolling for features.");
    return;
  }

  // Load Feature Types for the selected Population Density
  const featureFile = densityFeatureMap[populationDensity];
  if (!featureFile) {
    ui.notifications.warn("No feature types available for the selected population density.");
    return;
  }

  try {
    // Fetch and filter feature data
    const response = await fetch(`modules/world-builder/${featureFile}`);
    if (!response.ok) throw new Error(`Failed to load feature file: ${response.statusText}`);
    const featureData = await response.json();

    // Ensure there are valid feature entries
    const validFeatures = featureData.entries;
    if (!validFeatures.length) {
      ui.notifications.warn("No valid feature types available.");
      return;
    }

    // Randomly select a feature type
    const randomFeature = validFeatures[Math.floor(Math.random() * validFeatures.length)];
    console.log("Randomly Selected Feature Type:", randomFeature);

    // Update the Feature Type
    this.data.featureType = randomFeature.value;

    // Load Sub-Feature Types for the selected Feature Type
    await this.loadSubFeatureType();

    // Randomly select a Sub-Feature Type if options are available
    if (this.data.subFeatureTypeOptions.length > 1) {
      const validSubFeatures = this.data.subFeatureTypeOptions.filter(option => option.value);
      const randomSubFeature = validSubFeatures[Math.floor(Math.random() * validSubFeatures.length)];
      this.data.subFeatureType = randomSubFeature.value;

      console.log("Randomly Selected Sub-Feature Type:", randomSubFeature);
    } else {
      this.data.subFeatureType = "";
      console.warn("No valid sub-feature types available.");
    }

    // Call updateFeatureDetails to activate all associated logic
    await this.updateFeatureDetails();

    // Log the updated feature data
    console.log("Updated Feature Data:", {
      featureType: this.data.featureType,
      subFeatureType: this.data.subFeatureType,
      featureDetails: this.data.featureDetails,
    });

    // Re-render the form to update the UI
    this.render(false);
  } catch (error) {
    console.error("Error rolling feature or sub-feature types:", error);
  }
}

/**
 * !!!!----------------------------------------------!!!!
 * !!!!---------------LAIR EVENTS--------------------!!!!
 * !!!!----------------------------------------------!!!!
 */

    async _onFeatureSelectChange(event) {
      const selectedValue = event.target.value;
      if (!selectedValue) return;
    
      console.log("Feature selected:", selectedValue);
    
      // Update the features in the data
      const index = $(event.currentTarget).closest(".room-entry").index();
      if (this.data.lairRooms[index]) {
        this.data.lairRooms[index].features = [selectedValue];
        console.log(`Updated features for room ${index}:`, this.data.lairRooms[index].features);
      }
      
      this.render(false);
    }
    
    async _onSubFeatureTypeChange(event) {
      const selectedSubFeatureType = event.target.value;
    
      this.data.subFeatureType = selectedSubFeatureType;
      this.data.isCave = selectedSubFeatureType === "Cave";
      this.data.isDungeon = selectedSubFeatureType === "Dungeon";
    
      await this.loadEncounterOptions(); // Load the appropriate encounter options
      this.render(false);
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
  