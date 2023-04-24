import { connect, play } from './networking.js';
import { startRendering, stopRendering } from './render.js';
import { startCapturingInput, stopCapturingInput } from './input.js';
import { downloadAssets } from './assets.js';
import { initState } from './state.js';

import './css/main.css';

const startMenu = document.getElementById('startmenu');
const playButton = document.getElementById('playbutton');
const usernameInput = document.getElementById('usernameinput');

Promise.all([
    connect(),
    downloadAssets(),
  ]).then(() => {
    usernameInput.focus();
    playButton.onclick = () => {
      // Play!
      play(usernameInput.value);
      startMenu.style.display = "none";
      initState();
      startCapturingInput();
      startRendering();
    };
  });