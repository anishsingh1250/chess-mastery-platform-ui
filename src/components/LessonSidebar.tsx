
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Play, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
  expanded: boolean;
}

const LessonSidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: '1',
      title: 'Beginner',
      expanded: true,
      lessons: [
        { id: '1.1', title: '01 - B1 - Introduction - CW', completed: false },
        { id: '1.2', title: '02 - B1 - Movement of King & Pawn - CW', completed: false },
        { id: '1.3', title: '03 - B1 - Movement of Rook & Bishop - CW', completed: false },
        { id: '1.4', title: '04 - B1 - Movement of Queen & Knight - CW', completed: false },
        { id: '1.5', title: '05 - B1 - Introduction to Special Moves - CW', completed: false },
        { id: '1.6', title: '06 - B2 - Attacking - CW', completed: false },
        { id: '1.7', title: '07 - B2 - Giving Check & Getting Out of Check - CW', completed: false },
        { id: '1.8', title: '08 - B2 - Special Moves in detail - CW', completed: false },
        { id: '1.9', title: '09 - B2 - Checkmate - CW', completed: false },
        { id: '1.10', title: '10 - B2 - Material - Capture unprotected piece - CW', completed: false },
        { id: '1.11', title: '11 - B3 - Exchange - Good,Equal,Bad - CW', completed: false },
        { id: '1.12', title: '12 - B3 - Defending - CW', completed: false },
        { id: '1.13', title: '13 - B3 - How a game is drawn - CW', completed: false },
        { id: '1.14', title: '14 - B3 - Stalemate - CW', completed: false },
        { id: '1.15', title: '15 - B3 - Basic Strategies - CW', completed: false },
      ]
    },
    {
      id: '2',
      title: 'Beginner_CW',
      expanded: false,
      lessons: []
    },
    {
      id: '3',
      title: 'Beginner_HW',
      expanded: false,
      lessons: []
    }
  ]);

  const toggleChapter = (chapterId: string) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, expanded: !chapter.expanded }
        : chapter
    ));
  };

  const handleLessonClick = (lessonId: string) => {
    console.log('Load lesson:', lessonId);
  };

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.lessons.some(lesson => 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Button variant="ghost" className="mb-3 text-blue-600 hover:text-blue-700">
          ← Load Games/Positions
        </Button>
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Chapters and Lessons */}
      <div className="flex-1 overflow-y-auto">
        {filteredChapters.map(chapter => (
          <div key={chapter.id} className="border-b border-gray-100">
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">{chapter.title}</span>
              </div>
              {chapter.expanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {chapter.expanded && (
              <div className="bg-gray-50">
                {chapter.lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson.id)}
                    className="w-full p-3 pl-8 text-left hover:bg-white transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <FileText className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-800">
                        {lesson.title}
                      </span>
                    </div>
                    <Play className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonSidebar;
