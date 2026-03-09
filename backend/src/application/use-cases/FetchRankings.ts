import { Player } from "../../domain/entities/Player";
import { IPlayerRepository } from "../../domain/ports/IPlayerRepository";

export class FetchRankings {
    constructor(private readonly playerRepo: IPlayerRepository) { }
    
    /**
     * Returns the top five players by ranking.
     *
     * @returns Ordered list of up to five players
     */
    async execute(): Promise<Player[]> {
        return await this.playerRepo.getTopPlayers(5);
    }
}