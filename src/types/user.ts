export type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'other';

export interface SocialAccount {
  platform: SocialPlatform;
  username: string;
  followers: number;
  engagementRate?: number;
}

export interface Influencer {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  niche?: string;
  socialAccounts: SocialAccount[];
  createdAt: string;
}

export type User = Influencer;
