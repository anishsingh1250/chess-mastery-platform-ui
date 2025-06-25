
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useSupabaseData, type Chapter, type Lesson } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';

interface ChapterForm {
  id?: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  position: number;
}

interface LessonForm {
  id?: string;
  chapter_id: string;
  title: string;
  description: string;
  position: number;
  pgn: string;
  fen: string;
  date_played: string;
  white_player: string;
  black_player: string;
  result: string;
}

const Admin = () => {
  const { chapters, lessons, fetchChapters, fetchLessons, getLessonsByChapter } = useSupabaseData();
  const [editingChapter, setEditingChapter] = useState<ChapterForm | null>(null);
  const [editingLesson, setEditingLesson] = useState<LessonForm | null>(null);
  const [activeTab, setActiveTab] = useState<'chapters' | 'lessons'>('chapters');

  const handleSaveChapter = async () => {
    if (!editingChapter) return;

    try {
      if (editingChapter.id) {
        // Update existing chapter
        const { error } = await supabase
          .from('chapters')
          .update({
            title: editingChapter.title,
            description: editingChapter.description,
            difficulty: editingChapter.difficulty,
            position: editingChapter.position,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingChapter.id);
        
        if (error) throw error;
      } else {
        // Create new chapter
        const { error } = await supabase
          .from('chapters')
          .insert({
            title: editingChapter.title,
            description: editingChapter.description,
            difficulty: editingChapter.difficulty,
            position: editingChapter.position
          });
        
        if (error) throw error;
      }
      
      setEditingChapter(null);
      fetchChapters();
    } catch (error) {
      console.error('Error saving chapter:', error);
      alert('Error saving chapter');
    }
  };

  const handleSaveLesson = async () => {
    if (!editingLesson) return;

    try {
      if (editingLesson.id) {
        // Update existing lesson
        const { error } = await supabase
          .from('lessons')
          .update({
            chapter_id: editingLesson.chapter_id,
            title: editingLesson.title,
            description: editingLesson.description,
            position: editingLesson.position,
            pgn: editingLesson.pgn,
            fen: editingLesson.fen,
            date_played: editingLesson.date_played,
            white_player: editingLesson.white_player,
            black_player: editingLesson.black_player,
            result: editingLesson.result,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingLesson.id);
        
        if (error) throw error;
      } else {
        // Create new lesson
        const { error } = await supabase
          .from('lessons')
          .insert({
            chapter_id: editingLesson.chapter_id,
            title: editingLesson.title,
            description: editingLesson.description,
            position: editingLesson.position,
            pgn: editingLesson.pgn,
            fen: editingLesson.fen,
            date_played: editingLesson.date_played,
            white_player: editingLesson.white_player,
            black_player: editingLesson.black_player,
            result: editingLesson.result
          });
        
        if (error) throw error;
      }
      
      setEditingLesson(null);
      fetchLessons();
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Error saving lesson');
    }
  };

  const handleDeleteChapter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter? This will also delete all associated lessons.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('chapters')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      fetchChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      alert('Error deleting chapter');
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('lessons')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      fetchLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Error deleting lesson');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chess Platform Admin</h1>
          <p className="text-gray-600">Manage chapters and lessons for your chess teaching platform</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'chapters' ? 'default' : 'outline'}
            onClick={() => setActiveTab('chapters')}
          >
            Chapters
          </Button>
          <Button
            variant={activeTab === 'lessons' ? 'default' : 'outline'}
            onClick={() => setActiveTab('lessons')}
          >
            Lessons
          </Button>
        </div>

        {/* Chapters Tab */}
        {activeTab === 'chapters' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Chapters</h2>
              <Button
                onClick={() => setEditingChapter({
                  title: '',
                  description: '',
                  difficulty: 'beginner',
                  position: chapters.length + 1
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Chapter
              </Button>
            </div>

            {editingChapter && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingChapter.id ? 'Edit Chapter' : 'New Chapter'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Chapter Title"
                    value={editingChapter.title}
                    onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Chapter Description"
                    value={editingChapter.description}
                    onChange={(e) => setEditingChapter({ ...editingChapter, description: e.target.value })}
                  />
                  <div className="flex gap-4">
                    <select
                      value={editingChapter.difficulty}
                      onChange={(e) => setEditingChapter({ 
                        ...editingChapter, 
                        difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                      })}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <Input
                      type="number"
                      placeholder="Position"
                      value={editingChapter.position}
                      onChange={(e) => setEditingChapter({ ...editingChapter, position: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveChapter}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingChapter(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {chapters.map((chapter) => (
                <Card key={chapter.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{chapter.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{chapter.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{chapter.difficulty}</Badge>
                          <Badge variant="outline">Position: {chapter.position}</Badge>
                          <Badge variant="outline">{getLessonsByChapter(chapter.id).length} lessons</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingChapter({
                            id: chapter.id,
                            title: chapter.title,
                            description: chapter.description || '',
                            difficulty: chapter.difficulty,
                            position: chapter.position
                          })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteChapter(chapter.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Lessons</h2>
              <Button
                onClick={() => setEditingLesson({
                  chapter_id: chapters[0]?.id || '',
                  title: '',
                  description: '',
                  position: lessons.length + 1,
                  pgn: '',
                  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                  date_played: '',
                  white_player: '',
                  black_player: '',
                  result: ''
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </Button>
            </div>

            {editingLesson && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingLesson.id ? 'Edit Lesson' : 'New Lesson'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <select
                    value={editingLesson.chapter_id}
                    onChange={(e) => setEditingLesson({ ...editingLesson, chapter_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {chapters.map(chapter => (
                      <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Lesson Title"
                    value={editingLesson.title}
                    onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Lesson Description"
                    value={editingLesson.description}
                    onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Position"
                      type="number"
                      value={editingLesson.position}
                      onChange={(e) => setEditingLesson({ ...editingLesson, position: parseInt(e.target.value) })}
                    />
                    <Input
                      placeholder="Date Played"
                      value={editingLesson.date_played}
                      onChange={(e) => setEditingLesson({ ...editingLesson, date_played: e.target.value })}
                    />
                    <Input
                      placeholder="White Player"
                      value={editingLesson.white_player}
                      onChange={(e) => setEditingLesson({ ...editingLesson, white_player: e.target.value })}
                    />
                    <Input
                      placeholder="Black Player"
                      value={editingLesson.black_player}
                      onChange={(e) => setEditingLesson({ ...editingLesson, black_player: e.target.value })}
                    />
                  </div>
                  <Input
                    placeholder="Result (e.g., 1-0, 0-1, 1/2-1/2)"
                    value={editingLesson.result}
                    onChange={(e) => setEditingLesson({ ...editingLesson, result: e.target.value })}
                  />
                  <Textarea
                    placeholder="PGN (e.g., 1. e4 e5 2. Nf3 Nc6)"
                    value={editingLesson.pgn}
                    onChange={(e) => setEditingLesson({ ...editingLesson, pgn: e.target.value })}
                    className="font-mono text-sm"
                  />
                  <Textarea
                    placeholder="FEN Position"
                    value={editingLesson.fen}
                    onChange={(e) => setEditingLesson({ ...editingLesson, fen: e.target.value })}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveLesson}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingLesson(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {lessons.map((lesson) => {
                const chapter = chapters.find(c => c.id === lesson.chapter_id);
                return (
                  <Card key={lesson.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{lesson.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{chapter?.title}</Badge>
                            <Badge variant="outline">Position: {lesson.position}</Badge>
                            {lesson.date_played && <Badge variant="outline">{lesson.date_played}</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingLesson({
                              id: lesson.id,
                              chapter_id: lesson.chapter_id,
                              title: lesson.title,
                              description: lesson.description || '',
                              position: lesson.position,
                              pgn: lesson.pgn || '',
                              fen: lesson.fen || '',
                              date_played: lesson.date_played || '',
                              white_player: lesson.white_player || '',
                              black_player: lesson.black_player || '',
                              result: lesson.result || ''
                            })}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
