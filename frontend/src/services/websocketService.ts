import { WsMessage } from "../types/Game";

/** Callback invoked whenever a WebSocket message is received. */
type MessageHandler = (message: WsMessage) => void;

/**
 * Singleton service that manages the WebSocket connection to the game server.
 */
class WebSocketService { 
    private ws: WebSocket | null = null;
    private handlers: MessageHandler[] = [];

    /**
     * Open a WebSocket connection and subscribe to updates for the given game.
     *
     * If a connection already exists it is closed before opening a new one.
     * @param gameId - ID of the game to subscribe to.
     * @param playerId - ID of the local player which is sent in the subscribe message.
     */
    connect(gameId: string, playerId: string): void {
        if (this.ws) {
            this.ws.close();
        }
        this.ws = new WebSocket(import.meta.env.VITE_WS_URL);
        
        this.ws.onopen = () => {
            this.ws!.send(JSON.stringify({ type: 'subscribe', gameId, playerId }));
        };

        this.ws.onmessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data as string) as WsMessage;
                this.handlers.forEach(h => h(message));
            } catch(error) {
                console.warn("Failed to parse incoming WebSocket message:", event.data);
            }
        };
        this.ws.onclose = () => {
            this.ws = null;
        };
    }

    /**
     * Register a handler to be called for every incoming WebSocket message.
     * @param handler - Function to invoke with each parsed WsMessage.
     * @returns An unsubscribe function that removes this handler when called.
     */
    onMessage(handler: MessageHandler): () => void {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter(h => h !== handler);
        };
    }

    /** Close the WebSocket connection and remove all registered message handlers. */
    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.handlers = [];
    }
}

export const wsService = new WebSocketService();