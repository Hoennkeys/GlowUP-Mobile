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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function LoginScreen({ navigation }: Props) {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError('Informe um email válido.');
      valid = false;
    } else {
      setEmailError('');
    }
    if (password.length < 6) {
      setPasswordError('A senha deve ter ao menos 6 caracteres.');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  }

  async function handleLogin() {
    clearError();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
    } finally {
      setSubmitting(false);
    }
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
          <View style={styles.header}>
            <Text style={styles.logo}>GlowUP</Text>
            <Text style={styles.tagline}>Sua plataforma de influência</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>Entrar</Text>

            {error ? <Text style={styles.globalError}>{error}</Text> : null}

            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              placeholder="seu@email.com"
              keyboardType="email-address"
              textContentType="emailAddress"
              containerStyle={styles.field}
            />

            <FormInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              placeholder="••••••••"
              secureTextEntry
              textContentType="password"
              containerStyle={styles.field}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.ForgotPassword)}
              style={styles.forgotRow}>
              <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            {submitting ? (
              <ActivityIndicator color={tokens.colors.primary} style={styles.loader} />
            ) : (
              <ActionButton
                label="Entrar"
                onPress={handleLogin}
                variant="primary"
                style={styles.cta}
              />
            )}

            <View style={styles.registerRow}>
              <Text style={styles.registerLabel}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate(Routes.Register)}>
                <Text style={styles.registerLink}>Criar conta</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xxl,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    color: tokens.colors.primary,
    letterSpacing: -1,
  },
  tagline: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    marginTop: tokens.spacing.xs,
  },
  form: {
    width: '100%',
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
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: tokens.spacing.lg,
  },
  forgotText: {
    ...tokens.typography.caption,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  cta: {
    width: '100%',
  },
  loader: {
    marginVertical: tokens.spacing.sm,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: tokens.spacing.lg,
  },
  registerLabel: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  registerLink: {
    ...tokens.typography.body,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
});
