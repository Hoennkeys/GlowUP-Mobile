import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
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
import { useTranslation, LANGUAGES } from '../../i18n/LanguageContext';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = ['Perfil', 'Integrações', 'Documentos', 'Produtividade'] as const;
type TabKey = (typeof TABS)[number];

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
  { id: 'whatsapp', name: 'WhatsApp', description: 'Mensagens e notificações', color: '#25D366', initials: 'WA', status: 'available' },
  { id: 'instagram', name: 'Instagram', description: 'Posts e métricas de engajamento', color: '#E1306C', initials: 'IG', status: 'available' },
  { id: 'discord', name: 'Discord', description: 'Comunidade e notificações', color: '#5865F2', initials: 'DC', status: 'available' },
  { id: 'telegram', name: 'Telegram', description: 'Mensagens e automações via bot', color: '#0088CC', initials: 'TG', status: 'available' },
];

const DOCUMENT_INTEGRATIONS: IntegrationItem[] = [
  { id: 'contracts', name: 'Contratos', description: 'Gerencie e assine contratos', color: '#F59E0B', initials: 'CT', status: 'available' },
  { id: 'certificates', name: 'Certificados Digitais', description: 'Armazene seus certificados', color: '#10B981', initials: 'CD', status: 'available' },
  { id: 'signatures', name: 'Assinaturas Digitais', description: 'Assine com validade jurídica', color: '#7C3AED', initials: 'AD', status: 'available' },
];

const PRODUCTIVITY_INTEGRATIONS: IntegrationItem[] = [
  { id: 'kanban', name: 'Kanban / Trello', description: 'Gerencie projetos e tarefas', color: '#0052CC', initials: 'KB', status: 'coming_soon' },
  { id: 'google_calendar', name: 'Google Agenda', description: 'Sincronize compromissos e eventos', color: '#4285F4', initials: 'GA', status: 'coming_soon' },
];

// ─── Shared IntegrationRow ────────────────────────────────────────────────────

function IntegrationRow({
  item,
  isLast,
  onPress,
}: {
  item: IntegrationItem;
  isLast: boolean;
  onPress: () => void;
}) {
  const badgeLabel =
    item.status === 'connected' ? 'Conectado' :
    item.status === 'coming_soon' ? 'Em breve' : 'Conectar';

  const badgeStyle = [
    rowStyles.badge,
    item.status === 'connected' && rowStyles.badgeConnected,
    item.status === 'coming_soon' && rowStyles.badgeSoon,
    item.status === 'available' && rowStyles.badgeAvailable,
  ];
  const badgeTextStyle = [
    rowStyles.badgeText,
    item.status === 'connected' && rowStyles.badgeTextConnected,
    item.status === 'coming_soon' && rowStyles.badgeTextSoon,
    item.status === 'available' && rowStyles.badgeTextAvailable,
  ];

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
        <View style={badgeStyle}>
          <Text style={badgeTextStyle}>{badgeLabel}</Text>
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
  badgeAvailable: { backgroundColor: tokens.colors.primary + '15' },
  badgeSoon: { backgroundColor: tokens.colors.border },
  badgeConnected: { backgroundColor: tokens.colors.success + '18' },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badgeTextAvailable: { color: tokens.colors.primary },
  badgeTextSoon: { color: tokens.colors.muted },
  badgeTextConnected: { color: tokens.colors.success },
  separator: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginLeft: 44 + tokens.spacing.md * 2,
  },
});

// ─── Section header (inside tab content) ─────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={sectionStyles.header}>
      <Text style={sectionStyles.title}>{title}</Text>
      {subtitle ? <Text style={sectionStyles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  header: {
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.sm,
  },
  title: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  subtitle: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
    marginTop: 2,
  },
});

// ─── Tab content components ───────────────────────────────────────────────────

function PerfilTab({
  onEdit,
  onChangePassword,
  onChangeLanguage,
  onLogout,
  bio: _bio,
}: {
  onEdit: () => void;
  onChangePassword: () => void;
  onChangeLanguage: () => void;
  onLogout: () => void;
  bio?: string;
}) {
  const { t, language } = useTranslation();
  const currentLanguageLabel = LANGUAGES.find(l => l.code === language)?.label || 'Português (BR)';

  return (
    <>
      <SectionHeader title={t('account')} />
      <View style={tabContent.card}>
        <TouchableOpacity style={tabContent.menuRow} onPress={onEdit} activeOpacity={0.7}>
          <View style={[tabContent.menuIcon, { backgroundColor: tokens.colors.primary + '15' }]}>
            <Text style={[tabContent.menuIconText, { color: tokens.colors.primary }]}>✎</Text>
          </View>
          <View style={tabContent.menuInfo}>
            <Text style={tabContent.menuLabel}>{t('edit_profile')}</Text>
            <Text style={tabContent.menuDesc}>{t('edit_profile_desc')}</Text>
          </View>
          <Text style={tabContent.chevron}>›</Text>
        </TouchableOpacity>

        <View style={tabContent.separator} />

        <TouchableOpacity style={tabContent.menuRow} activeOpacity={0.7}
          onPress={onChangePassword}>
          <View style={[tabContent.menuIcon, { backgroundColor: '#F59E0B18' }]}>
            <Text style={[tabContent.menuIconText, { color: '#F59E0B' }]}>🔑</Text>
          </View>
          <View style={tabContent.menuInfo}>
            <Text style={tabContent.menuLabel}>{t('change_password')}</Text>
            <Text style={tabContent.menuDesc}>{t('change_password_desc')}</Text>
          </View>
          <Text style={tabContent.chevron}>›</Text>
        </TouchableOpacity>

        <View style={tabContent.separator} />

        <TouchableOpacity style={tabContent.menuRow} activeOpacity={0.7}
          onPress={() => Alert.alert('Notificações', 'Em breve.')}>
          <View style={[tabContent.menuIcon, { backgroundColor: '#5865F218' }]}>
            <Text style={[tabContent.menuIconText, { color: '#5865F2' }]}>🔔</Text>
          </View>
          <View style={tabContent.menuInfo}>
            <Text style={tabContent.menuLabel}>{t('notifications')}</Text>
            <Text style={tabContent.menuDesc}>{t('notifications_desc')}</Text>
          </View>
          <Text style={tabContent.chevron}>›</Text>
        </TouchableOpacity>

        <View style={tabContent.separator} />

        <TouchableOpacity style={tabContent.menuRow} activeOpacity={0.7}
          onPress={onChangeLanguage}>
          <View style={[tabContent.menuIcon, { backgroundColor: '#10B98118' }]}>
            <Text style={[tabContent.menuIconText, { color: '#10B981' }]}>🌐</Text>
          </View>
          <View style={tabContent.menuInfo}>
            <Text style={tabContent.menuLabel}>{t('language')}</Text>
            <Text style={tabContent.menuDesc}>{currentLanguageLabel}</Text>
          </View>
          <Text style={tabContent.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <SectionHeader title={t('session')} />
      <View style={tabContent.card}>
        <TouchableOpacity style={[tabContent.menuRow, tabContent.dangerRow]} onPress={onLogout} activeOpacity={0.7}>
          <View style={[tabContent.menuIcon, { backgroundColor: tokens.colors.error + '15' }]}>
            <Text style={[tabContent.menuIconText, { color: tokens.colors.error }]}>↩</Text>
          </View>
          <View style={tabContent.menuInfo}>
            <Text style={[tabContent.menuLabel, { color: tokens.colors.error }]}>{t('logout')}</Text>
            <Text style={tabContent.menuDesc}>{t('logout_desc')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

function IntegracoesTab({ onPress }: { onPress: (item: IntegrationItem) => void }) {
  return (
    <>
      <SectionHeader title="Redes Sociais" subtitle="Conecte seus canais de comunicação" />
      <View style={tabContent.card}>
        {SOCIAL_INTEGRATIONS.map((item, index) => (
          <IntegrationRow
            key={item.id}
            item={item}
            isLast={index === SOCIAL_INTEGRATIONS.length - 1}
            onPress={() => onPress(item)}
          />
        ))}
      </View>

      <SectionHeader title="Outras integrações" subtitle="Mais conexões em breve" />
      <View style={tabContent.card}>
        <View style={tabContent.comingSoonRow}>
          <Text style={tabContent.comingSoonText}>
            LinkedIn, YouTube, TikTok e mais plataformas serão adicionadas nas próximas versões.
          </Text>
        </View>
      </View>
    </>
  );
}

function DocumentosTab({ onPress }: { onPress: (item: IntegrationItem) => void }) {
  return (
    <>
      <SectionHeader title="Gestão de documentos" subtitle="Seus documentos em um só lugar" />
      <View style={tabContent.card}>
        {DOCUMENT_INTEGRATIONS.map((item, index) => (
          <IntegrationRow
            key={item.id}
            item={item}
            isLast={index === DOCUMENT_INTEGRATIONS.length - 1}
            onPress={() => onPress(item)}
          />
        ))}
      </View>

      <SectionHeader title="Sobre documentos" />
      <View style={tabContent.card}>
        <View style={tabContent.comingSoonRow}>
          <Text style={tabContent.comingSoonText}>
            Armazene, gerencie e assine contratos e certificados digitais com validade jurídica.
          </Text>
        </View>
      </View>
    </>
  );
}

function ProdutividadeTab({ onPress }: { onPress: (item: IntegrationItem) => void }) {
  return (
    <>
      <SectionHeader title="Gestão de projetos" subtitle="Organize seu trabalho" />
      <View style={tabContent.card}>
        {PRODUCTIVITY_INTEGRATIONS.map((item, index) => (
          <IntegrationRow
            key={item.id}
            item={item}
            isLast={index === PRODUCTIVITY_INTEGRATIONS.length - 1}
            onPress={() => onPress(item)}
          />
        ))}
      </View>

      <SectionHeader title="Em desenvolvimento" />
      <View style={tabContent.card}>
        <View style={tabContent.comingSoonRow}>
          <Text style={tabContent.comingSoonText}>
            Integração com Notion, Monday, Asana e outras ferramentas de produtividade chegam em breve.
          </Text>
        </View>
      </View>
    </>
  );
}

const tabContent = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    overflow: 'hidden',
    marginHorizontal: tokens.spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginLeft: 44 + tokens.spacing.md * 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  dangerRow: {},
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuIconText: {
    fontSize: 16,
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuDesc: {
    ...tokens.typography.caption,
    color: tokens.colors.muted,
  },
  chevron: {
    fontSize: 20,
    color: tokens.colors.muted,
    lineHeight: 24,
  },
  comingSoonRow: {
    padding: tokens.spacing.md,
  },
  comingSoonText: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function ProfileScreen({ navigation }: Props) {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('Perfil');
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={tokens.colors.primary} />
      </View>
    );
  }

  function handleTabPress(tab: TabKey, index: number) {
    setActiveTab(tab);
    Animated.spring(indicatorAnim, {
      toValue: index,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();
  }

  async function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try { await logout(); } catch { /* surfaced via context */ }
        },
      },
    ]);
  }

  function handleIntegrationPress(item: IntegrationItem) {
    Alert.alert(
      item.name,
      `Integração com ${item.name} será disponibilizada em breve.`,
      [{ text: 'OK' }],
    );
  }

  const TAB_WIDTH = 110;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Page header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      {/* ── Hero: always visible ── */}
      <View style={styles.hero}>
        <Avatar uri={user?.avatarUrl} name={user?.name} size={72} />
        <View style={styles.heroText}>
          <Text style={styles.userName} numberOfLines={1}>{user?.name ?? '—'}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>{user?.email ?? '—'}</Text>
        </View>
      </View>

      {/* ── Tab bar ── */}
      <View style={styles.tabBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}>
          {TABS.map((tab, index) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, { width: TAB_WIDTH }]}
                onPress={() => handleTabPress(tab, index)}
                activeOpacity={0.7}>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab}
                </Text>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.tabBarBorder} />
      </View>

      {/* ── Tab content ── */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {activeTab === 'Perfil' && (
          <PerfilTab
            bio={user?.bio}
            onEdit={() => navigation.navigate(Routes.EditProfile)}
            onChangePassword={() => navigation.navigate(Routes.ChangePassword)}
            onChangeLanguage={() => navigation.navigate(Routes.ChooseLanguage)}
            onLogout={handleLogout}
          />
        )}
        {activeTab === 'Integrações' && (
          <IntegracoesTab onPress={handleIntegrationPress} />
        )}
        {activeTab === 'Documentos' && (
          <DocumentosTab onPress={handleIntegrationPress} />
        )}
        {activeTab === 'Produtividade' && (
          <ProdutividadeTab onPress={handleIntegrationPress} />
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surface,
  },

  // Header
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

  // Hero
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  heroText: {
    flex: 1,
  },
  userName: {
    ...tokens.typography.h2,
    color: tokens.colors.text,
    marginBottom: 2,
  },
  userEmail: {
    ...tokens.typography.body,
    color: tokens.colors.muted,
    fontSize: 14,
  },

  // Tab bar
  tabBarWrapper: {
    backgroundColor: tokens.colors.bg,
  },
  tabBarContent: {
    paddingHorizontal: tokens.spacing.sm,
  },
  tabBarBorder: {
    height: 1,
    backgroundColor: tokens.colors.border,
  },
  tabItem: {
    paddingVertical: tokens.spacing.sm + 2,
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    ...tokens.typography.body,
    fontSize: 14,
    color: tokens.colors.muted,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: tokens.colors.primary,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    borderRadius: 2,
    backgroundColor: tokens.colors.primary,
  },

  // Content
  contentScroll: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  contentInner: {
    paddingBottom: tokens.spacing.xxl,
  },
});
