/**
 * Reads the index.json file located within the module assets.
 * @param {string} filePath - Path to the JSON file relative to the module folder.
 * @returns {Promise<Object>} - Parsed JSON object.
 */
function readJson(filePath) {
    return fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch JSON from ${filePath}`);
        return response.json();
      })
      .catch(error => {
        console.error(`Error reading JSON file: ${filePath}`, error.message);
        return null;
      });
  }
  
  /**
   * Consolidates terrain density data into a hierarchical structure.
   * @param {Object} index - The parsed JSON index object.
   * @returns {Promise<Object>} - Consolidated hierarchical data.
   */
  async function buildTerrainDensity(index) {
    const density = index.terrainDensity;
    const hierarchy = {};
  
    for (const [key, data] of Object.entries(density)) {
      const densityData = {
        name: key,
        description: data.description,
        features: [],
      };
  
      // Fetch terrain feature data
      const featureData = await readJson(`modules/world-builder/${data.file}`);
      if (featureData) {
        densityData.features = featureData.entries.map(entry => ({
          id: entry.id,
          value: entry.value,
        }));
      }
  
      hierarchy[key] = densityData;
    }
  
    return hierarchy;
  }
  
  /**
   * Logs the hierarchical terrain density data in a collapsed format.
   * @param {Object} hierarchy - Hierarchical data.
   */
  function logTerrainDensity(hierarchy) {
    console.log("Terrain Population Density:");
  
    for (const [key, densityData] of Object.entries(hierarchy)) {
      console.groupCollapsed(`Density: ${key}`);
  
      console.groupCollapsed("Features");
      densityData.features.forEach(feature => {
        console.log(`- [${feature.id}] ${feature.value}`);
      });
      console.groupEnd(); // Features
  
      console.groupEnd(); // Density
    }
  }
  
  
  // Main function
  async function initializeTerrainDensityLogger() {
    const modulePath = `modules/world-builder`; // Replace with your module's actual folder name
    const indexFilePath = `${modulePath}/index.json`;
  
    try {
      const indexJson = await readJson(indexFilePath);
      if (!indexJson) return;
  
      const hierarchy = await buildTerrainDensity(indexJson);
      logTerrainDensity(hierarchy);
    } catch (error) {
      console.error("Failed to initialize Terrain Density Logger:", error.message);
    }
  }
  
  // Execute the script
  initializeTerrainDensityLogger();
  