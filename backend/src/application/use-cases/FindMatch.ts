import { Game } from "../../domain/entities/Game";
import { IGameRepository } from "../../domain/ports/IGameRepository";
import { IGameNotifier } from "../../domain/ports/IGameNotifier";

export interface FindMatchResult{
    game: Game;
    joined: boolean;
}

export class FindMatch{
    constructor(
        private readonly gameRepo: IGameRepository,
        private readonly notifier: IGameNotifier
    ) { }
    
    /**
     * Finds an available game for the player or creates a new waiting game.
     *
     * @param playerId - UUID of the player requesting a match
     * @returns The game the player has been placed into and whether they joined or created it
     */
    async execute(playerId: string): Promise<FindMatchResult> {
        const existingGame = await this.gameRepo.findAndJoinGame(playerId);
        if (existingGame) {
            // Notify Player X (already waiting) that their opponent has arrived.
            this.notifier.notifyGameStarted(existingGame);
            return { game: existingGame, joined: true };
        }
        const game = await this.gameRepo.create(playerId);
        return { game, joined: false };
    }
}