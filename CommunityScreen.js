import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CommunityScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const dummyStories = [
    {
      id: '1',
      author: 'Anonymous',
      department: 'Engineering Student',
      time: '2 hours ago',
      emotion: 'Stressed',
      emotionIcon: '😰',
      story: 'I failed my internal exam today.\nI feel like everyone is moving ahead except me.',
      likes: 847,
      comments: 24,
    },
    {
      id: '2',
      author: 'Anonymous',
      department: 'Medical Student',
      time: '4 hours ago',
      emotion: 'Exhausted',
      emotionIcon: '😩',
      story: 'Another 14-hour shift at the hospital. I barely have time to sleep, let alone study for the boards. Is it worth it?',
      likes: 1023,
      comments: 56,
    },
    {
      id: '3',
      author: 'Anonymous',
      department: 'Commerce Student',
      time: '6 hours ago',
      emotion: 'Happy',
      emotionIcon: '😊',
      story: 'Just landed an internship at my dream company! Hard work finally pays off. Keep pushing everyone!',
      likes: 1542,
      comments: 108,
    },
    {
      id: '4',
      author: 'Anonymous',
      department: 'Arts Student',
      time: '1 day ago',
      emotion: 'Anxious',
      emotionIcon: '😨',
      story: 'My final portfolio review is tomorrow. Imposter syndrome is hitting really hard right now. What if they hate my work?',
      likes: 432,
      comments: 42,
    },
    {
      id: '5',
      author: 'Anonymous',
      department: 'Business Student',
      time: '1 day ago',
      emotion: 'Homesick',
      emotionIcon: '🥺',
      story: "It's my first birthday away from home. My friends here are great, but I just really miss my mom's cooking.",
      likes: 920,
      comments: 73,
    },
    {
      id: '6',
      author: 'Anonymous',
      department: 'Computer Science Student',
      time: '2 days ago',
      emotion: 'Frustrated',
      emotionIcon: '😡',
      story: 'I have been stuck on the same bug for 3 days straight. The deadline is tonight and my group members are not helping at all.',
      likes: 671,
      comments: 19,
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.department}>{item.department}</Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      
      <View style={styles.emotionBadge}>
        <Text style={styles.emotionIcon}>{item.emotionIcon}</Text>
        <Text style={styles.emotionText}>{item.emotion}</Text>
      </View>
      
      <Text style={styles.storyText}>{item.story}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.footerAction}>
          <Ionicons name="heart" size={20} color="#E53E3E" />
          <Text style={styles.footerText}>{item.likes} students relate</Text>
        </View>
        <View style={styles.footerAction}>
          <Ionicons name="chatbubble-outline" size={20} color="#718096" />
          <Text style={styles.footerText}>{item.comments} supportive responses</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>
          You're not alone.{'\n'}See how other students are feeling today.
        </Text>
      </View>

      <FlatList
        data={dummyStories}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={[styles.fab, { bottom: 20 }]} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CreateStoryScreen')}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.fabText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#007B8A',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for FAB
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 2,
  },
  department: {
    fontSize: 13,
    color: '#718096',
  },
  timeText: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  emotionIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  emotionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3748',
  },
  storyText: {
    fontSize: 15,
    color: '#2D3748',
    lineHeight: 22,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#718096',
    marginLeft: 6,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#007B8A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#007B8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
});
