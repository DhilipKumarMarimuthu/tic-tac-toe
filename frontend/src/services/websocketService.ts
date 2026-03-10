import { WsMessage } from "../types/Game";

type MessageHandler = (message: WsMessage) => void;

class WebSocketService { 
    private ws: WebSocket | null = null;
    private handlers: MessageHandler[] = [];

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
            } catch {
                // Ignore malformed messages
            }
        };
        this.ws.onclose = () => {
            this.ws = null;
        };
    }

    onMessage(handler: MessageHandler): () => void {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter(h => h !== handler);
        };
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.handlers = [];
    }
}

export const wsService = new WebSocketService();