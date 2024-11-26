import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
  withSpring,
  useAnimatedReaction,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';  // 确保已安装 @expo/vector-icons

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PLAYER_HEIGHT = 300;
const THRESHOLD = (SCREEN_HEIGHT * 0.33) - (PLAYER_HEIGHT / 3);
const MINIMIZED_POSITION = SCREEN_HEIGHT - 220;
const MINIMIZED_WIDTH = SCREEN_WIDTH * 0.4;
const MINIMIZED_RIGHT = 180;

interface VideoModalProps {
  isVisible: boolean;
  video?: { video_url: string };
  onClose: () => void;
  onMinimizedPlayerPress?: () => void;
}

export default function VideoModal({ isVisible, video, onClose, onMinimizedPlayerPress}: VideoModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const playerRef = useRef(null);
  const panRef = useRef(null);
  
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, context) => {
      'worklet';
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      'worklet';
      translateY.value = context.startY + event.translationY;
    },
    onEnd: (event) => {
      'worklet';
      const finalPosition = translateY.value + event.velocityY * 0.3;
      
      if (finalPosition > THRESHOLD) {
        translateY.value = withSpring(MINIMIZED_POSITION, {
          velocity: event.velocityY,
          damping: 20,
          stiffness: 90,
        });
      } else {
        translateY.value = withSpring(0, {
          velocity: event.velocityY,
          damping: 20,
          stiffness: 90,
        });
      }
    },
  });

  const containerStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      translateY.value,
      [0, THRESHOLD * 0.5],
      [1, 0],
      Extrapolate.CLAMP
    );
    return {
      backgroundColor: `rgba(0, 0, 0, ${opacity})`,
    };
  }, []);

  const videoStyle = useAnimatedStyle(() => {
    'worklet';
    const progress = interpolate(
      translateY.value,
      [0, THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      progress,
      [0, 1],
      [1, 0.55],
      Extrapolate.CLAMP
    );

    const translateX = interpolate(
      progress,
      [0, 1],
      [0, SCREEN_WIDTH - MINIMIZED_WIDTH - MINIMIZED_RIGHT],
      Extrapolate.CLAMP
    );

    const finalY = interpolate(
      progress,
      [0, 1],
      [0, MINIMIZED_POSITION - PLAYER_HEIGHT * 0.6],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [
        { translateY: finalY },
        { translateX },
        { scale },
      ],
      width: SCREEN_WIDTH,
    };
  }, []);

  const closeButtonStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      translateY.value,
      [0, THRESHOLD],
      [0, 1],  // 只在最小化时显示关闭按钮
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
      transform: [
        { scale: opacity }  // 添加缩放效果
      ]
    };
  }, []);

  const getYouTubeVideoId = (url?: string) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/|.*\/embed\/))([^&?\n]+)/);
    return match ? match[1] : '';
  };

  return (
    <Animated.View style={[styles.modalContainer, containerStyle]}>
      <View style={styles.contentContainer}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View 
            style={[styles.videoContainer, videoStyle]}
            onTouchEnd={onMinimizedPlayerPress}
          >
            <YoutubePlayer
              height={PLAYER_HEIGHT}
              width={SCREEN_WIDTH}
              videoId={getYouTubeVideoId(video?.video_url)}
              play={isVisible}
            />
            <Animated.View style={[styles.closeButton, closeButtonStyle]}>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="close-circle" size={32} color="white" />
              </TouchableOpacity>
            </Animated.View>
            <View style={styles.gestureLayer} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1000,
    pointerEvents: 'box-none',  // 允许触摸事件穿透到子组件
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1001,
  },
  gestureLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 1,
  },
});