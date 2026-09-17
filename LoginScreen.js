import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/api';
import api from '../services/api';

// ─── Debug: Health Check ────────────────────────────────────────────────────
const testBackend = async () => {
  try {
    await api.get('/health');
    console.log('Backend Connected');
  } catch (err) {
    console.log('Backend Not Reachable');
  }
};

export default function LoginScreen({ navigation }) {
  const [email,    setEmail   ] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading ] = useState(false);

  // ─── Debug: Run health check on mount ────────────────────────────────────
  useEffect(() => {
    testBackend();
  }, []);

  const handleLogin = async () => {
    // Validate fields
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      // ─── Debug ──────────────────────────────────────────────────────────
      console.log('========== LOGIN START ==========');
      console.log('Email:', email);

      // Call the backend login API
      const response = await loginUser({ email, password });

      // ─── Debug ──────────────────────────────────────────────────────────
      console.log('========== LOGIN SUCCESS ==========');
      console.log(response.data);

      // Save the token to phone storage
      await AsyncStorage.setItem('wellmind_token',
        response.data.token);
      await AsyncStorage.setItem('wellmind_user',
        JSON.stringify(response.data.user));

      // Go to the main app
      navigation.replace('Main');

    } catch (error) {
      // ─── Debug ────────────────────────────────────────────────────────────
      console.log('========== LOGIN ERROR ==========');
      console.log('Message:', error.message);
      console.log('Status:', error.response?.status);
      console.log('Response:', error.response?.data);
      console.log('Request:', error.request);
      console.log(error);

      Alert.alert(
        'Login Error',
        JSON.stringify(error.response?.data || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>WellMind</Text>
      <Text style={styles.subtitle}>Your Mental Health Companion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Login</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.link}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007B8A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007B8A',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    color: '#007B8A',
    fontSize: 14,
  },
});