// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 640;
canvas.height = 480;

// Player properties
let playerX = canvas.width / 2;
let playerY = canvas.height - 50;
let playerSpeed = 5;
let playerRotation = 0;

// Asteroid properties
let asteroids = [];
let asteroidSpeed = 2;

// Level properties
let currentLevel = 1;
let levels = [
    {asteroidCount: 5, asteroidSpeed: 2},
    {asteroidCount: 10, asteroidSpeed: 3},
    {asteroidCount: 15, asteroidSpeed: 4}
];

// Sound effects
const explosionSound = document.getElementById('explosionSound');
const laserSound = document.getElementById('laserSound');

// Game loop
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    ctx.save();
    ctx.translate(playerX, playerY);
    ctx.rotate(playerRotation);
    ctx.fillStyle = 'blue';
    ctx.fillRect(-25, -25, 50, 50);
    ctx.restore();

    // Move and draw asteroids
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].y += asteroidSpeed;
        ctx.fillStyle = 'ed';
        ctx.fillRect(asteroids[i].x, asteroids[i].y, 30, 30);

        // Check for collision with player
        if (checkCollision(playerX, playerY, 50, 50, asteroids[i].x, asteroids[i].y, 30, 30)) {
            explosionSound.play();
            alert('Game Over!');
            return;
        }

        // Remove asteroids that are off the screen
        if (asteroids[i].y > canvas.height) {
            asteroids.splice(i, 1);
        }
    }

    // Randomly spawn new asteroids
    if (Math.random() < 0.05) {
        asteroids.push({
            x: Math.random() * (canvas.width - 30),
            y: 0
        });
    }

    // Update player position based on key presses
    if (rightPressed) {
        playerX += playerSpeed;
    }
    if (leftPressed) {
        playerX -= playerSpeed;
    }
    if (upPressed) {
        playerY -= playerSpeed;
    }
    if (downPressed) {
        playerY += playerSpeed;
    }

    // Ensure the player doesn't move off the screen
    if (playerX < 0) {
        playerX = 0;
    } else if (playerX > canvas.width - 50) {
        playerX = canvas.width - 50;
    }
    if (playerY < 0) {
        playerY = 0;
    } else if (playerY > canvas.height - 50) {
        playerY = canvas.height - 50;
    }

    // Request the next frame
    requestAnimationFrame(draw);
}

// Check for collision between two rectangles
function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 + w1 > x2 && x1 < x2 + w2 && y1 + h1 > y2 && y1 < y2 + h2) {
        return true;
    }
    return false;
}

// Key press variables
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

// Key event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key == 'Up' || e.key == 'ArrowUp') {
        upPressed = true;
    } else if (e.key == 'Down' || e.key == 'ArrowDown') {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    } else if (e.key == 'Up' || e.key == 'ArrowUp') {
        upPressed = false;
    } else if (e.key == 'Down' || e.key == 'ArrowDown') {
        downPressed = false;
    }
}

// Restart button event listener
document.getElementById('restartButton').addEventListener('click', restartGame);

function restartGame() {
    playerX = canvas.width / 2;
    playerY = canvas.height - 50;
    asteroids = [];
    currentLevel = 1;
    asteroidSpeed = 2;
}

// Reload button event listener
document.getElementById('reloadButton').addEventListener('click', reloadGame);

function reloadGame() {
    location.reload();
}

// Pause button event listener
document.getElementById('pauseButton').addEventListener('click', pauseGame);

function pauseGame() {
    cancelAnimationFrame(draw);
}

// Play button event listener
document.getElementById('playButton').addEventListener('click', playGame);

function playGame() {
    draw();
}

// Start the game loop
draw();
