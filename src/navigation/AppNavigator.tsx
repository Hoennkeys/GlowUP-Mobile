import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Routes } from '../constants';
import { HomeScreen, DashboardScreen } from '../screens';
import { tokens } from '../theme/tokens';

const Tab = createBottomTabNavigator();

function StubScreen({ title }: { title: string }) {
  return (
    <View style={styles.stub}>
      <Text style={styles.stubText}>{title}</Text>
    </View>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.muted,
        tabBarStyle: {
          borderTopColor: tokens.colors.border,
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
        children={() => <StubScreen title="Campanhas" />}
        options={{ tabBarLabel: 'Campanhas' }}
      />
      <Tab.Screen
        name={Routes.Profile}
        children={() => <StubScreen title="Perfil" />}
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
