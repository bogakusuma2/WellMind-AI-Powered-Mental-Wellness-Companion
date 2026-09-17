import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Progress</Text>
      <View style={styles.cardsRow}>
        <View style={styles.progressBox}>
          <Text style={styles.boxLabel}>🔥 5 Day Check-in Streak</Text>
        </View>
        <View style={styles.progressBox}>
          <Text style={styles.boxLabel}>🙂 Average Mood</Text>
          <Text style={styles.boxValue}>Calm</Text>
        </View>
        <View style={styles.progressBox}>
          <Text style={styles.boxLabel}>📈 Weekly Consistency</Text>
          <Text style={styles.boxValue}>86%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxLabel: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
  },
  boxValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A202C',
  },
});

export default ProgressCard;
