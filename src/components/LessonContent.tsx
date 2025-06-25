
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GameControls from './GameControls';
import PgnImportDialog from './PgnImportDialog';
import { useChessGame } from '@/hooks/useChessGame';
import { type Lesson } from '@/hooks/useSupabaseData';
import { Download, Settings, Calendar, Users, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LessonContentProps {
  lesson: Lesson | null;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [showPgnDialog, setShowPgnDialog] = useState(false);
  const { toast } = useToast();
  
  const {
    gameState,
    goToStart,
    goToPrevious,
    goToNext,
    goToEnd,
    loadPgn,
    getPgn,
    reset
  } = useChessGame(lesson?.pgn, lesson?.fen);

  const handlePlay = () => {
    if (!isPlaying && gameState.currentMoveIndex < gameState.history.length - 1) {
      setIsPlaying(true);
      const interval = setInterval(() => {
        if (gameState.currentMoveIndex < gameState.history.length - 1) {
          goToNext();
        } else {
          setIsPlaying(false);
          clearInterval(interval);
          setAutoPlayInterval(null);
        }
      }, 1500);
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
  useEffect(() => {
    if (isPlaying && gameState.currentMoveIndex >= gameState.history.length - 1) {
      handlePause();
    }
  }, [gameState.currentMoveIndex, gameState.history.length, isPlaying]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [autoPlayInterval]);

  const handleLoadPgn = () => {
    setShowPgnDialog(true);
  };

  const handlePgnImport = (pgn: string) => {
    try {
      const success = loadPgn(pgn);
      if (success) {
        toast({
          title: "PGN Imported Successfully",
          description: "The PGN has been loaded and you can now navigate through the moves.",
        });
        console.log('PGN successfully loaded:', pgn);
      } else {
        toast({
          title: "Import Failed",
          description: "Invalid PGN format. Please check your PGN and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('PGN import error:', error);
      toast({
        title: "Import Error",
        description: "An error occurred while importing the PGN. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportPgn = () => {
    try {
      const pgn = getPgn();
      if (pgn) {
        const blob = new Blob([pgn], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${lesson?.title || 'chess-game'}.pgn`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "PGN Exported",
          description: "The PGN file has been downloaded successfully.",
        });
      } else {
        toast({
          title: "Export Failed",
          description: "No game data available to export.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Error",
        description: "An error occurred while exporting the PGN.",
        variant: "destructive",
      });
    }
  };

  const handleMoveClick = (moveIndex: number) => {
    // Navigate to specific move when clicked
    if (moveIndex <= gameState.currentMoveIndex) {
      // Go backwards
      while (gameState.currentMoveIndex > moveIndex) {
        goToPrevious();
      }
    } else {
      // Go forwards
      while (gameState.currentMoveIndex < moveIndex) {
        goToNext();
      }
    }
  };

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-96 text-center">
          <CardContent className="p-8">
            <div className="mb-4">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Select a lesson to begin
            </h3>
            <p className="text-gray-500 mb-4">
              Choose a lesson from the sidebar to start learning chess
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.open('/admin', '_blank')}
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Go to Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-800"
            onClick={() => window.history.back()}
          >
            ← Back
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <Trophy className="w-3 h-3 mr-1" />
              Lesson
            </Badge>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-gray-800">{lesson.title}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPgn}
                className="text-blue-600 hover:text-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PGN
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Game Info */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              {lesson.date_played && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {lesson.date_played}
                </div>
              )}
              {(lesson.white_player || lesson.black_player) && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {lesson.white_player || 'White'} vs {lesson.black_player || 'Black'}
                </div>
              )}
              {lesson.result && (
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {lesson.result}
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="flex items-center gap-4">
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
                canGoBack={gameState.currentMoveIndex > -1}
                canGoForward={gameState.currentMoveIndex < gameState.history.length - 1}
              />
            </div>

            {/* Game Status */}
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-white px-3 py-1 rounded-full border">
                Move: {gameState.currentMoveIndex + 1}/{gameState.history.length}
              </span>
              <span className="bg-white px-3 py-1 rounded-full border">
                Turn: {gameState.turn === 'w' ? 'White' : 'Black'}
              </span>
              {gameState.isCheck && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200 font-semibold">
                  Check!
                </span>
              )}
              {gameState.gameStatus !== 'playing' && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200 font-semibold capitalize">
                  {gameState.gameStatus}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {lesson.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lesson Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {lesson.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Move History */}
          {gameState.history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Move History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-8 gap-1 text-sm font-mono">
                    {gameState.history.map((move, index) => (
                      <button
                        key={index}
                        onClick={() => handleMoveClick(index)}
                        className={`text-left p-2 rounded hover:bg-gray-200 transition-colors ${
                          index === gameState.currentMoveIndex ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Position:</span>
                  <span className="ml-2 text-gray-600">{lesson.position}</span>
                </div>
                {lesson.date_played && (
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="ml-2 text-gray-600">{lesson.date_played}</span>
                  </div>
                )}
                {lesson.white_player && (
                  <div>
                    <span className="font-medium text-gray-700">White:</span>
                    <span className="ml-2 text-gray-600">{lesson.white_player}</span>
                  </div>
                )}
                {lesson.black_player && (
                  <div>
                    <span className="font-medium text-gray-700">Black:</span>
                    <span className="ml-2 text-gray-600">{lesson.black_player}</span>
                  </div>
                )}
                {lesson.result && (
                  <div>
                    <span className="font-medium text-gray-700">Result:</span>
                    <span className="ml-2 text-gray-600">{lesson.result}</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <span className="font-medium text-gray-700">Current FEN:</span>
                <div className="mt-1 p-3 bg-gray-100 rounded-lg">
                  <code className="text-xs text-gray-800 break-all">{gameState.position}</code>
                </div>
              </div>
              {lesson.pgn && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Original PGN:</span>
                  <div className="mt-1 p-3 bg-gray-100 rounded-lg max-h-32 overflow-y-auto">
                    <code className="text-xs text-gray-800 whitespace-pre-wrap">{lesson.pgn}</code>
                  </div>
                </div>
              )}
              {gameState.history.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Current Game PGN:</span>
                  <div className="mt-1 p-3 bg-gray-100 rounded-lg max-h-32 overflow-y-auto">
                    <code className="text-xs text-gray-800 whitespace-pre-wrap">{getPgn()}</code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
