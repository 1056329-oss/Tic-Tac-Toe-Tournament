// Main Game Logic

class TicTacToeGame {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.player1 = null;
        this.player2 = null;
        this.player1Name = '';
        this.player1Age = 0;
        this.player2Name = '';
        this.player2Age = 0;
        
        this.initializeEventListeners();
        this.loadRankings();
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPage(e.target.dataset.page));
        });

        // Home page buttons
        document.getElementById('startPlayBtn').addEventListener('click', () => this.switchPage('play'));
        document.getElementById('viewRankingsBtn').addEventListener('click', () => this.switchPage('rankings'));

        // Play page buttons
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('endGameBtn').addEventListener('click', () => this.endGame());

        // Rankings back button
        document.getElementById('backFromRankingsBtn').addEventListener('click', () => this.switchPage('home'));

        // Board cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => this.makeMove(e.target));
        });
    }

    switchPage(pageName) {
        // Update page visibility
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageName).classList.add('active');

        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // Load rankings when switching to rankings page
        if (pageName === 'rankings') {
            this.loadRankings();
        }

        // Reset play page when going back to home
        if (pageName === 'home') {
            this.resetPlayPage();
        }
    }

    startGame() {
        const player1Name = document.getElementById('player1Name').value.trim();
        const player1Age = parseInt(document.getElementById('player1Age').value);
        const player2Name = document.getElementById('player2Name').value.trim();
        const player2Age = parseInt(document.getElementById('player2Age').value);

        // Validate inputs
        if (!player1Name || !player2Name) {
            alert('Please enter names for both players');
            return;
        }

        if (!player1Age || !player2Age || player1Age < 1 || player2Age < 1) {
            alert('Please enter valid ages for both players');
            return;
        }

        this.player1Name = player1Name;
        this.player1Age = player1Age;
        this.player2Name = player2Name;
        this.player2Age = player2Age;

        // Hide registration form and show game board
        document.getElementById('playerRegistration').classList.add('hidden');
        document.getElementById('gameBoard').classList.remove('hidden');

        // Reset board
        this.resetBoard();

        // Update player info display
        document.getElementById('player1Info').textContent = `${player1Name} (${player1Age})`;
        document.getElementById('player2Info').textContent = `${player2Name} (${player2Age})`;

        // Start the game
        this.updateCurrentTurn();
    }

    resetPlayPage() {
        // Clear form
        document.getElementById('player1Name').value = '';
        document.getElementById('player1Age').value = '';
        document.getElementById('player2Name').value = '';
        document.getElementById('player2Age').value = '';

        // Show registration, hide board
        document.getElementById('playerRegistration').classList.remove('hidden');
        document.getElementById('gameBoard').classList.add('hidden');

        // Reset board
        this.resetBoard();
    }

    resetBoard() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;

        // Clear board display
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });

        // Clear game status
        document.getElementById('gameStatus').textContent = '';
        document.getElementById('gameStatus').classList.remove('winner', 'draw');

        // Hide play again button
        document.getElementById('playAgainBtn').style.display = 'none';

        this.updateCurrentTurn();
    }

    makeMove(cell) {
        if (this.gameOver) return;

        const index = parseInt(cell.dataset.index);
        if (this.board[index] !== null) return;

        this.board[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());

        const winner = this.checkWinner();
        if (winner) {
            this.endGameRound(winner);
            return;
        }

        const isBoardFull = this.board.every(cell => cell !== null);
        if (isBoardFull) {
            this.endGameRound('draw');
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateCurrentTurn();
    }

    checkWinner() {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let line of lines) {
            const [a, b, c] = line;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }

        return null;
    }

    endGameRound(result) {
        this.gameOver = true;
        const statusEl = document.getElementById('gameStatus');

        if (result === 'draw') {
            statusEl.textContent = "It's a Draw! 🤝";
            statusEl.classList.add('draw');
            // Save draw for both players
            playerStorage.savePlayer(this.player1Name, this.player1Age, 'draw');
            playerStorage.savePlayer(this.player2Name, this.player2Age, 'draw');
        } else {
            const winner = result === 'X' ? this.player1Name : this.player2Name;
            const loser = result === 'X' ? this.player2Name : this.player1Name;
            statusEl.textContent = `🎉 ${winner} wins!`;
            statusEl.classList.add('winner');

            // Save results
            playerStorage.savePlayer(winner, result === 'X' ? this.player1Age : this.player2Age, 'win');
            playerStorage.savePlayer(loser, result === 'X' ? this.player2Age : this.player1Age, 'loss');
        }

        document.getElementById('playAgainBtn').style.display = 'inline-block';
    }

    resetGame() {
        this.resetBoard();
    }

    endGame() {
        this.resetPlayPage();
        this.switchPage('rankings');
    }

    updateCurrentTurn() {
        const playerName = this.currentPlayer === 'X' ? this.player1Name : this.player2Name;
        document.getElementById('currentTurn').textContent = `Current Turn: ${playerName} (${this.currentPlayer})`;
    }

    loadRankings() {
        const rankings = playerStorage.getRankings();
        const rankingsList = document.getElementById('rankingsList');

        if (rankings.length === 0) {
            rankingsList.innerHTML = '<p class="empty-message">No players yet. Start playing to be ranked!</p>';
            return;
        }

        rankingsList.innerHTML = rankings.map((player, index) => {
            const position = index + 1;
            let medalClass = '';
            let medal = '';

            if (position === 1) {
                medalClass = 'gold';
                medal = '🥇';
            } else if (position === 2) {
                medalClass = 'silver';
                medal = '🥈';
            } else if (position === 3) {
                medalClass = 'bronze';
                medal = '🥉';
            } else {
                medal = `${position}`;
            }

            return `
                <div class="ranking-item">
                    <div class="ranking-position ${medalClass}">${medal}</div>
                    <div class="ranking-details">
                        <div class="ranking-name">${player.name}</div>
                        <div class="ranking-stats">Age: ${player.age} | Matches: ${player.matches} | W-D-L: ${player.wins}-${player.draws}-${player.losses} | Win Rate: ${player.winRate}%</div>
                    </div>
                    <div class="ranking-score">${player.points} pts</div>
                </div>
            `;
        }).join('');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToeGame();
});
