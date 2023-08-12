const Constants = require('../shared/constants');

exports.applyBulletCollisions = (players, bullets) => {
    const removeBullets = [];
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < players.length; j++) {
            const bullet = bullets[i];
            const player = players[j];
            if (
                bullet.pid !== player.id &&
                player.distanceTo(bullet) <= (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE + Constants.NATIVE_RESOLUTION / Constants.BULLET_SCALE) / 2
            ) {
                bullet.killed = player.username;
                removeBullets.push(bullet);
                player.dead = true;
                break;
            }
        }
    }
    return removeBullets;
}

exports.phaseCheck = (player, walls) => {
    walls.forEach(w => { 
        let p1 = w[0];
        let p2 = w[1];
        let pdist = Math.sqrt((player.x - p1[0]) * (player.x - p1[0]) + (player.y - p1[1]) * (player.y - p1[1]));
        if (pdist <= Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2) {
            let xr = Math.abs(player.x - p1[0]) / pdist;
            let yr = Math.abs(player.y - p1[1]) / pdist;
            if (player.x > p1[0]) {
                player.x += xr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
            } else {
                player.x -= xr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
            }
            if (player.y > p1[1]) {
                player.y += yr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
            } else {
                player.y -= yr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
            }
        }
        if (p1[0] - p2[0] == 0) {
            if (player.y > p1[1] && player.y < p2[1] || player.y < p1[1] && player.y > p2[1]) {
                if (Math.abs(player.x - p1[0]) <= Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2) {
                    if (player.x - p1[0] > 0) {
                        player.x += (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(player.x - p1[0]))
                    } else {
                        player.x -= (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(player.x - p1[0]))
                    }
                }
            }
        } else if (p1[1] - p2[1] == 0) {
            if (player.x > p1[0] && player.x < p2[0] || player.x < p1[0] && player.x > p2[0]) {
                if (Math.abs(player.y - p1[1]) <= Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2) {
                    if (player.y - p1[1] > 0) {
                        player.y += (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(player.y - p1[1]))
                    } else {
                        player.y -= (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(player.y - p1[1]))
                    }
                }
            }
        } else {
            // not on grid
        }
    });
    player.socket.emit(Constants.MSG_TYPES.FIX_POS, {
        newx: player.x,
        newy: player.y,
    });
}

function PhaseCheck(player, walls){
    walls.forEach(w => { 
        let p1 = w[0];
        let p2 = w[1];
        let pdist = Math.sqrt((player.x - p1[0]) * (player.x - p1[0]) + (player.y - p1[1]) * (player.y - p1[1]));
        if (pdist <= Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2) {
            let xr = Math.abs(player.x - p1[0]) / pdist;
            let yr = Math.abs(player.y - p1[1]) / pdist;
            if (player.x > p1[0]) {
                player.x += xr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
            } else {
                player.x -= xr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
            }
            if (player.y > p1[1]) {
                player.y += yr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
            } else {
                player.y -= yr * (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - pdist);
            }
        }
        if (p1[0] - p2[0] == 0) {
            if (player.y > p1[1] && player.y < p2[1] || player.y < p1[1] && player.y > p2[1]) {
                if (Math.abs(player.x - p1[0]) <= Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2) {
                    if (player.x - p1[0] > 0) {
                        player.x += (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(player.x - p1[0]))
                    } else {
                        player.x -= (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(player.x - p1[0]))
                    }
                }
            }
        } else if (p1[1] - p2[1] == 0) {
            if (player.x > p1[0] && player.x < p2[0] || player.x < p1[0] && player.x > p2[0]) {
                if (Math.abs(player.y - p1[1]) <= Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2) {
                    if (player.y - p1[1] > 0) {
                        player.y += (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(player.y - p1[1]))
                    } else {
                        player.y -= (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE / 2 - Math.abs(player.y - p1[1]))
                    }
                }
            }
        } else {
            // not on grid
        }
    });
}

exports.moveTouchingPlayers = (player, players, map) => {
    for (let i = 0; i < players.length; i++) {
        const player2 = players[i];
        let dist = player.distanceTo(player2);
        if (
            player2.id != player.id &&
            dist <= (Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE + Constants.NATIVE_RESOLUTION / Constants.PLAYER_SCALE) / 2
        ) {
            if(dist == 0){
                player.x += dist / 4;
                player2.x -= dist / 4;
            }else{
                let dir = Math.atan2(player.x - player2.x, player2.y - player.y);
                player.x += Math.sin(dir) * dist / 4;
                player.y -= Math.cos(dir) * dist / 4;
                player2.x -= Math.sin(dir) * dist / 4;
                player2.y += Math.cos(dir) * dist / 4;
                PhaseCheck(player, map.getMap(player.x, player.y));
                PhaseCheck(player2, map.getMap(player2.x, player2.y));
                player.socket.emit(Constants.MSG_TYPES.FIX_POS, {
                    newx: player.x,
                    newy: player.y,
                });
                player2.socket.emit(Constants.MSG_TYPES.FIX_POS, {
                    newx: player2.x,
                    newy: player2.y,
                });
            }
        }
    }
}