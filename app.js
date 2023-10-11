
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const platform = document.querySelector('#platform');


canvas.width = window.innerWidth
canvas.height = window.innerHeight

console.log(c);
//c stands for context object
// setting gravity
const gravity = .5

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }
    draw() {
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

    }
    update() {
        // calling function before moving its position
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        // only add velocity if a certain condition exists > monitoring the bottom of our player + over time
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            // add gravity to the player's this.y and excvellerate it over time
            this.velocity.y += gravity
    }

}
class Platform {
    constructor({ x, y, platform }) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 200
        this.height = 20
    }
    draw() {
        c.fillStyle = 'pink'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
let mahsa = new Player()
let platforms = [new Platform({
    x: 50, y: 470
}), new Platform({
    x: 350, y: 600
}), new Platform({
    x: 700, y: 500
})]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0
function init() {
    mahsa = new Player()
    platforms = [new Platform({
        x: 50, y: 470
    }), new Platform({
        x: 350, y: 600
    }), new Platform({
        x: 700, y: 500
    })]
    scrollOffset = 0

}
function animate() {
    // recursive loop to change player properties over time
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    // velocity of 1 makes it slow 
    // clear canvas and take everything off of it and call playe's draw function and maintain its shape
    // call position and clear the width
    c.clearRect(0, 0, canvas.width, canvas.height)
    mahsa.update()
    platforms.forEach((platform) => {
        platform.draw()
    })

    if (keys.right.pressed && mahsa.position.x < 400) {
        mahsa.velocity.x = 5
    } else if (keys.left.pressed && mahsa.position.x > 100) {
        mahsa.velocity.x = -5
    } else {
        mahsa.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach((platform) => {
                platform.position.x -= 5
            })

        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach((platform) => {
                platform.position.x += 5
            })

        }
    }

    // console.log(scrollOffset)

    // platform collision detection 
    platforms.forEach((platform) => {
        if (mahsa.position.y + mahsa.height <= platform.position.y && mahsa.position.y + mahsa.height + mahsa.velocity.y >= platform.position.y && mahsa.position.x + mahsa.width >= platform.position.x && mahsa.position.x <= platform.position.x + platform.width) {
            mahsa.velocity.y = 0
        }
    })

    // win condition 
    if (scrollOffset > 500) {
        alert('Congratulations! You have defeated the IRGC!')
    }

    // lose condition
    if (mahsa.position.y > canvas.height) {
        alert('you were captured by the IRGC, please try again!')
        init()
    }
}

animate()

// Adding event listeners for movement 

document.addEventListener('keydown', (event) => {

    console.log(event.key)
    switch (event.key) {
        case 'a':
            console.log('left')
            keys.left.pressed = true
            break
        case 's':
            console.log('down')
            break
        case 'd':
            console.log('right')
            keys.right.pressed = true
            break
        case 'w':
            console.log('up')
            mahsa.velocity.y -= 20
            break
        case 'ArrowLeft':
            console.log('left')
            keys.left.pressed = true
            break
        case 'ArrowDown':
            console.log('down')
            break
        case 'ArrowRight':
            console.log('right')
            keys.right.pressed = true
            break
        case 'ArrowUp':
            console.log('up')
            mahsa.velocity.y -= 20
            break
    }
})

document.addEventListener('keyup', (event) => {
    console.log(event.key)
    switch (event.key) {
        case 'a':
            console.log('left')
            keys.left.pressed = false
            break
        case 's':
            console.log('down')
            break
        case 'd':
            console.log('right')
            keys.right.pressed = false
            break
        case 'w':
            console.log('up')
            mahsa.velocity.y -= 20
            break
        case 'ArrowLeft':
            console.log('left')
            keys.left.pressed = false
            break
        case 'ArrowDown':
            console.log('down')
            break
        case 'ArrowRight':
            console.log('right')
            keys.right.pressed = false
            break
        case 'ArrowUp':
            console.log('up')
            mahsa.velocity.y -= 20
            break
    }
})