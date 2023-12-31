// ==UserScript==
// @name Matchmaker
// @author wa#3991
// @version 1.0
// @desc Finds games for you based on set criteria
// @run-at document-start
// ==/UserScript==

/* <-- Constants --> */
const criteria = {
    regions: ['FRA', 'DAL', 'SV', 'BHN', 'BRZ', 'SIN','MBI', 'SYD', 'AFR'],
    gameModes: ['FFA', 'Kranked FFA', 'Bighead FFA', 'Deposit FFA'],
    minPlayers: 5,
    minRemainingTime: 170,
};

/* <-- Functions --> */
function secondsToTime(num) {
    const minutes = Math.floor(num / 60);
    const seconds = num % 60;

    if (minutes < 1) return `${num}s`;
    return `${minutes}m ${seconds}s`;
}

function getGameMode(num) {
    switch (num) {
        case 0:
            return 'FFA';
        case 1:
            return 'Team Deathmatch';
        case 2:
            return 'Hardpoint';
        case 3:
            return 'Capture the Flag';
        case 4:
            return 'Bhop';
        case 5:
            return 'Hide and Seek';
        case 6:
            return 'Infection';
        case 7:
            return 'Race';
        case 8:
            return 'Last Man Standing';
        case 9:
            return 'Simon Says';
        case 10:
            return 'Gun Game';
        case 11:
            return 'Prop Hunt';
        case 12:
            return 'Boss Hunt';
        case 14:
            return 'Deposit';
        case 18:
            return 'Trade';
        case 19:
            return 'Kill Confirmed';
        case 21:
            return 'Sharp Shooter';
        case 23:
            return 'Raids';
        case 25:
            return 'Domination';
        case 27:
            return 'Kranked FFA';
        case 28:
            return 'Team Defender';
        case 29:
            return 'Deposit FFA';
        case 33:
            return 'Chaos Snipers';
        case 34:
            return 'Bighead FFA';
        case 35:
            return 'Zombies';
        default:
            return 'unknown';
    }
}

function fetchGame() {
    fetch(`https://matchmaker.krunker.io/game-list?hostname=${window.location.hostname}`)
        .then((result) => result.json())
        .then((result) => {
            const games = [];

            for (const game of result.games) {
                const gameID = game[0];
                const region = gameID.split(':')[0];
                const playerCount = game[2];
                const maxPlayers = game[3];
                const map = game[4]['i'];
                const gamemode = getGameMode(game[4]['g']);
                const remainingTime = game[5];

                if (
                    !criteria.regions.includes(region) ||
                    !criteria.gameModes.includes(gamemode) ||
                    playerCount < criteria.minPlayers ||
                    remainingTime < criteria.minRemainingTime ||
                    playerCount === maxPlayers ||
                    window.location.href.includes(gameID)
                )
                    continue;

                games.push({
                    gameID: gameID,
                    region: region,
                    playerCount: playerCount,
                    maxPlayers: maxPlayers,
                    map: map,
                    gamemode: gamemode,
                    remainingTime: remainingTime,
                });
            }

            const game = games[Math.floor(Math.random() * games.length)];
            try {
                const text = `Game found!\n\nRegion: ${game.region}\nMap: ${game.map}\nGamemode: ${game.gamemode}\nPlayers: ${game.playerCount}/${game.maxPlayers}\nTime remaining: ${secondsToTime(game.remainingTime)}\n\nJoining game...`;
                alert(text);
                window.location.href = `https://krunker.io/?game=${game.gameID}`;
            } catch (e) {
                alert('Unable to find game.');
            }
        });
}

/* <-- Main --> */
document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        fetchGame();
    }
});
