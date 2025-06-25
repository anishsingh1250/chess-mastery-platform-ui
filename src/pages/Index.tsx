
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
    console.log('Selected lesson:', lesson);
  };

  const handleMove = (from: string, to: string) => {
    return makeMove(from, to);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <LessonSidebar 
        selectedLessonId={selectedLesson?.id}
        onLessonSelect={handleLessonSelect}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Chess Board */}
        <div className="flex-1 flex items-center justify-center p-4 xl:p-8 min-h-[50vh] xl:min-h-screen">
          <div className="w-full max-w-lg">
            <ChessBoard 
              position={gameState.position}
              onMove={handleMove}
              highlightSquares={gameState.isCheck ? [] : []} 
            />
          </div>
        </div>
        
        {/* Lesson Content */}
        <div className="w-full xl:w-[480px] border-t xl:border-t-0 xl:border-l border-gray-200">
          <LessonContent lesson={selectedLesson} />
        </div>
      </div>
    </div>
  );
};

export default Index;
