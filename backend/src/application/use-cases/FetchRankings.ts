import { Player } from "../../domain/entities/Player";
import { IPlayerRepository } from "../../domain/ports/IPlayerRepository";

export class FetchRankings {
    constructor(private readonly playerRepo: IPlayerRepository) { }
    async execute(): Promise<Player[]> {
        return await this.playerRepo.getTopPlayers(5);
    }
}