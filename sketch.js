// Constants: gameplay mechanics
const GAME_FRAME_RATE = 10;
const FOOD_SPAWN_RATE = 15;
const FOOD_SCORE_MULTIPLE = 10;

// Constants: positioning
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const BLOCK_WIDTH = 20;
const BLOCK_STROKE_WIDTH = 10;
const SNAKE_START_X = 200;
const SNAKE_START_Y = 200;

// Constants: colors
const COLOR_BACKGROUND = 25;
const COLOR_SNAKE = [255, 237, 92];
const COLOR_FOOD = [240, 100, 245];

// Game state
let gameStarted = 0;
let totnum = 0;
let numEaten = 0;
let bigSnake;
let food = [];
let xAdd = 0;
let yAdd = 0;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    colorMode(RGB);
    frameRate(GAME_FRAME_RATE);
    background(COLOR_BACKGROUND);
}

function draw() {
    startGame();
    clear();
    background(COLOR_BACKGROUND);
    placeFood();
    bigSnake.renderMe();
    bigSnake.move();
    bigSnake.eat();
    totnum++;
}

function startGame() {
    if(gameStarted === 0){
        bigSnake = new Snake(SNAKE_START_X, SNAKE_START_Y);
        gameStarted = 1; // so that we never do this again
    }
}

function placeFood() {
    // list the grid options
    let xOpt = [];
    let yOpt = [];

    for (let x = 0; x < CANVAS_WIDTH; x+=BLOCK_WIDTH) {
        xOpt.push(x);
    }

    for (let y = 0; y < CANVAS_HEIGHT; y+=BLOCK_WIDTH) {
        yOpt.push(y);
    }

    if (totnum % FOOD_SPAWN_RATE === 0) {
        const x = xOpt[Math.floor(Math.random() * xOpt.length)];
        const y = yOpt[Math.floor(Math.random() * yOpt.length)]
        const fruitsnack = new GameBlock(x, y);

        fruitsnack.makeFruity();
        food.push(fruitsnack);
    }
    food.forEach(snack => snack.renderMe());
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        xAdd = 0;
        yAdd = (BLOCK_WIDTH * -1);
    } else if (keyCode === DOWN_ARROW) {
        xAdd = 0;
        yAdd = BLOCK_WIDTH;
    } else if (keyCode === RIGHT_ARROW) {
        xAdd = BLOCK_WIDTH;
        yAdd = 0;
    } else if (keyCode === LEFT_ARROW) {
        xAdd = (BLOCK_WIDTH * -1);
        yAdd = 0;
    }
    return false;
}

class Snake {
    constructor(startX, startY) {
        this.chunks = [new GameBlock(startX, startY)];
        this.growing = false;
    }

    renderMe() {
        this.chunks.forEach(chunk => chunk.renderMe())
    }

    move() {
        let copyHead = this.headAsCopy;
        copyHead.incrementItem(); // increment it
        this.chunks.push(copyHead); // put it back on the snake at front
        
        if(this.growing === false) {
            this.chunks.shift(); // remove bottom chunk
        }
        
        //check for cannibalism
        if(this.chunks.length > 1){
            for (let i = 0; i < this.chunks.length-1; i++) {
                const snakeChunk = this.chunks[i];
                if (snakeChunk.x === copyHead.x && snakeChunk.y === copyHead.y) {
                    frameRate(0);
                    console.log("final score: " + numEaten * FOOD_SCORE_MULTIPLE);
                }
            }
        }
    }

    eat() {
        let copyHead = this.headAsCopy;
        let newFood = []; // for all the stuff snake doesn't eat.

        this.growing = false;

        if (food.length > 0) {
            let eatenSnacks = food.filter(snack => {
                if(snack.x === copyHead.x && snack.y === copyHead.y) {
                    return snack;
                } else {
                    newFood.push(snack);
                }
            })

            food = newFood; // replace food with the remaining fruitsnacks
            
            if(eatenSnacks.length > 0) {
                numEaten++;
                this.growing = true;
            }
        }
    }

    get headAsCopy() {
        let newHead = new GameBlock(this.chunks[this.chunks.length - 1].x, this.chunks[this.chunks.length - 1].y);
        return newHead;
    }
}

class GameBlock {
    constructor(x, y) {
        this._xval = x;
        this._yval = y;
        this.myColor = color(COLOR_SNAKE) // default to snake colors
    }

    get x() {
        return this._xval
    }

    get y() {
        return this._yval
    }

    makeFruity() {
        this.myColor = color(COLOR_FOOD); // re-use this class for fruitsnacks. make those fruity.
    }

    incrementItem() {
        this._xval += xAdd;
        this._yval += yAdd;

        // handle running off the board, re-looping
        if(this._xval >= CANVAS_WIDTH) {
            this._xval = 0;
        } else if (this._xval < 0) {
            this._xval = CANVAS_WIDTH;
        }

        if (this._yval >= CANVAS_HEIGHT) {
            this._yval = 0;
        } else if (this._yval <= 0) {
            this._yval = CANVAS_HEIGHT;
        }
        return this;
    }

    renderMe() {
        fill(this.myColor);
        stroke(BLOCK_STROKE_WIDTH);
        rect(this._xval, this._yval, BLOCK_WIDTH, BLOCK_WIDTH);
    }
}

