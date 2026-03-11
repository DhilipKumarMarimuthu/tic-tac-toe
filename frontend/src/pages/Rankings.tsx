import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '../types/Player';
import { fetchRankings } from '../services/api';

/** Rankings page that fetches and displays all players ordered by wins. */
export function Rankings() { 
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRankings()
            .then(setPlayers)
            .catch(() => setPlayers([]))
            .finally(() => setLoading(false));
        
    }, []);

    return (
        <div className='page'>
            <h1>Top Players</h1>
            {loading ? (
                <p>Loading...</p>
            ) : players.length === 0 ? (
                    <p className="empty-state">No games played yet. Be the first!</p>
                ) : (
                        <table className="rankings-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Player</th>
                                    <th>Wins</th>
                                    <th>Losses</th>
                                    <th>Draws</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map((player, index) => (
                                    <tr key={player.id}>
                                        <td>{index + 1}</td>
                                        <td>{player.name}</td>
                                        <td>{player.wins}</td>
                                        <td>{player.losses}</td>
                                        <td>{player.draws}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                )}
                <button onClick={() => navigate('/')}>Play Now</button>
        </div>
    );
}