import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { logMood } from '../services/api';

const MOODS = [
  { id: 1, name: 'Happy',     emoji: '😊' },
  { id: 2, name: 'Calm',      emoji: '😌' },
  { id: 3, name: 'Anxious',   emoji: '😰' },
  { id: 4, name: 'Sad',       emoji: '😢' },
  { id: 5, name: 'Angry',     emoji: '😠' },
  { id: 6, name: 'Depressed', emoji: '😞' },
];

const TRIGGERS = [
  { id: 1, name: 'Work'      },
  { id: 2, name: 'Family'    },
  { id: 3, name: 'Health'    },
  { id: 4, name: 'Social'    },
  { id: 5, name: 'Academic'  },
  { id: 6, name: 'Financial' },
  { id: 7, name: 'Other'     },
];

export default function MoodLogScreen() {
  const [selectedMood,    setSelectedMood   ] = useState(null);
  const [moodScore,       setMoodScore      ] = useState('');
  const [journalNotes,    setJournalNotes   ] = useState('');
  const [sleepHours,      setSleepHours     ] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [loading,         setLoading        ] = useState(false);

  const resetForm = () => {
    setSelectedMood(null);
    setMoodScore('');
    setJournalNotes('');
    setSleepHours('');
    setSelectedTrigger(null);
  };

  const handleSubmit = async () => {
  console.log("✅ Save Mood button clicked");

  if (!selectedMood) {
    Alert.alert("Required", "Please select how you are feeling.");
    return;
  }

  if (!moodScore || Number(moodScore) < 1 || Number(moodScore) > 10) {
    Alert.alert("Required", "Please enter a mood score between 1 and 10.");
    return;
  }

  const payload = {
    mood_type_id: selectedMood,
    mood_score: Number(moodScore),
    journal_notes: journalNotes || null,
    sleep_hours: sleepHours ? Number(sleepHours) : null,
    trigger_type_id: selectedTrigger || null,
  };

  console.log("📤 Sending this data to backend:", payload);

  setLoading(true);

  try {
    const response = await logMood(payload);

    console.log("✅ Backend responded successfully");
    console.log("Status:", response.status);
    console.log("Response:", response.data);

    Alert.alert(
      "Mood Logged ✓",
      "Your mood has been saved successfully.",
      [
        {
          text: "OK",
          onPress: () => {
            console.log("🔄 Resetting form...");
            resetForm();
          },
        },
      ]
    );
  } catch (error) {
    console.log("❌ Mood API Error");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response:", error.response.data);
    } else if (error.request) {
      console.log("No response received from backend");
      console.log(error.request);
    } else {
      console.log("Error:", error.message);
    }

    Alert.alert(
      "Error",
      error.response?.data?.error ||
        "Could not save mood. Please try again."
    );
  } finally {
    console.log("🏁 Finished request");
    setLoading(false);
  }
};

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>How are you feeling today?</Text>

      {/* ── Mood selector ───────────────────────────────── */}
      <Text style={styles.label}>Select your mood</Text>
      <View style={styles.moodRow}>
        {MOODS.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.moodBtn,
              selectedMood === m.id && styles.moodBtnSelected
            ]}
            onPress={() => setSelectedMood(m.id)}
          >
            <Text style={styles.moodEmoji}>{m.emoji}</Text>
            <Text style={[
              styles.moodName,
              selectedMood === m.id && styles.moodNameSelected
            ]}>
              {m.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Mood score ──────────────────────────────────── */}
      <Text style={styles.label}>Mood score  (1 = very low,  10 = very good)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a number from 1 to 10"
        value={moodScore}
        onChangeText={setMoodScore}
        keyboardType="numeric"
        maxLength={2}
      />

      {/* ── Journal note ────────────────────────────────── */}
      <Text style={styles.label}>Journal note  (optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write anything on your mind..."
        value={journalNotes}
        onChangeText={setJournalNotes}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* ── Sleep hours ─────────────────────────────────── */}
      <Text style={styles.label}>How many hours did you sleep?  (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 7.5"
        value={sleepHours}
        onChangeText={setSleepHours}
        keyboardType="numeric"
      />

      {/* ── Trigger selector ────────────────────────────── */}
      <Text style={styles.label}>What triggered this mood?  (optional)</Text>
      <View style={styles.triggerRow}>
        {TRIGGERS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.triggerBtn,
              selectedTrigger === t.id && styles.triggerBtnSelected
            ]}
            onPress={() =>
              setSelectedTrigger(
                selectedTrigger === t.id ? null : t.id
              )
            }
          >
            <Text style={[
              styles.triggerText,
              selectedTrigger === t.id && styles.triggerTextSelected
            ]}>
              {t.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Submit button ───────────────────────────────── */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Save Mood Log</Text>
        }
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007B8A',
    marginBottom: 24,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },

  // Mood buttons
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodBtn: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
    width: '30%',
    backgroundColor: '#fafafa',
  },
  moodBtnSelected: {
    borderColor: '#007B8A',
    backgroundColor: '#E6F4F6',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodName: {
    fontSize: 12,
    color: '#555',
  },
  moodNameSelected: {
    color: '#007B8A',
    fontWeight: '600',
  },

  // Input fields
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
  },

  // Trigger buttons
  triggerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  triggerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
  },
  triggerBtnSelected: {
    backgroundColor: '#007B8A',
    borderColor: '#007B8A',
  },
  triggerText: {
    fontSize: 13,
    color: '#444',
  },
  triggerTextSelected: {
    fontSize: 13,
    color: '#fff',
  },

  // Submit
  button: {
    backgroundColor: '#007B8A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});