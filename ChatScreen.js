import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { startSession, sendMessage } from '../services/api';

export default function ChatScreen() {
    console.log("🚀 NEW CHAT SCREEN LOADED");
  const [sessionId,  setSessionId ] = useState(null);
  const [messages,   setMessages  ] = useState([]);
  const [inputText,  setInputText ] = useState('');
  const [loading,    setLoading   ] = useState(false);
  const [starting,   setStarting  ] = useState(true);
  const flatListRef = useRef(null);

  // Start a session when screen loads
  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    try {
      const res = await startSession();
      setSessionId(res.data.session.session_id);

      // Add a welcome message from AI
      setMessages([{
        message_id:   0,
        sender:       'AI',
        message_text: "Hi! I'm WellMind, your mental health companion. How are you feeling today? 😊",
        sent_at:      new Date().toISOString(),
      }]);
    } catch (err) {
      Alert.alert(
        'Connection Error',
        'Could not start a chat session. Please check your connection.'
      );
    } finally {
      setStarting(false);
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !sessionId || loading) return;

    // Add user message to UI immediately
    const tempUserMsg = {
      message_id:   Date.now(),
      sender:       'User',
      message_text: text,
      sent_at:      new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setInputText('');
    setLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const res = await sendMessage({
        session_id:   sessionId,
        message_text: text,
      });

      // Add AI response to UI
      setMessages(prev => [...prev, res.data.aiMessage]);

      // If distress detected — show gentle alert
      if (res.data.isDistressed) {
        setTimeout(() => {
          Alert.alert(
            'We noticed something',
            "It sounds like you might be going through a tough time. " +
            "Please consider reaching out to a trusted person or " +
            "mental health professional. You're not alone. 💙",
            [{ text: 'OK' }]
          );
        }, 500);
      }
    } catch (err) {
      // Add error message to chat
      setMessages(prev => [...prev, {
        message_id:   Date.now() + 1,
        sender:       'AI',
        message_text: "I'm here for you. Could you tell me more about how you're feeling?",
        sent_at:      new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'User';
    return (
      <View style={[
        styles.msgRow,
        isUser ? styles.msgRowUser : styles.msgRowAI,
      ]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>W</Text>
          </View>
        )}
        <View style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAI,
        ]}>
          <Text style={[
            styles.bubbleText,
            isUser ? styles.bubbleTextUser : styles.bubbleTextAI,
          ]}>
            {item.message_text}
          </Text>
        </View>
      </View>
    );
  };

  if (starting) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007B8A" />
        <Text style={styles.startingText}>
          Starting your session...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>W</Text>
        </View>
        <View>
          <Text style={styles.headerName}>WellMind</Text>
          <Text style={styles.headerStatus}>AI Companion • Online</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.message_id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Typing indicator */}
      {loading && (
        <View style={styles.typingRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>W</Text>
          </View>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color="#007B8A" />
            <Text style={styles.typingText}>WellMind is typing...</Text>
          </View>
        </View>
      )}

      {/* Input area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!inputText.trim() || loading) && styles.sendBtnDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || loading}
        >
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  startingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 15,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007B8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerStatus: {
    fontSize: 12,
    color: '#007B8A',
  },

  // Messages
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowAI: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007B8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: '#007B8A',
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: '#fff',
  },
  bubbleTextAI: {
    color: '#1a1a1a',
  },

  // Typing indicator
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  typingText: {
    color: '#999',
    fontSize: 13,
  },

  // Input area
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    backgroundColor: '#F8F9FA',
  },
  sendBtn: {
    backgroundColor: '#007B8A',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendBtnDisabled: {
    backgroundColor: '#ccc',
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});