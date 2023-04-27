let lastGameUpdate = null;

export function initState(){
    // dont care rn
}

export function processGameUpdate(update) {
    lastGameUpdate = update;
}

export function getCurrentState() {
    return lastGameUpdate;
}