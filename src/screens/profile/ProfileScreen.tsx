import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../app/AuthProvider';
import { ActionButton } from '../../components/ui/ActionButton';
import { Avatar } from '../../components/ui/Avatar';
import { Routes } from '../../constants';
import { tokens } from '../../theme/tokens';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={tokens.colors.primary} />
      </View>
    );
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // error is surfaced via AuthContext
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <Avatar uri={user?.avatarUrl} name={user?.name} size={120} />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name ?? '—'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? '—'}</Text>
          {user?.bio ? <Text style={styles.userBio}>{user.bio}</Text> : null}
        </View>

        <View style={styles.actions}>
          <ActionButton
            label="Editar Perfil"
            onPress={() => navigation.navigate(Routes.EditProfile)}
            variant="primary"
          />
          <View style={styles.divider} />
          <ActionButton
            label="Sair"
            onPress={handleLogout}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.bg,
  },
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    backgroundColor: tokens.colors.bg,
  },
  headerTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xxl,
  },
  avatarContainer: {
    marginBottom: tokens.spacing.lg,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xxl,
  },
  userName: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  userEmail: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  userBio: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginTop: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
  },
  actions: {
    width: '100%',
  },
  divider: {
    height: tokens.spacing.md,
  },
});
