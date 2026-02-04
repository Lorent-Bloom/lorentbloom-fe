export interface HomeHeroProps {
  className?: string;
  stats?: HeroStats;
}

export interface HeroStats {
  totalProducts: number;
  totalReviews: number;
  averageRating: number;
}
