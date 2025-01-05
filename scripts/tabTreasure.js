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
            valueRange: "1-100" // Default range
        });
        console.log("Treasure added:", builder.data.treasures);
        builder.render(false);
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
        const valueRange = builder.data.treasures[index].valueRange;

        const treasureDescription = generateTreasureItem(valueRange);
        builder.data.treasures[index].description = treasureDescription;

        console.log(`Treasure at index ${index} randomized:`, builder.data.treasures[index]);
        builder.render(false);
    });

    // Generate treasure item based on value range
    function generateTreasureItem(valueRange) {
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
            return `${quality.name} ${material.name} ${subtype.name} (${size.size}), worth ${finalCost} gp.`;
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

    function selectRandom(array) {
        if (!array || !array.length) return null;
        return array[Math.floor(Math.random() * array.length)];
    }
}
