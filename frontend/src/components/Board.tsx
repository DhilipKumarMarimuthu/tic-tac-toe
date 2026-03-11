import { Cell } from "./Cell";
import { CellValue } from "../types/Game";

/** Props for the Board component */
interface BoardProps {
    board: CellValue[];
    onCellClick: (index: number) => void;
    isMyTurn: boolean;
    gameOver: boolean;
}

/** Renders the 3×3 tic-tac-toe board as a grid of Cell component */
export function Board({ board, onCellClick, isMyTurn, gameOver }: BoardProps) { 
    return (
        <div className="board">
            {board.map((cell, index) => (
                <Cell
                    key={index}
                    value={cell}
                    index={index}
                    onClick={onCellClick}
                    isClickable={isMyTurn && !gameOver && cell === null}
                />
            ))}
        </div>
    );
}