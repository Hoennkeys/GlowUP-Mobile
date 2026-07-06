import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../app/AuthProvider';
import { Avatar } from '../../components/ui/Avatar';
import { Routes } from '../../constants';
import { tokens } from '../../theme/tokens';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

// ─── Integration data ─────────────────────────────────────────────────────────

type IntegrationStatus = 'available' | 'coming_soon' | 'connected';

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  color: string;
  initials: string;
  status: IntegrationStatus;
}

const SOCIAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Mensagens e notificações',
    color: '#25D366',
    initials: 'WA',
    status: 'available',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Posts e métricas de engajamento',
    color: '#E1306C',
    initials: 'IG',
    status: 'available',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Comunidade e notificações',
    color: '#5865F2',
    initials: 'DC',
    status: 'available',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Mensagens e automações via bot',
    color: '#0088CC',
    initials: 'TG',
    status: 'available',
  },
];

const DOCUMENT_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'contracts',
    name: 'Contratos',
    description: 'Gerencie e assine contratos',
    color: '#F59E0B',
    initials: 'CT',
    status: 'available',
  },
  {
    id: 'certificates',
    name: 'Certificados Digitais',
    description: 'Armazene seus certificados',
    color: '#10B981',
    initials: 'CD',
    status: 'available',
  },
  {
    id: 'signatures',
    name: 'Assinaturas Digitais',
    description: 'Assine documentos com validade jurídica',
    color: '#7C3AED',
    initials: 'AD',
    status: 'available',
  },
];

const PRODUCTIVITY_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'kanban',
    name: 'Kanban / Trello',
    description: 'Gerencie projetos e tarefas',
    color: '#0052CC',
    initials: 'KB',
    status: 'coming_soon',
  },
  {
    id: 'google_calendar',
    name: 'Google Agenda',
    description: 'Sincronize compromissos e eventos',
    color: '#4285F4',
    initials: 'GA',
    status: 'coming_soon',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={cardStyles.wrapper}>
      <View style={cardStyles.titleRow}>
        <Text style={cardStyles.title}>{title}</Text>
        {subtitle ? <Text style={cardStyles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={cardStyles.card}>{children}</View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: tokens.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.xs,
  },
  title: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  subtitle: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
  },
  card: {
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    overflow: 'hidden',
  },
});

function IntegrationRow({
  item,
  isLast,
  onPress,
}: {
  item: IntegrationItem;
  isLast: boolean;
  onPress: () => void;
}) {
  const statusLabel =
    item.status === 'connected'
      ? 'Conectado'
      : item.status === 'coming_soon'
      ? 'Em breve'
      : 'Conectar';

  const statusStyle =
    item.status === 'connected'
      ? rowStyles.badgeConnected
      : item.status === 'coming_soon'
      ? rowStyles.badgeSoon
      : rowStyles.badgeAvailable;

  const statusTextStyle =
    item.status === 'connected'
      ? rowStyles.badgeTextConnected
      : item.status === 'coming_soon'
      ? rowStyles.badgeTextSoon
      : rowStyles.badgeTextAvailable;

  return (
    <>
      <TouchableOpacity
        style={rowStyles.row}
        onPress={onPress}
        activeOpacity={item.status === 'coming_soon' ? 1 : 0.7}
        disabled={item.status === 'coming_soon'}>
        <View style={[rowStyles.icon, { backgroundColor: item.color + '18' }]}>
          <Text style={[rowStyles.iconText, { color: item.color }]}>{item.initials}</Text>
        </View>
        <View style={rowStyles.info}>
          <Text style={rowStyles.name}>{item.name}</Text>
          <Text style={rowStyles.description}>{item.description}</Text>
        </View>
        <View style={[rowStyles.badge, statusStyle]}>
          <Text style={[rowStyles.badgeText, statusTextStyle]}>{statusLabel}</Text>
        </View>
      </TouchableOpacity>
      {!isLast && <View style={rowStyles.separator} />}
    </>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
  },
  name: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeAvailable: {
    backgroundColor: tokens.colors.primary + '15',
  },
  badgeSoon: {
    backgroundColor: tokens.colors.border,
  },
  badgeConnected: {
    backgroundColor: tokens.colors.success + '18',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badgeTextAvailable: {
    color: tokens.colors.primary,
  },
  badgeTextSoon: {
    color: tokens.colors.muted,
  },
  badgeTextConnected: {
    color: tokens.colors.success,
  },
  separator: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginLeft: 44 + tokens.spacing.md * 2,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function ProfileScreen({ navigation }: Props) {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={tokens.colors.primary} />
      </View>
    );
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // error is surfaced via AuthContext
    }
  }

  function handleIntegrationPress(item: IntegrationItem) {
    if (item.status === 'coming_soon') return;
    Alert.alert(
      `Conectar ${item.name}`,
      'Esta integração será implementada em breve.',
      [{ text: 'OK' }],
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Avatar uri={user?.avatarUrl} name={user?.name} size={96} />
          <Text style={styles.userName}>{user?.name ?? '—'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? '—'}</Text>
          {user?.bio ? <Text style={styles.userBio}>{user.bio}</Text> : null}

          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate(Routes.EditProfile)}
              activeOpacity={0.8}>
              <Text style={styles.editBtnText}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.8}>
              <Text style={styles.logoutBtnText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Integrações sociais ── */}
        <SectionCard title="Integrações" subtitle="Conecte seus canais">
          {SOCIAL_INTEGRATIONS.map((item, index) => (
            <IntegrationRow
              key={item.id}
              item={item}
              isLast={index === SOCIAL_INTEGRATIONS.length - 1}
              onPress={() => handleIntegrationPress(item)}
            />
          ))}
        </SectionCard>

        {/* ── Documentos & Contratos ── */}
        <SectionCard title="Documentos" subtitle="Contratos e certificados">
          {DOCUMENT_INTEGRATIONS.map((item, index) => (
            <IntegrationRow
              key={item.id}
              item={item}
              isLast={index === DOCUMENT_INTEGRATIONS.length - 1}
              onPress={() => handleIntegrationPress(item)}
            />
          ))}
        </SectionCard>

        {/* ── Produtividade ── */}
        <SectionCard title="Produtividade" subtitle="Em breve">
          {PRODUCTIVITY_INTEGRATIONS.map((item, index) => (
            <IntegrationRow
              key={item.id}
              item={item}
              isLast={index === PRODUCTIVITY_INTEGRATIONS.length - 1}
              onPress={() => handleIntegrationPress(item)}
            />
          ))}
        </SectionCard>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surface,
  },
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    backgroundColor: tokens.colors.bg,
  },
  headerTitle: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
  },
  content: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xxl,
  },

  // Hero
  hero: {
    alignItems: 'center',
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    paddingVertical: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  userName: {
    ...tokens.typography.h1,
    color: tokens.colors.text,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.xs,
  },
  userEmail: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
  },
  userBio: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    textAlign: 'center',
    marginTop: tokens.spacing.sm,
  },
  heroActions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.lg,
    width: '100%',
  },
  editBtn: {
    flex: 1,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.lg,
  },
  editBtnText: {
    ...tokens.typography.body,
    color: tokens.colors.bg,
    fontWeight: '600',
    fontSize: 14,
  },
  logoutBtn: {
    flex: 1,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  logoutBtnText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    fontWeight: '600',
    fontSize: 14,
  },
});
