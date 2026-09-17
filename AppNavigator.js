import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen    from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen     from '../screens/HomeScreen';
import MoodLogScreen  from '../screens/MoodLogScreen';
import ChatScreen     from '../screens/ChatScreen';
import AlertsScreen   from '../screens/AlertsScreen';
import CommunityScreen from '../screens/CommunityScreen';
import CreateStoryScreen from '../screens/CreateStoryScreen';
import ProfileScreen  from '../screens/ProfileScreen';
import CheckInIntroScreen from '../screens/CheckInIntroScreen';
import CheckInMethodScreen from '../screens/CheckInMethodScreen';
import CameraCheckInScreen from '../screens/CameraCheckInScreen';
import VoiceRecordingScreen from '../screens/VoiceRecordingScreen';
import AnalyzingScreen from '../screens/AnalyzingScreen';
import CheckInResultScreen from '../screens/CheckInResultScreen';
import PreviewScreen from '../screens/PreviewScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#007B8A',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarItemStyle: {
          paddingVertical: 10,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 80 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 5,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarLabel: 'Chat' }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{ tabBarLabel: 'Alerts' }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ tabBarLabel: 'Community' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login"    component={LoginScreen}    />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main"     component={MainTabs}       />
        <Stack.Screen name="MoodLog"  component={MoodLogScreen}  />
        <Stack.Screen name="CheckInIntro" component={CheckInIntroScreen} />
        <Stack.Screen name="CheckInMethod" component={CheckInMethodScreen} />
        <Stack.Screen name="CameraCheckIn" component={CameraCheckInScreen} />
        <Stack.Screen name="VoiceRecording" component={VoiceRecordingScreen} />
        <Stack.Screen name="Analyzing" component={AnalyzingScreen} />
        <Stack.Screen name="CheckInResult" component={CheckInResultScreen} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="CreateStoryScreen" component={CreateStoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}