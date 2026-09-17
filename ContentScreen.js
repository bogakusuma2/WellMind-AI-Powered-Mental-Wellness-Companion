import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ContentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wellness Content</Text>
      <Text style={styles.sub}>
        Articles, breathing exercises, and meditations
        tailored to your mood will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 24, fontWeight: 'bold',
    color: '#1a1a1a', marginBottom: 12,
  },
  sub: {
    fontSize: 15, color: '#666', lineHeight: 22,
  },
});