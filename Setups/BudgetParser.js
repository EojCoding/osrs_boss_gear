function checkBudgetInput(userBudget) {
    let kPattern = /([0-9]+k)|([0-9]+\.[0-9]+k)/;
    let mPattern = /([0-9]+m)|([0-9]+\.[0-9]+m)/;
    let bPattern = /([0-9]+b)|([0-9]+\.[0-9]+b)/;
    let numPattern = /[0-9]+/;
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
}

module.exports = checkBudgetInput;