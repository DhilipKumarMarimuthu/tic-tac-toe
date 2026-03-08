import { Game, CellValue } from '../entities/Game';

export interface IGameRepository {
    findById(id: string): Promise<Game | null>;
    create(playerXId: string): Promise<Game>;
    findAndJoinGame(playerId: string): Promise<Game | null>;
    applyMove(gameId: string, board: CellValue[], currentTurn: 'X' | 'O'): Promise<Game>;
    finishGame(gameId: string, board: CellValue[], result: 'X' | 'O' | 'draw', winnerId: string | null): Promise<Game>;
}