import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { analyzeWellness } from '../services/api';

// Labels shown while the analysis request is in flight
const STEPS = [
  'Processing voice',
  'Detecting emotional tone',
  'Understanding conversation',
  'Building wellness report',
  'Generating AI insights',
];

// Each step is revealed on this cadence (ms). The last step completes only
// after the API call resolves so the UI never jumps ahead of the real work.
const STEP_INTERVAL_MS = 900;

export default function AnalyzingScreen({ route, navigation }) {
  const transcript = route?.params?.transcript ?? '';

  const [revealedCount, setRevealedCount] = useState(0);
  const [failed, setFailed] = useState(false);

  // Keep mutable refs so the retry callback always sees fresh state without
  // having to re-register effects.
  const timersRef = useRef([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const runAnalysis = useCallback(() => {
    // Clear any lingering timers from a previous attempt
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setRevealedCount(0);
    setFailed(false);

    // ── Step animation (steps 1-4 tick automatically) ─────────────────────────
    // Step 5 ("Generating AI insights") is only revealed once the API responds.
    for (let i = 0; i < STEPS.length - 1; i++) {
      const t = setTimeout(() => {
        if (isMountedRef.current) setRevealedCount(i + 1);
      }, (i + 1) * STEP_INTERVAL_MS);
      timersRef.current.push(t);
    }

    // ── Real API call ─────────────────────────────────────────────────────────
    analyzeWellness(transcript)
      .then((response) => {
        if (!isMountedRef.current) return;

        // Reveal the final step to signal completion
        setRevealedCount(STEPS.length);

        // Brief pause so the user sees all steps checked before navigating
        const navTimer = setTimeout(() => {
          if (!isMountedRef.current) return;
          navigation.replace('CheckInResult', {
            analysis: response.data.analysis,
            transcript,
          });
        }, 600);
        timersRef.current.push(navTimer);
      })
      .catch((err) => {
        if (!isMountedRef.current) return;

        // Stop the animation and surface the real error
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
        setFailed(true);

        const message =
          err?.response?.data?.error ||
          err?.message ||
          'Analysis failed. Please try again.';

        Alert.alert(
          'Analysis Failed',
          message,
          [
            {
              text: 'Retry',
              onPress: () => runAnalysis(),
            },
            {
              text: 'Go Back',
              style: 'cancel',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // Kick off on mount
  useEffect(() => {
    runAnalysis();
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  // runAnalysis is stable for the lifetime of this screen
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="analytics-outline" size={56} color="#007B8A" />
        </View>

        <Text style={styles.title}>
          {failed ? 'Analysis Failed' : 'AI Analyzing...'}
        </Text>
        <Text style={styles.subtitle}>
          {failed
            ? 'Something went wrong. Use Retry to try again.'
            : 'Please wait while WellMind reviews your check-in.'}
        </Text>

        <View style={styles.stepsContainer}>
          {STEPS.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              {index < revealedCount ? (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#38A169"
                    style={styles.stepIcon}
                  />
                  <Text style={styles.stepTextDone}>{step}</Text>
                </>
              ) : (
                <>
                  <View style={styles.stepDot} />
                  <Text style={styles.stepTextPending}>{step}</Text>
                </>
              )}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F2F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#007B8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  stepIcon: {
    marginRight: 12,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    marginRight: 12,
  },
  stepTextDone: {
    fontSize: 15,
    color: '#2D3748',
    fontWeight: '600',
  },
  stepTextPending: {
    fontSize: 15,
    color: '#A0AEC0',
    fontWeight: '400',
  },
});
