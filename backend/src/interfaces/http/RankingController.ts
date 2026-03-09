import { Request, Response } from "express";
import { FetchRankings } from "../../application/use-cases/FetchRankings";

export class RankingController {
    constructor(private readonly fetchRankings: FetchRankings) { }
    
    /**
     * Handles GET /api/rankings.
     * Returns the top five players ordered by wins.
     *
     * @param _req - Express request
     * @param res - Express response — 200 with the player list, or 500 on server error
     */
    async getTopPlayers(_req: Request, res: Response): Promise<void> {
        try {
            const players = await this.fetchRankings.execute();
            res.json(players);
        } catch (err: unknown) {
            res.status(500).json({ error: (err as Error).message });
        }
    }
}