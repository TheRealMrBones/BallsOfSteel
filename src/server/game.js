const Constants = require('../shared/constants.js');
const Player = require('./player.js');
const Bullet = require('./bullet.js');
const Map = require('./map.js');
const {applyBulletCollisions, moveTouchingPlayers, phaseCheck} = require('./collisions.js');

class Game {
    constructor() {
        this.players = {};
        this.bullets = [];
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        this.map = new Map();
        this.leaderboard = [];
        setInterval(this.update.bind(this), 1000 / Constants.UPDATE_RATE);
    }

    addPlayer(socket, username) {
        let spawn = this.map.getSpawn();
        this.players[socket.id] = new Player(socket.id, socket, username, spawn[0], spawn[1], 0);
        this.players[socket.id].socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(this.players[socket.id]));
        socket.emit(Constants.MSG_TYPES.PLAYER_INSTANTIATED, {
            x: spawn[0],
            y: spawn[1],
            walls: this.map.getMap(this.players[socket.id].x, this.players[socket.id].y)
        });
    }

    removePlayer(socket) {
        delete this.players[socket.id];
    }

    shoot(socket){
        if(this.players[socket.id] !== undefined){
            if(Date.now() - this.players[socket.id].lastshot > Constants.PLAYER_FIRE_COOLDOWN * 1000){
                this.bullets.push(new Bullet(socket.id, this.players[socket.id].x, this.players[socket.id].y, this.players[socket.id].dir));
                this.players[socket.id].lastshot = Date.now();
            }
        }
    }

    handleInput(socket, inputs) {
        if(this.players[socket.id] !== undefined){
            const { dir, x, y } = inputs;
            if (this.players[socket.id]) {
                this.players[socket.id].setDirection(dir);
                this.players[socket.id].move(x, y);
                moveTouchingPlayers(this.players[socket.id], Object.values(this.players), this.map);
            }
        }
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        let removeBullets = [];

        for(let i = 0; i < 2; i++){
            // repeat for higher bullet hit accuracy
            removeBullets.push(...applyBulletCollisions(Object.values(this.players), this.bullets));
            removeBullets.forEach(b => {
                this.players[b.pid].kills++;
                this.players[b.pid].socket.emit(Constants.MSG_TYPES.KILL, { killed: b.killed });
            });

            this.bullets.forEach(bullet => {
                if (bullet.update(dt, this.map.getMap(bullet.x, bullet.y))){
                    removeBullets.push(bullet);
                }
            });

            this.bullets = this.bullets.filter(b => !removeBullets.includes(b));
            removeBullets = [];
        }

        Object.values(this.players).forEach(p => {
            if(p.dead){
                p.socket.emit(Constants.MSG_TYPES.DEAD);
                this.removePlayer(p.socket);
            }
        })

        let sortedKillers = Object.values(this.players).sort((a, b) => b.kills - a.kills).map(function(p){
            return `${p.username} : ${p.kills}`;
        });
        for(let i = 0; i < 5; i++){
            if(typeof sortedKillers[i] === 'undefined'){
                this.leaderboard[i] = "-----";
            }else{
                this.leaderboard[i] = sortedKillers[i];
            }
        }

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
            leaderboard: this.leaderboard
        };
    }
}

module.exports = Game;