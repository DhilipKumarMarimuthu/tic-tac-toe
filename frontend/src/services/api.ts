import axios from "axios";
import { Game } from "../types/Game";
import { Player } from "../types/Player";

/** Get the backend api url from .env file */
const url: string = import.meta.env.VITE_API_BASE_URL;
/** Preconfigured axios client for API requests */
const api = axios.create({ baseURL: url });

/**
 * Register a new player (or retrieve an existing one) by name.
 * @param name - The display name chosen by the player.
 * @returns The created or matched Player record.
 */
export const registerPlayer = (name: string): Promise<Player> =>
    api.post<Player>('/players', { name }).then(r => r.data);

/**
 * Fetch a player by their ID.
 * @param playerId - The UUID of the player to fetch.
 * @returns The Player record.
 */
export const getPlayer = (playerId: string): Promise<Player> =>
    api.get<Player>(`/players/${playerId}`).then(r => r.data);

/**
 * Enter the matchmaking queue for the given player.
 *
 * Returns the game that was either created (waiting for an opponent) or joined.
 * @param playerId - ID of the player entering matchmaking.
 * @returns The game and a flag indicating whether the player joined an existing game.
 */
export const findMatch = (playerId: string): Promise<{ game: Game; joined: boolean }> =>
    api.post<{ game: Game; joined: boolean }>('/matchmaking', { playerId }).then(r => r.data);

/**
 * Fetch the current state of a game by gameId.
 * @param gameId - Unique identifier of the game.
 * @returns The Game state.
 */
export const fetchGame = (gameId: string): Promise<Game> =>
    api.get<Game>(`/games/${gameId}`).then(r => r.data);

/**
 * Submit move for a player in an active game.
 * @param gameId - Unique identifier of the game.
 * @param playerId - ID of the player making the move.
 * @param position - Zero-based board index.
 * @returns The updated Game state after the move is applied.
 */
export const makeMove = (gameId: string, playerId: string, position: number): Promise<Game> =>
    api.post<Game>(`/games/${gameId}/moves`, { playerId, position }).then(r => r.data);

/**
 * Fetch the global player rankings ordered by wins.
 * @returns Player[] sorted by ranking.
 */
export const fetchRankings = (): Promise<Player[]> =>
    api.get<Player[]>('/rankings').then(r => r.data);
