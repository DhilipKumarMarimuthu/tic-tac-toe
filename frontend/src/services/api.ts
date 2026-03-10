import axios from "axios";
import { Game } from "../types/Game";
import { Player } from "../types/Player";

const url: string = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL: url });

export const registerPlayer = (name: string): Promise<Player> =>
    api.post<Player>('/players', { name }).then(r => r.data);

export const findMatch = (playerId: string): Promise<{ game: Game; joined: boolean }> =>
    api.post<{ game: Game; joined: boolean }>('/matchmaking', { playerId }).then(r => r.data);

export const fetchGame = (gameId: string): Promise<Game> =>
    api.get<Game>(`/games/${gameId}`).then(r => r.data);

export const makeMove = (gameId: string, playerId: string, position: number): Promise<Game> =>
    api.post<Game>(`/games/${gameId}/moves`, { playerId, position }).then(r => r.data);

export const fetchRankings = (): Promise<Player[]> =>
    api.get<Player[]>('/rankings').then(r => r.data);
