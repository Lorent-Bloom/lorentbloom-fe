import type { ReviewWithProduct } from "@entities/product-review";

export interface TestimonialsProps {
  className?: string;
  stats?: StatsData;
  reviews?: ReviewWithProduct[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface StatsData {
  productsCount: number;
  categoriesCount: number;
  ordersCount?: number;
  usersCount?: number;
}
