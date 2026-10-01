export interface Product {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  note: string;
  externalLink?: string;
  material: string;
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
