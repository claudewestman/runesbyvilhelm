export interface Artwork {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  translation: string;
  instagramId?: string;
  medium: string;
  image: string;
  /** Dimensions in centimeters */
  height?: number;
  width?: number;
  depth?: number;
  price: number;
  forSale: boolean;
  /** Stripe Payment Link URL – create at dashboard.stripe.com/payment-links */
  stripeLink?: string;
  sold: boolean;
}