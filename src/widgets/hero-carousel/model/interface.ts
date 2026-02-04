export interface HeroCarouselProps {
  className?: string;
}

export interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
  cta?: {
    text: string;
    href: string;
  };
}
