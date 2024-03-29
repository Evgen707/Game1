// ПЕРЕМЕННЫЕ
let rightPosition = 0;
let imgBlockPosition = 0;
let direction = 'right';
let hit = false;
let jump = false;
let fall = false;
let timer = null;
let x = 0;
let halfWidth = window.screen.width / 2;
if (window.screen.availLeft) {
    halfWidth = window.screen.width + window.screen.availLeft / 2;
}
let tileArray = [];
let objectsArray = [];
let enemiesArray = [];
let maxLives = 6;
let lives = 6;
let heartsArray = [];
let isRightSideBlocked = false;
let isLeftSideBlocked = false;
let wasHeroHit = false;

let jumpBlock = window.document.querySelector('#jump-block');
let hitBlock = window.document.querySelector('#hit-block');
let heroImg = window.document.querySelector('#hero-img');
let imgBlock = window.document.querySelector('#img-block');
let canvas = window.document.querySelector('#canvas');
let fsBtn = window.document.querySelector('#fsBtn');
let info = window.document.querySelector('#info');
let backgroundCanvas = window.document.querySelector('#background-canvas')

let heroX = Math.floor((Number.parseInt(imgBlock.style.left) + 32) / 32);
let heroY = Math.floor(Number.parseInt(imgBlock.style.bottom) / 32);


jumpBlock.style.top = `${window.screen.height/2 - 144/2}px`;
hitBlock.style.top = `${window.screen.height/2 - 144/2}px`;

heroImg.onclick = (event) => {
    event.preventDefault();
}
fsBtn.onclick = () => {
    if (window.document.fullscreen) {
        fsBtn.src = 'img/fullscreen.png';
        window.document.exitFullscreen();
    } else {
        fsBtn.src = 'img/cancel.png';
        canvas.requestFullscreen();
    }
}
jumpBlock.onclick = () => { jump = true };
hitBlock.onclick = () => { hit = true };


//ФУНКЦИИ

// Движение камеры влево
const moveWorldLeft = () => {
    objectsArray.map((elem, index) => {
        elem.style.left = `${Number.parseInt(elem.style.left) - 32}px`
    });
    tileArray.map(elem => {
        elem[0] = elem[0] - 1;
    });
    enemiesArray.map(elem => elem.moveLeft());
}

// Движение камеры вправо
const moveWorldRight = () => {
    objectsArray.map((elem, index) => {
        elem.style.left = `${Number.parseInt(elem.style.left) + 32}px`
    });
    tileArray.map(elem => {
        elem[0] = elem[0] + 1;
    });
    enemiesArray.map(elem => elem.moveRight());
}

const updateHeroXY = () => {
    heroX = Math.ceil((Number.parseInt(imgBlock.style.left) + 32) / 32);
    heroY = Math.ceil(Number.parseInt(imgBlock.style.bottom) / 32);


    info.innerText = `heroX = ${heroX}, heroY = ${heroY}`;
}

//ПАДЕНИЕ
const checkFalling = () => {
    updateHeroXY();
    let isFalling = true;
    for (let i = 0; i < tileArray.length; i++) {
        if ((tileArray[i][0] === heroX) && ((tileArray[i][1] + 1) === heroY)) {
            isFalling = false;
        }
    }

    if (isFalling) {
        info.innerText = info.innerText + ', Falling';
        fall = true;
    } else {
        info.innerText = info.innerText + ', Not falling';
        fall = false;
    }
}

const fallHandler = () => {
    heroImg.style.top = '-96px'
    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)-32}px`;
    checkFalling();
}

//ДВИЖЕНИЕ ВПРАВО
const rightHandler = () => {
    if (!isRightSideBlocked) {
        heroImg.style.transform = "scale(-1,1)";
        rightPosition = rightPosition + 1;
        imgBlockPosition = imgBlockPosition + 1;
        if (rightPosition > 5) {
            rightPosition = 0;
        }
        heroImg.style.left = `-${rightPosition * 96}px`;
        heroImg.style.top = '-192px';
        imgBlock.style.left = `${imgBlockPosition * 20}px`;

        checkFalling();
        wasHeroHit = false;
        moveWorldLeft();
    }
}

//ДВИЖЕНИЕ ВЛЕВО
const leftHandler = () => {
    if (!isLeftSideBlocked) {
        heroImg.style.transform = "scale(1,1)";
        rightPosition = rightPosition + 1;
        imgBlockPosition = imgBlockPosition - 1;
        if (rightPosition > 5) {
            rightPosition = 0;
        }
        heroImg.style.left = `-${rightPosition * 96}px`;
        heroImg.style.top = '-192px';
        imgBlock.style.left = `${imgBlockPosition * 20}px`;

        checkFalling();
        wasHeroHit = false;
        moveWorldRight();
    }
}

//НА МЕСТЕ
const standHandler = () => {
    switch (direction) {
        case 'right':
            {
                heroImg.style.transform = "scale(-1,1)";
                if (rightPosition > 4) {
                    rightPosition = 1;
                }
                break;
            }
        case 'left':
            {
                heroImg.style.transform = "scale(1,1)";
                if (rightPosition > 3) {
                    rightPosition = 0;
                }
                break;
            }
        default:
            break;
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = 0;

    checkFalling();
}

//УДАР
const hitHandler = () => {
    switch (direction) {
        case 'right':
            {
                heroImg.style.transform = "scale(-1,1)";
                if (rightPosition > 4) {
                    rightPosition = 1;
                    hit = false;
                    wasHeroHit = true;
                }
                break;
            }
        case 'left':
            {
                heroImg.style.transform = "scale(1,1)";
                if (rightPosition > 3) {
                    rightPosition = 0;
                    hit = false;
                    wasHeroHit = true;
                }
                break;
            }
        default:
            break;
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-288px';
}

//ПРЫЖОК
const jumpHandler = () => {
    switch (direction) {
        case 'right':
            {
                heroImg.style.transform = "scale(-1,1)";
                if (rightPosition > 4) {
                    rightPosition = 1;
                    jump = false;
                    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)+160}px`;
                    imgBlockPosition = imgBlockPosition + 10;
                    imgBlock.style.left = `${imgBlockPosition * 20}px`;

                }
                break;
            }
        case 'left':
            {
                heroImg.style.transform = "scale(1,1)";
                if (rightPosition > 3) {
                    rightPosition = 0;
                    jump = false;
                    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)+160}px`;
                    imgBlockPosition = imgBlockPosition - 10;
                    imgBlock.style.left = `${imgBlockPosition * 20}px`;
                }
                break;
            }
        default:
            break;
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-96px';
}

//ОБРАБОТЧИКИ СОБЫТИЙ

let onTouchStart = (event) => {
    clearInterval(timer);
    x = (event.type === 'mousedown') ? event.screenX : event.touches[0].screenX;
    timer = setInterval(() => {
        if (x > halfWidth) {
            direction = 'right';
            rightHandler();
        } else {
            direction = 'left';
            leftHandler();
        }
    }, 130);
}
let onTouchEnd = (event) => {
    clearInterval(timer);
    lifeCycle();
}

window.onmousedown = onTouchStart;
window.ontouchstart = onTouchStart;

window.onmouseup = onTouchEnd;
window.ontouchend = onTouchEnd;

const lifeCycle = () => {
    timer = setInterval(() => {
        if (hit) {
            hitHandler();
        } else if (jump) {
            jumpHandler();
        } else if (fall) {
            fallHandler();
        } else {
            standHandler();
        }
    }, 150);
}

// ЗЕМЛЯ
//ЗЕЛЕНЫЕ ПЛАТФОРМЫ
const createTile = (x, y = 1) => {
    let tile = window.document.createElement('img');
    tile.src = 'img/assets/1 Tiles/Tile_02.png';
    tile.style.position = 'absolute';
    tile.style.left = x * 32 + 'px';
    tile.style.bottom = y * 32 + 'px';
    backgroundCanvas.appendChild(tile);
    objectsArray.push(tile);
    tileArray.push([x, y]);
}
const createTileBlack = (x, y = 0) => {
    let tileBlack = window.document.createElement('img');
    tileBlack.src = 'img/assets/1 Tiles/Tile_04.png';
    tileBlack.style.position = 'absolute';
    tileBlack.style.left = x * 32 + 'px';
    tileBlack.style.bottom = y * 32 + 'px';
    objectsArray.push(tileBlack);
    backgroundCanvas.appendChild(tileBlack);
}
const createTilesPlatform = (startX, endX, floor) => {
    for (let x_pos = startX - 1; x_pos < endX; x_pos++) {
        createTile(x_pos, floor);
    }
}

const createTilesBlackBlock = (startX, endX, floor) => {
    for (let y_pos = 0; y_pos < floor; y_pos++) {
        for (let x_pos = startX - 1; x_pos < endX; x_pos++) {
            createTileBlack(x_pos, y_pos);
        }
    }
}

//ЧЕРНЫЕ БЛОКИ
const addTiles = (i) => {
    createTile(i);
    createTileBlack(i);
}

//ВРАГ1
class Enemy {

    ATTACK = 'attack';
    DEATH = 'death';
    HURT = 'hurt';
    IDLE = 'idle';
    WALK = 'walk';

    state;
    animateWasChanged;
    lives;

    startX;
    posX;
    posY;
    img;
    block;
    blockSize;
    spritePos;
    spriteMaxPos;
    timer;
    dir;
    stop;

    sourcePath;
    constructor(x, y) {
        this.posX = x;
        this.startX = this.posX;
        this.posY = y;
        this.blockSize = '96px';
        this.spritePos = 0;
        this.spriteMaxPos = 3;
        this.timer = 0;
        this.sourcePath = 'img/assets/Enemies/1/';
        this.dir = .5;
        this.stop = false;
        this.lives = 30;

        this.state = this.IDLE;
        this.animateWasChanged = false;

        this.createImg();

        this.changeAnimate(this.WALK);
        enemiesArray.push(this);
        this.lifeCycle();
    }
    createImg() {

        this.block = window.document.createElement('div');
        this.block.style.position = 'absolute';
        this.block.style.left = this.posX * 32 + 'px';
        this.block.style.bottom = this.posY * 32 + 'px';
        this.block.style.width = this.blockSize;
        this.block.style.height = this.blockSize;
        this.block.style.overflow = 'hidden';

        this.img = window.document.createElement('img');
        this.img.src = this.sourcePath + 'Idle.png';
        this.img.style.position = 'absolute';
        this.img.style.left = 0;
        this.img.style.bottom = 0;
        this.img.style.widht = this.blockSize * 4;
        this.img.style.height = this.blockSize;

        this.block.appendChild(this.img);
        canvas.appendChild(this.block);
    }
    lifeCycle() {
        this.timer = setInterval(() => {

            if (this.animateWasChanged) {
                this.animateWasChanged = false;
                switch (this.state) {
                    case this.ATTACK:
                        {
                            this.setAttack();
                            break;
                        }
                    case this.DEATH:
                        {
                            this.setDeath();
                            break;
                        }
                    case this.HURT:
                        {
                            this.setHurt();
                            break;
                        }
                    case this.IDLE:
                        {
                            this.setIdle();
                            break;
                        }
                    case this.WALK:
                        {
                            this.setWalk();
                            break;
                        }
                    default:
                        break;
                }
            }

            this.spritePos++;
            this.checkCollide();
            if (!this.stop) {
                this.move();
            } else {
                if (this.state != this.DEATH) {
                    if (this.state != this.HURT) {
                        this.changeAnimate(this.ATTACK);
                    }
                }
            }
            this.animate();
        }, 150);
    }
    animate() {
        if (this.spritePos > this.spriteMaxPos) {
            this.spritePos = 0;
            if (this.state === this.ATTACK) {
                lives--;
                updateHearts();
            }
            if (this.state === this.HURT) {
                this.changeAnimate(this.ATTACK);
                if (this.dir > 0) this.spritePos = 1;
            }
            if (this.state === this.DEATH) {
                clearInterval(this.timer);
                isRightSideBlocked = false;
                isLeftSideBlocked = false;
                if (this.dir > 0) this.spritePos = 5;
            }
        }
        this.img.style.left = `${-(this.spritePos) * (this.blockSize)}px`;
        this.blockSize = Number.parseInt(this.blockSize);
    }
    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png';
        this.spriteMaxPos = 5;
    }
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png';
        this.spriteMaxPos = 5;
    }
    setHurt() {
        this.img.src = this.sourcePath + 'Hurt.png';
        this.spriteMaxPos = 1;
    }
    setIdle() {
        this.img.src = this.sourcePath + 'Idle.png';
        this.spriteMaxPos = 3;
    }
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png';
        this.spriteMaxPos = 5;
    }
    changeAnimate(stateStr) {
        this.state = stateStr;
        this.animateWasChanged = true;
    }
    move() {
        if (this.posX > this.startX + 10) {
            this.dir *= -1;
            this.img.style.transform = "scale(-1,1)"
        } else if (this.posX <= this.startX) {
            this.dir = Math.abs(this.dir);
            this.img.style.transform = "scale(1,1)"

        }
        this.posX += this.dir;
        this.block.style.left = this.posX * 32 + 'px';
    }
    checkHurt() {
        if (wasHeroHit) {
            if (this.lives <= 10) {
                wasHeroHit = false;
                this.changeAnimate(this.DEATH);
            } else {
                wasHeroHit = false; //чтобы не зацикливалась логика проверки нанесения урона
                this.changeAnimate(this.HURT); // урон врагу будет наноситься только тогда, когда анимация атаки героя закончит свой цикл
                this.showHurt();
                this.lives -= 10;
            }
        }
    }
    checkCollide() {
        if (heroY == this.posY) {
            if (heroX == this.posX) {
                //attack left side  
                this.checkHurt();
                isRightSideBlocked = true; //заблокировать передвижение вправо
                this.stop = true;
            } else if (heroX == (this.posX + 3)) {
                // attack right side
                this.checkHurt();
                isLeftSideBlocked = true; //заблокировать передвижение влево
                this.stop = true;
            } else {
                isRightSideBlocked = false; // если убегает от врага разблокировать дв. влево
                isLeftSideBlocked = false; // если убегает от врага разблокировать дв. влево
                this.stop = false;
                this.changeAnimate(this.WALK);

            }
        } else {
            isRightSideBlocked = false; // если подпрыгнет разблокировать дв. вправо
            isLeftSideBlocked = false; // если подпрыгнет разблокировать дв. влево
            this.stop = false;
            this.changeAnimate(this.WALK);
        }
    }
    showHurt() {
        let pos = 0;
        let text = window.document.createElement('p');
        text.innerText = '-10';
        text.style.position = 'absolute';
        text.style.left = `${(this.dir < 0) ? Number.parseInt(this.block.style.left)+50 : Number.parseInt(this.block.style.left)+10}px`;
        text.style.bottom = `${Number.parseInt(this.block.style.bottom)+32}px`;
        text.style.fontFamily = "'Bungee Spice', cursive";
        let hurtTimer = setInterval(() => {
            text.style.bottom = `${Number.parseInt(text.style.bottom)+16}px`;
            if (pos > 2) {
                clearInterval(hurtTimer);
                text.style.display = 'none'
            }
            pos++;
        }, 100);
        canvas.appendChild(text);
    }
    moveRight() {
        this.startX += 1;
        this.posX += 1;
    }
    moveLeft() {
        this.startX -= 1;
        this.posX -= 1;
    }
}

//ЗДОРОВЬЕ
class Heart {
    img;
    x;
    constructor(x, src) {
        this.x = x + 1;
        this.img = window.document.createElement('img');
        this.img.src = src;
        this.img.style.position = 'absolute';
        this.img.style.left = this.x * 32 + 'px';
        this.img.style.bottom = ((window.screen.height / 32) - 2) * 32 + 'px';
        this.img.style.width = '32px';
        this.img.style.height = '32px';

        canvas.appendChild(this.img);
    }
}

class HeartEmpty extends Heart {
    constructor(x) {
        super(x, 'img/assets/Hearts/heart_empty.png')
    }
}

class HeartRed extends Heart {
    constructor(x) {
        super(x, 'img/assets/Hearts/heart_red.png')
    }
}

const addHearts = () => {
    for (let i = 0; i < maxLives; i++) {
        let heartEmpty = new HeartEmpty(i);
        let heartRed = new HeartRed(i);
        heartsArray.push(heartRed);
    }
}

const updateHearts = () => {
    if (lives <= 0) {
        finalTimerText.innerText = 'Game over';
        imgBlock.style.display = 'none';
    }
    for (let i = 0; i < lives; i++) {
        heartsArray[i].img.style.display = 'block';
    }
    for (let i = lives; i < maxLives; i++) {
        heartsArray[i].img.style.display = 'none';
    }
}

const createBackImg = (i) => {
    let img = window.document.createElement('img');
    img.src = 'img/assets/2 Background/Day/Background.png';
    img.style.position = 'absolute';
    img.style.left = i * window.screen.width + 'px';
    img.style.bottom = 32 + 'px';
    img.style.width = window.screen.width + 'px';
    img.style.height = window.screen.height + 'px';
    backgroundCanvas.appendChild(img);
    objectsArray.push(img);
}

const addBackgroundImages = () => {
    for (let i = 0; i < 5; i++) {
        createBackImg(i);
    }
}

const createImfEl = (src, x, y) => {
    let img = window.document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.left = x * 32 + "px";
    img.style.bottom = y * 32 + "px";
    img.style.transform = 'scale(2, 2) translate(-25%, -25%)';
    backgroundCanvas.appendChild(img);
    objectsArray.push(img);
}

const addDecorationElements = (f1, f2, f3) => {
    let basePath = 'img/assets/3 Objects';
    //Tree
    createImfEl(basePath + '/Other/Tree4.png', 4, f1);
    createImfEl(basePath + '/Other/Tree2.png', 35, f1);
    createImfEl(basePath + '/Other/Tree3.png', 78, f1);
    createImfEl(basePath + '/Other/Tree4.png', 108, f1);
    createImfEl(basePath + '/Other/Tree1.png', 65, f2);

    //Stone
    createImfEl(basePath + '/Stones/6.png', 10, f1);
    createImfEl(basePath + '/Stones/6.png', 111, f1);
    createImfEl(basePath + '/Stones/6.png', 38, f1);
    createImfEl(basePath + '/Stones/6.png', 102, f3);

    //Ramp
    createImfEl(basePath + '/Other/Ramp1.png', 22, f2);
    createImfEl(basePath + '/Other/Ramp2.png', 26, f2);
    createImfEl(basePath + '/Other/Ramp1.png', 95, f2);
    createImfEl(basePath + '/Other/Ramp2.png', 99, f2);
    createImfEl(basePath + '/Other/Ramp1.png', 45, f2);
    createImfEl(basePath + '/Other/Ramp2.png', 49, f2);

    //Bushes
    createImfEl(basePath + '/Bushes/17.png', 84, f1);
    createImfEl(basePath + '/Bushes/17.png', 19, f2);
    createImfEl(basePath + '/Bushes/17.png', 50, f2);
    createImfEl(basePath + '/Bushes/17.png', 69, f2);
    createImfEl(basePath + '/Bushes/17.png', 100, f2);
    createImfEl(basePath + '/Bushes/17.png', 13, f3);

    //Fountain
    createImfEl(basePath + '/Fountain/2.png', 116, f1);

    //Box
    createImfEl(basePath + '/Other/Box.png', 84, f1);
    createImfEl(basePath + '/Other/Box.png', 48, f2);
    createImfEl(basePath + '/Other/Box.png', 14, f3);
    createImfEl(basePath + '/Other/Box.png', 104, f3);
}

const buildLevel = () => {
    let flor1 = 0;
    let flor2 = 4;
    let flor3 = 8;

    addDecorationElements(flor1 + 1, flor2 + 1, flor3 + 1);

    createTilesPlatform(0, 14, flor1);
    createTilesPlatform(33, 41, flor1);
    createTilesPlatform(76, 91, flor1);
    createTilesPlatform(106, 119, flor1);


    createTilesPlatform(15, 32, flor2);
    createTilesPlatform(42, 53, flor2);
    createTilesPlatform(64, 75, flor2);
    createTilesPlatform(92, 105, flor2);

    createTilesPlatform(8, 20, flor3);
    createTilesPlatform(54, 63, flor3);
    createTilesPlatform(75, 87, flor3);
    createTilesPlatform(99, 111, flor3);

    createTilesBlackBlock(15, 32, flor2);
    createTilesBlackBlock(42, 53, flor2);
    createTilesBlackBlock(64, 75, flor2);
    createTilesBlackBlock(92, 105, flor2);
    createTilesBlackBlock(54, 63, flor3);

}

const start = () => {
    addBackgroundImages();
    buildLevel();
    lifeCycle();
    addHearts();
    updateHearts();
}
start();