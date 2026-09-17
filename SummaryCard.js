import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SummaryCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Wellness Summary</Text>
      <View style={styles.cardsRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.boxLabel}>Mood Trend</Text>
          <Text style={styles.boxValue}>🙂 Calm</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.boxLabel}>Weekly Progress</Text>
          <Text style={styles.boxValue}>4 / 7 Check-ins</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.boxLabel}>Current Streak</Text>
          <Text style={styles.boxValue}>🔥 5 Days</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  boxLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
    textAlign: 'center',
  },
  boxValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
  },
});

export default SummaryCard;
