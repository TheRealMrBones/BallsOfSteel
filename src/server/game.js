const Constants = require('../shared/constants.js');
const Player = require('./player.js');
const Bullet = require('./bullet.js');
const Map = require('./map.js');
const applyBulletCollisions = require('./collisions');

class Game {
    constructor() {
        this.players = {};
        this.bullets = [];
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        this.map = new Map();
        setInterval(this.update.bind(this), 1000 / Constants.UPDATE_RATE);
    }

    addPlayer(socket, username) {
        let spawn = this.map.getSpawn();
        this.players[socket.id] = new Player(socket.id, socket, username, spawn[0], spawn[1], 0);
        this.players[socket.id].socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(this.players[socket.id]));
        socket.emit(Constants.MSG_TYPES.PLAYER_INSTANTIATED, {
            x: spawn[0],
            y: spawn[1]
        });
    }

    removePlayer(socket) {
        delete this.players[socket.id];
    }

    shoot(socket){
        if(this.players[socket.id] !== undefined){
            this.bullets.push(new Bullet(socket.id, this.players[socket.id].x, this.players[socket.id].y, this.players[socket.id].dir));
        }
    }

    handleInput(socket, inputs) {
        if(this.players[socket.id] !== undefined){
            const { dir, x, y } = inputs;
            if (this.players[socket.id]) {
                this.players[socket.id].setDirection(dir);
                this.players[socket.id].move(x, y);
            }
        }
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
        
        const removeBullets = [];
        this.bullets.forEach(bullet => {
            if (bullet.update(dt, this.map.getSurroundings(bullet.x, bullet.y))){
                removeBullets.push(bullet);
            }
        });
        removeBullets.push(...applyBulletCollisions(Object.values(this.players), this.bullets));
        this.bullets = this.bullets.filter(b => !removeBullets.includes(b));

        Object.values(this.players).forEach(p => {
            if(p.dead){
                p.socket.emit(Constants.MSG_TYPES.DEAD);
                this.removePlayer(p.socket);
            }
        })

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
        const nearbyBullets = Object.values(this.bullets);

        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: nearbyPlayers.map(p => p.serializeForUpdate()),
            bullets: nearbyBullets.map(b => b.serializeForUpdate()),
            walls: this.map.getSurroundings(player.x, player.y)
        };
    }
}

module.exports = Game;