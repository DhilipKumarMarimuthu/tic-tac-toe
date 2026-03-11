/** Represents the value of a single board cell. */
export type CellValue = 'X' | 'O' | null;

/** Lifecycle status of a game. */
export type GameStatus = 'waiting' | 'active' | 'finished';

/** Outcome of a finished game or null while the game is in progress. */
export type GameResult = 'X' | 'O' | 'draw' | null;

/** Full game state as returned by the API. */
export interface Game {
    id: string;
    playerXId: string;
    playerOId: string | null;
    board: CellValue[];
    currentTurn: 'X' | 'O';
    status: GameStatus;
    result: GameResult;
    winnerId: string | null;
    createdAt: string;
    updatedAt: string;
}

/** Discriminated union of all WebSocket message types sent by the server. */
export type WsMessage =
    | { type: 'waiting'; game: Game }
    | { type: 'game_start'; game: Game }
    | { type: 'game_update'; game: Game }
    | { type: 'game_over'; game: Game }
    | { type: 'error'; message: string };