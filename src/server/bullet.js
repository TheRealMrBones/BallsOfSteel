const shortid = require('shortid');
const ObjectClass = require('./object.js');
const Constants = require('../shared/constants.js');

class Bullet extends ObjectClass {
    constructor(pid, x, y, dir) {
        super(shortid(), x, y, dir);
        this.pid = pid;
        this.bday = Date.now();
        this.dx = 0;
        this.dy = 0;
    }

    update(dt, blocks){
        this.dx = Math.cos(this.dir - Math.PI / 2) * dt * Constants.BULLET_SPEED;
        this.dy = Math.sin(this.dir - Math.PI / 2) * dt * Constants.BULLET_SPEED;
        let hit = false;
        blocks.forEach(b => { 
            if(this.hitBlock(b)){
                hit = true;
            }
        })
        if(hit){
            return true;
        }
        super.updateX(this.dx);
        super.updateY(this.dy);
        return Date.now() - this.bday > Constants.BULLET_TTL;
    }

    hitBlock(block) {
        let first;
        let last;
        let hit = false;
        block.forEach(p => {
            if (first == null) {
                first = p;
            } else {
                if(this.hitWall(p, last)){
                    hit = true;
                }
            }
            last = p;
        });
        if(hit){
            return true;
        }
        return this.hitWall(first, last);
    }
    
    hitWall(p1, q1){
        let p2 = [ this.x, this.y ]
        let q2 = [ this.x + this.dx, this.y + this.dy ]
        let o1 = this.orientation(p1, q1, p2);
        let o2 = this.orientation(p1, q1, q2);
        let o3 = this.orientation(p2, q2, p1);
        let o4 = this.orientation(p2, q2, q1);

        if (o1 != o2 && o3 != o4){
            return true;
        }

        if (o1 == 0 && this.onSegment(p1, p2, q1)){ return true; }

        if (o2 == 0 && this.onSegment(p1, q2, q1)){ return true; }

        if (o3 == 0 && this.onSegment(p2, p1, q2)){ return true; }

        if (o4 == 0 && this.onSegment(p2, q1, q2)){ return true; }

        return false;
    }

    onSegment(p, q, r)
    {
        if (q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]) &&
            q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1])){ return true; }
    
        return false;
    }
    
    orientation(p, q, r)
    {
        let val = (q[1] - p[1]) * (r[0] - q[0]) -
                (q[0] - p[0]) * (r[1] - q[1]);
    
        if (val == 0) return 0;
    
        return (val > 0)? 1: 2;
    }

    serializeForUpdate() {
        return {
        ...(super.serializeForUpdate()),
        pid: this.pid,
        };
    }
}

module.exports = Bullet;