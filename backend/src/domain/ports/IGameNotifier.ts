import { Game } from '../entities/Game'

export interface IGameNotifier {
    notifyGameStarted(game: Game): void;
    notifyGameUpdated(game: Game): void;
    notifyGameOver(game: Game): void;
}