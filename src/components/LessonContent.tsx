
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GameControls from './GameControls';
import PgnImportDialog from './PgnImportDialog';
import { useChessGame } from '@/hooks/useChessGame';
import { type Lesson } from '@/hooks/useSupabaseData';

interface LessonContentProps {
  lesson: Lesson | null;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [showPgnDialog, setShowPgnDialog] = useState(false);
  
  const {
    gameState,
    goToStart,
    goToPrevious,
    goToNext,
    goToEnd,
    loadPgn,
    getPgn
  } = useChessGame(lesson?.pgn, lesson?.fen);

  const handlePlay = () => {
    if (!isPlaying && gameState.currentMoveIndex < gameState.history.length - 1) {
      setIsPlaying(true);
      const interval = setInterval(() => {
        goToNext();
      }, 1000);
      setAutoPlayInterval(interval);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
  };

  // Stop autoplay when reaching the end
  React.useEffect(() => {
    if (isPlaying && gameState.currentMoveIndex >= gameState.history.length - 1) {
      handlePause();
    }
  }, [gameState.currentMoveIndex, gameState.history.length, isPlaying]);

  const handleLoadPgn = () => {
    setShowPgnDialog(true);
  };

  const handlePgnImport = (pgn: string) => {
    const success = loadPgn(pgn);
    if (!success) {
      alert('Invalid PGN format');
    }
  };

  const handleExportPgn = () => {
    const pgn = getPgn();
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson?.title || 'chess-game'}.pgn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Select a lesson to begin
          </h3>
          <p className="text-gray-500">
            Choose a lesson from the sidebar to start learning chess
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
            ← Back
          </Button>
          <span className="text-lg font-semibold text-gray-700">
            {lesson.title}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800">{lesson.title}</h2>
            <Badge variant="secondary">★</Badge>
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            {lesson.date_played || 'No date available'}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <GameControls
              onGoToStart={goToStart}
              onGoToPrevious={goToPrevious}
              onGoToNext={goToNext}
              onGoToEnd={goToEnd}
              onPlay={handlePlay}
              onPause={handlePause}
              onLoadPgn={handleLoadPgn}
              onExportPgn={handleExportPgn}
              isPlaying={isPlaying}
              canGoBack={gameState.currentMoveIndex >= 0}
              canGoForward={gameState.currentMoveIndex < gameState.history.length - 1}
            />
          </div>

          {/* Game Status */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Move: {gameState.currentMoveIndex + 1}/{gameState.history.length}</span>
            <span>Turn: {gameState.turn === 'w' ? 'White' : 'Black'}</span>
            {gameState.isCheck && <span className="text-red-600 font-semibold">Check!</span>}
            {gameState.gameStatus !== 'playing' && (
              <span className="font-semibold capitalize">{gameState.gameStatus}</span>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {lesson.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Lesson Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {lesson.description}
            </p>
          </div>
        )}

        {/* Move History */}
        {gameState.history.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Move History</h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 text-sm font-mono">
                {gameState.history.map((move, index) => (
                  <button
                    key={index}
                    onClick={() => goToNext()}
                    className={`text-left p-1 rounded hover:bg-gray-200 ${
                      index === gameState.currentMoveIndex ? 'bg-blue-100 text-blue-700' : ''
                    }`}
                  >
                    {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Game Information</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Position: {lesson.position}</div>
            <div>Date: {lesson.date_played || 'Unknown'}</div>
            {lesson.white_player && <div>White: {lesson.white_player}</div>}
            {lesson.black_player && <div>Black: {lesson.black_player}</div>}
            {lesson.result && <div>Result: {lesson.result}</div>}
            <div>FEN: <code className="text-xs bg-white p-1 rounded">{gameState.position}</code></div>
          </div>
        </div>
      </div>

      <PgnImportDialog
        open={showPgnDialog}
        onOpenChange={setShowPgnDialog}
        onImport={handlePgnImport}
      />
    </div>
  );
};

export default LessonContent;
