// ПЕРЕМЕННЫЕ
let heroImg = window.document.querySelector('#hero-img');
heroImg.onclick = (event) => {
    event.preventDefault();
}
let imgBlock = window.document.querySelector('#img-block')
let canvas = window.document.querySelector('#canvas')
let fsBtn = window.document.querySelector('#fsBtn')
fsBtn.onclick = () => {
    if (window.document.fullscreen) {
        fsBtn.src = 'img/fullscreen.png';
        window.document.exitFullscreen();
    } else {
        fsBtn.src = 'img/cancel.png'
        canvas.requestFullscreen();
    }

}
let rightPosition = 0;
let imgBlockPosition = 0;


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
    imgBlock.style.left = `${imgBlockPosition*20}px`;
}

//ДВИЖЕНИЕ ВЛЕВО
const leftHandler = () => {
    heroImg.style.transform = "scale(1, 1)";
    rightPosition = rightPosition + 1;
    imgBlockPosition = imgBlockPosition - 1;

    if (rightPosition > 5) {
        rightPosition = 0;
    }
    heroImg.style.left = `-${rightPosition*288}px`;
    imgBlock.style.left = `${imgBlockPosition*20}px`;
}

//ОБРАБОТЧИКИ СОБЫТИЙ
let timer = null;
let x = 0;
let halfWidth = window.screen.width / 2;
let onTouchStart = (event) => {
    clearInterval(timer);
    x = (event.type === 'mousedown') ? event.screenX : vent.touches[0].screenX;
    timer = setInterval(() => {
        (x > halfWidth) ? rightHandler(): leftHandler();
    }, 130);
}
let onTouchEnd = (event) => {
    clearInterval(timer);
}

window.onmousedown = onTouchStart;
window.ontouchstart = onTouchStart;

window.onmouseup = onTouchEnd;
window.ontouchend = onTouchEnd;