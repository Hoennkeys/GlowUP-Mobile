import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { tokens } from '../../theme/tokens';

export interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  testID?: string;
  style?: ViewStyle;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ uri, name = '', size = 80, testID, style }: AvatarProps) {
  const initials = getInitials(name) || 'U';
  const fontSize = size * 0.38;

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
  initials: {
    color: tokens.colors.primary,
    fontWeight: '700',
  },
});
