import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Animated } from "react-native";
import { useVideos } from "../../hooks/useVideos";
import { fetchAndStoreVideos } from "../../services/videoService";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types/video";
import VideoModal from "@/components/VideoModal";

export default function Explore() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const { videos, loading, error, refetch } = useVideos();

  const handleVideoPress = (video: Video) => {
    setSelectedVideo(video);
    setIsMinimized(false);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setIsMinimized(false);
  };

  const handleMinimizedPlayerPress = () => {
    setIsMinimized(false);
  };

  useEffect(() => {
    // Fetch and store videos on component mount
    async function updateVideos() {
      try {
        await fetchAndStoreVideos();
        refetch();
      } catch (err) {
        console.error("Error updating videos:", err);
      }
    }

    updateVideos();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading videos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id.toString()}
              title={video.title}
              duration={video.duration}
              thumbnail={video.thumbnail}
              onPress={() => handleVideoPress(video)}
            />
          ))}
        </ScrollView>
      </View>
  
      {selectedVideo && (
        <VideoModal
          isVisible={!isMinimized}
          video={{ video_url: selectedVideo.video_url }}
          onClose={handleCloseModal}
          onMinimizedPlayerPress={handleMinimizedPlayerPress}
        />
      )}
    </>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
 });