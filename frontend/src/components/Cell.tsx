import { CellValue } from "../types/Game";

/** Props for the Cell component */
interface CellProps {
    value: CellValue;
    index: number;
    onClick: (index: number) => void;
    isClickable: boolean;
}

/** Renders a single cell button on the tic-tac-toe board. */
export function Cell({ value, index, onClick, isClickable }: CellProps) {
    const classes = [
        'cell',
        value ? `cell--${value.toLowerCase()}` : '',
        isClickable ? 'cell--clickable' : ''
    ].filter(Boolean)
        .join(' ');
    
    return (
        <button className={classes} onClick={() => isClickable && onClick(index)} disabled={!isClickable}>{ value}</button>
    );
}