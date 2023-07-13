import { connect, play } from './networking.js';
import { stopRendering } from './render.js';
import { stopCapturingInput } from './input.js';
import { downloadAssets } from './assets.js';
import { initState } from './state.js';

import './main.css';

const startMenu = document.getElementById('startmenu');
const playButton = document.getElementById('playbutton');
const usernameInput = document.getElementById('usernameinput');

Promise.all([
    connect(onGameOver),
    downloadAssets(),
]).then(() => {
    usernameInput.focus();
    playButton.onclick = () => {
        play(usernameInput.value);
        startMenu.style.display = "none";
        initState();
    };
}).catch(console.error);

function onGameOver() {
    stopCapturingInput();
    stopRendering();
    startMenu.style.display = "block";
}