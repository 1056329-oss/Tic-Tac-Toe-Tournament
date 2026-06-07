// PlayerStorage - Manages player data and rankings in localStorage

class PlayerStorage {
    constructor() {
        this.STORAGE_KEY = 'ticTacToePlayers';
    }

    // Get all players
    getAllPlayers() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Get player by name
    getPlayer(name) {
        const players = this.getAllPlayers();
        return players.find(p => p.name.toLowerCase() === name.toLowerCase());
    }

    // Add or update player
    savePlayer(name, age, result) {
        let players = this.getAllPlayers();
        let player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

        if (!player) {
            player = {
                id: Date.now() + Math.random(),
                name: name,
                age: age,
                wins: 0,
                losses: 0,
                draws: 0,
                points: 0,
                matches: 0,
                firstPlayed: new Date().toLocaleDateString()
            };
            players.push(player);
        }

        // Update stats
        player.matches += 1;
        if (result === 'win') {
            player.wins += 1;
            player.points += 3;
        } else if (result === 'draw') {
            player.draws += 1;
            player.points += 1;
        } else if (result === 'loss') {
            player.losses += 1;
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(players));
        return player;
    }

    // Get sorted rankings
    getRankings() {
        const players = this.getAllPlayers();
        return players.sort((a, b) => {
            // Sort by points first, then by wins
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            return b.wins - a.wins;
        });
    }

    // Get player stats
    getPlayerStats(name) {
        const player = this.getPlayer(name);
        if (!player) return null;

        const winRate = player.matches > 0 
            ? ((player.wins / player.matches) * 100).toFixed(1) 
            : 0;

        return {
            ...player,
            winRate: winRate
        };
    }

    // Clear all data
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

// Create global instance
const playerStorage = new PlayerStorage();
