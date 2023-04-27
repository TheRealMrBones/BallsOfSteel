const ObjectClass = require('./object.js');
const Constants = require('../shared/constants.js');

class Player extends ObjectClass {
    constructor(id, socket, username, x, y, dir) {
        super(id, x, y, dir);
        this.socket = socket;
        this.username = username;
    }

    serializeForUpdate() {
        return {
        ...(super.serializeForUpdate()),
        username: this.username,
        };
    }
}

module.exports = Player;