export type CellValue = 'X' | 'O' | null;
export type GameStatus = 'waiting' | 'active' | 'finished';
export type GameResult = 'X' | 'O' | 'draw' | null;

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

export type WsMessage =
    | { type: 'waiting'; game: Game }
    | { type: 'game_start'; game: Game }
    | { type: 'game_update'; game: Game }
    | { type: 'game_over'; game: Game }
    | { type: 'error'; message: string };