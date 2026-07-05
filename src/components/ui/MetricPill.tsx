import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { tokens } from '../../theme/tokens';

export interface MetricPillProps {
  label: string;
  value: string;
  style?: ViewStyle;
}

export function MetricPill({ label, value, style }: MetricPillProps) {
  return (
    <View style={[styles.pill, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.sm,
    alignItems: 'center',
    gap: tokens.spacing.xs,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  label: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    ...tokens.typography.h2,
    color: tokens.colors.primary,
  },
});
