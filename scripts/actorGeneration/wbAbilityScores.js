export async function rollMethodI() {
    const abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

    // Roll 3d6 for each ability
    const rolls = await Promise.all(
        abilities.map(async () => {
            const diceRoll = new Roll("3d6");
            await diceRoll.evaluate();

            if (game.dice3d) await game.dice3d.showForRoll(diceRoll);

            return {
                total: diceRoll.total,
                individualRolls: diceRoll.dice[0].results.map((r) => r.result),
            };
        })
    );

    return rolls;
}

export async function rollMethodII() {
    const abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

    // Roll 3d6 twice for each ability
    const rolls = await Promise.all(
        abilities.map(async () => {
            // Create two rolls
            const roll1 = new Roll("3d6");
            const roll2 = new Roll("3d6");

            // Evaluate rolls asynchronously
            await roll1.evaluate();
            await roll2.evaluate();

            // Trigger Dice So Nice animations if available
            if (game.dice3d) {
                await game.dice3d.showForRoll(roll1);
                await game.dice3d.showForRoll(roll2);
            }

            // Select the higher roll
            const chosenRoll = roll1.total >= roll2.total ? roll1 : roll2;

            // Sort individual dice rolls
            const sortedIndividualRolls = chosenRoll.dice[0]?.results
                .map((r) => r.result)
                .sort((a, b) => a - b) || [];

            return {
                total: chosenRoll.total,
                individualRolls: sortedIndividualRolls, // Store sorted rolls
            };
        })
    );

    return rolls;
}


export async function rollMethodIII() {
    const abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

    // Roll 3d6 twice for each ability
    const rolls = await Promise.all(
        abilities.map(async () => {
            // Create two rolls
            const roll1 = new Roll("3d6");
            const roll2 = new Roll("3d6");

            // Evaluate rolls asynchronously
            await roll1.evaluate();
            await roll2.evaluate();

            // Trigger Dice So Nice animations if available
            if (game.dice3d) {
                await game.dice3d.showForRoll(roll1);
                await game.dice3d.showForRoll(roll2);
            }

            // Select the higher roll
            const chosenRoll = roll1.total >= roll2.total ? roll1 : roll2;

            return {
                total: chosenRoll.total,
                individualRolls: chosenRoll.dice[0]?.results.map((r) => r.result) || [],
            };
        })
    );

    // Sort rolls from highest to lowest total
    rolls.sort((a, b) => b.total - a.total);

    return rolls;
}


















export async function rollMethodIV() {
    const rolls = await Promise.all(
        [...Array(12)].map(async () => {
            const diceRoll = new Roll("3d6");
            await diceRoll.evaluate();

            if (game.dice3d) await game.dice3d.showForRoll(diceRoll);

            return {
                total: diceRoll.total,
                individualRolls: diceRoll.dice[0].results.map((r) => r.result),
            };
        })
    );

    rolls.sort((a, b) => b.total - a.total); // Sort rolls from highest to lowest
    const topRolls = rolls.slice(0, 6); // Select the top six rolls

    return { allRolls: rolls, topRolls };
}

export async function rollMethodV() {
    const rolls = await Promise.all(
        [...Array(6)].map(async () => {
            const diceRoll = new Roll("4d6");
            await diceRoll.evaluate();

            if (game.dice3d) await game.dice3d.showForRoll(diceRoll);

            const individualRolls = diceRoll.dice[0].results.map((r) => r.result);
            individualRolls.sort((a, b) => a - b); // Sort to identify the lowest roll
            const total = individualRolls.slice(1).reduce((sum, roll) => sum + roll, 0); // Sum top three rolls

            return {
                total,
                individualRolls,
            };
        })
    );

    return rolls;
}

export async function rollMethodVI() {
    const rolls = await Promise.all(
        [...Array(7)].map(async () => {
            const diceRoll = new Roll("1d6");
            await diceRoll.evaluate();

            if (game.dice3d) await game.dice3d.showForRoll(diceRoll);

            return {
                total: diceRoll.total,
                individualRoll: diceRoll.dice[0].results[0].result,
            };
        })
    );

    return rolls;
}
