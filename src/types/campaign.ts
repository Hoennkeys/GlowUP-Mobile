export type CampaignStatus =
  | 'draft'
  | 'open'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Campaign {
  id: string;
  brandName: string;
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  status: CampaignStatus;
  requirements?: string[];
  coverImageUrl?: string;
}

export interface CampaignApplication {
  id: string;
  campaignId: string;
  influencerId: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}
