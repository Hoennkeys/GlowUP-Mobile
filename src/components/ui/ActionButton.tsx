import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { tokens } from '../../theme/tokens';

export interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export function ActionButton({
  label,
  icon,
  onPress,
  variant = 'primary',
  style,
}: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        style,
      ]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.sm + 2,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    gap: tokens.spacing.sm,
  },
  primary: {
    backgroundColor: tokens.colors.primary,
  },
  secondary: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...tokens.typography.body,
    fontWeight: '600',
  },
  labelPrimary: {
    color: tokens.colors.bg,
  },
  labelSecondary: {
    color: tokens.colors.primary,
  },
});
