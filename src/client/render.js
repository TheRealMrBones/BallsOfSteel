import { getAsset } from './assets.js';
import { getCurrentState } from './state.js';

const Constants = require('../shared/constants.js');
const { PLAYER_RADIUS } = Constants;

const canvas = document.getElementById('gamecanvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function render() {
    if(getCurrentState() == null){
        animationFrameRequestId = requestAnimationFrame(render);
        return;
    }
    const { me, others } = getCurrentState();

    if (me) {

        renderPlayer(me, me);
        others.forEach(renderPlayer.bind(null, me));
        
    }

    animationFrameRequestId = requestAnimationFrame(render);
}

function renderPlayer(me, player){
    const { x, y, dir } = player;
    const canvasX = canvas.width / 2 + x - me.x;
    const canvasY = canvas.height / 2 + y - me.y;
    context.save();
    context.translate(canvasX, canvasY);
    context.rotate(dir);
    context.drawImage(
        getAsset('bluePlayer.png'),
        -PLAYER_RADIUS,
        -PLAYER_RADIUS,
        PLAYER_RADIUS * 2,
        PLAYER_RADIUS * 2,
    );
    context.restore();
}

let animationFrameRequestId;

export function startRendering() {
    animationFrameRequestId = requestAnimationFrame(render);
}

export function stopRendering() {
    cancelAnimationFrame(animationFrameRequestId);
}