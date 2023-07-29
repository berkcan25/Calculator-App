"use strict";
//to-do
//numbers can be typed with keyboard
//add exponent button
//Add parentheses
const numbers = document.getElementsByClassName("number");
const operationButtons = document.getElementsByClassName("operation");
const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
const deleteButton = document.getElementById("delete");
const dot = document.getElementById("dot");
const currentNumsBox = document.getElementsByClassName("current-nums-box")[0];
const negative = document.getElementById("negative");
const operations = ["+", "−", "×", "/"];
for (let i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener("click", () => {
        if (currentNumsBox.innerHTML.length === 1 && currentNumsBox.innerHTML[0] === "0") {
            currentNumsBox.innerHTML = numbers[i].innerHTML;
        }
        else {
            currentNumsBox.innerHTML += numbers[i].innerHTML;
        }
    });
}
for (let i = 0; i < operationButtons.length; i++) {
    operationButtons[i].addEventListener("click", () => {
        const currentNumsLength = currentNumsBox.innerHTML.length;
        const operation = operationButtons[i].innerHTML;
        if (checkEndsWithDot()) {
            return;
        }
        if (!checkEndsWithOperation()) {
            currentNumsBox.innerHTML += operation;
        }
        else {
            let newInnerHTML = currentNumsBox.innerHTML.substring(0, currentNumsLength - 1);
            newInnerHTML += operation;
            currentNumsBox.innerHTML = newInnerHTML;
        }
    });
}
clear === null || clear === void 0 ? void 0 : clear.addEventListener("click", () => {
    currentNumsBox.innerHTML = "0";
});
deleteButton === null || deleteButton === void 0 ? void 0 : deleteButton.addEventListener("click", () => {
    if (currentNumsBox.innerHTML.length > 1) {
        currentNumsBox.innerHTML = currentNumsBox.innerHTML.substring(0, currentNumsBox.innerHTML.length - 1);
    }
    else {
        currentNumsBox.innerHTML = "0";
    }
});
equals === null || equals === void 0 ? void 0 : equals.addEventListener("click", () => {
    if (!checkEndsWithOperation() && !checkEndsWithDot()) {
        currentNumsBox.innerHTML = calculate(currentNumsBox.innerHTML);
    }
});
function checkEndsWithOperation() {
    const currentNums = currentNumsBox.innerHTML;
    if (operations.includes(currentNums[currentNums.length - 1])) {
        return true;
    }
    else {
        return false;
    }
}
function checkEndsWithDot() {
    const currentNums = currentNumsBox.innerHTML;
    if (currentNums[currentNums.length - 1] === ".") {
        return true;
    }
    else {
        return false;
    }
}
function calculate(str) {
    const operations = ['+', '−', '×', '/'];
    let orderedOperations = new Map();
    let sum = 0;
    let tokens = [];
    let tempNum = "";
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (operations.includes(char)) {
            tokens.push(tempNum);
            tokens.push(char);
            orderedOperations.set(char, priority(char));
            tempNum = "";
        }
        else {
            tempNum += char;
        }
        if (i === str.length - 1) {
            tokens.push(tempNum);
        }
    }
    orderedOperations = new Map([...orderedOperations.entries()].sort((a, b) => b[1] - a[1]));
    while (orderedOperations.size !== 0) {
        let currOperation = orderedOperations.keys().next().value;
        let operationIndex = tokens.indexOf(currOperation);
        let num1Index = operationIndex - 1;
        let num2Index = operationIndex + 1;
        let num1 = parseFloat(tokens[num1Index]);
        let num2 = parseFloat(tokens[num2Index]);
        sum = executeCalc(num1, num2, currOperation);
        tokens.splice(num1Index, 3, sum.toString());
        orderedOperations.delete(currOperation);
    }
    return tokens[0];
}
function executeCalc(number1, number2, operation) {
    if (operation == "+") {
        return number1 + number2;
    }
    else if (operation == "−") {
        return number1 - number2;
    }
    else if (operation == "×") {
        return number1 * number2;
    }
    else if (operation == "/") {
        return number1 / number2;
    }
    else {
        return number1;
    }
}
function priority(str) {
    if (str === "+") {
        return 1;
    }
    else if (str === "−") {
        return 1;
    }
    else if (str === "×") {
        return 2;
    }
    else {
        return 2;
    }
}
negative === null || negative === void 0 ? void 0 : negative.addEventListener("click", () => {
    if (checkEndsWithOperation()) {
        return;
    }
    let lastNum = latestNum(currentNumsBox.innerHTML)[0];
    let lastNumStart = latestNum(currentNumsBox.innerHTML)[1];
    if (hasNegative(lastNum)) {
        lastNum = lastNum.substring(1, lastNum.length);
    }
    else {
        lastNum = "-" + lastNum;
    }
    currentNumsBox.innerHTML = currentNumsBox.innerHTML.substring(0, lastNumStart) + lastNum;
});
function prevOperation(str) {
    let index = -1;
    for (let i = str.length - 1; i > -1; i--) {
        const char = str[i];
        if (operations.includes(char)) {
            return i + 1;
        }
    }
    return index;
}
dot === null || dot === void 0 ? void 0 : dot.addEventListener("click", () => {
    if (checkEndsWithOperation()) {
        const lastOperation = prevOperation(currentNumsBox.innerHTML);
        currentNumsBox.innerHTML = currentNumsBox.innerHTML.substring(0, lastOperation) + "0.";
    }
    else {
        const numAndIndex = latestNum(currentNumsBox.innerHTML);
        let lastNum = numAndIndex[0];
        let lastNumStart = numAndIndex[1];
        const dotIndex = hasDecimal(lastNum);
        currentNumsBox.innerHTML = dotIndex === -1 ? currentNumsBox.innerHTML.substring(0, lastNumStart + lastNum.length) + "." : currentNumsBox.innerHTML.substring(0, lastNumStart + dotIndex);
    }
});
function latestNum(str) {
    let index = prevOperation(str);
    if (index === -1) {
        return [str, 0];
    }
    let newStr = str.substring(index);
    return [newStr, index];
}
function hasNegative(str) {
    if (str.includes("-")) {
        return true;
    }
    else {
        return false;
    }
}
function hasDecimal(str) {
    let index = str.indexOf(".");
    return index;
}
