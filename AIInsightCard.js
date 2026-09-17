import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AIInsightCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>🧠 AI Insight</Text>
      </View>
      
      <Text style={styles.heading}>WellMind noticed something about you.</Text>
      
      <Text style={styles.bodyText}>
        "Over the past week your stress appears to increase on Tuesday evenings.{'\n\n'}
        Last Friday you reported feeling much calmer after talking with a close friend.{'\n\n'}
        If this pattern continues this week, consider reaching out before stress builds up."
      </Text>
      
      <View style={styles.bottomArea}>
        <Text style={styles.smallLabel}>Generated from your previous check-ins</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.linkText}>View Weekly Report →</Text>
        </TouchableOpacity>
      </View>
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
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  badge: {
    backgroundColor: '#E6F2F4', // light shade of #007B8A
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    color: '#007B8A',
    fontWeight: '700',
    fontSize: 13,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 16,
    lineHeight: 28,
  },
  bodyText: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  bottomArea: {
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  smallLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    flex: 1,
    marginRight: 10,
  },
  linkText: {
    fontSize: 13,
    color: '#007B8A',
    fontWeight: '700',
  },
});

export default AIInsightCard;
