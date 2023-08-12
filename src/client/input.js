import { updateInputs, shoot } from './networking.js';
import { getMap } from './map.js';
import { getCurrentState } from './state.js';

const Constants = require('../shared/constants.js');

let dir = 0;
let x = 0;
let y = 0;
let startw = null;
let starta = null;
let starts = null;
let startd = null;
let interval = null;

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
        case 'ArrowUp':
        case 'w':
            if(startw == null){
                startw = Date.now();
            }
            break;
        case 'ArrowDown':
        case 's':
            if(starts == null){
                starts = Date.now();
            }
            break;
        case 'ArrowLeft':
        case 'a':
            if(starta == null){
                starta = Date.now();
            }
            break;
        case 'ArrowRight':
        case 'd':
            if(startd == null){
                startd = Date.now();
            }
            break;
    }
}

function handlekeyUp(e){
    switch(e.key){
        case 'ArrowUp':
        case 'w':
            if(startw != null){
                y -= (Date.now() - startw) * Constants.PLAYER_SPEED / 1000;
                startw = null;
            }
            break;
        case 'ArrowDown':
        case 's':
            if(starts != null){
                y += (Date.now() - starts) * Constants.PLAYER_SPEED / 1000;
                starts = null;
            }
            break;
        case 'ArrowLeft':
        case 'a':
            if(starta != null){
                x -= (Date.now() - starta) * Constants.PLAYER_SPEED / 1000;
                starta = null;
            }
            break;
        case 'ArrowRight':
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

    const { others } = getCurrentState();

    let walls = getMap();
    // stop at wall
    walls.forEach(w => { WalkIntoWall(w[0], w[1]); });

    updateInputs({
        dir: dir,
        x: x,
        y: y,
    });
}

function WalkIntoWall(p1, p2) {
    let pdist = Math.sqrt((x - p1[0]) * (x - p1[0]) + (y - p1[1]) * (y - p1[1]));
    if (pdist <= Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2) {
        let xr = Math.abs(x - p1[0]) / pdist;
        let yr = Math.abs(y - p1[1]) / pdist;
        if (x > p1[0]) {
            x += xr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
        } else {
            x -= xr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
        }
        if (y > p1[1]) {
            y += yr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
        } else {
            y -= yr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
        }
    }
    if (p1[0] - p2[0] == 0) {
        if (y > p1[1] && y < p2[1] || y < p1[1] && y > p2[1]) {
            if (Math.abs(x - p1[0]) <= Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2) {
                if (x - p1[0] > 0) {
                    x += (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(x - p1[0]))
                } else {
                    x -= (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(x - p1[0]))
                }
            }
        }
    } else if (p1[1] - p2[1] == 0) {
        if (x > p1[0] && x < p2[0] || x < p1[0] && x > p2[0]) {
            if (Math.abs(y - p1[1]) <= Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2) {
                if (y - p1[1] > 0) {
                    y += (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(y - p1[1]))
                } else {
                    y -= (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(y - p1[1]))
                }
            }
        }
    } else {
        // not on grid
    }
}

function getSlope(p1, p2) {
    if (p1[1] - p2[1] == 0) {
        return null;
    } else {
        return (p1[1] - p2[1]) / (p1[0] - p2[0]);
    }
}

export function startCapturingInput(xp, yp) {
    x = xp;
    y = yp;

    window.addEventListener('mousemove', onMouseInput);
    window.addEventListener('click', onMouseInput);
    window.addEventListener('touchstart', onTouchInput);
    window.addEventListener('touchmove', onTouchInput);
    window.addEventListener('keydown', handlekeyDown);
    window.addEventListener('keyup', handlekeyUp);
    window.addEventListener('mousedown', handleMouseDown);

    interval = setInterval(handleInput, 1000 / Constants.UPDATE_RATE);
}
  
export function stopCapturingInput() {
    window.removeEventListener('mousemove', onMouseInput);
    window.removeEventListener('click', onMouseInput);
    window.removeEventListener('touchstart', onTouchInput);
    window.removeEventListener('touchmove', onTouchInput);
    window.removeEventListener('keydown', handlekeyDown);
    window.removeEventListener('keyup', handlekeyUp);
    window.removeEventListener('mousedown', handleMouseDown);
    
    dir = 0;
    x = 0;
    y = 0;
    startw = null;
    starta = null;
    starts = null;
    startd = null;

    clearInterval(interval)
}

export function fixPos(newpos){
    x = newpos.newx;
    y = newpos.newy;

    let walls = getMap();
    // check for phase
    walls.forEach(w => { WalkIntoWall(w[0], w[1]); });
}