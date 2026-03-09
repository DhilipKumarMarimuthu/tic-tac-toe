import { IGameRepository } from "../../domain/ports/IGameRepository";
import { Game, CellValue, GameResult, GameStatus } from "../../domain/entities/Game";
import { Pool } from "pg";
import { v4 as uuidv4 } from 'uuid'

const EMPTY_BOARD = JSON.stringify([null, null, null, null, null, null, null, null, null]);

export class GameRepository implements IGameRepository {
    constructor(private readonly pool: Pool) { }
    
    /**
     * Finds a game by its unique ID.
     * @param id - The game's UUID
     * @returns The matching game or null if it's not found
     */
    async findById(id: string): Promise<Game | null> {
        const { rows } = await this.pool.query('SELECT * FROM games WHERE id = $1', [id]);
        return rows[0] ? mapToGame(rows[0]) : null;
    }

    /**
     * Inserts a new game in the waiting state with playerX and an empty board.
     * @param playerXId - UUID of the playerX
     * @returns The newly created game record
     */
    async create(playerXId: string): Promise<Game> {
        const { rows } = await this.pool.query(
            `INSERT INTO games (id, player_x_id, board, current_turn, status)
             VALUES ($1, $2, $3::jsonb, 'X', 'waiting') RETURNING *`,
            [uuidv4(), playerXId, EMPTY_BOARD],
        );
        return mapToGame(rows[0])
    }

    /**
     * Atomically finds a waiting game and joins it within a single transaction.
     * Uses `SELECT FOR UPDATE SKIP LOCKED` so concurrent matchmaking requests
     * cannot both claim the same waiting game.
     * 
     * @param playerId - UUID of the playerO
     * @returns The updated game with playerO or null if none available
     */
    async findAndJoinGame(playerId: string): Promise<Game | null> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const { rows } = await client.query(
                `SELECT * FROM games
                WHERE status = 'waiting' AND player_x_id != $1
                LIMIT 1 FOR UPDATE SKIP LOCKED`,
                [playerId],
            );
            if (rows.length === 0) {
                await client.query('COMMIT');
                return null;
            }

            const { rows: updated } = await client.query(
                `UPDATE games
                SET player_o_id = $1, status = 'active', updated_at = NOW()
                WHERE id = $2 RETURNING *`,
                [playerId, rows[0].id],
            );

            await client.query('COMMIT');
            return mapToGame(updated[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * 
     * @param gameId - UUID of the game to update
     * @param board - The new board state after the move
     * @param currentTurn - The current turn with symbol
     * @returns The updated game record
     */
    async applyMove(gameId: string, board: CellValue[], currentTurn: "X" | "O"): Promise<Game> {
        const { rows } = await this.pool.query(            
            `UPDATE games SET board = $1::jsonb, current_turn = $2, updated_at = NOW()
            WHERE id = $3 RETURNING *`,
            [JSON.stringify(board), currentTurn, gameId],
        );
        return mapToGame(rows[0]);
    }

    /**
     * 
     * @param gameId - UUID of the game to finish
     * @param board - The final board state
     * @param result - The result: `'X'`, `'O'`, or `'draw'`
     * @param winnerId - UUID of the winning player, or `null` for a draw
     * @returns The updated game record
     */
    async finishGame(gameId: string, board: CellValue[], result: "X" | "O" | "draw", winnerId: string | null): Promise<Game> {
        const { rows } = await this.pool.query(
            `UPDATE games
            SET board = $1::jsonb, status = 'finished', result = $2, winner_id = $3, updated_at = NOW()
            WHERE id = $4 RETURNING *`,
            [JSON.stringify(board), result, winnerId, gameId],
        );
        return mapToGame(rows[0]);
    }
}

/**
 * Maps a raw database row(snake_case) to a Game domain entity(camelCase).
 * @param row - Raw row object returned by the database
 * @returns Game entity
 */
function mapToGame(row: Record<string, unknown>): Game {
    return {
        id: row.id as string,
        playerXId: row.player_x_id as string,
        playerOId: row.player_o_id as string | null,
        board: row.board as CellValue[],
        currentTurn: row.current_turn as 'X' | 'O',
        status: row.status as GameStatus,
        result: row.result as GameResult,
        winnerId: row.winner_id as string | null,
        createdAt: row.create_at as Date,
        updatedAt: row.updated_at as Date
        
    }
}