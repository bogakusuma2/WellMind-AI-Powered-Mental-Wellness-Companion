import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function PreviewScreen({ route, navigation }) {
  const { videoUri } = route.params || {};

  // Setup video player
  const player = useVideoPlayer(videoUri, player => {
    player.loop = true;
    player.play();
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Preview Video</Text>
      
      <View style={styles.videoContainer}>
        {videoUri ? (
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            contentFit="cover"
          />
        ) : (
          <Text style={styles.errorText}>No video available</Text>
        )}
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.primaryButton} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Analyzing')}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginVertical: 16,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#fff',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  secondaryButton: {
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
    paddingVertical: 16,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#007B8A',
    borderRadius: 12,
    paddingVertical: 16,
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
