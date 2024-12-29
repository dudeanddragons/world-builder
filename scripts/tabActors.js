export function handleActorsTab(builder, html) {
  let mappedNames = null;
  let raceData = []; // Store race items for dropdown

  // Load the mappedNames.json file dynamically
  async function loadMappedNames() {
    try {
      const response = await fetch("modules/world-builder/scripts/actorGeneration/mappedNames.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch mappedNames.json: ${response.statusText}`);
      }
      mappedNames = await response.json();
      console.log("Mapped Names Loaded:", mappedNames);
    } catch (error) {
      console.error("Error loading mappedNames.json:", error);
      ui.notifications.error("Failed to load name mappings. Please check the console for details.");
    }
  }

  // Load race items from the game items
  async function loadRaceItems() {
    try {
      const races = game.items.filter((item) => item.type === "race");
      raceData = races.map((race) => ({
        uuid: race.uuid,
        name: race.name,
      }));
      console.log("Race Data Loaded:", raceData);
    } catch (error) {
      console.error("Error loading race items:", error);
      ui.notifications.error("Failed to load race items. Please check the console for details.");
    }
  }

  // Populate culture options dynamically, including gender-specific options
  function populateCultures() {
    if (!mappedNames) return;

    const cultures = Object.keys(mappedNames.nameFiles.female); // Assuming male and female share the same cultures
    html.find(".culture-select").each((index, select) => {
      $(select).empty();
      $(select).append('<option value="" disabled selected>Select Culture and Gender</option>');
      cultures.forEach((culture) => {
        $(select).append(`<option value="female-${culture}">Female ${culture}</option>`);
        $(select).append(`<option value="male-${culture}">Male ${culture}</option>`);
      });
    });
  }

  // Populate race dropdown dynamically
  function populateRaces() {
    html.find(".race-select").each((index, select) => {
      $(select).empty().append('<option value="" disabled selected>Select Race</option>');
      raceData.forEach((race) => {
        $(select).append(`<option value="${race.uuid}">${race.name}</option>`);
      });
    });
  }

  // Add a new actor to the list
  html.find(".add-actor").click(() => {
    if (!builder.data.actors) builder.data.actors = [];

    builder.data.actors.push({
      name: "",
      race: null,
      culture: null,
      gender: "female", // Default gender
    });

    builder.render(false);
  });

  // Delete an actor from the list
  html.on("click", ".delete-actor", function () {
    const index = $(this).data("index");
    builder.data.actors.splice(index, 1);
    builder.render(false);
  });

  // Update the selected culture for an actor
  html.on("change", ".culture-select", function () {
    const index = $(this).data("index");
    const selectedValue = $(this).val();
    if (!selectedValue) return;

    const [gender, culture] = selectedValue.split("-");
    builder.data.actors[index].gender = gender;
    builder.data.actors[index].culture = culture;
  });

  // Update the selected race for an actor
  html.on("change", ".race-select", function () {
    const index = $(this).data("index");
    const selectedUuid = $(this).val();
    const selectedRace = raceData.find((race) => race.uuid === selectedUuid);

    if (selectedRace) {
      builder.data.actors[index].race = {
        uuid: selectedRace.uuid,
        name: selectedRace.name,
      };
    }
  });

  // Generate a random name for an actor
  html.on("click", ".generate-name", async function () {
    const index = $(this).data("index");
    const actor = builder.data.actors[index];
    const gender = actor.gender || "female";
    const culture = actor.culture;

    if (!culture) {
      ui.notifications.warn("Please select a culture before generating a name.");
      return;
    }

    const nameFilePath = `modules/world-builder/${mappedNames.nameFiles[gender][culture]}`;
    try {
      const response = await fetch(nameFilePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch name file: ${response.statusText}`);
      }
      const nameData = await response.json();
      const firstName = nameData.firstNames[Math.floor(Math.random() * nameData.firstNames.length)];
      const lastName = nameData.lastNames[Math.floor(Math.random() * nameData.lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      actor.name = fullName;
      $(`#name-input-${index}`).val(fullName);
    } catch (error) {
      console.error(`Failed to load name file for ${culture} (${gender}):`, error);
      ui.notifications.error("Failed to generate name. Please check the console for details.");
    }
  });

  // Generate equipment
  html.on("click", ".build-equipment", function () {
    const index = $(this).data("index");
    const equipment = [
      { name: "Sword", quantity: 1 },
      { name: "Shield", quantity: 1 },
    ];
    builder.data.actors[index].equipment = equipment;
    renderEquipmentTable(index, equipment);
  });

  // Render equipment table
  function renderEquipmentTable(index, equipment) {
    const tableBody = $(`#equipment-table-${index} tbody`);
    const rows = equipment
      .map(
        (item, i) =>
          `<tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td><button class="delete-equipment" data-index="${i}" data-actor-index="${index}">Delete</button></td>
          </tr>`
      )
      .join("");
    tableBody.html(rows);

    tableBody.find(".delete-equipment").click(function () {
      const actorIndex = $(this).data("actor-index");
      const itemIndex = $(this).data("index");
      builder.data.actors[actorIndex].equipment.splice(itemIndex, 1);
      renderEquipmentTable(actorIndex, builder.data.actors[actorIndex].equipment);
    });
  }

  // Load initial data
  Promise.all([loadMappedNames(), loadRaceItems()]).then(() => {
    populateCultures();
    populateRaces();
  });
}
