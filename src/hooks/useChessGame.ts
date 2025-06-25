
import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

export interface GameState {
  chess: Chess;
  position: string;
  history: string[];
  currentMoveIndex: number;
  gameStatus: 'playing' | 'checkmate' | 'draw' | 'stalemate';
  turn: 'w' | 'b';
  isCheck: boolean;
}

export const useChessGame = (initialPgn?: string, initialFen?: string) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const chess = new Chess();
    
    if (initialFen) {
      chess.load(initialFen);
    } else if (initialPgn) {
      chess.loadPgn(initialPgn);
    }
    
    return {
      chess,
      position: chess.fen(),
      history: chess.history(),
      currentMoveIndex: chess.history().length - 1,
      gameStatus: chess.isGameOver() ? 
        (chess.isCheckmate() ? 'checkmate' : 
         chess.isStalemate() ? 'stalemate' : 'draw') : 'playing',
      turn: chess.turn(),
      isCheck: chess.inCheck()
    };
  });

  const makeMove = useCallback((from: string, to: string, promotion?: string) => {
    try {
      const newChess = new Chess(gameState.chess.fen());
      const move = newChess.move({ from, to, promotion });
      
      if (move) {
        setGameState({
          chess: newChess,
          position: newChess.fen(),
          history: newChess.history(),
          currentMoveIndex: newChess.history().length - 1,
          gameStatus: newChess.isGameOver() ? 
            (newChess.isCheckmate() ? 'checkmate' : 
             newChess.isStalemate() ? 'stalemate' : 'draw') : 'playing',
          turn: newChess.turn(),
          isCheck: newChess.inCheck()
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  }, [gameState.chess]);

  const goToMove = useCallback((moveIndex: number) => {
    const newChess = new Chess();
    const moves = gameState.history.slice(0, moveIndex + 1);
    
    for (const move of moves) {
      newChess.move(move);
    }
    
    setGameState(prev => ({
      ...prev,
      chess: newChess,
      position: newChess.fen(),
      currentMoveIndex: moveIndex,
      turn: newChess.turn(),
      isCheck: newChess.inCheck()
    }));
  }, [gameState.history]);

  const goToStart = useCallback(() => {
    goToMove(-1);
  }, [goToMove]);

  const goToEnd = useCallback(() => {
    goToMove(gameState.history.length - 1);
  }, [goToMove, gameState.history.length]);

  const goToPrevious = useCallback(() => {
    if (gameState.currentMoveIndex > -1) {
      goToMove(gameState.currentMoveIndex - 1);
    }
  }, [gameState.currentMoveIndex, goToMove]);

  const goToNext = useCallback(() => {
    if (gameState.currentMoveIndex < gameState.history.length - 1) {
      goToMove(gameState.currentMoveIndex + 1);
    }
  }, [gameState.currentMoveIndex, gameState.history.length, goToMove]);

  const loadPgn = useCallback((pgn: string) => {
    try {
      const newChess = new Chess();
      newChess.loadPgn(pgn);
      
      setGameState({
        chess: newChess,
        position: newChess.fen(),
        history: newChess.history(),
        currentMoveIndex: newChess.history().length - 1,
        gameStatus: newChess.isGameOver() ? 
          (newChess.isCheckmate() ? 'checkmate' : 
           newChess.isStalemate() ? 'stalemate' : 'draw') : 'playing',
        turn: newChess.turn(),
        isCheck: newChess.inCheck()
      });
      return true;
    } catch (error) {
      console.error('Error loading PGN:', error);
      return false;
    }
  }, []);

  const loadFen = useCallback((fen: string) => {
    try {
      const newChess = new Chess();
      newChess.load(fen);
      
      setGameState({
        chess: newChess,
        position: newChess.fen(),
        history: newChess.history(),
        currentMoveIndex: newChess.history().length - 1,
        gameStatus: newChess.isGameOver() ? 
          (newChess.isCheckmate() ? 'checkmate' : 
           newChess.isStalemate() ? 'stalemate' : 'draw') : 'playing',
        turn: newChess.turn(),
        isCheck: newChess.inCheck()
      });
      return true;
    } catch (error) {
      console.error('Error loading FEN:', error);
      return false;
    }
  }, []);

  const getPgn = useCallback(() => {
    return gameState.chess.pgn();
  }, [gameState.chess]);

  const reset = useCallback(() => {
    const newChess = new Chess();
    setGameState({
      chess: newChess,
      position: newChess.fen(),
      history: [],
      currentMoveIndex: -1,
      gameStatus: 'playing',
      turn: 'w',
      isCheck: false
    });
  }, []);

  return {
    gameState,
    makeMove,
    goToMove,
    goToStart,
    goToEnd,
    goToPrevious,
    goToNext,
    loadPgn,
    loadFen,
    getPgn,
    reset
  };
};
