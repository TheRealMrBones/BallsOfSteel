const shortid = require('shortid');
const ObjectClass = require('./object.js');
const Constants = require('../shared/constants.js');

class Bullet extends ObjectClass {
    constructor(pid, x, y, dir) {
        super(shortid(), x, y, dir);
        this.pid = pid;
        this.bday = Date.now();
    }

    update(dt){
        super.updateX(Math.cos(this.dir - Math.PI / 2) * dt * Constants.BULLET_SPEED);
        super.updateY(Math.sin(this.dir - Math.PI / 2) * dt * Constants.BULLET_SPEED);
        return Date.now() - this.bday > Constants.BULLET_TTL;
    }

    serializeForUpdate() {
        return {
        ...(super.serializeForUpdate()),
        pid: this.pid,
        };
    }
}

module.exports = Bullet;