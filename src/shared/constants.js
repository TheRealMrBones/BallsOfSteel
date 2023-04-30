module.exports = Object.freeze({
    PLAYER_SCALE: .5,
    PLAYER_SPEED: 400,
    PLAYER_FIRE_COOLDOWN: 0.25,
    UPDATE_RATE: 60,

    MSG_TYPES: {
        JOIN_GAME: 'join_game',
        LEAVE_GAME: 'disconnect',
        GAME_UPDATE: 'update',
        INPUT: 'input',
        DEAD: 'dead',
    },
});