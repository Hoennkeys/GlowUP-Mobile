import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { tokens } from '../../theme/tokens';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { user, updateProfile, error, clearError } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [nameError, setNameError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    if (!name.trim()) {
      setNameError('O nome não pode estar vazio.');
      return false;
    }
    setNameError('');
    return true;
  }

  async function handleSave() {
    clearError();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() });
      navigation.goBack();
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

          <Text style={styles.title}>Editar Perfil</Text>

          {error ? <Text style={styles.globalError}>{error}</Text> : null}

          <FormInput
            label="Nome completo"
            value={name}
            onChangeText={setName}
            error={nameError}
            placeholder="Seu nome"
            textContentType="name"
            containerStyle={styles.field}
          />

          <FormInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Conte um pouco sobre você..."
            multiline
            numberOfLines={4}
            containerStyle={styles.field}
            style={styles.bioInput}
          />

          {submitting ? (
            <ActivityIndicator color={tokens.colors.primary} style={styles.loader} />
          ) : (
            <>
              <ActionButton
                label="Salvar alterações"
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
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: tokens.spacing.sm,
  },
  loader: {
    marginVertical: tokens.spacing.sm,
  },
  cta: {
    width: '100%',
    marginBottom: tokens.spacing.sm,
  },
  cancelBtn: {
    width: '100%',
  },
});
