import io from 'socket.io-client';
import { processGameUpdate } from './state.js';
import { throttle } from 'throttle-debounce';

const Constants = require('../shared/constants.js');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });
const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
        console.log('Connected to server!');
        resolve();
    });
});

export const connect = onGameOver => (
    connectedPromise.then(() => {
        socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
        socket.on(Constants.MSG_TYPES.DEAD, onGameOver);
    })
);

export const play = username => {
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};
  
export const updateInputs = throttle(20, inputs => {
    socket.emit(Constants.MSG_TYPES.INPUT, inputs);
});

export const shoot = throttle(20, () => {
    socket.emit(Constants.MSG_TYPES.SHOOT);
});