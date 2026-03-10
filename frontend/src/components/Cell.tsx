import { CellValue } from "../types/Game";

interface CellProps {
    value: CellValue;
    index: number;
    onClick: (index: number) => void;
    isClickable: boolean;
}

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