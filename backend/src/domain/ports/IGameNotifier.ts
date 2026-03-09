import { Game } from '../entities/Game'

/**
 * Output port for pushing real-time game state changes to connected clients.
 */
export interface IGameNotifier {
    notifyGameStarted(game: Game): void;
    notifyGameUpdated(game: Game): void;
    notifyGameOver(game: Game): void;
}