import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Game, GameStatus } from '../types/Game';

interface GameState {
    game: Game | null;
    symbol: 'X' | 'O' | null;
    status: 'idle' | GameStatus;
    error: string | null;
}

const initialState: GameState = {
    game: null,
    symbol: null,
    status: 'idle',
    error: null
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGame(state, action: PayloadAction<{ game: Game, symbol: 'X' | 'O' }>) {
            state.game = action.payload.game;
            state.symbol = action.payload.symbol;
            state.status = action.payload.game.status;
            state.error = null;
        },
        updateGame(state, action: PayloadAction<Game>) {
            state.game = action.payload;
            state.status = action.payload.status;
        },
        setError(state, action: PayloadAction<string>) { 
            state.error = action.payload;
            state.status = 'idle';
        },
        resetGame(state) {
            state.game = null;
            state.symbol = null;
            state.status = 'idle';
            state.error = null;
        }
    }
});

export const { setGame, updateGame, setError, resetGame } = gameSlice.actions;
export default gameSlice.reducer;