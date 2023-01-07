// ПЕРЕМЕННЫЕ
let rightPosition = 0;
let imgBlockPosition = 0;
let direction = 'right';
let hit = false;
let jump = false;
let timer = null;
let x = 0;
let halfWidth = window.screen.width / 2;

let jumpBlock = window.document.querySelector('#jump__block');
let hitBlock = window.document.querySelector('#hit__block');
let heroImg = window.document.querySelector('#hero-img');
let imgBlock = window.document.querySelector('#img-block')
let canvas = window.document.querySelector('#canvas')
let fsBtn = window.document.querySelector('#fsBtn')

jumpBlock.style.top = `${window.screen.height/2 - 144/2}px`;
hitBlock.style.top = `${window.screen.height/2 - 144/2}px`;

heroImg.onclick = (event) => {
    event.preventDefault();
}
fsBtn.onclick = () => {
    if (window.document.fullscreen) {
        fsBtn.src = 'fullscreen.png';
        window.document.exitFullscreen();
    } else {
        fsBtn.src = 'cancel.png';
        canvas.requestFullscreen();
    }
}
jumpBlock.onclick = () => { jump = true };
hitBlock.onclick = () => { hit = true };


//ФУНКЦИИ

//ДВИЖЕНИЕ ВПРАВО
const rightHandler = () => {
    heroImg.style.transform = "scale(-1, 1)";
    rightPosition = rightPosition + 1;
    imgBlockPosition = imgBlockPosition + 1;
    if (rightPosition > 5) {
        rightPosition = 0;
    }
    heroImg.style.left = `-${rightPosition*288}px`;
    heroImg.style.top = `-576px`;
    imgBlock.style.left = `${imgBlockPosition*20}px`;
}

//ДВИЖЕНИЕ ВЛЕВО
const leftHandler = () => {
    heroImg.style.transform = "scale(1,1)";
    rightPosition = rightPosition + 1;
    imgBlockPosition = imgBlockPosition - 1;
    if (rightPosition > 5) {
        rightPosition = 0;
    }
    heroImg.style.left = `-${rightPosition * 288}px`;
    heroImg.style.top = '-576px';
    imgBlock.style.left = `${imgBlockPosition * 20}px`;
}

//НА МЕСТЕ
const standHandler = () => {

    switch (direction) {
        case 'right':
            {
                heroImg.style.transform = "scale(-1, 1)";
                if (rightPosition > 4) {
                    rightPosition = 1;
                }
                break;
            }

        case 'left':
            {
                heroImg.style.transform = "scale(1, 1)";
                if (rightPosition > 3) {
                    rightPosition = 0;
                }
                break;
            }

        default:
            break;
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition*288}px`;
    heroImg.style.top = `0px`;
}

//УДАР
const hitHandler = () => {

    switch (direction) {
        case 'right':
            {
                heroImg.style.transform = "scale(-1, 1)";
                if (rightPosition > 4) {
                    rightPosition = 1;
                    hit = false;
                }
                break;
            }

        case 'left':
            {
                heroImg.style.transform = "scale(1, 1)";
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
    heroImg.style.left = `-${rightPosition*288}px`;
    heroImg.style.top = `-864px`;
}

//ПРЫЖОК
const jumpHandler = () => {

    switch (direction) {
        case 'right':
            {
                heroImg.style.transform = "scale(-1, 1)";
                if (rightPosition > 4) {
                    rightPosition = 1;
                    jump = false;
                }
                break;
            }

        case 'left':
            {
                heroImg.style.transform = "scale(1, 1)";
                if (rightPosition > 3) {
                    rightPosition = 0;
                    jump = false;
                }
                break;
            }

        default:
            break;
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition*288}px`;
    heroImg.style.top = `-288px`;
}

//ОБРАБОТЧИКИ СОБЫТИЙ

let onTouchStart = (event) => {
    clearInterval(timer);
    x = (event.type === 'mousedown') ? event.screenX : vent.touches[0].screenX;
    timer = setInterval(() => {
        if (x > halfWidth) {
            direction - 'right';
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
        } else {
            standHandler();
        }
    }, 150);
}

const start = () => {
    lifeCycle();
}
start();