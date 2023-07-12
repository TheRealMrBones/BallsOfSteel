const ObjectClass = require('./object.js');

class Player extends ObjectClass {
    constructor(id, socket, username, x, y, dir) {
        super(id, x, y, dir);
        this.socket = socket;
        this.username = username;
        this.dead = false;
    }

    move(x, y){
        this.x = x;
        this.y = y;
    }

    serializeForUpdate() {
        return {
        ...(super.serializeForUpdate()),
        username: this.username,
        };
    }
}

module.exports = Player;