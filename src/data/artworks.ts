export interface Artwork {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  medium: string;
  image: string;
  price: number;
  forSale: boolean;
  /** Stripe Payment Link URL – create at dashboard.stripe.com/payment-links */
  stripeLink: string;
  sold: boolean;
}

export const artworks: Artwork[] = [
  {
    id: 1,
    slug: "yggdrasil",
    title: "Yggdrasil",
    subtitle: "The World Tree",
    description:
      "The World Tree Yggdrasil sustains the entire cosmos. The eagle Hræsvelgr perches at the crown, the squirrel Ratatöskr scurries along the trunk, and the dragon Níðhöggr gnaws at the roots. A runic band spirals around the entire piece, carrying text from the Elder Edda.",
    medium: "Acrylic on wood",
    image: "/images/01-yggdrasil.png",
    price: 3800,
    forSale: true,
    stripeLink: "#stripe-yggdrasil",
    sold: true,
  },
  {
    id: 2,
    slug: "tvenne-ormar",
    title: "Two Serpents",
    subtitle: "Urnes style on green",
    description:
      "Two serpents in classic Urnes style coil around each other against a deep green background. The red and the golden serpent form an ever-returning flow – life and death as one. Runic inscription runs along the body.",
    medium: "Acrylic and pyrography on wood",
    image: "/images/02-tvenne-ormar.png",
    price: 2200,
    forSale: true,
    stripeLink: "#stripe-tvenne-ormar",
    sold: true,
  },
  {
    id: 3,
    slug: "drakrunsten",
    title: "Dragon Runestone",
    subtitle: "Runestone in black",
    description:
      "A stylised runestone in black bearing a powerful dragon in red and gold. Inspired by authentic 11th-century runestones. The runic inscription winds along the dragon's body in a complex Viking Age interlace pattern.",
    medium: "Acrylic on wood panel in runestone shape",
    image: "/images/03-drakrunsten.png",
    price: 4500,
    forSale: true,
    stripeLink: "#stripe-drakrunsten",
    sold: true,
  },
  {
    id: 4,
    slug: "hjartormar",
    title: "Heart Serpents",
    subtitle: "Love in red and gold",
    description:
      "Two serpents intertwine to form a heart against a red background. The runic band carries a text on love and oath-binding drawn from the skaldic tradition. One of the more personal compositions in the collection.",
    medium: "Acrylic on wood",
    image: "/images/04-hjartormar.png",
    price: 1800,
    forSale: true,
    stripeLink: "#stripe-hjartormar",
    sold: true,
  },
  {
    id: 5,
    slug: "nidhogr",
    title: "Níðhöggr",
    subtitle: "The serpent eye in the dark",
    description:
      "The great world-serpent rests in the darkness, its glowing eye fixed outward. The composition draws on Völuspá's description of Níðhöggr at the end of time. The runic band encircles the piece in an unbroken ring.",
    medium: "Acrylic and pyrography on wood",
    image: "/images/05-nidhogr.png",
    price: 2600,
    forSale: true,
    stripeLink: "#stripe-nidhogr",
    sold: true,
  },
  {
    id: 6,
    slug: "tvahovdad",
    title: "Twin-Headed",
    subtitle: "Dragon in red and gold on black",
    description:
      "A twin-headed dragon coils in classic Viking Age style against a jet-black background. The red and golden lines form a complex pattern of knots and loops. Runic inscription runs along the body.",
    medium: "Acrylic on wood",
    image: "/images/06-tvahovdad.png",
    price: 2000,
    forSale: true,
    stripeLink: "#stripe-tvahovdad",
    sold: true,
  },
  {
    id: 7,
    slug: "kosmiskt-oga",
    title: "Cosmic Eye",
    subtitle: "From the blue depths",
    description:
      "A mystical composition in blue with a cosmic eye at its centre, surrounded by writhing forms and runes. The piece raises questions about sight, consciousness, and the hidden – themes deeply rooted in Norse mythology.",
    medium: "Acrylic on wood",
    image: "/images/07-kosmiskt-oga.png",
    price: 1900,
    forSale: true,
    stripeLink: "#stripe-kosmiskt-oga",
    sold: true,
  },
  {
    id: 8,
    slug: "stendrak",
    title: "Stone Dragon",
    subtitle: "Serpent and stone on green",
    description:
      "A serpent coils around a grey-black stone against a dark green background. The knotwork at the edges evokes the great runestone monuments. Among the more intimate and contemplative pieces in the collection.",
    medium: "Acrylic and pyrography on wood",
    image: "/images/08-stendrak.png",
    price: 2400,
    forSale: true,
    stripeLink: "#stripe-stendrak",
    sold: true,
  },
  {
    id: 9,
    slug: "fenrir",
    title: "Fenrir",
    subtitle: "The wolf on red",
    description:
      "Fenrir – the greatest foe of the Æsir and son of Loki – emerges in silver and grey against blood red. The shaped wooden panel reinforces the sense of a living creature breaking free from the frame. The runes carry his name and fate.",
    medium: "Acrylic on shaped wood panel",
    image: "/images/09-fenrir.png",
    price: 3200,
    forSale: true,
    stripeLink: "#stripe-fenrir",
    sold: true,
  },
  {
    id: 10,
    slug: "seidkona",
    title: "Seiðkona",
    subtitle: "The völva's vision",
    description:
      "A woman in a blue robe holds a staff, summoned forth by the serpent's runes. The motif draws on the völva figure of Völuspá – the seeress who sees beyond the limits of time. The runic band carries her prophecy.",
    medium: "Pyrography and acrylic on wood",
    image: "/images/10-seidkona.png",
    price: 2800,
    forSale: true,
    stripeLink: "#stripe-seidkona",
    sold: true,
  },
  {
    id: 11,
    slug: "hjortdraken",
    title: "The Antlered Dragon",
    subtitle: "Three bands in gold, red and blue",
    description:
      "A large composition in grey, red and blue featuring a dragon whose head bears antler-like horns. Three intertwined runic bands run through the piece. The motif alludes to the Celtic and Norse influences that converged during the Viking Age.",
    medium: "Acrylic on wood, large format",
    image: "/images/11-hjortdraken.png",
    price: 5500,
    forSale: true,
    stripeLink: "#stripe-hjortdraken",
    sold: true,
  },
  {
    id: 12,
    slug: "draupnir",
    title: "Draupnir",
    subtitle: "The ring-serpent",
    description:
      "A serpent with a glowing blue eye coils around Odin's gold ring Draupnir. The vivid red body against the black background creates a striking contrast. The runic band carries a text on eternal return.",
    medium: "Acrylic on wood",
    image: "/images/12-draupnir.png",
    price: 2600,
    forSale: true,
    stripeLink: "#stripe-draupnir",
    sold: true,
  },
  {
    id: 13,
    slug: "vikingataget",
    title: "The Viking Journey",
    subtitle: "Frieze with beasts and runes",
    description:
      "A long horizontal frieze with animals, interlace and runes in deep green and gold. One of the most detailed pieces in the collection – it tells of a journey. The animals are drawn from Eddic symbolism and move left to right in an endless procession.",
    medium: "Acrylic and pyrography on wood, long format",
    image: "/images/13-vikingataget.png",
    price: 4800,
    forSale: true,
    stripeLink: "#stripe-vikingataget",
    sold: true,
  },
  {
    id: 14,
    slug: "bla-ormflata",
    title: "Blue Serpent Braid",
    subtitle: "Two serpents on royal blue",
    description:
      "Two serpents – one green, one bone-white – intertwine against a deep blue background. The knotwork in the corners and the red eyes give the piece life and movement. The encircling runic band carries text from Hávamál.",
    medium: "Acrylic on wood",
    image: "/images/14-bla-ormflata.png",
    price: 2400,
    forSale: true,
    stripeLink: "#stripe-bla-ormflata",
    sold: true,
  },
];
