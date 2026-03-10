import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { setPlayer } from '../store/playerSlice';
import { resetGame, setError } from '../store/gameSlice';
import { registerPlayer, findMatch } from '../services/api';

export function Home() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const existingPlayer = useAppSelector(state => state.player.player);

    const [name, setName] = useState(existingPlayer?.name ?? '');
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleFindMatch = async () => {
        const playerName = name.trim();
        if (!playerName) {
            setLocalError('Please enter your name');
            return;
        }
        setLoading(true);
        setLocalError(null);
        dispatch(resetGame());

        try {
            const player = await registerPlayer(playerName);
            dispatch(setPlayer(player));
            const { game } = await findMatch(player.id);
            navigate(`/game/${game.id}`);

        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
                'Failed to find a match. Please try again.';
            setLocalError(message);
            dispatch(setError(message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <h1>Tic-Tac-Toe</h1>
            <div className="card">
                <h2>Find a Match</h2>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleFindMatch()}
                    maxLength={50}
                    disabled={loading}
                />
                {localError && <p className="error">{localError}</p>}
                <button onClick={handleFindMatch} disabled={loading || !name.trim()}>
                    {loading ? 'Finding match...' : 'Find Match'}
                </button>
                <a href="/rankings" className="link">View Rankings</a>
            </div>
        </div>
    );
}