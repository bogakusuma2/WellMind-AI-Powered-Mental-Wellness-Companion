import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CheckInCard = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Daily Check-In</Text>
      <Text style={styles.subtitle}>Take one minute to reflect on today.</Text>
      <TouchableOpacity 
        style={styles.button} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CheckInIntro')}
      >
        <Text style={styles.buttonText}>Start Check-In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007B8A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckInCard;
