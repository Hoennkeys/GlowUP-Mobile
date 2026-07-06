import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../app/AuthProvider';
import { ActionButton } from '../../components/ui/ActionButton';
import { FormInput } from '../../components/ui/FormInput';
import { Routes } from '../../constants';
import { tokens } from '../../theme/tokens';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function RegisterScreen({ navigation }: Props) {
  const { register, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const next = { name: '', email: '', password: '', confirm: '' };
    let valid = true;

    if (!name.trim()) {
      next.name = 'Informe seu nome.';
      valid = false;
    }
    if (!validateEmail(email)) {
      next.email = 'Informe um email válido.';
      valid = false;
    }
    if (password.length < 6) {
      next.password = 'A senha deve ter ao menos 6 caracteres.';
      valid = false;
    }
    if (password !== confirm) {
      next.confirm = 'As senhas não coincidem.';
      valid = false;
    }
    setErrors(next);
    return valid;
  }

  async function handleRegister() {
    clearError();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, confirmPassword: confirm });
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Conta criada!</Text>
          <Text style={styles.successBody}>
            Verifique seu email para confirmar o cadastro antes de entrar.
          </Text>
          <ActionButton
            label="Ir para o Login"
            onPress={() => navigation.navigate(Routes.Login)}
            variant="primary"
            style={styles.cta}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.back}>← Voltar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Criar Conta</Text>

          {error ? <Text style={styles.globalError}>{error}</Text> : null}

          <FormInput
            label="Nome completo"
            value={name}
            onChangeText={setName}
            error={errors.name}
            placeholder="Ana Silva"
            textContentType="name"
            containerStyle={styles.field}
          />

          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            placeholder="seu@email.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            containerStyle={styles.field}
          />

          <FormInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
            containerStyle={styles.field}
          />

          <FormInput
            label="Confirmar senha"
            value={confirm}
            onChangeText={setConfirm}
            error={errors.confirm}
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
            containerStyle={styles.field}
          />

          {submitting ? (
            <ActivityIndicator color={tokens.colors.primary} style={styles.loader} />
          ) : (
            <ActionButton
              label="Criar conta"
              onPress={handleRegister}
              variant="primary"
              style={styles.cta}
            />
          )}

          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(Routes.Login)}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
  },
  topRow: {
    marginBottom: tokens.spacing.lg,
  },
  back: {
    ...tokens.typography.body,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  title: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.lg,
  },
  globalError: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
    backgroundColor: '#FEE2E2',
    padding: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
    marginBottom: tokens.spacing.md,
  },
  field: {
    marginBottom: tokens.spacing.md,
  },
  loader: {
    marginVertical: tokens.spacing.sm,
  },
  cta: {
    width: '100%',
    marginTop: tokens.spacing.sm,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: tokens.spacing.lg,
  },
  loginLabel: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  loginLink: {
    ...tokens.typography.body,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.xl,
    backgroundColor: tokens.colors.bg,
  },
  successIcon: {
    fontSize: 56,
    color: tokens.colors.success,
    marginBottom: tokens.spacing.lg,
  },
  successTitle: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  successBody: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
  },
});
