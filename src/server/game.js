const Constants = require('../shared/constants.js');
const Player = require('./player.js');

class Game {
    constructor() {
        this.players = {};
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        setInterval(this.update.bind(this), 1000 / 60);
    }

    addPlayer(socket, username) {
        this.players[socket.id] = new Player(socket.id, socket, username, Math.random() * 500, Math.random() * 500, 0);
    }

    removePlayer(socket) {
        delete this.players[socket.id];
    }

    handleInput(socket, dir) {
        if (this.players[socket.id]) {
            this.players[socket.id].setDirection(dir);
        }
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
        
        if (this.shouldSendUpdate) {
        Object.values(this.players).forEach(player => {
            player.socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
        });
        this.shouldSendUpdate = false;
        } else {
        this.shouldSendUpdate = true;
        }
    }

    createUpdate(player) {
        const nearbyPlayers = Object.values(this.players);

        return {
        t: Date.now(),
        me: player.serializeForUpdate(),
        others: nearbyPlayers.map(p => p.serializeForUpdate()),
        };
    }
}

module.exports = Game;