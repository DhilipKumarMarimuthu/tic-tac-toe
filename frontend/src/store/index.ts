import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import playerReducer from './playerSlice';
import gameReducer from './gameSlice';

/** Redux store combining the player & game slices. */
export const store = configureStore({
    reducer: {
        player: playerReducer,
        game: gameReducer
    }
});

/** Inferred types of the Redux state tree. */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/** Typed wrappers */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;