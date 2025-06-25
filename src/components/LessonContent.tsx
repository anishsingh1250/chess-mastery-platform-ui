
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GameControls from './GameControls';

interface LessonContentProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    date: string;
    pgn: string;
    description?: string;
  } | null;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePrevious = () => {
    console.log('Previous move');
  };

  const handleNext = () => {
    console.log('Next move');
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleLoadGame = () => {
    console.log('Load game');
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
            {lesson.date}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <GameControls
              onPrevious={handlePrevious}
              onNext={handleNext}
              onPlay={handlePlay}
              onPause={handlePause}
              isPlaying={isPlaying}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">PGN</span>
            <Button 
              onClick={handleLoadGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Load game
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
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

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Game Information</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Position: {lesson.position}</div>
            <div>Date: {lesson.date}</div>
            <div>PGN: {lesson.pgn}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
