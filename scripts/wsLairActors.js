/**
 * Retrieves actor information from specified compendiums in a structured format.
 * @param {Array<string>} compendiumNames - An array of compendium names to search for.
 * @returns {Array<Object>} An array of objects containing actor details.
 */
export async function getLairActors(compendiumNames) {
    // Validate input
    if (!Array.isArray(compendiumNames) || compendiumNames.length === 0) {
        console.warn("getLairActors: compendiumNames must be a non-empty array.");
        return [];
    }

    let results = [];

    try {
        for (const compendiumName of compendiumNames) {
            // Access the compendium
            const compendium = game.packs.get(compendiumName);
            if (!compendium) {
                console.warn(`getLairActors: Compendium '${compendiumName}' not found.`);
                continue;
            }

            // Load all actor documents from the compendium
            const actors = await compendium.getDocuments();
            console.log(`Actors retrieved from compendium '${compendiumName}':`, actors);

            // Extract actor details
            for (const actor of actors) {
                const id = actor.id || "N/A";
                const name = actor.name || "N/A";
                const str = actor.system?.abilities?.str?.value || "N/A";
                const dex = actor.system?.abilities?.dex?.value || "N/A";
                const con = actor.system?.abilities?.con?.value || "N/A";
                const int = actor.system?.abilities?.int?.value || "N/A";
                const wis = actor.system?.abilities?.wis?.value || "N/A";
                const cha = actor.system?.abilities?.cha?.value || "N/A";
                const movement = actor.system?.attributes?.movement?.text || "N/A";
                const hitdice = actor.system?.hitdice || "N/A";
                const thac0 = actor.system?.attributes?.thaco?.value || "N/A";
                const numAttacks = actor.system?.numberAttacks || "N/A";
                const damage = actor.system?.damage || "N/A";
                const specialAttacks = actor.system?.specialAttacks || "N/A";
                const specialDefenses = actor.system?.specialDefenses || "N/A";
                const magicResist = actor.system?.magicresist || "N/A";
                const size = actor.system?.attributes?.size || "N/A";
                const alignment = actor.system?.details?.alignment || "N/A";
                const xp = actor.system?.xp?.value || "N/A";
                let numberAppearing = actor.system?.numberAppearing || "N/A";
                const treasureType = actor.system?.treasureType || "N/A";

                // Sanitize number appearing
                numberAppearing = sanitizeNumberAppearing(numberAppearing);

                // Add actor details to results
                results.push({
                    id,
                    name,
                    str,
                    dex,
                    con,
                    int,
                    wis,
                    cha,
                    movement,
                    hitdice,
                    thac0,
                    numAttacks,
                    damage,
                    specialAttacks,
                    specialDefenses,
                    magicResist,
                    size,
                    alignment,
                    xp,
                    numberAppearing,
                    treasureType,
                });
            }
        }
    } catch (error) {
        console.error("getLairActors: Error retrieving actors from compendiums:", error);
    }

    return results;
}


/**
 * Sanitizes the "No. Appearing" value to ensure proper dice notation.
 * @param {string} value - The value to sanitize.
 * @returns {string} The sanitized value.
 */
function sanitizeNumberAppearing(value) {
    // Remove parenthetical ranges, e.g., "2-12 (2d6)" → "2-12"
    value = value.replace(/\s*\(.*?\)/g, '');

    // If already dice notation, return cleaned up
    if (isDiceNotation(value)) return value.replace(/x/g, '*');

    // Correct ranges or fallback to cleaned up string
    return correctNumberAppearing(value);
}

/**
 * Checks if a string is already valid dice notation.
 * @param {string} str - The string to check.
 * @returns {boolean} True if the string is valid dice notation, otherwise false.
 */
function isDiceNotation(str) {
    return /^(\d+d\d+(\*\d+)?|\d+)$/.test(str); // Matches valid dice notations like 1d6, 3d10*10, or single numbers
}

/**
 * Converts range values (e.g., "1-2") into proper dice notation.
 * @param {string} range - The range string to convert.
 * @returns {string} The converted dice notation.
 */
function correctNumberAppearing(range) {
    if (!range.includes('-')) return range.replace(/x/g, '*'); // Replace 'x' with '*' if no range

    const [min, max] = range.split('-').map(Number);
    if (isNaN(min) || isNaN(max)) return range.replace(/x/g, '*'); // Return as is if parsing fails

    const difference = max - min;
    if (difference === 0) {
        return `1d${max}`; // Simple single die if no variation
    } else if (difference > 0) {
        if (min === 1) {
            return `1d${difference + 1}`; // Example: 1-4 → 1d4
        } else {
            return `1d${difference + 1}+${min - 1}`; // Example: 2-5 → 1d4+1
        }
    }
    return range.replace(/x/g, '*'); // Fallback with corrected multiplication
}
