import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReflectionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');

  const handleSave = () => {
    Alert.alert(
      'Success',
      'Reflection saved successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Main',
                  state: {
                    routes: [{ name: 'Home' }],
                  },
                },
              ],
            });
          }
        }
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
          <Text style={styles.headerTitle}>Evening Reflection</Text>
          <Text style={styles.headerSubtitle}>Take one minute to reflect on today.</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.questionCard}>
            <Text style={styles.questionContext}>You mentioned feeling calmer today.</Text>
            <Text style={styles.questionTitle}>What do you think contributed most to that?</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your thoughts here..."
              placeholderTextColor="#A0AEC0"
              multiline
              value={answer1}
              onChangeText={setAnswer1}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.questionContext}>Looking back,</Text>
            <Text style={styles.questionTitle}>what challenged you the most today?</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your thoughts here..."
              placeholderTextColor="#A0AEC0"
              multiline
              value={answer2}
              onChangeText={setAnswer2}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.questionContext}>Thinking ahead,</Text>
            <Text style={styles.questionTitle}>What's one thing you'd like to do differently tomorrow?</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your thoughts here..."
              placeholderTextColor="#A0AEC0"
              multiline
              value={answer3}
              onChangeText={setAnswer3}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save Reflection</Text>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#007B8A',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  questionContext: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 6,
    fontWeight: '500',
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 16,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    fontSize: 15,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#F7FAFC',
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  button: {
    backgroundColor: '#007B8A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007B8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
