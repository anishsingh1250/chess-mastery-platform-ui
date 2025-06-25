
import { useState, useCallback, useEffect } from 'react';
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
    
    // Try to load initial position
    try {
      if (initialFen && initialFen !== 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
        chess.load(initialFen);
      } else if (initialPgn) {
        chess.loadPgn(initialPgn);
      }
    } catch (error) {
      console.warn('Failed to load initial position:', error);
      // Fall back to starting position
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

  const updateGameState = useCallback((newChess: Chess) => {
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
  }, []);

  const makeMove = useCallback((from: string, to: string, promotion?: string) => {
    try {
      const newChess = new Chess(gameState.chess.fen());
      const move = newChess.move({ from, to, promotion });
      
      if (move) {
        updateGameState(newChess);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  }, [gameState.chess, updateGameState]);

  const goToMove = useCallback((moveIndex: number) => {
    const newChess = new Chess();
    
    if (moveIndex >= 0 && moveIndex < gameState.history.length) {
      const moves = gameState.history.slice(0, moveIndex + 1);
      
      try {
        for (const move of moves) {
          newChess.move(move);
        }
        
        setGameState(prev => ({
          ...prev,
          chess: newChess,
          position: newChess.fen(),
          currentMoveIndex: moveIndex,
          turn: newChess.turn(),
          isCheck: newChess.inCheck(),
          gameStatus: newChess.isGameOver() ? 
            (newChess.isCheckmate() ? 'checkmate' : 
             newChess.isStalemate() ? 'stalemate' : 'draw') : 'playing'
        }));
      } catch (error) {
        console.error('Error navigating to move:', error);
      }
    } else if (moveIndex === -1) {
      // Go to starting position
      setGameState(prev => ({
        ...prev,
        chess: newChess,
        position: newChess.fen(),
        currentMoveIndex: -1,
        turn: newChess.turn(),
        isCheck: newChess.inCheck(),
        gameStatus: 'playing'
      }));
    }
  }, [gameState.history]);

  const goToStart = useCallback(() => {
    goToMove(-1);
  }, [goToMove]);

  const goToEnd = useCallback(() => {
    if (gameState.history.length > 0) {
      goToMove(gameState.history.length - 1);
    }
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
      const success = newChess.loadPgn(pgn);
      
      if (success) {
        updateGameState(newChess);
        return true;
      } else {
        console.error('Failed to load PGN');
        return false;
      }
    } catch (error) {
      console.error('Error loading PGN:', error);
      return false;
    }
  }, [updateGameState]);

  const loadFen = useCallback((fen: string) => {
    try {
      const newChess = new Chess();
      const success = newChess.load(fen);
      
      if (success) {
        updateGameState(newChess);
        return true;
      } else {
        console.error('Failed to load FEN');
        return false;
      }
    } catch (error) {
      console.error('Error loading FEN:', error);
      return false;
    }
  }, [updateGameState]);

  const getPgn = useCallback(() => {
    try {
      return gameState.chess.pgn();
    } catch (error) {
      console.error('Error getting PGN:', error);
      return '';
    }
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

  // Update game state when initial props change
  useEffect(() => {
    if (initialPgn || initialFen) {
      const newChess = new Chess();
      
      try {
        if (initialFen && initialFen !== 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
          newChess.load(initialFen);
        } else if (initialPgn) {
          newChess.loadPgn(initialPgn);
        }
        
        updateGameState(newChess);
      } catch (error) {
        console.warn('Failed to load updated position:', error);
      }
    }
  }, [initialPgn, initialFen, updateGameState]);

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
