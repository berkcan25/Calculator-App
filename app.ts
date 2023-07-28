//to-do
//numbers can be typed with keyboard
//add exponent button
//fix PEMDAS
//Maybe add a priority queue that sorts the operations by priority
//Add parentheses



const numbers = document.getElementsByClassName("number")
const operationButtons = document.getElementsByClassName("operation")
const equals = document.getElementById("equals")
const clear = document.getElementById("clear")
const deleteButton = document.getElementById("delete")
const dot = document.getElementById("dot")
const currentNumsBox = document.getElementsByClassName("current-nums-box")[0]
const negative = document.getElementById("negative")
const operations = ["+", "−", "×", "/"]


for (let i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener("click", () => {
        if (currentNumsBox.innerHTML.length === 1 && currentNumsBox.innerHTML[0] === "0") {
            currentNumsBox.innerHTML = numbers[i].innerHTML
        } else {
            currentNumsBox.innerHTML += numbers[i].innerHTML
        }
    })
}

for (let i = 0; i < operationButtons.length; i++) {
    operationButtons[i].addEventListener("click", () => {
        const currentNumsLength = currentNumsBox.innerHTML.length
        const operation = operationButtons[i].innerHTML
        if (checkEndsWithDot()) {return}
        if (!checkEndsWithOperation()) {
            currentNumsBox.innerHTML += operation
        } else {
            let newInnerHTML = currentNumsBox.innerHTML.substring(0, currentNumsLength - 1)
            newInnerHTML += operation
            currentNumsBox.innerHTML = newInnerHTML
        }
    })
}

clear?.addEventListener("click", () => {
    currentNumsBox.innerHTML = "0"
})

deleteButton?.addEventListener("click", () => {
    if (currentNumsBox.innerHTML.length > 1) {
        currentNumsBox.innerHTML = currentNumsBox.innerHTML.substring(0,currentNumsBox.innerHTML.length-1);
    } else {
        currentNumsBox.innerHTML = "0"
    }
})


equals?.addEventListener("click", () => {
    if (!checkEndsWithOperation() && !checkEndsWithDot()) {
        currentNumsBox.innerHTML = calculate(currentNumsBox.innerHTML)
    }
})

function checkEndsWithOperation() : Boolean {
    const currentNums = currentNumsBox.innerHTML;
    if (operations.includes(currentNums[currentNums.length-1])) {
        return true
    } else {
        return false
    }
}

function checkEndsWithDot() : Boolean {
    const currentNums = currentNumsBox.innerHTML;
    if (currentNums[currentNums.length-1] === ".") {
        return true
    } else {
        return false
    }
}

function calculate(str: string) : string {
    //adding everything to sets
    let lastNumStart = 0
    let lastNumEnd = 1
    let sum
    let nums = []
    let currOperations = []
    let tempNum = ""
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (operations.includes(char)) {
            currOperations.push(char)
            nums.push(tempNum)
            tempNum = ""
        } else {
            tempNum += char
        }
    }
    nums.push(tempNum)
    if (nums.length === 1) {
        return nums[0]
    }
    while (nums.length !== 0) {
        let numStr = nums.shift()
        let num = parseFloat(numStr?numStr:"0") 
        let operation = currOperations.shift()
        if (operation === undefined) {
            return "0"
        }
        if (sum === undefined) {
            sum = num
            numStr = nums.shift()
            num = parseFloat(numStr?numStr:"")
            sum = executeCalc(sum, num, operation)
        } else {
            sum = executeCalc(sum, num, operation)
        }
    }
    return sum?sum.toString():"0"
}

function executeCalc(number1: number, number2: number, operation: string) {
    if (operation == "+") {
        return number1 + number2
    } else if (operation == "−") {
        return number1 - number2
    } else if (operation == "×") {
        return number1 * number2
    } else if (operation == "/") {
        return number1 / number2
    } else {
        return number1
    }
}

negative?.addEventListener("click", () => {
    if (checkEndsWithOperation()) {
        return;
    }
    let lastNum = <string>latestNum(currentNumsBox.innerHTML)[0]
    let lastNumStart = <number>latestNum(currentNumsBox.innerHTML)[1]
    if (hasNegative(lastNum)) {
        lastNum = lastNum.substring(1, lastNum.length)
    } else {
        lastNum = "-" + lastNum
    }
    currentNumsBox.innerHTML = currentNumsBox.innerHTML.substring(0, lastNumStart) + lastNum
})

function prevOperation(str: string) {
    let index = -1;
    for (let i = str.length - 1; i > -1; i--) {
        const char = str[i];
        if (operations.includes(char)) {
            return i+1;
        }
    }
    return index;
}

dot?.addEventListener("click", () => {
    if (checkEndsWithOperation()) {
        const lastOperation = prevOperation(currentNumsBox.innerHTML)
        currentNumsBox.innerHTML = currentNumsBox.innerHTML.substring(0,lastOperation) + "0.";
    } else {
        const numAndIndex = latestNum(currentNumsBox.innerHTML)
        let lastNum = <string>numAndIndex[0]
        let lastNumStart = <number>numAndIndex[1]
        const dotIndex = hasDecimal(lastNum)
        currentNumsBox.innerHTML = dotIndex === -1?currentNumsBox.innerHTML.substring(0,lastNumStart+lastNum.length) + ".":currentNumsBox.innerHTML.substring(0,lastNumStart+dotIndex)
    }
})

function latestNum(str: string) {
    let index = prevOperation(str);
    if (index === -1) {
        return [str, 0];
    }
    let newStr = str.substring(index);
    return [newStr, index];
}


function hasNegative(str: string) {
    if (str.includes("-")) {
        return true;
    }
    else {
        return false;
    }
}

function hasDecimal(str: string) {
    let index = str.indexOf(".")
    return index
}


