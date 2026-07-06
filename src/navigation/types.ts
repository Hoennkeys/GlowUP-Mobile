import type { RouteName } from '../constants';

export type RootStackParamList = {
  [K in RouteName]: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  ChooseLanguage: undefined;
};
