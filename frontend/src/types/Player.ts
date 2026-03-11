/** A registered player with their win/loss/draw record. */
export interface Player { 
    id: string;
    name: string;
    wins: number;
    losses: number;
    draws: number;
    createdAt: string;
}