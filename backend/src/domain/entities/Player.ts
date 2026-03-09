/**
 * Represents a registered player in the system.
 * Tracks their identity and lifetime game statistics.
 */
export interface Player{
    id: string;
    name: string;
    wins: number;
    losses: number;
    draws: number;
    createdAt: Date;
}