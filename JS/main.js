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

let jumpBlock = window.document.querySelector('#jump-block');
let hitBlock = window.document.querySelector('#hit-block');
let heroImg = window.document.querySelector('#hero-img');
let imgBlock = window.document.querySelector('#img-block');
let canvas = window.document.querySelector('#canvas');
let fsBtn = window.document.querySelector('#fsBtn');
let info = window.document.querySelector('#info');

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
    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)-40}px`;
    checkFalling();
}

//ДВИЖЕНИЕ ВПРАВО
const rightHandler = () => {
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
}

//ДВИЖЕНИЕ ВЛЕВО
const leftHandler = () => {
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
                }
                break;
            }
        case 'left':
            {
                heroImg.style.transform = "scale(1,1)";
                if (rightPosition > 3) {
                    rightPosition = 0;
                    hit = false;
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
    canvas.appendChild(tile);

    tileArray.push([x, y]);
}

const createTilesPlatform = (startX, startY, length) => {
    for (let i = 0; i < length; i++) {
        createTile(startX + i, startY);
    }
}

//ЧЕРНЫЕ БЛОКИ
const addTiles = (i) => {
    createTile(i);
    let tileBlack = window.document.createElement('img');
    tileBlack.src = 'img/assets/1 Tiles/Tile_04.png';
    tileBlack.style.position = 'absolute';
    tileBlack.style.left = i * 32 + 'px';
    tileBlack.style.bottom = 0;
    canvas.appendChild(tileBlack);
}


class Enemy {
    posX;
    posY;
    img;
    block;
    blockSize;
    spritePos;
    spriteMaxPos;
    timer;
    constructor(x, y) {
        this.posX = x;
        this.posY = y;
        this.blockSize = '96px';
        this.spritePos = 0;
        this.spriteMaxPos = 3;
        this.timer = 0;

        this.createImg();
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
        this.img.src = 'img/assets/Enemies/1/Idle.png';
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
            this.spritePos++;
            this.animate();
        }, 150);
    }
    animate() {
        if (this.spritePos > this.spriteMaxPos) {
            this.spritePos = 0;
        }
        this.img.style.left = `${-(this.spritePos) * (this.blockSize)}px`;
        this.blockSize = Number.parseInt(this.blockSize);
    }
}

const start = () => {
    lifeCycle();
    for (let i = 0; i < 50; i = i + 1) {
        // if((i > 10) && (i < 17) ){
        // 	continue;
        // }
        addTiles(i);
    }
    createTilesPlatform(10, 10, 10);
    createTilesPlatform(15, 5, 10);

    let enemy = new Enemy(10, 2);
}
start();