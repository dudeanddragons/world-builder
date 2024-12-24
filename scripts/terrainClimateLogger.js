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
 * Consolidates climate, terrain, and encounter data into a hierarchical structure.
 * @param {Object} index - The parsed JSON index object.
 * @returns {Promise<Object>} - Consolidated hierarchical data.
 */
async function buildHierarchy(index) {
  const climates = index.climates.tblTerrainClimate.entries;
  const hierarchy = {};

  for (const climate of climates) {
    const climateData = {
      id: climate.id,
      value: climate.value,
      terrains: [],
    };

    // Fetch terrain data
    if (climate.terrainFile) {
      const terrainData = await readJson(`modules/world-builder/${climate.terrainFile}`);
      if (terrainData) {
        for (const terrain of terrainData.entries) {
          const terrainDetails = {
            id: terrain.id,
            type: terrain.type,
            ruggedness: terrain.ruggedness,
            time: terrain.time,
            encounterChances: terrain.encounters, // Store chance of encounters
            encounterDetails: {}, // To store encounters by frequency
          };

          // Fetch encounter data for all frequencies
          const frequencies = ["Common", "Uncommon", "Rare", "VeryRare"];
          for (const frequency of frequencies) {
            const encounterKey = `${terrain.type}${frequency}`;
            const encounterFile = climate.encounters[encounterKey];

            if (encounterFile) {
              try {
                const encounterData = await readJson(`modules/world-builder/${encounterFile}`);
                terrainDetails.encounterDetails[frequency] =
                  encounterData?.entries.map(entry => entry.encounter) || [];
              } catch (error) {
                console.warn(`Encounter file not found: ${encounterFile}`);
              }
            }
          }

          climateData.terrains.push(terrainDetails);
        }
      }
    }

    hierarchy[climate.value] = climateData;
  }

  return hierarchy;
}

/**
 * Logs the hierarchical data in a collapsed format.
 * @param {Object} hierarchy - Hierarchical data.
 */
function logCollapsedHierarchy(hierarchy) {
  console.log("World Builder Tables:");

  for (const [climateKey, climateData] of Object.entries(hierarchy)) {
    console.groupCollapsed(`Climate: ${climateKey}`);
    console.log(`ID: ${climateData.id}`);
    console.log(`Value: ${climateData.value}`);

    console.groupCollapsed("Terrains");
    climateData.terrains.forEach(terrain => {
      console.groupCollapsed(`Terrain: ${terrain.type}`);
      console.log(`ID: ${terrain.id}`);
      console.log(`Ruggedness: ${terrain.ruggedness}`);
      console.log(`Time: ${terrain.time}`);

      console.groupCollapsed("Encounter Chances");
      if (terrain.encounterChances.length > 0) {
        terrain.encounterChances.forEach(chance => {
          console.log(`Chance Roll: ${chance}`);
        });
      } else {
        console.log("No encounter chances specified");
      }
      console.groupEnd(); // Encounter Chances

      console.groupCollapsed("Encounter Details");
      Object.entries(terrain.encounterDetails).forEach(([frequency, encounters]) => {
        console.groupCollapsed(`${frequency} Frequency`);
        if (encounters.length > 0) {
          encounters.forEach(encounter => {
            console.log(`- ${encounter}`);
          });
        } else {
          console.log("No encounters listed");
        }
        console.groupEnd(); // Frequency
      });
      console.groupEnd(); // Encounter Details

      console.groupEnd(); // Terrain
    });
    console.groupEnd(); // Terrains

    console.groupEnd(); // Climate
  }
}

// Main function
async function initializeWorldBuilder() {
  const modulePath = `modules/world-builder`; // Replace with your module's actual folder name
  const indexFilePath = `${modulePath}/index.json`;

  try {
    const indexJson = await readJson(indexFilePath);
    if (!indexJson) return;

    const hierarchy = await buildHierarchy(indexJson);
    logCollapsedHierarchy(hierarchy);
  } catch (error) {
    console.error("Failed to initialize World Builder:", error.message);
  }
}

// Execute the script
initializeWorldBuilder();
