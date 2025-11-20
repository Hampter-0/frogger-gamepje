const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE_WIDTH = 101;
const TILE_HEIGHT =76;
const ROWS = 8;
const COLS = 5;
let delay = 1;


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
    reset: function() {
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
        this.img = carImage; // use car image
    }

    update(dt) {
        this.x += this.speed * dt;
        if (this.x > canvas.width) {
            this.x = -this.width;
        }
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}


// Create enemies
const enemies = [
    new Enemy(0, 1 * TILE_HEIGHT, 100),
    new Enemy(200, 2 * TILE_HEIGHT, 150),
    new Enemy(100, 3 * TILE_HEIGHT, 200)
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

// Input handling (WASD)
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w':
            if(player.y - TILE_HEIGHT >= 0) player.y -= TILE_HEIGHT;
            break;
        case 's':
            if(player.y + TILE_HEIGHT < canvas.height) player.y += TILE_HEIGHT;
            break;
        case 'a':
            if(player.x - TILE_WIDTH >= 0) player.x -= TILE_WIDTH;
            break;
        case 'd':
            if(player.x + TILE_WIDTH < canvas.width) player.x += TILE_WIDTH;
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

function update(dt) {
    enemies.forEach(enemy => {
        enemy.update(dt);
        if(checkCollision(player, enemy)) {
            player.reset();
            score = 0;
        }
    });

    // Check win (reach top row)
    if(player.y <= 0) {
        score++;
        scoreEl.textContent = "Score: " + score;
        player.reset();
    }
}

function render() {
    // Clear canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Draw background tiles
    for(let row=0; row<ROWS; row++) {
        for(let col=0; col<COLS; col++) {
            ctx.fillStyle = (row === 0) ? '#00BFFF' : (row%2 === 0 ? '#555' : '#888');
            ctx.fillRect(col*TILE_WIDTH, row*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        }
    }

    // Draw enemies
    enemies.forEach(enemy => enemy.draw());

    // Draw player
   ctx.drawImage(player.img, player.x, player.y, player.width, player.height);

}

main();