import { Player } from "../../domain/entities/Player";
import { IPlayerRepository } from "../../domain/ports/IPlayerRepository";
import { Pool } from "pg";
import { v4 as uuidv4 } from 'uuid';


export class PlayerRepository implements IPlayerRepository {
    constructor(private readonly pool: Pool) { }

    /**
     * Finds a player by their unique ID.
     * 
     * @param id - The player's UUID
     * @returns The matching player or null if it's not found
     */
    async findById(id: string): Promise<Player | null> {
        const { rows } = await this.pool.query('SELECT * FROM players WHERE id = $1', [id]);
        return rows[0] ? mapToPlayer(rows[0]) : null;
    }
    /**
     * Finds a player by their display name.
     * @param name - The exact display name to search for
     * @returns The matching player or null if it's not found
     */
    async findByName(name: string): Promise<Player | null> {
        const { rows } = await this.pool.query('SELECT * FROM players WHERE name = $1', [name]);
        return rows[0] ? mapToPlayer(rows[0]) : null;        
    }
    /**
     * Inserts a new player row with a generated UUID and zero stats.
     * @param name - The display name for the new player
     * @returns The newly created player record
     */
    async create(name: string): Promise<Player> {
        const { rows } = await this.pool.query(
            'INSERT INTO players (id, name) VALUES ($1, $2) RETURNING *',
            [uuidv4(), name],
        )
        return mapToPlayer(rows[0]);
    }
    /**
     * Atomically increments the wins, losses, or draws column by one.
     * @param id - UUID of the player to update
     * @param outcome The result from this player's perspective
     */
    async updateStats(id: string, outcome: "win" | "loss" | "draw"): Promise<void> {
        const column = outcome === 'win' ? 'wins' : outcome === 'loss' ? 'losses' : 'draws';
        await this.pool.query(
            `UPDATE players SET ${column} = ${column} + 1 WHERE id = $1`, [id]
        );        
    }
    /**
     * Returns players ordered by wins DESC, draws DESC, losses ASC.
     * @param limit - Maximum number of rows to return
     * @returns Ordered list of top players
     */
    async getTopPlayers(limit: number): Promise<Player[]> {
        const { rows } = await this.pool.query(
            'SELECT * FROM players ORDER BY wins DESC, draws DESC, losses ASC LIMIT $1', [limit]
        );
        return rows.map(mapToPlayer);
    }
}

/**
 * Maps a raw database row(snake_case) to a Player domain entity(camelCase).
 * @param row - Raw row object returned by the database
 * @returns Player entity
 */
function mapToPlayer(row: Record<string, unknown>): Player {
    return {
        id: row.id as string,
        name: row.name as string,
        wins: row.wins as number,
        losses: row.losses as number,
        draws: row.draws as number,
        createdAt: row.created_at as Date        
    }
}