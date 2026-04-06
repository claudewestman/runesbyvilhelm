export interface Artwork {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  translation: string;
  medium: string;
  image: string;
  price: number;
  forSale: boolean;
  /** Stripe Payment Link URL – create at dashboard.stripe.com/payment-links */
  stripeLink?: string;
  sold: boolean;
}