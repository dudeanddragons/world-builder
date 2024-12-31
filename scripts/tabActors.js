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
  let raceData = [];
  let classData = [];
  let backgroundData = [];
  let npcData = [];


  // Add actor Button
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
  
    builder.render(false);
  });
  

  //---------------------------------//
  //------------FUNCTIONS------------//
  //---------------------------------//

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

//-------------------//
//---Roll Methods---//
//-----------------//

// Render Dice Results  
async function renderDiceResults(actorIndex, rolls, method = "default") {
    const abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
    const dropZones = abilities.map((ability) => 
        document.querySelector(`#assigned-score-${actorIndex}-${ability}`)
    );
  
    // Method VI: Distribute dice across abilities
    if (method === "method6") {
        dropZones.forEach((zone) => {
            zone.innerHTML = ""; // Clear existing content
            zone.classList.add("wb-drop-zone"); // Ensure the correct class is added
            zone.style.display = "flex"; // Enable flex layout for stacking
            zone.style.flexWrap = "wrap";
            zone.style.gap = "10px";
        });
  
        // Distribute dice results
        rolls.forEach((roll, i) => {
            const abilityIndex = i < 2 ? 0 : i - 1; // First 2 in Strength, others distributed
            const dropZone = dropZones[abilityIndex];
  
            if (!dropZone) {
                console.error(`Drop zone not found for ability index: ${abilityIndex}`);
                return;
            }
  
            const diceUnit = document.createElement("div");
            diceUnit.classList.add("wb-dice-unit");
            diceUnit.dataset.rollIndex = i;
            diceUnit.dataset.value = roll.total;
            diceUnit.draggable = true; // Make dice draggable
  
            const dieElement = document.createElement("div");
            dieElement.classList.add("wb-die");
            dieElement.textContent = roll.individualRoll;
            diceUnit.appendChild(dieElement);
  
            dropZone.appendChild(diceUnit);
        });
  
        console.log("Dice distributed across abilities for Method VI.");
        return;
    }
  
    // Default behavior for other methods
    if (dropZones.length !== rolls.length) {
        console.error("Number of drop zones does not match the number of rolls.");
        return;
    }
  
    dropZones.forEach((zone) => {
        zone.innerHTML = ""; // Clear existing content
    });
  
    rolls.forEach((roll, i) => {
        const dropZone = dropZones[i];
        if (!dropZone) {
            console.error("Drop zone not found for roll:", roll);
            return;
        }
  
        const diceUnit = document.createElement("div");
        diceUnit.classList.add("wb-dice-unit");
        diceUnit.dataset.rollIndex = i;
        diceUnit.dataset.value = roll.total;
  
        let droppedCount = 0;
        roll.individualRolls.forEach((die) => {
            const dieElement = document.createElement("div");
            dieElement.classList.add("wb-die");
            dieElement.textContent = die;
  
            if (roll.droppedDie === die && droppedCount === 0) {
                dieElement.classList.add("lowest");
                droppedCount++;
            }
  
            diceUnit.appendChild(dieElement);
        });
  
        dropZone.appendChild(diceUnit);
    });
  
    console.log("Dice rendered for other methods.");
  }

// Update Ability Score Results
function updateAbilityScores(method, rolls, actorIndex) {
    const abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
    const defaultScore = 8; // Base score for Method VI

    abilities.forEach((ability) => {
        const totalElement = document.querySelector(`#total-score-${actorIndex}-${ability}`);
        const dropZone = document.querySelector(`#assigned-score-${actorIndex}-${ability}`);
        let total = defaultScore;

        // Safeguard: Ensure the UI element exists
        if (!totalElement) {
            console.error(`Element #total-score-${actorIndex}-${ability} not found`);
            return;
        }

        // Safeguard: Ensure the drop zone exists
        if (!dropZone) {
            console.error(`Drop zone for ability '${ability}' not found.`);
            return;
        }

        if (method === "method6") {
            // Method VI: Calculate total based on dice in the drop zone
            const diceUnits = dropZone.querySelectorAll(".wb-dice-unit:not(.dummy-dice)");
            diceUnits.forEach((dice) => {
                const diceValue = parseInt(dice.dataset.value, 10) || 0;
                total += diceValue;
            });

            // Cap the total at 18
            if (total > 18) {
                total = 18;
            }

            // Update the ability in the actor's data
            builder.data.actors[actorIndex].abilities[ability] = total;

            // Update the UI dynamically
            totalElement.textContent = total;

            console.log(`Updated ability '${ability}' to ${total} for Method VI.`);
        } else {
            // Default logic for other methods
            const diceUnit = dropZone.querySelector(".wb-dice-unit");
            if (diceUnit) {
                total = parseInt(diceUnit.dataset.value, 10) || defaultScore;

                // Update the ability in the actor's data
                builder.data.actors[actorIndex].abilities[ability] = total;

                // Update the UI dynamically
                totalElement.textContent = total;

                console.log(`Updated ability '${ability}' dynamically to ${total} from drag-and-drop.`);
            } else if (rolls) {
                // Otherwise, use the rolls passed to the function
                switch (method) {
                    case "method2":
                        total = rolls[abilities.indexOf(ability)]?.chosen || defaultScore;
                        break;

                    case "method3":
                        total = rolls[abilities.indexOf(ability)]?.total || defaultScore;
                        break;

                    default:
                        total = rolls[abilities.indexOf(ability)]?.total || defaultScore;
                        break;
                }

                // Update the ability in the actor's data
                builder.data.actors[actorIndex].abilities[ability] = total;

                // Update the UI
                totalElement.textContent = total;
            } else {
                console.warn(`No roll or dice unit found for ability '${ability}'`);
            }
        }
    });

    console.log(`Ability scores updated for method '${method}' for actor index ${actorIndex}`);
}

// Enable Drag and Drop Features
function enableDragDrop(actorIndex, method = "default") {
  const dropZones = document.querySelectorAll(`[id^="assigned-score-${actorIndex}-"]`);

  if (dropZones.length === 0) {
      console.error("No drop zones found for the actor.");
      return;
  }

  console.log(`Setting up drag-and-drop for actor index: ${actorIndex}, method: ${method}`);

  let draggedElement = null;

  dropZones.forEach((zone) => {
      // Add dummy dice placeholder only for Method VI
      if (method === "method6" && !zone.querySelector(".dummy-dice")) {
          addDummyDice(zone);
      }

      // Enable dragover to allow drops
      zone.addEventListener("dragover", (e) => {
          e.preventDefault(); // Allow drop
          zone.classList.add("hovered"); // Add visual cue
          console.log("Dragging over drop zone:", zone);
      });

      zone.addEventListener("dragleave", () => {
          zone.classList.remove("hovered"); // Remove visual cue
          console.log("Drag left drop zone:", zone);
      });

      zone.addEventListener("drop", (e) => {
          e.preventDefault();
          zone.classList.remove("hovered");

          if (!draggedElement) {
              console.error("No dragged element to drop.");
              return;
          }

          console.log("Drop event triggered for zone:", zone);

          if (method === "method6") {
              // Remove dummy dice before adding the dragged dice
              const dummyDice = zone.querySelector(".dummy-dice");
              if (dummyDice) dummyDice.remove();

              // Add the dragged dice to the drop zone
              zone.appendChild(draggedElement);
              console.log("Dice stacked in zone for Method VI:", zone);
          } else {
              // Swap logic for other methods
              const currentElement = zone.querySelector(".wb-dice-unit");
              if (currentElement) {
                  const sourceZone = draggedElement.parentElement;
                  sourceZone.appendChild(currentElement);
              }
              zone.appendChild(draggedElement);
              console.log("Dice swapped in zone for other methods:", zone);
          }

          draggedElement = null;

          // Ensure a dummy dice is present if the zone becomes empty
          if (method === "method6") manageDummyDice(zone);

          // Recalculate and update UI
          updateAbilityScores(method, [], actorIndex);
      });
  });

  // Make actual dice draggable
  const diceUnits = document.querySelectorAll(".wb-dice-unit");
  diceUnits.forEach((dice) => {
      dice.draggable = true;

      dice.addEventListener("dragstart", (e) => {
          console.log("Drag started for dice:", dice);
          draggedElement = dice;
          e.target.style.opacity = "0.5";

          // Add a dummy dice if the last dice is being dragged (Method VI only)
          const parentZone = dice.parentElement;
          if (method === "method6" && parentZone && parentZone.childElementCount === 1) {
              addDummyDice(parentZone);
          }
      });

      dice.addEventListener("dragend", (e) => {
          console.log("Drag ended for dice:", dice);
          draggedElement = null;
          e.target.style.opacity = "1";

          // Remove the dummy dice if the zone contains real dice
          if (method === "method6") manageDummyDice(dice.parentElement);
      });
  });
}

// Helper function to add a dummy dice to a drop zone
function addDummyDice(zone) {
  const dummyDice = document.createElement("div");
  dummyDice.classList.add("wb-dice-unit", "dummy-dice");
  dummyDice.style.visibility = "hidden"; // Make it invisible
  dummyDice.textContent = "0"; // Dummy dice value for debugging
  dummyDice.style.opacity = "0.5"; // Different appearance to distinguish it
  dummyDice.style.cursor = "not-allowed"; // Indicate it's not draggable
  zone.appendChild(dummyDice);
}

// Manage dummy dice in a zone based on its content
function manageDummyDice(zone) {
  const diceUnits = Array.from(zone.querySelectorAll(".wb-dice-unit"));
  const dummyDice = zone.querySelector(".dummy-dice");

  if (diceUnits.length === 0 && !dummyDice) {
      addDummyDice(zone);
  }

  // Sort dice units by their value (dummy dice always has value 0)
  const sortedDice = diceUnits.sort((a, b) => {
      const valueA = parseInt(a.dataset.value, 10) || 0; // Default to 0 for dummy dice
      const valueB = parseInt(b.dataset.value, 10) || 0;
      return valueA - valueB; // Ascending order
  });

  // Clear the zone and reappend sorted dice
  zone.innerHTML = "";
  sortedDice.forEach((dice) => zone.appendChild(dice));
}

//--------------------//
//---EQUIPMENT GEN---//
//------------------//

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

  
//----------------------//
//---Actor Generator---//
//--------------------//

  // Load NPC actors from the game
  async function loadNPCActors() {
    try {
      const allActors = game.actors.contents;
      npcData = allActors
        .filter((actor) => actor.type === "npc")
        .map((npc) => ({
          id: npc.id,
          name: npc.name,
        }));
      console.log("NPC Data Loaded:", npcData);
    } catch (error) {
      console.error("Error loading NPC actors:", error);
      ui.notifications.error("Failed to load NPC actors. Please check the console for details.");
    }
  }

  function actorGenFetchActorData(formData) {
    return {
      abilities: formData.abilities || {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      saves: formData.saves || {
        paralyzation: { value: 20 },
        poison: { value: 20 },
        death: { value: 20 },
        rod: { value: 20 },
        staff: { value: 20 },
        wand: { value: 20 },
        petrification: { value: 20 },
        polymorph: { value: 20 },
        breath: { value: 20 },
        spell: { value: 20 },
      },
      attributes: formData.attributes || {
        ac: { value: 10 },
        thaco: { value: 20 },
        hp: { value: 0, max: 0 },
        movement: { value: 30, unit: "ft" },
      },
      details: {
        alignment: formData.alignment || "neutral",
        type: formData.details?.type || "",
        source: formData.details?.source || "",
      },
      race: formData.race?.uuid || null,
      class1: formData.class1?.uuid || "none",
      class2: formData.class2?.uuid || "none",
      class3: formData.class3?.uuid || "none",
      background: formData.background?.uuid || "",
    };
  }
  

  // Populate NPC dropdown dynamically
  function populateNPCDropdown() {
    const dropdown = html.find(".clone-npc-dropdown");
    if (!dropdown.length) {
      console.error("NPC dropdown element not found in the HTML.");
      return;
    }
    dropdown.empty();
    dropdown.append('<option value="none" selected>None</option>');
    npcData.forEach((npc) => {
      dropdown.append(`<option value="${npc.id}">${npc.name}</option>`);
    });
    console.log("NPC dropdown populated.");
  }
  

  async function createNPCFromForm(formData) {
    try {
      let newNPC;
  
      const cloneData = formData.cloneNPC;
  
      if (cloneData && cloneData.uuid !== "none") {
        // Clone the selected NPC
        const originalNPC = game.actors.get(cloneData.uuid);
        if (!originalNPC) {
          ui.notifications.error("Failed to find the NPC to clone.");
          return;
        }
  
        console.log(`Cloning NPC: ${cloneData.name} (UUID: ${cloneData.uuid})`);
  
        // Clone the NPC
        newNPC = await originalNPC.clone({
          name: formData.name || `${originalNPC.name} Clone`,
        });
  
        // Validate and prepare item updates
        const itemsToAdd = [];
        if (formData.race?.uuid) {
          const raceItem = await fromUuid(formData.race.uuid);
          if (raceItem) itemsToAdd.push(raceItem.toObject());
        }
        if (formData.class1?.uuid) {
          const classItem = await fromUuid(formData.class1.uuid);
          if (classItem) itemsToAdd.push(classItem.toObject());
        }
        if (formData.class2?.uuid) {
          const classItem = await fromUuid(formData.class2.uuid);
          if (classItem) itemsToAdd.push(classItem.toObject());
        }
        if (formData.background?.uuid) {
          const backgroundItem = await fromUuid(formData.background.uuid);
          if (backgroundItem) itemsToAdd.push(backgroundItem.toObject());
        }
  
        // Update the cloned NPC
        const updateData = {
          "system.abilities": formData.abilities,
          "system.details.alignment": formData.alignment || "neutral",
        };
  
        await newNPC.update(updateData);
  
        // Add items to the cloned NPC
        if (itemsToAdd.length > 0) {
          await newNPC.createEmbeddedDocuments("Item", itemsToAdd);
        }
  
        ui.notifications.info(`Cloned NPC "${newNPC.name}" successfully and updated its data.`);
      } else {
        // Create a new NPC from scratch
        const systemData = {
          abilities: formData.abilities || {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
          },
          details: {
            alignment: formData.alignment || "neutral",
          },
        };
  
        // Create the new NPC
        newNPC = await Actor.create({
          name: formData.name || "New NPC",
          type: "npc",
          system: systemData,
        });
  
        // Add items to the new NPC
        const itemsToAdd = [];
        if (formData.race?.uuid) {
          const raceItem = await fromUuid(formData.race.uuid);
          if (raceItem) itemsToAdd.push(raceItem.toObject());
        }
        if (formData.class1?.uuid) {
          const classItem = await fromUuid(formData.class1.uuid);
          if (classItem) itemsToAdd.push(classItem.toObject());
        }
        if (formData.class2?.uuid) {
          const classItem = await fromUuid(formData.class2.uuid);
          if (classItem) itemsToAdd.push(classItem.toObject());
        }
        if (formData.background?.uuid) {
          const backgroundItem = await fromUuid(formData.background.uuid);
          if (backgroundItem) itemsToAdd.push(backgroundItem.toObject());
        }
  
        if (itemsToAdd.length > 0) {
          await newNPC.createEmbeddedDocuments("Item", itemsToAdd);
        }
  
        ui.notifications.info(`New NPC "${newNPC.name}" created successfully.`);
      }
  
      console.log("Created/Updated NPC:", newNPC);
      return newNPC;
    } catch (error) {
      console.error("Error creating or cloning NPC:", error);
      ui.notifications.error("Failed to create or clone NPC. Check the console for details.");
    }
  }
  
  
  
  
// Update selected cloneNPC in structured data
html.on("change", ".clone-npc-dropdown", function () {
  const actorIndex = $(this).data("index"); // Retrieve the index dynamically
  const selectedUuid = $(this).val(); // Get the selected NPC's UUID

  if (actorIndex === undefined) {
    console.error("Actor index is undefined. Ensure the dropdown includes a data-index attribute.");
    return;
  }

  // Find the selected NPC in npcData
  const selectedNPC = npcData.find((npc) => npc.id === selectedUuid);

  // Update the cloneNPC field for the actor
  builder.data.actors[actorIndex].cloneNPC = selectedNPC
    ? { uuid: selectedNPC.id, name: selectedNPC.name }
    : { uuid: "none", name: "None" };

  console.log(`Updated cloneNPC for actor ${actorIndex}:`, builder.data.actors[actorIndex].cloneNPC);
});





  
html.on("click", ".create-npc", async function () {
  try {
    const actorIndex = $(this).data("index"); // Dynamically retrieve the actor index
    if (actorIndex === undefined) {
      console.error("Actor index is undefined. Ensure the button includes a data-index attribute.");
      return;
    }

    const formData = builder.data.actors[actorIndex]; // Get actor data
    const cloneData = formData.cloneNPC; // Retrieve cloneNPC data

    let newNPCData;
    if (cloneData && cloneData.uuid !== "none") {
      // If a Clone NPC is selected, fetch the NPC actor to clone
      console.log(`Cloning NPC: ${cloneData.name} (UUID: ${cloneData.uuid})`);
      const originalNPC = game.actors.get(cloneData.uuid);
      if (!originalNPC) {
        ui.notifications.error(`NPC with UUID ${cloneData.uuid} not found.`);
        return;
      }

      // Clone the NPC and prepare data
      newNPCData = originalNPC.toObject();
      const customName = formData.name || "Clone";
      newNPCData.name = `${originalNPC.name} (${customName})`; // Set the name for the cloned NPC
      newNPCData.folder = null; // Ensure the cloned NPC is not placed in any folder

      // Update ability scores from formData
      const abilities = newNPCData.system.abilities;
      abilities.str.value = formData.abilities.strength || abilities.str.value;
      abilities.dex.value = formData.abilities.dexterity || abilities.dex.value;
      abilities.con.value = formData.abilities.constitution || abilities.con.value;
      abilities.int.value = formData.abilities.intelligence || abilities.int.value;
      abilities.wis.value = formData.abilities.wisdom || abilities.wis.value;
      abilities.cha.value = formData.abilities.charisma || abilities.cha.value;
      console.log("Updated Abilities for Cloned NPC:", abilities);
    } else {
      // If no Clone NPC is selected, create a new blank NPC
      console.log("Creating a new blank NPC.");
      newNPCData = {
        name: formData.name || "New NPC",
        type: "npc",
        folder: null, // Ensure the new NPC is not placed in any folder
        system: {
          abilities: {
            str: { value: formData.abilities.strength || 10 },
            dex: { value: formData.abilities.dexterity || 10 },
            con: { value: formData.abilities.constitution || 10 },
            int: { value: formData.abilities.intelligence || 10 },
            wis: { value: formData.abilities.wisdom || 10 },
            cha: { value: formData.abilities.charisma || 10 },
          },
          attributes: {
            hp: { value: 10, max: 10 },
            ac: { value: 10 },
            movement: { walk: 30 },
          },
          details: {
            alignment: "neutral",
            type: { value: "npc" },
          },
          token: { vision: true, actorLink: false },
        },
      };
    }

    // Create the NPC actor
    const savedNPC = await Actor.create(newNPCData);

    // Add items (race, classes, background) as embedded documents
    const itemsToAdd = [];
    if (formData.race?.uuid) {
      const raceItem = await fromUuid(formData.race.uuid);
      if (raceItem) {
        itemsToAdd.push(raceItem.toObject());
        console.log(`Added race: ${raceItem.name} (UUID: ${raceItem.uuid})`);
      }
    }

    for (const classField of ["class1", "class2", "class3"]) {
      if (formData[classField]?.uuid && formData[classField].uuid !== "none") {
        const classItem = await fromUuid(formData[classField].uuid);
        if (classItem) {
          itemsToAdd.push(classItem.toObject());
          console.log(`Added ${classField}: ${classItem.name} (UUID: ${classItem.uuid})`);
        }
      }
    }

    if (formData.background?.uuid) {
      const backgroundItem = await fromUuid(formData.background.uuid);
      if (backgroundItem) {
        itemsToAdd.push(backgroundItem.toObject());
        console.log(`Added background: ${backgroundItem.name} (UUID: ${backgroundItem.uuid})`);
      }
    }

    // Create all embedded documents at once
    if (itemsToAdd.length > 0) {
      await savedNPC.createEmbeddedDocuments("Item", itemsToAdd);
    }

    console.log(`NPC Created: ${savedNPC.name} (ID: ${savedNPC.id})`);
    console.log(`Updated Abilities:`, savedNPC.system.abilities);
    ui.notifications.info(
      `Successfully created NPC "${savedNPC.name}" with updated abilities, race, classes, and background.`
    );
  } catch (error) {
    console.error("Error creating or cloning NPC:", error);
    ui.notifications.error("Failed to create or clone NPC. Check the console for details.");
  }
});


html.on("click", ".create-character", async function () {
  try {
    const actorIndex = $(this).data("index"); // Dynamically retrieve the actor index
    if (actorIndex === undefined) {
      console.error("Actor index is undefined. Ensure the button includes a data-index attribute.");
      return;
    }

    const formData = builder.data.actors[actorIndex]; // Get actor data

    // Prepare the new character data
    const newCharacterData = {
      name: formData.name || "New Character",
      type: "character",
      folder: null, // Ensure the new character is not placed in any folder
      system: {
        abilities: {
          str: { value: formData.abilities.strength || 10 },
          dex: { value: formData.abilities.dexterity || 10 },
          con: { value: formData.abilities.constitution || 10 },
          int: { value: formData.abilities.intelligence || 10 },
          wis: { value: formData.abilities.wisdom || 10 },
          cha: { value: formData.abilities.charisma || 10 },
        },
        attributes: {
          hp: { value: 10, max: 10 },
          ac: { value: 10 },
          movement: { walk: 30 },
        },
        details: {
          alignment: "neutral",
          type: { value: "character" },
        },
        token: { vision: true, actorLink: true },
      },
    };

    // Create the character actor
    const savedCharacter = await Actor.create(newCharacterData);

    // Add items (race, classes, background) as embedded documents
    const itemsToAdd = [];
    if (formData.race?.uuid) {
      const raceItem = await fromUuid(formData.race.uuid);
      if (raceItem) {
        itemsToAdd.push(raceItem.toObject());
        console.log(`Added race: ${raceItem.name} (UUID: ${raceItem.uuid})`);
      }
    }

    for (const classField of ["class1", "class2", "class3"]) {
      if (formData[classField]?.uuid && formData[classField].uuid !== "none") {
        const classItem = await fromUuid(formData[classField].uuid);
        if (classItem) {
          itemsToAdd.push(classItem.toObject());
          console.log(`Added ${classField}: ${classItem.name} (UUID: ${classItem.uuid})`);
        }
      }
    }

    if (formData.background?.uuid) {
      const backgroundItem = await fromUuid(formData.background.uuid);
      if (backgroundItem) {
        itemsToAdd.push(backgroundItem.toObject());
        console.log(`Added background: ${backgroundItem.name} (UUID: ${backgroundItem.uuid})`);
      }
    }

    // Create all embedded documents at once
    if (itemsToAdd.length > 0) {
      await savedCharacter.createEmbeddedDocuments("Item", itemsToAdd);
    }

    console.log(`Character Created: ${savedCharacter.name} (ID: ${savedCharacter.id})`);
    console.log(`Updated Abilities:`, savedCharacter.system.abilities);
    ui.notifications.info(
      `Successfully created Character "${savedCharacter.name}" with updated abilities, race, classes, and background.`
    );
  } catch (error) {
    console.error("Error creating Character:", error);
    ui.notifications.error("Failed to create Character. Check the console for details.");
  }
});
















  
  
  



//---------------------------------------//
//---------------LISTENERS---------------//
//---------------------------------------//

// ABILITY SCORE BUTTON CLICK LISTENERS
html.on("click", ".roll-method-button", async function () {
  const actorIndex = $(this).data("index");
  const rollMethod = $(this).data("method");

  try {
      console.log(`Button clicked: Roll Method '${rollMethod}' for Actor Index '${actorIndex}'`);

      // Reset abilities section to default state
      const actor = builder.data.actors[actorIndex];
      if (actor) {
          actor.abilities = {
              strength: 8,
              dexterity: 8,
              constitution: 8,
              intelligence: 8,
              wisdom: 8,
              charisma: 8,
          };
      } else {
          console.error(`Actor at index ${actorIndex} not found.`);
          return;
      }

      // Correctly target the abilities table
      const abilitiesTableBody = html.find(`.ability-scores-table tbody`);
      if (abilitiesTableBody.length) {
          abilitiesTableBody.empty(); // Clear current abilities

          // Re-render default abilities
          for (const [key, value] of Object.entries(actor.abilities)) {
              const totalElementId = `total-score-${actorIndex}-${key}`;
              const dropZoneId = `assigned-score-${actorIndex}-${key}`;

              const row = `
                  <tr>
                      <td>${key.charAt(0).toUpperCase() + key.slice(1)}</td>
                      <td>
                          <div id="${dropZoneId}" class="assigned-score drop-zone" data-index="${actorIndex}" data-ability="${key}"></div>
                      </td>
                      <td>
                          <span id="${totalElementId}" class="ability-total">${value}</span>
                      </td>
                  </tr>
              `;
              abilitiesTableBody.append(row);
          }
          console.log(`Re-rendered abilities table for Actor Index ${actorIndex}.`);
      } else {
          console.error(`Abilities table for Actor Index ${actorIndex} not found.`);
          return;
      }

      // Logic for rendering based on roll method
      switch (rollMethod) {
          case "method1":
              const rolls1 = await rollMethodI();
              renderDiceResults(actorIndex, rolls1);
              updateAbilityScores("method1", rolls1, actorIndex);
              console.log("Method 1 rendered with default state.");
              break;

          case "method2":
              const rolls2 = await rollMethodII();
              renderDiceResults(actorIndex, rolls2);
              updateAbilityScores("method2", rolls2, actorIndex);
              console.log("Method 2 rendered with default state.");
              break;

          case "method3":
              const rolls3 = await rollMethodIII();
              renderDiceResults(actorIndex, rolls3);
              enableDragDrop(actorIndex);
              updateAbilityScores("method3", rolls3, actorIndex);
              console.log("Method 3 rendered with drag-and-drop enabled.");
              break;

          case "method4":
              const rolls4 = await rollMethodI();
              renderDiceResults(actorIndex, rolls4);
              enableDragDrop(actorIndex);
              updateAbilityScores("method4", rolls4, actorIndex);
              console.log("Method 4 rendered with drag-and-drop enabled.");
              break;

          case "method5":
              const rolls5 = await rollMethodV();
              renderDiceResults(actorIndex, rolls5);
              enableDragDrop(actorIndex);
              updateAbilityScores("method5", rolls5, actorIndex);
              console.log("Method 5 rendered with drag-and-drop enabled.");
              break;

          case "method6":
              const rolls6 = await rollMethodVI();
              renderDiceResults(actorIndex, rolls6, "method6");
              enableDragDrop(actorIndex, "method6");
              updateAbilityScores("method6", rolls6, actorIndex);
              console.log("Method 6 rendered with stacking logic.");
              break;

          case "dmchoice":
              for (const [key, value] of Object.entries(actor.abilities)) {
                  const totalElementId = `total-score-${actorIndex}-${key}`;
                  let totalElement = document.querySelector(`#${totalElementId}`);
                  if (totalElement && totalElement.tagName !== "INPUT") {
                      const inputField = document.createElement("input");
                      inputField.type = "number";
                      inputField.min = "1";
                      inputField.max = "25";
                      inputField.value = value;
                      inputField.classList.add("editable-total");
                      inputField.style.width = "50px";
                      inputField.dataset.ability = key;

                      totalElement.replaceWith(inputField);

                      // Listen for input changes
                      inputField.addEventListener("change", () => {
                          const newScore = parseInt(inputField.value, 10);
                          if (newScore >= 1 && newScore <= 25) {
                              actor.abilities[key] = newScore;
                              console.log(`Updated ability '${key}' to ${newScore} via DM's Choice.`);
                          } else {
                              inputField.value = value; // Revert to valid score
                              console.error(`Invalid score for '${key}': ${newScore}.`);
                          }
                      });
                  }
              }
              console.log("DM's Choice rendered with editable fields.");
              break;

          default:
              console.error("Unknown roll method selected.");
      }
  } catch (error) {
      console.error(`Error rendering roll method '${rollMethod}':`, error);
  }
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


  



/*
function renderDragDropFields(actorIndex) {
  const abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
  abilities.forEach((ability) => {
      const dropZone = document.querySelector(`#assigned-score-${actorIndex}-${ability}`);
      if (dropZone) {
          dropZone.classList.add("wb-drop-zone"); // Ensure the drop zone class is applied
          dropZone.style.display = "flex"; // Ensure flexbox layout for stacking
          dropZone.style.flexWrap = "wrap";
          dropZone.style.gap = "10px";

          // Clear any old content to avoid duplicate listeners
          dropZone.innerHTML = ""; 
      } else {
          console.warn(`Drop zone not found for ability: ${ability}`);
      }
  });

  console.log("All drop zones initialized for drag-and-drop.");
}
*/


  // Load initial data
  Promise.all([loadMappedNames(), loadRaceItems(), loadClassItems(), loadBackgroundItems(), loadNPCActors()]).then(() => {
    populateCultures();
    populateRaces();
    populateClasses();
    populateBackgrounds();
    populateNPCDropdown();
  });
}
