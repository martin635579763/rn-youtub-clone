import { supabase } from '../lib/supabase';

const YOUTUBE_API_KEY = 'AIzaSyA7gxJPwGzgKebtmj8O3B5M3a10a7ZdicU';
const YOUTUBE_PLAYLIST_ID = 'PLaaPmDv9AVWu1k9lXNj9Q4lXM9F-apD1Q';

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

export async function fetchAndStoreVideos() {
  try {
    // Fetch videos from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    // Transform and store each video
    for (const item of data.items) {
      const videoDetails = await fetchVideoDetails(item.snippet.resourceId.videoId);
      
      const videoData = {
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: videoDetails.contentDetails.duration,
        views: videoDetails.statistics.viewCount,
        video_url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      };

      // Store in Supabase
      const { error } = await supabase
        .from('videos')
        .upsert(
          videoData,
          {
            onConflict: 'video_url',
            ignoreDuplicates: true,
          }
        );

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error fetching and storing videos:', error);
    return { success: false, error };
  }
}

async function fetchVideoDetails(videoId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );
  const data = await response.json();
  return data.items[0];
} 