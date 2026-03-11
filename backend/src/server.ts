import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';

import { connectionPool } from './infrastructure/db/ConnectionPool';
import { GameRepository } from './infrastructure/db/GameRepository';
import { PlayerRepository } from './infrastructure/db/PlayerRepository';
import { RegisterPlayer } from './application/use-cases/RegisterPlayer';
import { GetPlayer } from './application/use-cases/GetPlayer';
import { FindMatch } from './application/use-cases/FindMatch';
import { MakeMove } from './application/use-cases/MakeMove';
import { FetchGame } from './application/use-cases/FetchGame';
import { FetchRankings } from './application/use-cases/FetchRankings';
import { GameController } from './interfaces/http/GameController';
import { PlayerController } from './interfaces/http/PlayerController';
import { RankingController } from './interfaces/http/RankingController';
import { WebSocketHandler } from './interfaces/websocket/WebSocketHandler';
import { createRouter } from './interfaces/http/routes';

const PORT = process.env.PORT || 3001;

//Repositories
const gameRepo = new GameRepository(connectionPool);
const playerRepo = new PlayerRepository(connectionPool);

// WebSocket handler — implements IGameNotifier, so use cases can notify
// clients without knowing anything about WebSockets.
const wsHandler = new WebSocketHandler(new FetchGame(gameRepo));

// Use cases — notifier is injected as the IGameNotifier port
const registerPlayer = new RegisterPlayer(playerRepo);
const getPlayer = new GetPlayer(playerRepo);
const getGame = new FetchGame(gameRepo);
const findMatch = new FindMatch(gameRepo, wsHandler);
const makeMove = new MakeMove(gameRepo, wsHandler, playerRepo);
const getRankings = new FetchRankings(playerRepo);

// Controllers — no WebSocket knowledge here
const playerController = new PlayerController(registerPlayer, getPlayer);
const gameController = new GameController(findMatch, makeMove, getGame);
const rankingController = new RankingController(getRankings);

// Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', createRouter(gameController, playerController, rankingController));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wsHandler.initialize(wss);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});