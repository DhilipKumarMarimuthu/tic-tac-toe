import { IPlayerRepository } from "../../domain/ports/IPlayerRepository";
import { Player } from "../../domain/entities/Player";

export class GetPlayer {
    constructor(private readonly playerRepo: IPlayerRepository) { }
    
    /**
     * Retrieves a player by their ID.
     *
     * @param id - The player's UUID
     * @returns The player record
     */
    async execute(id: string): Promise<Player> {
        const player = await this.playerRepo.findById(id);
        if (!player) throw new Error(`Player with ID ${id} not found`);
        return player;
    }
}