const theCanvas = document.querySelector('#theCanvas');
const context = theCanvas.getContext('2d');

const colorInput = document.querySelector('#color');
const radiusInput = document.querySelector('#radius');
const addBallButton = document.querySelector('#addBall');

function sizeCanvas() {
    theCanvas.width = window.innerWidth;
    theCanvas.height = window.innerHeight - document.querySelector('#controls').offsetHeight;
}

sizeCanvas();
window.addEventListener('resize', sizeCanvas);

const balls = [];

class Ball {
    constructor(radius, color) {
        this.radius = radius;
        this.color = color;

        this.x = radius + 1;
        this.y = radius + 1;

        this.dx = 2;
        this.dy = 3;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < this.radius ||
            this.x >= theCanvas.width - this.radius) {
            this.dx = -this.dx;
        }

        if (this.y < this.radius ||
            this.y >= theCanvas.height - this.radius) {
            this.dy = -this.dy;
        }
    }

    draw() {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }
}

addBallButton.addEventListener('click', () => {
    const color = colorInput.value;
    const radius = Number(radiusInput.value);

    if (radius < 5 || radius > 150 || !Number.isFinite(radius)) {
        alert('Please enter a radius between 5 and 150');
        return;
    }

    if (radius * 2 > theCanvas.width ||
        radius * 2 > theCanvas.height) {
        alert('That ball is too big for the canvas');
        return;
    }

    const ball = new Ball(radius, color);
    balls.push(ball);
});

setInterval(() => {
    context.clearRect(0, 0, theCanvas.width, theCanvas.height);

    balls.forEach(ball => {
        ball.move();
        ball.draw();
    });

}, 10);