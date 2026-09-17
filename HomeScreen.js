import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DashboardHeader from '../components/DashboardHeader';
import CheckInCard from '../components/CheckInCard';
import QuickActionCard from '../components/QuickActionCard';
import AIInsightCard from '../components/AIInsightCard';
import RecentCheckInCard from '../components/RecentCheckInCard';
import ProgressCard from '../components/ProgressCard';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFC" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <DashboardHeader userName="Shreyas" />
        <AIInsightCard />
        <RecentCheckInCard />
        <ProgressCard />
        <CheckInCard />
        <QuickActionCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    paddingBottom: 80,
  },
});