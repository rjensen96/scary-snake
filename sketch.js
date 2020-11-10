let backgroundColor = 25;
let snake = [];
let bigSnake;
let food = [];

let w = 20;
let h = 20;

const canvasWidth = 400;
const canvasHeight = 400;

let xAdd = 0;
let yAdd = 0;

let gameStarted = 0;
let totnum = 0;
let numEaten = 0;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    colorMode(RGB);
    frameRate(10);
    background(backgroundColor);
}

function draw() {
    startGame();
    clear();
    background(backgroundColor);
    placeFood();
    bigSnake.renderMe();
    bigSnake.move();
    bigSnake.eat();
    totnum++;
}

function startGame() {
    if(gameStarted === 0){
        bigSnake = new Snake(200,200);
        gameStarted = 1; // so that we never do this again
    }
}

function placeFood() {
    // list the grid options
    let xOpt = [];
    let yOpt = [];

    for (let x = 0; x < canvasWidth; x+=w) {
        xOpt.push(x);
    }
    
    for (let y = 0; y < canvasHeight; y+=w) {
        yOpt.push(y);
    }

    if (totnum % 15 === 0) {
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
        yAdd = (w * -1);
    } else if (keyCode === DOWN_ARROW) {
        xAdd = 0;
        yAdd = w;
    } else if (keyCode === RIGHT_ARROW) {
        xAdd = w;
        yAdd = 0;
    } else if (keyCode === LEFT_ARROW) {
        xAdd = (w * -1);
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
                    console.log("final score: " + numEaten * 10);
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
        this.myColor = color(255, 237, 92) // default to snake colors
    }

    get x() {
        return this._xval
    }

    get y() {
        return this._yval
    }

    makeFruity() {
        this.myColor = color(240, 100, 245); // re-use this class for fruitsnacks. make those fruity.
    }

    incrementItem() {
        this._xval += xAdd;
        this._yval += yAdd;

        // handle running off the board, re-looping
        if(this._xval >= canvasWidth) {
            this._xval = 0;
        } else if (this._xval < 0) {
            this._xval = canvasWidth;
        }
        
        if (this._yval >= canvasHeight) {
            this._yval = 0;
        } else if (this._yval <= 0) {
            this._yval = canvasHeight;
        }
        return this;
    }

    renderMe() {
        fill(this.myColor);
        stroke(10);
        rect(this._xval, this._yval, w, h);
    }
}

