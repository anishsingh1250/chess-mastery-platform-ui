
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Play, FileText, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseData, type Chapter, type Lesson } from '@/hooks/useSupabaseData';
import PgnImportDialog from './PgnImportDialog';

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
  const [showPgnDialog, setShowPgnDialog] = useState(false);
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

  const handlePgnImport = (pgn: string) => {
    console.log('PGN imported:', pgn);
    // This will be handled by the lesson content component
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 h-full flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex gap-2 mb-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-blue-600 hover:text-blue-700"
            onClick={() => setShowPgnDialog(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import PGN
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-600 hover:text-green-700"
            onClick={() => window.open('/admin', '_blank')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </div>
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
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div className="text-left">
                    <div className="font-medium text-gray-700">{chapter.title}</div>
                    <div className="text-xs text-gray-400 capitalize">{chapter.difficulty}</div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {chapterLessons.length}
                  </span>
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
                        className={`w-full p-3 pl-12 text-left hover:bg-white transition-colors flex items-center justify-between group ${
                          selectedLessonId === lesson.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div className={`w-2 h-2 rounded-full ${
                            selectedLessonId === lesson.id ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
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

      <PgnImportDialog
        open={showPgnDialog}
        onOpenChange={setShowPgnDialog}
        onImport={handlePgnImport}
      />
    </div>
  );
};

export default LessonSidebar;
