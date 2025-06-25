
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Play, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseData, type Chapter, type Lesson } from '@/hooks/useSupabaseData';

interface LessonSidebarProps {
  selectedLessonId?: string;
  onLessonSelect: (lesson: Lesson) => void;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({
  selectedLessonId,
  onLessonSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['*']));
  const { chapters, lessons, loading, getLessonsByChapter } = useSupabaseData();

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getLessonsByChapter(chapter.id).some(lesson => 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 h-full flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Button variant="ghost" className="mb-3 text-blue-600 hover:text-blue-700">
          ← Load Games/Positions
        </Button>
        <Input
          type="text"
          placeholder="Search lessons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Chapters and Lessons */}
      <div className="flex-1 overflow-y-auto">
        {filteredChapters.map(chapter => {
          const chapterLessons = getLessonsByChapter(chapter.id);
          const isExpanded = expandedChapters.has(chapter.id) || expandedChapters.has('*');
          
          return (
            <div key={chapter.id} className="border-b border-gray-100">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">{chapter.title}</span>
                  <span className="text-xs text-gray-400">({chapterLessons.length})</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="bg-gray-50">
                  {chapterLessons
                    .filter(lesson => 
                      !searchTerm || lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(lesson => (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(lesson)}
                        className={`w-full p-3 pl-8 text-left hover:bg-white transition-colors flex items-center justify-between group ${
                          selectedLessonId === lesson.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <FileText className="w-3 h-3 text-gray-400" />
                          <span className={`text-sm ${
                            selectedLessonId === lesson.id ? 'text-blue-700 font-medium' : 'text-gray-600'
                          } group-hover:text-gray-800`}>
                            {lesson.title}
                          </span>
                        </div>
                        <Play className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonSidebar;
