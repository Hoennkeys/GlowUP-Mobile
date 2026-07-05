import React, { useEffect, useRef } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MetricPill, RoundedCard } from '../../components/ui';
import { tokens } from '../../theme/tokens';
import type { Campaign } from '../../types';
import {
  mockCampaigns,
  mockFeaturedCampaigns,
  mockMetrics,
  mockUser,
  PLACEHOLDER_COLORS,
} from './mocks';

function AnimatedCard({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={[styles.animatedCard, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

function getCoverColor(campaign: Campaign): string {
  return PLACEHOLDER_COLORS[campaign.coverImageUrl ?? 'camp1'] ?? tokens.colors.primary;
}

export function HomeScreen() {
  const firstName = mockUser.name.split(' ')[0];

  const renderCampaignCard = (campaign: Campaign, index: number, compact = false) => (
    <AnimatedCard index={index} key={campaign.id}>
      <RoundedCard
        testID={`campaign-card-${campaign.id}`}
        title={campaign.title}
        subtitle={campaign.brandName}
        coverColor={getCoverColor(campaign)}
        status={campaign.status}
        compact={compact}
        onPress={() => {}}
        style={compact ? styles.featuredCard : styles.gridCard}
      />
    </AnimatedCard>
  );

  return (
    <SafeAreaView testID="home-screen" style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Olá, {firstName}</Text>
            <Text style={styles.subtitle}>Suas campanhas de hoje</Text>
          </View>
          <View
            testID="home-avatar"
            style={[styles.avatar, { backgroundColor: PLACEHOLDER_COLORS.avatar }]}
          />
        </View>

        <View style={styles.metricsRow}>
          {mockMetrics.map(metric => (
            <MetricPill key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Em destaque</Text>
          <FlatList
            horizontal
            data={mockFeaturedCampaigns}
            keyExtractor={item => `featured-${item.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            renderItem={({ item, index }) => renderCampaignCard(item, index, true)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Campanhas recentes</Text>
          <FlatList
            data={mockCampaigns}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridList}
            renderItem={({ item, index }) => renderCampaignCard(item, index + 3)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.lg,
  },
  headerText: {
    flex: 1,
    gap: tokens.spacing.xs,
  },
  greeting: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
  },
  subtitle: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.lg,
    borderWidth: 2,
    borderColor: tokens.colors.accent,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  section: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    paddingHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  featuredList: {
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  featuredCard: {
    marginRight: tokens.spacing.sm,
  },
  gridList: {
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  gridRow: {
    gap: tokens.spacing.sm,
  },
  gridCard: {
    marginBottom: tokens.spacing.sm,
  },
  animatedCard: {
    flex: 1,
  },
});
