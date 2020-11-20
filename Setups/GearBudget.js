const total = require("../Items/TotalPrices");
const logger = require("../Logs/Logger");

/**
 * Parses the user budget input to allow them to use syntax such as "500m", "50.2b" etc
 * @param userBudget Budget given by the user
 * @returns A float for success, or -1 if unsuccessful
 */
function checkBudgetInput(userBudget) {
    let kPattern = /([0-9]+k)|([0-9]+\.[0-9]+k)/;
    let mPattern = /([0-9]+m)|([0-9]+\.[0-9]+m)/;
    let bPattern = /([0-9]+b)|([0-9]+\.[0-9]+b)/;
    let numPattern = /[0-9]+/;
    try {
        if (userBudget.match(kPattern)) {
            userBudget.replace("k", "");
            return parseFloat(userBudget) * 1000;
        }
        else if (userBudget.match(mPattern)) {
            userBudget.replace("m", "");
            return parseFloat(userBudget) * 1000000;
        }
        else if (userBudget.match(bPattern)) {
            userBudget.replace("b", "");
            return parseFloat(userBudget) * 1000000000;
        }
        else if (userBudget.match(numPattern)) {
            return userBudget;
        }
        else {
            return -1;
        }
    } catch (e) {
        logger.logErrors("Passed in userBudget does not match: " + e);
    }
}

/**
 * Looks at all the setups for a boss and chooses the setup according to budget
 * @param budget This is a float value
 * @param setups This is a nested JSON object with all gear sets
 */
function getSetupToUse(budget, setups) {
    let map = new Map();
    let setupToUse;
    for (let i = setups.size; i >= 1; i--) {
        map.set(total(setups[i.toString()]), setups[i.toString()]);
    }
    // Sort the map by total value of the set
    let sortedMap = new Map([...map.entries()].sort());
    let biggest = 0;
    for (const [key,value] of sortedMap.entries()) {
        // If the given budget is bigger than the key, set this setup as the one to use, then go next
        if (budget >= key && key >= biggest) {
            biggest = key;
            setupToUse = value;
        }
    }
    return setupToUse;
}

module.exports = {
    checkBudgetInput,
    getSetupToUse
};