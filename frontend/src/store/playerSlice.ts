import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../types/Player";

/** Shape of the player slice state. */
interface PlayerState {
    player: Player | null;
}

/** Initialize player slice state. */
const initialState: PlayerState = {
    player: JSON.parse(localStorage.getItem('player') ?? 'null')
}

/** Redux slice managing the authenticated player. */
const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setPlayer(state, action: PayloadAction<Player>) { 
            state.player = action.payload;
            localStorage.setItem('player', JSON.stringify(action.payload));
        },
        clearPlayer(state) { 
            state.player = null;
            localStorage.removeItem('player');
        }
    }
});

export const { setPlayer, clearPlayer } = playerSlice.actions;
export default playerSlice.reducer;