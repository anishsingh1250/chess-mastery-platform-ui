
import React, { useState } from 'react';
import ChessBoard from '@/components/ChessBoard';
import LessonSidebar from '@/components/LessonSidebar';
import LessonContent from '@/components/LessonContent';
import { useChessGame } from '@/hooks/useChessGame';
import { type Lesson } from '@/hooks/useSupabaseData';

const Index = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  const {
    gameState,
    makeMove
  } = useChessGame(selectedLesson?.pgn, selectedLesson?.fen);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleMove = (from: string, to: string) => {
    return makeMove(from, to);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <LessonSidebar 
        selectedLessonId={selectedLesson?.id}
        onLessonSelect={handleLessonSelect}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Chess Board */}
        <div className="flex-1 flex items-center justify-center p-6">
          <ChessBoard 
            position={gameState.position}
            onMove={handleMove}
            highlightSquares={gameState.isCheck ? [] : []} // Can be extended for highlighting
          />
        </div>
        
        {/* Lesson Content */}
        <div className="w-full lg:w-96">
          <LessonContent lesson={selectedLesson} />
        </div>
      </div>
    </div>
  );
};

export default Index;
