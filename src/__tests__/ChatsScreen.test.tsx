import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ChatsScreen } from '../screens/chats/ChatsScreen';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock auth context
jest.mock('../app/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', name: 'Test User' },
  }),
}));

// Mock translation context
jest.mock('../i18n/LanguageContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock database service
jest.mock('../services/chatService', () => ({
  getChats: jest.fn().mockResolvedValue([
    {
      id: 'chat-1',
      userId: 'test-user-id',
      platform: 'whatsapp',
      contactName: 'Ana WhatsApp',
      lastMessage: 'Oi!',
      lastInteraction: new Date().toISOString(),
      unreadCount: 2,
      createdAt: new Date().toISOString(),
    },
  ]),
  subscribeToChats: jest.fn().mockReturnValue(jest.fn()),
}));

describe('ChatsScreen', () => {
  it('renders chat list and title', async () => {
    const { getByText, getByPlaceholderText } = await render(<ChatsScreen />);

    // Wait for the asynchronous fetch to complete
    await waitFor(() => {
      expect(getByText('chats')).toBeTruthy();
      expect(getByPlaceholderText('search_chats')).toBeTruthy();
      expect(getByText('Ana WhatsApp')).toBeTruthy();
      expect(getByText('Oi!')).toBeTruthy();
    });
  });
});
