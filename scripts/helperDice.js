/**
 * Parses a dice expression (e.g., "1d20+5") and returns the rolled result.
 * If the input is not a dice expression, it returns the input as-is.
 *
 * @param {string} expression - The dice expression to parse.
 * @returns {number|string} The evaluated numeric result or the input string if not a dice expression.
 */
export function parseDiceExpression(expression) {
  const diceRegex = /(\d+)d(\d+)([+\-*\/]?\d+)?/; // Regex to match dice expressions
  const match = expression.match(diceRegex);

  if (!match) {
    // If it's not a dice expression, return the value as-is
    return expression;
  }

  const [, numRolls, dieSize, modifier] = match;

  // Roll the dice
  let total = 0;
  for (let i = 0; i < parseInt(numRolls); i++) {
    total += Math.floor(Math.random() * parseInt(dieSize)) + 1;
  }

  // Apply the modifier if present
  if (modifier) {
    const operator = modifier.charAt(0);
    const value = parseInt(modifier.slice(1));

    switch (operator) {
      case "+":
        total += value;
        break;
      case "-":
        total -= value;
        break;
      case "*":
        total *= value;
        break;
      case "/":
        total = Math.floor(total / value); // Integer division
        break;
    }
  }

  return total; // Return the numeric result
}

/**
 * Parses a dice expression and appends the context-specific unit or suffix.
 * If the input is not a dice expression, it returns the input as-is.
 *
 * @param {string} expression - The dice expression to parse.
 * @param {string} suffix - The unit or descriptor to append (e.g., "feet", "encounters").
 * @returns {string} The evaluated result with the suffix appended.
 */
export function parseDiceExpressionWithSuffix(expression, suffix = "") {
  const result = parseDiceExpression(expression);

  // Only append the suffix if the result is a number
  if (typeof result === "number") {
    return `${result} ${suffix}`.trim();
  }

  return result; // Return the result as-is if it's not a dice expression
}
