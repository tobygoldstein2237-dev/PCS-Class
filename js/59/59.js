"use strict";


function multiply(num1, num2) {
    return num1 * num2;
}

console.log(multiply(5, 2));      // 10
console.log(multiply(6, 3));      // 18
console.log(multiply(10, 4));     // 40



function getMultiplier() {
    return function (num1, num2) {
        return num1 * num2;
    };
}

const multiplyNumbers = getMultiplier();

console.log(multiplyNumbers(5, 2));    // 10
console.log(multiplyNumbers(6, 3));    // 18
console.log(multiplyNumbers(10, 4));   // 40



function getMultiplier(num1) {
    return function (num2) {
        return num1 * num2;
    };
}

const multiplyByFive = getMultiplier(5);
console.log(multiplyByFive(2));    // 10

const multiplyBySix = getMultiplier(6);
console.log(multiplyBySix(2));     // 12

const multiplyByTen = getMultiplier(10);
console.log(multiplyByTen(3));     // 30




function myEvery(array, callback) {
    for (let i = 0; i < array.length; i++) {
        if (!callback(array[i])) {
            return false;
        }
    }

    return true;
}

const letters = ["A", "B", "C"];

function isUppercase(letter) {
    return letter === letter.toUpperCase();
}

function isLowercase(letter) {
    return letter === letter.toLowerCase();
}

console.log("My every - uppercase:", myEvery(letters, isUppercase));
console.log("Built-in every - uppercase:", letters.every(isUppercase));

console.log("My every - lowercase:", myEvery(letters, isLowercase));
console.log("Built-in every - lowercase:", letters.every(isLowercase));





function mySome(array, callback) {
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i])) {
            return true;
        }
    }

    return false;
}

const letters = ["a", "B", "c"];

function isUppercase(letter) {
    return letter === letter.toUpperCase();
}

function isLowercase(letter) {
    return letter === letter.toLowerCase();
}

console.log("My some - uppercase:", mySome(letters, isUppercase));
console.log("Built-in some - uppercase:", letters.some(isUppercase));

console.log("My some - lowercase:", mySome(letters, isLowercase));
console.log("Built-in some - lowercase:", letters.some(isLowercase));