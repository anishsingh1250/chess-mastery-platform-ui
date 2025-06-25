
import React, { useState } from 'react';
import { Crown, Castle } from 'lucide-react';

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

const ChessBoard: React.FC = () => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  // Initial chess position
  const initialPosition: { [key: string]: ChessPiece } = {
    'a8': { type: 'rook', color: 'black', symbol: '♜' },
    'b8': { type: 'knight', color: 'black', symbol: '♞' },
    'c8': { type: 'bishop', color: 'black', symbol: '♝' },
    'd8': { type: 'queen', color: 'black', symbol: '♛' },
    'e8': { type: 'king', color: 'black', symbol: '♚' },
    'f8': { type: 'bishop', color: 'black', symbol: '♝' },
    'g8': { type: 'knight', color: 'black', symbol: '♞' },
    'h8': { type: 'rook', color: 'black', symbol: '♜' },
    'a7': { type: 'pawn', color: 'black', symbol: '♟' },
    'b7': { type: 'pawn', color: 'black', symbol: '♟' },
    'c7': { type: 'pawn', color: 'black', symbol: '♟' },
    'd7': { type: 'pawn', color: 'black', symbol: '♟' },
    'e7': { type: 'pawn', color: 'black', symbol: '♟' },
    'f7': { type: 'pawn', color: 'black', symbol: '♟' },
    'g7': { type: 'pawn', color: 'black', symbol: '♟' },
    'h7': { type: 'pawn', color: 'black', symbol: '♟' },
    'a1': { type: 'rook', color: 'white', symbol: '♖' },
    'b1': { type: 'knight', color: 'white', symbol: '♘' },
    'c1': { type: 'bishop', color: 'white', symbol: '♗' },
    'd1': { type: 'queen', color: 'white', symbol: '♕' },
    'e1': { type: 'king', color: 'white', symbol: '♔' },
    'f1': { type: 'bishop', color: 'white', symbol: '♗' },
    'g1': { type: 'knight', color: 'white', symbol: '♘' },
    'h1': { type: 'rook', color: 'white', symbol: '♖' },
    'a2': { type: 'pawn', color: 'white', symbol: '♙' },
    'b2': { type: 'pawn', color: 'white', symbol: '♙' },
    'c2': { type: 'pawn', color: 'white', symbol: '♙' },
    'd2': { type: 'pawn', color: 'white', symbol: '♙' },
    'e2': { type: 'pawn', color: 'white', symbol: '♙' },
    'f2': { type: 'pawn', color: 'white', symbol: '♙' },
    'g2': { type: 'pawn', color: 'white', symbol: '♙' },
    'h2': { type: 'pawn', color: 'white', symbol: '♙' },
  };

  const [position, setPosition] = useState(initialPosition);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const getSquareColor = (file: string, rank: number): boolean => {
    const fileIndex = files.indexOf(file);
    return (fileIndex + rank) % 2 === 0;
  };

  const handleSquareClick = (square: string) => {
    if (selectedSquare === square) {
      setSelectedSquare(null);
    } else {
      setSelectedSquare(square);
    }
  };

  const getSquareClasses = (square: string, isLight: boolean) => {
    const baseClasses = "w-16 h-16 flex items-center justify-center text-4xl cursor-pointer transition-all duration-200 hover:brightness-110";
    const colorClasses = isLight ? "bg-amber-100" : "bg-amber-800";
    const selectedClasses = selectedSquare === square ? "ring-4 ring-blue-500" : "";
    
    return `${baseClasses} ${colorClasses} ${selectedClasses}`;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-2xl">
      <div className="grid grid-cols-8 gap-0 border-4 border-amber-900 rounded-lg overflow-hidden shadow-xl">
        {ranks.map(rank => 
          files.map(file => {
            const square = `${file}${rank}`;
            const isLight = getSquareColor(file, rank);
            const piece = position[square];
            
            return (
              <div
                key={square}
                className={getSquareClasses(square, isLight)}
                onClick={() => handleSquareClick(square)}
              >
                {piece && (
                  <span className={`select-none ${piece.color === 'white' ? 'text-white drop-shadow-lg' : 'text-black'}`}>
                    {piece.symbol}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Coordinate labels */}
      <div className="flex justify-between w-full max-w-lg mt-2">
        {files.map(file => (
          <div key={file} className="w-16 text-center text-sm font-semibold text-amber-800">
            {file}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;
