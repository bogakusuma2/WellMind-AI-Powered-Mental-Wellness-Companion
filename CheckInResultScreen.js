import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveCheckIn } from '../services/api';

// Emoji map for the mood stat cards
const STAT_EMOJI = {
  mood:       '😊',
  stress:     '😌',
  energy:     '⚡',
  confidence: '🎯',
};

export default function CheckInResultScreen({ navigation, route }) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // ── Pull dynamic analysis from navigation params ─────────────────────────────
  const analysis  = route?.params?.analysis  ?? {};
  const transcript = route?.params?.transcript ?? '';

  const summary     = analysis.summary     ?? 'No summary available.';
  const mood        = analysis.mood        ?? '—';
  const stress      = analysis.stress      ?? '—';
  const energy      = analysis.energy      ?? '—';
  const confidence  = analysis.confidence  ?? '—';
  const observations = Array.isArray(analysis.observations) ? analysis.observations : [];
  const suggestions  = Array.isArray(analysis.suggestions)  ? analysis.suggestions  : [];

  // ── Stat card data built from live analysis ──────────────────────────────────
  const stats = [
    { label: 'Mood',       value: mood,       emoji: STAT_EMOJI.mood },
    { label: 'Stress',     value: stress,     emoji: STAT_EMOJI.stress },
    { label: 'Energy',     value: energy,     emoji: STAT_EMOJI.energy },
    { label: 'Confidence', value: confidence, emoji: STAT_EMOJI.confidence },
  ];

  const handleSave = async () => {
    if (isSaving || hasSaved) return;

    setIsSaving(true);

    try {
      await saveCheckIn({ transcript, analysis });
      setIsSaving(false);
      setHasSaved(true);

      Alert.alert(
        'Check-In Saved',
        "Today's check-in has been saved.\n\nWellMind will use today's conversation to understand your emotional patterns and generate better insights over time.",
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Main',
                    state: { routes: [{ name: 'Home' }] },
                  },
                ],
              });
            },
          },
        ]
      );
    } catch (err) {
      setIsSaving(false);
      const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save check-in. Please check your network connection and try again.";
      Alert.alert("Save Failed", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <Text style={styles.headerTitle}>Check-In Complete</Text>

        {/* ── AI Wellness Report Card ── */}
        <View style={styles.summaryCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🧠 AI Wellness Report</Text>
          </View>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>

        {/* ── Emotion stat cards ── */}
        <View style={styles.grid}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Text style={styles.statEmoji}>{item.emoji}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* ── AI Noticed ── */}
        <View style={styles.noticedCard}>
          <Text style={styles.sectionTitle}>AI noticed</Text>
          {observations.map((item, i) => (
            <View key={i} style={styles.checkRow}>
              <Ionicons name="checkmark-circle" size={18} color="#38A169" style={{ marginRight: 10 }} />
              <Text style={styles.checkText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* ── AI Suggestions ── */}
        <View style={styles.suggestionCard}>
          <Text style={styles.sectionTitle}>AI Suggestions</Text>
          {suggestions.map((item, i) => (
            <View key={i} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.suggestionText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* ── Save Button ── */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, (isSaving || hasSaved) && styles.disabledButton]}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isSaving || hasSaved}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {hasSaved ? 'Check-In Saved' : "Save Today's Check-In"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

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
    paddingBottom: 48,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 24,
    textAlign: 'center',
    marginTop: 12,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#E6F2F4',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    color: '#007B8A',
    fontWeight: '700',
    fontSize: 13,
  },
  summaryText: {
    fontSize: 15,
    color: '#2D3748',
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A202C',
  },
  noticedCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3748',
    lineHeight: 22,
  },
  suggestionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 32,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#007B8A',
    marginRight: 10,
    fontWeight: '700',
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
  },
  buttonContainer: {},
  primaryButton: {
    backgroundColor: '#007B8A',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#007B8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.65,
  },
});
