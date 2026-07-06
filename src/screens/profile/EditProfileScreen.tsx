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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useAuth } from '../../app/AuthProvider';
import { ActionButton } from '../../components/ui/ActionButton';
import { Avatar } from '../../components/ui/Avatar';
import { FormInput } from '../../components/ui/FormInput';
import { uploadAvatar } from '../../services/profileService';
import { tokens } from '../../theme/tokens';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { user, updateProfile, error, clearError } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(user?.avatarUrl);
  const [nameError, setNameError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    if (!name.trim()) {
      setNameError('O nome não pode estar vazio.');
      return false;
    }
    setNameError('');
    return true;
  }

  function handlePickPhoto() {
    Alert.alert('Foto de perfil', 'Escolha uma opção', [
      {
        text: 'Câmera',
        onPress: () => openCamera(),
      },
      {
        text: 'Galeria',
        onPress: () => openGallery(),
      },
      {
        text: 'Cancelar',
        style: 'cancel',
      },
    ]);
  }

  async function openGallery() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (result.assets?.[0]?.uri) {
      await handleUpload(result.assets[0].uri);
    }
  }

  async function openCamera() {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
    });
    if (result.assets?.[0]?.uri) {
      await handleUpload(result.assets[0].uri);
    }
  }

  async function handleUpload(localUri: string) {
    if (!user) return;
    setUploading(true);
    try {
      const publicUrl = await uploadAvatar(user.id, localUri);
      setAvatarUri(publicUrl);
    } catch {
      Alert.alert('Erro', 'Não foi possível fazer o upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    clearError();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUri,
      });
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

          {/* ── Avatar picker ── */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={handlePickPhoto}
              activeOpacity={0.8}
              disabled={uploading}>
              <Avatar uri={avatarUri} name={name} size={100} />
              {uploading ? (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator color={tokens.colors.bg} />
                </View>
              ) : (
                <View style={styles.avatarBadge}>
                  <Text style={styles.avatarBadgeText}>✎</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Toque para alterar a foto</Text>
          </View>

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

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: tokens.spacing.sm,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.colors.primary,
    borderWidth: 2,
    borderColor: tokens.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeText: {
    color: tokens.colors.bg,
    fontSize: 13,
    lineHeight: 16,
  },
  avatarHint: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
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
