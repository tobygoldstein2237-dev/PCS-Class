const theCanvas = document.querySelector('#theCanvas');
const context = theCanvas.getContext('2d');
const SNAKE_SIZE = 64;

function sizeCanvas() {
    // Keep the canvas dimensions divisible by 64 so the grid lines up.
    theCanvas.width = Math.max(SNAKE_SIZE * 2,
        Math.floor((window.innerWidth - 20) / SNAKE_SIZE) * SNAKE_SIZE);
    theCanvas.height = Math.max(SNAKE_SIZE * 2,
        Math.floor((window.innerHeight - 170) / SNAKE_SIZE) * SNAKE_SIZE);
}
sizeCanvas();

const snakeHead = document.createElement('img');
snakeHead.src = 'snakeHead.png';

let snake;
let apple;
let direction;
let nextDirection;
let score;
let speed;
let gameOver;
let timer;

// Play sounds without needing separate sound files.
function playSound(frequency, duration) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audio = new AudioContextClass();
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    oscillator.connect(volume);
    volume.connect(audio.destination);
    oscillator.frequency.value = frequency;
    volume.gain.value = 0.12;
    oscillator.start();
    oscillator.stop(audio.currentTime + duration);
    oscillator.onended = () => audio.close();
}

function placeApple() {
    const columns = theCanvas.width / SNAKE_SIZE;
    const rows = theCanvas.height / SNAKE_SIZE;
    // Avoid putting the apple directly on the snake.
    const freeSquares = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const x = col * SNAKE_SIZE;
            const y = row * SNAKE_SIZE;
            if (!snake.some(part => part.x === x && part.y === y)) {
                freeSquares.push({ x, y });
            }
        }
    }
    if (freeSquares.length === 0) {
        endGame('You win!');
        return;
    }
    apple = freeSquares[Math.floor(Math.random() * freeSquares.length)];
}

function drawApple() {
    // A red apple drawn inside one 64 x 64 grid square.
    const centerX = apple.x + 32;
    const centerY = apple.y + 35;
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(centerX - 9, centerY, 17, 0, Math.PI * 2);
    context.arc(centerX + 9, centerY, 17, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = 'green';
    context.beginPath();
    context.ellipse(centerX + 8, centerY - 20, 10, 5, -0.5, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = 'brown';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(centerX, centerY - 14);
    context.lineTo(centerX + 2, centerY - 25);
    context.stroke();
}

function draw() {
    context.clearRect(0, 0, theCanvas.width, theCanvas.height);
    if (apple) drawApple();
    snake.forEach((part, index) => {
        if (index === 0 && snakeHead.complete && snakeHead.naturalWidth) {
            context.drawImage(snakeHead, part.x, part.y, SNAKE_SIZE, SNAKE_SIZE);
        } else {
            context.fillStyle = '#49a943';
            context.fillRect(part.x + 5, part.y + 5, SNAKE_SIZE - 10, SNAKE_SIZE - 10);
        }
    });
    context.fillStyle = 'darkgreen';
    context.font = 'bold 24px Arial';
    context.fillText(`Score: ${score}`, 12, 28);
}

function endGame(message = 'Game Over!') {
    gameOver = true;
    clearTimeout(timer);
    playSound(180, 0.45);
    draw();
    context.fillStyle = 'rgba(255, 255, 255, 0.85)';
    context.fillRect(0, theCanvas.height / 2 - 50, theCanvas.width, 100);
    context.fillStyle = 'darkred';
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.fillText(message, theCanvas.width / 2, theCanvas.height / 2);
    context.textAlign = 'left';
}

function moveSnake() {
    if (gameOver) return;
    direction = nextDirection;
    const head = { ...snake[0] };

    switch (direction) {
        case 'ArrowUp': head.y -= SNAKE_SIZE; break;
        case 'ArrowDown': head.y += SNAKE_SIZE; break;
        case 'ArrowLeft': head.x -= SNAKE_SIZE; break;
        case 'ArrowRight': head.x += SNAKE_SIZE; break;
    }

    // End the game if the head touches a wall.
    if (head.x < 0 || head.y < 0 ||
        head.x >= theCanvas.width || head.y >= theCanvas.height) {
        endGame();
        return;
    }

    const ateApple = head.x === apple.x && head.y === apple.y;
    // The tail moves away unless an apple is eaten.
    const bodyToCheck = ateApple ? snake : snake.slice(0, -1);
    if (bodyToCheck.some(part => part.x === head.x && part.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);
    if (ateApple) {
        score++;
        speed = Math.max(100, speed - 20);
        playSound(650, 0.12);
        placeApple();
    } else {
        snake.pop();
    }

    if (gameOver) return;
    draw();
    timer = setTimeout(moveSnake, speed);
}

function startGame() {
    clearTimeout(timer);
    snake = [{ x: 0, y: 0 }];
    direction = 'ArrowRight';
    nextDirection = 'ArrowRight';
    score = 0;
    speed = 500;
    gameOver = false;
    apple = null;
    placeApple();
    draw();
    timer = setTimeout(moveSnake, speed);
}

window.addEventListener('keydown', e => {
    const opposites = {
        ArrowUp: 'ArrowDown', ArrowDown: 'ArrowUp',
        ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft'
    };
    if (opposites[e.key]) {
        e.preventDefault();
        // Don't let the snake turn directly backward into itself.
        if (e.key !== opposites[direction]) nextDirection = e.key;
    }
});

document.querySelector('#restart').addEventListener('click', startGame);
window.addEventListener('resize', () => {
    sizeCanvas();
    startGame();
});
snakeHead.onload = draw;
startGame();
