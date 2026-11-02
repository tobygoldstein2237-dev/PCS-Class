function Vehicle(color) {
    this.color = color;
    this.speed = 0;
}

Vehicle.prototype.go = function (speed) {
    this.speed = speed;
    console.log(`Now going at speed ${this.speed}`);
};

Vehicle.prototype.print = function () {
    console.log(`Color: ${this.color}, Speed: ${this.speed}`);
};


function Plane(color) {
    Vehicle.call(this, color);
}

Plane.prototype = Object.create(Vehicle.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.go = function (speed) {
    this.speed = speed;
    console.log(`Now FLYING at speed ${this.speed}`);
};


// Test
const vehicle = new Vehicle("red");
const plane = new Plane("blue");

vehicle.go(60);
vehicle.print();

plane.go(500);
plane.print();

console.log(vehicle);
console.log(plane);