import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../app/AuthProvider';
import { Avatar } from '../../components/ui';
import { Routes } from '../../constants';
import { useTranslation } from '../../i18n/LanguageContext';
import { getChats, subscribeToChats } from '../../services/chatService';
import { populateMockChats, simulateIncomingMessage } from '../../services/mockChatData';
import { tokens } from '../../theme/tokens';
import type { Chat, PlatformType } from '../../types';

function PlatformBadge({ platform }: { platform: PlatformType }) {
  let bgColor = '#6B7280';
  let label = '';
  switch (platform) {
    case 'whatsapp':
      bgColor = '#25D366';
      label = 'WA';
      break;
    case 'instagram':
      bgColor = '#E1306C';
      label = 'IG';
      break;
    case 'telegram':
      bgColor = '#0088CC';
      label = 'TG';
      break;
    case 'discord':
      bgColor = '#5865F2';
      label = 'DC';
      break;
  }

  return (
    <View style={[styles.platformBadge, { backgroundColor: bgColor }]}>
      <Text style={styles.platformBadgeText}>{label}</Text>
    </View>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }
  
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export function ChatsScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchChatsList = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getChats(userId);
      setChats(data);
    } catch (e) {
      console.error('Error fetching chats:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    
    fetchChatsList();

    const unsubscribe = subscribeToChats(userId, () => {
      fetchChatsList();
    });

    return () => {
      unsubscribe();
    };
  }, [userId, fetchChatsList]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChatsList();
  };

  const handlePopulateMock = async () => {
    if (!userId || simulating) return;
    setSimulating(true);
    try {
      await populateMockChats(userId);
      await fetchChatsList();
    } catch (err) {
      console.error('Error populating mock data:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleSimulateIncoming = async (platform: 'whatsapp' | 'instagram' | 'telegram' | 'discord') => {
    if (!userId || simulating) return;
    setSimulating(true);
    try {
      await simulateIncomingMessage(userId, platform);
      await fetchChatsList();
    } catch (err) {
      console.error('Error simulating incoming message:', err);
    } finally {
      setSimulating(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.contactName.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: Chat }) => {
    const timeFormatted = formatTime(item.lastInteraction);

    return (
      <Pressable
        testID={`chat-item-${item.id}`}
        onPress={() => {
          navigation.navigate(Routes.ChatDetails, {
            chatId: item.id,
            contactName: item.contactName,
            platform: item.platform,
          });
        }}
        style={({ pressed }) => [
          styles.chatCard,
          pressed && styles.chatCardPressed,
        ]}
      >
        <View style={styles.avatarContainer}>
          <Avatar uri={item.contactAvatar} name={item.contactName} size={50} />
          <PlatformBadge platform={item.platform} />
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeaderRow}>
            <Text style={styles.contactName} numberOfLines={1}>
              {item.contactName}
            </Text>
            <Text style={styles.timeText}>{timeFormatted}</Text>
          </View>

          <View style={styles.chatBodyRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage || t('no_messages')}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView testID="chats-screen" style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('chats')}</Text>
        <Pressable
          testID="toggle-simulation-button"
          onPress={() => setSimulationMode(!simulationMode)}
          style={styles.simulationToggle}
        >
          <Text style={styles.simulationToggleText}>🛠️ {simulationMode ? 'Fechar Dev' : 'Dev Mode'}</Text>
        </Pressable>
      </View>

      {simulationMode && (
        <View style={styles.simulationPanel}>
          <Text style={styles.simulationTitle}>Modo de Simulação (Dev):</Text>
          <View style={styles.simulationButtonsRow}>
            <Pressable
              disabled={simulating}
              onPress={handlePopulateMock}
              style={[styles.simButton, styles.simButtonPopulate]}
            >
              <Text style={styles.simButtonText}>Popular BD</Text>
            </Pressable>
            
            <Pressable
              disabled={simulating}
              onPress={() => handleSimulateIncoming('whatsapp')}
              style={[styles.simButton, { backgroundColor: '#25D366' }]}
            >
              <Text style={styles.simButtonText}>+WA</Text>
            </Pressable>
            
            <Pressable
              disabled={simulating}
              onPress={() => handleSimulateIncoming('instagram')}
              style={[styles.simButton, { backgroundColor: '#E1306C' }]}
            >
              <Text style={styles.simButtonText}>+IG</Text>
            </Pressable>

            <Pressable
              disabled={simulating}
              onPress={() => handleSimulateIncoming('telegram')}
              style={[styles.simButton, { backgroundColor: '#0088CC' }]}
            >
              <Text style={styles.simButtonText}>+TG</Text>
            </Pressable>

            <Pressable
              disabled={simulating}
              onPress={() => handleSimulateIncoming('discord')}
              style={[styles.simButton, { backgroundColor: '#5865F2' }]}
            >
              <Text style={styles.simButtonText}>+DC</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('search_chats')}
          placeholderTextColor={tokens.colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[tokens.colors.primary]}
              tintColor={tokens.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('no_messages')}</Text>
            </View>
          }
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.sm,
  },
  title: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
  },
  simulationToggle: {
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.border,
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
  },
  simulationToggleText: {
    fontSize: 12,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  simulationPanel: {
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.border,
    borderWidth: 1,
    marginHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    padding: tokens.spacing.sm,
    borderRadius: tokens.radius.md,
  },
  simulationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  simulationButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.xs,
  },
  simButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  simButtonPopulate: {
    backgroundColor: tokens.colors.primary,
  },
  simButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  searchInput: {
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.border,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    color: tokens.colors.text,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  chatCardPressed: {
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: tokens.spacing.md,
  },
  platformBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: tokens.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  contactName: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    fontSize: 16,
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  timeText: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
  },
  chatBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    fontSize: 14,
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  unreadBadge: {
    backgroundColor: tokens.colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: tokens.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
});
