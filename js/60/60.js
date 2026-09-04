"use strict";

function trackDosage(medicationName, initialDosage) {
    let dosage = initialDosage;
    const doctorPin = 1234;

    return {
        getInstructions: function () {
            return `Take ${dosage}mg of ${medicationName}`;
        },

        adjustDosage: function (pin, newDosage) {
            if (pin === doctorPin && newDosage > 0) {
                dosage = newDosage;
            } else {
                console.log("Error: Invalid PIN or dosage.");
            }
        }
    };
}


const aspirin = trackDosage("Aspirin", 50);

console.log(aspirin.getInstructions());


aspirin.adjustDosage(1234, 75);

console.log(aspirin.getInstructions());

aspirin.adjustDosage(9999, 100);

aspirin.adjustDosage(1234, 0);

console.log(aspirin.medicationName);

console.log(aspirin.dosage);