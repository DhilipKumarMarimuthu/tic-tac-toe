import { Request, Response } from "express";
import { RegisterPlayer } from "../../application/use-cases/RegisterPlayer";

export class PlayerController {
    constructor(private readonly registerPlayer: RegisterPlayer) { }
    
    /**
     * Handles POST /api/players.
     * Registers a new player or returns the existing player with the given name.
     *
     * @param req - Express request with { name: string } in the body
     * @param res - Express response — 200 with the player, or 400 on validation error
     */
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            const player = await this.registerPlayer.execute(name);
            res.json(player);
        } catch (err: unknown) {
            res.status(400).json({ error: (err as Error).message });
        }
    }
}