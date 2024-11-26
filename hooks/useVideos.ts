import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  video_url: string;
  created_at: string;
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVideos(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { videos, loading, error, refetch: fetchVideos };
}