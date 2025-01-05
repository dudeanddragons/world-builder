export function handleTreasureTab(builder, html) {
    // Add Treasure
    html.find(".add-treasure").click(() => {
        builder.data.treasures.push({
            description: "",
            valueRange: "1-100", // Default value range
        });
        console.log("Treasure added:", builder.data.treasures);
        builder.render(false);
    });

    // Remove Treasure
    html.on("click", ".remove-treasure", (event) => {
        const index = $(event.currentTarget).closest(".treasure-entry").data("index");
        builder.data.treasures.splice(index, 1);
        console.log(`Treasure at index ${index} removed:`, builder.data.treasures);
        builder.render(false);
    });

    // Update Treasure Description
    html.on("change", ".treasure-description", (event) => {
        const index = $(event.currentTarget).closest(".treasure-entry").data("index");
        const description = event.currentTarget.value;
        builder.data.treasures[index].description = description;
        console.log(`Treasure at index ${index} updated:`, builder.data.treasures[index]);
    });

    // Handle Value Dropdown Change
    html.on("change", ".treasure-value-dropdown", (event) => {
        const index = $(event.currentTarget).closest(".treasure-entry").data("index");
        const valueRange = event.currentTarget.value;
        builder.data.treasures[index].valueRange = valueRange;
        console.log(`Treasure at index ${index} value range updated:`, builder.data.treasures[index]);
    });

    // Randomize Individual Treasure
    html.on("click", ".randomize-treasure", (event) => {
        const index = $(event.currentTarget).closest(".treasure-entry").data("index");
        const valueRange = builder.data.treasures[index].valueRange;
        builder.data.treasures[index].description = getRandomTreasure(valueRange);
        console.log(`Treasure at index ${index} randomized:`, builder.data.treasures[index]);
        builder.render(false);
    });

    // Example function to generate random treasure within value range
    function getRandomTreasure(valueRange) {
        const [min, max] = valueRange.split("-").map(Number);
        const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
        return `A treasure worth approximately ${randomValue} gp.`;
    }
}
