import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../app/AuthProvider';
import { Avatar } from '../../components/ui';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  getMessages,
  sendMessage,
  markChatAsRead,
  subscribeToMessages,
} from '../../services/chatService';
import { tokens } from '../../theme/tokens';
import type { Message, PlatformType } from '../../types';

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function StatusIcon({ status, isFromMe }: { status: 'sent' | 'delivered' | 'read'; isFromMe: boolean }) {
  if (!isFromMe) return null;
  
  let color = 'rgba(255, 255, 255, 0.6)';
  let checkmarks = '✓';
  
  if (status === 'delivered') {
    checkmarks = '✓✓';
  } else if (status === 'read') {
    checkmarks = '✓✓';
    color = '#60A5FA'; // Light blue for read receipts inside purple bubble
  }
  
  return <Text style={[styles.statusIcon, { color }]}>{checkmarks}</Text>;
}

export function ChatDetailsScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const flatListRef = useRef<FlatList>(null);

  const { chatId, contactName, platform } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const userId = user?.id;

  // 1. Initial Load & Read mark
  useEffect(() => {
    async function initChat() {
      try {
        const history = await getMessages(chatId);
        setMessages(history);
        await markChatAsRead(chatId);
      } catch (e) {
        console.error('Error initializing chat details:', e);
      } finally {
        setLoading(false);
      }
    }

    initChat();
  }, [chatId]);

  // 2. Realtime message subscription
  useEffect(() => {
    const unsubscribe = subscribeToMessages(
      chatId,
      async (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });

        if (!newMsg.isFromMe) {
          await markChatAsRead(chatId);
        }
      },
      (updatedMsg) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg))
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  const scrollToBottom = (animated = true) => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated });
      }, 100);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || sending || !userId) return;

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        chatId,
        senderId: userId,
        text: textToSend,
        isFromMe: true,
        createdAt: new Date().toISOString(),
        status: 'sent',
      };
      
      setMessages((prev) => [...prev, optimisticMessage]);
      scrollToBottom(true);

      const actualMessage = await sendMessage(chatId, userId, textToSend);

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? actualMessage : m))
      );
    } catch (e) {
      console.error('Error sending message:', e);
      setInputText(textToSend);
    } finally {
      setSending(false);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMe = item.isFromMe;
    const timeFormatted = formatMessageTime(item.createdAt);

    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.messageRowMe : styles.messageRowOther,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
          ]}
        >
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {item.text}
          </Text>
          <View style={styles.messageMeta}>
            <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextOther]}>
              {timeFormatted}
            </Text>
            <StatusIcon status={item.status} isFromMe={isMe} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView testID="chat-details-screen" style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          testID="chat-back-button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← {t('back')}</Text>
        </Pressable>

        <View style={styles.contactDetails}>
          <Avatar uri={undefined} name={contactName} size={36} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.contactName} numberOfLines={1}>
              {contactName}
            </Text>
            <Text style={styles.platformSub}>{platform.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Message List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollToBottom(true)}
          onLayout={() => scrollToBottom(false)}
        />
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={t('type_message')}
            placeholderTextColor={tokens.colors.muted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <Pressable
            testID="message-send-button"
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            style={({ pressed }) => [
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
              pressed && styles.sendButtonPressed,
            ]}
          >
            <Text style={styles.sendButtonText}>{t('send_message')}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    backgroundColor: tokens.colors.bg,
  },
  backButton: {
    marginRight: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
  },
  backButtonText: {
    color: tokens.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  contactDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: tokens.spacing.sm,
    flex: 1,
  },
  contactName: {
    ...tokens.typography.h2,
    fontSize: 16,
    color: tokens.colors.text,
  },
  platformSub: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.colors.muted,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.sm,
    width: '100%',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  messageBubbleMe: {
    backgroundColor: tokens.colors.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...tokens.typography.body,
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: tokens.colors.text,
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timeText: {
    fontSize: 10,
  },
  timeTextMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeTextOther: {
    color: tokens.colors.muted,
  },
  statusIcon: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.bg,
  },
  textInput: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.border,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    marginRight: tokens.spacing.sm,
    color: tokens.colors.text,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.spacing.sm + 2,
    paddingHorizontal: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: tokens.colors.muted,
    opacity: 0.5,
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
