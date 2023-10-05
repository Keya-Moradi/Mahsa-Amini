// GLOBAL DOM / VARIABLES
const tree = document.querySelector('#tree')
const badGuy = document.querySelector('#bad-guy')
const movement = document.querySelector('#movement');
const game = document.querySelector('#game');
const score = document.querySelector('#score');
const status = document.querySelector('#status');
const ctx = game.getContext('2d');
let shrek;
let donkey;

console.log(tree, badGuy, movement, game, score, status);
// ====================== PAINT INTIAL SCREEN ======================= //
// EVENT LISTENERS
window.addEventListener('DOMContentLoaded', function () {
    // Load donkey and shrek on page
    shrek = new Crawler(100, 200, '#bada55', 50, 100);
    donkey = new Crawler(10, 20, 'grey', 25, 25);

    let runGame = this.setInterval(gameLoop, 60);
})

document.addEventListener('keydown', movementHandler);

// ====================== SETUP FOR CANVAS RENDERING ======================= //
// 2D rendering context for canvas element
// This is used for drawing shapes, text, images, etc.
game.setAttribute('height', getComputedStyle(game)['height']);
game.setAttribute('width', getComputedStyle(game)['width']);


// ====================== ENTITIES ======================= //
class Crawler {
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.height = height;
        this.width = width;
        this.alive = true;

        this.render = function () {
            ctx.fillStyle = this.color; // change the color of the context (ctx)
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
    }
}

// let testCrawler = new Crawler(150, 20, 'cyan', 100, 100);
// testCrawler.render();

// KEYBOARD LOGIC
function movementHandler(e) {
    console.log('movement', e.key);
    // make a conditional for each direction 
    if (e.key === 'w' || e.key === 'ArrowUp') {
        donkey.y - 10 >= 0 ? (donkey.y -= 10) : null;
    } else if (e.key === 's' || e.key === 'ArrowDown') {
        donkey.y + 10 <= game.height - donkey.height ? (donkey.y += 10) : null;
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        donkey.x - 10 >= 10 ? (donkey.x -= 10) : null;
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
        donkey.x + 10 <= game.width - donkey.width ? (donkey.x += 10) : null;
    }
}

function shrekAIMovement() {
}

// first move the shrek up and then move to the left and then down and repeat

// ====================== HELPER FUNCTIONS ======================= //
function addNewShrek() {
    shrek.alive = false;
    // use a set timeout function to create a new shrek after 1 second (100 mili seconds)
    setTimeout(function () {
        // random x and y position
        let randomX = Math.floor(Math.random() * game.width - 40);
        let randomY = Math.floor(Math.random() * game.height - 80);
        // random color
        const colors = ['pink', 'purple', 'red', 'cyan', 'magenta', 'teal', 'green']
            ;
        let randomIndex = Math.floor(Math.random() * colors.length - 1);
        let randomColor = colors[randomIndex]; // we have our random color 
        //create a new shrek
        shrek = new Crawler(randomX, randomY, randomColor, 100, 100);
    }, 1000);
    return true;
}

// ====================== GAME PROCESSES ======================= //
function gameLoop() {
    // clear the canvas
    ctx.clearRect(0, 0, game.width, game.height);

    // display x and y coordinates for our donkey
    movement.textContent = `X: ${donkey.x}\nY: ${donkey.y}`;

    // check to see  if shrek is alive
    // if (shrek.alive) {
    //     // render the shrek
    //     shrek.render();
    //     // check for collision beween donkey and shrek
    //     let hit = detectHit(donkey, shrek); // checks if there is a hit between those two and returns boolian
    // }
    // render the donkey
    donkey.render();

}

// ====================== COLLISION DETECTION ======================= //
function detectHit(player, app) {
    let hitTest = (
        player.y + player.height > app.y &&
        player.y < app.y + app.height &&
        player.x + player.width > app.x &&
        player.x < app.x + app.width
    );

    if (hitTest) {
        // add 100 points to the current score
        let newScore = Number(score.textContent) + 100;
        score.textContent = newScore;
        // return a new shrek with the addNewShrek function 
        return addNewShrek();
    } else {
        return false;
    }
}