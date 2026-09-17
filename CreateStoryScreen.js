import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateStoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  
  const [story, setStory] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const emotions = [
    { id: '1', label: 'Happy', icon: '😊' },
    { id: '2', label: 'Sad', icon: '😔' },
    { id: '3', label: 'Stressed', icon: '😰' },
    { id: '4', label: 'Calm', icon: '😌' },
    { id: '5', label: 'Frustrated', icon: '😡' },
  ];

  const departments = [
    'Engineering',
    'Medical',
    'Arts',
    'Commerce',
    'Business',
  ];

  const handleSubmit = () => {
    if (!story.trim() || !selectedEmotion || !selectedDepartment) {
      Alert.alert('Incomplete', 'Please fill in your story, emotion, and department.');
      return;
    }

    Alert.alert(
      'Success',
      'Story submitted for AI moderation.',
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Your Experience</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="What happened today?"
              placeholderTextColor="#A0AEC0"
              multiline
              maxLength={300}
              value={story}
              onChangeText={setStory}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{story.length} / 300</Text>
          </View>

          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <View style={styles.chipsContainer}>
            {emotions.map((emotion) => (
              <TouchableOpacity
                key={emotion.id}
                style={[
                  styles.chip,
                  selectedEmotion === emotion.id && styles.chipSelected
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedEmotion(emotion.id)}
              >
                <Text style={styles.chipIcon}>{emotion.icon}</Text>
                <Text style={[
                  styles.chipText,
                  selectedEmotion === emotion.id && styles.chipTextSelected
                ]}>
                  {emotion.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Department</Text>
          <View style={styles.chipsContainer}>
            {departments.map((dept, index) => (
              <TouchableOpacity
                key={index.toString()}
                style={[
                  styles.chip,
                  selectedDepartment === dept && styles.chipSelected
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedDepartment(dept)}
              >
                <Text style={[
                  styles.chipText,
                  selectedDepartment === dept && styles.chipTextSelected
                ]}>
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
          <TouchableOpacity 
            style={styles.submitButton}
            activeOpacity={0.8}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    height: 150,
    fontSize: 16,
    color: '#2D3748',
    lineHeight: 24,
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#007B8A',
    borderColor: '#007B8A',
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  chipText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#F7FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  submitButton: {
    backgroundColor: '#007B8A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007B8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
