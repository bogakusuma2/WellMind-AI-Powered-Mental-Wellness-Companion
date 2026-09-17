import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { transcribeAudio } from '../services/api';

export default function VoiceRecordingScreen({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [seconds, setSeconds] = useState(0);


  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Please grant microphone permissions to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setSeconds(0);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording saved at', uri);
      setRecording(null);

      if (!uri) {
        Alert.alert('Error', 'Could not retrieve the recorded audio file.');
        return;
      }

      // Upload the real audio file to the backend for transcription
      setIsUploading(true);
      try {
        const response = await transcribeAudio(uri);
        setIsUploading(false);
        navigation.navigate('Analyzing', { transcript: response.data.transcript });
      } catch (uploadErr) {
        setIsUploading(false);
        const message =
          uploadErr?.response?.data?.error ||
          uploadErr?.message ||
          'Upload failed. Please try again.';
        Alert.alert('Transcription Failed', message);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to stop the recording.');
    }
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };


  // ── Uploading state ──────────────────────────────────────────────────────────
  if (isUploading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.micContainer, styles.micUploading]}>
            <Ionicons name="cloud-upload-outline" size={70} color="#007B8A" />
          </View>

          <Text style={styles.title}>Uploading Voice...</Text>
          <Text style={styles.subtitle}>Transcribing your check-in with AI.{"\n"}Please wait a moment.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Recording state ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.micContainer, isRecording && styles.micRecording]}>
          <Ionicons name="mic" size={80} color={isRecording ? '#E53E3E' : '#007B8A'} />
        </View>

        <Text style={styles.title}>Voice Check-In</Text>
        <Text style={styles.subtitle}>
          Tell me how your day went.{'\n'}
          You can speak freely.{'\n'}
          Press Stop when you're done.
        </Text>

        <View style={styles.statusContainer}>
          {isRecording ? (
            <>
              <Text style={styles.listeningText}>Listening...</Text>
              <Text style={styles.timerText}>{formatTime(seconds)}</Text>
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, isRecording && styles.buttonRecording]}
          activeOpacity={0.8}
          onPress={handleToggleRecord}
        >
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  micContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 40,
  },
  micRecording: {
    backgroundColor: '#FFF5F5',
    shadowColor: '#E53E3E',
    shadowOpacity: 0.25,
  },
  micUploading: {
    backgroundColor: '#E6F2F4',
    shadowColor: '#007B8A',
    shadowOpacity: 0.2,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  statusContainer: {
    height: 60,
    alignItems: 'center',
  },
  listeningText: {
    fontSize: 18,
    color: '#E53E3E',
    fontWeight: '600',
    marginBottom: 6,
  },
  timerText: {
    fontSize: 28,
    color: '#2D3748',
    fontWeight: '700',
    letterSpacing: 2,
  },
  progressBarOuter: {
    width: '85%',
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 24,
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#007B8A',
    borderRadius: 10,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#007B8A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007B8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonRecording: {
    backgroundColor: '#E53E3E',
    shadowColor: '#E53E3E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
