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
    usernameInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.key === "Enter") {
            init();
        }
    });
    playButton.onclick = () => {
        init();
    };
}).catch(console.error);

function init(){
    play(usernameInput.value);
    startMenu.style.display = "none";
    initState();
}

function onGameOver() {
    stopCapturingInput();
    stopRendering();
    startMenu.style.display = "block";
}