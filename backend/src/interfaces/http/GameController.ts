import { Request, Response } from "express";
import { FindMatch } from "../../application/use-cases/FindMatch";
import { MakeMove } from "../../application/use-cases/MakeMove";
import { FetchGame } from "../../application/use-cases/FetchGame";

export class GameController {
    constructor(
        private readonly findMatch: FindMatch,
        private readonly makeMove: MakeMove,
        private readonly fetchGame: FetchGame
    ) { }
    
    /**
     * Handles POST /api/matchMaking.
     * Places the player into an existing waiting game or creates a new one.
     *
     * @param req - Express request with { playerId: string } in the body
     * @param res - Express response — 200 with { game, joined }, or 400 on error
     */
    async matchMaking(req: Request, res: Response): Promise<void>{
        try {
            const { playerId } = req.body;
            const result = await this.findMatch.execute(playerId);
            res.json(result);
        } catch (err: unknown) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    /**
     * Handles POST /api/games/:id/moves.
     * Applies the player's move to the specified game.
     *
     * @param req - Express request with game id in params and { playerId, position } in body
     * @param res - Express response — 200 with the updated game, or 400 on validation error
     */
    async move(req: Request, res: Response): Promise<void>{
        try {
            const { id } = req.params as {id: string};
            const { playerId, position } = req.body;
            const game = await this.makeMove.execute(id, playerId, position);
            res.json(game);
        } catch (err: unknown) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    /**
     * Handles GET /api/games/:id.
     * Returns the current state of a game — used on page load and refresh.
     *
     * @param req - Express request with game id in params
     * @param res - Express response — 200 with the game, or 404 if not found
     */
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params as {id: string};
            const game = await this.fetchGame.execute(id);
            res.json(game);
        } catch (err: unknown) {
            res.status(404).json({ error: (err as Error).message });
        }
    }
}