import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../app/AuthProvider';
import { ActionButton } from '../../components/ui/ActionButton';
import { FormInput } from '../../components/ui/FormInput';
import { changePassword } from '../../services/authService';
import { tokens } from '../../theme/tokens';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ChangePassword'>;

export function ChangePasswordScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    let isValid = true;

    if (!currentPassword) {
      setCurrentPasswordError('A senha atual é obrigatória.');
      isValid = false;
    } else {
      setCurrentPasswordError('');
    }

    if (!newPassword) {
      setNewPasswordError('A nova senha é obrigatória.');
      isValid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError('A nova senha deve ter ao menos 6 caracteres.');
      isValid = false;
    } else {
      setNewPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('A confirmação da nova senha é obrigatória.');
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  }

  async function handleSave() {
    if (!validate()) return;
    if (!user?.email) return;

    setSubmitting(true);
    try {
      await changePassword(user.email, currentPassword, newPassword);
      Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro', e.message || 'Não foi possível alterar a senha. Tente novamente.');
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

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topRow}>
            <Text style={styles.back}>← Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Alterar Senha</Text>

          <FormInput
            label="Senha atual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            error={currentPasswordError}
            placeholder="Sua senha atual"
            secureTextEntry
            containerStyle={styles.field}
          />

          <FormInput
            label="Nova senha"
            value={newPassword}
            onChangeText={setNewPassword}
            error={newPasswordError}
            placeholder="Sua nova senha"
            secureTextEntry
            containerStyle={styles.field}
          />

          <FormInput
            label="Confirmar nova senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError}
            placeholder="Confirme a nova senha"
            secureTextEntry
            containerStyle={styles.field}
          />

          {submitting ? (
            <ActivityIndicator color={tokens.colors.primary} style={styles.loader} />
          ) : (
            <>
              <ActionButton
                label="Alterar senha"
                onPress={handleSave}
                variant="primary"
                style={styles.cta}
              />
              <ActionButton
                label="Cancelar"
                onPress={() => navigation.goBack()}
                variant="secondary"
                style={styles.cancelBtn}
              />
            </>
          )}
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
  field: {
    marginBottom: tokens.spacing.md,
  },
  loader: {
    marginVertical: tokens.spacing.sm,
  },
  cta: {
    width: '100%',
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  cancelBtn: {
    width: '100%',
  },
});
