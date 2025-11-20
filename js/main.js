const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE_WIDTH = 127;
const TILE_HEIGHT = 76;
const ROWS = 9;
const COLS = 6;
let delay = 1;


//automatic map resize
canvas.width = COLS +680; // did this so i can fix colliders with the player and right wall
canvas.height = ROWS * TILE_HEIGHT;

//load enemy image
const carImage = new Image();
carImage.src = 'assets/longcar.webp';


// Load player image
const playerImage = new Image();
playerImage.src = 'assets/player.ico';

const player = {
    x: 2 * TILE_WIDTH,
    y: (ROWS - 1) * TILE_HEIGHT,
    width: 50,
    height: 50,
    img: playerImage,
    reset: function () {
        this.x = 2 * TILE_WIDTH;
        this.y = (ROWS - 1) * TILE_HEIGHT;
    }
};


// Enemy class
class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 70;
        this.speed = speed;
        this.img = carImage;
    }
    update(dt) {
        this.x += this.speed * dt;

        // If moving right and goes off screen
        if (this.speed > 0 && this.x > canvas.width) {
            this.x = -this.width;
        }

        // If moving left and goes off screen
        if (this.speed < 0 && this.x < -this.width) {
            this.x = canvas.width;
        }
    }


    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}


// Create enemies
const enemies = [
    new Enemy(0, 7 * TILE_HEIGHT, -150), //last number is speed
    new Enemy(200, 6 * TILE_HEIGHT, 150),// second number is row
    new Enemy(100, 5 * TILE_HEIGHT, -100),// first number is starting position
    new Enemy(300, 3 * TILE_HEIGHT, -250),
    new Enemy(-100, 2 * TILE_HEIGHT, 100),
    new Enemy(200, 1 * TILE_HEIGHT, -200),// to add more cars on the same row duplicate the enemy only change start pos ( distance for the cars on the same row ) for more cars in one row
];

// Collision detection
function checkCollision(player, enemy) {
    return !(player.x + player.width < enemy.x ||
        player.x > enemy.x + enemy.width ||
        player.y + player.height < enemy.y ||
        player.y > enemy.y + enemy.height);
}

// Game state
let score = 0;
const scoreEl = document.getElementById('score');

// movement (Arrow Keys)
document.addEventListener('keydown', (e) => {
    switch (e.key) {

        case 'ArrowUp':
            if (player.y - TILE_HEIGHT >= 0) //change vertical jump distance
                player.y -= TILE_HEIGHT;
            break;

        case 'ArrowDown':
            if (player.y + TILE_HEIGHT < canvas.height) 
                player.y += TILE_HEIGHT;
            break;

        case 'ArrowLeft':
            if (player.x - TILE_WIDTH >= 0) //change horizontal jump distance
                player.x -= TILE_WIDTH;
            break;

        case 'ArrowRight':
            if (player.x + TILE_WIDTH < canvas.width) 
                player.x += TILE_WIDTH;
            break;
    }
});


// Game loop
let lastTime = Date.now();
function main() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimationFrame(main);
}
//update score and win
function update(dt) {
    enemies.forEach(enemy => {
        enemy.update(dt);

        if (checkCollision(player, enemy)) {
            player.reset();
            score = 0;
            scoreEl.textContent = "Score: " + score; // FIXED ✅
        }
    });

    // check win
    if (player.y <= 0) {
        score++;
        scoreEl.textContent = "Score: " + score;
        player.reset();
    }
}


//renders
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background tiles
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            ctx.fillStyle = (row === 0) ? '#00BFFF' : (row % 2 === 0 ? '#555' : '#888');
            ctx.fillRect(col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        }
    }

    // Draw enemies
    enemies.forEach(enemy => enemy.draw());

    // Draw player
    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);


}

main();