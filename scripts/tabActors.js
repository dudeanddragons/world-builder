import { 
  rollMethodI, 
  rollMethodII, 
  rollMethodIII, 
  rollMethodIV, 
  rollMethodV, 
  rollMethodVI 
} from './actorGeneration/wbAbilityScores.js';

export function handleActorsTab(builder, html) {
  let mappedNames = null;
  let raceData = []; // Store race items for dropdown
  let classData = []; // Store class items for dropdown
  let backgroundData = []; // Store background items for dropdown

  html.find(".add-actor").click(() => {
    if (!builder.data.actors) builder.data.actors = [];
  
    const newActor = {
      name: "",
      race: null,
      class1: { uuid: "none", name: "None" },
      class2: { uuid: "none", name: "None" },
      class3: { uuid: "none", name: "None" },
      background: { uuid: "", name: "" },
      culture: null,
      gender: "female",
      abilities: {
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,
      },
    };
  
    builder.data.actors.push(newActor);
  
    // Safely re-render the builder
    builder.render(false);
  });
  
  
  

  
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

  // Load class items from the game items
  async function loadClassItems() {
    try {
      const classes = game.items.filter((item) => item.type === "class");
      classData = classes.map((cls) => ({
        uuid: cls.uuid,
        name: cls.name,
      }));
      console.log("Class Data Loaded:", classData);
    } catch (error) {
      console.error("Error loading class items:", error);
      ui.notifications.error("Failed to load class items. Please check the console for details.");
    }
  }

  // Load background items from the game items
  async function loadBackgroundItems() {
    try {
      const backgrounds = game.items.filter((item) => item.type === "background");
      backgroundData = backgrounds.map((bg) => ({
        uuid: bg.uuid,
        name: bg.name,
      }));
      console.log("Background Data Loaded:", backgroundData);
    } catch (error) {
      console.error("Error loading background items:", error);
      ui.notifications.error("Failed to load background items. Please check the console for details.");
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

  // Populate class dropdown dynamically
  function populateClasses() {
    html.find(".class-select").each((index, select) => {
      $(select).empty();
      // Add "None" as the first option
      $(select).append('<option value="none" selected>None</option>');
      // Add all other classes dynamically
      classData.forEach((cls) => {
        $(select).append(`<option value="${cls.uuid}">${cls.name}</option>`);
      });

      // Pre-select the class if already set
      const actorIndex = $(select).data("index");
      const classIndex = $(select).data("class-index");
      const actorClassUuid = builder.data.actors[actorIndex]?.[`class${classIndex}`]?.uuid || "none";
      $(select).val(actorClassUuid);
    });
  }

  // Populate background dropdown dynamically
  function populateBackgrounds() {
    html.find(".background-select").each((index, select) => {
      $(select).empty().append('<option value="" disabled selected>Select Background</option>');
      backgroundData.forEach((bg) => {
        $(select).append(`<option value="${bg.uuid}">${bg.name}</option>`);
      });

      // Pre-select the background if already set
      const actorIndex = $(select).data("index");
      const actorBackgroundUuid = builder.data.actors[actorIndex]?.background?.uuid || "";
      $(select).val(actorBackgroundUuid);
    });
  }

  function updateAbilityScores(method, rolls, actorIndex) {
    const abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
    const defaultScore = 8;
  
    abilities.forEach((ability, i) => {
      const totalElement = document.querySelector(`#total-score-${actorIndex}-${ability}`);
  
      // Safeguard: Ensure the element exists before modifying it
      if (!totalElement) {
        console.error(`Element #total-score-${actorIndex}-${ability} not found`);
        return;
      }
  
      // Set the total to either the rolled value or the default
      const total = rolls?.[i]?.total || defaultScore;
      totalElement.textContent = total;
    });
  }
  
  
  
  
  
  
  

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

  // Update the selected class for an actor (primary, secondary, tertiary)
  html.on("change", ".class-select", function () {
    const index = $(this).data("index");
    const classIndex = $(this).data("class-index"); // Identifies which class selector (1, 2, or 3)
    const selectedUuid = $(this).val();
    const selectedClass = classData.find((cls) => cls.uuid === selectedUuid);

    if (selectedClass) {
      const classKey = `class${classIndex}`;
      builder.data.actors[index][classKey] = {
        uuid: selectedClass.uuid,
        name: selectedClass.name,
      };
    }
  });

  // Update the selected background for an actor
  html.on("change", ".background-select", function () {
    const index = $(this).data("index");
    const selectedUuid = $(this).val();
    const selectedBackground = backgroundData.find((bg) => bg.uuid === selectedUuid);

    if (selectedBackground) {
      builder.data.actors[index].background = {
        uuid: selectedBackground.uuid,
        name: selectedBackground.name,
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

  html.on("change", ".roll-method-select", async function () {
    const actorIndex = $(this).data("index");
    const rollMethod = $(this).val();
  
    let rolls = null;
    try {
      switch (rollMethod) {
        case "method1":
          rolls = await rollMethodI();
          break;
        case "method2":
          rolls = await rollMethodII();
          break;
        case "method3":
          rolls = await rollMethodIII();
          break;
        case "method4":
          rolls = await rollMethodIV();
          break;
        case "method5":
          rolls = await rollMethodV();
          break;
        case "method6":
          rolls = await rollMethodVI();
          break;
      }
      if (rolls) updateAbilityScores(rollMethod, rolls, actorIndex);
    } catch (error) {
      console.error(`Error in roll method '${rollMethod}':`, error);
    }
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
  Promise.all([loadMappedNames(), loadRaceItems(), loadClassItems(), loadBackgroundItems()]).then(() => {
    populateCultures();
    populateRaces();
    populateClasses();
    populateBackgrounds();
  });
}
