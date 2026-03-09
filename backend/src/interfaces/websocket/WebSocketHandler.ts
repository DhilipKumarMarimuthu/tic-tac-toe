import { WebSocketServer, WebSocket } from "ws";
import { IGameNotifier } from "../../domain/ports/IGameNotifier";
import { FetchGame } from "../../application/use-cases/FetchGame";
import { Game } from "../../domain/entities/Game";

/**
 * Message sent by the client to subscribe to real-time updates for a game.
 */
interface SubscribeMessage {
    type: 'subscribe';
    gameId: string;
    playerId: string;
}

export class WebSocketHandler implements IGameNotifier {
    private readonly subscriptions = new Map<string, Set<WebSocket>>();
    constructor(private readonly fetchGame: FetchGame) { }
    
    /**
     * Attaches connection and message event listeners to the WebSocket server.
     * Must be called once during application startup.
     *
     * @param wss - The WebSocket server instance to initialise
     */
    initialize(wss: WebSocketServer): void {
        wss.on('connection', (ws: WebSocket) => {
            ws.on('message', async (data) => {
                try {
                    const message = JSON.parse(data.toString()) as SubscribeMessage;
                    if (message.type === 'subscribe') {
                        await this.handleSubscribe(ws, message);
                    }
                } catch {
                    ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
                }
            });
            ws.on('close', () => {
                this.removeClient(ws);
            });
        });
    }

    /**
     * Broadcasts a game_start event to all subscribers of the game.
     * Called when the second player joins via matchmaking.
     *
     * @param game - The game that has just become active
     */
    notifyGameStarted(game: Game): void { 
        this.broadcast(game.id, { type: 'game_start', game });
    }
    /**
     * Broadcasts a game_update event to all subscribers of the game.
     * Called after each valid move while the game is still in progress.
     *
     * @param game - The updated game after the move
     */
    notifyGameUpdated(game: Game): void { 
        this.broadcast(game.id, { type: 'game_update', game });
    }
    /**
     * Broadcasts a game_over event to all subscribers of the game.
     * Called when the game ends by win or draw.
     *
     * @param game - The finished game with result and winnerId populated
     */
    notifyGameOver(game: Game): void {
        this.broadcast(game.id, { type: 'game_over', game });
    }

    /**
     * Adds the client to the game's subscription room and immediately sends
     * the current game state so the client can render without waiting for
     * the next broadcast.
     *
     * @param ws - The WebSocket connection to subscribe
     * @param message - The parsed subscribe message from the client
     */
    private async handleSubscribe(ws: WebSocket, message: SubscribeMessage): Promise<void> { 
        const { gameId } = message;
        if (!this.subscriptions.has(gameId)) {
            this.subscriptions.set(gameId, new Set());
        }
        this.subscriptions.get(gameId)!.add(ws);
        try {
            const game = await this.fetchGame.execute(gameId);
            // Map game status to the appropriate event type so the client
            // receives the correct event regardless of when it connects.
            const typeMap = { waiting: 'waiting', active: 'game_start', finished: 'game_over' } as const;
            ws.send(JSON.stringify({ type: typeMap[game.status], game }));
        } catch {
            ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
        }
    }

    /**
     * Removes a disconnected client from all subscription rooms it belonged to.
     * Cleans up empty rooms to prevent memory leaks.
     *
     * @param ws - The WebSocket connection that closed
     */
    private removeClient(ws: WebSocket): void {
        for (const [gameId, clients] of this.subscriptions) { 
            clients.delete(ws);
            if (clients.size === 0) { 
                this.subscriptions.delete(gameId);
            }
        }
    }

    /**
     * Sends a JSON-serialised message to all open WebSocket connections
     * subscribed to the given game.
     *
     * @param gameId - UUID of the game whose subscribers should be notified
     * @param message - The payload to send
     */
    private broadcast(gameId: string, message: object): void {
        const clients = this.subscriptions.get(gameId);
        if (!clients) return;
        const payload = JSON.stringify(message);
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        }
    }
}