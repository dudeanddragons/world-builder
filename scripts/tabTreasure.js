export async function handleTreasureTab(builder, html) {
    const filePaths = {
        valueRanges: "modules/world-builder/scripts/treasureGeneration/treasureValueRange.json",
        materials: "modules/world-builder/scripts/treasureGeneration/treasureMaterials.json",
        compatibility: "modules/world-builder/scripts/treasureGeneration/treasureCompatibility.json",
        itemTypes: "modules/world-builder/scripts/treasureGeneration/treasureSubTypes.json",
        qualities: "modules/world-builder/scripts/treasureGeneration/treasureQuality.json",
        sizes: "modules/world-builder/scripts/treasureGeneration/treasureSize.json"
    };

    let treasureData = {
        valueRanges: null,
        materialCache: null,
        compatibilityMap: null,
        subtypesMap: null,
        valueRangeHierarchy: null
    };

    async function preloadData() {
        const [valueRanges, materials, compatibility, itemTypes, qualities, sizes] = await Promise.all(
            Object.values(filePaths).map(fetchData)
        );

        if (!valueRanges || !materials || !compatibility || !itemTypes || !qualities || !sizes) {
            console.error("Failed to load one or more JSON files.");
            return treasureData;
        }

        const compatibilityMap = Object.entries(compatibility.compatibility).reduce((acc, [itemType, categories]) => {
            categories.forEach(category => {
                if (!acc[category]) acc[category] = [];
                acc[category].push(itemType);
            });
            return acc;
        }, {});

        const subtypesMap = itemTypes.itemTypes.reduce((acc, type) => {
            acc[type.type] = type.itemSubTypes?.map(subtype => ({
                ...subtype,
                qualities: qualities.qualities,
                sizes: sizes.sizeModifiers
            })) || [];
            return acc;
        }, {});

        const materialCache = Object.entries(materials.materials).reduce((acc, [category, items]) => {
            acc[category] = items.map(item => ({
                ...item,
                compatibleItemTypes: compatibilityMap[category]?.map(itemType => ({
                    itemType,
                    subtypes: subtypesMap[itemType] || []
                })) || []
            }));
            return acc;
        }, {});

        const valueRangeHierarchy = valueRanges.valueBase.map(({ range, min, max }) => ({
            range,
            materials: Object.entries(materialCache).flatMap(([category, items]) =>
                items.filter(item => item.baseValue >= min && item.baseValue <= max).map(item => ({
                    category,
                    ...item
                }))
            )
        }));

        treasureData = {
            valueRanges,
            materialCache,
            compatibilityMap,
            subtypesMap,
            valueRangeHierarchy
        };

        console.log("Treasure Data Initialized:", treasureData);
        return treasureData;
    }

    async function fetchData(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Error loading data from ${filePath}:`, error);
            return null;
        }
    }

    // Initialize data
    await preloadData();

    // Add new treasure entry
    html.find(".add-treasure").click(() => {
        builder.data.treasures.push({
            description: "",
            valueRange: "1-100", // Default range
            generatedData: null // Initialize generatedData to null
        });
        console.log("Treasure added:", builder.data.treasures);
        builder.render(false);
    });
    

        // Remove a treasure entry
        html.on("click", ".remove-treasure", (event) => {
            const index = $(event.currentTarget).closest(".treasure-entry").data("index");
            builder.data.treasures.splice(index, 1); // Remove treasure from the array
            console.log(`Treasure at index ${index} removed:`, builder.data.treasures);
            builder.render(false); // Re-render the UI to reflect changes
        });

    // Handle dropdown updates for treasure value ranges
    html.on("change", ".treasure-value-dropdown", async (event) => {
        const index = $(event.currentTarget).closest(".treasure-entry").data("index");
        const valueRange = event.currentTarget.value;
        builder.data.treasures[index].valueRange = valueRange;

        const options = await getCompatibleOptions(valueRange);
        updateDropdownOptions(html, index, options);

        console.log(`Treasure at index ${index} updated:`, builder.data.treasures[index]);
    });

    // Randomize individual treasure
    html.on("click", ".randomize-treasure", (event) => {
        const index = $(event.currentTarget).closest(".treasure-entry").data("index");
        const valueRange = builder.data.treasures[index]?.valueRange || "1-100";
    
        const treasureDescription = generateTreasureItem(valueRange, index);
        builder.data.treasures[index].description = treasureDescription;
    
        console.log(`Treasure at index ${index} randomized:`, builder.data.treasures[index]);
        builder.render(false);
    });
    






    
    html.on("click", ".create-item-treasure", async (event) => {
        try {
            event.preventDefault(); // Prevent default behavior
            console.log("Create Item button clicked.");
    
            // Get the treasure index
            const index = $(event.currentTarget).closest(".treasure-entry").data("index");
            if (index === undefined) throw new Error("Treasure entry index not found.");
    
            // Fetch the treasure entry
            const treasure = builder.data.treasures[index];
            if (!treasure || !treasure.generatedData) {
                throw new Error("Treasure data is incomplete or not generated yet. Cannot create item.");
            }
    
            const generatedData = treasure.generatedData;
            console.log("Using Generated Data:", generatedData);
    
            // Define item data using structured data and custom image
            const itemData = {
                name: `${generatedData.quality} ${generatedData.material} ${generatedData.subtype.name}`,
                type: "item",
                img: "icons/containers/chest/chest-reinforced-steel-red.webp", // Set the custom image
                system: {
                    description: {
                        value: `A ${generatedData.quality} ${generatedData.size.name} ${generatedData.material} ${generatedData.subtype.name}.`
                    },
                    attributes: {
                        identified: false,
                        type: "Art", // Set type as "Art"
                        rarity: "Uncommon"
                    },
                    alias: `${generatedData.subtype.name}`, // Include the subtype name in the alias
                    quantity: 1,
                    cost: {
                        value: generatedData.finalCost, // Use calculated cost
                        currency: "gp"
                    },
                    xp: 0,
                    weight: (generatedData.subtype.baseWeight || 1) * (generatedData.size.weightMultiplier || 1) // Adjusted weight
                }
            };
    
            // Create the item
            const createdItem = await Item.create(itemData, { renderSheet: true });
            if (createdItem) {
                console.log("Item successfully created:", createdItem);
                ui.notifications.info(`Item "${createdItem.name}" created successfully.`);
            } else {
                console.error("Failed to create the item.");
                ui.notifications.error("Failed to create the item.");
            }
        } catch (error) {
            console.error("Error creating item:", error);
            ui.notifications.error("Error: Could not create the item. Check console for details.");
        }
    });
    
    







// Add "Create Random Item" Button Listener with Custom Image and Correct Identified Attribute
function generateTreasureItem(valueRange, index) {
    const [min, max] = valueRange.split("-").map(Number);

    const materialsInRange = treasureData.valueRangeHierarchy.find(vr => vr.range === valueRange)?.materials || [];
    if (!materialsInRange.length) {
        console.error("No materials found in the selected GP range.");
        return "No treasure available for this value range.";
    }

    const material = selectRandom(materialsInRange);
    const compatibleType = selectRandom(material.compatibleItemTypes || []);
    const subtype = selectRandom(compatibleType?.subtypes || []);
    const quality = selectRandom(subtype?.qualities || []);
    const size = selectRandom(subtype?.sizes || []);

    if (material && compatibleType && subtype && quality && size) {
        const finalCost = Math.round(material.baseValue * quality.valueModifier * size.valueMultiplier);

        // Structure for data preparation
        const generatedData = {
            material: material.name,
            compatibleType: compatibleType.itemType,
            subtype: {
                name: subtype.name,
                baseWeight: subtype.baseWeight // Specifically capture baseWeight
            },
            quality: quality.name,
            size: {
                name: size.size,
                weightMultiplier: size.weightMultiplier,
                valueMultiplier: size.valueMultiplier
            },
            baseValue: material.baseValue,
            finalCost: finalCost
        };

        console.log("Generated Treasure Data:", generatedData);

        // Assign generatedData to the correct treasure entry
        if (!builder.data.treasures[index]) {
            builder.data.treasures[index] = { description: "", valueRange };
        }
        builder.data.treasures[index].generatedData = generatedData;

        // Return the description
        return `${quality.name} ${material.name} ${subtype.name} (${size.size}), ${finalCost} gp.`;
    }

    return "Failed to generate treasure.";
}

    
    
    
    
    
    function getCompatibleOptions(valueRange) {
        const [min, max] = valueRange.split("-").map(Number);
        return Object.entries(treasureData.materialCache).flatMap(([category, items]) =>
            items.filter(item => item.baseValue >= min && item.baseValue <= max).map(item => item.name)
        );
    }

    function updateDropdownOptions(html, index, options) {
        const dropdown = html.find(`.treasure-entry[data-index="${index}"] .treasure-options-dropdown`);
        dropdown.empty();
        options.forEach(option => dropdown.append(`<option value="${option}">${option}</option>`));
    }

// Helper Function to Select Random Entry
function selectRandom(array) {
    if (!array || !array.length) {
        console.error("selectRandom called with invalid array:", array);
        return null;
    }
    return array[Math.floor(Math.random() * array.length)];
}
}
