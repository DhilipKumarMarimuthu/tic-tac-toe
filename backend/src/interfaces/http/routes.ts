import { Router } from "express";
import { GameController } from "./GameController";
import { PlayerController } from "./PlayerController";
import { RankingController } from "./RankingController";

/**
 * Creates and returns the Express router with all API routes mounted.
 * Keeps route definitions in one place, separate from controller logic.
 *
 * @param gameController - Handles matchmaking, game retrieval, and moves 
 * @param playerController - Handles player registration 
 * @param rankingController - Handles the leaderboard
 * @returns Configured Express router
 */
export function createRouter(
    gameController: GameController,
    playerController: PlayerController,
    rankingController: RankingController

): Router {

    const router = Router();
    router.post('/players', (req, res) => playerController.register(req, res));
    router.get('/players/:id', (req, res) => playerController.getById(req, res));
    router.post('/matchmaking', (req, res) => gameController.matchMaking(req, res));
    router.get('/games/:id', (req, res) => gameController.getById(req, res));
    router.post('/games/:id/moves', (req, res) => gameController.move(req, res));
    router.get('/rankings', (req, res) => rankingController.getTopPlayers(req, res));
    return router;
}