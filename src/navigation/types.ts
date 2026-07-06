import type { RouteName } from '../constants';
import type { PlatformType } from '../types';

export type RootStackParamList = {
  [K in RouteName]: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type ChatsStackParamList = {
  Chats: undefined;
  ChatDetails: { chatId: string; contactName: string; platform: PlatformType };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  ChooseLanguage: undefined;
};
