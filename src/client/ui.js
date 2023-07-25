
const kill = document.getElementById('kill');
const leaderboard1 = document.getElementById('leaderboard1');
const leaderboard2 = document.getElementById('leaderboard2');
const leaderboard3 = document.getElementById('leaderboard3');
const leaderboard4 = document.getElementById('leaderboard4');
const leaderboard5 = document.getElementById('leaderboard5');

let hideKillInterval = null;

export function displayKill(stuff){
    kill.style.display = "block";
    kill.innerText = `Killed ${stuff.killed}`;
    hideKillInterval = setInterval(hideKill, 5000)
}

function hideKill(){
    kill.style.display = "none";
    clearInterval(hideKillInterval);
}

export function updateLeaderboard(stuff){
    leaderboard1.innerHTML = stuff[0];
    leaderboard2.innerHTML = stuff[1];
    leaderboard3.innerHTML = stuff[2];
    leaderboard4.innerHTML = stuff[3];
    leaderboard5.innerHTML = stuff[4];
}