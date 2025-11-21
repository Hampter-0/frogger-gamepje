const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE_WIDTH = 127;
const TILE_HEIGHT = 76;
const ROWS = 9;
const COLS = 6;
let isDead = false;
let deathX = 0;
let deathY = 0;
let deathTimer = 0;
let gameOver = false;

//made by hampternom bro dit is echt w project trust trust
//audios
const moveSound = new Audio('audio/movesound.wav'); // path to your audio file
const deathSound = new Audio('audio/deathsound.wav'); // your own sound file


//automatic map resize
canvas.width = COLS + 680; // did this so i can fix colliders with the player and right wall
canvas.height = ROWS * TILE_HEIGHT;

//assets loading
// load skull
const skullImage = new Image();
skullImage.src = "assets/skull.png"; // change to your path

//load enemy image
const carImage = new Image();
carImage.src = 'assets/longcar.png';


// Load player image
const playerImage = new Image();
playerImage.src = 'assets/player.png';

const player = {
    x: 2.0 * TILE_WIDTH, //spawning location 2.5 times tile width is dus de helfd precies in het midden 
    y: (ROWS - 1) * TILE_HEIGHT, // spawning welke row
    width: 50,
    height: 50,
    img: playerImage,
    reset: function () {
        this.x = 2.0 * TILE_WIDTH; // wanneer de player dood gaat respawn point
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
        if (isDead) {
            deathTimer -= dt;

            if (deathTimer <= 0) {
                isDead = false;
                player.reset();
            }

            return; // stop updating enemies during death
        }
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
    new Enemy(0, 7 * TILE_HEIGHT, -200), //last number is speed
    new Enemy(200, 6 * TILE_HEIGHT, 100),// second number is row
    new Enemy(100, 5 * TILE_HEIGHT, -100),// first number is starting position
    new Enemy(300, 3 * TILE_HEIGHT, -250),
    new Enemy(100, 2 * TILE_HEIGHT, 100),
    new Enemy(200, 1 * TILE_HEIGHT, -200),// to add more cars on the same row duplicate the enemy only change start pos ( distance for the cars on the same row ) for more cars in one row
];

//note for my self the jitter from images is caused by the speed( 50 - 150 - 250 ect)


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
let lives = 3;
const livesEl = document.getElementById('lives');
let time = document.getElementById('time');
const timeEl = document.getElementById('time');

// movement (Arrow Keys)
document.addEventListener('keydown', (e) => {
    if (isDead) return; // stop bewegen during death scene
    switch (e.key) {


        case 'ArrowUp':
            if (player.y - TILE_HEIGHT >= 0) { //change vertical jump distance current tile height is 76  change tile met minder of meer
                player.y -= TILE_HEIGHT;
                moveSound.currentTime = 0;
                moveSound.play();
            }
            break;

        case 'ArrowDown':
            if (player.y + TILE_HEIGHT < canvas.height) {
                player.y += TILE_HEIGHT;
                moveSound.currentTime = 0;
                moveSound.play();
            }
            break;


        case 'ArrowLeft':
            if (player.x - TILE_WIDTH >= 0) { //change horizontal jump distance ( current tile width is 127 change tile with met minder of meer)
                player.x -= TILE_WIDTH;
                moveSound.currentTime = 0;
                moveSound.play();
            }
            break;

        case 'ArrowRight':
            if (player.x + TILE_WIDTH < canvas.width) {
                player.x += TILE_WIDTH;
                moveSound.currentTime = 0;
                moveSound.play();
            }
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
    if (gameOver) return; // stop updating when game is over
    enemies.forEach(enemy => {
        enemy.update(dt);

        if (checkCollision(player, enemy) && !isDead) {
            isDead = true;
            deathX = player.x;
            deathY = player.y;
            deathTimer = 5.5; // seconds

            //update lives 
            if (lives > 0) {
                lives--;
                livesEl.textContent = "lives: " + lives;
            } else {
                stop();
            }

            //stop game if run out of lives
            if (lives === 0) {
                gameOver = true;
            }
            
            // time goes down

            //update score
            score = 0;
            scoreEl.textContent = "Score: " + score;

            // play death sound
            deathSound.currentTime = 0; // reset to start
            deathSound.play();

        }

    });



    // check win
    if (player.y <= 0) {
        score+= 10;
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
    if (isDead) {
        ctx.drawImage(skullImage, deathX, deathY, player.width, player.height);
    } else {
        ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
    }



}

main();