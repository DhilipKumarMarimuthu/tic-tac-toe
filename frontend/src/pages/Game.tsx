import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { setGame, updateGame, resetGame } from "../store/gameSlice";
import { Board } from "../components/Board";
import { fetchGame, makeMove } from "../services/api";
import { wsService } from "../services/websocketService";
import { WsMessage } from "../types/Game";

export function Game() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const player = useAppSelector(state => state.player.player);
    const { game, symbol } = useAppSelector(state => state.game);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!player || !id) { 
            navigate('/');
            return;
        }
        let cancelled = false;
        // Always fetch from the server — this is the single source of truth.
        // Handles page reloads, direct URL navigation, and cross-device access
        // without relying on in-memory Redux state surviving a refresh.
        fetchGame(id)
            .then(fetchedGame => {
                if (cancelled) return;
                const symbol =
                    fetchedGame.playerXId === player.id ? 'X' :
                    fetchedGame.playerOId === player.id ? 'O' : null;

                if (!symbol) {
                    navigate('/');
                    return;
                }
                dispatch(setGame({ game: fetchedGame, symbol: symbol }));
                wsService.connect(fetchedGame.id, player.id);
            })
            .catch(() => { if (!cancelled) navigate('/'); })
            .finally(() => { if (!cancelled) setLoading(false); });    

        const unsubscribe = wsService.onMessage((message: WsMessage) => {
            if (
                message.type === 'waiting' ||
                message.type === 'game_start' ||
                message.type === 'game_update' ||
                message.type === 'game_over'
            ) {
                dispatch(updateGame(message.game));
            }
        });

        return () => {
            cancelled = true;
            unsubscribe();
        };
        
    }, [id, player?.id]);

    const handleCellClick = useCallback(
        async (position: number) => {
            if (!game || !player) return;
            try {
                await makeMove(game.id, player.id, position);
            } catch (err: unknown) {
                console.error(
                    'Move failed:',
                    (err as { response?: { data?: { error?: string } } })?.response?.data?.error,
                );
            }
        },
        [game, player],
    );

    const handlePlayAgain = () => {
        wsService.disconnect();
        dispatch(resetGame());
        navigate('/');
    };

    const handleViewRankings = () => {
        wsService.disconnect();
        dispatch(resetGame());
        navigate('/rankings');
    };

    if (loading || !game || !player) {
        return <div className="page"><p>Loading...</p></div>;
    }

    const isMyTurn = game.status === 'active' && game.currentTurn === symbol;
    const opponentSymbol = symbol === 'X' ? 'O' : 'X';

    const statusMessage = (): string => {
        if (game.status === 'waiting') return 'Waiting for an opponent to join...';
        if (game.status === 'finished') {
            if (game.result === 'draw') return "It's a draw!";
            return game.winnerId === player.id ? 'You win!' : 'You lose!';
        }
        return isMyTurn ? `Your turn (${symbol})` : `Opponent's turn (${game.currentTurn})`;
    };

    return (
        <div className="page">
            <h1>Tic-Tac-Toe</h1>
            <div className="game-info">
                <span>You: <strong>{symbol}</strong></span>
                <span>Opponent: <strong>{opponentSymbol}</strong></span>
            </div>
            <p className="status-message">{statusMessage()}</p>

            {game.status !== 'waiting' && (
                <Board
                    board={game.board}
                    onCellClick={handleCellClick}
                    isMyTurn={isMyTurn}
                    gameOver={game.status === 'finished'}
                />
            )}

            {game.status === 'finished' && (
                <div className="game-over-actions">
                <button onClick={handlePlayAgain}>Play Again</button>
                <button className="secondary" onClick={handleViewRankings}>
                    View Rankings
                </button>
                </div>
            )}
        </div>
    );
}