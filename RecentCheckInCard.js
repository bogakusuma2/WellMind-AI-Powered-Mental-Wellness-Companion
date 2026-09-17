import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecentCheckInCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>🎤 Yesterday's Check-In</Text>

      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>
          "I felt much better after talking with my friend."
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.noticeLabel}>AI noticed</Text>
      {[
        'Social interaction improved your mood',
        'Confidence increased compared to previous check-in',
      ].map((item, i) => (
        <View key={i} style={styles.checkRow}>
          <Ionicons name="checkmark-circle" size={16} color="#38A169" style={{ marginRight: 8 }} />
          <Text style={styles.checkText}>{item}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button} activeOpacity={0.7}>
        <Text style={styles.buttonText}>View Full Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 14,
  },
  quoteBox: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007B8A',
  },
  quoteText: {
    fontSize: 14,
    color: '#2D3748',
    fontStyle: 'italic',
    lineHeight: 20,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginBottom: 14,
  },
  noticeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#718096',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkText: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDF2F7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  buttonText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RecentCheckInCard;
