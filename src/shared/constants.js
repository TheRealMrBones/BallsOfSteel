module.exports = Object.freeze({
    PLAYER_SCALE: 19,
    PLAYER_SPEED: 400,
    PLAYER_FIRE_COOLDOWN: 1,

    BULLET_SCALE: 59,
    BULLET_SPEED: 2000,
    BULLET_TTL: 1000,

    UPDATE_RATE: 50,

    NATIVE_RESOLUTION: 1080,

    MSG_TYPES: {
        JOIN_GAME: 'join_game',
        LEAVE_GAME: 'disconnect',
        PLAYER_INSTANTIATED: 'instantiated',
        GAME_UPDATE: 'update',
        INPUT: 'input',
        FIX_POS: 'fixpos',
        SHOOT: 'shoot',
        DEAD: 'dead',
        KILL: 'kill',
    },
});