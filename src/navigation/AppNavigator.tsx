import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Routes } from '../constants';
import { HomeScreen, DashboardScreen } from '../screens';
import { tokens } from '../theme/tokens';

export type TabParamList = {
  [Routes.Home]: undefined;
  [Routes.Dashboard]: undefined;
  [Routes.Campaigns]: undefined;
  [Routes.Profile]: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function StubScreen({ title }: { title: string }) {
  return (
    <View style={styles.stub}>
      <Text style={styles.stubText}>{title}</Text>
    </View>
  );
}

const CampaignsStub = () => <StubScreen title="Campanhas" />;
const ProfileStub = () => <StubScreen title="Perfil" />;

export function AppNavigator() {
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
        component={ProfileStub}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}


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
});
