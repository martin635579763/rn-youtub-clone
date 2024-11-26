import { View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';

interface VideoCardProps {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  onPress: () => void;
}

export default function VideoCard({ id, title, duration, thumbnail, onPress }: VideoCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.duration}>{duration}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  title: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  duration: {
    padding: 10,
    paddingTop: 0,
    color: '#666',
  },
}); 