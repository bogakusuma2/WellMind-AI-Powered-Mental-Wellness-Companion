import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function CheckInMethodScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Daily Check-In</Text>
        <Text style={styles.headerSubtitle}>Choose how you'd like to check in today.</Text>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>🎤</Text>
          <Text style={styles.cardTitle}>Voice Check-In</Text>
          <Text style={styles.cardDescription}>
            Speak naturally about your day.{'\n'}No time limit.
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('VoiceRecording')}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>📹</Text>
          <Text style={styles.cardTitle}>Video Check-In</Text>
          <Text style={styles.cardDescription}>
            Record yourself while speaking.{'\n'}Future versions will also understand facial expressions.
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CameraCheckIn')}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          WellMind supports multiple check-in methods to make mental wellness more accessible.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#007B8A',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007B8A',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 13,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
});
