
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  link: string;
  score: number;
  analyzedAt: string;
  favorite: boolean;
  category?: string;
  isBestSeller?: boolean;
  hasDiscount?: boolean;
  trendingRank?: number;
}

export interface Stats {
  totalAnalyzed: number;
  avgConversion: number;
  favoritesCount: number;
  topScore: number;
  estimatedCommission: number;
}

export interface SocialConfig {
  platform: 'instagram' | 'facebook' | 'whatsapp';
  autoPostEnabled: boolean;
  scheduleTime?: string;
}
