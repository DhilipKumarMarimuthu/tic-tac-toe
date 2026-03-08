import { Player } from "../../domain/entities/Player";
import { IPlayerRepository } from "../../domain/ports/IPlayerRepository";

export class RegisterPlayer {
    constructor(private readonly playerRepo: IPlayerRepository) { }
    
    async execute(name: string): Promise<Player>{
        const playerName = name.trim();
        if (!playerName) throw new Error('Name is required');
        const existingPlayer = await this.playerRepo.findById(playerName);
        if (existingPlayer) return existingPlayer;
        return await this.playerRepo.create(playerName);
    }
}