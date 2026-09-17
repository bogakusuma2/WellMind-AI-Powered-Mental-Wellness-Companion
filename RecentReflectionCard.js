import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RecentReflectionCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Recent Reflection</Text>
      <View style={styles.quoteBox}>
        <Text style={styles.contextText}>Yesterday you said:</Text>
        <Text style={styles.quoteText}>
          "I felt much better after talking with my friend."
        </Text>
      </View>
      <TouchableOpacity style={styles.button} activeOpacity={0.7}>
        <Text style={styles.buttonText}>View Reflection</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  quoteBox: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007B8A',
  },
  contextText: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 6,
  },
  quoteText: {
    fontSize: 15,
    color: '#2D3748',
    fontStyle: 'italic',
    lineHeight: 22,
    fontWeight: '500',
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDF2F7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RecentReflectionCard;
