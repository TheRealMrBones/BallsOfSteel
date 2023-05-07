module.exports = Object.freeze({
    PLAYER_SCALE: 17,
    PLAYER_SPEED: 400,
    PLAYER_FIRE_COOLDOWN: 0.25,

    BULLET_SCALE: 59,
    BULLET_SPEED: 3000,
    BULLET_TTL: 2000,

    UPDATE_RATE: 60,

    NATIVE_RESOLUTION: 1080,

    MSG_TYPES: {
        JOIN_GAME: 'join_game',
        LEAVE_GAME: 'disconnect',
        GAME_UPDATE: 'update',
        INPUT: 'input',
        SHOOT: 'shoot',
        DEAD: 'dead',
    },
});