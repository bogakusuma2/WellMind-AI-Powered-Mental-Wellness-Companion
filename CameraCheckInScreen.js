import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';

export default function CameraCheckInScreen({ navigation }) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const cameraRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Stop recording automatically when reaching 60 seconds
    if (timer >= 60 && isRecording) {
      stopRecording();
    }
  }, [timer, isRecording]);

  const startRecording = async () => {
    if (!cameraRef.current) return;
    
    setIsRecording(true);
    setTimer(0);
    
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    try {
      const video = await cameraRef.current.recordAsync({
        maxDuration: 60,
      });
      // Navigates only when the promise resolves (recording stops)
      if (video && video.uri) {
        navigation.navigate('Preview', { videoUri: video.uri });
      }
    } catch (error) {
      console.log('Error recording video:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Check permissions
  if (!cameraPermission || !micPermission) {
    return <View style={styles.container} />; // Loading
  }

  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.infoText}>We need your permission to record video.</Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={async () => {
              await requestCameraPermission();
              await requestMicPermission();
            }}
          >
            <Text style={styles.permissionText}>Grant Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
            <Text style={styles.skipText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraWrapper}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing="front" 
          mode="video"
        >
          {isRecording && <Text style={styles.timer}>{formatTime(timer)}</Text>}
        </CameraView>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => {
            if (isRecording) stopRecording();
            navigation.goBack();
          }}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.recordButton, isRecording && styles.recordingButton]} 
          onPress={handleRecord}
        >
          <View style={[styles.innerRecordButton, isRecording && styles.innerRecordingButton]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => navigation.navigate('Analyzing')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  infoText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#007B8A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraWrapper: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
    alignItems: 'center',
  },
  timer: {
    marginTop: 20,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    borderColor: '#E53E3E',
  },
  innerRecordButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  innerRecordingButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 10,
    width: 30,
    height: 30,
  },
  cancelButton: {
    padding: 10,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
  },
});
