import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alerts</Text>
      <Text style={styles.sub}>
        Your alerts will appear here once the AI detects
        any changes in your mental health patterns.
      </Text>

      {/* SOS Button */}
      <TouchableOpacity style={styles.sos}>
        <Text style={styles.sosText}>🆘  SOS Emergency Alert</Text>
      </TouchableOpacity>
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
    fontSize: 15, color: '#666',
    lineHeight: 22, marginBottom: 40,
  },
  sos: {
    backgroundColor: '#e53935',
    padding: 18, borderRadius: 12,
    alignItems: 'center',
  },
  sosText: {
    color: '#fff', fontSize: 16,
    fontWeight: 'bold',
  },
});