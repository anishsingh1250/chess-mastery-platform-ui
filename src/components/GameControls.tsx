
import React from 'react';
import { 
  SkipBack, 
  SkipForward, 
  Pause, 
  Play,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onPrevious,
  onNext,
  onPlay,
  onPause,
  isPlaying
}) => {
  return (
    <div className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-md">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        className="hover:bg-gray-50 transition-colors"
      >
        <SkipBack className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        className="hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        className="hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="w-3 h-3" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={isPlaying ? onPause : onPlay}
        className="hover:bg-gray-50 transition-colors"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        className="hover:bg-gray-50 transition-colors"
      >
        <ArrowRight className="w-3 h-3" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        className="hover:bg-gray-50 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        className="hover:bg-gray-50 transition-colors"
      >
        <SkipForward className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default GameControls;
