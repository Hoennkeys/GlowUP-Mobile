import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '../../components/ui';
import { tokens } from '../../theme/tokens';

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
             <Text style={styles.avatarInitial}>U</Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>Nome do Usuário</Text>
          <Text style={styles.userEmail}>email@exemplo.com</Text>
        </View>

        <View style={styles.actions}>
          <ActionButton
            label="Editar Perfil"
            onPress={() => console.log('Edit Profile')}
            variant="primary"
          />
          <View style={{ height: 16 }} />
          <ActionButton
            label="Sair"
            onPress={() => console.log('Logout')}
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.xl,
    backgroundColor: tokens.colors.bg,
  },
  avatarContainer: {
    marginBottom: tokens.spacing.lg,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    ...tokens.typography.h1,
    color: tokens.colors.muted,
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
  actions: {
    width: '100%',
  },
});
