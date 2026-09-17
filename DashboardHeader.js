import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardHeader = ({ userName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good Evening, {userName} 👋</Text>
      <Text style={styles.subtitle}>Hope you're doing well today.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '400',
  },
});

export default DashboardHeader;
