/**
 * Retrieves actor information from all NPCs in the game in a structured format.
 * @returns {Array<Object>} An array of objects containing actor details.
 */
export async function getLairActors() {
    let results = [];

    try {
        // Filter to include only NPC actors
        const actors = game.actors.filter((actor) => actor.type === "npc");
        console.log("Actors retrieved from the game:", actors);

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
    } catch (error) {
        console.error("getLairActors: Error retrieving actors from the game:", error);
    }

    return results;
}



/**
 * Sanitizes the "No. Appearing" value to ensure proper dice notation.
 * @param {string} value - The value to sanitize.
 * @returns {string} The sanitized value in dice notation.
 */
function sanitizeNumberAppearing(value) {
    // Remove parenthetical ranges, e.g., "2-12 (2d6)" → "2-12"
    value = value.replace(/\s*\(.*?\)/g, '').trim();
  
    // If already valid dice notation, return it cleaned up
    if (isDiceNotation(value)) return value.replace(/x/g, '*');
  
    // Otherwise, process the value for ranges or inconsistencies
    return correctNumberAppearing(value);
  }
  
  /**
   * Checks if a string is valid dice notation.
   * @param {string} str - The string to check.
   * @returns {boolean} True if the string is valid dice notation, otherwise false.
   */
  function isDiceNotation(str) {
    return /^(\d+d\d+(\+|-)\d+|\d+d\d+)$/.test(str); // Matches valid dice notations like 1d6, 3d10+2, etc.
  }
  
  /**
   * Converts ranges and inconsistent formats into proper dice notation.
   * @param {string} value - The input value to convert.
   * @returns {string} A valid dice notation (e.g., "1d6").
   */
  function correctNumberAppearing(value) {
    // Handle ranges like "1-6"
    if (value.includes('-')) {
      const [min, max] = value.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max) && min > 0 && max > 0) {
        const difference = max - min;
        if (difference === 0) return `1d1`; // Single constant range treated as 1d1
        if (min === 1) return `1d${difference + 1}`; // e.g., "1-6" → "1d6"
        return `1d${difference + 1}+${min - 1}`; // e.g., "2-6" → "1d5+1"
      }
    }
  
    // Handle raw single numbers (e.g., "6")
    if (/^\d+$/.test(value)) {
      return `1d${value}`; // e.g., "6" → "1d6"
    }
  
    // If invalid or unparseable, return a fallback
    return "1d1";
  }
  