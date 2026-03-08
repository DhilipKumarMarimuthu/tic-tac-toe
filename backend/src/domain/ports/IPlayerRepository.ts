import { Player } from '../entities/Player';

export interface IPlayerRepository {
    findById(id: string): Promise<Player | null>;
    findByName(name: string): Promise<Player | null>;
    create(name: string): Promise<Player>;
    updateStats(id: string, outcome: 'win' | 'loss' | 'draw'): Promise<void>;
    getTopPlayers(limit: number): Promise<Player[]>;
}