
import React, { useState } from 'react';
import ChessBoard from '@/components/ChessBoard';
import LessonSidebar from '@/components/LessonSidebar';
import LessonContent from '@/components/LessonContent';

const Index = () => {
  const [selectedLesson, setSelectedLesson] = useState({
    id: '1.1',
    title: '01 - B1 - Introduction - CW',
    position: 1,
    date: '2021.??.??, ?',
    pgn: 'PGN',
    description: 'Chess is one of the oldest board games which is believed to be invented in India many years ago when the Kings and Queens used to play this interesting game. Chess is a battle played between 2 players (White & Black). The chessboard is a big square divided into 64 squares of light and dark colors. The battle starts with the White player making first move, followed by Black player and the game goes on till a result of a win, lose or draw. ... Observe the King! ...'
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <LessonSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Chess Board */}
        <div className="flex-1 flex items-center justify-center p-6">
          <ChessBoard />
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
