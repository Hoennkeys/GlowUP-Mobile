import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../app/AuthProvider';
import { Routes } from '../constants';
import { HomeScreen, DashboardScreen } from '../screens';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { tokens } from '../theme/tokens';
import type { AuthStackParamList, ProfileStackParamList } from './types';

// ─── Navigators ───────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// ─── Stubs ────────────────────────────────────────────────────────────────────

function StubScreen({ title }: { title: string }) {
  return (
    <View style={styles.stub}>
      <Text style={styles.stubText}>{title}</Text>
    </View>
  );
}

const CampaignsStub = () => <StubScreen title="Campanhas" />;

// ─── Auth Stack ───────────────────────────────────────────────────────────────

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name={Routes.Login} component={LoginScreen} />
      <AuthStack.Screen name={Routes.Register} component={RegisterScreen} />
      <AuthStack.Screen name={Routes.ForgotPassword} component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

// ─── Profile Stack ────────────────────────────────────────────────────────────

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name={Routes.Profile} component={ProfileScreen} />
      <ProfileStack.Screen name={Routes.EditProfile} component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
}

// ─── Main Tabs ────────────────────────────────────────────────────────────────

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.muted,
        tabBarStyle: {
          borderTopColor: tokens.colors.border,
          backgroundColor: tokens.colors.bg,
          paddingTop: 4,
        },
      }}>
      <Tab.Screen
        name={Routes.Home}
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name={Routes.Dashboard}
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name={Routes.Campaigns}
        component={CampaignsStub}
        options={{ tabBarLabel: 'Campanhas' }}
      />
      <Tab.Screen
        name={Routes.Profile}
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ───────────────────────────────────────────────────────────

export function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={tokens.colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <MainTabNavigator /> : <AuthStackNavigator />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  stub: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.bg,
  },
  stubText: {
    ...tokens.typography.h2,
    color: tokens.colors.muted,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.bg,
  },
});
