const Constants = require('../shared/constants.js');
const Player = require('./player.js');
const Bullet = require('./bullet.js');

class Game {
    constructor() {
        this.players = {};
        this.bullets = [];
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        setInterval(this.update.bind(this), 1000 / Constants.UPDATE_RATE);
    }

    addPlayer(socket, username) {
        this.players[socket.id] = new Player(socket.id, socket, username, Math.random() * 500, Math.random() * 500, 0);
    }

    removePlayer(socket) {
        delete this.players[socket.id];
    }

    shoot(socket){
        this.bullets.push(new Bullet(socket.id, this.players[socket.id].x, this.players[socket.id].y, this.players[socket.id].dir));
    }

    handleInput(socket, inputs) {
        const { dir, x, y } = inputs;
        if (this.players[socket.id]) {
            this.players[socket.id].setDirection(dir);
            this.players[socket.id].updateX(x);
            this.players[socket.id].updateY(y);
        }
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
        
        if (this.shouldSendUpdate) {
            this.bullets.forEach(bullet => {
                bullet.updatePos(dt);
            });
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
        const nearbyBullets = Object.values(this.bullets);

        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: nearbyPlayers.map(p => p.serializeForUpdate()),
            bullets: nearbyBullets.map(b => b.serializeForUpdate()),
        };
    }
}

module.exports = Game;