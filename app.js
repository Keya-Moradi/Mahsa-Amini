
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Load images
const platformImg = document.querySelector('#platform');
const backgroundImg = document.querySelector('#background');
const hillsImg = document.querySelector('#hills');
const spriteRunRight = document.querySelector('#spriteRunRight');
const spriteRunLeft = document.querySelector('#spriteRunLeft');
const spriteStandRight = document.querySelector('#spriteStandRight');
const spriteStandLeft = document.querySelector('#spriteStandLeft');

let finalGame = false

canvas.width = 1300
canvas.height = 700

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
        this.width = 66
        this.height = 150
        this.image = spriteStandRight
        this.frames = 0
        this.sprites = {
            stand: {
                right: spriteStandRight,
                left: spriteStandLeft,
                cropWidth: 177,
                width: 66
            },
            run: {
                right: spriteRunRight,
                left: spriteRunLeft,
                cropWidth: 341,
                width: 127.875
            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.frames++
        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) {
            this.frames = 0
        } else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) {
            this.frames = 0
        }

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity
        }
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image
        this.width = 200
        this.height = 20
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

let mahsa = new Player()
let platforms = []
let genericObjects = []

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

    platforms = [
        new Platform({ x: 50, y: 470, image: platformImg }),
        new Platform({ x: 350, y: 600, image: platformImg }),
        new Platform({ x: 700, y: 500, image: platformImg }),
        new Platform({ x: 800, y: 470, image: platformImg }),
        new Platform({ x: 900, y: 600, image: platformImg }),
        new Platform({ x: 1000, y: 500, image: platformImg })
    ]

    genericObjects = [
        new GenericObject({ x: 0, y: 0, image: backgroundImg }),
        new GenericObject({ x: 0, y: 0, image: hillsImg })
    ]

    scrollOffset = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background objects
    genericObjects.forEach((genericObject) => {
        genericObject.draw()
    })

    // Draw platforms
    platforms.forEach((platform) => {
        platform.draw()
    })

    // Update and draw player
    mahsa.update()

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
            genericObjects.forEach((genericObject) => {
                genericObject.position.x -= 3
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= 5
            platforms.forEach((platform) => {
                platform.position.x += 5
            })
            genericObjects.forEach((genericObject) => {
                genericObject.position.x += 3
            })
        }
    }

    // Platform collision detection
    platforms.forEach((platform) => {
        if (
            mahsa.position.y + mahsa.height <= platform.position.y &&
            mahsa.position.y + mahsa.height + mahsa.velocity.y >= platform.position.y &&
            mahsa.position.x + mahsa.width >= platform.position.x &&
            mahsa.position.x <= platform.position.x + platform.width
        ) {
            mahsa.velocity.y = 0
        }
    })

    // Sprite switching
    if (keys.right.pressed && mahsa.currentSprite !== mahsa.sprites.run.right) {
        mahsa.frames = 1
        mahsa.currentSprite = mahsa.sprites.run.right
        mahsa.currentCropWidth = mahsa.sprites.run.cropWidth
        mahsa.width = mahsa.sprites.run.width
    } else if (keys.left.pressed && mahsa.currentSprite !== mahsa.sprites.run.left) {
        mahsa.frames = 1
        mahsa.currentSprite = mahsa.sprites.run.left
        mahsa.currentCropWidth = mahsa.sprites.run.cropWidth
        mahsa.width = mahsa.sprites.run.width
    } else if (!keys.left.pressed && mahsa.currentSprite === mahsa.sprites.run.left) {
        mahsa.frames = 1
        mahsa.currentSprite = mahsa.sprites.stand.left
        mahsa.currentCropWidth = mahsa.sprites.stand.cropWidth
        mahsa.width = mahsa.sprites.stand.width
    } else if (!keys.right.pressed && mahsa.currentSprite === mahsa.sprites.run.right) {
        mahsa.frames = 1
        mahsa.currentSprite = mahsa.sprites.stand.right
        mahsa.currentCropWidth = mahsa.sprites.stand.cropWidth
        mahsa.width = mahsa.sprites.stand.width
    }

    // Win condition
    if (scrollOffset > 500 && !finalGame) {
        finalGame = true
        init()
        alert('Congratulations! You have defeated the IRGC!')
    }

    // Lose condition
    if (mahsa.position.y > canvas.height && !finalGame) {
        finalGame = true
        init()
        alert('You were captured by the IRGC, please try again!')
    }
}

init()
animate()

// Event listeners for movement
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'a':
        case 'ArrowLeft':
            keys.left.pressed = true
            break
        case 'd':
        case 'ArrowRight':
            keys.right.pressed = true
            break
        case 'w':
        case 'ArrowUp':
            mahsa.velocity.y -= 20
            break
    }
})

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
        case 'ArrowLeft':
            keys.left.pressed = false
            break
        case 'd':
        case 'ArrowRight':
            keys.right.pressed = false
            break
    }
})
