import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
import { tokens } from '../../theme/tokens';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function ForgotPasswordScreen({ navigation }: Props) {
  const { forgotPassword, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    clearError();
    if (!validateEmail(email)) {
      setEmailError('Informe um email válido.');
      return;
    }
    setEmailError('');
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topRow}>
            <Text style={styles.back}>← Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Recuperar Senha</Text>

          {sent ? (
            <View style={styles.sentContainer}>
              <Text style={styles.sentIcon}>📧</Text>
              <Text style={styles.sentTitle}>Email enviado!</Text>
              <Text style={styles.sentBody}>
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </Text>
              <ActionButton
                label="Voltar ao Login"
                onPress={() => navigation.goBack()}
                variant="secondary"
                style={styles.backBtn}
              />
            </View>
          ) : (
            <>
              <Text style={styles.description}>
                Informe seu email e enviaremos um link para redefinir sua senha.
              </Text>

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

              {submitting ? (
                <ActivityIndicator color={tokens.colors.primary} style={styles.loader} />
              ) : (
                <ActionButton
                  label="Enviar link de recuperação"
                  onPress={handleSubmit}
                  variant="primary"
                  style={styles.cta}
                />
              )}
            </>
          )}
        </View>
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
  container: {
    flex: 1,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
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
    marginBottom: tokens.spacing.sm,
  },
  description: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
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
    marginBottom: tokens.spacing.lg,
  },
  loader: {
    marginVertical: tokens.spacing.sm,
  },
  cta: {
    width: '100%',
  },
  sentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: tokens.spacing.xxl,
  },
  sentIcon: {
    fontSize: 48,
    marginBottom: tokens.spacing.lg,
  },
  sentTitle: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  sentBody: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
  },
  backBtn: {
    width: '100%',
  },
});
