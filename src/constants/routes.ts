export const Routes = {
  // Splash
  Splash: 'Splash',

  // Auth
  Login: 'Login',
  Register: 'Register',
  ForgotPassword: 'ForgotPassword',

  // Main tabs
  Home: 'Home',
  Dashboard: 'Dashboard',
  Campaigns: 'Campaigns',
  Chats: 'Chats',
  Content: 'Content',
  Analytics: 'Analytics',
  Profile: 'Profile',

  // Stack / modal
  CampaignDetails: 'CampaignDetails',
  CreateContent: 'CreateContent',
  Notifications: 'Notifications',
  Settings: 'Settings',
  EditProfile: 'EditProfile',
  ChangePassword: 'ChangePassword',
  ChooseLanguage: 'ChooseLanguage',
  ChatDetails: 'ChatDetails',
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];
