/**
 * wsLairActors.js
 * A helper module to retrieve actor information from specified folders in a structured format.
 */

/**
 * Retrieves actor information from specified folders in the Actors directory.
 * @param {Array<string>} folderNames - An array of folder names to search for.
 * @returns {Array<Object>} An array of objects containing actor details.
 */
export async function getLairActors(folderNames) {
    // Validate input
    if (!Array.isArray(folderNames) || folderNames.length === 0) {
        console.warn("getLairActors: folderNames must be a non-empty array.");
        return [];
    }

    // Filter the folders in the Actors section with the specified names
    const matchingFolders = game.folders.filter(
        folder => folder.type === "Actor" && folderNames.includes(folder.name)
    );

    if (matchingFolders.length === 0) {
        console.warn("getLairActors: No matching folders found.");
        return [];
    }

    // Collect results
    let results = [];
    for (const folder of matchingFolders) {
        const actors = game.actors.filter(actor => actor.folder?.id === folder.id);

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
