
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
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('is_active', true)
        .order('position');
      
      if (error) throw error;
      setChapters(data || []);
    } catch (err) {
      console.error('Error fetching chapters:', err);
      setError('Failed to fetch chapters');
    }
  };

  const fetchLessons = async (chapterId?: string) => {
    try {
      let query = supabase
        .from('lessons')
        .select('*')
        .eq('is_active', true);
      
      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }
      
      const { data, error } = await query.order('position');
      
      if (error) throw error;
      setLessons(data || []);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Failed to fetch lessons');
    }
  };

  const getLessonsByChapter = (chapterId: string) => {
    return lessons.filter(lesson => lesson.chapter_id === chapterId);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
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
