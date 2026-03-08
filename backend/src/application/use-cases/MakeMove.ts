import { IGameRepository } from "../../domain/ports/IGameRepository";
import { IPlayerRepository } from "../../domain/ports/IPlayerRepository";
import { IGameNotifier } from "../../domain/ports/IGameNotifier";
import { Game, checkWinner } from "../../domain/entities/Game";

export class MakeMove {
    constructor(
        private readonly gameRepo: IGameRepository,
        private readonly notifier: IGameNotifier,
        private readonly playerRepo: IPlayerRepository
    ) { }
    
    async execute(gameId: string, playerId: string, position: number): Promise<Game> {
        const game = await this.gameRepo.findById(gameId);
        if (!game) throw new Error('Game not found.')
        if (game.status !== 'active') throw new Error('Game is not active')
        if (position < 0 || position > 8) throw new Error('Invalid position');

        const playerSymbol =
            game.playerXId === playerId ? 'X' :
            game.playerOId === playerId ? 'O' : null;
        
        if (!playerSymbol) throw new Error('Player not in this game');
        if (game.currentTurn !== playerSymbol) throw new Error('Not your turn');
        if (game.board[position] !== null) throw new Error('Cell already occupied');

        const newBoard = [...game.board] as typeof game.board;
        newBoard[position] = playerSymbol;
        
        const result = checkWinner(newBoard);

        if (result) {
            const winnerId = 
                result === 'X' ? game.playerXId :
                result === 'O' ? game.playerOId! :
                null;
            
            const finished = await this.gameRepo.finishGame(gameId, newBoard, result, winnerId);
            if (result === 'draw') {
                await Promise.all([
                this.playerRepo.updateStats(game.playerXId, 'draw'),
                this.playerRepo.updateStats(game.playerOId!, 'draw'),
                ]);
            } else {
                const loserId = result === 'X' ? game.playerOId! : game.playerXId;
                await Promise.all([
                this.playerRepo.updateStats(winnerId!, 'win'),
                this.playerRepo.updateStats(loserId, 'loss'),
                ]);
            }

            this.notifier.notifyGameOver(finished);
            return finished;
        }
        const nextTurn = playerSymbol === 'X' ? 'O' : 'X';
        const updated = await this.gameRepo.applyMove(gameId, newBoard, nextTurn);
        this.notifier.notifyGameUpdated(updated);
        return updated;
    }
}
