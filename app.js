"use strict";
//to-do
//negative can be added with keyboard
//Add parentheses
//add history
//cleanup code
const numbers = document.getElementsByClassName("number");
const operationButtons = document.getElementsByClassName("operation");
const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
const deleteButton = document.getElementById("delete");
const dot = document.getElementById("dot");
const currentNumsBox = document.getElementsByClassName("current-nums-box")[0];
const negative = document.getElementById("negative");
const operations = ["+", "−", "×", "/", "^"];
const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const historyBox = document.getElementsByClassName("history-box")[0];
const buttonsBox = document.getElementsByClassName("buttons-box")[0];
const pastCalculations = document.getElementsByClassName("past-calculations")[0];
//temp solution
historyBox.style.minWidth = buttonsBox.clientWidth + "px";
historyBox.style.maxWidth = buttonsBox.clientWidth + "px";
historyBox.style.minHeight = buttonsBox.clientHeight - 4 + "px";
historyBox.style.maxHeight = buttonsBox.clientHeight - 4 + "px";
for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];
    number.addEventListener("click", () => {
        numberInput(i);
    });
}
window.addEventListener("keydown", (e) => {
    const input = e.key;
    if (digits.includes(input)) {
        numberInput(parseInt(e.key));
    }
    else if (input === "Enter" || input === "Return" || input === "=") {
        equals === null || equals === void 0 ? void 0 : equals.click();
    }
    else if (input === "Backspace" || input === "Delete") {
        deleteButton === null || deleteButton === void 0 ? void 0 : deleteButton.click();
    }
    else if (input === "Escape" || input === "Esc" || input === "c" || input === "C") {
        clear === null || clear === void 0 ? void 0 : clear.click();
    }
    else if (input === "+") {
        operationInput("+");
    }
    else if (input === "-" || input === "−") {
        operationInput("−");
    }
    else if (input === "×" || input === "*" || input === "x") {
        operationInput("×");
    }
    else if (input === "/") {
        operationInput("/");
    }
    else if (input === "^") {
        operationInput("^");
    }
    else if (input === ".") {
        dot === null || dot === void 0 ? void 0 : dot.click();
    }
});
function numberInput(number) {
    const num = number.toString();
    if (currentNumsBox.innerHTML.length === 1 && currentNumsBox.innerHTML[0] === "0") {
        currentNumsBox.innerHTML = num;
    }
    else {
        currentNumsBox.innerHTML += num;
    }
}
for (let i = 0; i < operationButtons.length; i++) {
    operationButtons[i].addEventListener("click", () => {
        const operation = operationButtons[i].innerHTML;
        operationInput(operation);
    });
}
function operationInput(operation) {
    const currentNumsLength = currentNumsBox.innerHTML.length;
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
    if (!checkEndsWithOperation() && !checkEndsWithDot() && containsOperation()) {
        const equation = currentNumsBox.innerHTML;
        currentNumsBox.innerHTML = calculate(currentNumsBox.innerHTML);
        const pastItem = document.createElement("li");
        pastItem.innerHTML = equation + " = " + currentNumsBox.innerHTML;
        pastCalculations.appendChild(pastItem);
        if (pastCalculations.children.length > 10) {
            pastCalculations.removeChild(pastCalculations.children[0]);
        }
    }
});
function containsOperation() {
    for (let i = 0; i < operations.length; i++) {
        if (currentNumsBox.innerHTML.includes(operations[i])) {
            return true;
        }
    }
    return false;
}
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
    else if (operation == "^") {
        return Math.pow(number1, number2);
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
    else if (str === "/") {
        return 2;
    }
    else {
        return 3;
    }
}
negative === null || negative === void 0 ? void 0 : negative.addEventListener("click", () => {
    if (checkEndsWithOperation()) {
        return;
    }
    else {
        let index = prevOperation(currentNumsBox.innerHTML) + 1;
        let currNum = currentNumsBox.innerHTML.substring(index);
        if (parseFloat(currNum) === 0) {
            return;
        }
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
