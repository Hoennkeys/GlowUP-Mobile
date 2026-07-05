import React from 'react';
import { render } from '@testing-library/react-native';
import { RoundedCard } from '../components/ui/RoundedCard';

describe('RoundedCard', () => {
  it('renders title', async () => {
    const { getByText } = await render(
      <RoundedCard
        title="Verão Radiante"
        subtitle="Glow Beauty"
        coverColor="#C4B5FD"
        status="open"
        testID="test-card"
      />,
    );

    expect(getByText('Verão Radiante')).toBeTruthy();
    expect(getByText('Glow Beauty')).toBeTruthy();
  });

  it('renders cover placeholder when no image provided', async () => {
    const { getByTestId } = await render(
      <RoundedCard
        title="Campanha Teste"
        coverColor="#C4B5FD"
        testID="test-card"
      />,
    );

    expect(getByTestId('test-card-placeholder')).toBeTruthy();
  });

  it('renders cover image when source provided', async () => {
    const { getByTestId } = await render(
      <RoundedCard
        title="Campanha Teste"
        coverImage={{ uri: 'https://example.com/image.jpg' }}
        testID="test-card"
      />,
    );

    expect(getByTestId('test-card-image')).toBeTruthy();
  });
});
