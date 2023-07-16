import { getAsset } from './assets.js';
import { getCurrentState } from './state.js';
import { getMap } from './map.js';

const Constants = require('../shared/constants.js');
const { NATIVE_RESOLUTION, PLAYER_SCALE, BULLET_SCALE } = Constants;

const canvas = document.getElementById('gamecanvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let Me = null;

function render() {
    if(getCurrentState() == null){
        animationFrameRequestId = requestAnimationFrame(render);
        return;
    }
    const { me, others, bullets } = getCurrentState();
    let walls = getMap();

    if (me) {
        Me = me;
        renderBG(me);
        bullets.forEach(renderBullet.bind(null, me));
        others.forEach(renderPlayer.bind(null, me));
        blockVision();
        walls.forEach(w => { renderWall(w[0], w[1]); });
        renderPlayer(me, me);
    }

    animationFrameRequestId = requestAnimationFrame(render);
}

function renderBG(me){
    const canvasX = canvas.width / 2;
    const canvasY = canvas.height / 2;
    context.save();
    context.translate(canvasX, canvasY);
    context.drawImage(
        getAsset('tiles.png'),
        -canvas.width / 2 - fixCoord(me.x) % (canvas.height / 9) - (canvas.height / 9) * 2 + (canvas.width / 2) % (canvas.height / 9),
        -canvas.height / 2 - fixCoord(me.y) % (canvas.height / 9) - (canvas.height / 9),
        canvas.height / 9 * 24,
        canvas.height / 9 * 13,
    );
    context.restore();
}

function renderPlayer(me, player){
    const { x, y, dir } = player;
    const canvasX = canvas.width / 2 + fixCoord(x) - fixCoord(me.x);
    const canvasY = canvas.height / 2 + fixCoord(y) - fixCoord(me.y);
    context.save();
    context.translate(canvasX, canvasY);
    context.rotate(dir);
    context.drawImage(
        getAsset('bluePlayer.png'),
        -canvas.height / PLAYER_SCALE / 2,
        -canvas.height / PLAYER_SCALE * getAsset('bluePlayer.png').height / getAsset('bluePlayer.png').width + canvas.height / PLAYER_SCALE / 2,
        canvas.height / PLAYER_SCALE,
        canvas.height / PLAYER_SCALE * getAsset('bluePlayer.png').height / getAsset('bluePlayer.png').width,
    );
    context.restore();
}

function renderBullet(me, bullet){
    const { x, y, dir } = bullet;
    const canvasX = canvas.width / 2 + fixCoord(x) - fixCoord(me.x);
    const canvasY = canvas.height / 2 + fixCoord(y) - fixCoord(me.y);
    context.save();
    context.translate(canvasX, canvasY);
    context.rotate(dir);
    context.drawImage(
        getAsset('bullet.png'),
        -canvas.height / BULLET_SCALE / 2,
        -canvas.height / BULLET_SCALE / 2,
        canvas.height / BULLET_SCALE,
        canvas.height / BULLET_SCALE,
    );
    context.restore();
}

function renderWall(p1, p2) {
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.beginPath();
    context.moveTo(fixCoord(p1[0]) - fixCoord(Me.x), fixCoord(p1[1]) - fixCoord(Me.y));
    context.lineTo(fixCoord(p2[0]) - fixCoord(Me.x), fixCoord(p2[1]) - fixCoord(Me.y));
    context.lineTo((fixCoord(p2[0]) - fixCoord(Me.x)) * 40, (fixCoord(p2[1]) - fixCoord(Me.y)) * 40);
    context.lineTo((fixCoord(p1[0]) - fixCoord(Me.x)) * 40, (fixCoord(p1[1]) - fixCoord(Me.y)) * 40);
    context.fill();
    context.restore();
}

function blockVision() {
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(60 * Math.PI / 180 + Me.dir);
    context.fillRect(-2000, 0, 4000, 2000);
    context.restore();

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(-60 * Math.PI / 180 + Me.dir);
    context.fillRect(-2000, 0, 4000, 2000);
    context.restore();
}

function fixCoord(x){
    return x * canvas.height / NATIVE_RESOLUTION;
}

let animationFrameRequestId;

export function startRendering() {
    animationFrameRequestId = requestAnimationFrame(render);
}

export function stopRendering() {
    cancelAnimationFrame(animationFrameRequestId);
}