import { Cell } from "./Cell";
import { CellValue } from "../types/Game";

interface BoardProps {
    board: CellValue[];
    onCellClick: (index: number) => void;
    isMyTurn: boolean;
    gameOver: boolean;
}

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