import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { RoundedCard } from '../../src/components/ui/RoundedCard';
import { HomeScreen } from '../../src/screens/home/HomeScreen';
import { tokens } from '../../src/theme/tokens';

const meta: Meta = {
  title: 'Home',
};

export default meta;

export const RoundedCardDefault: StoryObj = {
  render: () => (
    <View style={styles.cardContainer}>
      <RoundedCard
        title="Verão Radiante"
        subtitle="Glow Beauty"
        coverColor="#C4B5FD"
        status="open"
        onPress={() => {}}
      />
    </View>
  ),
};

export const HomeScreenDefault: StoryObj = {
  render: () => <HomeScreen />,
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    backgroundColor: tokens.colors.bg,
    width: 180,
  },
});
