import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation, LANGUAGES, LanguageCode } from '../../i18n/LanguageContext';
import { tokens } from '../../theme/tokens';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ChooseLanguage'>;

export function ChooseLanguageScreen({ navigation }: Props) {
  const { language, changeLanguage, t } = useTranslation();

  async function handleSelectLanguage(code: LanguageCode) {
    await changeLanguage(code);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topRow}>
          <Text style={styles.back}>← {t('back')}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{t('choose_language')}</Text>

        <FlatList
          data={LANGUAGES}
          keyExtractor={item => item.code}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isSelected = item.code === language;
            return (
              <TouchableOpacity
                style={[styles.item, isSelected && styles.itemSelected]}
                onPress={() => handleSelectLanguage(item.code)}
                activeOpacity={0.7}>
                <Text style={styles.flag}>{item.flag}</Text>
                <Text style={[styles.label, isSelected && styles.labelSelected]}>
                  {item.label}
                </Text>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
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
    marginBottom: tokens.spacing.lg,
  },
  list: {
    gap: tokens.spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  itemSelected: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.primary + '08',
  },
  flag: {
    fontSize: 24,
    marginRight: tokens.spacing.md,
  },
  label: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
    fontWeight: '500',
  },
  labelSelected: {
    color: tokens.colors.primary,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 18,
    color: tokens.colors.primary,
    fontWeight: '700',
  },
});
