import React, { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { tokens } from '../../theme/tokens';

export interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(
  ({ label, error, containerStyle, style, ...rest }, ref) => {
    const hasError = !!error;

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <TextInput
          ref={ref}
          style={[styles.input, hasError && styles.inputError, style]}
          placeholderTextColor={tokens.colors.muted}
          autoCapitalize="none"
          {...rest}
        />
        {hasError ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  },
);

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
    marginBottom: tokens.spacing.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  inputError: {
    borderColor: tokens.colors.error,
  },
  error: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
    marginTop: tokens.spacing.xs,
  },
});
