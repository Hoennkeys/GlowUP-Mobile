import type { Campaign } from '../../types';
import type { Influencer } from '../../types';

export const mockUser: Influencer = {
  id: 'user-1',
  name: 'Ana',
  email: 'ana@glowup.app',
  avatarUrl: undefined,
  bio: 'Creator de lifestyle e beleza',
  niche: 'Beleza',
  socialAccounts: [
    {
      platform: 'instagram',
      username: '@ana.creates',
      followers: 125000,
      engagementRate: 4.2,
    },
  ],
  createdAt: '2025-01-15T10:00:00Z',
};

export interface MetricItem {
  label: string;
  value: string;
}

export const mockMetrics: MetricItem[] = [
  { label: 'Alcance', value: '128K' },
  { label: 'Engajamento', value: '4.2%' },
  { label: 'Ganhos', value: 'R$ 12.4K' },
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    brandName: 'Glow Beauty',
    title: 'Verão Radiante',
    description: 'Campanha de skincare para o verão',
    budget: 3500,
    status: 'open',
    coverImageUrl: 'camp1',
  },
  {
    id: 'camp-2',
    brandName: 'FitLife',
    title: 'Desafio 30 Dias',
    description: 'Conteúdo fitness e bem-estar',
    budget: 5200,
    status: 'in_progress',
    coverImageUrl: 'camp2',
  },
  {
    id: 'camp-3',
    brandName: 'TechNova',
    title: 'Lançamento Pro X',
    description: 'Review do novo smartphone',
    budget: 8000,
    status: 'open',
    coverImageUrl: 'camp3',
  },
  {
    id: 'camp-4',
    brandName: 'Café Aroma',
    title: 'Morning Ritual',
    description: 'Stories matinais com café especial',
    budget: 1800,
    status: 'completed',
    coverImageUrl: 'camp1',
  },
  {
    id: 'camp-5',
    brandName: 'ModaViva',
    title: 'Coleção Outono',
    description: 'Lookbook para redes sociais',
    budget: 4500,
    status: 'open',
    coverImageUrl: 'camp2',
  },
  {
    id: 'camp-6',
    brandName: 'EcoHome',
    title: 'Casa Sustentável',
    description: 'Dicas de decoração eco-friendly',
    budget: 2900,
    status: 'draft',
    coverImageUrl: 'camp3',
  },
];

export const mockFeaturedCampaigns = mockCampaigns.slice(0, 3);

export const PLACEHOLDER_COLORS: Record<string, string> = {
  camp1: '#C4B5FD',
  camp2: '#F9A8D4',
  camp3: '#A78BFA',
  avatar: '#DDD6FE',
};
