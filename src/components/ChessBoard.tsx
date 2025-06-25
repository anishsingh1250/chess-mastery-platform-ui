
import React, { useState, useCallback } from 'react';

interface Square {
  file: string;
  rank: number;
  piece?: ChessPiece;
  isLight: boolean;
}

interface ChessPiece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: 'white' | 'black';
  symbol: string;
}

interface ChessBoardProps {
  position: string;
  onMove?: (from: string, to: string) => boolean;
  highlightSquares?: string[];
  orientation?: 'white' | 'black';
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  position, 
  onMove, 
  highlightSquares = [],
  orientation = 'white' 
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = orientation === 'white' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<{ square: string; piece: ChessPiece } | null>(null);

  // Parse FEN position
  const parsePosition = useCallback((fen: string): { [key: string]: ChessPiece } => {
    const pieces: { [key: string]: ChessPiece } = {};
    const fenParts = fen.split(' ');
    const boardState = fenParts[0];
    const ranks = boardState.split('/');
    
    // Chess pieces with improved styling
    const pieceMap: { [key: string]: { type: ChessPiece['type'], color: 'white' | 'black', symbol: string } } = {
      'K': { type: 'king', color: 'white', symbol: '♔' },
      'Q': { type: 'queen', color: 'white', symbol: '♕' },
      'R': { type: 'rook', color: 'white', symbol: '♖' },
      'B': { type: 'bishop', color: 'white', symbol: '♗' },
      'N': { type: 'knight', color: 'white', symbol: '♘' },
      'P': { type: 'pawn', color: 'white', symbol: '♙' },
      'k': { type: 'king', color: 'black', symbol: '♚' },
      'q': { type: 'queen', color: 'black', symbol: '♛' },
      'r': { type: 'rook', color: 'black', symbol: '♜' },
      'b': { type: 'bishop', color: 'black', symbol: '♝' },
      'n': { type: 'knight', color: 'black', symbol: '♞' },
      'p': { type: 'pawn', color: 'black', symbol: '♟' },
    };

    ranks.forEach((rank, rankIndex) => {
      let fileIndex = 0;
      for (const char of rank) {
        if (isNaN(parseInt(char))) {
          const piece = pieceMap[char];
          if (piece) {
            const square = `${files[fileIndex]}${8 - rankIndex}`;
            pieces[square] = piece;
          }
          fileIndex++;
        } else {
          fileIndex += parseInt(char);
        }
      }
    });

    return pieces;
  }, []);

  const pieces = parsePosition(position);

  const getSquareColor = (file: string, rank: number): boolean => {
    const fileIndex = files.indexOf(file);
    return (fileIndex + rank) % 2 === 0;
  };

  const handleSquareClick = (square: string) => {
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
      } else {
        const success = onMove?.(selectedSquare, square);
        setSelectedSquare(null);
      }
    } else if (pieces[square]) {
      setSelectedSquare(square);
    }
  };

  const handleDragStart = (square: string, piece: ChessPiece) => {
    setDraggedPiece({ square, piece });
    setSelectedSquare(square);
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
    setSelectedSquare(null);
  };

  const handleDrop = (targetSquare: string) => {
    if (draggedPiece) {
      onMove?.(draggedPiece.square, targetSquare);
    }
    handleDragEnd();
  };

  const getSquareClasses = (square: string, isLight: boolean) => {
    const baseClasses = "aspect-square flex items-center justify-center text-2xl md:text-3xl lg:text-4xl cursor-pointer transition-all duration-200 hover:brightness-110 relative border border-gray-300 select-none";
    const colorClasses = isLight ? "bg-amber-100" : "bg-amber-700";
    const selectedClasses = selectedSquare === square ? "ring-2 ring-blue-500 ring-inset" : "";
    const highlightClasses = highlightSquares.includes(square) ? "ring-2 ring-green-500 ring-inset" : "";
    
    return `${baseClasses} ${colorClasses} ${selectedClasses} ${highlightClasses}`;
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-2xl max-w-fit mx-auto">
      {/* File labels on top */}
      <div className="flex items-center mb-2">
        <div className="w-6 md:w-8"></div>
        <div className="grid grid-cols-8 gap-0 w-80 md:w-96 lg:w-[480px]">
          {files.map(file => (
            <div key={file} className="text-center text-xs md:text-sm font-semibold text-slate-700 py-1">
              {file}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex">
        {/* Rank labels on the left */}
        <div className="flex flex-col justify-center mr-2">
          {ranks.map(rank => (
            <div key={rank} className="aspect-square flex items-center text-xs md:text-sm font-semibold text-slate-700 w-6 md:w-8 justify-center">
              {rank}
            </div>
          ))}
        </div>
        
        {/* Chess board grid */}
        <div className="grid grid-cols-8 gap-0 border-4 border-slate-800 rounded-lg overflow-hidden shadow-xl w-80 md:w-96 lg:w-[480px]">
          {ranks.map(rank => 
            files.map(file => {
              const square = `${file}${rank}`;
              const isLight = getSquareColor(file, rank);
              const piece = pieces[square];
              
              return (
                <div
                  key={square}
                  className={getSquareClasses(square, isLight)}
                  onClick={() => handleSquareClick(square)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(square)}
                >
                  {piece && (
                    <span 
                      className={`select-none font-bold ${
                        piece.color === 'white' 
                          ? 'text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]' 
                          : 'text-black drop-shadow-[2px_2px_4px_rgba(255,255,255,0.8)]'
                      } hover:scale-110 transition-transform cursor-grab active:cursor-grabbing`}
                      draggable
                      onDragStart={() => handleDragStart(square, piece)}
                      onDragEnd={handleDragEnd}
                    >
                      {piece.symbol}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
