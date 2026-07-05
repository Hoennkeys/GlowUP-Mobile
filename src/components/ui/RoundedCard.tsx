import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { tokens } from '../../theme/tokens';
import type { CampaignStatus } from '../../types';

export interface RoundedCardProps {
  title: string;
  subtitle?: string;
  coverImage?: ImageSourcePropType;
  coverColor?: string;
  status?: CampaignStatus;
  onPress?: () => void;
  testID?: string;
  compact?: boolean;
  style?: ViewStyle;
}

const STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: 'Rascunho',
  open: 'Aberta',
  in_progress: 'Em andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
};

const STATUS_COLORS: Record<CampaignStatus, string> = {
  draft: tokens.colors.muted,
  open: tokens.colors.primary,
  in_progress: tokens.colors.warning,
  completed: tokens.colors.success,
  cancelled: tokens.colors.error,
};

export function RoundedCard({
  title,
  subtitle,
  coverImage,
  coverColor = tokens.colors.primary,
  status,
  onPress,
  testID,
  compact = false,
  style,
}: RoundedCardProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        pressed && styles.pressed,
        style,
      ]}>
      <View style={[styles.cover, compact && styles.coverCompact]}>
        {coverImage ? (
          <Image
            testID={testID ? `${testID}-image` : 'rounded-card-image'}
            source={coverImage}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View
            testID={testID ? `${testID}-placeholder` : 'rounded-card-placeholder'}
            style={[styles.coverPlaceholder, { backgroundColor: coverColor }]}
          />
        )}
        {status ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: STATUS_COLORS[status] },
            ]}>
            <Text style={styles.badgeText}>{STATUS_LABELS[status]}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    shadowColor: tokens.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    flex: 1,
  },
  cardCompact: {
    width: 200,
    flex: 0,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  cover: {
    height: 120,
    position: 'relative',
  },
  coverCompact: {
    height: 100,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: tokens.spacing.sm,
    left: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
  },
  badgeText: {
    ...tokens.typography.caption,
    color: tokens.colors.bg,
    fontWeight: '600',
  },
  content: {
    padding: tokens.spacing.sm,
    gap: tokens.spacing.xs,
  },
  title: {
    ...tokens.typography.h2,
    fontSize: 14,
    color: tokens.colors.text,
  },
  titleCompact: {
    fontSize: 13,
  },
  subtitle: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
  },
});
