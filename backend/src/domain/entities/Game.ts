export type CellValue = 'X' | 'O' | null;
export type GameStatus = 'waiting' | 'active' | 'finished';
export type GameResult = 'X' | 'O' | 'draw' | null;

/**
 * Represents a tic-tac-toe game session between two players.
 */
export interface Game {
    id: string;
    playerXId: string;
    playerOId: string | null;
    board: CellValue[];
    currentTurn: 'X' | 'O';
    status: GameStatus;
    result: GameResult;
    winnerId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const WIN_CONDITIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

/**
 * Pure function that inspects the board and returns the game result. 
 *
 * @param board - The current 9-cell board state
 * @returns 'X' or 'O' if that symbol has a winning line,
 *          'draw' if all cells are filled with no winner,
 *          null if the game is still in progress
 */
export function checkWinner(board: CellValue[]): GameResult {
    for (const [a, b, c] of WIN_CONDITIONS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] as 'X' | 'O'
        }
    }
    if (board.every(cell => cell !== null)) return 'draw'
    return null;
}