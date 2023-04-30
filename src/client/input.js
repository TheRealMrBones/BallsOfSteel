import { updateInputs } from './networking.js';

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
    if(e.keyCode == 87){
        // w
        startw = Date.now();
    }else if(e.keyCode == 83){
        // s
        starts = Date.now();
    }else if(e.keyCode == 65){
        // a
        starta = Date.now();
    }else if(e.keyCode == 68){
        // d
        startd = Date.now();
    }
}

function handlekeyUp(e){
    if(e.keyCode == 87){
        // w
        y = -(startw - Date.now()) / 1000 * Constants.PLAYER_SPEED;
        startw = null;
    }else if(e.keyCode == 83){
        // s
        y = (starts - Date.now()) / 1000 * Constants.PLAYER_SPEED;
        starts = null;
    }else if(e.keyCode == 65){
        // a
        x = -(starta - Date.now()) / 1000 * Constants.PLAYER_SPEED;
        starta = null;
    }else if(e.keyCode == 68){
        // d
        x = (startd - Date.now()) / 1000 * Constants.PLAYER_SPEED;
        startd = null;
    }
}

function handleInput(){
    if(startw != null){
        // w
        y = (startw - Date.now()) / 1000 * Constants.PLAYER_SPEED;
        startw = Date.now();
    }
    if(starts != null){
        // s
        y = -(starts - Date.now()) / 1000 * Constants.PLAYER_SPEED;
        starts = Date.now();
    }
    if(starta != null){
        // a
        x = (starta - Date.now()) / 1000 * Constants.PLAYER_SPEED;
        starta = Date.now();
    }
    if(startd != null){
        // d
        x = -(startd - Date.now()) / 1000 * Constants.PLAYER_SPEED;
        startd = Date.now();
    }

    let inputs = {
        dir: dir,
        x: x,
        y: y,
    };
    updateInputs(inputs);
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

    setInterval(handleInput, 1000 / Constants.UPDATE_RATE);
}
  
export function stopCapturingInput() {
    window.removeEventListener('mousemove', onMouseInput);
    window.removeEventListener('click', onMouseInput);
    window.removeEventListener('touchstart', onTouchInput);
    window.removeEventListener('touchmove', onTouchInput);
    window.removeEventListener('keydown', handlekeyDown);
    window.removeEventListener('keyup', handlekeyUp);

    clearInterval(handleInput)
}