
import React from 'react';
import { 
  SkipBack, 
  SkipForward, 
  Pause, 
  Play,
  ChevronLeft,
  ChevronRight,
  Square,
  Upload,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onGoToStart: () => void;
  onGoToPrevious: () => void;
  onGoToNext: () => void;
  onGoToEnd: () => void;
  onPlay: () => void;
  onPause: () => void;
  onLoadPgn: () => void;
  onExportPgn: () => void;
  isPlaying: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onGoToStart,
  onGoToPrevious,
  onGoToNext,
  onGoToEnd,
  onPlay,
  onPause,
  onLoadPgn,
  onExportPgn,
  isPlaying,
  canGoBack,
  canGoForward
}) => {
  return (
    <div className="flex items-center justify-center gap-1 p-3 bg-white rounded-lg shadow-md">
      {/* Go to start */}
      <Button
        variant="outline"
        size="icon"
        onClick={onGoToStart}
        disabled={!canGoBack}
        className="hover:bg-gray-50 transition-colors h-8 w-8"
        title="Go to start"
      >
        <SkipBack className="w-3 h-3" />
      </Button>
      
      {/* Previous move */}
      <Button
        variant="outline"
        size="icon"
        onClick={onGoToPrevious}
        disabled={!canGoBack}
        className="hover:bg-gray-50 transition-colors h-8 w-8"
        title="Previous move"
      >
        <ChevronLeft className="w-3 h-3" />
      </Button>
      
      {/* Play/Pause */}
      <Button
        variant="outline"
        size="icon"
        onClick={isPlaying ? onPause : onPlay}
        className="hover:bg-gray-50 transition-colors h-8 w-8"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
      </Button>
      
      {/* Next move */}
      <Button
        variant="outline"
        size="icon"
        onClick={onGoToNext}
        disabled={!canGoForward}
        className="hover:bg-gray-50 transition-colors h-8 w-8"
        title="Next move"
      >
        <ChevronRight className="w-3 h-3" />
      </Button>
      
      {/* Go to end */}
      <Button
        variant="outline"
        size="icon"
        onClick={onGoToEnd}
        disabled={!canGoForward}
        className="hover:bg-gray-50 transition-colors h-8 w-8"
        title="Go to end"
      >
        <SkipForward className="w-3 h-3" />
      </Button>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Load PGN */}
      <Button
        variant="outline"
        size="icon"
        onClick={onLoadPgn}
        className="hover:bg-gray-50 transition-colors h-8 w-8"
        title="Import PGN"
      >
        <Upload className="w-3 h-3" />
      </Button>

      {/* Export PGN */}
      <Button
        variant="outline"
        size="icon"
        onClick={onExportPgn}
        className="hover:bg-gray-50 transition-colors h-8 w-8"
        title="Export PGN"
      >
        <Download className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default GameControls;
