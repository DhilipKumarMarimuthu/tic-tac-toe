import { Player } from "../../domain/entities/Player";
import { IPlayerRepository } from "../../domain/ports/IPlayerRepository";

export class RegisterPlayer {
    constructor(private readonly playerRepo: IPlayerRepository) { }
    
    /**
     * Registers a new player or retrieves the existing player with the given name.
     *
     * @param name - The display name
     * @returns The existing or newly created player record
     * @throws {Error} If the name is empty after trimming
     */
    async execute(name: string): Promise<Player>{
        const playerName = name.trim();
        if (!playerName) throw new Error('Name is required');
        const existingPlayer = await this.playerRepo.findById(playerName);
        if (existingPlayer) return existingPlayer;
        return await this.playerRepo.create(playerName);
    }
}