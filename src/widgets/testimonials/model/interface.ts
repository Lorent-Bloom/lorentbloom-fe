import type { ReviewWithProduct } from "@entities/product-review";

export interface TestimonialsProps {
  className?: string;
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
