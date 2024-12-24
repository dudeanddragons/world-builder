export class WorldBuilderWindow extends Application {
    constructor(options = {}) {
      super(options);
  
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
  
    getData() {
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
  
    _onClimateTypeChange(event) {
      this.data.climateType = event.target.value;
      this.render(false);
    }
  
    _onTerrainTypeChange(event) {
      this.data.terrainType = event.target.value;
      this.render(false);
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
  