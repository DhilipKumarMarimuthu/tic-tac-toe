import { Game } from "../../domain/entities/Game";
import { IGameRepository } from "../../domain/ports/IGameRepository";

export class FetchGame {
    constructor(private readonly gameRepo: IGameRepository) { }
    
    /**
     * Fetches the current state of a game.
     *
     * @param gameId - UUID of the game to retrieve
     * @returns The game record
     * @throws {Error} If no game exists with the given ID
   */
    async execute(gameId: string): Promise<Game> {
        const game = await this.gameRepo.findById(gameId);
        if (!game) throw new Error('Game not found');
        return game;
    }
}