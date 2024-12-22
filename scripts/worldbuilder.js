class POIBuilderWindow extends Application {
  constructor(options = {}) {
    super(options);
    
    this.data = {
        populationDensity: "Wilderness",
        climateType: "Temperate", // Added climate type
        terrainType: "",
        ruggedness: "",
        travelTime: "",
        encounterFrequency: "",
        featureType: "",
        selectedFeatureType: "",
        selectedSubFeature: "",
        encounterResult: "",  // Added encounter result state
        isDungeon: false,
        isCave: false,
        dungeonFeatures: [],
        caveFeatures: [],
        dungeonType: "",
        dungeonEncounter: "",
        passageSize: "",
        firstDungeonFeature: "",
        caveType: "",
        caveEncounter: "",
        cavePassageSize: "",
        firstCaveFeature: ""
    };
}

resetData() {
  this.data = {
    populationDensity: "Wilderness",
    climateType: "Temperate",
    terrainType: "",
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
    dungeonType: "",
    dungeonEncounter: "",
    passageSize: "",
    firstDungeonFeature: "",
    caveType: "",
    caveEncounter: "",
    cavePassageSize: "",
    firstCaveFeature: ""
  };
}

async createJournalEntry() {
  try {
    const journalData = {
      name: `${this.data.populationDensity} - ${this.data.climateType} - ${this.data.terrainType}`,
      folder: null,
      type: "journal",
      ownership: {
        default: foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER
      }
    };
    
    /**
     * Safely retrieve the 'execute' function from a dynamically imported module.
     * This handles both named exports and default exports.
     */
    async function getExecuteFunction(module) {
      if (typeof module.execute === "function") {
          return module.execute;
      } else if (module.default && typeof module.default.execute === "function") {
          return module.default.execute;
      } else if (typeof module.default === "function") {
          return module.default;
      }
      throw new Error("No valid 'execute' function found in the module.");
    }


    const journalEntry = await JournalEntry.create(journalData, { renderSheet: false });

    let content = `
      <h2>${this.data.featureType} Details</h2>
      <p><strong>Population Density:</strong> ${this.data.populationDensity}</p>
      <p><strong>Climate Type:</strong> ${this.data.climateType}</p>
      <p><strong>Terrain Type:</strong> ${this.data.terrainType}</p>
      <p><strong>Ruggedness:</strong> ${this.data.ruggedness}</p>
      <p><strong>Travel Time:</strong> ${this.data.travelTime}</p>
      <p><strong>Encounter Frequency:</strong> ${this.data.encounterFrequency}</p>
      <p><strong>Feature Type:</strong> ${this.data.featureType}</p>
      <p> ${this.data.encounterResult}</p>
      <p><strong>Feature Details:</strong> ${this.data.featureDetails}</p>
    `;

    if (this.data.isDungeon) {
      content += `
        <h3>Additional Dungeon Features</h3>
        <ul>
          ${this.data.dungeonFeatures.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      `;
    }
    

    if (this.data.isCave) {
      content += `
        <h3>Additional Cave Features</h3>
        <ul>
          ${this.data.caveFeatures.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      `;
    }
    

    const pageData = {
      name: this.data.featureType,
      type: "text",
      text: {
        content: content
      }
    };

    await journalEntry.createEmbeddedDocuments("JournalEntryPage", [pageData]);
    ui.notifications.info("Journal Entry with Pages Created Successfully.");
  } catch (error) {
    console.error("Failed to create Journal Entry: ", error);
    ui.notifications.error("Error creating Journal Entry. Check console for details.");
  }
}



  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "Hexcrawl Terrain Selector",
      width: 700,
      height: "auto",
      resizable: true,
      template: "modules/world-builder/templates/worldbuilder.hbs",
      classes: ["worldbuilder", "sheet", "journal-sheet"]
    });
  }

  getData() {
    const subFeatures = this._getSubFeatureOptions(this.data.selectedFeatureType);
    return {
      ...this.data,
      populationDensity: this.data.populationDensity || "Wilderness",
      climateType: this.data.climateType || "Temperate",
      terrainType: this.data.terrainType || "",
      featureType: this.data.featureType || "",
      selectedFeatureType: this.data.selectedFeatureType || "",
      selectedSubFeature: this.data.selectedSubFeature || "",
      featureDetails: this.data.featureDetails || "",
      subFeatureOptions: subFeatures || [],
      encounterResult: this.data.encounterResult || ""
    };
  }
  
  
  async _executeSubFeature(event) {
    const selectedSubFeature = event.target.value;
    this.data.selectedSubFeature = selectedSubFeature;

    this.data.isDungeon = false;
    this.data.isCave = false;

    if (selectedSubFeature === "Dungeon") {
        this.data.isDungeon = true;
    } else if (selectedSubFeature === "Cave") {
        this.data.isCave = true;
    }

    try {
        const executeFunction = `execute${selectedSubFeature}`;
        if (typeof window[executeFunction] === "function") {
            await window[executeFunction]();
            this.data.featureDetails = game.recentEncounterResult || `Executed roll for ${selectedSubFeature}`;
        } else {
            throw new Error(`No valid execute function found for sub-feature script: ${selectedSubFeature}`);
        }
    } catch (error) {
        console.error(`Failed to load or execute script for ${selectedSubFeature}:`, error);
        ui.notifications.error(`Error executing roll for ${selectedSubFeature}. Check console for details.`);
        this.data.featureDetails = `Error executing roll for ${selectedSubFeature}`;
    }

    this.render(false);
}



  

    activateListeners(html) {
      super.activateListeners(html);
  
      // Dropdown Listeners
      html.find(".feature-type-select").change(this._onFeatureTypeChange.bind(this));
      html.find(".sub-feature-select").change(this._executeSubFeature.bind(this));
      html.find(".terrain-select").change(this._onTerrainTypeChange.bind(this));

      // Existing Button Listeners (Do not alter these)
      html.find(".terrain-roll").click(() => this._rollTerrainType());
      html.find(".feature-type-roll").click(() => this._rollFeatureType());
      html.find(".encounter-roll").click(() => this._rollEncounter());
      html.find(".append-dungeon-feature").click(() => this._appendDungeonFeature());
      html.find(".append-cave-feature").click(() => this._appendCaveFeature());
      html.find(".save-entry").click(this._onSave.bind(this));
      html.find(".create-journal").click(() => this.createJournalEntry());
    }
  
    async _onFeatureTypeChange(event) {
      const selectedFeatureType = event.target.value;
    
      // Log the initial state before any changes
      console.log("DEBUG: Before updating - Current Data:", JSON.stringify(this.data));
    
      // Update internal data state
      this.data.selectedFeatureType = selectedFeatureType;
      this.data.featureType = selectedFeatureType;
      this.data.featureDetails = selectedFeatureType
        ? `Details for the selected feature type: ${selectedFeatureType}`
        : "No feature type selected.";
    
      // Log the updated data state
      console.log("DEBUG: After updating data - New Data:", JSON.stringify(this.data));
    
      // Manually update the DOM elements without re-rendering
      const featureTypeElement = document.querySelector(".feature-info-table td:first-child");
      const featureDetailsElement = document.querySelector(".feature-info-table td:last-child");
    
      if (featureTypeElement && featureDetailsElement) {
        console.log("DEBUG: Updating DOM elements directly.");
        featureTypeElement.textContent = this.data.featureType || "No Feature Selected";
        featureDetailsElement.innerHTML = this.data.featureDetails || "No details available.";
      } else {
        console.log("DEBUG: Feature info table elements not found in the DOM.");
      }
    
      // Log completion
      console.log("DEBUG: Completed _onFeatureTypeChange without re-rendering.");
    }
    
    
    
    
    
    
    
    _populateSubFeatureDropdown(featureType) {
      const options = this._getSubFeatureOptions(featureType);
      const subFeatureSelect = document.querySelector(".sub-feature-select");
    
      // Clear existing options and populate new ones
      subFeatureSelect.innerHTML = '<option value="">-- Select Sub-Feature --</option>';
      options.forEach(option => {
        const selected = option === this.data.selectedSubFeature ? 'selected' : '';
        subFeatureSelect.insertAdjacentHTML('beforeend', `<option value="${option}" ${selected}>${option}</option>`);
      });
    
      // Enable the dropdown if options are available
      subFeatureSelect.disabled = options.length === 0;
    }
    
    

    async _onSubFeatureChange(event) {
      const selectedSubFeature = event.target.value;
      this.data.selectedSubFeature = selectedSubFeature;
  
      // Reset flags before setting new ones
      this.data.isDungeon = false;
      this.data.isCave = false;
  
      // Set the flags based on the selected sub-feature
      if (selectedSubFeature === "Dungeon") {
          this.data.isDungeon = true;
      } else if (selectedSubFeature === "Cave") {
          this.data.isCave = true;
      }
  
      // Re-render the form to show the Cave or Dungeon feature buttons if applicable
      this.render(false);  
    
      const subFeatureRolls = {
        "Ruins": "ruins.js",
        "Relics": "relics.js",
        "Remains": "remains.js",
        "Vestiges": "vestiges.js",
        "Remnants": "remnants.js",
        "Refuse": "refuse.js",
        "Wrecks": "wrecks.js",
        "Skeletons": "skeletons.js",
        "Antiques": "antiques.js",
        "Artifacts": "artifacts.js",
        "Dungeon": "dungeon.js",
        "Cave": "cave.js",
        "Burrows": "burrows.js",
        "Camp": "camp.js",
        "Dwelling": "dwelling.js",
        "Shipwreck": "shipwreck.js",
        "Ledge": "ledge.js",
        "Crevice": "crevice.js"
      };
    
      // Set the flags based on the selected sub-feature
      if (selectedSubFeature === "Dungeon") {
        this.data.isDungeon = true;
        this.data.dungeonType = "Dungeon Type";
        this.data.dungeonEncounter = "Dungeon Encounter";
        this.data.passageSize = "Passage Size";
        this.data.firstDungeonFeature = "First Dungeon Feature";
      } else if (selectedSubFeature === "Cave") {
        this.data.isCave = true;
        this.data.caveType = "Cave Type";
        this.data.caveEncounter = "Cave Encounter";
        this.data.cavePassageSize = "Cave Passage Size";
        this.data.firstCaveFeature = "First Cave Feature";
      }
    
      const scriptFile = subFeatureRolls[selectedSubFeature];
      if (!scriptFile) {
        ui.notifications.warn(`No roll script found for sub-feature: ${selectedSubFeature}`);
        this.data.featureDetails = `No roll script for ${selectedSubFeature}`;
        return;
      }
    
      try {
        // Dynamically import the roll script and execute it
        const module = await import(`./${scriptFile}`);
        if (module && typeof module.execute === "function") {
          await module.execute();
          this.data.featureDetails = game.recentEncounterResult || `Executed roll for ${selectedSubFeature}`;
        } else {
          throw new Error(`No valid execute function in ${scriptFile}`);
        }
      } catch (error) {
        console.error(`Failed to load or execute script: ${scriptFile}`, error);
        ui.notifications.error(`Error executing roll for ${selectedSubFeature}. Check console for details.`);
        this.data.featureDetails = `Error executing roll for ${selectedSubFeature}`;
      }
    
      // Render the form to update the details and show the buttons
      this.render(false);
    }
    
    
    
    
    
    _getSubFeatureOptions(featureType) {
      const subFeatures = {
        "Ruins & Relics": ["Crevice", "Ruins", "Relics", "Remains", "Vestiges", "Artifacts"],
        "Lurid Lairs": ["Dungeon", "Cave", "Burrows", "Camp", "Shipwreck"],
        "Rivers & Roads / Islands": ["Bridge", "Ford", "Island", "Causeway"],
        "Castles & Citadels": ["Fortress", "Keep", "Watchtower", "Outpost"],
        "Temples & Shrines": ["Temple", "Shrine", "Altar", "Monastery"],
        "Villages & Towns": ["Village", "Town", "Hamlet", "Outpost"]
      };
      return subFeatures[featureType] || [];
    }
  
    


  
    _resetSubFeatureDropdown() {
      const subFeatureSelect = document.querySelector(".sub-feature-select");
      subFeatureSelect.innerHTML = '<option value="">-- Select Sub-Feature --</option>';
      subFeatureSelect.disabled = true;
      this.data.selectedSubFeature = "";
    }
  
    _onTerrainTypeChange(event) {
      const selectedTerrainType = event.target.value;
      this.data.terrainType = selectedTerrainType;
    
      // Update the terrain details based on the selected terrain type
      this._setTerrainType(selectedTerrainType);
    
      // Render the form to reflect the changes without affecting button states
      this.render(false);
    }
    
  
  async _rollTerrainType() {
    const terrainTable = [
      { type: "Plains", ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      { type: "Forest", ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      { type: "Hills", ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      { type: "Mountains", ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      { type: "Marsh", ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      { type: "Water", ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2] },
      { type: "Salt Water", ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2] },
      { type: "Road", ruggedness: "Easy", time: "2 Hours", encounters: [1] },
      { type: "River Downstream", ruggedness: "Easy", time: "1 Hour", encounters: [1, 2] },
      { type: "River Upstream", ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2] },
      { type: "Desert", ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      { type: "Thickets", ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      { type: "Savannah", ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      { type: "Dunes", ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      { type: "Rainforest", ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      { type: "Swamp", ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      { type: "Jungle", ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      { type: "Tundra", ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      { type: "Steppe", ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      { type: "Subterranean", ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      { type: "Glacier", ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] }
    ];

    const rollResult = Math.floor(Math.random() * terrainTable.length);
    const selectedTerrain = terrainTable[rollResult];

    if (selectedTerrain) {
      this._setTerrainType(selectedTerrain.type);
    }
  }

  _setTerrainType(type) {
    const terrainData = {
      "Plains": { ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      "Forest": { ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      "Hills": { ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      "Mountains": { ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      "Marsh": { ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      "Water": { ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2] },
      "Salt Water": { ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2] },
      "Road": { ruggedness: "Easy", time: "2 Hours", encounters: [1] },
      "River Downstream": { ruggedness: "Easy", time: "1 Hour", encounters: [1, 2] },
      "River Upstream": { ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2] },
      "Desert": { ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      "Thickets": { ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      "Savannah": { ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      "Dunes": { ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      "Rainforest": { ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      "Swamp": { ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      "Jungle": { ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      "Tundra": { ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      "Steppe": { ruggedness: "Moderate", time: "3 Hours", encounters: [1, 2] },
      "Subterranean": { ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] },
      "Glacier": { ruggedness: "Difficult", time: "4 Hours", encounters: [1, 2, 3] }
    };

    const selectedData = terrainData[type];
    if (selectedData) {
      this.data.terrainType = type;
      this.data.ruggedness = selectedData.ruggedness;
      this.data.travelTime = selectedData.time;
      this.data.encounterFrequency = selectedData.encounters.join(", ");
    } else {
      ui.notifications.warn("Invalid Terrain Type Selected");
    }
    this.render();
  }

  async _rollEncounter() {
    const { climateType, terrainType } = this.data;

    if (!climateType || !terrainType) {
        ui.notifications.warn("Please select both a climate and terrain type before rolling for an encounter.");
        return;
    }

    try {
        // Dynamically load the relevant encounter module based on climate and terrain type
        let encounterModule;

        // Desert Terrains
        if (terrainType === "Desert") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-desert-cold.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-desert-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-desert-warm.js");
          }
        }

        // Dunes Terrains
        if (terrainType === "Dunes") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-desert-cold.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-desert-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-desert-warm.js");
          }
        }

        // Forest Terrains
        if (terrainType === "Forest") {
            if (climateType === "Cold") {
                encounterModule = await import("./encounter-forest-cold.js");
            } else if (climateType === "Temperate") {
                encounterModule = await import("./encounter-forest-temperate.js");
            } else if (climateType === "Warm") {
                encounterModule = await import("./encounter-forest-warm.js");
            }
        }

        // Jungle Terrains
        if (terrainType === "Jungle") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-forest-warm.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-forest-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-forest-warm.js");
          }
      }

        // Thickets Terrains
        if (terrainType === "Thickets") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-forest-cold.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-forest-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-forest-warm.js");
          }
      }

        // Rainforest Terrains
        if (terrainType === "Rainforest") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-forest-warm.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-forest-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-forest-warm.js");
          }
      }

        // Hills Terrains
        if (terrainType === "Hills") {
            if (climateType === "Cold") {
                encounterModule = await import("./encounter-hills-cold.js");
            } else if (climateType === "Temperate") {
                encounterModule = await import("./encounter-hills-temperate.js");
            } else if (climateType === "Warm") {
                encounterModule = await import("./encounter-hills-warm.js");
            }
        }

        // Mountains Terrains
        if (terrainType === "Mountains") {
            if (climateType === "Cold") {
                encounterModule = await import("./encounter-mountains-cold.js");
            } else if (climateType === "Temperate") {
                encounterModule = await import("./encounter-mountains-temperate.js");
            } else if (climateType === "Warm") {
                encounterModule = await import("./encounter-mountains-warm.js");
            }
        }

        // Glacier Terrains
        if (terrainType === "Glacier") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-mountains-cold.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-mountains-cold.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-mountains-cold.js");
          }
      }

        // Plains Terrains
        if (terrainType === "Plains") {
            if (climateType === "Cold") {
                encounterModule = await import("./encounter-plains-cold.js");
            } else if (climateType === "Temperate") {
                encounterModule = await import("./encounter-plains-temperate.js");
            } else if (climateType === "Warm") {
                encounterModule = await import("./encounter-plains-warm.js");
            }
        }

        // Tundra Terrains
        if (terrainType === "Tundra") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-plains-cold.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-plains-cold.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-plains-cold.js");
          }
      }

        // Savannah Terrains
        if (terrainType === "Savannah") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-plains-temperate.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-plains-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-plains-temperate.js");
          }
      }

        // Steppe Terrains
        if (terrainType === "Steppe") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-plains-temperate.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-plains-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-plains-temperate.js");
          }
      }

        // Marsh Terrains
        if (terrainType === "Marsh") {
            if (climateType === "Cold") {
                encounterModule = await import("./encounter-swamp-cold.js");
            } else if (climateType === "Temperate") {
                encounterModule = await import("./encounter-swamp-temperate.js");
            } else if (climateType === "Warm") {
                encounterModule = await import("./encounter-swamp-warm.js");
            }
        }

        // Swamp Terrains
        if (terrainType === "Swamp") {
            if (climateType === "Cold") {
                encounterModule = await import("./encounter-swamp-cold.js");
            } else if (climateType === "Temperate") {
                encounterModule = await import("./encounter-swamp-temperate.js");
            } else if (climateType === "Warm") {
                encounterModule = await import("./encounter-swamp-warm.js");
            }
        }

        // Salt Water Terrains
        if (terrainType === "Salt Water") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-salt-water-cold.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-salt-water-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-salt-water-warm.js");
          }
      }

        // Fresh Water Terrains
        if (terrainType === "Water") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-fresh-water-cold.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-fresh-water-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-fresh-water-warm.js");
          }
      }

        // Fresh Water Downstream Terrains
        if (terrainType === "River Downstream") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-fresh-water-cold.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-fresh-water-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-fresh-water-warm.js");
          }
      }
        // Fresh Water Upstream Terrains
        if (terrainType === "River Upstream") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-fresh-water-cold.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-fresh-water-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-fresh-water-warm.js");
          }
      }

        // Subterranean
        if (terrainType === "Subterranean") {
          if (climateType === "Cold") {
              encounterModule = await import("./encounter-subterranean-cold.js");
          } else if (climateType === "Temperate") {
              encounterModule = await import("./encounter-subterranean-temperate.js");
          } else if (climateType === "Warm") {
              encounterModule = await import("./encounter-subterranean-warm.js");
          }
      }

        // Additional Terrains (River, Road, Glacier, etc.)
        // This section can be extended as new encounter scripts are created for each terrain/climate combination.

        if (encounterModule && typeof encounterModule.execute === "function") {
            await encounterModule.execute();
            this.data.encounterResult = game.recentEncounterResult || "Encounter executed!";
        } else {
            throw new Error(`No valid encounter module found for climate: ${climateType}, terrain: ${terrainType}`);
        }
    } catch (error) {
        console.error(`Failed to load or execute encounter script:`, error);
        ui.notifications.error(`Error loading or executing encounter. Check console for details.`);
    }

    this.render();
}

async _rollFeatureType() {
  this.data.isDungeon = false;
  this.data.isCave = false;
  this.data.dungeonFeatures = [];
  this.data.caveFeatures = [];
  this.data.dungeonType = "";
  this.data.dungeonEncounter = "";
  this.data.passageSize = "";
  this.data.firstDungeonFeature = "";
  this.data.caveType = "";
  this.data.caveEncounter = "";
  this.data.cavePassageSize = "";
  this.data.firstCaveFeature = "";

  let rollRange;

  switch (this.data.populationDensity) {
      case "Wilderness":
          rollRange = 4;
          break;
      case "Borderlands":
          rollRange = 8;
          break;
      case "Settled":
          rollRange = 12;
          break;
      default:
          rollRange = 12;
  }

  const rollResult = Math.floor(Math.random() * rollRange) + 1;
  const featureTypes = {
      1: "Ruins & Relics",
      2: "Ruins & Relics",
      3: "Lurid Lairs",
      4: "Lurid Lairs",
      5: "Rivers & Roads / Islands",
      6: "Rivers & Roads / Islands",
      7: "Castles & Citadels",
      8: "Castles & Citadels",
      9: "Temples & Shrines",
      10: "Temples & Shrines",
      11: "Villages & Towns",
      12: "Villages & Towns"
  };

  const selectedFeatureType = featureTypes[rollResult];
  const result = await this._rollSubFeature(selectedFeatureType);

  this.data.featureType = result;

  // Check for Dungeon or Cave feature type
  if (this.data.featureType.includes("Dungeon")) {
      this.data.isDungeon = true;
  } else if (this.data.featureType.includes("Cave")) {
      this.data.isCave = true;
  }

  this.render(false);
}



async _rollSubFeature(feature) {
  const subFeatures = {
      "Ruins & Relics": [
          { name: "Ruins", file: "ruins.js" },
          { name: "Relics", file: "relics.js" },
          { name: "Remains", file: "remains.js" },
          { name: "Vestiges", file: "vestiges.js" },
          { name: "Refuse", file: "refuse.js" },
          { name: "Wrecks", file: "wrecks.js" },
          { name: "Skeletons", file: "skeletons.js" },
          { name: "Antiques", file: "antiques.js" },
          { name: "Artifacts", file: "artifacts.js" }
      ],
      "Lurid Lairs": [
          { name: "Dungeon", file: "dungeon.js" },
          { name: "Cave", file: "cave.js" },
          { name: "Burrows", file: "burrows.js" },
          { name: "Camp", file: "camp.js" },
          { name: "Dwelling", file: "dwelling.js" },
          { name: "Shipwreck", file: "shipwreck.js" },
          { name: "Ledge", file: "ledge.js" },
          { name: "Crevice", file: "crevice.js" }
      ]
  };

  const subFeatureRoll = Math.floor(Math.random() * subFeatures[feature].length);
  const selectedSubFeature = subFeatures[feature][subFeatureRoll];
  this.data.selectedSubFeature = selectedSubFeature.name;

  try {
      // Use the same logic as the dropdown execution
      if (typeof window[`execute${selectedSubFeature.name}`] === "function") {
          await window[`execute${selectedSubFeature.name}`]();
          this.data.featureDetails = game.recentEncounterResult || `Executed roll for ${selectedSubFeature.name}`;
      } else {
          throw new Error(`No valid execute function found for sub-feature script: ${selectedSubFeature.name}`);
      }
  } catch (error) {
      console.error(`Failed to load or execute script for ${selectedSubFeature.name}:`, error);
      ui.notifications.error(`Error executing roll for ${selectedSubFeature.name}. Check console for details.`);
      this.data.featureDetails = `Error executing roll for ${selectedSubFeature.name}`;
  }

  // Set the flags based on the selected sub-feature
  if (selectedSubFeature.name === "Dungeon") {
      this.data.isDungeon = true;
      this.data.dungeonType = "Dungeon Type";
      this.data.dungeonEncounter = "Dungeon Encounter";
      this.data.passageSize = "Passage Size";
      this.data.firstDungeonFeature = "First Dungeon Feature";
  } else if (selectedSubFeature.name === "Cave") {
      this.data.isCave = true;
      this.data.caveType = "Cave Type";
      this.data.caveEncounter = "Cave Encounter";
      this.data.cavePassageSize = "Cave Passage Size";
      this.data.firstCaveFeature = "First Cave Feature";
  }

  // Render the form to update the details
  this.render(false);
  return `${feature}: ${selectedSubFeature.name}`;
}





  

async _appendDungeonFeature() {
  const dungeonFeaturesTable = [
      "Room (3x as large as passage dimensions)",
      "Stairs Down",
      "Continuing Passage (length)",
      "Four-way Intersection",
      "Passage ends",
      "Room (4x as large)",
      "Branch",
      "Passage turns corner",
      "Chamber (5x as large)",
      "Continuing Passage"
  ];

  const featureResult = dungeonFeaturesTable[Math.floor(Math.random() * dungeonFeaturesTable.length)];
  this.data.dungeonFeatures.push(featureResult);
  this.render();
}

async _appendCaveFeature() {
  const caveFeaturesTable = [
      "Continuing Tunnel", "Cavern", "Vault", "Pit", "Underground Stream",
      "Underground River", "Underground Lake", "Cross Another Tunnel", "Tunnel Ends"
  ];

  const featureResult = caveFeaturesTable[Math.floor(Math.random() * caveFeaturesTable.length)];
  this.data.caveFeatures.push(featureResult);
  this.render();
}


  _onSave(event) {
    event.preventDefault();
    console.log("Terrain Data Saved:", this.data);
  }
}

Hooks.once("init", () => {
  console.log("World Builder | Initializing...");
  Journal.registerSheet("worldbuilder", POIBuilderWindow, { makeDefault: false });
});

function openPOIBuilderWindow() {
  if (!window.poiBuilder) {
    window.poiBuilder = new POIBuilderWindow();
  }

  // Reset data before rendering the form
  window.poiBuilder.resetData();
  window.poiBuilder.render(true);
}


Hooks.on("renderJournalDirectory", (app, html, data) => {
  const button = $(`<button class="hex-crawl-generator"><i class="fas fa-map"></i> Hex Crawl Generator</button>`);
  html.find(".directory-header").prepend(button);
  button.click(openPOIBuilderWindow);
});

