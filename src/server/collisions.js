const Constants = require('../shared/constants');

function applyBulletCollisions(players, bullets) {
    const removeBullets = [];
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < players.length; j++) {
            const bullet = bullets[i];
            const player = players[j];
            if (
                bullet.pid !== player.id &&
                player.distanceTo(bullet) <= (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE + Constants.NATIVE_RESOLUTION / Constants.BULLET_SCALE) / 2
            ) {
                removeBullets.push(bullet);
                player.dead = true;
                break;
            }
        }
    }
    return removeBullets;
}

module.exports = applyBulletCollisions;