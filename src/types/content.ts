export type ContentType = 'post' | 'story' | 'reel' | 'video';

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface ContentItem {
  id: string;
  influencerId: string;
  campaignId?: string;
  type: ContentType;
  title?: string;
  caption?: string;
  mediaUrl?: string;
  status: ContentStatus;
  publishedAt?: string;
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
}
