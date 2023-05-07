import { updateInputs, shoot } from './networking.js';

const Constants = require('../shared/constants.js');

let dir = 0;
let x = 0;
let y = 0;
let startw = null;
let starta = null;
let starts = null;
let startd = null;

function onMouseInput(e) {
    handleDirection(e.clientX, e.clientY);
}

function onTouchInput(e) {
    const touch = e.touches[0];
    handleDirection(touch.clientX, touch.clientY);
}

function handleDirection(x, y) {
    dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
}

function handlekeyDown(e){
    switch(e.key){
        case 'w':
            if(startw == null){
                startw = Date.now();
            }
            break;
        case 's':
            if(starts == null){
                starts = Date.now();
            }
            break;
        case 'a':
            if(starta == null){
                starta = Date.now();
            }
            break;
        case 'd':
            if(startd == null){
                startd = Date.now();
            }
            break;
    }
}

function handlekeyUp(e){
    switch(e.key){
        case 'w':
            if(startw != null){
                y -= (Date.now() - startw) * Constants.PLAYER_SPEED / 1000;
                startw = null;
            }
            break;
        case 's':
            if(starts != null){
                y += (Date.now() - starts) * Constants.PLAYER_SPEED / 1000;
                starts = null;
            }
            break;
        case 'a':
            if(starta != null){
                x -= (Date.now() - starta) * Constants.PLAYER_SPEED / 1000;
                starta = null;
            }
            break;
        case 'd':
            if(startd != null){
                x += (Date.now() - startd) * Constants.PLAYER_SPEED / 1000;
                startd = null;
            }
            break;
    }
}

function handleMouseDown(){
    shoot();
}

function handleInput(){
    if(startw != null){
        y -= (Date.now() - startw) * Constants.PLAYER_SPEED / 1000;
        startw = Date.now();
    }
    if(starts != null){
        y += (Date.now() - starts) * Constants.PLAYER_SPEED / 1000;
        starts = Date.now();
    }
    if(starta != null){
        x -= (Date.now() - starta) * Constants.PLAYER_SPEED / 1000;
        starta = Date.now();
    }
    if(startd != null){
        x += (Date.now() - startd) * Constants.PLAYER_SPEED / 1000;
        startd = Date.now();
    }

    updateInputs({
        dir: dir,
        x: x,
        y: y,
    });
    x = 0;
    y = 0;
}

export function startCapturingInput() {
    window.addEventListener('mousemove', onMouseInput);
    window.addEventListener('click', onMouseInput);
    window.addEventListener('touchstart', onTouchInput);
    window.addEventListener('touchmove', onTouchInput);
    window.addEventListener('keydown', handlekeyDown);
    window.addEventListener('keyup', handlekeyUp);
    window.addEventListener('mousedown', handleMouseDown);

    setInterval(handleInput, 1000 / Constants.UPDATE_RATE);
}
  
export function stopCapturingInput() {
    window.removeEventListener('mousemove', onMouseInput);
    window.removeEventListener('click', onMouseInput);
    window.removeEventListener('touchstart', onTouchInput);
    window.removeEventListener('touchmove', onTouchInput);
    window.removeEventListener('keydown', handlekeyDown);
    window.removeEventListener('keyup', handlekeyUp);
    window.removeEventListener('mousedown', handleMouseDown);

    clearInterval(handleInput)
}