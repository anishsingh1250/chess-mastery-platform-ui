
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  chapter_id: string;
  title: string;
  description?: string;
  position: number;
  pgn?: string;
  fen?: string;
  date_played?: string;
  white_player?: string;
  black_player?: string;
  result?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSupabaseData = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChapters = async () => {
    try {
      console.log('Fetching chapters...');
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('is_active', true)
        .order('position');
      
      if (error) throw error;
      console.log('Chapters fetched:', data);
      setChapters(data || []);
    } catch (err) {
      console.error('Error fetching chapters:', err);
      setError('Failed to fetch chapters');
    }
  };

  const fetchLessons = async (chapterId?: string) => {
    try {
      console.log('Fetching lessons...');
      let query = supabase
        .from('lessons')
        .select('*')
        .eq('is_active', true);
      
      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }
      
      const { data, error } = await query.order('position');
      
      if (error) throw error;
      console.log('Lessons fetched:', data);
      setLessons(data || []);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Failed to fetch lessons');
    }
  };

  const addSampleData = async () => {
    try {
      console.log('Adding sample data...');
      
      // Add more chapters with proper typing
      const { data: existingChapters } = await supabase
        .from('chapters')
        .select('title');
      
      const existingTitles = existingChapters?.map(c => c.title) || [];
      
      const newChapters: Array<{
        title: string;
        description: string;
        difficulty: 'beginner' | 'intermediate' | 'advanced';
        position: number;
      }> = [
        { title: 'Openings', description: 'Learn fundamental chess openings', difficulty: 'intermediate', position: 4 },
        { title: 'Tactics', description: 'Practice tactical combinations', difficulty: 'intermediate', position: 5 },
        { title: 'Endgames', description: 'Master essential endgame positions', difficulty: 'advanced', position: 6 },
        { title: 'Famous Games', description: 'Study games from chess masters', difficulty: 'advanced', position: 7 }
      ].filter(chapter => !existingTitles.includes(chapter.title));

      if (newChapters.length > 0) {
        const { error: chaptersError } = await supabase
          .from('chapters')
          .insert(newChapters);
        
        if (chaptersError) throw chaptersError;
      }

      // Fetch updated chapters
      const { data: allChapters } = await supabase
        .from('chapters')
        .select('*')
        .order('position');

      // Add sample lessons
      const sampleLessons = [
        {
          chapter_title: 'Openings',
          title: 'Italian Game',
          description: 'The Italian Game is one of the oldest chess openings. It develops pieces quickly and leads to sharp tactical play.',
          pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d3 d6 6. O-O O-O',
          fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 0 7',
          white_player: 'Teaching Example',
          black_player: 'Student',
          result: '*',
          position: 1
        },
        {
          chapter_title: 'Tactics',
          title: 'Pin Tactics',
          description: 'Learn how to use pins to win material or gain positional advantages.',
          pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Bb7 10. d4 Re8',
          fen: 'r2qr1k1/1bp1bppp/p1np1n2/1p2p3/3PP3/1BP2N1P/PP3PP1/RNBQR1K1 w - - 0 11',
          white_player: 'Morphy',
          black_player: 'Amateur',
          result: '1-0',
          position: 1
        },
        {
          chapter_title: 'Endgames',
          title: 'King and Pawn vs King',
          description: 'Master the fundamental pawn endgame technique.',
          pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 f5 5. d3 fxe4 6. dxe4 Nf6 7. Ng5 O-O 8. Nxh7 Nxh7 9. Bxg8 Nxg8',
          fen: '6k1/pppp2p1/2n5/2b1p3/2B1P3/2P5/PP3PPP/RNBQK2R w KQ - 0 10',
          white_player: 'Capablanca',
          black_player: 'Marshall',
          result: '1/2-1/2',
          position: 1
        }
      ];

      for (const lesson of sampleLessons) {
        const chapter = allChapters?.find(c => c.title === lesson.chapter_title);
        if (chapter) {
          const { data: existingLesson } = await supabase
            .from('lessons')
            .select('id')
            .eq('chapter_id', chapter.id)
            .eq('title', lesson.title)
            .single();

          if (!existingLesson) {
            const { error: lessonError } = await supabase
              .from('lessons')
              .insert({
                chapter_id: chapter.id,
                title: lesson.title,
                description: lesson.description,
                pgn: lesson.pgn,
                fen: lesson.fen,
                white_player: lesson.white_player,
                black_player: lesson.black_player,
                result: lesson.result,
                position: lesson.position
              });

            if (lessonError) throw lessonError;
          }
        }
      }

      console.log('Sample data added successfully');
    } catch (err) {
      console.error('Error adding sample data:', err);
    }
  };

  const getLessonsByChapter = (chapterId: string) => {
    return lessons.filter(lesson => lesson.chapter_id === chapterId);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await addSampleData();
      await Promise.all([fetchChapters(), fetchLessons()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return {
    chapters,
    lessons,
    loading,
    error,
    fetchChapters,
    fetchLessons,
    getLessonsByChapter
  };
};
